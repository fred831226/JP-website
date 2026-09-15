# JP PUMP 原子發布作業

本流程將 Git commit、Vercel Preview、JP PUMP 核准與 Production promotion 綁定成同一份可追溯證據。任何 gate、commit 或部署身分不一致都停止；不以分支別名作為核准依據，也不從未提交的工作樹發布。

## 權限與平台前置檢查

以下項目由具權限的維護者在 GitHub 與 Vercel 後台人工確認，不由 repository script 改動：

- Vercel Root Directory 為 `website`，Production branch 與正式網域歸屬正確。
- 執行 promotion 的 `website` 目錄已 link 到預期 Vercel project，登入帳號位於正確 team scope；先以唯讀方式核對 project/team，不可只依賴本機既有登入狀態。
- promotion 工具會在任何外部變更前強制核對 Vercel CLI 必須精確為 `56.5.0`；版本缺失或不一致時直接停止。
- Preview 使用 Standard Deployment Protection；含未核准證據時不得公開分享。
- GitHub 必要檢查與分支保護已啟用，帳號使用 MFA 與最小權限。
- Preview 顯示「預覽環境」，回傳 `X-Robots-Tag: noindex, nofollow`，且 `robots.txt` 禁止索引、沒有 Production sitemap 宣告。
- 已記錄目前 Production 的 immutable deployment ID，作為 rollback target。

## 1. 建立並檢查 Preview 證據

1. 將完整 candidate commit 推送並等候 Vercel 建立 commit 專屬 Preview。不要使用會跟著分支移動的 alias。
2. 在 GitHub 手動執行 **Release gates** workflow，只輸入 immutable Preview deployment ID 與目前 known-good Production deployment ID。workflow 使用 Vercel API 取得兩者的 URL、project、environment、ready state 與 Git commit；不接受手填 URL、source commit 或 base commit。
3. workflow 依序執行 governed content validation、lint、Preview-shaped build、release contract tests 與 public behavior tests。只有全部成功才產生 `release-evidence-<commit>` artifact。
4. 下載並檢查證據：`sourceCommit`、`preview.sourceCommit` 與被審查的 commit 必須相同；確認 added/changed/removed、`contentChanges`、affected routes、所有 gates、Preview URL/deployment ID 與 rollback target 都完整。工具也會驗證 rollback commit 是 candidate 的祖先，並實際探測 Preview header 與 `robots.txt`。證據不應包含內容 body、聯絡資料或 secret。
5. 在受保護 Preview 檢查所有受影響頁面屬於同一 repository state；不得出現 News、Project detail、未發布內容或部分更新。

## 2. 記錄核准

JP PUMP 核准應另存於 repository 與 CI artifact 之外的受存取控制 release record，並輸出最小 JSON 給 CLI。record 必須保留核准來源、核准角色、時間、完整 commit 與不可變參照；不得把核准秘密或私人聯絡資料放入 JSON、log 或 artifact：

```json
{
  "status": "approved",
  "sourceCommit": "完整 40 字元 commit SHA",
  "deploymentId": "dpl_不可變 Preview deployment ID",
  "approvedAt": "ISO 8601 timestamp",
  "approvedBy": "designated JP PUMP approver role/identifier",
  "approvalReference": "access-controlled record ID",
  "evidenceDigest": "sha256:release evidence digest"
}
```

以同一份 evidence 產生待抄入核准紀錄的 digest：

```powershell
npm --prefix website run release:digest -- --evidence <release-evidence.json>
```

拒絕或修正後必須建立新的 commit、重新跑 gates、取得新 Preview 與新核准；不得沿用舊核准。

## 3. Promotion：永遠先 dry-run

在與核准 commit 相同且乾淨的 checkout 執行：

```powershell
npm --prefix website run release:promote -- --evidence <release-evidence.json> --approval <approval.json>
```

預設只顯示精確的 `vercel promote <deployment-id> --yes`，不呼叫 Vercel。逐項確認 evidence commit、approval commit、目前 HEAD、Preview source commit、passed gates、乾淨工作樹與 rollback target 後，具權限的維護者才可明確執行：

```powershell
npm --prefix website run release:promote -- --evidence <release-evidence.json> --approval <approval.json> --execute
```

依 [Vercel 官方 Preview promotion 流程](https://vercel.com/docs/deployments/promote-preview-to-production)，從 Preview promotion 會以同一份 source code 和 Production environment values 建立新的 Production deployment。執行完成後仍須人工檢查正式網域指向該次 promotion 產生的 deployment、非正式環境 banner 已消失、索引 header/robots/metadata/sitemap 正確。不要把「CLI 命令完成」單獨視為正式發布確認。

## 失敗、重試與升級

- 任一前置條件失敗：CLI 以非零狀態結束且不呼叫 Vercel。修正 evidence、approval 或 checkout 後重跑 dry-run。
- Vercel promotion 回報失敗、逾時或狀態不明：結果屬於 **indeterminate**，不可宣稱 Production 未變，也不可假設 promotion 成功。不要重複盲目執行；先用 `vercel promote status` 與 Vercel Dashboard 核對目前 Production deployment、domain assignment 與 deployment logs，再決定安全重試或升級給 Vercel account owner。
- GitHub gate 失敗：保留 log 與 commit SHA，修正後建立新 candidate；不要略過失敗 gate 或手工拼接部分檔案發布。
- log 與工單只記 commit、deployment ID、route、gate 名稱與錯誤類型；不得貼 token、環境變數、聯絡資料、來源文件或內容 body。

## 移除與封存

公開 route 的移除必須在另一個 reviewed commit 內處理。優先在 `data/redirects.json` 新增已審查的最近替代頁 redirect；確實沒有正確替代頁時，才在 `data/not-found-routes.json` 登錄明確 not-found route。未處理的公開 route removal 會阻擋 evidence 與 promotion。先前 Production deployment 必須保留為 rollback target。

`data/redirects.json` 格式：

```json
[
  {
    "source": "/zh-tw/series/old-slug",
    "destination": "/zh-tw/products",
    "permanent": true
  }
]
```

Production rollback 屬 Story 3.7 與人工受權操作；本 Story 不自動 rollback，也不以 Git destructive commands 或選取檔案回復取代完整 deployment rollback。
