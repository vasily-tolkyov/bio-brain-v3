# Codex brief — 概念网络 v0 设计备忘（视频优先）

你在共享电脑上，只写设计文档，不改 bio-brain-v2 运行源码，不 git commit/push。

## 产出（必须写到这些路径）
1. `/workspace/architecture-workbench/modules/concept-network/README.md` — 模块职责与文档索引
2. `/workspace/architecture-workbench/modules/concept-network/design-memo-video-first-v0.md` — 主设计备忘
3. `/workspace/architecture-workbench/modules/concept-network/CODEX-BRIEF.md` — 给后续 Codex 轮次用的简报（可短）

## 优先级（用户 2026-11-02 明确）
1. **视频新设计优先**（动画演示即规格）：平面神经元 → 共闪 ρ STDP（加强 / 单端削弱）→ 端口矩阵稀疏写入（topK、按索引 i 非最近邻）→ 吸引子扩散补全；ρ 与色记忆 H 分轨防串扰；时间片竖立再平铺进下层；正查 H−S 差集；目标反查：L0 认出「要」→ 上行逐层补全 → 高层对低一层差集筛缺件 → 缺件=动作则竞争，否则子目标再钳。
2. 视频**未覆盖**处再回退仓库旧设计，并标明出处。
3. 视频文件在本机：`/workspace/uploads/concept-network-new-design.mp4`（Codex 不必重看；以上摘要为准）。

## 已确认校准边界（不要回退）
- 状态网络用三因子直接校准概念最底层（C0）吸引子**内部**连接（削弱/增强/新建）。
- 更高层由下一层用原有**非三因子**机制（ρ 共闪等）校准。
- 返回只是信号通路，**没有**可学习的「返回强度」。
- V2 三因子报告是**候选**，不是已批准公式。
- 旧限制已纠正、勿当现行：全查询纯读、补全学习排除、缺测豁免、旧桥接强度方案。
- 真实外界输入的直接与补全活动都可学习；内部预演不学习；遮挡/缺测照常小幅削弱。
- 不能因桥接或状态设计缺口就换一套学习架构。

## 权威只读参考
- `/workspace/architecture-workbench/sources/latest-user-decisions.md`
- `/workspace/state-network-research/CONTEXT.md`
- `/workspace/bio-brain-video/light-line-mechanism-design.md`（若存在）
- `/workspace/bio-brain-v2/docs/multilayer-architecture-narrative.md`（仅补视频未覆盖处；冲突时视频+最新用户定义为准）
- `/workspace/bio-brain-v2/out/light-line/design/DECISIONS.md`（若存在）
- `/workspace/newnet/spec.md`
- 兄弟模块契约边界：`modules/action-goal/CODEX-BRIEF.md`、`modules/state-network/CODEX-BRIEF.md`、`modules/input/`（只对齐接口名，不改他们文件）

## 文档必须严格分区
每个断言标注其一：【已确认】【候选】【未验证/开放】【设计已锁·现码未对齐】【视频规格】【仓库回退】【历史冲突·以较新为准】

## design-memo 结构（中文、紧凑、可核验）
1. 范围与非目标
2. 视频规格主线（①–⑯ 对应机制，按学习/存储/补全/色滤波/时间展开/层间/差集/目标反查组织）
3. 已确认校准边界与 C0←状态三因子（视频未讲清的接口：标【开放】；禁止发明已批准公式）
4. 与状态/输入/动作的 L-* 接线契约（只写边界与信号方向；端口归属可讨论）
5. 现码差距（light-line 仍改下行 W 等）→ 标【设计已锁·现码未对齐】
6. 开放问题（尤其：状态三因子写入 C0 是改 ρ 还是另账、与共闪顺序/叠加）
7. 下一步可核验项（不写实现代码）

禁止把候选写成已确认。动画成功 ≠ 机制已验证（mechanismValidated: false）。
写完后用简短摘要列出新建文件路径。
