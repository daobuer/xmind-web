#!/bin/bash
set -Eeuo pipefail

COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"

cd "${COZE_WORKSPACE_PATH}"

echo "Installing dependencies..."
bash "$COZE_WORKSPACE_PATH/scripts/prepare-node-modules.sh" --prefer-frozen-lockfile --prefer-offline --loglevel debug --reporter=append-only

echo "Building the Next.js project..."
pnpm next build --webpack

echo "Bundling server with tsup..."
pnpm tsup src/server.ts --format cjs --platform node --target node20 --outDir dist --no-splitting --no-minify

echo "Building NestJS backend..."
cd "${COZE_WORKSPACE_PATH}/server"
if [[ -f "package.json" ]]; then
  pnpm install --prefer-frozen-lockfile --prefer-offline 2>&1 || pnpm install 2>&1
  npx nest build 2>&1
fi

echo "Build completed successfully!"
