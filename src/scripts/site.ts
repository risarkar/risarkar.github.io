type Theme = 'signal' | 'paper' | 'phosphor'
const themeStorageKey = 'portfolio-theme-v2'

const themeNames: Record<Theme, string> = {
  signal: 'Cinematic red',
  paper: 'Warm paper',
  phosphor: 'Wargames green'
}

const themeColors: Record<Theme, string> = {
  signal: '#0c0e12',
  paper: '#f5f0e2',
  phosphor: '#101614'
}

const isTheme = (value: string | null): value is Theme => value === 'signal' || value === 'paper' || value === 'phosphor'

function applyTheme(theme: Theme, save = true) {
  document.documentElement.dataset.theme = theme
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', themeColors[theme])
  document.querySelectorAll<HTMLButtonElement>('[data-set-theme]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.setTheme === theme))
  })
  if (save) {
    try { localStorage.setItem(themeStorageKey, theme) } catch { /* Storage can be unavailable. */ }
  }
}

try {
  const savedTheme = localStorage.getItem(themeStorageKey)
  if (isTheme(savedTheme)) applyTheme(savedTheme, false)
} catch { /* The default theme remains available. */ }

document.querySelectorAll<HTMLButtonElement>('[data-set-theme]').forEach((button) => {
  button.addEventListener('click', () => {
    const theme = button.dataset.setTheme
    if (!isTheme(theme ?? null)) return
    applyTheme(theme)
    button.closest('details')?.removeAttribute('open')
  })
})

document.querySelectorAll<HTMLAnchorElement>('.mobile-menu nav a').forEach((link) => {
  link.addEventListener('click', () => link.closest('details')?.removeAttribute('open'))
})

const palette = document.querySelector<HTMLDialogElement>('#command-dialog')
const paletteSearch = document.querySelector<HTMLInputElement>('#command-search')
const paletteResults = document.querySelector<HTMLElement>('#command-results')
const terminalInput = document.querySelector<HTMLInputElement>('#terminal-input')
const terminalOutput = document.querySelector<HTMLElement>('#terminal-output')
let lastTrigger: HTMLElement | null = null
let activeCommand = 0

function openDialog(dialog: HTMLDialogElement | null, input: HTMLInputElement | null, trigger?: HTMLElement | null) {
  if (!dialog) return
  lastTrigger = trigger ?? document.activeElement as HTMLElement
  document.querySelector('.mobile-menu')?.removeAttribute('open')
  if (palette?.open && dialog !== palette) palette.close()
  if (!dialog.open) dialog.showModal()
  requestAnimationFrame(() => input?.focus())
}

function closeDialog(dialog: HTMLDialogElement | null) {
  if (!dialog?.open) return
  dialog.close()
  lastTrigger?.focus()
}

const commands: { label: string; hint: string; search: string; run: () => void }[] = [
  { label: 'Explore skills', hint: 'Section', search: 'skills capabilities', run: () => goTo('skills') },
  { label: 'Read experience', hint: 'Section', search: 'experience career work', run: () => goTo('experience') },
  { label: 'View projects', hint: 'Section', search: 'projects work portfolio', run: () => goTo('projects') },
  { label: 'See education and community', hint: 'Section', search: 'about education community', run: () => goTo('about') },
  { label: 'Get in touch', hint: 'Section', search: 'contact email', run: () => goTo('contact') },
  { label: 'Download résumé', hint: 'PDF', search: 'resume cv download', run: () => { window.location.href = '/Rishiraj-Sarkar-Resume.pdf' } },
  { label: 'Use the terminal', hint: 'Interactive', search: 'terminal console', run: () => { goTo('terminal'); terminalInput?.focus({ preventScroll: true }) } },
  { label: 'Use cinematic red', hint: 'Theme', search: 'red signal theme', run: () => applyTheme('signal') },
  { label: 'Use warm paper', hint: 'Theme', search: 'light paper theme', run: () => applyTheme('paper') },
  { label: 'Use Wargames green', hint: 'Theme', search: 'green phosphor theme', run: () => applyTheme('phosphor') }
]

function goTo(id: string) {
  closeDialog(palette)
  const target = document.getElementById(id)
  if (target) {
    history.replaceState(null, '', `#${id}`)
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
    target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }
}

function filteredCommands() {
  const query = (paletteSearch?.value ?? '').trim().toLowerCase()
  return commands.filter((command) => `${command.label} ${command.search}`.toLowerCase().includes(query))
}

