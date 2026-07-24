# 重構與設計建立：結論、修正方針與優先級

**日期：** 2026-07-24（第二輪 Party 覆核）  
**來源：** BMAD Party Mode（Mary / John / Sally / Winston / Amelia / Paige）  
**對照：** `docs/architecture-current-state.md`、`docs/folder-structure-review.md`、`docs/design-usage.md`、`docs/design-system.md`、`docs/refactor-componentization.md`、`ARCHITECTURE-SPINE.md`、`DESIGN.md`、`EXPERIENCE.md`、`AGENTS.md`

## 1. 一句結論

應用已在倉庫根、`content/` + `data/` 已分、token 與部分 UI primitive／catalog 元件已落地；下一波**不是再搬目錄**，而是閉環「單一讀取契約 + 去掉硬編碼對照 + 設計使用規則可執行」，並依**會不會讓錯誤規格／信任面不一致上線**排優先級。

## 2. 現況勾選（第二輪覆核）

| 項目 | 狀態 | 證據／備註 |
| --- | --- | --- |
| App 在倉庫根 | ✅ | 業主覆寫；見 `folder-structure-review.md` |
| `content/` + `data/` 單一來源 | ✅ | 無 `src/data` 雙份 |
| `src/features/{catalog,content,navigation}` | ✅ 已引入 | catalog／部分 content／nav 已分域 |
| `src/components/ui/*` primitives | ✅ | PageShell、Heading、SectionHeader、ButtonLink、MissingValue、EmptyState |
| Catalog typed loader | ✅ | `load-catalog.ts` + `load-pages.ts`；路由／nav 無直接 JSON import |
| `PUMP_TYPE_ID_MAP` 離碼 | ✅ | 對照改為 `catalog-types.json` 的 `sourceLabels`；loader／import／validate 共用 |
| 設計使用契約文件 | ✅ | `design-usage.md` + `design-system.md`（需收斂角色，見 §5） |
| Gateway 單一實作 | ✅ | Home 改用 `GatewayBlock`（含 desktop expand CSS） |
| starter SVG 清理 | ✅ | 已刪 `public/file.svg`、`globe.svg`、`window.svg` |
| AD-12 規劃 reconcile | ❌ | Spine／PRD 仍寫 `/website` |

## 3. 明確不做（本波邊界）

- 不回退到 `website/` 巢狀應用根（業主覆寫有效；規劃 reconcile 另開任務）。
- 不上 CMS / DB / admin / 聯絡表單後端 / analytics。
- 不上 Storybook、shadcn 全量、或第二套 UI 框架／狀態庫（無證明的 a11y 缺口不新增）。
- 不發明產品數值、夥伴關係、聯絡資訊或未核准文案；缺值維持 `未提供`。
- 不為儀式感強行加入根 `layout.tsx`（除非另決策）；現況可先文件化。
- 不把 npm→pnpm 當 P0（不擋功能與正確性）。
- 不改色板／字體棧（需先 reconcile `DESIGN.md`）。

## 4. 兩條主線

| 主線 | 目標 | 成功長相 |
| --- | --- | --- |
| **A. 重構（資料與模組契約）** | Git 單一真相、typed loader、feature 邊界乾淨 | 頁面不直接 import 受治理 JSON；taxonomy 對照不在程式常數；gateway／死碼無雙軌 |
| **B. 設計建立（使用契約）** | DESIGN／EXPERIENCE 可被實作遵守 | token 唯一色源；四種 section 語言；Contact 深色面規則明確；禁止頁內硬編碼視覺值 |

---

## 5. 文件角色收斂（第二輪新增）

避免「同一件事三份文件打架」：

| 文件 | 角色 | 規則 |
| --- | --- | --- |
| **本文件** | 優先級、修正方針、現況勾選、執行順序 | 排工唯一入口 |
| `docs/design-usage.md` | 怎麼用／禁止什麼（PR 自檢） | 視覺執行契約 |
| `docs/design-system.md` | 元件化語意與審美落點 | 不另立色板；細節衝突以 `DESIGN.md` > `design-usage.md` > 本檔 |
| `docs/refactor-componentization.md` | UI 切片工單（Phase A/B/C） | 服從本檔優先級；不得把 P2 抬成 P0 |
| `_bmad-output/planning-artifacts/**` | 權威需求／架構／UX | 唯讀，除非正式 reconcile |

**已決議衝突：`GatewayBlock`**

- ❌ 舊說「未使用 → 直接刪」過於粗糙。
- ✅ 正確方針：**升級為唯一 gateway（含 expand），刪 Home 內聯**（對齊 `refactor-componentization.md` B2）；雙軌消除後才刪殘留 stub。
- 排入 **P1-4**（見下），不擋 P0 資料契約。

---

## 6. 優先級與修正方針

### P0 — 必須先做（正確性／單一真相）

