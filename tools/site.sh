#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PATCH_FILE="$ROOT_DIR/tools/ruby32_taint_patch.rb"

if [[ -x /usr/bin/bundle3.2 ]]; then
  BUNDLE_BIN="/usr/bin/bundle3.2"
else
  BUNDLE_BIN="bundle"
fi

export RUBYOPT="-r$PATCH_FILE ${RUBYOPT:-}"

cd "$ROOT_DIR"

case "${1:-serve}" in
  install)
    "$BUNDLE_BIN" config set --local path vendor/bundle
    "$BUNDLE_BIN" install
    ;;
  build)
    "$BUNDLE_BIN" exec jekyll build
    ;;
  doctor)
    "$BUNDLE_BIN" exec jekyll doctor
    ;;
  serve)
    "$BUNDLE_BIN" exec jekyll serve --livereload
    ;;
  test)
    "$BUNDLE_BIN" exec jekyll build
    "$BUNDLE_BIN" exec jekyll doctor
    ;;
  *)
    echo "Usage: ./tools/site.sh [install|build|doctor|serve|test]"
    exit 1
    ;;
esac