function renderCommands() {
  if (!paletteResults) return
  const filtered = filteredCommands()
  activeCommand = Math.min(activeCommand, Math.max(0, filtered.length - 1))
  paletteResults.replaceChildren()
  if (!filtered.length) {
    const empty = document.createElement('p')
    empty.className = 'command-empty'
    empty.textContent = 'No matching action. Try a section name or theme.'
    paletteResults.append(empty)
    return
  }
  filtered.forEach((command, index) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = index === activeCommand ? 'is-active' : ''
    button.innerHTML = `<span aria-hidden="true">↗</span><span></span><span></span>`
    button.children[1].textContent = command.label
    button.children[2].textContent = command.hint
    button.addEventListener('mouseenter', () => { activeCommand = index; updateActiveCommand() })
    button.addEventListener('click', () => { command.run(); if (palette?.open) closeDialog(palette) })
    paletteResults.append(button)
  })
}

function updateActiveCommand() {
  paletteResults?.querySelectorAll('button').forEach((button, index) => button.classList.toggle('is-active', index === activeCommand))
}

document.querySelectorAll<HTMLButtonElement>('[data-open-palette]').forEach((button) => button.addEventListener('click', () => {
  if (paletteSearch) paletteSearch.value = ''
  activeCommand = 0
  renderCommands()
  openDialog(palette, paletteSearch, button)
}))

document.querySelectorAll<HTMLButtonElement>('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => closeDialog(button.closest('dialog'))))

paletteSearch?.addEventListener('input', () => { activeCommand = 0; renderCommands() })
paletteSearch?.addEventListener('keydown', (event) => {
  const filtered = filteredCommands()
  if (event.key === 'ArrowDown') { event.preventDefault(); activeCommand = Math.min(activeCommand + 1, filtered.length - 1); updateActiveCommand() }
  if (event.key === 'ArrowUp') { event.preventDefault(); activeCommand = Math.max(activeCommand - 1, 0); updateActiveCommand() }
  if (event.key === 'Enter' && filtered[activeCommand]) { event.preventDefault(); filtered[activeCommand].run(); if (palette?.open) closeDialog(palette) }
})

document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    if (palette?.open) closeDialog(palette)
    else {
      if (paletteSearch) paletteSearch.value = ''
      activeCommand = 0
      renderCommands()
      openDialog(palette, paletteSearch)
    }
  }
})

function addTerminalLine(text: string, className = '') {
  if (!terminalOutput) return
  const line = document.createElement('p')
  line.textContent = text
  if (className) line.className = className
  terminalOutput.append(line)
  terminalOutput.scrollTop = terminalOutput.scrollHeight
}

function runTerminalCommand(raw: string) {
  const command = raw.trim().toLowerCase().replace(/\s+/g, ' ')
  if (!command) return
  addTerminalLine(`$ ${raw.trim()}`, 'terminal-command-line')
  const destinations: Record<string, string> = { skills: 'skills', experience: 'experience', work: 'projects', projects: 'projects', about: 'about', contact: 'contact' }
  if (command === 'help') addTerminalLine('Commands: skills, experience, work, about, contact, resume, theme red, theme light, theme green, clear.')
  else if (command in destinations) { addTerminalLine(`Opening ${destinations[command]}.`); window.setTimeout(() => goTo(destinations[command]), 180) }
  else if (command === 'resume') { addTerminalLine('Opening the résumé PDF.'); window.location.href = '/Rishiraj-Sarkar-Resume.pdf' }
  else if (command === 'theme' || command === 'themes') addTerminalLine('Choose a theme with: theme red, theme light, or theme green.')
  else if (command.startsWith('theme ')) {
    const alias = command.slice(6)
    const theme: Theme | null = alias === 'red' || alias === 'signal' ? 'signal' : alias === 'light' || alias === 'paper' ? 'paper' : alias === 'green' || alias === 'phosphor' ? 'phosphor' : null
    if (theme) { applyTheme(theme); addTerminalLine(`${themeNames[theme]} is active.`) }
    else addTerminalLine('I do not know that theme. Try red, light, or green.')
  }
  else if (command === 'clear') terminalOutput?.replaceChildren()
  else addTerminalLine('Unknown command. Type help to see the available shortcuts.')
}

document.querySelector<HTMLFormElement>('#terminal-form')?.addEventListener('submit', (event) => {
  event.preventDefault()
  const value = terminalInput?.value ?? ''
  if (terminalInput) terminalInput.value = ''
  runTerminalCommand(value)
})

document.querySelectorAll<HTMLButtonElement>('[data-terminal-command]').forEach((button) => {
  button.addEventListener('click', () => { runTerminalCommand(button.dataset.terminalCommand ?? ''); terminalInput?.focus() })
})

renderCommands()
