---
id: SPEC-product-series-pages
companions: []
sources: []
---

> **Canonical contract.** This SPEC is the complete, preservation-validated contract for the public product page model.

# 產品系列頁面模型

## Why

網站頁面結構必須直接反映 Excel 的產品層級，讓買方以產品系列為唯一技術內容單位，避免為顯示欄位、分類值或大量型號產生重複、薄弱或難以維護的公開頁面。

## Capabilities

- **CAP-1**
  - **intent:** 專業買方可在每個已發布產品系列的唯一正式頁面查看該系列與所有已核准型號規格。
  - **success:** 每個唯一產品系列只產生一個 `/zh-tw/series/{slug}` canonical 頁面，所有已核准型號不論數量都呈現在同頁的規格表資料列中。
- **CAP-2**
  - **intent:** 專業買方可使用產品名稱、品牌與用途理解或篩選產品系列，而不必進入額外分類頁面。
  - **success:** 產品名稱、品牌與用途只出現在系列內容、顯示欄位或產品總覽篩選狀態；公開路由與 sitemap 不產生產品名稱、品牌或用途獨立頁面。

## Constraints

- Excel 的 `產品系列` 欄位是系列頁分組標準；`型號` 欄位只能產生系列頁規格表資料列。
- 品牌與用途資料及產品總覽篩選能力必須保留，但 `/zh-tw/brands/*` 與 `/zh-tw/purposes/*` 不得成為公開頁面。
- 系列 stable ID、slug 與關聯仍由受治理資料維護，不得從可變顯示名稱推導身分。

## Non-goals

- 不建立產品名稱頁、品牌頁、用途頁或個別型號頁。
- 本次不取消泵浦類型公開頁。

## Success signal

從產品總覽以品牌、用途、泵浦類型或搜尋條件找到任一系列時，所有入口都抵達同一系列 URL，且該頁完整呈現該系列所有已核准型號；品牌與用途不再出現在公開路由或 sitemap。

## Assumptions

- 泵浦類型未列入本次取消清單，因此既有泵浦類型公開頁暫時保留。
