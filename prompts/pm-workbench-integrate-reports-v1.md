# Codex brief — 项目管理：汇总模块上报并更新工作台

模型：`gpt-6-astra`；思考强度：**max**。
工作目录：`/workspace/architecture-workbench`。全部中文。

你是工作台唯一落地执行者。用户授权：Grok Bot 做项目管理与整理，并用 Codex Astra max **全权更新工作台**。

## 硬边界
1. **不要**改 `bio-brain*` / `bio-brain-v2` / `newnet` 运行源码。
2. **输入模块用户确认前不落规范拓扑**：不得把输入侧 Q2/Q3、`L-SPACE→P-SPACE-IN` 字段定稿、VisionSparseEvent 正式进 `architecture.json` 的 ports/wires 当成已批准结构写入。可在 sources / decisions / changelog / 文档索引里登记「候选待确认」。
3. 状态侧在等输入契约补丁：不要擅自改 `L-SPACE` / `P-SPACE-IN` 载荷定义。
4. 保持 `mechanismValidated: false`。动画/文档 ≠ 机制验证。
5. 严格区分【已确认】【候选】【未验证/开放】【设计已锁·现码未对齐】。不得把候选升成已确认。
6. 遵守 README：改 `data/architecture.json` 必须递增 `version`、追加 `changelog`；不删旧 ID、不重编号；废弃用 deprecated/tombstones。
7. 改完必须跑：`node scripts/check.mjs` 与 `npm test`。失败则修到通过。
8. Git：在干净合理的提交里提交本次工作台更新（可先 `git checkout -b candidate/pm-integrate-reports-v1`）。提交信息必须含 `Reason:`、`IDs:`、`Validation:`。不要 push（无远端）。

## 已收上报（只读核对后落台）
### A. 概念网络 v0（可落台：文档索引 + 决定/来源/规则说明；不伪造新神经机制）
- `modules/concept-network/README.md`
- `modules/concept-network/design-memo-video-first-v0.md`
- `modules/concept-network/CODEX-BRIEF.md`
要点：视频①–⑯优先；状态三因子只校 C0 内部连接；返回无强度；现码仍改下行 W / 动作门挂 W（设计已锁·现码未对齐）。开放 O1–O10。

### B. 动作 v1 草稿（可落台：候选文档索引与接线边界说明；动力学未验收）
- `modules/action-goal/v1-interface-contract.md`
- `modules/action-goal/v1-open-dynamics-candidates.md`
- （可选）`modules/action-goal/CODEX-BRIEF.md`
要点：L-GOAL / L-BODY / L-ACTION-TRACE 契约；§6 九项开放题候选；跨模块接线未改，只约定边界。

### C. 状态网络 S-SPACE-01（登记进度；等输入补丁后再对载荷）
- `modules/state-network/README.md`
- `modules/state-network/S-SPACE-01-sparse-feature-to-spatial-peak.md`
- `modules/state-network/interface-notes.md`
与输入/概念对齐：观测口只收适配器真实稀疏+射线；补全/回映≠新观测；返回无学习强度。

### D. 输入候选（仅登记，不改 topology）
用户授权上报但 **确认前不落工作台拓扑**。目录 `modules/input/`：
已确认方向：Q1-A 分块局部对比 topK；先稀疏再赋射线；多路独立稀疏矩阵+射线分别 ingest；三维交汇由 S-SPACE 叠出；禁 Minecraft ID/地图/配方。
候选交付：scheme-plain-zh / design-draft-v1 / interface-contract / feasibility-minecraft-dual-ray-3d。
未决 P1–P5。

### E. 群内已对齐的跨模块边界（写入决定）
- 真实观测入口只有适配器交的稀疏活动＋射线（含标定）
- 补全/回映只是沿出处的推测信号，必须对照真实输入，**不能**当新观测灌回状态
- 返回仍是信号通路、无可学返回强度

## 必须产出
1. 新建项目管理纪要：`sources/pm-status-2026-11-02.md`  
   含：各模块状态表、已确认/候选/未决、阻塞项（输入待确认、L-SPACE 载荷、U-CREDIT 等）、下一步。
2. 更新 `sources/latest-user-decisions.md`（追加本日项目流程与观测/补全边界，不覆盖旧条目）。
3. 更新 `sources/manifest.json`（如适用）登记 modules 文档为来源。
4. 更新 `data/architecture.json`：
   - 递增 version（建议 1.1.0 → 1.1.1 或 1.2.0，按仓库惯例选较小合理增量）
   - changelog 说明本次整合
   - sources / decisions 增加对本日模块文档与边界的引用
   - 若需：在相关 structure/port/wire 的 notes/status 中引用模块文档路径与【候选】标记
   - **不要**新增未确认的输入端口字段定稿；不要改坏现有 L-CAL* / L-RETURN 已确认语义
5. 如 README「重点引用」需补模块入口，可小幅更新 README（保持简洁）。
6. 跑通 `node scripts/check.mjs` 与 `npm test`；把结果写进纪要与 commit Validation。

## 完成标准
- 纪要与 architecture 更新反映四模块上报，且输入拓扑未擅自定稿
- check + test 通过
- git 有清晰 candidate 分支提交
- 在 stdout 末尾用中文摘要：改了哪些文件、新版本号、未落台项、测试结果
