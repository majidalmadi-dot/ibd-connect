#!/usr/bin/env bash
# Gated deploy for the SGA companion PWAs.
# Runs the CI gate (parse-check + jsdom smoke) and ONLY deploys if it passes.
# This is the real gate for the CLI deploy flow — nothing reaches production without passing.
#
# Usage:
#   ./deploy.sh              # verify all, deploy ibd-connect (root) + qawam (Qawam/)
#   ./deploy.sh ibd          # verify all, deploy only ibd-connect (root → site + /Qawam/ + /EoE/)
#   ./deploy.sh qawam        # verify all, deploy only qawam-three
#   ./deploy.sh --no-deploy  # verify only (dry run)
set -euo pipefail
cd "$(dirname "$0")"

VERCEL="${VERCEL:-vercel}"
target="${1:-all}"

echo "▶ Running pre-deploy gate…"
if [ ! -d ci/node_modules ]; then
  echo "  installing gate deps (ci/)…"
  ( cd ci && npm ci --silent 2>/dev/null || npm install --silent )
fi
node ci/verify.mjs
echo

if [ "$target" = "--no-deploy" ]; then echo "✔ Gate passed (dry run, no deploy)."; exit 0; fi

deploy_ibd(){ echo "▶ Deploying ibd-connect (root)…"; "$VERCEL" deploy --prod --yes; }
deploy_qawam(){ echo "▶ Deploying qawam (Qawam/)…"; ( cd Qawam && "$VERCEL" deploy --prod --yes ); }

case "$target" in
  ibd)   deploy_ibd ;;
  qawam) deploy_qawam ;;
  all)   deploy_ibd; deploy_qawam ;;
  *)     echo "Unknown target '$target'. Use: ibd | qawam | all | --no-deploy"; exit 1 ;;
esac
echo "✔ Done."
