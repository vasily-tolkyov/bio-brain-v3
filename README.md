# 概念 × 状态 · 架构工作台（当前：2D toy）

This repository holds the confirmed architecture-workbench snapshot **v1.2.2**, corresponding to local commit `1668cf8` on `candidate/pm-register-state-sspace-08`. Unconfirmed status↔concept pipeline topology is not included. Notes below that the workbench had no remote record the local workflow at the time of that snapshot.

本地架构展示与设计基准，由 Astra 实现前端与服务端。**不是脑网络实现、Minecraft连接或机制实验。** 数据 **v1.2.2**：当前阶段为 **2D toy model**，输入 v3 与[状态 S-SPACE-08](modules/state-network/S-SPACE-08-2d-toy-model.md)已登记；第一版状态只留同尺寸密强度活动图，每帧整图覆盖。四盒非本版职责，结构身份保留，字段与旧接线待群对齐；3D／MC 为后续升级与归档材料。已确认仅指设计决定，不表示实验通过。`mechanismValidated: false`。

## 打开

当前电脑双击 `start-windows.cmd`，浏览器访问 http://127.0.0.1:4317 。启动器用本机Node在隐藏后台进程运行，直接读取WSL工作区；不依赖终端保持打开。再次打开会复用同一项目服务。用 `stop-windows.cmd` 停止。

其他电脑：安装Node 22+，在项目目录运行 `npm ci`，再运行 `npm start`。服务只监听127.0.0.1；依赖从官方npm获取，运行时不使用外部CDN，不公开发布。

## 操作

- 拖动旋转、滚轮缩放、右键平移。双击模块或点“进入内部”，用面包屑返回。
- 搜索模块/结构/端口/线/规则/案例ID。点线查看两端及信号，复制引用后直接讨论该ID。
- “校准接线”只筛选同一网络；观察、预测、反查不建立独立预测器或规划器。
- 规则/案例在左栏折叠区。步骤只定位既有接线，明确“已定接线 / 机制未定”。信号动画仅示意方向。
- 面板“编辑”修改标签、状态、说明和接线端口；ID保持不变。导入先校验，应用时生成版本与历史快照。导出为完整规范JSON。

## 唯一设计数据与更新

`data/architecture.json` 是唯一规范源：结构、端口、接线、规则、案例、来源、决定和版本日志共存。JSON用于编辑展示，不是运行时网络的对象表或硬编码语义拓扑。三个概念层和神经元小图是示意抽样。

服务每秒检查本地文件；页面每秒同步。外部修改必须递增 `version` 并追加 `changelog`，否则保留最后有效场景并提示。坏JSON、悬空边、循环层级、重复ID、删除旧ID和历史改写会被拒绝。恢复旧内容须作为新版本提交，不回滚版本号。

“实时”指文件/编辑数据刷新；**没有监听聊天，也不会自动把聊天推论当成已批准结构。** 收到新决定后按ID更新数据，再执行检查。

## Git共同维护

本地独立仓库，无远端。此前在可写克隆中保存 `baseline/workbench-v1` 既有文件快照，并以 `candidate/pm-integrate-reports-v1` 提交整合；原目录 `.git` 只读，导入方式与实际提交位置见[项目纪要](sources/pm-status-2026-11-02.md)。**快照不是全部神经逻辑已验收的基线。** 完整逻辑验收仍被 U-CREDIT 等项目阻塞。

2026-11-03 状态 03～07 登记继续使用可写克隆，继承上述 1.1.1 候选历史，在 `candidate/pm-integrate-state-sspace-03-07` 分支保存研究材料快照与独立整合提交；交付 [bundle](evidence/pm-integrate-state-sspace-03-07.bundle)，位置与审阅方式见[本日纪要](sources/pm-status-2026-11-03.md)。原目录 `.git` 未导入，不 push。

2026-11-04 用户重置输入／状态为 **2D toy → 再 3D**；工作台在 `candidate/pm-reset-2d-toy-v1` 升至 **1.2.0**，旧 3D／MC／S-SPACE-01～07 标为归档非主线，详见[2D 重置纪要](sources/pm-status-2026-11-04-2d-reset.md)。不 push。

同日，`candidate/pm-register-input-2d-v3` 将输入 v3 短稿与 README STATUS 登记为 **1.2.1** 的来源、决定与[独立纪要](sources/pm-status-2026-11-04-input-2d-v3.md)；已确认方向与候选交接分开，输入拓扑未定稿。不 push。

同日，`candidate/pm-register-state-sspace-08` 在 1.2.1 基础上登记状态 S-SPACE-08 至 **1.2.2**，见[独立纪要](sources/pm-status-2026-11-04-state-sspace-08.md)。八条方向、候选字段／大纲与五项开放分别记录；四盒退场只标记职责变化，旧节点／端口／边与几何保留，待群对齐后处理。不 push。

每项修改：新建 `candidate/<主题>` → 按稳定ID改数据/规则/案例 → `node scripts/check.mjs` → `npm test` → 相关浏览器测试 → `git diff` → 提交。提交信息必须包含 `Reason:`、`IDs:`、`Validation:`。`.githooks` 检查完整工作树与暂存区一致、数据契约和单元测试；不会自动提交或批准研究结论。

