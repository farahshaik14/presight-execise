#!/usr/bin/env bash
set -eo pipefail

cd "$(dirname "$0")"

API_PORT=4000
CLIENT_PORT=3000

bold() { printf "\033[1m%s\033[0m\n" "$1"; }
info() { printf "\033[35m›\033[0m %s\n" "$1"; }
fail() { printf "\033[31m✖ %s\033[0m\n" "$1" >&2; exit 1; }

usage() {
  cat <<EOF
Usage: ./dev.sh [command]

  local    Start API (:$API_PORT) and client (:$CLIENT_PORT) with hot reload (default)
  docker   Build and run the production app in Docker (:$API_PORT)
  test     Run the test suite
  seed     Recreate the local SQLite database
  stop     Stop the Docker container
  reset    Stop Docker and delete the local and Docker databases
EOF
}

use_node() {
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
    nvm use --silent >/dev/null 2>&1 || nvm install
  fi
  command -v node >/dev/null || fail "Node.js is not installed"
  node -e 'const [a,b]=process.versions.node.split(".").map(Number); process.exit(a>22||(a===22&&b>=13)?0:1)' \
    || fail "Node $(node -v) is too old. Node 22.13+ is required (try: nvm install)"
  command -v yarn >/dev/null || fail "Yarn is not installed (try: corepack enable or npm i -g yarn)"
  info "Using Node $(node -v)"
}

install_deps() {
  if [ ! -d node_modules ] || [ yarn.lock -nt node_modules/.yarn-integrity ]; then
    info "Installing dependencies"
    yarn install --frozen-lockfile
  fi
}

check_port() {
  if lsof -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1; then
    fail "Port $1 is already in use. Stop whatever is running there first."
  fi
}

require_docker() {
  command -v docker >/dev/null || fail "Docker is not installed"
  docker info >/dev/null 2>&1 || fail "Docker is not running. Start Docker Desktop and try again."
}

case "${1:-local}" in
  local)
    use_node
    install_deps
    check_port "$API_PORT"
    check_port "$CLIENT_PORT"
    bold "Starting dev environment"
    info "Client  http://localhost:$CLIENT_PORT"
    info "API     http://localhost:$API_PORT/api/health"
    info "Press Ctrl+C to stop"
    yarn dev
    ;;
  docker)
    require_docker
    check_port "$API_PORT"
    bold "Building and starting Docker"
    info "App     http://localhost:$API_PORT"
    info "Press Ctrl+C to stop"
    docker compose up --build
    ;;
  test)
    use_node
    install_deps
    yarn test
    ;;
  seed)
    use_node
    install_deps
    yarn seed
    ;;
  stop)
    require_docker
    docker compose down
    ;;
  reset)
    require_docker
    docker compose down -v
    rm -f server/data/presight.db server/data/presight.db-wal server/data/presight.db-shm
    info "Databases removed. They are re-seeded on next start."
    ;;
  -h|--help|help)
    usage
    ;;
  *)
    usage
    exit 1
    ;;
esac
