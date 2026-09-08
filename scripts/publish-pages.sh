#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# Restore Vite entry (source), then build into docs/
cp index.source.html index.html
npm run build --silent 2>/dev/null || npm run build

# Publish built files at repo root so GitHub Pages (branch /) works
rm -rf assets
cp docs/index.html index.html
cp -R docs/assets assets
cp docs/favicon.svg favicon.svg
cp docs/.nojekyll .nojekyll
rm -rf images
cp -R docs/images images

echo "Published docs/ → repo root (index.html, assets/, images/)"
