#!/usr/bin/env bash
# Optimize case-study hero images for SpotifyTagsPage and PlateMagazinePage.
#
# Why
#   The pages only show the hero at ~900px wide (about 1600px on 2x displays),
#   but the source files were much larger:
#     - spotify-media/hero.png  — 2928×896, 1.7MB
#     - plate-media/hero.svg    — 1160×360 SVG wrapping a 2048×1365 JPEG, 4.8MB
#   Opening either case study downloaded that full file on first paint.
#
# What this produces
#   Display-sized JPEGs (1600px wide, quality 80) checked into the repo:
#     - src/assets/work/spotify-media/hero-1600.jpg  (~81KB, 1600×489)
#     - src/assets/work/plate-media/hero-1600.jpg    (~89KB, 1600×496)
#   The pages import these files. The work page prefetches both while the
#   design filter is visible so navigation can reuse the browser cache.
#   Source files are left in place for regeneration.
#
# Usage
#   ./scripts/optimize-case-study-heroes.sh
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SPOTIFY_SRC="$ROOT/src/assets/work/spotify-media/hero.png"
SPOTIFY_OUT="$ROOT/src/assets/work/spotify-media/hero-1600.jpg"
PLATE_SRC="$ROOT/src/assets/work/plate-media/hero.svg"
PLATE_OUT="$ROOT/src/assets/work/plate-media/hero-1600.jpg"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
WIDTH=1600

sips --resampleWidth "$WIDTH" -s format jpeg -s formatOptions 80 \
  "$SPOTIFY_SRC" --out "$SPOTIFY_OUT"

if [[ ! -x "$CHROME" ]]; then
  echo "Chrome not found at $CHROME; cannot rasterize $PLATE_SRC" >&2
  exit 1
fi

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT
# 2× the SVG artboard (1160×360) so the JPEG still looks sharp at 1600px.
RASTER_W=2320
RASTER_H=720
cat > "$TMP_DIR/hero.html" <<EOF
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body { margin: 0; width: ${RASTER_W}px; height: ${RASTER_H}px; overflow: hidden; background: #fff; }
      img { display: block; width: ${RASTER_W}px; height: ${RASTER_H}px; }
    </style>
  </head>
  <body><img src="hero.svg" alt="" /></body>
</html>
EOF
cp "$PLATE_SRC" "$TMP_DIR/hero.svg"

"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --window-size="${RASTER_W},${RASTER_H}" \
  --screenshot="$TMP_DIR/hero.png" --virtual-time-budget=8000 \
  "file://${TMP_DIR}/hero.html"

sips --resampleWidth "$WIDTH" -s format jpeg -s formatOptions 80 \
  "$TMP_DIR/hero.png" --out "$PLATE_OUT"

ls -lh "$SPOTIFY_OUT" "$PLATE_OUT"
