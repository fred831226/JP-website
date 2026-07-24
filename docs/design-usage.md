# 設計使用契約（Design Usage）

**日期：** 2026-07-24  
**狀態：** 實作／PR review 可執行契約  
**權威來源（衝突時以後者為準）：**  
`_bmad-output/planning-artifacts/ux-designs/ux-JP-website-2026-07-21/DESIGN.md`、  
`_bmad-output/planning-artifacts/ux-designs/ux-JP-website-2026-07-21/EXPERIENCE.md`  
**執行時色源：** `src/styles/tokens.css`  
**排工來源：** `docs/refactor-and-design-establishment-2026-07-24.md`（P1-1～P1-3）

本文件把規劃裡的視覺／體驗 spine **濃縮成「怎麼用、禁止什麼」**。不取代 DESIGN／EXPERIENCE；細節與元件解剖仍以那兩份為準。

---

## 1. 一句話

JP PUMP 公開面是 **克制的工業 B2B**：海軍藍權威、冷中性可讀規格、青藍只做行動。感覺要像維護良好、精準、直接——不是豪華、好玩或促銷站。

---

## 2. Token 使用規則

### 2.1 單一色源

| 層 | 位置 | 規則 |
| --- | --- | --- |
| 權威定義 | `DESIGN.md` colors / typography / spacing / rounded | 改視覺系統先改規劃（或明確 reconcile），再改 token |
| 執行時 | `src/styles/tokens.css` 的 CSS 變數 | 元件與頁面**只**經由這些變數（或對應 Tailwind／utility 映射）取色、取字級、取半徑、取間距 |

**禁止：**

- 在 `src/app/**`、`src/features/**`、`src/components/**` 內寫死 DESIGN 已定義的 `#hex`（含 inline style 與任意 Tailwind 任意值如 `bg-[#0B2A3D]`）。
- 另開第二套 palette、紫／靛漸層主題、全站 dark mode。
- 把 `--color-action` 當成卡片裝飾條或分類色帶。
- 把 `--color-identity-detail`（Identity Gold）當大面積填色、分類色或一般 CTA。

**允許的例外：**

- 陰影裡的 `rgba(11, 42, 61, …)` 若已收斂在 `tokens.css` 的 `--shadow-*`／`--product-card-shadow` 等變數中，頁面引用變數即可，不要在元件再抄一份。
- 錯誤／警告色僅在真實對應狀態出現，不作裝飾。

### 2.2 語意色怎麼用

| Token | 用途 |
| --- | --- |
| `--color-primary` | Header／hero 文字面板、大標、表格強調；**不是**每個 section 的預設底 |
| `--color-action` / `--color-focus-ring` | 主按鈕、作用中導覽、連結、可見 focus |
| `--color-background` | 頁面畫布 |
| `--color-surface` | 卡片、控制項、表格承載面 |
| `--color-surface-subtle` | 輕量分區、表頭、tag 底 |
| `--color-text` / `--color-text-muted` | 正文／次要與 metadata（正文不可用過淡灰） |
| `--color-contact-surface` / `--color-contact-surface-raised` / `--color-contact-text-muted` | **僅**聯絡深色面與 Footer 契約（見 §4） |

### 2.3 字體與字級

- 字族：Noto Sans TC → PingFang TC → Microsoft JhengHei → sans-serif（`--font-family-base`／display 同源）。
- **不**另引網紅展示字、不強制第一版 web font。
- `display`：僅首頁 hero 與極少數 section 開場；窄屏用 `display-mobile`。
- `heading-lg` / `heading-md`：頁／區層級；產品名用 `heading-sm`。
- `body`：預設閱讀與表格輔助；`body-sm`：metadata／輔助，不當主閱讀路徑。
- Label：句首大寫／繁中句式；**不要**長串全大寫英文標籤。
- 數值欄位盡量 tabular numerals；單位緊貼數值，不可只靠位置暗示單位。

### 2.4 間距與版心

- 節奏：8px 為主、4px 精準對齊（`--space-*`）。
- 內容寬：`--content-max`（1200px）；長文：`--text-max`（720px）。
- Gutter：桌面 `--page-gutter-desktop`，窄屏 `--page-gutter-mobile`。
- 觸控／點擊目標：**至少 44px** 高（按鈕、導覽、FAQ、聯絡動作）。

