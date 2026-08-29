---
id: SPEC-product-series-pages
companions: []
sources:
  - ../../planning-artifacts/prds/prd-JP-Website-2026-07-20/addendum.md
  - ../../planning-artifacts/architecture/architecture-JP-Website-2026-07-21/SOURCE-RECONCILIATION-EPIC2-2026-08-21.md
  - ../../planning-artifacts/epics.md
---

> **Canonical contract.** This SPEC is the complete, preservation-validated contract for the public product page model.

# 產品系列頁面模型

## Why

網站頁面結構必須直接反映 Excel 的產品層級，讓買方以產品系列為唯一技術內容單位，避免為顯示欄位、分類值或大量型號產生重複、薄弱或難以維護的公開頁面。

## Capabilities

- **CAP-1**
  - **intent:** 專業買方可在每個已發布產品系列的唯一正式頁面查看該系列與所有已核准型號規格。
  - **success:** V1 發布 22 個合併 canonical 系列；每個唯一產品系列只產生一個 `/zh-tw/series/{slug}` canonical 頁面及一張產品總覽卡片，所有已核准型號不論數量都呈現在同頁的規格表資料列中，不產生已被取代的 28 張拆分卡片或拆分系列頁。
- **CAP-2**
  - **intent:** 專業買方可使用產品名稱、品牌與用途理解或篩選產品系列，而不必進入額外分類頁面。
  - **success:** 產品名稱、品牌與用途只出現在系列內容、顯示欄位或產品總覽篩選狀態；公開路由與 sitemap 不產生產品名稱、品牌或用途獨立頁面。

## Constraints

- Excel 的 `產品系列` 欄位是系列頁分組標準；`型號` 欄位只能產生系列頁規格表資料列。
- 每筆來源型號必須恰好歸屬一個已核准 canonical 系列；未歸屬、重複歸屬或未知系列必須阻擋匯入／發布，不得靜默遺失。
- 品牌與用途資料及產品總覽篩選能力必須保留，但 `/zh-tw/brands/*` 與 `/zh-tw/purposes/*` 不得成為公開頁面。
- V1 每個系列恰屬一個已核准泵浦類型；VBSG 僅屬「臥式泵」，不得建立 Series 多泵浦類型或 Model-level 泵浦類型資料模型。
- 系列 stable ID、slug 與關聯仍由受治理資料維護，不得從可變顯示名稱推導身分。

## Non-goals

- 不建立產品名稱頁、品牌頁、用途頁或個別型號頁。
- 本次不取消泵浦類型公開頁。

## Success signal

從產品總覽以品牌、用途、泵浦類型或搜尋條件找到任一系列時，22 張 canonical 系列卡片的所有入口都抵達各自唯一系列 URL，且該頁完整呈現該系列所有已核准型號；品牌與用途不出現在公開路由或 sitemap。

## Assumptions

- 泵浦類型未列入本次取消清單，因此既有泵浦類型公開頁保留；每個系列在 V1 只出現在一個已核准泵浦類型分類中。