| ID | 項目 | 問題 | 修正方針 | 完成定義 |
| --- | --- | --- | --- | --- |
| P0-1 | 統一內容讀取路徑 | ~~直接 import JSON~~ → **已完成** | `src/lib/content/load-pages.ts` + Zod（`pages.ts`）；layout 傳 `site` 給 Header／Footer | ✅ 路由與 nav 無直接 JSON import；`validate` + `build` 通過 |
| P0-2 | 移除 `PUMP_TYPE_ID_MAP` 硬編碼 | ~~loader 內 map~~ → **已完成** | `catalog-types.json` 的 `sourceLabels`；`pump-type-labels.ts`；import 讀同一份 | ✅ 程式內無硬編碼 map |
| P0-3 | 驗證擋住漂移 | ~~僅人記得~~ → **已完成** | `validate-content.mjs` 檢查 label 對照、site nav type ids、page 檔存在 | ✅ 缺對照時 validate exit 1 |

### P1 — 緊接（信任面一致／可維護／防回歸）

| ID | 項目 | 問題 | 修正方針 | 完成定義 |
| --- | --- | --- | --- | --- |
| P1-1 | 設計 token 使用契約落地 | 文件已有；抽樣頁已走 token／primitives | 依 `design-usage.md` §2；禁止頁／元件寫 DESIGN 已定義 `#hex` | ⚠️ 抽樣通過（company／services／contact／partners）；其餘頁持續稽核 |
| P1-2 | Section 語言（四種） | 各頁易各自發明 | Hero／Evidence／Contact 經 primitives 對齊 | ⚠️ 部分落地；首頁肥區塊拆分仍屬 P2 |
| P1-3 | Contact 深色面規則 | 聯絡頁易變另一站 | Contact 用 `--color-contact-*` + PageShell／SectionHeader／contactPill | ✅ 深色面契約維持 |
| P1-4 | Gateway 單軌 + 死碼／starter | Home 內聯 vs GatewayBlock；starter SVG | **已完成**：`GatewayBlock` 為唯一實作；刪 `file`／`globe`／`window`.svg | ✅ |
| P1-5 | AD-12／路徑規劃 reconcile | Spine／PRD 仍寫 `/website` | 另開規劃任務 | ❌ 未做（可平行） |
| P1-6 | 靜態頁套用 UI primitives | company／partners／services／contact | PageShell／SectionHeader／ButtonLink／EmptyState | ✅ |

### P2 — 可排期（工具鏈與強化）

| ID | 項目 | 問題 | 修正方針 | 完成定義 |
| --- | --- | --- | --- | --- |
| P2-1 | npm → pnpm | 偏離 Spine seed | 鎖定 pnpm 版本、換 lockfile、更新 `AGENTS.md` | ❌ **本輪未做**（lockfile／CI 另開） |
| P2-2 | 根 `layout.tsx` | 與官方 scaffold 慣例不同 | **決策：`[locale]/layout` 即文件根**；見 `architecture-current-state.md` | ✅ 已文件化 |
| P2-3 | Feature 邊界加固 | 首頁仍肥 | 拆 `features/home/*` sections | ✅ Home 已拆 |
| P2-4 | E2E 煙測補強 | 關鍵旅程 | `tests/e2e/p2-journeys.spec.ts` | ✅ |
| P2-5 | engines 鎖 Node 24 | engines 偏寬 | `package.json` → `>=24` | ✅ |
| P2-6 | Header 拆 Server／Client | 整顆 client | Server `Header` + `NavTextLink`／Dropdown／Mobile islands | ✅ |

---

## 7. 建議執行順序（實作切片）

1. **P0-2 + P0-3**（對照表進資料 + validate）  
2. **P0-1**（頁面／nav 改走 loader）  
3. **P1-4**（Gateway 單軌 + starter 清理）  
4. **P1-6 → P1-1 → P1-2 → P1-3**（primitives + 設計契約落地）  
5. **P1-5**（規劃 reconcile，可與實作平行）  
6. **P2** 依產能插入（Home 拆分、pnpm、E2E、engines）

---

## 8. 驗證指令（完成時必跑）

```bash
npm run validate
npm run lint
npm run build
npm test
```

未跑過的檢查不得宣稱通過。

## 9. 與既有文件關係

| 文件 | 角色 |
| --- | --- |
| `_bmad-output/planning-artifacts/**` | 權威需求／架構／UX（唯讀，除非正式 reconcile） |
| `docs/architecture-current-state.md` | 架構差距現況 |
| `docs/folder-structure-review.md` | 目錄與 AD-12 覆寫紀錄 |
| `docs/design-usage.md` | 設計使用契約（怎麼用／禁止什麼） |
| `docs/design-system.md` | 實作層設計系統／元件語意 |
| `docs/refactor-componentization.md` | UI 元件化工單 |
| **本文件** | 重構＋設計建立的**優先級與修正方針**；實作與 review 依此排工 |

---

## 10. Party 共識摘要（含第二輪）

- **John：** 優先級只認用戶可見錯誤（錯規格、信任面分裂）；文件打架不算進度。  
- **Winston：** 契約三件套——loader、對照表離碼、AD-12 reconcile；`GatewayBlock` 是「接上單軌」不是「當死碼砍」。  
- **Sally：** 設計建立＝ token 契約 + 四 section + Contact 深色；`design-usage` 管禁令，`design-system` 管元件語意。  
- **Amelia：** 可測切片；pnpm／根 layout 不擋 P0；Gateway 升級前先寫回歸路徑。  
- **Mary／Paige：** 結論必須可執行、落在 `docs/` 可發現；本檔為排工入口，其餘服從。
