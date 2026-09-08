# Hefler Dev

Personal portfolio — React + Vite SPA with a terminal / engineer-brutal aesthetic.

**Live:** https://heflerdev.github.io

## Stack

- React 19 + TypeScript + Vite
- Framer Motion (section motion)
- Matter.js (hero physics chips)
- GitHub Pages via `/docs` build output

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # writes production site to docs/
npm run preview
```

## Deploy (GitHub Pages)

The site is published from the **`docs/`** folder on `master`.

**One-time setup** (this is what was breaking before):

1. GitHub → **Settings → Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `master`
4. **Folder:** **`/docs`** ← not `/` (root)
5. Save

On every push to `master`, Actions rebuilds `docs/`. You can also run `npm run build` locally and commit `docs/`.

If Folder stays on `/` (root), GitHub serves the Vite *source* `index.html` and the browser errors on `/src/main.tsx`.
