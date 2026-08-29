---
title: '更新產品篩選頁為四大泵浦類型'
type: 'feature'
created: '2026-08-18'
updated: '2026-08-21'
status: 'done'
baseline_commit: 'a53d70164933883789b8594d1d6f2a55ff442c84'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics.md'
---

> **2026-08-21 requirement correction:** The project owner approved 22 combined canonical Series and superseded the prior 28-card/split-page assumption. This historical implementation spec and its `done` status do not prove Epic 2 acceptance; remediation is governed by Epic 2 Story 2.8 and requires a new Code Review.

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** 產品篩選頁與導覽仍公開 16 個舊類型，與兩份指定 Excel 一致採用的四大分類不符。

**Approach:** 將「臥式泵、沉水式揚水泵、沉水式污水泵、立式楊水泵」設為唯一正式分類。一次性遷移現有系列資料，之後由匯入與驗證流程只接受四個正式值，不保留執行階段的舊類型映射。

## Boundaries & Constraints

**Always:** 保留 `Opencode` 未提交變更與全部系列／型號；只採用 Excel 四類；資料、篩選、導覽及標籤一致；維持類型 OR、跨維度 AND、分享 URL 與鍵盤操作；公開目錄採 22 個合併 canonical 系列與 22 張對應卡片，不建立 28 張拆分卡片或拆分系列頁。

**Ask First:** 修改指定 Excel、移除產品資料、變更品牌／用途、刪除路由或處理舊類型轉址前先確認。

**Never:** 不改規劃文件、不推測資料、不新增後端、不重做其他功能、不還原既有修改。

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| 四類篩選 | `/zh-tw/products` | 只顯示四個核定名稱 | 舊細分類不公開 |
| 資料遷移 | 系列仍用舊類型 | 改為 Excel 對應四類 | 未知值阻擋驗證 |
| 組合條件 | 多類型或品牌＋類型 | OR／AND、URL 與標籤一致 | 沿用既有空狀態 |

</frozen-after-approval>

## Code Map

- `website/data/source-catalog.xlsx`、兩份 `catalog.generated.json` -- 匯入來源與現有系列分類。
- `website/src/data/catalog-types.json`、`website/src/data/site.json` -- 公開分類與導覽入口。
- `website/src/lib/content/load-catalog.ts` -- 四類名稱至穩定 ID 的載入邊界。
- `website/scripts/import-catalog.mjs`、`website/scripts/validate-content.mjs` -- 匯入與內容驗證。
- `website/tests/e2e/smoke.spec.ts` -- 產品篩選瀏覽器驗證。

## Tasks & Acceptance

**Execution:**
- [x] `website/data/source-catalog.xlsx`、兩份 `catalog.generated.json` -- 依指定修正版遷移四類並保留現有資料。
- [x] `website/src/data/catalog-types.json`、`website/src/data/site.json` -- 只保留四類與一致入口。
- [x] 載入、匯入及驗證程式 -- 只接受四類，未知值使驗證失敗。
- [x] `website/tests/e2e/smoke.spec.ts` -- 覆蓋四類選項、代表系列、類型 OR 與品牌交集。
- [x] 執行驗證並確認既有未提交變更仍保留。

**Acceptance Criteria:**
- Given 產品頁，when 查看類型，then 只見四個指定名稱且導覽 ID 一致。
- Given 已發布系列，when 驗證資料，then `pumpType` 是四類之一且符合 Excel。
- Given 組合條件，when 套用或移除，then 結果、標籤、URL 與 OR／AND 規則一致。
- Given 完成修改，when 比對 diff，then 原有產品資料與系列頁變更仍保留。

## Spec Change Log

- `2026-08-21` — Project-owner correction: replace the 28-card/split-page assumption with 22 combined canonical Series; classify VBSG only as `臥式泵`; defer review remediation and proof of acceptance to Epic 2 Story 2.8 without rewriting historical execution evidence.

## Design Notes

沿用四個核心 ID；舊細分類 ID 不再有效，永久轉址不在本次範圍。第四類依 Excel 顯示「立式楊水泵」。每個 V1 Series 只屬一個正式 Pump Type；VBSG 僅屬「臥式泵」，不得為它建立多類型或 Model-level Pump Type 資料。

## Verification

**Commands:**
- `npm --prefix website run validate` -- 四類、系列關聯及公開內容驗證通過。
- `npm --prefix website run lint` -- 無 ESLint 錯誤。
- `npm --prefix website run build` -- Next.js 正式建置成功，四類相關頁面可生成。
- `npm --prefix website test -- --grep "產品"` -- 產品篩選相關 E2E 測試通過。

## Suggested Review Order

**資料權威與可重現匯入**

- 四個正式名稱是匯入邊界，未知或混類資料立即失敗。
  [`import-catalog.mjs:17`](../../website/scripts/import-catalog.mjs#L17)

- 人工用途與發布狀態改由明確治理來源保存。
  [`catalog-overview-governance.json:1`](../../website/data/catalog-overview-governance.json#L1)

- 匯入只合成 Excel 與治理檔，不再沿用舊輸出。
  [`import-catalog.mjs:130`](../../website/scripts/import-catalog.mjs#L130)

**驗證、taxonomy 與載入邊界**

- 驗證四類 ID、名稱、slug、首頁與導覽完全一致。
  [`validate-content.mjs:55`](../../website/scripts/validate-content.mjs#L55)

- Excel 與 generated 逐系列、型號雙向核對，防止靜默漏匯。
  [`validate-content.mjs:86`](../../website/scripts/validate-content.mjs#L86)

- Loader 僅接受四個正式名稱並輸出唯一穩定 ID。
  [`load-catalog.ts:47`](../../website/src/lib/content/load-catalog.ts#L47)

- 公開 taxonomy 與導覽只保留四個核心入口。
  [`catalog-types.json:3`](../../website/src/data/catalog-types.json#L3)
  [`site.json:9`](../../website/src/data/site.json#L9)

**靜態可爬取與即時篩選**

- Server Component 永久輸出 22 張 canonical 系列卡片；不依既有公開頁治理拆分為 28 張卡片，Client island 只切換可見性。
  [`page.tsx:82`](../../website/src/app/%5Blocale%5D/products/page.tsx#L82)

- 共用 query 正規化會過濾、去重並產生 canonical URL。
  [`catalog-query.ts:27`](../../website/src/lib/catalog-query.ts#L27)

- Client island 同步 URL、OR／AND 結果與空狀態。
  [`CatalogBrowser.tsx:32`](../../website/src/components/CatalogBrowser.tsx#L32)

- 受控搜尋輸入會跟隨瀏覽器前進與後退狀態。
  [`CatalogFilter.tsx:19`](../../website/src/components/CatalogFilter.tsx#L19)

**驗收測試**

- 無 JavaScript 時仍保留所有系列的 crawlable links。
  [`smoke.spec.ts:57`](../../website/tests/e2e/smoke.spec.ts#L57)

- 舊 ID、錯值、空值與重複 query 會自動清理。
  [`smoke.spec.ts:67`](../../website/tests/e2e/smoke.spec.ts#L67)

- 實際點擊覆蓋 type OR、brand AND、移除與 URL 同步。
  [`smoke.spec.ts:110`](../../website/tests/e2e/smoke.spec.ts#L110)
