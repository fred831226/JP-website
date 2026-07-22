---
review: lean-rubric
target: ARCHITECTURE-SPINE.md
intent: validate
date: 2026-07-22
verdict: update-required-before-implementation
---

# Architecture Review — Rubric + Lean V1

## Gate verdict

**UPDATE REQUIRED BEFORE IMPLEMENTATION。** Spine 的主方向正確：Next.js、static-first、無後端／資料庫／CMS、Vercel 部署，很適合 JP PUMP V1；但目前把小型企業型錄網站規格化成接近平台級的資料治理、測試與營運系統，而且尚未處理現有 `website/` 起始包與目標架構的直接衝突。建議保留 6–8 個真正會防止實作者分歧的架構決策，其餘移回 PRD、內容作業手冊或 Deferred。

機械檢查：`lint_spine.py` 通過，0 findings。以下均為語意與範圍問題。

## Critical

無立即安全或資料遺失級 Critical finding。

## High findings

### H1 — 目標架構與現有 `website/` 起始包相反

- **分類：MUST KEEP**（Next.js App Router + Vercel + 無資料庫）；同時 **DELETE/DEFER** 現有不相容工具。
- **證據：** Spine AD-1／AD-2／AD-12 指定 Next.js、Vercel、無資料庫；但 `website/package.json` 的執行入口是 `vinext`，另含 Vite、Cloudflare plugin、Wrangler、Drizzle ORM／Kit，且存在 `worker/`、`db/`、`drizzle/`。
- **風險：** 若直接在現有起始包上開發，兩位實作者可能一位沿用 Cloudflare/Vinext/Drizzle，另一位依 Spine 建 Next/Vercel，形成兩套部署與資料路徑。
- **建議：** 若現有 `website/` 沒有值得保留的正式功能，直接以乾淨的 Next.js App Router 專案取代，比撰寫 Vinext→Next 相容層更省事。至少移除 `vinext`、Vite、Cloudflare、Wrangler、Drizzle、`db:*` script 與相關資料夾；不要為保留模板而保留未使用依賴。

### H2 — 篩選布林規則互相矛盾

- **分類：USER DECISION**；建議採目前 UX／mockup 行為。
- **證據：** Architecture AD-9 與 PRD FR-7 規定「同一維度 OR」；final `EXPERIENCE.md` 與現行產品總覽 mockup 則規定／實作「泵浦類型 OR、用途 AND」。mockup 以 `state.tags.every(...)` 要求符合所有用途。
- **風險：** 這是使用者看得到的核心功能，且會改變結果數、URL 還原與測試答案，不能留給開發者自行選擇。
- **建議決策：** 品牌單選；泵浦類型多選 OR；用途多選 AND；不同維度仍為 AND。若這就是使用者喜歡的現行模式，應同步覆寫 PRD 與 AD-9。

### H3 — Spine 還保留已被移除的排序狀態

