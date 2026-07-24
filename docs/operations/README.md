# Operations

操作手冊入口。詳細發布合約仍以 Architecture Spine AD-4 / AD-12 / AD-17 為準。  
**佈局覆寫（2026-07-24）：** 應用在倉庫根目錄；Vercel Root Directory 應為 `.`（不再使用 `website/`）。

## 日常指令（於倉庫根目錄）

```bash
npm run validate
npm run lint
npm run build
npm test
```

內容匯入（Excel → `data/catalog.generated.json`）：

```bash
npm run import-catalog
```

## 發布路徑

1. 更新受治理檔（`content/**`、`data/**`、`public/media/**`）
2. `validate` → `lint` → `build` → Playwright smoke
3. 開 PR → Vercel Preview（應 `noindex`）
4. JP PUMP 審 Preview → 合併 / 推至 Production 分支
5. 回滾：切回先前已知良好的 Vercel deployment

## 目錄責任

| 路徑 | 誰改 | 注意 |
| --- | --- | --- |
| `data/catalog.generated.json` | 僅 `import-catalog` | 勿手改技術欄位 |
| `data/catalog-content.json` | 維護者 | stable ID、slug、文案、圖 |
| `content/**` | 維護者 | 頁面與 taxonomy 文案 |
| `public/media/**` | 維護者 | 僅已核准優化衍生檔 |
| `data/source-catalog.xlsx` | 維護者 | intake 證據，非 runtime 權威 |

## 尚未文件化（啟動前必補）

- 正式網域 / DNS / 帳號 MFA 與復原負責人
- 原始媒體離線備份位置
- Preview 存取保護設定
- Vercel 專案 Root Directory 確認為 repository root（空／`.`）