### 2.5 圓角與陰影

| 用途 | 規則 |
| --- | --- |
| 控制項 | `--radius-md` |
| 面板／產品卡 | 不超過 `--radius-lg` |
| Tag | `--radius-xs`（不是 pill） |
| Pill | 僅緊湊狀態標籤或聯絡頁核准的 compact 動作；**不作**導覽或裝飾 chip |
| 層級 | 靠留白、色面、字級；公共面避免到處外框線 |
| 產品卡陰影 | 用 `--product-card-shadow`；hover 最多約 2px 上浮＋陰影微增 |
| 重陰影 | 僅真正浮層（選單、圖片對話框）→ `--floating-layer-shadow` |

---

## 3. Section 語言（四種）

各公開頁應能指認同一套區塊語言，避免「每頁發明一種工業風」。

### 3.1 Hero

| 面向 | 契約 |
| --- | --- |
| 職責 | 建立品牌／頁面目的；承載主標、一句支援、必要 CTA 或篩選入口 |
| 首頁 | 全寬媒體場 + 可讀內容／篩選面板；Header 是獨立表面在 hero 之上；靜態最終幀須滿足對比，不依賴動畫才可讀 |
| 產品總覽等 | Header 下緊湊技術頁 Hero：標題 + 可驗證簡介；核准媒體可選，**不可**用未核實證據替代 |
| 服務與實績 | 深藍服務 Hero + 核准能力標籤，再回到淺色內容畫布 |
| 第一視口預算 | 品牌可辨、一個主標、一句支援、一組 CTA、一個主視覺平面；不堆統計條、行程、次要促銷、多塊行銷卡 |
| 禁止 | Hero 上貼浮標、促銷貼紙、info chip；inset／側欄式「假 hero」當首屏主視覺（除非既有 mock 明確如此） |

### 3.2 Spec／規格帶

| 面向 | 契約 |
| --- | --- |
| 職責 | 讓專業買家快速讀規格與比較 |
| 關鍵數據 | 僅四欄語意：揚程 min/max（`m`）、流量 min/max（`L/min`）；缺值顯示 **`未提供`**，不可推斷、不可 `0`、不可用過淡灰藏起來 |
| 型號表 | 結構性邊框允許；缺格 `未提供`；容器內可橫向捲，**頁面**在 320 CSS px 不可整頁橫向溢出 |
| 用途 tag | 中性、非互動、無 hover「像連結」的樣子 |

### 3.3 Evidence／信任證據

| 面向 | 契約 |
| --- | --- |
| 職責 | 用**已核准、權利清楚**的事實與媒體建立信任 |
| 專案 | 服務頁就地呈現；大圖 + 核准標題／類型 + 精簡脈絡；整塊**不是**超連結；相關系列／聯絡須獨立標示動作 |
| 夥伴 | 寬幅單欄橫向塊，非多欄卡網格 |
| 禁止 | AI 氛圍圖或一般圖庫當實證；把 atmosphere 媒體放進 case-study／proof 語境；未核准內容用 placeholder 充數——應整段省略 |

### 3.4 Contact dark surface

見 §4（獨立規則，避免聯絡頁變成「另一個網站」）。

### 3.5 卡片預設

- **預設無卡片。** 若拿掉邊框／陰影／底／圓角仍不影響理解或互動，就不要做成卡。
- **例外：** 產品系列卡、篩選結果等**互動容器**；語意遵循 DESIGN 的 `product-card`。
- Hero 內禁止卡片堆疊。
- 目錄桌面網格：**兩欄**（再窄改一欄）；**不用三欄**產品格。

---

## 4. Contact 深色面與 Footer

### 4.1 何時用深色

| 表面 | Token | 說明 |
| --- | --- | --- |
| 聯絡頁主畫布 | `--color-contact-surface` | V1 **唯一**核准的深色頁面處理；不是全站 dark mode |
| 聯絡資訊區塊／raised | `--color-contact-surface-raised` | 地址、電話、Email、核准 LINE 等列 |
| 次要字 | `--color-contact-text-muted` | 深色面上的輔助文字 |
| Footer（全站） | `--footer-bg` → contact-surface | 全站頁尾用同一深色契約，與聯絡頁族譜一致 |

