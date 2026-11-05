# Codex brief — 项目管理：工作台同步到 2D toy model 重置

模型：`gpt-6-astra`；思考强度：**max**。
工作目录：`/workspace/architecture-workbench`。全部中文。

你是工作台唯一落地执行者。用户授权：Grok Bot 做项目管理，并用 Codex Astra max **全权更新工作台**。用户刚决定：删除并重建「输入」「状态网络」模块方向——**先在 2D 世界做 toy model，再升级到 3D**。要求「工作台也同步修改」。

## 硬边界
1. **不要**改 `bio-brain*` / `bio-brain-v2` / `newnet` 运行源码。
2. 保持 `mechanismValidated: false`。动画/文档 ≠ 机制验证。
3. 严格区分【已确认】【候选】【未验证/开放】【设计已锁·现码未对齐】【已作废/superseded】。不得把候选升成已确认；不得把已作废的 3D 方案悄悄留成现行默认。
4. 遵守 README：改 `data/architecture.json` 必须递增 `version`、追加 `changelog`；不删旧 ID、不重编号；废弃用 `deprecated` / `tombstones` / 明确 superseded 说明。
5. **概念网络与动作**既有已确认边界尽量保留（三因子只校 C0；返回无强度；补全/回映≠新观测；L-GOAL 设计已锁·现码未对齐 等）。不要因 2D 重置推翻这些。
6. 改完必须跑：`node scripts/check.mjs` 与 `npm test`。失败则修到通过。
7. Git：从当前工作树切出新分支 `candidate/pm-reset-2d-toy-v1`（若脏树先合理纳入本次提交范围）。提交信息必须含 `Reason:`、`IDs:`、`Validation:`。**不要 push**。
8. 不要假造新的 2D 拓扑端口定稿：输入/状态的 **2D 具体字段与接线仍待新 Bot 研究上报**；本次是把阶段目标与旧 3D 材料状态改对，并清掉「现行默认是 3D/MC」的表述。

## 用户决定（最高优先级，写入 latest-user-decisions）
- 日期：2026-11-04（America/Los_Angeles）
- 输入、状态网络设计重置：旧 Bot 已删并按 2D 重建
- 当前阶段：**2D 世界 toy model 优先**，再规划升 3D
- 旧 3D / Minecraft 尺度 / 双路射线三维交汇 / S-SPACE-01～07 作为 **3D 线候选或研究归档**，不再作为当前主线默认
- 概念网络、动作模块暂不重建；其非几何依赖的对齐继续有效
- 工作台必须同步反映上述阶段切换

## 必须产出
1. 新建纪要：`sources/pm-status-2026-11-04-2d-reset.md`
   - 说明重置原因与阶段（2D toy → 再 3D）
   - 各模块状态表：概念/动作继续；输入/状态重开 2D；旧 3D 材料归档状态
   - 阻塞与下一步（等新输入/状态 2D 最小方案上报后再落拓扑）
2. 追加更新 `sources/latest-user-decisions.md`（不覆盖旧条目）。
3. 更新 `sources/manifest.json`（如适用）。
4. 更新 `data/architecture.json`：
   - 递增 version（建议 1.1.2 → 1.2.0，因阶段切换）
   - changelog 写明 2D toy 重置
   - sources / decisions 引用本日纪要与用户决定
   - 对输入/状态相关 source 条目与结构 notes：标明【已作废作主线】或【3D 归档·非当前默认】；不要删除 ID
   - 标题/notice/相关文案：从「默认 3D 原型」改为「当前 2D toy model 阶段，3D 为后续升级」——若 title 仍可保留「概念 × 状态」，在 notice 或决策里写清阶段
   - **不要**新增未研究的 2D 端口/线定稿
5. 小幅更新 `README.md`：打开说明与重点引用反映 2D 阶段；指向新纪要；旧 S-SPACE/输入 3D 可行性改为归档引用。
6. 在 `modules/input/` 与 `modules/state-network/` 各加或更新简短 `README.md`（或 STATUS）段：当前主线是 2D toy；下列旧稿为归档/候选非现行默认。不要大段重写所有 S-SPACE 正文，点到为止即可。
7. 跑通 check + test；结果写进纪要与 commit Validation。

## 完成标准
- architecture 与文档清楚表达：当前阶段 2D toy；旧 3D/MC 材料非主线
- 概念/动作已确认边界未回退
- 无擅自定稿的新 2D 输入/状态拓扑
- check + test 通过
- 分支 `candidate/pm-reset-2d-toy-v1` 有清晰提交
- stdout 末尾中文摘要：改了哪些文件、新版本号、作废/归档项、测试结果、未落台项
