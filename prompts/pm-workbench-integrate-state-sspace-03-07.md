# Codex brief — 项目管理：登记状态网络 S-SPACE-03～07 上报并更新工作台

模型：`gpt-6-astra`；思考强度：**max**。
工作目录：`/workspace/architecture-workbench`。全部中文。

你是工作台唯一落地执行者。用户授权：Grok Bot 做项目管理与整理，并用 Codex Astra max **全权更新工作台**。本轮只整合**状态网络**自 1.1.1 之后已完成的候选研究上报，不扩展到输入/概念/动作新拓扑。

## 硬边界
1. **不要**改 `bio-brain*` / `bio-brain-v2` / `newnet` 运行源码。
2. **不要**改 `modules/input/` 下任何文件；输入 P1–P5 / Q2/Q3 / VisionSparseEvent / L-SPACE→P-SPACE-IN 载荷**仍待用户确认**，不得写入规范 ports/wires 定稿。
3. **不要**把【候选】升成【已确认】；保持 `mechanismValidated: false`。
4. 遵守 README：改 `data/architecture.json` 必须递增 `version`、追加 `changelog`；不删旧 ID、不重编号；废弃用 deprecated/tombstones。
5. 无兜底、无账本、不填零、不加颜色标签类工程分类；状态侧自然成像口径与相对布局「无状态 taxonomy」口径按源文档如实登记，勿发明新的 case 枚举。
6. 改完必须跑：`node scripts/check.mjs` 与 `npm test`。失败则修到通过。
7. Git：在可写前提下提交到候选分支（如 `candidate/pm-integrate-state-sspace-03-07`）。提交信息必须含 `Reason:`、`IDs:`、`Validation:`。**不要 push**。若原 `.git` 只读，按 1.1.1 纪要方式在可写克隆生成 bundle，并在纪要写明。

## 本轮已收上报（只读核对后落台）
只登记进度与来源，不批准机制。核心文件：
- `modules/state-network/S-SPACE-03-carrier-structure.md`
- `modules/state-network/S-SPACE-04-false-intersection-filter.md`（自然成像 vs 另立筛选模块边界）
- `modules/state-network/S-SPACE-05-specificity-at-intersection.md` + `experiments/specificity-at-intersection/`
- `modules/state-network/S-SPACE-06-mc-monocular-state.md`
- `modules/state-network/S-SPACE-06b-block-scale-prior.md`
- `modules/state-network/S-SPACE-06c-image-to-pattern.md` + `experiments/mc-image-to-pattern/`（及如有 `mc-perspective-multi/`）
- `modules/state-network/S-SPACE-07-relative-layout.md` + `experiments/mc-relative-layout/`（末行标记 `DONE-MC-RELATIVE-LAYOUT-NOLABEL`；validation 247/247 通过，mechanismValidated:false）

辅助实验目录可在纪要中引用，不必全部写入 architecture sources（优先写入正式 md 设计稿与关键 RESULT）：
- `experiments/nearfar-sweep/`、`experiments/support-width-sweep/`（承载窗/宽度条件起点来源）

已确认可写入决定层的用户口径（以源文档【用户已确认】为准，勿扩张）：
- 固定重叠三维感受野，位置不学（学习归概念）
- MC 首版入口：单路 2D＋相机参数，无双目配对前提
- 方块尺度先验（1 块单位）+ 锁定 MC 内参 K（锁定后已知，不逐帧猜）
- 输入→承载＝自然成像；另立筛选模块尚未设计；场不贴真假/交汇标签
- 相对布局：条件计量在 A 外；`ray.depth` 保持相机未测深；等尺度/方块范围适用时可用表观尺寸反推相对近远；禁止发布工程 status taxonomy
- 近远窗主 0.25–16 m、紧 0.25–12.5 m 等为条件起点，**不写正式接口默认**

仍开放（纪要写明，勿关闭）：筛选模块算法；真实 MC 接入与真实录制稀疏+ray；输入契约联合签认；P1–P5；把条件深度写回观测等禁止项。

## 必须产出
1. 新建纪要：`sources/pm-status-2026-11-03.md`（状态模块本轮进度表、已确认/候选/开放、与 1.1.1 阻塞清单的关系、下一步）。
2. 追加 `sources/latest-user-decisions.md`（只追加本轮状态侧已确认口径与登记边界，不覆盖旧文）。
3. 更新 `sources/manifest.json`：登记本轮正式设计稿（及必要 RESULT）字节数与 SHA-256。
4. 更新 `data/architecture.json`：最小合理版本递增（建议 `1.1.1 → 1.1.2`）；changelog；sources/decisions 引用；在状态模块相关 notes 挂文档路径与【候选】；**不要**改结构身份/端口几何；不要定稿输入载荷。
5. 更新 `modules/state-network/README.md` 阅读顺序表，挂上 03～07（及实验入口指针），保持【候选】标记；勿改坏旧 01/02 表述的确认边界。
6. 跑通 check + test；结果写入纪要与 commit Validation。
7. stdout 末尾中文摘要：改了哪些文件、新版本号、未落台项、测试结果；最后一行单独打印：`DONE-PM-INTEGRATE-STATE-03-07`

## 完成标准
- 工作台反映状态网络 03～07 候选上报，mechanismValidated 仍 false
- 输入拓扑未擅自定稿
- check + test 通过
- 有清晰 candidate 提交或可审阅 bundle
