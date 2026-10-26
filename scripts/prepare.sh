#!/bin/bash
set -Eeuo pipefail

COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"

cd "${COZE_WORKSPACE_PATH}"

echo "Installing frontend dependencies..."
bash "$COZE_WORKSPACE_PATH/scripts/prepare-node-modules.sh" --prefer-frozen-lockfile --prefer-offline --loglevel debug --reporter=append-only

echo "Installing NestJS backend dependencies..."
cd "${COZE_WORKSPACE_PATH}/server"
if [[ -f "package.json" ]]; then
  pnpm install --prefer-frozen-lockfile --prefer-offline --loglevel debug 2>&1 || pnpm install 2>&1
  echo "Building NestJS backend..."
  npx nest build 2>&1
fi
