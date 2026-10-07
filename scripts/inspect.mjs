import { createServer } from 'node:http'
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright-core'
import AxeBuilder from '@axe-core/playwright'

const root = path.resolve('dist')
const previewDir = path.resolve(process.env.PREVIEW_DIR || '.previews')
const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.pdf': 'application/pdf',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.png': 'image/png'
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || '/', 'http://localhost')
  const pathname = decodeURIComponent(url.pathname)
  const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`)
  if (!file.startsWith(root + path.sep) && file !== root) { response.writeHead(403).end(); return }
  try {
    const fileStat = await stat(file)
    const target = fileStat.isDirectory() ? path.join(file, 'index.html') : file
    const body = await readFile(target)
    response.writeHead(200, { 'content-type': mime[path.extname(target)] || 'application/octet-stream' })
    response.end(body)
  } catch { response.writeHead(404).end('Not found') }
})

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const address = server.address()
const base = `http://127.0.0.1:${address.port}`
await mkdir(previewDir, { recursive: true })

const report = { server: base, viewports: [], axe: {}, interactions: {}, errors: [] }
let browser
try {
  browser = await chromium.launch({ executablePath: chromePath, headless: true, args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'], chromiumSandbox: false })
  const sizes = [
    ['narrow-phone', 320, 720], ['android-phone', 360, 800], ['iphone', 390, 844],
    ['split-screen', 560, 700], ['fold-inner', 673, 920], ['phone-landscape', 844, 390],
    ['tablet', 820, 1180], ['small-desktop', 1024, 768], ['desktop', 1440, 960]
  ]
  for (const [name, width, height] of sizes) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 })
    const page = await context.newPage()
    const pageErrors = []
    page.on('pageerror', (error) => pageErrors.push(error.message))
    await page.goto(base, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    const metrics = await page.evaluate(() => ({
      innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      heroTitle: document.querySelector('h1')?.getBoundingClientRect().width,
      headlineLineClipped: Array.from(document.querySelectorAll('#hero-title > *')).some((line) => line.scrollWidth > line.clientWidth + 1),
      headlineStacked: Array.from(document.querySelectorAll('#hero-title > *')).every((line, index, lines) => index === 0 || line.getBoundingClientRect().top >= lines[index - 1].getBoundingClientRect().bottom - 1),
      forbidden: ['\u2014', '\u2013', ';'].filter((character) => document.body.innerText.includes(character)),
      missingAnchors: Array.from(document.querySelectorAll('a[href^="#"]')).map((link) => link.getAttribute('href').slice(1)).filter((id) => id && !document.getElementById(id))
    }))
    report.viewports.push({ name, width, height, ...metrics, pageErrors })
    if (name === 'desktop' || name === 'iphone' || name === 'narrow-phone') {
      await page.screenshot({ path: path.join(previewDir, `${name}-hero.png`) })
      await page.screenshot({ path: path.join(previewDir, `${name}-full.png`), fullPage: true })
      await page.locator('.skill-card').first().screenshot({ path: path.join(previewDir, `${name}-skill.png`) })
      await page.locator('#project-malware').screenshot({ path: path.join(previewDir, `${name}-project.png`) })
    }
    if (name === 'desktop' || name === 'iphone') {
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
      report.axe[name] = axe.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target) }))
      if (name === 'desktop') {
        for (const theme of ['paper', 'phosphor']) {
          await page.locator('.theme-picker summary').click()
          await page.locator(`[data-set-theme="${theme}"]`).click()
          await page.waitForTimeout(300)
          const themedAxe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
          report.axe[theme] = themedAxe.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target) }))
          await page.locator('.hero').screenshot({ path: path.join(previewDir, `${theme}-hero.png`) })
        }
      }
    }
    await context.close()
  }

  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  await page.goto(base, { waitUntil: 'networkidle' })
  report.interactions.headlineExact = (await page.locator('h1').innerText()).replace(/\s+/g, ' ').trim() === 'Your system. I Secure it. Simple!'
  report.interactions.noAstroToolbar = await page.locator('astro-dev-toolbar').count() === 0
  report.interactions.defaultTheme = await page.evaluate(() => document.documentElement.dataset.theme === 'phosphor')
  report.interactions.skillEvidence = await page.locator('#skill-ml-detection .skill-evidence a[href="#project-malware"]').count() === 1
  report.interactions.inlineTerminal = await page.locator('.hero #terminal #terminal-input').isVisible()
  report.interactions.mobileTerminalInFirstView = await page.locator('#terminal-input').evaluate((input) => input.getBoundingClientRect().bottom <= window.innerHeight)
  await page.locator('#terminal-input').fill('help')
  await page.locator('#terminal-input').press('Enter')
  report.interactions.terminalHelp = (await page.locator('#terminal-output').innerText()).includes('Commands: skills')
  await page.locator('.theme-picker summary').click()
  await page.locator('[data-set-theme="paper"]').click()
  report.interactions.themeSwitch = await page.evaluate(() => document.documentElement.dataset.theme === 'paper' && localStorage.getItem('portfolio-theme-v2') === 'paper')
  await page.reload({ waitUntil: 'networkidle' })
  report.interactions.themePersists = await page.evaluate(() => document.documentElement.dataset.theme === 'paper')
  await page.locator('.mobile-menu summary').click()
  report.interactions.mobileMenu = await page.locator('.mobile-menu nav a[href="#projects"]').isVisible()
  report.interactions.mobileTerminalLink = await page.locator('.mobile-menu nav a[href="#terminal"]').count() === 1
  await page.locator('.mobile-menu nav [data-open-palette]').click()
  report.interactions.paletteOpens = await page.locator('#command-dialog').evaluate((el) => el.open)
  await page.locator('#command-search').fill('projects')
  report.interactions.paletteSearch = (await page.locator('#command-results').innerText()).includes('View projects')
  await page.close()

  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 960 } })
  const desktop = await desktopContext.newPage()
  await desktop.goto(base, { waitUntil: 'networkidle' })
  await desktop.keyboard.press('Control+k')
  report.interactions.keyboardPalette = await desktop.locator('#command-dialog').evaluate((el) => el.open)
  const paletteAxe = await new AxeBuilder({ page: desktop }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  report.axe.palette = paletteAxe.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target) }))
  await desktop.keyboard.press('Escape')
  report.interactions.escapeCloses = await desktop.locator('#command-dialog').evaluate((el) => !el.open)
  for (const id of ['skills', 'experience', 'projects', 'about', 'contact']) {
    await desktop.locator(`.desktop-nav a[href="#${id}"]`).click()
    await desktop.waitForFunction((sectionId) => {
      const section = document.getElementById(sectionId)
      const header = document.querySelector('.site-header')
      return section && header && Math.abs(section.getBoundingClientRect().top - header.getBoundingClientRect().height) < 4
    }, id, { timeout: 2500 })
    report.interactions[`navAligns${id}`] = true
  }
  await desktopContext.close()

  const noJsContext = await browser.newContext({ viewport: { width: 320, height: 720 }, javaScriptEnabled: false })
  const noJsPage = await noJsContext.newPage()
  await noJsPage.goto(base)
  await noJsPage.locator('.mobile-menu summary').click()
  report.interactions.noJsMenu = await noJsPage.locator('.mobile-menu nav a[href="#projects"]').isVisible()
  report.interactions.noJsEvidence = await noJsPage.locator('.skill-evidence a').count() > 0
  await noJsContext.close()
} catch (error) {
  report.errors.push(String(error?.stack || error))
} finally {
  await browser?.close()
  server.close()
}

await writeFile(path.join(previewDir, 'report.json'), JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
if (report.errors.length || report.viewports.some((item) => item.documentWidth > item.innerWidth || item.bodyWidth > item.innerWidth || item.headlineLineClipped || !item.headlineStacked || item.pageErrors.length || item.forbidden.length || item.missingAnchors.length) || Object.values(report.axe).some((items) => items.length) || Object.values(report.interactions).some((passed) => !passed)) process.exitCode = 1
