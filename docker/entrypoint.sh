#!/bin/sh
set -e

APP_LOCAL_URL=${APP_LOCAL_URL:-http://localhost:3000}

run_step() {
  step_name="$1"
  shift

  log_file="$(mktemp)"
  if "$@" >"$log_file" 2>&1; then
    echo "[app] ${step_name}: ok"
    rm -f "$log_file"
    return 0
  fi

  echo "[app] ${step_name}: falhou"
  cat "$log_file"
  rm -f "$log_file"
  return 1
}

echo "[app] preparando ambiente..."
run_step "migrations" npx prisma migrate deploy
run_step "seed" npm run --silent prisma:seed

echo "[app] pronto"
echo "[app] local:   ${APP_LOCAL_URL}"

echo "[app] subindo servidor..."
exec node docker/start.mjs
