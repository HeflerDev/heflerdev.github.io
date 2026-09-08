# Hefler Dev

Personal portfolio — React + Vite SPA with a terminal / engineer-brutal aesthetic.

**Live:** https://heflerdev.github.io

## Stack

- React 19 + TypeScript + Vite
- Framer Motion (section motion)
- Matter.js (hero physics chips)
- GitHub Pages via Actions

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

Deploy runs automatically on push to `master` (`.github/workflows/deploy.yml`).

**Required once** in the repo on GitHub:

1. **Settings → Pages → Build and deployment → Source** → choose **GitHub Actions** (not “Deploy from a branch”).
2. Open **Actions**, run **Deploy to GitHub Pages** (or push again).
3. Wait for the green check, then hard-refresh https://heflerdev.github.io

If Source stays on the `master` branch, GitHub serves the Vite *source* `index.html` (`/src/main.tsx`) and the browser blocks it (MIME error).

