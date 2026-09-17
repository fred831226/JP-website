# 2026-09-17 候選發布與流程問題紀錄

範圍：`feature/retire-2vbsg-and-refine-transitions`，檢查時 HEAD `85e6a80`。
此紀錄是本機診斷，不是 release evidence、Preview QA 或 Production 核准。

| 編號 | 已觀察的問題與影響 | 處理狀態 |
| --- | --- | --- |
| R1 | 工作樹原有 31 個 tracked 檔案變更及一個未追蹤的 `src/lib/catalog-format.ts`。原流程第一步要求 dirty tree 停止，卻在第四步才允許 commit，缺少保留他人變更、確認候選範圍及定版的階段。 | 已在 `codex-release-flow.md` 加入候選準備與 clean checkout gate；本次候選尚未定版或提交。 |
| R2 | `catalog-current.json` 指向 `releases/60b66f52-a673-41ec-b70e-671000a4fe79`，原 `.gitignore` 的 `website/releases/*` 排除了該目錄的四份 JSON。Git checkout 無法重建這批產品資料，Preview 與本機可能不同。 | 已加入該 release ID 的精確例外；四份 snapshot 與各自工作檔 SHA-256 相同。尚須由候選定版、clean checkout 與 CI 證明已完整追蹤。 |
| R3 | 系統預設 `node --version` 為 `v26.5.0`，但流程、`website/package.json` 及 CI 均要求 Node 24.x。 | 已找到工作區 bundled Node `v24.19.0`；發布 gates 必須明確使用此 runtime，不可用預設 Node 26 的結果充數。 |
| R4 | 沙箱內 `gh auth status` 回報預設帳號 token 無效，與使用者更新憑證的狀態不一致。 | 在允許的外部環境重查後，GitHub CLI 顯示已登入 `fred831226`，具 `repo`/`workflow` scopes；遠端操作仍須逐項核對結果。 |
| R5 | 最初對「首頁產品篩選、用途篩選和標籤全部移除」的範圍解讀不清。 | Owner 已確認首頁 Brand/Pump Type 快速篩選保留；產品總覽移除用途篩選及已選條件標籤，保留品牌／類別的選取狀態與重設動作。此調整與 `epics.md` UX-DR14 的「removable active tags」文字不一致，定稿規劃文件未在本次實作中修改。 |
| R6 | 原流程先 merge，後建立 evidence；一旦 evidence 失敗，已無法符合 fail-closed 的候選合併意圖。`workflow_dispatch` 若選錯 ref，會 checkout 預設分支。 | 已調整為合併前確認 immutable evidence，並要求核對 workflow run `head_sha` 與候選 SHA。仍須以實際遠端 run 驗證。 |
| R7 | 原工作區的 `npm ci` 清理 `lightningcss.win32-x64-msvc.node` 時兩次遇到 `EPERM`；既有 Next 開發伺服器正在使用 `website/node_modules`。 | 未停止既有伺服器；在 `.working/release-check/website` 隔離副本用 bundled Node 24 完成安裝與診斷。正式 gates 仍須在乾淨候選 checkout 重跑。 |
| R8 | `smoke.spec.ts` 固定連到 `localhost:3000`，與 `PLAYWRIGHT_PORT` 設定不一致，隔離測試一度連到原工作區的開發伺服器而失敗。Windows 上由 Playwright 自動啟停的伺服器也曾使程序無法正常結束。 | 已改為使用 `PLAYWRIGHT_PORT`；改以隔離的已建置 Next 伺服器加 `PLAYWRIGHT_EXTERNAL_SERVER=true` 執行，48/48 測試正常退出。測試 URL 問題已修，程序收尾問題仍需留意。 |
| R9 | 原有去小數函式會將 `0.75 kW` 顯示為 `0 kW`，與不得零填或誤述規格的要求衝突。 | 已改為顯示「小於 1」並新增瀏覽器回歸測試；隔離副本重建與 48/48 測試通過。 |

截至本紀錄更新時，隔離副本的 Node 24 依賴安裝、validate、lint、Preview-shaped build、34 個 release contract tests、48 個 Chromium tests 與 npm audit（0 個漏洞）已通過；但這些是定版前診斷，不是 immutable candidate commit 的正式 gates。Preview QA、release evidence 與 Production promotion 尚未執行，亦未對這批變更 commit、push、建立/合併 PR。候選定版後仍需在乾淨 checkout 重跑 Full Release gates。Production promotion 仍需對具體 deployment 的另一次明確授權。
