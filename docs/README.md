# JP-Website 專案文件

本目錄是倉庫層級的專案知識庫（對應 `_bmad/bmm/config.yaml` 的 `project_knowledge`）。  
正式需求、架構決策與 UX 合約仍以 `_bmad-output/planning-artifacts/` 為權威來源；此處整理**現況審查**與**結構對齊紀錄**，方便實作與維運。

> 命名說明：請求中的 `doc/` 已採主流慣例改為 `docs/`（複數）。  
> 應用位置：已依業主指示提升至**倉庫根目錄**（偏離 Spine AD-12 的 `/website`）。詳見 [folder-structure-review.md](./folder-structure-review.md)。

## 文件索引

| 文件 | 用途 |
| --- | --- |
| [architecture-current-state.md](./architecture-current-state.md) | 現況架構與規劃摘要、與權威文件對照 |
| [folder-structure-review.md](./folder-structure-review.md) | 資料夾結構 vs 主流 / Architecture Spine，含差異原因與調整紀錄 |
| [design-system.md](./design-system.md) | 實作層 Design System（Sally；視覺權威仍為 DESIGN.md） |
| [refactor-componentization.md](./refactor-componentization.md) | 元件化重構清單與 Phase 計畫（Winston） |
| [operations/README.md](./operations/README.md) | 內容更新、部署、回滾與網域交接操作入口 |

## 權威來源（勿在此覆寫決策）

- PRD：`_bmad-output/planning-artifacts/prds/prd-JP-Website-2026-07-20/`
- Architecture Spine：`_bmad-output/planning-artifacts/architecture/architecture-JP-Website-2026-07-21/ARCHITECTURE-SPINE.md`
- Source Reconciliation：`.../SOURCE-RECONCILIATION-LEAN-2026-07-22.md`
- UX：`_bmad-output/planning-artifacts/ux-designs/ux-JP-website-2026-07-21/`
- Epics：`_bmad-output/planning-artifacts/epics.md`
- Agent 邊界：根目錄 `AGENTS.md`
