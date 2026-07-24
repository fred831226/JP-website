# JP PUMP Design System — Implementation Layer

**角色：** Sally（UX Designer）  
**日期：** 2026-07-24  
**地位：** 實作層設計系統。視覺權威仍是 `_bmad-output/.../DESIGN.md`（Technical Blueprint）。本文件把合約轉成可元件化、符合 2025–26 工業 B2B 流行審美的**使用方式**，不另立第二套色板。

## 1. 審美定位（流行但不漂品牌）

當代工業／B2B 產品站的流行審美不是「紫漸層 + 玻璃擬態」，而是：

| 趨勢 | JP PUMP 落點 |
| --- | --- |
| 大留白 + 清楚層級 | Blueprint Gray 畫布 + navy 標題；section 用節奏而非框線 |
| 少邊框、靠色調與輕陰影 | 已有 `product-card` / `floating-layer` shadow；避免到處 outline |
| 單一強烈 CTA 色 | Action Blue 僅給動作／focus／active |
| 克制微互動 | Reveal、gateway expand、card 2px lift；尊重 `prefers-reduced-motion` |
| 可信證據優先於裝飾 | Contact 唯一深色頁；缺值 `未提供`；不發明內容 |

**刻意避開的 AI 俗套：** purple-indigo 主題、奶油底 + terracotta、滿版 pill 導覽、多層 glow、emoji、site-wide dark mode。

## 2. 設計原則

1. **Token 唯一來源** — 顏色／字級／圓角／間距只來自 `src/styles/tokens.css`（轉錄自 DESIGN.md）。
2. **一決策一主動作** — 卡片內不放多個搶戲按鈕；系列頁 primary = 前往聯絡。
3. **形狀語意** — 控制件 `radius.md`；卡片 `radius.lg`；分類標籤 `radius.xs`；pill 僅 Contact 的 tel/mailto。
4. **Server 預設** — 僅真實瀏覽器狀態才 `"use client"`。
5. **缺資料即省略或 `未提供`** — 永不推斷、零填或裝飾性假資料。

## 3. Token 消費契約

實作時優先用語意變數，禁止頁面硬編碼同色系 hex（已存在的裝飾例外應逐步遷入 token）：

| 用途 | Token |
| --- | --- |
| 頁面畫布 | `--color-background` |
| 卡片／表單 | `--color-surface` |
| 標題／權威 | `--color-primary` |
| 主 CTA | `--color-action` / `--button-primary-*` |
| 次要文案 | `--color-text-muted` |
| 缺值強調 | `--color-identity-detail`（小範圍 italic「未提供」） |
| Contact 畫布 | `--color-contact-surface*`（僅 Contact + Footer） |
| 內容寬 | `--content-max` + `--page-gutter-*` |

建議補齊（實作债，見 refactor checklist）：

- `--color-identity-highlight` ← 現有 `#d8c18d` kicker
- `--shadow-control` ← form / secondary button `0 3px 10px…`
- `--shadow-action` ← primary CTA 強調陰影
- `--focus-ring-width` / `--focus-ring-offset`

## 4. 元件語言（實作地圖）

### 4.1 Layout primitives（`src/components/ui/`）

| 元件 | 責任 |
| --- | --- |
| `PageShell` | content-max + gutter + 垂直 padding variant |
| `SectionHeader` | eyebrow（可選）+ Heading + lead |
| `Heading` | `display` \| `lg` \| `md` \| `sm` |
| `Prose` | muted body，預設 `text-max` |

### 4.2 Action primitives

| 元件 | 責任 |
| --- | --- |
| `ButtonLink` | `primary` \| `secondary` \| `contactPill`；min 44px；focus ring |
| `EmptyState` | 標題 + 原因 + 可選恢復動作（無插圖冒充內容） |
| `MissingValue` | 統一渲染「未提供」 |

### 4.3 Domain components（`src/features/`）

| 元件 | 責任 |
| --- | --- |
| `ProductCard` | 產品總覽卡片（圖 + 標題 + 描述 + 規格摘要 + 看更多） |
| `SeriesCard` | Taxonomy 輕量卡片（名稱 + 描述） |
| `TaxonomyLanding` | Brand / Type / Purpose 共用落地頁殼 |
| `GatewayBlock` | Home 三入口（含寬螢幕 expand）；刪除頁內雙軌實作 |
| `Tag` / `FilterChip` | xs radius；非導覽 pill |

## 5. 頁面組裝節奏

```text
Header（白）
→ Page Hero（可選：淺 tonal / Contact 深色）
→ PageShell sections（一節一職：一個標題 + 一句支撐 + 一個主內容）
→ Footer（深色，全站）
```

Home 第一視窗維持：品牌訊號、一則標題、一句支撐、CTA／quick filter、主視覺。不塞 stats／promo chips。

## 6. Sally 的重構建議（體驗面）

| 優先 | 建議 | 為什麼 |
| --- | --- | --- |
| P0 | 抽出 PageShell / ButtonLink / Heading | 全站對齊與 a11y focus 一次修好 |
| P0 | Taxonomy 三頁共用 | 買家在分類流中不應感到三種「差不多但不一樣」 |
| P1 | 拆 Home 為 section 元件 + 單一 GatewayBlock | 降低回歸風險；恢復 DESIGN 的 gateway expand 行為 |
| P1 | ProductCard 移出 products/page | 分類頁與總覽可共用語言 |
| P2 | 裝飾 hex → token | 避免 identity gold / cyan 漂移 |
| P2 | Header server/client 拆分 | 減少不必要 JS，改善 INP |
| P3 | 對齊 Contact pill vs 他頁 CTA | 語意清楚：Contact 內才是 pill |

## 7. 與權威文件的關係

- **可改：** 本檔、`docs/refactor-*`、`src/components/ui/*` 實作
- **唯讀權威：** `DESIGN.md`、`EXPERIENCE.md`、PRD、Architecture Spine  
- 若要改變色板或 Contact dark-only，必須先 reconcile 規劃文件，不可只在實作層偷偷換皮
