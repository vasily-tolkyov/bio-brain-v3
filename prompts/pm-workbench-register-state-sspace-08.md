# Codex brief — 登记状态网络 S-SPACE-08 2D toy 进工作台（不定拓扑）

模型：`gpt-6-astra`；思考强度：**max**。
工作目录：`/workspace/architecture-workbench`。全部中文。

你是工作台唯一落地执行者。用户授权：Grok Bot 做项目管理与整理，并用 Codex Astra max **全权更新工作台**。本轮把状态网络已写完的 **S-SPACE-08** 收进工作台决定／来源／纪要。当前分支在 `candidate/pm-register-input-2d-v3`（v1.2.1）。建议新分支 `candidate/pm-register-state-sspace-08`（可从当前 HEAD 切出），优先干净提交。

## 硬边界
1. **不要**新增或改定稿 ports／wires／topology 几何；**不要**删除或重接节点／边（含 S-INSTANCE／S-SOURCE／S-HAVE／S-WANT 与相关 L-*）。四盒退场与接线影响只登记为【用户已确认】方向 + 【开放/未决】需群对齐，architecture 结构身份本轮仅用 notes／decisions／tombstones 标记「非本版职责／待群对齐后处理」，**不物理删 ID、不重编号**。
2. `mechanismValidated: false`。动画／文档检查 ≠ 机制验收。
3. 不改 `bio-brain*` / `bio-brain-v2` / `newnet`。
4. **不要**改 `modules/input/` 正文；输入 v3 已登记；本轮只对照引用，不定输入 schema。
5. 概念／动作既有已确认边界不回退（三因子只校 C0、返回无强度、补全／回映≠新观测、L-GOAL【设计已锁·现码未对齐】等）。
6. 严格区分【用户已确认】【候选方案】【开放/未决】【历史参考】／【3D 归档】。
7. 改 `data/architecture.json`：递增 version（**1.2.1 → 1.2.2**）、updatedAt、追加 changelog；更新 sources、decisions；nodes／ports／edges／views／rules／cases 身份保持与 1.2.1 一致（可在相关 description／notes 写明「本版主线见 S-SPACE-08；四盒非本版职责」）。
8. 跑通 `node scripts/check.mjs` 与 `npm test`。失败则修到通过。
9. Git 提交含 `Reason:`、`IDs:`、`Validation:`；**不要 push**。工作区其他未跟踪旧实验目录可保留原状；**必须纳入**本轮相关的 S-SPACE-08／README／2d-toy-model 大纲与本 brief／纪要。

## 必须写入的已确认方向（来自 S-SPACE-08 第 2 节八条，不得改写）
1. 入口：2D 画面 → 分块局部对比 topK 稀疏 → S-SPACE；点含原位置＋强度；颜色可参与 topK 加权，进状态格为后选项；不预装对象 ID／地图；参数等状态设计后再调（本稿不锁参数）。
2. 点亮：topK 点直接点亮对应图像平面格；**不做**相机→世界映射。
3. 峰：第一版只承载活动格；峰等概念学习／补全读出后再回传；状态侧不做峰／归组／局部极大。
4. 跨帧：每帧整图覆盖；不叠帧、不衰减叠帧；不自留历史。
5. 职责盒：删掉 S-INSTANCE／S-SOURCE／S-HAVE／S-WANT；第一版**只留 S-SPACE 活动图**。
6. 存储：整幅密网格；未点到的格为 0（表示无活动，不是填未知）。
7. 格载荷：第一版每格只要强度；颜色可选后加。
8. 分辨率：与输入画面同尺寸，一点一格。

另确认边界：观测口只收真实稀疏；补全／回映／推算不得写观测格；无兜底／无账本／未知不补零；禁止 MC 对象 ID／地图／隐藏属性／配方。

## 仍开放（纪要写明，勿关闭）
- 输入字段签认（shape、坐标、position_index、强度尺度、同址重复、空帧）
- 概念读取与 C0／L-CALL／L-CAL0 在四盒退场后的承接
- 概念回传峰如何落回仅含活动图的 S-SPACE
- 四盒退场后旧 L-* 与 architecture.json 拓扑的群对齐后物理更新
- 颜色通道与输入参数调优

候选字段表、伪代码、核验场景大纲按【候选方案】登记，不升为已确认。

## 只读源稿
- `modules/state-network/S-SPACE-08-2d-toy-model.md`（主稿）
- `modules/state-network/README.md`（已指向 08）
- `modules/state-network/experiments/2d-toy-model/README.md`（可选大纲）
- `modules/input/design-draft-v3-2d-toy.md`、`sources/pm-status-2026-11-04-input-2d-v3.md`、`sources/latest-user-decisions.md`

## 必须产出
1. 追加 `sources/latest-user-decisions.md`（只追加本轮状态 08 已确认口径与登记边界）。
2. 独立纪要：`sources/pm-status-2026-11-04-state-sspace-08.md`（确认／候选／开放、与输入 v3 关系、下一步群对齐、验证）。
3. 更新 `sources/manifest.json`：本轮正式稿字节数与 SHA-256。
4. `architecture.json`：SRC + Decision（如 `D-STATE-2D-SSPACE-08` 覆盖八条；可拆 handoff／open 决定）；状态 README／SRC-STATE-* 指向 08；旧 01～07 继续【3D 归档／历史参考·非本版默认】。
5. 若 state README 已正确指向 08，可只核对；勿与八条定稿冲突。
6. check + test；结果写入纪要与 commit Validation。
7. stdout 末尾中文摘要：改了哪些文件、新版本号、未落台项、测试结果；最后一行单独打印：`DONE-PM-REGISTER-STATE-SSPACE-08`

## 完成标准
- 工作台反映 S-SPACE-08 为 2D 状态主线；mechanismValidated 仍 false
- 未擅自删改 ports／edges；未定稿输入 schema
- check + test 通过；有清晰 candidate 提交
