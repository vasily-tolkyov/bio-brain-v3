#!/usr/bin/env bash
set -euo pipefail
workbench_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$workbench_dir"
if [[ -f .server.pid ]]; then
  workbench_pid="$(cat .server.pid)"
  if [[ "$workbench_pid" =~ ^[0-9]+$ ]] && kill -0 "$workbench_pid" 2>/dev/null && [[ "$(tr '\0' ' ' < "/proc/$workbench_pid/cmdline")" == *"$workbench_dir/server.mjs"* ]]; then
    printf '%s\n' '已运行：http://127.0.0.1:4317'
    exit 0
  fi
fi
if [[ ! -f node_modules/three/build/three.module.js ]]; then
  npm ci --registry=https://registry.npmjs.org
fi
nohup node "$workbench_dir/server.mjs" > .server.log 2>&1 < /dev/null &
workbench_pid=$!
printf '%s\n' "$workbench_pid" > .server.pid
for workbench_attempt in {1..24}; do
  if ! kill -0 "$workbench_pid" 2>/dev/null; then cat .server.log >&2; exit 1; fi
  if node -e "fetch('http://127.0.0.1:4317/api/architecture').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"; then
    printf '%s\n' '已启动：http://127.0.0.1:4317'
    exit 0
  fi
  sleep 0.25
done
printf '%s\n' '启动超时，请查看 .server.log' >&2
exit 1