UI显示实际分支、短提交和“未提交”。在网页保存只写本地文件/历史快照，**不会代替Git提交**。布局或名称变化不得重编号。废弃实体保留 `deprecated` 或 `tombstones`；不得复用旧ID。更新实际来源/决定，候选审核通过后才改变状态。

## 重点引用

| ID | 指向 |
| --- | --- |
| M-STATE / M-CONCEPT | 状态网络 / 同一概念基座 |
| C0 / C1 / C2 | 示例层级，非固定层数 |
| S-C0-SYN | 最底概念层吸引子内部连接集合 |
| L-CAL0 | P-STATE-CAL → P-C0-CAL，状态三因子 |
| L-CAL1 / L-CAL2 | 下一概念层对上层内部连接的非三因子校准 |
| L-RETURN | 纯信号返回通路，无“返回强度” |
| U-CREDIT / CASE-LAMP-CREDIT | 高层错误灯亮关系是否误伤正确C0视觉内容 |
| U-DECODE / U-ETA-K / U-H-GROW | 解码贡献、η/K共同域、H生长/多边稳定待定 |
| C-T0 | V2责任追踪/更新/预算候选，未批准 |
| DEPRECATED-B1 | 旧桥接校准靶点的废弃记录 |
| D-INPUT-2D-V3 / D-INPUT-2D-V3-HANDOFF | [输入 2D toy 短稿 v3](modules/input/design-draft-v3-2d-toy.md)：已确认 topK 方向／候选交接，字段开放 |
| D-STATE-2D-SSPACE-08 | [状态 08](modules/state-network/S-SPACE-08-2d-toy-model.md)：八条已确认方向，第一版只留 S-SPACE 活动图 |
| D-STATE-2D-SSPACE-08-HANDOFF / D-STATE-2D-SSPACE-08-OPEN | 候选字段／伪代码／核验大纲；输入、概念读取与峰回传、四盒旧接线及颜色／参数仍待群对齐 |

**当前阶段（1.2.2）**：【用户已确认】2D 画面 → 分块局部对比 topK 稀疏 → S-SPACE；原位置＋强度直接点亮同尺寸密网格，未点亮格为无活动的 0，每帧覆盖、不自留历史；无相机→世界映射，无状态侧峰／归组／局部极大。颜色可参与 topK 加权，进状态格为后选项，参数等状态设计后再调。【候选方案】08 字段与伪代码只作待签认说明；四项核验大纲尚未实现或执行。【开放/未决】输入 schema、概念读取与 C0／L-CALL／L-CAL0、回传峰的非观测落点、四盒及旧 L-* 物理更新、颜色与调参待群对齐，见[状态 08 登记纪要](sources/pm-status-2026-11-04-state-sspace-08.md)。四盒和旧“空间多峰”标签保留用于结构追溯，不表示本版保留该职责。概念／动作继续沿用既有已确认边界：[概念 v0](modules/concept-network/README.md)、[动作 v1 候选](modules/action-goal/v1-interface-contract.md)。【3D 归档／历史参考·非本版默认】旧 3D／MC／01～07，阶段切换见[2D 重置纪要](sources/pm-status-2026-11-04-2d-reset.md)；历史整合见[1.1.1 纪要](sources/pm-status-2026-11-02.md)、[1.1.2 纪要](sources/pm-status-2026-11-03.md)。补全／回映／推算不得写观测格，`mechanismValidated: false`。

全部机器可读索引：`node scripts/index.mjs`。旧W01–W24的题包/C1原行保存在 `sources/legacy-wires.json`。新图使用L-*，legacyRefs只表示职责追溯，**不是W编号的重新定义**。

## 验证入口与边界

`node scripts/check.mjs`：结构校验与7项接线/决策契约；输出 `mechanismValidated:false` 和未定步骤。

`npm test`：唯一ID、悬空边、端口方向、循环、几何、旧ID、版本历史及最新校准靶点的回归测试。

`tests/browser.cjs`：真实浏览器操作。应先复制规范到 `.test-work/architecture.json`，用 `PORT=4318 ARCHITECTURE_FILE=<副本绝对路径> node server.mjs` 启测试服务，再运行浏览器脚本。支持 `PLAYWRIGHT_MODULE`、`BROWSER_EXECUTABLE`、`WORKBENCH_ROOT`、`WORKBENCH_URL`；使用开发依赖Playwright或已有安装。截图/结果见 `evidence/`。

已定义拓扑、V2候选公式和待验收项分别保存。§10按钮/灯的跨层责任问题、原H/传播完整式等未解决；案例尚没有真实按神经规则计算的数值轨迹。真实 Minecraft／3D 脑网络接入为后续升级项，须另行授权；当前不作为主线默认。

来源：已物化原题包、C1、V2并核对相关段落；功能Page保存序列9。未重新观看原视频；不从旧仓库恢复脑原型。详见 `sources/manifest.json`、`latest-user-decisions.md`、`review-v2.md`。
