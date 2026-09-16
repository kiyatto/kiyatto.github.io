#!/usr/bin/env bash
# Thin alias — heroes are generated with the rest of the stills.
exec "$(cd "$(dirname "$0")" && pwd)/optimize-case-study-images.sh" "$@"
