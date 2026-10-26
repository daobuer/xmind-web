#!/bin/bash
set -Eeuo pipefail

COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"

PORT=5000
DEPLOY_RUN_PORT="${DEPLOY_RUN_PORT:-$PORT}"


start_service() {
    cd "${COZE_WORKSPACE_PATH}"
    echo "Starting HTTP service on port ${DEPLOY_RUN_PORT} for deploy..."
    PORT=${DEPLOY_RUN_PORT} node dist/server.js
}

# Start NestJS backend
start_nestjs() {
    cd "${COZE_WORKSPACE_PATH}/server"
    echo "Starting NestJS backend on port 5001..."
    SERVER_PORT=5001 node dist/main &
    NESTJS_PID=$!
    echo "NestJS backend started (PID: ${NESTJS_PID})"
    cd "${COZE_WORKSPACE_PATH}"
}

start_nestjs
start_service
