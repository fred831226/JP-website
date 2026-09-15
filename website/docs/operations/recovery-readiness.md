# JP PUMP Recovery Readiness Record

## 正式上線現況（2026-09-15，Asia/Taipei）

網站已正式部署。詳細的 Production／Preview deployment、commit、網域、HTTPS、`www` 308 導向、搜尋收錄待辦與後續小型變更／英文版邊界，見 [current-deployment.md](./current-deployment.md)。

本段更新目前公開服務狀態；下列 2026-08-29 表格保留為當時的 baseline observation。它的 `BLOCKED` 治理項目（公司控制的帳號／MFA／recovery、billing、備份與第二位維護者）並不因網站已上線而自動解除，仍須以受控證據更新。

---

記錄日期：2026-08-29（Asia/Taipei）
Repository baseline：`843dd1b51cee8757d282b9f42f7a9abb9197215e`

狀態定義：`VERIFIED` 代表已有本次可重現證據；`OBSERVED` 只代表唯讀觀察，不足以證明所有權／核准／安全；`BLOCKED` 代表 launch、promotion、rollback 或 Story 驗收仍缺外部證據。

| 項目 | 狀態 | 目前證據／觀察 | 關閉條件 |
|---|---|---|---|
| Git history | VERIFIED | repository 可讀，baseline 與最近 commit history 可重現 | Production release record 仍需把部署綁到完整 commit |
| GitHub access／branch protection | BLOCKED | `gh auth status` 顯示 `fred831226` token 無效 | 重新驗證 company-controlled access、required checks、branch protection、MFA／recovery owner，保存 redacted record |
| Vercel project link | OBSERVED | `website/.vercel/project.json` 與 `vercel project inspect website` 一致指向 `prj_i5wRQZCh0hmNqt8Pxks1no8t7reh`，team `team_9rJVBUqJcVxwBsRvup30GTHx` | project owner／role、company handoff 與最小權限仍需平台紀錄 |
| 商用 Vercel 方案 | BLOCKED | Architecture 只寫 Pro candidate；未取得 plan／commercial eligibility 證據 | Vercel team Usage／Billing 的 redacted plan record；Hobby 不可作商用證據 |
| billing owner | BLOCKED | 無受控 billing owner／替代 owner／付款復原紀錄 | JP PUMP 指定 company-controlled billing owner 與 recovery reference |
| 帳號所有權、MFA、recovery | BLOCKED | CLI 可登入 `fred831226`，但本機登入不證明公司所有權、MFA 或可移交復原 | GitHub／Vercel／domain／backup 各自的 owner、MFA、recovery、least-privilege redacted records |
| Root Directory | BLOCKED | `vercel project inspect website` 回報 Root Directory `.`，與要求的 `website` 不一致 | Vercel Build & Deployment 設為 `website`，由下一次 Preview 的來源／build path 與 Dashboard evidence 雙重確認 |
| Production deployments | OBSERVED | `dpl_BCcAedy4C3nv19ymuYywKQjJc9vU`、`dpl_Bm9D3nEbEa37UH9RGg3y1jGZrjsn` 均為 Ready Production | 需要 commit-bound gates、Preview、JP PUMP approval、Production smoke 才能稱 known-good；目前不可任選 rollback target |
| 實際 rollback | BLOCKED | `vercel rollback status website` 顯示沒有進行中的 rollback；尚未獲授權執行 | 對已證明 known-good target 執行授權 rollback，記錄 restored／superseded ID、domains、status 與 smoke evidence |
| 正式網域與 DNS | BLOCKED | `vercel domains ls` 顯示 0 個 custom domains；目前只有 `vercel.app` aliases | 提供 purchased domain ownership、registrar、DNS owner／records／recovery、Vercel verified project domain 與 Production assignment |
| Preview/Production 環境隔離 | BLOCKED | repository 已實作 Preview banner、noindex header／robots；`vercel env ls` 顯示 0 variables，但未證明 Deployment Protection 或未來 secrets scope | 平台端 Preview protection、Production／Preview／Development scope 與 browser allowlist 的 redacted evidence |
| Production URL／JP PUMP 核准 | BLOCKED | 現有 Vercel Production alias 不等於 purchased domain，沒有本 Story commit-bound Preview 或 JP PUMP approval | immutable Preview、evidence digest、approval reference、promotion result、正式網域 smoke |
| 原始媒體與權利離機備份 | BLOCKED | 規格提到歷史來源路徑，但沒有本次可移交、off-device、獨立備份或抽樣 restore 證據 | archive owner、private location reference、backup timestamp、inventory summary、second-person access 與 restore evidence |
| 第二位合格維護者演練 | BLOCKED | 尚無第二位維護者身份／資格、獨立操作與 Preview evidence | 依 `handoff-exercise.md` 完成 non-product update 到 Preview並識別 promotion／rollback，留下雙方簽核 |
| 維護服務協議 | BLOCKED（非產品） | 未提供回應時間或 escalation contacts；不得寫成網站 SLA | 另立服務協議並以受控 reference 連結，本 repository 不保存私人聯絡資訊 |

## Release／ownership change 關閉順序

1. 修復 GitHub company access 與 Vercel Root Directory，確認 commercially eligible plan、billing／account ownership、MFA、recovery 與 least privilege。
2. 取得 purchased domain ownership、registrar／DNS／recovery 與 Vercel project-domain verification evidence。
3. 驗證 Preview/Production isolation 和 Deployment Protection；建立 commit-bound Preview、完整 gates 與 JP PUMP approval。
4. 確認 off-device original-media／rights archive 可由第二位合格維護者存取並完成抽樣 restore。
5. 由第二位維護者完成 handoff exercise。只有上述都關閉，才能進行正式 promotion 與授權 rollback 演練。

本紀錄不把候選部署、CLI 登入、架構敘述、site URL 或 DNS 可解析性當作 plan、billing、domain ownership、MFA、backup、approval 或 known-good deployment 的證明。
