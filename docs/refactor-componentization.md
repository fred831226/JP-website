# UI 元件化與重構清單

**角色：** Winston（System Architect）  
**日期：** 2026-07-24  
**依據：** `docs/design-system.md` + DESIGN.md Technical Blueprint  
**原則：** Rule of Three 才抽象；不引入第二 UI 框架；Server Components 預設。

## 1. 目標結構

```text
src/
  components/
    ui/                 # 跨 feature primitives（本輪建立）
      PageShell.tsx
      Heading.tsx
      SectionHeader.tsx
      ButtonLink.tsx
      MissingValue.tsx
      EmptyState.tsx
    ImageDialog.tsx
    RevealSection.tsx
  features/
    catalog/
      ProductCard.tsx   # 自 products/page 抽出
      SeriesCard.tsx
      TaxonomyLanding.tsx
      CatalogFilter.tsx
      HeroQuickFilter.tsx
    content/
      GatewayBlock.tsx  # 升級並成為唯一 gateway
      …
    home/               # 後續：Home*Section
    navigation/
```

## 2. 修改清單（條列）

### Phase A — 本輪已做／同步進行

| ID | 修改處 | 動作 | 狀態 |
| --- | --- | --- | --- |
| A1 | `src/components/ui/PageShell.tsx` | 新增 | ✅ |
| A2 | `src/components/ui/Heading.tsx` | 新增 | ✅ |
| A3 | `src/components/ui/SectionHeader.tsx` | 新增 | ✅ |
| A4 | `src/components/ui/ButtonLink.tsx` | 新增 | ✅ |
| A5 | `src/components/ui/MissingValue.tsx` | 新增 | ✅ |
| A6 | `src/components/ui/EmptyState.tsx` | 新增 | ✅ |
| A7 | `src/features/catalog/SeriesCard.tsx` | 新增 | ✅ |
| A8 | `src/features/catalog/TaxonomyLanding.tsx` | 新增 | ✅ |
| A9 | `src/features/catalog/ProductCard.tsx` | 自 `products/page.tsx` 抽出 | ✅ |
| A10 | `src/app/[locale]/brands/[slug]/page.tsx` | 改用 TaxonomyLanding | ✅ |
| A11 | `src/app/[locale]/types/[slug]/page.tsx` | 同上 | ✅ |
| A12 | `src/app/[locale]/purposes/[slug]/page.tsx` | 同上 | ✅ |
| A13 | `src/app/[locale]/not-found.tsx` | PageShell + ButtonLink | ✅ |
| A14 | `src/app/[locale]/products/page.tsx` | PageShell + ProductCard + EmptyState | ✅ |
| A15 | `src/app/[locale]/series/[slug]/page.tsx` | ButtonLink + MissingValue + PageShell | ✅ |
| A16 | `src/styles/tokens.css` | 補控制／CTA shadow、identity-highlight | ✅ |
| A17 | `docs/design-system.md` | Sally 設計系統 | ✅ |
| A18 | `docs/README.md` | 索引更新 | ✅ |

### Phase B — 建議下一 PR（未改行為前先規劃）

| ID | 修改處 | 動作 | 風險 |
| --- | --- | --- | --- |
| B1 | `src/app/[locale]/page.tsx` | 拆 `HomeHero` / `HomeCompany` / `HomePurposes` / `HomeGateways` / `HomeProjects` / `HomePartners` | ✅ 已完成（`features/home`） |
| B2 | `src/features/content/GatewayBlock.tsx` | 升級為唯一 gateway（含 expand）；刪 Home 內聯 | ✅ 已完成 |
| B3 | `src/app/[locale]/company|partners|services|contact]/page.tsx` | 套用 PageShell / SectionHeader / ButtonLink | ✅ 已完成 |
| B4 | `src/features/navigation/Header.tsx` | 拆 Server chrome + Client interactive | ✅ 已完成 |
| B5 | `src/features/catalog/CatalogFilter.tsx` | 抽 `FilterChip`；shadow 改 token | 低 |
| B6 | `src/features/catalog/HeroQuickFilter.tsx` | `rounded-[6px]` → token；按鈕用 ButtonLink 語意 | 低 |
| B7 | `src/app/globals.css` | kicker / 裝飾色改讀 token；減少魔法數 | 低 |
| B8 | 刪除未使用 stub／確認 `GatewayBlock` 雙軌消失後的 dead code | 清理 | ✅ Gateway 單軌；starter SVG 已刪 |

### Phase C — 刻意不做

| 項目 | 原因 |
| --- | --- |
| 引入 shadcn / Radix 全量 | AD-16：無證明的 a11y 缺口不新增框架 |
| Site-wide dark mode | DESIGN：僅 Contact 深色 |
| 改色板／換字體棧 | 需先 reconcile DESIGN.md |
| 把靜態頁整頁 `"use client"` | 違反 static-first 與效能合約 |

## 3. 驗收標準

- `npm run validate && npm run lint && npm run build` 通過
- 視覺上仍符合 Technical Blueprint（抽殼不換皮）
- Taxonomy 三頁 DOM 結構一致
- Primary CTA 皆 ≥ 44px 高且有可見 focus
- Contact 維持深色；缺值仍為「未提供」

## 4. 部署／文件連動

- Vercel Root Directory = 倉庫根（見 `docs/folder-structure-review.md`）
- 規劃文件 AD-12 `/website` 仍待正式 reconcile（業主覆寫已記錄）
