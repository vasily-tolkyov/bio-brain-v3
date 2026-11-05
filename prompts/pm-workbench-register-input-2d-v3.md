# Codex brief — 登记输入 2D toy v3 短稿进工作台（不定拓扑）

模型：`gpt-6-astra`；思考强度：**max**。
工作目录：`/workspace/architecture-workbench`。全部中文。

## 任务
把 `modules/input/design-draft-v3-2d-toy.md`（及 README STATUS）收进工作台 **决定 / 来源 / 纪要**。当前分支已在 `candidate/pm-reset-2d-toy-v1`（v1.2.0）。建议新分支 `candidate/pm-register-input-2d-v3` 或继续本分支提交均可，优先干净提交。

## 硬边界
1. **不要**新增或改定稿输入 ports/wires/topology 字段。
2. `mechanismValidated: false`。
3. 不改 bio-brain / newnet。
4. 概念／动作已确认边界不回退。
5. 区分【用户已确认】【候选】【开放/未决】【3D 归档】。
6. 改 `data/architecture.json`：递增 version（1.2.0 → 1.2.1）、changelog、sources、decisions。
7. 跑通 `node scripts/check.mjs` 与 `npm test`。
8. Git 提交含 `Reason:` `IDs:` `Validation:`；**不要 push**。

## 必须写入的已确认方向（来自短稿）
- 2D 画面 → 分块局部对比 topK 稀疏 → S-SPACE
- 点带原位置；可带光强＋颜色（非对象标签）；topK 可色加权
- 块大小／k／权重等参数等状态网络设计完再调
- 旧 3D/MC 不作现行
- 交接 schema 字段仍【候选／开放】，等状态最小承载后再对

## 产出
1. 追加 `sources/latest-user-decisions.md`
2. 纪要：`sources/pm-status-2026-11-04-input-2d-v3.md`（或并入更新既有 2d-reset 纪要并交叉引用——优先独立短纪要）
3. `sources/manifest.json` 如适用
4. `architecture.json`：SRC + Decision（如 D-INPUT-2D-V3），README 重点引用可一行指向短稿
5. check + test；stdout 中文摘要

优先 `codex exec -m gpt-6-astra -c model_reasoning_effort=max`；若 exec 只读退出则按 brief 自行落盘。
