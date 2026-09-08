# Hefler Dev

Personal portfolio — React + Vite SPA with a terminal / engineer-brutal aesthetic.

**Live:** https://heflerdev.github.io

## Stack

- React 19 + TypeScript + Vite
- Framer Motion · Matter.js
- GitHub Pages (production files at repo root)

## Develop

```bash
npm install
npm run dev
```

`index.source.html` is the Vite entry. `npm run build` writes `docs/` and also copies the production site to the repo root (`index.html`, `assets/`, `images/`) so Pages can serve from branch `master` / `.`

## Build / publish

```bash
npm run build
```

Commit the updated root `index.html` + `assets/` + `images/` (or let Actions do it on push to `master`).
