# 架構與規劃現況審查

**審查日期：** 2026-07-24  
**審查角色：** Winston / System Architect  
**應用根目錄：** 倉庫根目錄（Vercel Root Directory = `.`；原 `website/` 已於 2026-07-24 提升至根）

## 1. 一句結論

專案已離開 Vinext/Vite/Cloudflare/Drizzle starter，進入 **Lean static-first Next.js App Router** 實作軌道，核心 AD 決策大多已被程式體現；主要技術債是**資料與元件目錄尚未對齊 Architecture Spine Structural Seed**，以及部分工具鏈細節（套件管理、根 layout）仍偏實作捷徑。

## 2. 目標架構（權威）

來源：`ARCHITECTURE-SPINE.md` + `SOURCE-RECONCILIATION-LEAN-2026-07-22.md`

| 決策 | 狀態 |
| --- | --- |
| AD-1 Next.js App Router + Server Components 預設 | 已採用（`src/app/[locale]`） |
| AD-2 V1 無應用後端 / CMS / DB | 已遵守 |
| AD-3 Git 為唯一發布權威 | 已採用（JSON + Excel intake） |
| AD-8 僅產生 `/zh-tw/`，根路徑永久導向 | 已採用（`next.config.ts` redirects） |
| AD-9 目錄篩選以 URL query 為權威 | 已部分實作（Client filter） |
| AD-11 Model 為 Series 頁內列 | 已採用 |
| AD-12 外層 repo；應用位置 | 原訂 `/website`；**已覆寫為 repo 根** | 見 folder-structure-review |
| AD-13 小型 typed server-only loaders | 已採用（`lib/content/load-catalog.ts`） |
| AD-16 Tailwind + semantic tokens | 已採用（`styles/tokens.css`） |
| AD-17 驗證腳本 + Playwright smoke | 已有骨架 |

**明確不在 V1：** News、專案詳情頁、analytics/RUM、聯絡表單、admin、資料庫。

## 3. 規劃交付對照

| Epic 焦點 | 現況觀察 |
| --- | --- |
| Epic 1 — 乾淨 Next scaffold | 已完成遷移方向；starter 遺留檔（如 `public/file.svg` 等）仍可見 |
| Epic 2 — 信任面與產品目錄 | Home / company / partners / services / products / series / taxonomy 路由已存在 |
| Epic 3–4 — 治理、驗證、SEO | `validate-content.mjs`、`robots.ts`、`sitemap.ts` 已存在 |
| 內容治理 | Excel → `catalog.generated.json`；手維 `catalog-content.json` 分離正確 |

## 4. 執行時資料流（現況）

```text
source-catalog.xlsx
        │ import-catalog.mjs
        ▼
data/catalog.generated.json  ──┐
data/catalog-content.json    ──┼──(曾與 src/data 雙份)──► load-catalog.ts ──► 路由 / UI
taxonomy JSON / page JSON    ──┘
```

風險：importer / validator 與執行期曾分別讀 `data/` 與 `src/data/`，形成**雙來源漂移**。已統一到根目錄 `data/` + `content/`（見 folder-structure-review）。

## 5. Stack 對照

| 層 | Spine Seed | 現況 | 差距 |
| --- | --- | --- | --- |
| Node | 24 LTS | engines `>=24` | OK（P2-5） |
| 套件管理 | pnpm 11.15.1 | 使用 `package-lock.json`（npm） | 偏離；**P2-1 仍待**（本輪未切） |
| Next / React | 16.2.10 / 19.2.7 | 一致 | OK |
| Tailwind | 4.3.3 + PostCSS | 一致 | OK |
| Zod | 4.4.3 | 一致 | OK |
| Playwright | 1.61.1 | 一致 | OK |
| xlsx | intake 允許 | 已裝 | OK（僅 scripts） |

## 6. 架構風險（依嚴重度）

### High

1. ~~**內容雙來源（data/ vs src/data/）**~~ — 已統一至根目錄 `data/` + `content/`。
2. ~~**Loader 內硬編碼 taxonomy 對照**~~ — 已改 `catalog-types.json` `sourceLabels`（P0-2）。

### Medium

3. ~~**缺少 `features/` 模組邊界**~~ — 已引入 `features/{catalog,content,navigation,home}`（P2-3）。
4. ~~**頁面直接 `import` JSON**~~ — 已收斂至 `load-pages`／`load-catalog`（P0-1）。
5. **無獨立 `src/app/layout.tsx`** — **P2-2 決策（2026-07-24）：** `[locale]/layout.tsx` **即文件根**（輸出 `<html>`／`<body>`）。不另加空根 layout，避免雙層 html；若未來要根 layout，必須把 document 殼上移並改 locale 為 fragment。此決策記入本檔；Spine formal reconcile 仍待 P1-5。
6. **套件管理 npm vs pnpm** — 與 Spine seed 不一致（**P2-1 未做**）。

### Low / 已知債務

7. 舊 fixture／重疊 nav 嫌疑（若仍存在）— 持續清理。
8. ~~`public/` Next starter SVG~~ — 已刪（P1-4）。
9. `partners.json` 為空陣列 — 刻意「尚無已核准夥伴」空態。

## 7. 與規劃文件的關係

- `_bmad-output/planning-artifacts/**`：**唯讀權威**；本審查不覆寫其決策。
- `docs/**`：現況與結構對齊紀錄，供實作與維運。
- `docs/operations/`：維運入口（應用已在根目錄，不再需要 `website/docs/operations/` 鏡像路徑）。

## 8. 建議下一波架構工作（非本次必做）

1. 將所有頁面 JSON 讀取收斂到 `lib/content/*` loaders，並以 Zod 驗證。
2. 凍結 catalog schema v1，移除 loader 內硬編碼 map。
3. 切換 pnpm、更新 `AGENTS.md` 指令。
4. 補根 `layout.tsx`（或文件化「locale layout 即根」為明確 AD）。
5. Preview `noindex` + 存取保護、正式網域交接 runbook（operations）。