- **分類：DELETE/DEFER**。
- **證據：** 使用者已明確移除排序，現行 Product overview mockup 也沒有排序；但 AD-9 仍提到 filtered/search/**sorted** URLs，Consistency Conventions 仍列 optional governed `sort`。
- **風險：** 開發者可能重新加回 UI，或建立永遠用不到的 URL／schema／analytics 分支。
- **建議：** 從 V1 URL schema、DTO、測試與分析全部移除 `sort`；日後真的有足夠產品量與明確排序需求再新增。

### H4 — Hexagonal／provider-neutral 架構對此 V1 過重

- **分類：SIMPLIFY**。
- **證據：** Design Paradigm 與 AD-13 要求 `ContentRepository`、`CatalogRepository`、`MediaRepository` ports、provider-neutral DTO、adapters、composition root，並為未知的 V2 CMS 預先隔離。
- **風險：** 目前只有約 10 個系列、靜態檔案、單一 Next.js 站點與單一維護者；多層 ports/adapters/DTO 會增加檔案、映射與測試，卻沒有第二個 provider 可證明抽象正確。
- **建議：** 改成「static-first modular Next.js」即可。頁面不得直接散落重複內容仍保留；每個 domain 使用 typed loader + validated data 即可。未來真的選 CMS 時，再從當時的資料模型抽出 adapter。不要為假設的 V2 先付 V1 成本。

### H5 — 發布、測試、監控與復原門檻是平台級，不符合風險

- **分類：SIMPLIFY**。
- **證據：** AD-4／AD-6／AD-14／AD-17 與 NFR 要求 release manifest、hash、完整 disposition、media checksum、Chromium/WebKit/Firefox Playwright、axe、人工 screen reader、491-row、404/redirect、Preview isolation、rollback 等全矩陣，以及季度復原演練、99.9%／4 小時 RTO、RUM／browser error／external uptime 等。
- **風險：** 這些要求會讓內容網站的 CI、工具與作業文件成為主要工程量，延後真正重要的產品資料與頁面上線。
- **建議最低門檻：** `typecheck/lint/build`、產品 schema／必要欄位與單位、連結檢查、代表性手機寬度、鍵盤基本流程、單一瀏覽器核心 smoke test、491-row 頁面實測、Vercel Preview 人工確認。Safari／Firefox、axe 與 rollback 在上線前做一次針對性檢查；不要求季度演練、自建 RUM 或正式 SLO。

## Medium findings and scope decisions

| 項目 | 分類 | Lean V1 建議與理由 |
|---|---|---|
| Next.js App Router、Server Components 優先、靜態產生 | **MUST KEEP** | 直接防止 SPA／CSR 漂移，也符合 SEO 與 Vercel。Client Component 僅用在篩選、menu、dialog、動畫。 |
| 無 backend、database、CMS、auth、admin、API、server form | **MUST KEEP** | 這是最大幅度降低成本與風險的決策。V1 聯絡用 `tel:`／`mailto:`。 |
| Git 作為公開內容與產品資料來源 | **MUST KEEP** | 低更新頻率且由指定維護者處理；Git commit + Preview 已足夠。 |
| 系列頁 + 型號資料列，不做 603 個型號頁 | **MUST KEEP** | 正確控制頁數與重複內容；491-row 極端案例應保留實測。 |
| 產品資料 schema、單位、缺值與技術覆核 | **MUST KEEP** | 錯誤泵浦規格是此網站少數真正高風險事項；這裡應維持嚴謹。 |
| 公司／合作關係／案例與圖片權利 | **MUST KEEP** | 只需可追溯到來源與核准，不必為每張圖片建立平台級 checksum／promotion 狀態機。 |
| Tailwind CSS | **DELETE/DEFER** | 現有 HTML mockup 已以一般 CSS 表達完整設計。若乾淨 Next.js scaffold 尚未依賴 Tailwind，使用 CSS Modules／global tokens 即可；只有團隊已大量使用 Tailwind 時才保留。 |
| Zod | **SIMPLIFY** | 不把它當架構核心。若產品 JSON/Excel 匯入確實需要 runtime validation，可保留單一 Zod schema；若資料直接是 typed TS 且有簡單檢查，可先不加。 |
| Headless UI／component framework／client state store／data-fetch cache | **DELETE/DEFER** | 原生 button、details、dialog、URLSearchParams 與 React state 足夠。只有實測無障礙缺口才新增單一針對性 library。 |
| 自訂 content/catalog/media 工具套件 | **SIMPLIFY** | 初始 Excel 正規化可是一支可重跑 script；日常內容用固定 JSON/TS/Markdown 格式。不要先建三套完整 CLI 與 release subsystem。 |
| 媒體 manifest、stable media ID、checksum | **SIMPLIFY** | 保留核准 web 圖、alt、來源／權利備註與原檔外部備份即可。只有大量重複引用或實際遺失問題才引入 manifest/checksum。 |
| Vercel Preview → Production、rollback | **MUST KEEP** | 直接使用 Vercel/Git 原生能力，不自建發布系統。Preview 人工確認後合併 production branch 即可。 |
| Vercel 商用方案 | **MUST KEEP** | JP PUMP 是商業公司網站；Vercel 官方規則指出 Hobby 僅供 personal/non-commercial，商用需 Pro 或 Enterprise。需接受 Pro 成本或另選允許商用免費託管，不能把 Hobby 當正式方案。 |
| 精確固定未來 patch versions | **SIMPLIFY** | Next.js 16.2 系列可由官方 release 證實，但 Spine 的 16.2.10 與現有 package 的 16.2.6 已不同。由乾淨 scaffold／lockfile 固定實際版本；Spine 只固定 major 路線與更新政策。 |
| GA4 自訂事件 + `TelemetryPort` + consent adapter | **USER DECISION** | 若 V1 真要量測電話／Email 點擊，做最小 GA4 事件即可；若不會定期看報表，整體延後。Search Console 建議保留，成本低且更貼近自然搜尋目標。不要為可替換 analytics provider 建 port。 |
| 99.9% availability、4h RTO、自訂監控/RUM | **DELETE/DEFER** | Vercel 平台狀態與簡單外部 uptime check 已足夠；家庭企業網站不需要內部 SLO 系統。保留故障時能回到上一 deployment 的操作說明。 |
| 依賴掃描與安全 headers | **SIMPLIFY** | 保留 HTTPS、MFA、無 secrets 外洩、合理 headers、依賴更新；不需建立獨立 security pipeline。 |
| WCAG 2.2 AA 全套人工 screen-reader gate | **SIMPLIFY** | 保留語意 HTML、鍵盤、focus、contrast、alt、reduced-motion、320px；上線前做一次主要流程人工檢查，不要求每次內容更新全套重跑。 |

## Candidate features that can be removed without harming the core promise

Core promise 是「找到、看懂、信任並聯絡」。下列功能不是達成它的必要條件，應由使用者決定是否留在 V1。

| 功能 | 分類 | 建議 |
|---|---|---|
| 最新資訊列表／詳細頁 | **DELETE/DEFER** | 首頁已明確不顯示 News；若公司沒有固定發文習慣，這會產生空頁與維護責任。建議 V2 有真實內容節奏再做。 |
| 獨立合作夥伴頁 | **USER DECISION** | 若只有少數 Logo／短介紹，可合併到公司頁或首頁；有多個需完整說明的品牌關係才保留獨立頁。 |
| 每個建案的 Project detail | **USER DECISION** | V1 可只做一頁「服務與實績」加完整案例區塊；案例數、文字與照片足夠時再拆詳細頁。這會明顯減少 slug、SEO、redirect 與內容 schema。 |
| Brand／Pump type／Use case 專屬可索引頁 | **USER DECISION** | 產品總覽 query filter 已能探索。只有能為重要分類撰寫真正獨特內容、且要投資 SEO 時才生成專頁；否則先延後，避免薄內容與額外模板。 |
| 首頁 5 秒照片輪播 | **USER DECISION** | 使用者喜歡動態可保留，但只用 CSS／極少 JS 播一次；不要導入 carousel framework。若時程吃緊，單張 Hero 仍完整達標。 |
| 首頁 gateway hover/focus 欄寬互動 | **SIMPLIFY** | 可用純 CSS `flex-grow` + reduced-motion；不建立 animation system 或第三方 motion library。觸控版維持靜態。 |
| 產品圖片放大 | **SIMPLIFY** | 保留目前「點擊直接放大」需求，以原生 `<dialog>` 或最小自製 overlay 實作；不引入 lightbox package，也不保留額外的「狀態參考」頁面區塊。 |
| Contact FAQ | **DELETE/DEFER** | 沒有已核准且真的常見的問題就不做；電話、Email、地址已完成核心任務。 |
| Contact map | **USER DECISION** | 核准地址後可用普通外連 Google Maps，通常比嵌入地圖更簡單、隱私與效能成本更低。 |
| `/zh-tw/` locale prefix 與 future-English model | **USER DECISION** | 若英文站在可預見期內會做，保留 prefix；若只是抽象可能性，V1 用根路徑更簡單，未來以 redirect 遷移。這是 URL 決策，需上線前一次選定。 |
| 精細聯絡來源歸因與人工「合格詢問」流程 | **DELETE/DEFER** | 小流量可由家人／公司人工詢問「從哪裡看到」；不需先建資料模型或報表。若保留 GA4，只記錄匿名 phone/email click 類別即可。 |

## Good-spine rubric

| Checklist | Result | Notes |
|---|---|---|
| Fixes real divergence points | **PARTIAL PASS** | Next/Vercel/no backend、series/model、URL filters 都是有效決策；但 17 個 AD 中混入大量內容治理與營運細節。 |
| Every AD rule enforceable and prevents stated divergence | **PARTIAL PASS** | AD-1/2/9/11/12/16 可執行；AD-4/6/14/17 範圍過大，若不建立額外平台工具就難以完整驗證。 |
| Nothing in Deferred can silently diverge | **PASS** | CMS、assets、taxonomy、English 等皆有重訪條件。 |
| Named tech verified-current | **PARTIAL PASS** | Next.js 16.2 有官方 release；Vercel 部署／promotion 路徑成立。精確 patch 與現有 lockfile 不一致，應交給 scaffold 固定。 |
| Ratifies brownfield rather than contradicts it | **FAIL** | `website/` 是 Vinext/Vite/Cloudflare/Drizzle；Spine 沒有明示棄用／遷移路徑。 |
| Covers PRD/UX capabilities | **PASS WITH CONFLICTS** | 能力覆蓋完整，但用途 AND/OR 與排序狀態未和最新 UX 對齊。 |
| Operational/environmental envelope covered | **PASS, OVER-SPECIFIED** | Vercel、Preview、Production、rollback、domain、monitoring 全有處理；嚴謹程度超過此網站實際風險。 |
| Seed is minimal | **FAIL** | 目錄樹、三 repository ports、三 tool families、release fixtures、analytics ports、media promotion 等已接近完整 solution design，而非 lean spine。 |

## Recommended lean spine after user decisions

建議更新後只保留以下負載決策：

1. Next.js App Router，static-first，Server Components 為預設；互動局部 Client Components。
2. V1 無 backend/database/CMS/auth/API/form；所有資料在 repository，由 Vercel build 產生網站。
3. Product model 為 Brand/Type/Purpose → Series → Model rows；產品資料需 schema、單位與技術覆核。
4. Product overview 的唯一 filter/URL contract（包含用途 AND/OR 最終答案，明確無 sort）。
5. Vercel Preview/Production + Git commit 是發布與 rollback 單位；正式商用方案／帳號所有權上線前確認。
6. 使用 native HTML、project CSS/tokens 與最少依賴；不得另加 UI framework/state store/lightbox/carousel library，除非出現實測缺口。
7. SEO 基線：靜態 HTML、metadata、sitemap、正確 404/redirect、filter URLs noindex；category SEO pages 依使用者決策。
8. 必要品質：產品內容正確、手機可用、基本鍵盤／對比／alt/reduced-motion、build/link/schema checks；其餘測試與 observability 按風險增加。

## External reality checks

- Next.js 官方已發布 16.2；實際 patch 應由新 scaffold 與 lockfile 決定：<https://nextjs.org/blog/next-16-2>
- Vercel 官方方案說明將 Hobby 限於個人、非商業使用；企業網站正式部署需使用允許商用的方案：<https://vercel.com/docs/plans/hobby>
- Vercel 原生支援 Preview、Production 與 deployment promotion，無需自建發布服務：<https://vercel.com/docs/deployments/overview>

