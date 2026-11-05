---
status: historical-draft
mechanismValidated: false
archived_at: 2026-11-04
---

# 【历史草案·可能冲突】输入模块旧双路主线归档

【历史草案·可能冲突】本目录保存归档时的完整原文：两路观察／双目分别 ingest、输入不先配对、三维交汇留给状态侧叠出。该主线已暂搁，与当前 MC 首版单路 2D＋可锁定相机参数 K 的方向可能冲突，**勿当作当前接口**。

【历史草案·可能冲突】原文中的「当前」「用户已确认」、旧候选字段、实验设想及外部引用均保留其当时语境，不构成本轮确认。包括 v0 在内的六份副本未插入新标注、未改字句或链接；本页的历史标记覆盖这些完整副本。旧相对链接按归档前的 `modules/input/` 位置理解，归档不重新认证外部材料。

【开放/未决】`mechanismValidated: false`。保存旧论证、展示记录或几何计算不表示输入机制已验证。

## 原稿与副本

| 归档前位置（均在 modules/input/） | 完整副本 | 用途 |
| --- | --- | --- |
| README.md | [README.snapshot.md](README.snapshot.md) | 【历史草案·可能冲突】归档当时的阅读入口与确认措辞。 |
| scheme-plain-zh.md | [scheme-plain-zh.md](scheme-plain-zh.md) | 【历史草案·可能冲突】两路观察的通俗主线。 |
| design-draft-v1.md | [design-draft-v1.md](design-draft-v1.md) | 【历史草案·可能冲突】双路设计、时序与五项拍板点。 |
| interface-contract.md | [interface-contract.md](interface-contract.md) | 【历史草案·可能冲突】v1 接口全文，含必填 view_id 与分别 ingest。 |
| feasibility-minecraft-dual-ray-3d.md | [feasibility-minecraft-dual-ray-3d.md](feasibility-minecraft-dual-ray-3d.md) | 【历史草案·可能冲突】双射线条件几何论证，不是当前 MC 入口。 |
| design-draft-v0.md | [design-draft-v0.md](design-draft-v0.md) | 【历史草案·可能冲突】更早候选，含输入估计深度等可能冲突表述。 |

【候选方案】当前阅读入口是 [输入 README](../../README.md)、[通俗单路方案](../../scheme-plain-zh.md)、[设计草案 v2](../../design-draft-v2-mc-monocular.md) 和 [单路接口草案](../../interface-contract.md)。顶层 v0、v1 与双射线可行性文件只作历史指针。

## 原文完整性

【历史草案·可能冲突】下列 SHA-256 在改写顶层文件前取得，并与归档副本逐字节核对；只用于核查原文保存，不是运行时账本或机制证据。

```text
171cdf457f6bce766d345246458f3007bd0682ed394724737b5224282c368cde  design-draft-v0.md
0da534939f372193a144cbbe787c434af017e3f64d4179a0f0bba352834d2d71  design-draft-v1.md
808957a483578fd0065c819eacb738c03fc12818a5541ec25f9a4f9f57176f2b  feasibility-minecraft-dual-ray-3d.md
2d938104909bbd13363f2f4492dc0269320a23a307c7d7e6bb07c0a554e9ca7f  interface-contract.md
40263fecef39a138f184ce53c8ab4bbc2b40849a86acf54ea3dd166d7c4e8c26  README.snapshot.md
a42e7cc66a8f29ff1812174b6236f509066df50f680a60aed433b555985ec1b8  scheme-plain-zh.md
```
