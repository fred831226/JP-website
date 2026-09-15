# JP PUMP 網站維運與復原手冊

本手冊供具 Git、Node.js、GitHub Actions 與 Vercel 基礎能力的合格維護者使用。公開網站以完整 Git commit 和完整 Vercel deployment 為發布／復原單位；沒有資料庫、CMS 或局部內容回復。所有外部狀態都必須附可追溯證據，不能以本機登入、私人訊息或口頭關係代替。

維護回應時間、待命方式與事故通知時限屬獨立的維護服務協議，不是網站產品行為或本手冊承諾的 SLA。

## 權威來源與存取前置

- 外層 repository 是唯一 Git authority；Vercel 應設定 Root Directory `website`。
- 非產品內容主要位於 `website/src/data/`；catalog 的手動治理資料位於 `website/data/catalog-content.json` 與 `website/data/catalog-overview-governance.json`，技術匯入來源為 `website/data/source-catalog.xlsx`，目前發布指標為 `website/catalog-current.json`。
- `website/public/media/` 只保存核准後、適合網站發布的衍生檔。原始高解析／RAW 與權利證據不得以 repository 作唯一備份。
- 所有操作人員必須有自己的 GitHub 與 Vercel 身分、最小必要權限和 MFA；不得共用私人帳號或 token。Vercel、GitHub、registrar/DNS、帳務與備份的 owner／recovery owner 必須記錄於受存取控制的公司紀錄。
- 開始前讀取 `recovery-readiness.md`。任何 `BLOCKED` 項目仍影響 Production 時，不得 promotion 或 rollback。

## 內容更新

1. 從乾淨分支開始，以目前 Production commit 為基線。先保存 `git status`；不得覆寫其他人的未提交變更。
2. 只修改對應的受控 JSON 與已核准媒體衍生檔。公司、聯絡、合作夥伴、首頁與服務內容位於 `website/src/data/`；redirect 與 not-found authority 位於 `website/data/redirects.json`、`website/data/not-found-routes.json`。
3. 新增或替換公開媒體前，先取得來源、權利、核准、alt 與內容關聯證據。2026-08-21 既有圖片例外不適用於後續新增／替換。
4. 檢查差異中沒有內容 body、token、原始媒體、私人核准紀錄或本機環境檔。提交只包含可辨識且已核准的變更。

## Catalog 更新

`xlsx` 僅存在於 development toolchain，不能由公開路由、Vercel runtime 或 CI 觸發匯入。套件固定為 SheetJS 官方 CDN 的 `0.20.3` 發行包，不能退回 npm registry 已凍結的 `0.18.5`；每次升級都要使用官方固定版本 URL、更新 lockfile，並通過完整 dependency audit。即使已修補，workbook 仍是高風險解析輸入：只可在隔離的維護環境處理由 JP PUMP 核准、來源可追溯的 workbook，不得匯入訪客上傳或未知檔案；執行後必須完成全部驗證並只提交 JSON 輸出與對應 release snapshot。替換 workbook parser 前需以同一來源檔驗證欄位型別、公式／日期行為及 22 Series／Model identity 契約。

1. 將核准 Excel 放在 `website/data/source-catalog.xlsx`。主表 G 欄是初始 Pump Type 輸入；舊 `用途` 欄不得改作 Pump Type 或用途標籤。
2. 執行 `npm --prefix website run import-catalog`。匯入只更新 importer-owned 技術欄位並原子切換 versioned catalog；不得改寫 stable ID、slug、taxonomy mapping、核准文案或圖片參照。
3. 檢查 exactly 22 canonical Series（含已核准新增的 Grundfos `UPA`）、完整 stable-key join、每個 Model 唯一分組、VFJH、VFJQ、2VBSG、2CM、2CR(I,N) Booster 與 VF變頻恆壓泵屬變頻恆壓泵、MAGNA3 與 UPA 屬循環泵，以及 `null` 缺值。錯誤或 no-op 不得產生部分發布。
4. 技術人員的線下覆核人、日期、處置與來源保留在治理資料；公開頁只呈現核准值和公開更新日。

## 驗證

從 repository root 執行：

```powershell
npm --prefix website run validate
npm --prefix website run lint
npm --prefix website run build
npm --prefix website run test:release
npm --prefix website test
npm --prefix website audit --audit-level=high
```

任一命令失敗即停止。不得略過 gate、修改報告為通過或手工發布部分檔案。Launch／重大 UI 變更另需人工檢查 320px、手機、鍵盤／焦點、screen-reader essentials、reduced motion、404、Safari、Preview isolation、正式素材效能與安全 headers。

## Preview、JP PUMP 核准與 Promotion

完整流程與 JSON 契約見 `release.md`：candidate commit → GitHub Release gates → immutable Vercel Preview → JP PUMP 核准同一 commit／deployment／evidence digest → Production promotion。

- Preview 必須有明顯「預覽環境」、`X-Robots-Tag: noindex, nofollow`、禁止索引的 `robots.txt`，且不宣告 Production sitemap；包含未核准證據時還須 Deployment Protection。
- JP PUMP 核准保存於受存取控制紀錄，只把最小 approval reference 交給 CLI。
- 先執行 `npm --prefix website run release:promote -- --evidence <evidence.json> --approval <approval.json>` dry-run；只有具授權者才能加 `--execute`。
- Promotion 完成後核對正式網域、active deployment、commit、Production banner／robots／sitemap 與 smoke checks；CLI 結束不等於發布驗收完成。

## Rollback

### 啟動條件

