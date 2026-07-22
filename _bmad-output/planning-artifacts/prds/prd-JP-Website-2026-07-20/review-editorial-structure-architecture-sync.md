# Architecture Sync Editorial Structure Review

## Document Summary

- **Purpose:** 確認同步後的 PRD、補充資料與 UX spines 能作為下游人員及 LLM 產生 Epics、Stories、實作與驗收計畫的無歧義契約。
- **Audience:** 產品、UX、架構、開發、驗收人員，以及讀取這些文件的規劃型 LLM。
- **Reader type:** `llm`；採 dependency-first、單一術語、明確狀態與結構化格式原則。
- **Structure model:** Strategic/Context（Pyramid），搭配 UX Reference/Database 子文件。
- **Current length:** 約 10,493 個空白分隔詞，跨 141 個標題；其中 `prd.md` 1,624／87、`addendum.md` 702／24、`DESIGN.md` 2,869／8、`EXPERIENCE.md` 5,298／22。
- **Core question:** V1 要交付哪些公開體驗、哪些能力明確延後，以及下游實作必須遵守哪些產品、UX 與架構邊界？
- **Purpose sentence:** This document suite exists to help downstream human and LLM planners produce V1 work without reintroducing deferred scope or contradicting approved UX and architecture decisions.

### Major-section map

| File | Major sections and approximate word counts |
|---|---|
| `prd.md` | 決策摘要 148；願景 53；目標 31；成功指標 115；名詞 55；使用者旅程 85；功能 621；NFR 154；依賴與風險 239；未決／重訪 109 |
| `addendum.md` | 決策狀態 34；技術與營運 147；產品交接 51；IA／體驗 405；媒體 61 |
| `DESIGN.md` | Brand 231；Colors 181；Typography 125；Layout 423；Elevation 93；Shapes 40；Components 1,186；Do/Don't 181 |
| `EXPERIENCE.md` | Foundation 242；IA 592；Voice 98；Components 1,023；States 942；Interactions 162；Accessibility 186；Responsive 248；Integrity 180；References 295；Flows 733；Reconciliation 96；Mockups 219；Dependencies 187 |

## Recommendations

### 1. MOVE / CONDENSE — `EXPERIENCE.md` Source Reconciliation

**Rationale:** 最新的範圍與優先權規則目前位於所有互動、狀態與旅程之後；將精簡的「V1 scope and precedence」放到 `Foundation` 後，可讓 LLM 在解讀其餘 UX 契約前先取得 News、Project detail、analytics、`/zh-tw/` 與 Next.js/Tailwind 的最終狀態，來源檔名則留在 frontmatter 或短版變更紀錄。

**Impact:** 約減少 35–50 詞，並消除關鍵規則被埋藏的風險。

### 2. MERGE — PRD 的 deferred FR tombstones

**Rationale:** FR-5、FR-17、FR-19、FR-34～36 雖已清楚標為非 V1，仍以功能子章節穿插在 Active V1 requirements 中，規劃型 LLM 可能將它們誤拆為 Epic／Story；把 ID、狀態與重新啟用條件合併成 `V1 Requirement Registry` 下的一張 deferred/tombstone table，並讓第 6 章只保留 Active V1 FR，可維持 traceability 且降低誤讀。

**Impact:** 約減少 60–80 詞；這是高價值變更，因為它直接保護 V1 scope。

### 3. CONDENSE — 跨文件的架構實作重複

**Rationale:** Next.js App Router、Tailwind、唯一 repository、`/website`、舊 starter 移除與 typed loader 決策目前重複出現在 PRD 決策摘要／依賴、addendum、`DESIGN.md` 與 `EXPERIENCE.md`；應指定 Architecture Spine／addendum 為完整技術權威，PRD 僅保留產品級硬限制與引用，`DESIGN.md` 僅保留「semantic tokens 是視覺權威並由 Tailwind 組合」，避免未來版本漂移。

**Impact:** 約減少 70–100 詞，並建立單一技術來源。

### 4. PRESERVE — Active/Deferred registry 與明確 V1 IA 決策

**Rationale:** `prd.md` 的 Active V1 ID 清單，以及 Brand／Pump Type／Purpose 頁保留、Project detail／News／analytics 延後、`/zh-tw/` 保留等明確陳述，對 LLM 防止補回已刪功能非常有效；重整時應保留這些語義，只改位置與重複表達。

**Impact:** 0 詞；保留可理解性與追溯性。

## Summary

- **Total recommendations:** 4
- **Estimated reduction:** 約 165–230 詞（約 1.6%–2.2%）
- **Meets length target:** No target specified
- **Comprehension trade-offs:** 無；建議保留所有決策、ID 與重訪條件，只改善優先順序、單一來源與 Active／Deferred 分隔。
- **High-value change required:** **Yes.** 優先執行建議 1 與 2；若不處理，內容本身仍一致，但下游 LLM 有較高機率先依舊位置建立錯誤範圍，或把 tombstone 拆成 V1 工作。
