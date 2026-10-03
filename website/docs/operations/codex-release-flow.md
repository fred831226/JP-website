# JP PUMP Codex 發布流程

這份文件定義 Codex 收到「執行 JP PUMP 發布流程」後的操作順序。部署身分、
核准、promotion 與 rollback 的資料格式以 [`release.md`](./release.md) 為準。

## 核心原則

- 同一候選的完整 gates **只跑一次**：GitHub PR 的 `validate-candidate` 是唯一權威結果。
- 本機檢查用來提早發現問題，不重複充當 release gate；手動建立 evidence 只引用已成功的
  PR run，不再重跑 install、audit、build、release tests 或 Playwright。
- 只核准 immutable commit 與 deployment ID，不以會移動的 branch alias 作證據。
- Preview QA 與 Production smoke 以「固定核心路由 + 本次受影響範圍」為準；只有 routing、
  SEO、全站導覽或部署設定變更才擴大為全站檢查。
- 任何候選內容變動都產生新 commit，並讓 GitHub CI 重新跑一次；純重試 evidence 不重跑 gates。

## 模式

| 模式 | 適用變更 | 本機診斷 | Preview / Production 驗證 |
| --- | --- | --- | --- |
| Fast Release | 已核准 typo、局部文案或 CSS；不影響資料、schema、routing、SEO、security、build 或部署設定 | lint 與受影響測試 | 核心 smoke + 受影響頁面 |
| Full Release | dependency、產品資料、schema、routing、SEO、security、build/Vercel 設定、API、architecture、重大 UI，或範圍不明 | validate、lint 與受影響測試；build 只在推送前需要本機確認時執行 | 核心 smoke + 受影響頁面；routing/SEO/全站變更才做全站 QA |

兩種模式都必須通過同一個 GitHub PR gate、immutable Preview evidence、branch protection
與 Production 授權。模式差異只在本機診斷和人工 QA 範圍，不降低遠端合併標準。

## 候選準備

1. 記錄 branch、HEAD、remote 與 working tree。逐檔確認本次範圍，保留無關變更；不明檔案
   不得自行丟棄或混入候選。
2. 確認所有 production inputs 可由 Git 重建。`catalog-current.json` 指向的四份 release
   snapshot 必須被追蹤，不能只存在於被忽略的本機目錄。
3. 使用 Node 24.x。只有 lockfile 或 dependencies 改變、或本機尚未安裝 dependencies 時才
   執行 `npm --prefix website ci`；不為每次文案或 CSS 修改重裝套件。
4. 依模式執行本機診斷。修正完成後取得使用者對候選內容與 staged files 的確認，再 commit、
   push 及建立 PR。不要為了在 CI 前「證明乾淨」而在另一個 checkout 重跑整套 gates。

## 單次權威 gate

PR 的 `Release gates / validate-candidate` 在候選 **head SHA** 的乾淨 GitHub runner 上依序執行：

```text
npm ci → audit → validate → lint → build → test:release → Playwright
```

成功後上傳 `release-gates-<candidate SHA>`。這個 run 是 lint、build、tests 與 dependency audit
的唯一 release gate；本機成功、Vercel build 成功或另一次 workflow run 都不能替代它。

若程式或內容沒有變，只是 evidence 輸入、權限或暫時性外部服務失敗，修正外部問題後重跑
evidence 即可，不重跑 PR gates。只有 candidate SHA 改變時才需要新的 PR gate run。

## Preview 與 evidence

1. 等待 Vercel 為 PR head SHA 建立 READY 的 immutable Preview，核對 project、commit 與
   environment。不得使用 branch alias。
2. Preview 固定檢查：`/zh-tw`、`/zh-tw/products`、本次受影響路由、404，以及
   `X-Robots-Tag: noindex, nofollow`、`robots.txt` 禁止索引、`sitemap.xml` 沒有 `<loc>`。
   UI 變更才增加桌面/手機、鍵盤與 console/network；routing、SEO 或全站元件變更才擴大路由。
3. 手動執行 **Release gates** workflow，選取候選 branch/ref，輸入：
   - 成功 PR gate 的 `gate_run_id`
   - immutable Preview deployment ID
   - known-good Production rollback deployment ID
4. `create-evidence` 會確認該 run 屬於本 workflow、事件為 PR、結論成功且 `head_sha` 等於
   所選候選 SHA，下載其 gate artifact，再產生 `release-evidence-<candidate SHA>`。此步不安裝
   dependencies，也不重跑 audit、build 或 tests。
5. 核對 evidence 的 commit、Preview、rollback target、變更與 affected routes，再產生 digest
   供 JP PUMP release record 使用。

## 合併與發布

1. `main` 必須啟用 branch protection，至少要求 PR、`validate-candidate` 成功與 conversation
   resolved。required check 應綁定 GitHub Actions app 的 `validate-candidate`。
2. 確認 PR head SHA 仍等於 evidence source commit 後，依使用者的 merge 授權合併。
3. 在同一候選 commit 的乾淨 checkout 執行一次 `release:promote` dry-run。呈報 candidate SHA、
   Preview deployment ID、evidence digest 與 rollback target；取得針對該 immutable deployment
   的明確 Production 授權後才使用 `--execute`。
4. 發布後核對正式網域實際指向的新 Production deployment，且 source commit/tree 為已合併
   候選。固定 smoke：apex、www redirect、HTTPS、首頁、產品總覽、受影響路由、404、robots、
   sitemap 與 canonical。只有本次涉及 security headers、JSON-LD、OpenGraph、圖片或全站
   JavaScript 時才增加相關檢查。

## 必須停止的情況

- 候選包含未確認或未追蹤的 production input，或 CI 無法由 Git 重建。
- PR gate、必要 Preview smoke 或受影響頁面 QA 失敗。
- candidate SHA、gate artifact、Preview、evidence、approval、project 或 rollback target 不一致。
- Preview 可被索引、sitemap 含 `<loc>`，或存在 Critical/High 問題。
- `main` branch protection、Vercel Root Directory、Production Branch、正式網域或 rollback target
  尚未核對。
- 沒有針對本次 immutable deployment 的 Production 授權。

## 外部設定與 rollback

Codex 可更新 repository 內的 workflow、文件與測試。修改 GitHub branch protection、Actions
Secrets、Vercel Git integration、Root Directory、Production Branch、網域/DNS、帳務、角色、
PR merge、Production promotion 或 rollback 前，仍須取得使用者對該動作的明確授權。

必要 Actions secrets（只檢查名稱，不讀值）：`VERCEL_TOKEN`、`VERCEL_PROJECT_ID`、
`VERCEL_TEAM_ID`、`VERCEL_AUTOMATION_BYPASS_SECRET`。

Rollback 只可指向已知可用的 immutable Production deployment。先 dry-run、取得明確 rollback
授權，再執行；provider timeout 或狀態不明時先核對目前 Production assignment，不可盲目重試。