- 先辨識目前要 supersede 的 immutable Production deployment，以及先前已由 commit-bound gates、Preview、JP PUMP 核准和 Production smoke 證明的 known-good deployment。
- 確認兩者同一 Vercel project、target 為 Production、狀態 Ready，並取得 JP PUMP rollback authorization。authorization 必須綁定 release evidence digest、restored deployment、superseded deployment、project、authorizer、時間及受控 reference。
- Vercel Instant Rollback 會指回既有 build；它不套用後來變更的環境變數。先確認舊 build 的設定仍安全，且所有應指回的 Production domains 都列入操作檢查。

### Dry-run 與執行

```powershell
npm --prefix website run release:rollback -- --evidence <release-evidence.json> --authorization <rollback-authorization.json>
```

dry-run 必須顯示唯一命令、restored 與 superseded ID，且不呼叫 Vercel。具權限者再次核對後才可執行：

```powershell
npm --prefix website run release:rollback -- --evidence <release-evidence.json> --authorization <rollback-authorization.json> --execute
```

執行後在 Vercel Dashboard／CLI 驗證 rollback status、active Production deployment、每一個 Production domain assignment、HTTPS、首頁／產品總覽／代表性 Series／聯絡頁、robots 與 sitemap。完成紀錄至少包含 restored／superseded deployment ID 與 commit、project、Production domains、authorization reference、執行時間、operator、驗證結果及 redacted Vercel record。Vercel rollback 會暫停 production-domain auto-assignment；後續經核准的 promotion 才恢復正常發布行為。

### 失敗、indeterminate、安全重試

- 前置條件失敗時沒有 provider call；修正 evidence／authorization 後重新 dry-run。
- Provider 回報錯誤、timeout 或 CLI 狀態不明時，一律標記 `indeterminate`。不得宣稱 Production 未變，也不得盲目重試。
- 先執行 `vercel rollback status website`，再由 Dashboard 核對 active deployment、domain assignment 和 deployment logs。只有能證明未啟動／已安全結束時才重新 dry-run；否則升級與事件通報給 Vercel account owner、domain/DNS owner 與 JP PUMP release owner。
- 不得以 `git reset --hard`、force-push、選取檔案 checkout、刪除 deployment 或其他破壞性 Git 操作代替 rollback。修復來源要用新 reviewed commit；緊急復原只指回完整 known-good deployment。

## 網域與 DNS

- 公司受控紀錄需保存 purchased domain、registrar、registrant／owner、billing、MFA、recovery owner、nameserver、DNS record、TTL、Vercel project/domain verification、renewal 與移轉／復原步驟。
- 每次 launch、registrar／DNS／account ownership 大幅異動後，匯出或截取 redacted configuration evidence，並由第二人核對。不得把程式中的 site URL 或能解析 DNS 當成所有權證明。
- DNS 變更先記錄原值與 rollback plan；不得在同一未核准 release 同時任意改 domain ownership、DNS 與網站內容。

## 帳號所有權、MFA 與復原

- GitHub、Vercel、domain registrar/DNS、billing 與 backup archive 都要有 company-controlled owner、至少一位合格替代維護者、MFA、recovery method、least-privilege roles 與離職／移交流程。
- 每季或 ownership 重大異動後檢查 owner、成員、token／key、MFA 與 recovery reference；只保存 redacted 證據，不把 recovery codes 或 secrets 放進 Git。
- GitHub branch protection、required checks、Actions secrets、Vercel Deployment Protection 與 Production role 必須由平台證據確認；本機登入成功不是證明。

## 環境隔離

- Vercel 的 Production、Preview、Development environment values 分別維護；secrets 不得變成 `NEXT_PUBLIC_*`，browser-exposed values 必須明確 allowlist。
- Preview／Development 永遠 `noindex`；含未核准證據時使用 Standard Deployment Protection 或更嚴格保護。Production 只使用核准網域與 Production environment values。
- 以 `vercel env ls` 只核對變數名稱和 scope，不下載或貼出值。任何變更只套用新 deployment，rollback 仍使用舊 build，因此 rollback 前必須評估 configuration drift。

## 原始媒體與權利備份

- 私有 archive 必須包含原始高解析／RAW、來源、使用權、核准及處理版本；與網站 repository／目前維護者電腦分離，至少有一份 off-device backup，且可移交給公司控制的替代維護者。
- 每次新媒體 batch、backup provider 變更、launch 或 ownership 重大異動後，記錄 archive owner、位置 reference、加密／存取角色、最近備份時間、檔案數／大小摘要及抽樣 restore 結果。不得把 private archive 路徑或權利文件內容公開。
- 沒有 transfer／restore 證據時標記 `BLOCKED`，不得以「檔案應該還在某台電腦」視為備份。

## 升級流程

1. 以獨立 dependency-only branch 更新 Node、Next.js、React、Tailwind、Zod、Playwright、Vercel CLI 或 GitHub Actions；不得混入內容發布。
2. 查閱官方 changelog／security advisory，記錄版本差異、breaking changes、rollback target 與風險頁面。
3. 執行完整驗證與重大 UI 變更的人工檢查，建立 immutable Preview 並取得 JP PUMP 核准。
4. Promotion 後執行 smoke；失敗使用同一 deployment rollback 程序。版本釘選或 CLI contract 變更必須同步更新測試與本手冊。

## 升級與事件通報

依序通知 repository owner、Vercel account／billing owner、domain/DNS owner、backup archive owner 與 JP PUMP release owner。工單只包含 incident ID、時間、commit／deployment ID、affected domain／route、gate 或 provider error 類型、已完成的唯讀檢查與下一個決策；不得包含 token、環境值、聯絡資料、內容 body 或來源文件。回應時限只引用維護服務協議。
