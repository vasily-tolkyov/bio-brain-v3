#!/usr/bin/env bash
set -euo pipefail
workbench_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
if [[ ! -f "$workbench_dir/.server.pid" ]]; then printf '%s\n' '本项目没有已登记的服务。'; exit 0; fi
workbench_pid="$(cat "$workbench_dir/.server.pid")"
if [[ "$workbench_pid" =~ ^[0-9]+$ ]] && kill -0 "$workbench_pid" 2>/dev/null && [[ "$(tr '\0' ' ' < "/proc/$workbench_pid/cmdline")" == *"$workbench_dir/server.mjs"* ]]; then
  kill -TERM "$workbench_pid"
  printf '%s\n' '已停止本项目服务。'
else
  printf '%s\n' '未找到匹配本项目的服务；没有终止其他进程。'
fi