### 4.2 進出規則

1. 進入聯絡頁：自淺色全站（background／surface）進入深色 one-page；版面依 DESIGN：直聯 Hero／服務摘要 → 資訊 + FAQ 兩欄 → 可選地圖；窄屏同序堆疊。
2. 離開聯絡頁：僅透過全域 Header／Logo／Footer 導覽；聯絡頁**不**放「回產品／回系列」動作。
3. 淺色頁面**禁止**臨時大面積使用 `--color-contact-surface` 當 section 底（Footer 除外）。
4. 深色頁面**禁止**再混入隨意淺色「卡片島」破壞 one-page 焦點；資訊塊用 raised token，不要發明第三套深淺。

### 4.3 聯絡動作

- 僅核准的 `tel:`／`mailto:`（及核准之 LINE 等）。
- 聯絡頁內電話／Email 用 compact pill，高度 ≥ 44px。
- 缺資料或未核准：該列整段移除，不留假資料。

---

## 5. 動效

- 服務層級與焦點：既有 `RevealSection`、篩選／gateway 的克制展開即可。
- 產品卡 hover：微抬升；用途卡圖可約 1.06× zoom，不移動整卡、不擋字。
- **禁止：** 裝飾性 glow、紫漸層動效、依賴動畫才能讀懂的文字、過度 motion。

---

## 6. 語言與文案姿勢

- 公開路由僅 `/zh-tw/`；不製作文數位翻譯的 `/en/` 站。
- 語氣：事實、冷靜、直接（見 EXPERIENCE Voice and Tone）。
- 缺規格：`未提供`／引導聯絡確認；不寫「約為…」。
- 用語固定：`產品系列`、`用途`、`品牌`、`泵浦類型`、`型號規格`、`服務與實績`、`合作夥伴`。

---

## 7. Do / Don't（實作速查）

| Do | Don't |
| --- | --- |
| 經 `tokens.css` 取色／字／距／半徑 | 頁內硬編碼 DESIGN 色碼或另開 palette |
| 缺值顯示 `未提供` | 推斷、補 0、用 em dash 或淡灰藏缺值 |
| 產品區維持白／海軍藍／灰 | 分類彩條、彩色圖底、裝飾狀態色 |
| 每個決策點一個清楚主行動 | 產品卡內多顆互搶按鈕 |
| 留白＋色面＋字級建立層級 | 每區外框、玻璃擬態、過量動效 |
| 保留供應商標誌結構 | 重繪、拉伸、改色正式標誌 |
| 無核准內容則省略整段 | 用假夥伴／假專案／假新聞填版面 |
| AI 氛圍圖僅標示且不作實證 | 把 AI／圖庫當實績或產品證明 |

---

## 8. PR／實作自檢清單

- [ ] 本 diff 無新增頁內 `#hex`／任意色值（token 檔本身除外）
- [ ] 新區塊能歸入 Hero／Spec／Evidence／Contact-dark（或說明為何是例外）
- [ ] 未把 contact-surface 用在非聯絡／非 Footer 的淺色頁大面積底
- [ ] 缺技術值為 `未提供`，無推斷
- [ ] 主行動可辨、觸控目標 ≥ 44px、focus 可見（focus-ring token）
- [ ] 320px 無整頁橫向溢出；目錄格非三欄
- [ ] 無未核准媒體／文案上線

---

## 9. 相關文件

| 文件 | 角色 |
| --- | --- |
| `DESIGN.md` | 視覺權威（色、型、元件解剖） |
| `EXPERIENCE.md` | IA、行為、狀態、無障礙、維運旅程 |
| `src/styles/tokens.css` | 執行時 token |
| `docs/refactor-and-design-establishment-2026-07-24.md` | 重構＋設計建立優先級（本契約對應 P1-1～P1-3） |
| `AGENTS.md` | 專案邊界與實作戒律 |
