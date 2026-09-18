#!/usr/bin/env bash
# Generate display-sized JPEGs for case-study and work-card stills.
#
# First visit is slow because the browser cache is empty: every <img> is a
# network download. These sources were far larger than they appear on screen
# (2MB PNGs shown at ~200px, 4.8MB SVGs on a 360px card). After this script,
# pages import the JPEGs instead. The work page prefetches them so opening a
# case study can reuse the HTTP cache. Animated SVGs (tag_animation) are left
# alone — flattening them would drop the motion.
#
# Usage: npm run optimize-images
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
QUALITY=80

jpeg_from_raster() {
  local src="$1" dest="$2" width="$3"
  sips --resampleWidth "$width" -s format jpeg -s formatOptions "$QUALITY" \
    "$src" --out "$dest" >/dev/null
}

svg_to_jpeg() {
  local src="$1" dest="$2" width="$3"
  local art_w art_h raster_w raster_h
  art_w="$(python3 - "$src" <<'PY'
import re, sys
text = open(sys.argv[1], errors="ignore").read(4000)
m = re.search(r'viewBox="0 0 ([0-9.]+) ([0-9.]+)"', text)
if m:
    print(int(float(m.group(1))), int(float(m.group(2))))
else:
    w = re.search(r'\bwidth="([0-9.]+)"', text)
    h = re.search(r'\bheight="([0-9.]+)"', text)
    print(int(float(w.group(1))), int(float(h.group(1))))
PY
)"
  art_h="${art_w##* }"
  art_w="${art_w%% *}"
  raster_w=$((art_w * 2))
  raster_h=$((art_h * 2))
  if [[ "$raster_w" -lt "$width" ]]; then
    raster_w="$width"
    raster_h=$((width * art_h / art_w))
  fi

  if [[ ! -x "$CHROME" ]]; then
    echo "Chrome not found at $CHROME; cannot rasterize $src" >&2
    exit 1
  fi

  local tmp
  tmp="$(mktemp -d)"
  cat > "$tmp/frame.html" <<EOF
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body { margin: 0; width: ${raster_w}px; height: ${raster_h}px; overflow: hidden; background: #fff; }
      img { display: block; width: ${raster_w}px; height: ${raster_h}px; }
    </style>
  </head>
  <body><img src="source.svg" alt="" /></body>
</html>
EOF
  cp "$src" "$tmp/source.svg"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --window-size="${raster_w},${raster_h}" \
    --screenshot="$tmp/frame.png" --virtual-time-budget=8000 \
    "file://${tmp}/frame.html" >/dev/null
  jpeg_from_raster "$tmp/frame.png" "$dest" "$width"
  rm -rf "$tmp"
}

jpeg_from_raster "$ROOT/src/assets/work/spotify-media/hero.png" \
  "$ROOT/src/assets/work/spotify-media/hero-1600.jpg" 1600
svg_to_jpeg "$ROOT/src/assets/work/plate-media/hero.svg" \
  "$ROOT/src/assets/work/plate-media/hero-1600.jpg" 1600
jpeg_from_raster "$ROOT/src/assets/work/plate-media/local-eats.png" \
  "$ROOT/src/assets/work/plate-media/local-eats-800.jpg" 800
jpeg_from_raster "$ROOT/src/assets/work/plate-media/paper-cake.png" \
  "$ROOT/src/assets/work/plate-media/paper-cake-800.jpg" 800
svg_to_jpeg "$ROOT/src/assets/work/plate-media/color-system.svg" \
  "$ROOT/src/assets/work/plate-media/color-system-1600.jpg" 1600
svg_to_jpeg "$ROOT/src/assets/work/plate-media/type-layout-system.svg" \
  "$ROOT/src/assets/work/plate-media/type-layout-system-1600.jpg" 1600
svg_to_jpeg "$ROOT/src/assets/work/plate-static.svg" \
  "$ROOT/src/assets/work/plate-static-800.jpg" 800
svg_to_jpeg "$ROOT/src/assets/work/spotify-media/c1s3.svg" \
  "$ROOT/src/assets/work/spotify-media/c1s3-600.jpg" 600

ls -lh \
  "$ROOT/src/assets/work/spotify-media/hero-1600.jpg" \
  "$ROOT/src/assets/work/plate-media/hero-1600.jpg" \
  "$ROOT/src/assets/work/plate-media/local-eats-800.jpg" \
  "$ROOT/src/assets/work/plate-media/paper-cake-800.jpg" \
  "$ROOT/src/assets/work/plate-media/color-system-1600.jpg" \
  "$ROOT/src/assets/work/plate-media/type-layout-system-1600.jpg" \
  "$ROOT/src/assets/work/plate-static-800.jpg" \
  "$ROOT/src/assets/work/spotify-media/c1s3-600.jpg"
