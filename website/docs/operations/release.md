# JP PUMP 原子發布作業

本流程將候選 Git commit、單次 GitHub gate、Vercel Preview、JP PUMP 核准與 Production
promotion 綁定成可追溯證據。完整測試只在 PR 上執行一次；evidence 與 promotion 驗證身分，
不重跑相同 build 與 tests。

## 平台前置條件

- Vercel project 為預期 team/project，Root Directory 為 `website`，Production Branch 為 `main`。
- `main` 已啟用 branch protection，required check 為 `validate-candidate`。
- Preview 為 READY、來源為候選 SHA，且禁止索引；Production rollback target 為同 project 的
  READY immutable deployment。
- 執行 promotion 的 `website` 已連到正確 Vercel project；Vercel CLI 為工具指定版本。

## 1. PR gate：完整檢查只跑一次

PR 的 `validate-candidate` 在 head SHA 上執行 locked install、dependency audit、content validation、
lint、Preview-shaped build、release contract tests 與 Playwright。成功後產生：

```text
release-gates-<candidate SHA>/release-gates.json
```

這是唯一權威 gate report。不要在 `workflow_dispatch`、另一個 clean checkout 或 promotion 前
再次重跑相同套件。candidate SHA 改變時，GitHub 自動產生新的權威 run。

## 2. 建立 immutable Preview evidence

等待 Vercel 為 candidate SHA 建立 Preview，完成受影響範圍 QA 後，手動執行 **Release gates**，
選取候選 ref 並輸入：

- `gate_run_id`：該 SHA 已成功的 PR gate run ID
- `preview_deployment`：immutable Preview deployment ID
- `rollback_target`：目前 known-good Production deployment ID

workflow 會驗證 run 的 workflow、事件、結論與 head SHA，下載既有 gate artifact，並直接執行
release evidence 工具。工具核對 project、deployment state、source commit、rollback ancestry、
Preview headers、robots、空 sitemap、內容差異與 routes，最後產生：

```text
release-evidence-<candidate SHA>/release-evidence.json
```

外部權限或 evidence input 錯誤可在同一 SHA 上修正後重跑此步，不需要重跑 PR gates。

## 3. 記錄核准

JP PUMP 核准保存在 repository 與 CI artifact 之外的受控 release record；給 CLI 的最小 JSON：

```json
{
  "status": "approved",
  "sourceCommit": "完整 40 字元 commit SHA",
  "deploymentId": "dpl_immutable Preview deployment ID",
  "approvedAt": "ISO 8601 timestamp",
  "approvedBy": "designated JP PUMP approver role/identifier",
  "approvalReference": "access-controlled record ID",
  "evidenceDigest": "sha256:release evidence digest"
}
```

產生 digest：

```powershell
npm --prefix website run release:digest -- --evidence <release-evidence.json>
```

任何 candidate SHA 或 Preview deployment ID 改變都需要新的 evidence 與核准。

## 4. Promotion：一次 dry-run，一次授權

在核准 commit 的乾淨 checkout 執行：

```powershell
npm --prefix website run release:promote -- --evidence <release-evidence.json> --approval <approval.json>
```

dry-run 核對 evidence、approval、HEAD、Preview、passed gates、working tree 與 rollback target，
並顯示將執行的精確命令。Owner 對畫面所列 immutable deployment 明確授權後執行：

```powershell
npm --prefix website run release:promote -- --evidence <release-evidence.json> --approval <approval.json> --execute
```

完成後只做一次 Production verification：確認正式網域指向新 deployment，來源 commit/tree 正確，
核心與受影響路由可用，且 Production robots、sitemap、canonical 與 redirect 正常。不要重跑 PR
build 或 Playwright；除非 Production smoke 發現只在正式環境出現的問題。

## 失敗與 rollback

- PR gate 失敗：修正 candidate，讓新 SHA 自動重跑。
- evidence 失敗但 candidate 未改：修正 deployment/input/權限後只重跑 evidence。
- promotion 失敗、逾時或狀態不明：視為 indeterminate；先用 Vercel 狀態與 Dashboard 確認
  Production deployment 和 domain assignment，不可盲目重試。
- rollback 必須指向已知可用的 immutable Production deployment，先 dry-run 並取得明確授權。
- log 與 release record 只保留 commit、deployment ID、route、gate、digest 與錯誤類型；不記錄
  token、環境變數值、私人聯絡資料或內容 body。

公開 route 移除仍須在 `data/redirects.json` 指定正確替代頁；沒有合理替代時，才加入
`data/not-found-routes.json`。未處理的公開 route removal 會阻止 evidence。
