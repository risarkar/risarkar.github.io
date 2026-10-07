# Update the portfolio

Open `src/data/portfolio.ts` in a code editor. The arrays in this file supply the visible content. Save the file and run `npm.cmd run dev -- --host 127.0.0.1 --port 8080` to see changes locally.

## Change your introduction or contact details

Edit `siteContent`. The three `heroTitle` parts let you change the headline while keeping the middle phrase in the theme color. `email` updates both email links. `linkedIn` and `github` update the contact links. Edit `education` and `community` in the same file.

## Add or remove a skill

Add an object to the `skills` array. The `id` must be unique and should stay short. For example:

```ts
{
  id: 'cloud-security',
  category: 'Security engineering',
  title: 'Cloud security',
  description: 'I review cloud permissions and test the controls that protect them.'
}
```

Use that ID in the `skills` list of a project, role, or credential. The site will automatically link the skill to those examples. You can remove a skill after removing its ID from all of those lists. The build will name any missing skill ID if you overlook one.

## Add or remove a project

Add an object to `projects`. The site numbers projects automatically. For example:

```ts
{
  id: 'project-cloud-audit',
  eyebrow: 'Independent project / cloud security',
  title: 'Finding risky cloud permissions.',
  summary: 'I examined access paths and documented the highest risk findings.',
  contribution: 'I built the test environment and reviewed the results.',
  outcome: 'The review produced a short list of fixes with clear owners.',
  skills: ['cloud-security'],
  visual: 'lab',
  links: [{ label: 'View the repository', href: 'https://github.com/risarkar/example' }]
}
```

Replace the example facts and URL with your own. `visual` is optional. If you omit it, the site uses the lab graphic. Other available styles are `malware`, `light`, and `lineage`. Use `links: []` when a project has no public link. Remove the entire object to remove a project. If a skill links only to that project, the skill stays visible without an example until you connect it to other work.

## Update experience or certifications

Add, edit, or remove objects in `experience` and `certifications`. Keep each `id` unique. Experience entries need a `details` list and a `skills` list. Credential entries need a public `url` for verification and a `skills` list. Use IDs from the `skills` array. These links appear automatically under the related skill.

## Update the résumé and preview the site

Replace `public/Rishiraj-Sarkar-Resume.pdf` with a public copy that omits your phone number. Keep the same filename so existing links work. Then run:

```powershell
npm.cmd run build
npm.cmd run check:ui
```

Review the site at desktop and phone widths. After the update looks right, commit and push to `main`. GitHub Actions will publish it.
