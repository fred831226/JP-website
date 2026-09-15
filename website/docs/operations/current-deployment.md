# JP PUMP 目前正式部署紀錄

更新日期：2026-09-15（Asia/Taipei）

本文件是目前公開網站的最小維運快照。它只記錄可公開或可由具權限維護者重新查核的部署身分；帳號、DNS 所有權、帳務、MFA、核准細節與任何 secret 均保留在受存取控制的公司紀錄。

## 正式狀態

- 狀態：**已正式部署**。
- 主網域：[jp-pump.com](https://jp-pump.com/zh-tw)
- 備用網域：[www.jp-pump.com](https://www.jp-pump.com/zh-tw)；以 HTTP 308 永久導向主網域並保留路徑。
- HTTPS：`jp-pump.com` 與 `www.jp-pump.com` 均由 Vercel 管理並已通過實際 HTTPS 連線檢查。
- Preview：採 Vercel Authentication 的 Standard Protection；未授權存取會被導向 Vercel 登入，CI 使用受控的 Automation Bypass Secret 驗證。
- 發布：`main` 仍建立 Production deployment，但不會自動將自訂正式網域指派給新部署；每次都必須經過核准後手動 Promote。
- 搜尋收錄：網站可爬取，`robots.txt` 已宣告 Production sitemap；Google Search 尚未完成新網站收錄。後續應在 Google Search Console 驗證網域、提交 `https://jp-pump.com/sitemap.xml`，並對首頁要求建立索引。

## 可追溯發布身分

| 項目 | 已核對資料 |
|---|---|
| Release candidate commit | `55b729f1f93dd3531b7e31f2115afa3ae45d7741` |
| Immutable Preview | `dpl_4Zp8P3RmVBYeCEQXBMo5uyHjGgrU` — `https://website-707z6gk0g-fred-vercel.vercel.app/zh-tw` |
| Production source commit | `dd8a26a47a3a2a3b337361fefee779d947e96522`（PR #1 將 candidate 合併至 `main`） |
| Current immutable Production deployment | `dpl_DD54aJ8iXLkbjcNEYAiw9Q2sq1Wt` — `https://website-1t09dhu4a-fred-vercel.vercel.app` |
| Vercel project | `website`（Root Directory：`website`；Node.js：`24.x`） |
| Production domains | `jp-pump.com`、`www.jp-pump.com` |

Production deployment、兩個正式網域與首頁回應均已核對為 Ready／HTTP 200；最近一小時 Vercel error logs 沒有錯誤紀錄。

## 後續變更原則

- 後續小型設計、文案或版面調整仍須走 branch、驗證、commit-bound Preview 與 Production 授權流程；不得直接修改線上部署。
- 英文版目前**尚未開始，也未被列為現有 V1 路由**。啟動前應先確認內容翻譯、網址／canonical／hreflang、SEO、導覽與驗收範圍，再以獨立變更發布；不得以暫時或機器翻譯頁取代正式英文內容。
- 任何下一次發布完成後，更新本文件的 source commit、Production deployment、檢查時間與網域驗證結果，並保留上一個 known-good deployment 供 rollback 流程使用。

## 仍需獨立治理的事項

正式網站已可營運，但帳號所有權／MFA／recovery、billing、離機媒體與權利備份、第二位維護者交接演練，以及 Search Console 收錄，仍應依 `maintenance.md` 與 `recovery-readiness.md` 保存受控證據與完成追蹤。
