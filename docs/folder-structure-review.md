# 資料夾結構審查與調整紀錄

**審查日期：** 2026-07-24（含同日 root 提升覆寫）  
**對照基準：**

1. Next.js App Router 官方 scaffold 慣例（repo 根即 app）
2. Architecture Spine Structural Seed（原訂巢狀 `website/`）
3. 一般靜態內容站「code / content / data 分離」實務

## 1. 為什麼用 `docs/` 而不是 `doc/`

| 選項 | 評價 |
| --- | --- |
| `doc/` | 少見；易與單檔混淆 |
| `docs/` | GitHub / 開源 / BMAD `project_knowledge` 主流 |

本倉庫採 **`docs/`**。BMAD config 已指向 `{project-root}/docs`。

## 2. 應用位置：從 `website/` 提升至倉庫根（業主覆寫）

### 權威衝突（必須明示）

| 來源 | 說法 |
| --- | --- |
| Architecture Spine **AD-12** | 外層 repo 權威；乾淨 app 在 `/website`；Vercel Root Directory = `website` |
| PRD addendum / Epics | 同上 |
| **業主指示（2026-07-24）** | app 改在 **倉庫根目錄**；Vercel Root Directory = `.` |

依 `AGENTS.md`：權威文件衝突時應報告而非自行發明和解。此處採**明確業主覆寫**：實作以根目錄為準；`_bmad-output` 規劃文件**未改寫**，待正式 reconcile。

### 為什麼主流上合理

Next.js / Vercel 預設即「repo 根 = 專案根」。巢狀 `website/` 常見於 monorepo 或「規劃產物與 app 隔離」；本 repo 的 `_bmad` / `_bmad-output` 已佔用根層，但業主偏好單一扁平 app 根以降低路徑與部署設定成本。

## 3. 目標樹（現況）

```text
JP-Website/                      # Git + Next.js + Vercel root
  package.json
  next.config.ts
  src/
    app/[locale]/
    features/{catalog,content,navigation}/
    components/
    lib/{content,validation}/
    styles/
  content/
    pages/
    taxonomy/
  data/
    catalog.generated.json
    catalog-content.json
    source-catalog.xlsx
  public/media/
  scripts/
  tests/e2e/
  docs/                          # 專案知識 / 審查 / operations
  _bmad/
  _bmad-output/planning-artifacts/  # 權威規劃（唯讀；仍寫 /website）
  AGENTS.md
  README.md
```

## 4. 與主流 / Spine 的差異表

| # | 差異 | 相對主流 / Spine | 原因 | 處置 |
| --- | --- | --- | --- | --- |
| A | App 在倉庫根 | 符合 Next 主流；**偏離** Spine AD-12 `/website` | 業主覆寫（2026-07-24） | **採用根目錄** |
| B | `_bmad` / `_bmad-output` 與程式並存 | 非一般產品 repo | BMad Method | **保留** |
| C | 受治理 JSON 在 `content/` + `data/` | 符合 Spine 與內容分離實務 | 消除 `src/data` 雙來源 | **已對齊** |
| D | `src/features/` | 符合 Spine | 分域 | **已引入** |
| E | npm vs pnpm | Spine seed 為 pnpm | 現況 npm | **記錄** |
| F | `[locale]` layout 含 `<html>` | 與官方根 layout 慣例略異 | 簡化 locale 路由 | **記錄** |

## 5. 已執行調整時間線

1. 新增 `docs/`；對齊 `content/`、`data/`、`src/features/`（仍在 `website/` 下）。
2. **2026-07-24 晚：** 將整個 Next 應用自 `website/` 移至倉庫根；刪除 `website/`；合併 `.gitignore`；更新 `AGENTS.md` / `README.md` / operations 指令為 `npm run …`（無 `--prefix website`）。

## 6. 部署注意

Vercel 專案設定：

- Root Directory：**留空**或 `.`（不可再填 `website`）
- Install / Build / Output：沿用 Next.js 預設即可

## 7. 建議後續（規劃 reconcile）

若此佈局確定，應正式更新（需另開規劃任務，本輪未改）：

- `ARCHITECTURE-SPINE.md` AD-12 + Structural Seed
- PRD addendum / Epics 中 Root Directory 語句
- 相關 implementation-artifact 路徑字串
