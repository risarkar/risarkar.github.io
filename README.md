# Rishiraj Sarkar portfolio

A static Astro portfolio for `https://risarkar.github.io`. The terminal is available in the hero. The skills section links directly to projects, experience, and credentials. The default theme is Wargames green. The other themes are cinematic red and warm paper with deep cerulean.

## Preview locally

Install Node.js 22.12 or newer. Open PowerShell in this folder and run:

```powershell
npm.cmd ci
npm.cmd run dev -- --host 127.0.0.1 --port 8080
```

Open `http://127.0.0.1:8080/`. Press `Ctrl+C` to stop the server. Use `npm.cmd` in PowerShell if its execution policy blocks the `npm.ps1` wrapper. This does not change your execution policy. The `--` passes the host and port options to Astro.

For a phone or tablet on the same Wi-Fi network, run `npm.cmd run dev -- --host 0.0.0.0 --port 8080`. Find your computer's local IPv4 address with `ipconfig`, then open `http://YOUR-LOCAL-IP:8080/` on the device. Your firewall may ask you to allow the connection.

## Make updates

Open [EDITING.md](EDITING.md) for copyable examples. Most public information lives in `src/data/portfolio.ts`. Update its `siteContent`, `skills`, `certifications`, `experience`, `projects`, `education`, and `community` entries. Project numbers and skill evidence links are generated automatically. You can add or remove entries without editing the page layout.

Replace `public/Rishiraj-Sarkar-Resume.pdf` when your résumé changes. The current public copy omits your phone number. Check any replacement before publishing it.

After editing, run:

```powershell
npm.cmd run build
npm.cmd run check:ui
```

The browser check uses local Chrome and saves screenshots and an accessibility report to `.previews/`. Set `CHROME_PATH` if Chrome is installed elsewhere.

## Publish to GitHub Pages

1. Review the local site and all public content. The website is public even if the repository is private. [GitHub explains Pages visibility and plan requirements](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).
2. Clone `https://github.com/risarkar/risarkar.github.io.git` if you do not already have a local clone.
3. Copy the contents of the `portfolio-site` folder from `portfolio-site-source.zip` into the root of the clone. Include `.github/workflows/deploy.yml`, `src`, `public`, `scripts`, `package.json`, `package-lock.json`, `astro.config.mjs`, and the guide files. Review any files already in your repository before replacing them. Do not copy `node_modules`, `dist`, `.astro`, or `.previews`.
4. In PowerShell, open the clone and run `npm.cmd ci`, then `npm.cmd run build`. Run `git status` to review the changes.
5. Commit and push the source to `main` with `git add -A`, `git commit -m "Launch portfolio"`, and `git push origin main`.
6. In the repository's **Settings > Pages**, set **Build and deployment > Source** to **GitHub Actions**. The included workflow builds and deploys on pushes to `main`. [Astro's deployment guide](https://docs.astro.build/en/guides/deploy/github/) shows this setup.
7. Open the **Actions** tab and wait for the deployment to finish. Then visit `https://risarkar.github.io/` and check the terminal, themes, links, and résumé.

Later changes to the source on `main` will trigger the same deployment workflow. This is a profile site at the domain root, so Astro does not need a `base` path.
