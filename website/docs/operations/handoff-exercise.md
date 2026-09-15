# 第二位合格維護者交接演練紀錄

目前結果：`BLOCKED`
記錄日期：2026-08-29
阻擋原因：尚未提供可獨立操作的第二位合格維護者、company-controlled GitHub／Vercel 存取、正確 Root Directory、purchased Production domain、known-good deployment、JP PUMP 核准與外部治理證據。因此本文件目前是可執行的演練契約，不是完成證明。

不得由文件作者自演第二人，不得以私人關係、共用帳號、私人 token、口頭指示或未記錄本機知識補足證據。真正關閉 Story 3.7 AC4 時，應複製本紀錄為帶日期的受控 exercise record；保留此模板與歷史結果。

## 資格與角色

| 欄位 | 必填證據 |
|---|---|
| 第二位合格維護者識別 | 公司可追溯的角色／identifier；repository 不保存私人聯絡資料 |
| 資格 | 能使用 Git branch／commit、Node/npm、JSON、GitHub Actions、Vercel Preview、Deployment Protection、promotion／rollback dry-run，並能辨識 secret 與 redacted log 邊界 |
| 獨立性 | 非文件作者；使用自己的 MFA 身分與最小權限，未接收共用 token 或未記錄操作 |
| Observer | 第一位維護者或 release owner，只觀察與記錄；除安全阻擋外不代操作 |
| JP PUMP approver | 受控 approval role／reference，不在此文件放私人聯絡或核准秘密 |

## 演練範圍

- 變更類型：一項低風險、可核准的非產品內容更新，例如既有公司段落的核准文字修正；不得改 catalog 技術值、權利不明媒體、DNS、帳務或正式網域。
- 成功終點：第二位維護者能從乾淨 branch 完成變更、驗證、commit、push、immutable Preview 與 Preview 檢查，並正確指出 Production promotion 與 rollback 的全部前置／命令／後驗證。沒有明確 JP PUMP 核准時，演練停在 Preview，不執行 Production mutation。
- 不接受的替代證據：本機 dev server、branch alias、草稿 JSON、口頭核准、截圖但無 deployment／commit ID，或作者直接代為操作。

## 執行步驟與 evidence fields

### 1. 獨立取得環境

- [ ] Maintainer identity／資格 reference：`<required>`
- [ ] GitHub／Vercel team scope、project ID、least-privilege role、MFA 狀態由平台 redacted record 證明。
- [ ] 從 repository 文件自行找到 application root、內容 authority、驗證命令與 escalation path；Observer 記錄任何必須口頭補充的缺漏。
- [ ] 起始 `source commit`：`<40-character SHA>`；起始工作樹乾淨且無他人變更。

### 2. 完成非產品內容更新

- [ ] Governed source file／record ID：`<required>`
- [ ] JP PUMP supplied／approved change reference：`<required>`
- [ ] Diff 只有核准內容，未包含 secret、private evidence、來源文件 body、原始媒體或其他 Story 檔案。
- [ ] Candidate `source commit`：`<40-character SHA>`；push target：`<remote>/<branch>`。

### 3. 驗證

- [ ] `npm --prefix website run validate`
- [ ] `npm --prefix website run lint`
- [ ] `npm --prefix website run build`
- [ ] `npm --prefix website run test:release`
- [ ] `npm --prefix website test`
- [ ] Gate evidence artifact／digest：`<required>`；任何失敗均停止，不手改結果。

### 4. Immutable Preview

- [ ] immutable Preview deployment ID：`<dpl_...>`
- [ ] immutable Preview URL：`<https://...vercel.app>`；不得只記 branch alias。
- [ ] Preview `source commit` 與 candidate 完整 SHA 相同。
- [ ] `noindex` header、blocking `robots.txt`、無 Production sitemap，且可見「預覽環境」。
- [ ] Deployment Protection／access scope 的 redacted provider evidence。
- [ ] 受影響頁面、added／changed／removed、validation result 與 rollback target 都在 release evidence。

### 5. Production promotion 識別（未核准不得執行）

- [ ] 第二位維護者說明：JP PUMP approval 必須綁 source commit、Preview deployment、evidence digest、approver／time／controlled reference。
- [ ] 正確 dry-run：`npm --prefix website run release:promote -- --evidence <...> --approval <...>`。
- [ ] 正確 execute boundary：只有具 Production 權限且核准完整時加 `--execute`；完成後仍須核對 Production domain、deployment、commit、robots／sitemap 與 smoke。
- [ ] Maintainer identified Production deployment／URL：`<required>`；沒有 purchased domain 時必須標記阻擋。

### 6. Rollback 識別（無事故授權不得執行）

- [ ] 第二位維護者從 release evidence 指出 known-good `restored deployment`：`<dpl_...>` 與 `restored source commit`：`<SHA>`。
- [ ] 指出目前要取代的 `superseded deployment`：`<dpl_...>` 與 `superseded source commit`：`<SHA>`。
- [ ] 說明 authorization 綁定 evidence digest、project、restored／superseded ID、authorizer、timestamp、controlled reference。
- [ ] 正確 dry-run：`npm --prefix website run release:rollback -- --evidence <...> --authorization <...>`。
- [ ] 說明 provider error／timeout 為 `indeterminate`；先查 rollback status、active deployment、所有 domain assignments 與 logs，禁止盲目重試或破壞性 Git。
- [ ] 說明成功後必須記錄 restored／superseded、Production domains、operator、authorization、timestamp 與 smoke；並知道 rollback 暫停 production-domain auto-assignment，後續 promotion 才恢復。

## 獨立觀察與結果

| 檢查 | Observer evidence |
|---|---|
| 文件以外的口頭提示 | `<none required for PASS; otherwise list and update runbook>` |
| 自己找到 authority／commands／escalation | `<required>` |
| Non-product update and diff | `<commit/diff reference>` |
| Gate result | `<artifact/digest>` |
| Preview identity／noindex／protection | `<deployment and redacted record>` |
| Production promotion steps correctly identified | `<observer note>` |
| Rollback restored／superseded steps correctly identified | `<observer note>` |
| Second maintainer sign-off | `<role, timestamp, controlled reference>` |
| Observer sign-off | `<role, timestamp, controlled reference>` |
| Final result | `BLOCKED` until every required field above has genuine evidence; then set only to `PASS` or `FAIL` in the dated exercise record |

## 目前未關閉項目

本次沒有填入 maintainer identity、source commit、immutable Preview、approval、Production URL、restored deployment、superseded deployment 或 sign-off。這是刻意的 fail-closed 狀態；在真人、存取與外部證據到位前，AC4 和 Epic 3 completion 仍為 `BLOCKED`。
