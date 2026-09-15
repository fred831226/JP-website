# JP PUMP Codex 發布流程

這份文件定義 Codex 收到「執行 JP PUMP 發布流程」後的操作順序。它補充
[`release.md`](./release.md) 的 immutable Preview、evidence、approval、promotion
與 rollback 契約；若兩者衝突，以 `release.md` 的 fail-closed 規則為準。

## 指令辨識

- 在 JP-Website repository：`執行 JP PUMP 發布流程` 是完整指令。
- 當目前工作區明確是 JP-Website 時：`執行發布流程` 可視為相同指令。
- 不在本 repository，或同時有多個專案上下文時：必須要求使用者指定專案，不能
  把 JP PUMP 的 Vercel project、網域、secret 名稱或 release record 套用到別的
  專案。

## 模式選擇

| 模式 | 適用變更 | 必經 gates |
| --- | --- | --- |
| Fast Release | 已核准 typo、文案或局部 CSS；不影響資料、schema、routing、SEO、security、build 或部署設定 | working tree、relevant tests、lint、build、immutable Preview、Preview smoke、required checks、Production gate |
| Full Release | dependency、產品資料、schema、routing、SEO、security、build/Vercel 設定、API、architecture、重大 UI；或範圍不明 | validate、lint、build、`test:release`、Playwright、dependency/security review、immutable Preview QA、required checks、Production candidate 與完整 Production verification |

Fast Release 不代表跳過 Preview 或 Production gate。只要有任何 gate 失敗，或
Preview evidence 不能綁定同一個 commit，立即停止並修復後從頭重跑。

## 每次發布

1. 記錄目前 branch、HEAD、working tree、remote 與候選變更；dirty tree、未知
   untracked production inputs、或 candidate 不可從 Git 重建時停止。
2. 建立或確認 `feature/*` branch。一般變更不直接推往 Production branch。
3. 以已鎖定的 Node 24 執行所選模式的 local gates：

   ```powershell
   npm --prefix website ci
   npm --prefix website run validate
   npm --prefix website run lint
   npm --prefix website run build
   npm --prefix website run test:release
   npm --prefix website test
   npm --prefix website audit --audit-level=high
   ```

   Fast Release 只可略過與變更無關的 Full Release gate，且要在 release record
   說明原因；不能略過 lint、build、relevant tests、Preview 或 required checks。

4. 在得到使用者對本次變更的明確授權後才 commit、push 與建立 PR。GitHub 的
   `Release gates` workflow 必須在候選 commit 上成功。
5. 確認 Vercel 為同一 commit 建立 immutable Preview。Preview 必須有
   `noindex, nofollow`、禁止索引的 `robots.txt`、不使用 Production sitemap，並
   在需要時受到 Deployment Protection。不可用會隨 branch 移動的 URL 作核准。
6. 依模式完成 Preview QA：首頁、產品總覽、代表性 series/type、導覽、聯絡動作、
   locale、桌面與手機、404、redirect、圖片、console/network、metadata、canonical、
   robots、sitemap、JSON-LD。Critical 或 High 問題一律停止。
7. 等待 GitHub required checks、PR review 與 branch protection 全部通過後才可 merge。
   不可用失敗 CI、手動部分檔案或直接 push 繞過 gate。
8. 建立 `release.md` 所定義的 evidence，確認 Preview、source commit、passed gates
   與 known-good rollback target 都指向正確 immutable identities。JP PUMP 核准要
   存在受控 release record，並使用同一 evidence digest。
9. 先執行 `release:promote` dry-run。只有使用者對這個 deployment 的明確
   Production 授權，才可使用 `--execute`。promotion 後驗證 apex、www redirect、
   HTTPS、headers、CSP、robots、sitemap、canonical、JSON-LD、OpenGraph、404、
   代表路由、圖片、console 與 network，並記錄 deployment ID、commit 與 rollback
   target。

## Required gates

下列任一情況阻止 Production：

- working tree 不乾淨、候選或 release snapshot 未被 Git 完整追蹤，或 clean clone
  無法建立候選版本。
- `validate`、lint、build、required test、security/dependency review、GitHub CI 或
  Preview QA 失敗或逾時。
- Preview、evidence、approval、HEAD、Vercel project 或 rollback target 的 immutable
  ID / commit 不一致。
- Preview 可被索引、污染 Production SEO、無法通過保護機制，或有 Critical/High QA
  failure。
- Production domain、HTTPS、www redirect、GitHub branch protection、Vercel Root
  Directory、environment scope 或 rollback target 尚未核對。
- 沒有針對本次 immutable deployment 的 Production 授權。

## 外部設定與授權邊界

repository 內的 workflow、文件與測試可以由 Codex 建立或更新；下列動作必須先列
出並等待使用者明確授權：GitHub branch protection / required checks / Actions
Secrets、Vercel Git integration / Root Directory / Deployment Protection / Firewall、
新增網域與 DNS、帳務或方案、帳號角色與 MFA 設定、PR merge 與 Production
promotion。

需要 GitHub Actions 存在（只檢查名稱，絕不讀取值）的 secrets：
`VERCEL_TOKEN`、`VERCEL_PROJECT_ID`、`VERCEL_TEAM_ID`、
`VERCEL_AUTOMATION_BYPASS_SECRET`。

## Rollback

只回復已由完整 gates、Preview、核准與 Production smoke 證明的 immutable
known-good deployment。先依 `release.md` dry-run，取得 rollback authorization，
再以明確授權執行。provider timeout 或錯誤都是 `indeterminate`：先核對 Vercel
目前 Production deployment、domain assignment 與 rollback status，不能盲目重試。
