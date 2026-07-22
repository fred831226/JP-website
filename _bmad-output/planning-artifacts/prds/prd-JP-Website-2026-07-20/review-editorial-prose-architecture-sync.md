# Architecture Sync Editorial Prose Review

Scope: only wording introduced or made ambiguous by the Architecture synchronization across `prd.md`, `addendum.md`, `DESIGN.md`, and `EXPERIENCE.md`. Reader type: `llm`. Frontmatter, markup, code identifiers, and intentional technical terminology were excluded.

| Original Text | Revised Text | Changes |
|---------------|--------------|---------|
| `品牌、泵浦類型、應用情境…` / `正式品牌／泵浦類型／用途內容頁…` / `品牌、泵浦類型、用途、系列…` (`prd.md` 21, 24；`addendum.md` 15；其他同步段落同類用法) | 第一次出現時統一為 `用途（資料模型名稱：應用情境）`；之後公開介面使用 `用途`，資料治理與匯入語境使用 `應用情境`。 | `EXPERIENCE.md` 已定義兩詞指同一分類，但 PRD／addendum 的同步文字未帶入此規則。明示語境可避免 LLM 建立兩個 taxonomy dimensions 或混用公開標籤。 |
| `直接進入建案實績頁` / `撰寫建案實績頁 Hero…` (`prd.md` 153, 187；`addendum.md` 73, 110) | `直接進入「服務與實績」頁` / `撰寫「服務與實績」頁 Hero…` | 同一 V1 route 在同步後同時被稱為「建案實績頁」與「服務與實績頁」；統一正式頁名，避免下游建立第二個頁面或 route。 |
| `所有變更…經 JP PUMP 確認後才升為 Production。`；`再將已核准部署升為 Production。` (`addendum.md` 16, 39) | `所有變更須通過驗證，並由 JP PUMP 核准對應的 source commit；Production 可使用正式環境設定從該 commit 重新建置。` | 原文暗示 Preview deployment artifact 直接晉升，但同步後的 Architecture／`EXPERIENCE.md` 明定核准綁定 source commit，Production 可重新建置。統一部署主詞與核准對象。 |
| `只有真正需要長文時才使用不可執行的 Markdown。` (`addendum.md` 15) | `只有內容模型明確指定的長文欄位才使用不可執行的 Markdown。` | 「真正需要」沒有可判定條件；改為模型明確指定，讓格式選擇可執行且不依賴 LLM 自行判斷。 |
| `其他前端函式庫、UI 工具、驗證、測試及分析套件由架構依必要性選擇…` (`addendum.md` 29) | `其他前端函式庫、UI 工具、驗證及測試套件由架構依必要性選擇；V1 不加入已延後的分析套件。` | 同一同步版本已明定 GA4／RUM／聯絡歸因延後；保留「分析套件依必要性選擇」可能被 LLM 解讀為可在 V1 自行加入。 |
| `第 10–12 個月檢視網站是否協助來電／Email 對象找到產品或驗證公司…` (`prd.md` 42) | `第 10–12 個月檢視網站是否協助透過電話或 Email 聯絡的對象找到產品或驗證公司…` | 「來電／Email 對象」將管道與人混為同一並列項；改寫後受詞明確。 |

