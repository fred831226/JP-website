---
title: "Sprint Change Proposal：Story 3.7 與 V1 外部營運驗收退場"
status: proposed
mode: batch
created: 2026-08-29
project: JP-Website
change_scope: moderate
recommended_approach: direct-adjustment
approval: pending
---

# Sprint Change Proposal：Story 3.7 與 V1 外部營運驗收退場

> 本文件只提出變更，不直接修改 PRD、Addendum、Architecture、Reconciliation、UX、Epics、Story 3.7 或 Sprint Status。需由專案負責人明確核准後，才可在下一個 Developer／Dev Story 任務實施。

## 1. Issue Summary

### 1.1 變更觸發

Story 3.7「Recover Releases and Hand Off Maintenance」的 repository deliverables 已完成，包括：

- approval-bound、dry-run-first rollback contract 與 CLI；
- rollback 安全前置條件、零 provider call 的 fail-closed 行為；
- provider failure／timeout 的 indeterminate handling 與安全查證／重試／升級路徑；
- 維護、發布、rollback、DNS／帳號復原、環境隔離、媒體備份及升級文件；
- 第二維護者交接演練模板；
- 自動化文件契約與 release tests。

目前驗證結果為：content validation 0 errors、lint 0 errors／9 warnings、Next.js build 36 static pages、release／documentation tests 32/32、Playwright 32/32。Story 3.7 與 Epic 3 仍為 `in-progress`，原因不是 repository 交付缺漏，而是既有驗收文字把外部平台狀態、所有權證據、真人演練及實際 rollback 操作證據設成 Story／Epic／V1 完成門檻。

### 1.2 已確認的產品決策

JP PUMP 已決定：**Story 3.7 與 V1 不執行外部營運驗收。**

V1 驗收保留 repository 可重現、可自動驗證的 release／rollback tooling、操作文件、安全契約與測試；實際 provider 操作、帳號／網域／DNS／billing ownership、真人交接、離機備份存取／restore，以及實際 Preview／promotion／rollback 核准與證據，移為 **post-V1 operations responsibility**。

### 1.3 核心問題分類

- 類型：利害關係人明確變更驗收範圍，並修正「產品交付」與「外部營運準備」混用。
- 問題：權威文件目前一方面定義 V1 無 backend／CMS／database、以 Git/Vercel provider workflow 維運，另一方面又要求未授權、未配置或需真人／外部帳號才能取得的證據阻塞產品完成。
- 風險：若不校正，Story 3.7、Epic 3 與 V1 會被 repository 之外的外部狀態無限期阻塞；若直接把外部缺口寫成已完成，則會製造虛假驗收證據。

### 1.4 不可違反的邊界

- 不捏造 rollback、restored／superseded deployment、真人演練、帳號、MFA、billing、網域、DNS、環境隔離或媒體 restore 已完成。
- 不刪除或弱化已完成的 rollback contract、dry-run-first、安全前置條件、indeterminate handling、維運文件、演練模板與 release tests。
- 不承諾 SLA、RTO、待命時間或事故回應時間。
- 不新增 CMS、backend、database、authentication、自訂營運 UI、provider abstraction 或 runtime write path。
- 不回復、覆寫或刪除現有工作樹的任何未提交變更。

## 2. Impact Analysis

### 2.1 Epic Impact

#### Epic 3

Epic 3 的核心價值仍成立：指定維護者可透過版本化來源、驗證、Preview／Production／rollback 契約安全維護內容。需要改的是完成定義，不是技術方向。

- 保留 Story 3.1–3.5 的資料治理、媒體治理、Excel intake、validation 與 release-quality contracts。
- Story 3.6 保留 commit-bound Preview、approval、atomic promotion、failure safety 與 rollback-target contracts；但不要求實際 Vercel Preview／promotion 或 JP PUMP 實際操作核准作為 Epic／V1 完成證據。
- Story 3.7 保留 rollback tooling、維運文件、交接模板與測試；實際 rollback、真人交接及 provider／ownership readiness evidence 改列 post-V1 operations。
- 不新增 Epic，不重排 Epic，不回退已完成 Story。
- 權威文件完成校正且 repository checks 維持通過後，Story 3.7 可設為 `done`，Epic 3 因所有 Story 完成而設為 `done`。

#### 其他 Epics

- Epic 1、2、4 的公開網站功能、內容可信度、產品探索、SEO／crawl resilience 不受影響。
- Epic 4 的 repository 層 Preview `noindex`、robots 與 sitemap 隔離仍保留；只是不要求 provider-side Deployment Protection 的外部驗收來關閉 V1。
- 不需改變 Epic 順序或優先級。

### 2.2 PRD Impact

PRD 的產品願景、公開功能、資料完整性、聯絡方式、V1 無 backend／CMS／database 邊界不變。需要校正的部分是：

- SM-5 不再要求第二位真人完成一次更新作為 V1 成功指標；改為文件、模板與自動契約可驗收。
- FR-23 的 release／rollback capability 保留，但以 repository contract 與測試驗收，不要求本輪實際 provider 操作。
- NFR-5／NFR-7／NFR-10 保留安全、復原與文件責任；外部帳號、MFA、網域、DNS、billing、provider isolation、實際 rollback 與 off-device restore 驗證改為 post-V1 operations。
- 「正式營運前」依賴與第 9 章待決事項不得再阻塞 Story 3.7、Epic 3 或 V1 產品完成；它們仍可阻止未授權的實際 Production／domain mutation。
- SLA／RTO 仍明確不由產品承諾。

### 2.3 Architecture Impact

Next.js App Router、Tailwind 4、Vercel、Git 內容權威、靜態生成、provider-native release／rollback、無資料庫復原等決策全部保留。需調整的是架構決策中的驗收層級：

- AD-12：Vercel Root Directory、commercial eligibility、purchased domain、provider environment isolation 保留為實際營運設定責任，不再是 repository／V1 完成證據。
- AD-14：release-based、media-aware recovery 保留；實際 rollback、domain recovery、off-device restore 改為 post-V1 operations，而 V1 只驗收工具、文件、模板及測試。
- AD-15：安全預設與文件責任保留；外部 MFA／ownership／Deployment Protection 證據改為 post-V1 operations。
- AD-17：自動 release gates 保留；provider-side isolation 與實際環境人工驗收不阻塞 V1 closeout。
- 不新增 provider adapter、備份服務、CMS、database 或自訂控制台。

### 2.4 UX Impact

公開 UI、資訊架構、responsive 行為、無障礙、視覺 tokens 與 key screens 不變。維護者 journey 本來就使用 Git／CI／Vercel provider interfaces，沒有自訂 UI，因此不需新增 mockup 或元件。

需要把 `EXPERIENCE.md` 中的 Preview／promotion／rollback success states 明確標示為「營運流程契約」，而不是「V1 已實際執行的驗收證據」。UJ-4／UJ-5 可保留為目標流程，但其實際 provider 操作不作 Story 3.7、Epic 3 或 V1 完成門檻。

### 2.5 Story 3.7 與 Sprint Impact

- Story 3.7 的 AC 1、4、5 需由「實際外部證據」改為「repository contract、文件、模板、明確 post-V1 gap ledger」。
- AC 2、3 的安全失敗處理與完整文件範圍保留。
- 已完成的 tasks 不回退；最後 closeout task 改為依新的 repository-verifiable acceptance 收尾。
- 現有 `BLOCKED` 外部項目不改寫成 `VERIFIED`；改分類為 post-V1 operations todo／responsibility。
- 下一個核准後的 Developer／Dev Story 任務更新 Story 為 `done`、Sprint 中 `3-7` 為 `done`、`epic-3` 為 `done`。

### 2.6 Technical and Delivery Impact

- 不需要產品程式碼重寫。
- rollback CLI、release contract、runbooks、handoff template 與 32/32 release tests 全部保留。
- `recovery-readiness.md` 可繼續記錄 `OBSERVED`／`BLOCKED`，但 `BLOCKED` 的語義需改為「阻止相應外部 Production／domain／account 操作」，不再表示阻止 Story 3.7、Epic 3 或 V1 產品完成。
- 實施後至少重跑 content validation、lint、build、release／documentation tests 與 Playwright；不得把本 proposal 所引用的既有結果冒充下一次修改後的驗證結果。

## 3. Recommended Approach

### 3.1 建議：Direct Adjustment

在既有 Epic／Story 結構內直接校正權威文件與 Story 驗收文字：

1. 明確建立兩層驗收：
   - **V1 product/repository acceptance：** rollback tooling、dry-run safety、indeterminate handling、schema／release contracts、維運文件、交接演練模板、自動化測試。
   - **Post-V1 operations responsibility：** 實際 Vercel rollback／promotion、restored／superseded evidence、真人交接簽核、plan／billing／ownership／MFA／recovery、Root Directory／domain／DNS、provider-side isolation／Deployment Protection、off-device archive access／restore、實際 JP PUMP operation approval。
2. 保留所有安全工具與文件，僅改變它們是否需要外部執行證據才能關閉產品工作。
3. 以文件同步消除 PRD、架構、UX、Epic、Story 與 Sprint 的矛盾。
4. 核准後由 Developer／Dev Story 任務實施、驗證、收尾；本 proposal 階段不修改權威文件或狀態。

### 3.2 替代方案評估

| 方案 | 判定 | 理由 |
| --- | --- | --- |
| Direct Adjustment | 採用 | 不浪費已完成交付；可清楚分離產品驗收與外部營運責任；不需新架構或新 Epic。 |
| Potential Rollback | 不採用 | 回退 rollback tooling、文件或測試會降低安全性，且不能解決驗收邊界錯置。 |
| PRD MVP Review／大幅縮減 | 不採用 | V1 公開產品目標仍可達成；只需調整營運驗收範圍，不需重定義產品。 |

### 3.3 工作量、風險與時程

- 變更分類：**Moderate（治理文件跨域）**；執行方式仍為 Direct Adjustment。
- 實作工作量：低至中，主要為文件精確同步、Story closeout 與測試回歸。
- 技術風險：低；不改 runtime 架構與既有安全工具。
- 治理風險：中；若只改 Story 而不同步 PRD／架構／UX／Epics，日後會再次出現完成門檻衝突。
- 時程影響：不新增產品開發階段；核准後可在一個文件調整／Dev Story 任務完成。

## 4. Detailed Change Proposals（OLD → NEW）

以下 `OLD` 為目前權威文件語意或原文；`NEW` 為下一個核准後任務應實施的精確提案。本 proposal 不在本輪套用這些修改。

### 4.1 PRD：`prd.md`

#### A. `0.3 發布阻塞與待決事項`

**OLD**

> **待決事項：** 正式資料欄位、國外品牌內容與權利、公司／媒體素材及網域設定，須依第 9 章的負責人與重訪條件完成決策。V2 的 CMS／後端選型與延後的分析工具不阻塞 V1。

**NEW**

> **待決事項：** 正式資料欄位、國外品牌內容與權利、公司／媒體素材及網域設定，須依第 9 章的負責人與重訪條件處理。外部 Vercel／Git／網域帳號、方案／billing、MFA／recovery、Root Directory、registrar／DNS ownership、provider-side Preview／Production isolation、Deployment Protection、實際 rollback／promotion／handoff drill、離機媒體備份存取／restore 與操作核准屬 post-V1 operations responsibility；它們不得被描述為已驗證，但不阻塞 Story 3.7、Epic 3 或 V1 產品完成。V2 的 CMS／後端選型與延後的分析工具同樣不阻塞 V1。

**理由：** 在產品摘要層建立單一、明確的驗收分界。

#### B. `SM-5｜內容發布可交接性`

**OLD**

> 100% 的服務／實績摘要、合作夥伴、公司與產品更新均由同一版本控制流程留下變更紀錄、檢查結果與可回復部署；另一位具網站維護能力的人可依操作文件完成一次非產品內容更新。

**NEW**

> 100% 的服務／實績摘要、合作夥伴、公司與產品更新均由同一版本控制流程與自動化契約涵蓋，保留變更紀錄、檢查結果、Preview／Production／rollback 操作文件及可轉交的第二維護者演練模板。V1 驗收文件與自動測試是否完整、可執行；第二位真人完成更新、簽核或取得外部 provider access 屬 post-V1 operations responsibility。

**理由：** 保留可交接性成果，但移除真人演練作為 V1 KPI。

#### C. `FR-23：產品更新預覽與發布`

**OLD**

> 指定網站維護者可在正式發布前透過資料差異、自動檢查與 Vercel Preview 查看新增、修改及移除項目，以及受影響的頁面。每次產品發布均須具有可識別的版本，並可回復至上一個可用版本。

**NEW**

> 指定網站維護者具有由 repository 契約與自動測試驗證的資料差異、自動檢查、commit-bound Preview、atomic promotion 與 deployment-wide rollback 流程；每次實際產品發布仍須具有可識別版本，並以 provider-native 流程回復至具名可用 deployment。V1 產品驗收不要求建立或操作實際 Vercel Preview／Production／rollback 證據；實際操作與核准屬 post-V1 operations responsibility。

**理由：** 保留 capability 與實際營運安全要求，但把外部執行證據移出產品驗收。

#### D. `跨項營運規則`

**OLD**

> 必須交付產品更新操作文件，讓另一位具備網站維護能力的人可以接手；私人關係不作為唯一維護保障。

**NEW**

> 必須交付產品更新、發布、rollback、復原與交接操作文件及第二維護者演練模板，使合格維護者不依賴私人關係或未記錄的本機知識即可接手。V1 驗收文件與模板；第二位真人取得外部權限、完成演練與簽核屬 post-V1 operations responsibility。

保留原文：

> 更新回應時間屬維護合約或營運安排，不由本 PRD 承諾。

#### E. `NFR-5：安全`

**OLD**

> Git、Vercel、網域與其他實際使用的正式服務採最小權限、MFA、可復原帳號與非公開金鑰。Preview 必須避免被搜尋引擎收錄，必要時限制存取。

**NEW**

> Repository 必須提供安全設定、環境隔離、Preview `noindex`／必要保護、最小權限、MFA、帳號復原與非公開金鑰的操作契約及可驗證設定邊界。實際 Git／Vercel／registrar／DNS 帳號 ownership、MFA、recovery、least-privilege role 與 Deployment Protection 的 provider-side 驗證屬 post-V1 operations responsibility；缺少這些外部證據不阻塞 Story 3.7、Epic 3 或 V1 closeout，但仍可阻止未授權的實際 Production／domain 操作。

其餘 HTTPS、dependency、secret 與高風險漏洞要求保留。

#### F. `NFR-7：可用性與復原`

**OLD**

> 程式碼、內容、產品資料與設定以 Git 歷史及已知可用的 Vercel deployment 為恢復基準；網域與帳號復原責任需記錄，原始媒體另保留離機備份。

**NEW**

> 程式碼、內容、產品資料與設定採 Git 歷史及具名 Vercel deployment 的 release-based recovery contract；V1 必須交付 dry-run-first rollback tooling、fail-closed 前置條件、indeterminate failure handling、網域／帳號復原與原始媒體離機備份文件。實際 known-good deployment 認定、rollback、domain/account recovery、離機備份存取與 restore 證據屬 post-V1 operations responsibility。

保留原文且不得擴張：

> 公開站採 Vercel 的 best-effort 平台可用性，不在產品需求中承諾 99.9% SLA 或固定 4 小時 RTO；任何服務回應時間另寫入維護協議。V1 不包含資料庫復原。

#### G. `NFR-10：發布安全與可維護性`

**OLD**

> 失敗部署不得取代上一個可用版本，並提供 Preview、Production 與 rollback 操作文件。

**NEW**

> Release contract 必須確保前置條件失敗時不呼叫 provider，provider failure／timeout／未知狀態不猜測 Production 結果，且提供 Preview、Production、rollback、安全重試與升級操作文件及自動測試。實際 provider-side failure／rollback 演練不作 V1 完成門檻。

#### H. `8.1 必要依賴` 的「正式營運前」列

**OLD**

> 正式營運前｜確認商用合格的 Vercel 方案、公司帳號／MFA／復原責任、正式網域與 rollback。

**NEW**

> Post-V1 正式營運／首次相應外部操作前｜確認商用合格的 Vercel 方案、billing／account ownership、MFA／recovery、Root Directory `website`、正式網域／registrar／DNS ownership、provider-side environment isolation／Deployment Protection、known-good deployment、rollback authorization 與離機媒體備份／restore readiness。這些事項不阻塞 Story 3.7、Epic 3 或 V1 產品完成；未完成時不得捏造證據或執行相應未授權 Production／domain 操作。

#### I. `8.2 主要風險與緩解措施`

**OLD**

> 指定網站維護者形成單點依賴｜版本控制、操作文件、可回復版本及可交接流程。

> 所有 V1 內容更新依賴網站維護者｜統一內容格式、操作文件、Preview 確認、第二位可接手維護者。

**NEW**

> 指定網站維護者形成單點依賴｜V1 交付版本控制、安全 release／rollback tooling、操作文件、recovery ledger 與第二維護者演練模板；實際替代維護者 access／exercise／sign-off 列為 post-V1 operations responsibility。

> 所有 V1 內容更新依賴網站維護者｜統一內容格式、驗證、操作文件與 provider-native workflow contract；實際 Preview／Production 操作、核准與第二維護者接手不作 V1 產品驗收門檻。

#### J. `9.2 Vercel、網域與網站媒體交付`

**OLD**

> 需確認商用合格方案、公司 billing／ownership／MFA／recovery、外層唯一 repository 與 Root Directory `website`。

**NEW**

> Repository／V1 交付須文件化 commercial plan、billing／ownership／MFA／recovery、Root Directory `website`、網域／DNS、環境隔離及媒體 archive 的必要契約與查證步驟。實際 provider／account／domain／backup 證據列為 post-V1 operations responsibility，不是 Story 3.7、Epic 3 或 V1 完成門檻；未完成時維持 `OBSERVED`／`BLOCKED`／待辦，不得改寫成已驗證。

### 4.2 PRD Addendum：`addendum.md`

#### A. `預覽邊界`

**OLD**

> V1 以 Git branch／pull request 保存未發布變更，透過 Vercel Preview 檢查完整網站；JP PUMP 核准對應的 source commit 後，Production 可使用正式環境設定從該 commit 重新建置。……重大問題以已驗證 deployment rollback 復原。

**NEW**

> V1 repository contract 以 Git branch／pull request 保存未發布變更，定義 commit-bound Vercel Preview、JP PUMP approval、atomic Production promotion 與 deployment-wide rollback 的安全流程；工具預設 dry-run，所有外部 mutation 需另有明確授權。V1 驗收此契約、文件與測試，不要求本輪建立實際 Preview、執行 promotion／rollback 或取得外部核准證據。實際操作仍須依文件完成，且不得把缺少的證據描述為已驗證。

#### B. `媒體盤點與準備` 結尾

**OLD**

> 原始來源另存於可備份與交接的檔案庫。

**NEW**

> 原始來源的私有 archive、離機備份、權利文件、可移交存取與 restore 流程必須在營運文件中定義。V1 repository 驗收文件契約；實際 archive provider、第二人存取、備份時間與 restore drill 證據屬 post-V1 operations responsibility。

### 4.3 Architecture Spine：`ARCHITECTURE-SPINE.md`

#### A. 在 Executive Summary／Publication Flow 後新增驗收邊界

**OLD**

> CI → Vercel Preview → JP PUMP review → Vercel Production deployment；Production／rollback 與 provider settings 直接混在 V1 architecture acceptance 中。

**NEW**

> **V1 acceptance boundary:** Architecture acceptance covers repository-defined, testable contracts for validation, commit-bound Preview evidence, approval binding, atomic promotion, dry-run-first rollback, indeterminate handling, operations documentation and handoff templates. Actual provider/account/domain/backup state and human drills are post-V1 operations responsibilities. They remain required before the corresponding real-world mutation but do not block Story 3.7, Epic 3 or V1 product completion and must never be represented as already verified without evidence.

#### B. `AD-12 — Vercel is the V1 production envelope`

**OLD**

> Configures Vercel Root Directory as `website`. Use a commercially eligible Vercel plan. Branches create Preview deployments; only an approved commit on the production branch or an explicit promotion serves the purchased domain. Preview and Development are `noindex`; secrets are isolated by environment.

**NEW**

> The repository and runbooks define Root Directory `website`, commercially eligible plan, commit-bound Preview, approval/promotion, purchased-domain assignment, `noindex`, environment isolation and secret-scoping contracts. Actual Vercel project Root Directory, plan/billing ownership, purchased domain, provider-side environment isolation and Deployment Protection verification are post-V1 operations responsibilities; lack of that external evidence does not block repository/V1 acceptance but does block unsupported claims and any corresponding unauthorized live operation.

#### C. `AD-14 — V1 recovery is release-based and media-aware`

**OLD**

> Preserve Git history, known-good Vercel Production deployments, domain configuration documentation and an off-device copy of original media and rights evidence. Verify deployment rollback and domain recovery before launch and after major ownership changes.

**NEW**

> Preserve the release-based recovery design: Git history, immutable deployment identities, known-good selection criteria, domain recovery documentation, off-device media/rights backup requirements, dry-run-first rollback tooling and indeterminate-safe verification. V1 acceptance verifies repository tooling, documentation, templates and automated contracts. Actual known-good provider deployment proof, rollback/domain recovery operation, off-device archive access and restore drill are post-V1 operations responsibilities.

保留：無 database backup、無 partial content restore、無 V1 quarterly drill program。

#### D. `AD-15 — Security and privacy fail closed without blocking browsing`

**OLD**

> Enforce ... MFA and least privilege on Git/Vercel/domain accounts ... Preview is `noindex` and access-protected when it contains unapproved evidence.

**NEW**

> Repository code, configuration and runbooks fail closed for secret exposure, unsafe indexing, invalid authorization, dependency risk and missing required evidence. Actual Git/Vercel/domain ownership、MFA、recovery、least privilege 與 provider-side Preview protection evidence are post-V1 operations responsibilities; they remain prerequisites to the corresponding real operation, not V1 product closeout evidence.

#### E. `AD-17 — Release gates exercise the real risk cases`

**OLD**

> Before launch and after major UI changes, manually verify ... Preview isolation and Safari.

**NEW**

> Repository acceptance retains automated content/catalog/release tests and the focused public Playwright suite. Manual device/browser checks remain release-runbook responsibilities; provider-side Preview isolation／Deployment Protection verification is post-V1 operations and does not block Story 3.7、Epic 3 or V1 closeout.

#### F. Stack Seed／Capability Map／Deferred

**OLD**

- Hosting：`Vercel, commercially eligible plan; Pro is the current candidate`。
- NFR-5..NFR-10 lives in `provider accounts, CI, Vercel, docs/operations`，未區分驗收層。
- Commercial Vercel plan/account ownership、original-media archive provider、domain registrar/DNS provider 以 launch 前確認語氣呈現。

**NEW**

- Hosting：`Vercel target; commercially eligible plan selection and billing ownership are post-V1 operations responsibilities before commercial Production use.`
- Capability Map 增註：V1 驗收 `CI/repository contracts + docs/operations`；provider account/domain/backup evidence 為 post-V1 operations。
- Deferred 增註：上述事項不得被宣稱已驗證，也不得阻止 Story 3.7、Epic 3 或 V1 產品完成；只阻止相應未完成前置的實際營運動作。

### 4.4 Architecture Reconciliation：`SOURCE-RECONCILIATION-LEAN-2026-07-22.md`

#### A. `NFR-5 and NFR-6` 列

**OLD**

> ... keeping HTTPS, MFA, least privilege and privacy-safe direct contact behavior.

**NEW**

> Keep repository security/privacy contracts, HTTPS configuration, least-privilege/MFA/recovery runbook requirements and privacy-safe direct contact behavior. Actual provider account ownership/MFA/recovery evidence is post-V1 operations, not V1 product acceptance.

#### B. `NFR-7 — SLA/RTO` 列

**OLD**

> ... documented rollback and clear account/domain recovery ownership.

**NEW**

> Replace formal SLA/RTO with best-effort availability plus repository-verifiable rollback/recovery tooling and documentation. Actual rollback drill、account/domain recovery ownership proof and restore evidence are post-V1 operations responsibilities. Any response target belongs only in a maintenance agreement.

#### C. `NFR-8 and NFR-10`／Deployment rows

**OLD**

> Require focused automated Chromium smoke plus manual ... Preview isolation ...；Root Directory is `website`。

**NEW**

> Retain focused automated tests and repository `noindex`／environment contracts for V1 acceptance. Manual external provider isolation、Deployment Protection、actual Root Directory、domain assignment and live drills are post-V1 operations and must not be treated as completed without evidence.

#### D. `Resolution`

新增：

> 2026-08-29 course correction: external operations acceptance is removed from Story 3.7, Epic 3 and V1 completion. This does not reverse the adopted Vercel architecture or delete release/rollback safety deliverables; it changes only the evidence boundary between repository product acceptance and post-V1 operations.

### 4.5 UX Visual Contract：`DESIGN.md`

#### `Operational tooling boundary`

**OLD**

> Git, validation reports, Vercel Preview, Production promotion, and rollback use their provider/tool interfaces in V1. Do not skin those interfaces as JP PUMP product surfaces or add custom publish controls to the public design system.

**NEW**

> Git, validation reports, Vercel Preview, Production promotion, and rollback use their provider/tool interfaces; do not create custom JP PUMP publish controls or a branded operational UI. V1 UX acceptance is limited to the documented provider-flow contract, public environment cues implemented in the repository, and transferable operating templates. Actual provider-side Preview／Production isolation, promotion／rollback execution, external approval and human handoff evidence are post-V1 operations responsibilities.

**理由：** 公開視覺不變，只補明 UX 驗收界線；不需重畫 mockup。

### 4.6 UX Interaction Contract：`EXPERIENCE.md`

#### A. `Experience Scope`／`Maintainer release workflow`

**OLD**

> Responsive public website plus a designated-maintainer Git and Vercel release journey.

> Vercel Preview｜Review the complete public site at a non-indexable Preview URL.

> Approval and Production promotion｜Record JP PUMP confirmation and promote one named commit/deployment atomically.

> Deployment rollback｜Restore a named last-known-good deployment without partial content rollback.

**NEW**

> Responsive public website plus a repository-defined Git/Vercel operating contract for a designated maintainer. V1 UX acceptance verifies the documented stages, inputs, safety states, public environment cues and automation contracts; it does not require actual provider execution or human drill evidence.

表格三列改為：

- `Preview contract`：定義 immutable commit/deployment identity、non-indexable requirements、affected pages 與 failure states；實際 URL／Deployment Protection evidence 為 post-V1 operations。
- `Approval/promotion contract`：定義 approval binding、dry-run、atomicity、failure／indeterminate behavior；實際 JP PUMP approval／promotion 為 post-V1 operations。
- `Rollback contract`：定義具名 restored／superseded identities、authorization、dry-run、provider verification、safe escalation；實際 rollback drill/evidence 為 post-V1 operations。

#### B. `Release evidence` 與 success/failure states

**OLD**

> Git/CI/Vercel must expose ... Preview URL, approval state, Production result, and rollback target.

> Rollback success identifies both restored and superseded deployments.

**NEW**

> Release tooling and documentation must define and validate the evidence schema for source commit, affected pages, validation outcome, immutable Preview identity, approval binding, Production result and rollback target. Actual provider evidence is required only when the corresponding operation is performed; it is not required to close Story 3.7, Epic 3 or V1.

> Rollback success/failure remains an operational state contract. V1 tests schema and fail-safe behavior; it does not claim a success state occurred without provider evidence.

#### C. UJ-4／UJ-5

**OLD**

> Vercel creates a Preview ... JP PUMP approves ... Production ... previous deployment available for rollback.

**NEW**

> 保留為 post-V1 實際營運時應遵循的目標旅程；新增註記：V1 product acceptance 以 repository tooling、documents、templates 與 automated tests 驗證此流程契約，不要求本輪實際 Preview、approval、promotion 或 rollback drill。

#### D. `Source Reconciliation`／`Remaining Dependencies`

新增：

> External provider/account/domain/backup verification and human handoff drills are post-V1 operations responsibilities. Their absence is recorded truthfully and does not block Story 3.7, Epic 3 or V1 completion. The Git → Preview → approval → Production → rollback safety contract remains adopted.

### 4.7 Epics：`epics.md`

#### A. Epic 3 summary（Epic List 與完整 Epic 3 開頭同步）

**OLD**

> The designated maintainer can ... review changes in a commit-bound Preview; obtain approval; promote atomically; and recover a prior known-good release.

**NEW**

> The designated maintainer has repository-validated sources, release evidence contracts, dry-run-first Preview/promotion/rollback tooling, fail-safe provider handling, operating documentation, and handoff templates for trustworthy content operations. Actual provider execution, external ownership/security evidence, and human drills are post-V1 operations responsibilities rather than Epic 3 completion evidence.

#### B. Epic 3 Implementation Notes

**OLD**

> ... Vercel Preview/Production flow, rollback, backups, and maintainer handoff documentation.

**NEW**

> ... Vercel Preview/Production/rollback contracts, dry-run safety, indeterminate handling, backup/recovery requirements, operations documentation and maintainer handoff template. Repository-verifiable deliverables and tests close the Epic; live provider/account/domain/backup state and exercises remain post-V1 operations.

#### C. Story 3.5 external provider acceptance

**OLD**

> manual release review ... Preview isolation ... failed checks prevent promotion.

> HTTPS, security headers, MFA, and least-privilege account requirements are recorded for Production readiness.

**NEW**

> V1 acceptance retains repository/public automated and manual UI checks that can be performed without mutating external services, including environment cue、`noindex`、robots、headers and Playwright coverage. Actual provider-side Preview isolation／Deployment Protection、account ownership、MFA and least-privilege evidence are post-V1 operations; missing evidence blocks the relevant live operation, not Story/Epic/V1 closeout.

#### D. Story 3.6 acceptance boundary

**OLD**

> When Vercel creates a Preview ... evidence identifies ... Preview URL.

> Given JP PUMP approves ... When Production promotion runs ... one approved deployment becomes Production.

**NEW**

> When Preview evidence is prepared or validated, the repository contract requires immutable deployment/source identity, affected pages, gates and non-indexing evidence; automated tests verify fail-closed behavior without requiring an actual external Preview for Story/Epic/V1 closeout.

> When approval/promotion is later executed, authorization must bind the named commit, immutable Preview and evidence digest, and promotion must be atomic with indeterminate-safe verification. The contract, dry-run CLI, documentation and tests are V1 acceptance; actual JP PUMP approval and provider promotion are post-V1 operations.

#### E. Story 3.7 Story statement

**OLD**

> I want documented rollback, recovery, and handoff procedures, so that another qualified maintainer can safely operate the website and restore service.

**NEW**

> I want repository-validated rollback tooling, recovery and maintenance documentation, and a transferable handoff exercise template, so that future authorized operators have a safe, testable path to maintain the website and restore a complete release without V1 claiming unperformed external operations.

#### F. Story 3.7 Acceptance Criteria

**OLD AC1**

> Given a known-good prior Vercel deployment, when an authorized rollback is performed, then the Production domain is restored atomically ... evidence identifies both restored and superseded deployments.

**NEW AC1**

> Given immutable release evidence and rollback authorization fixtures, when rollback validation or the default CLI path runs, then the contract binds distinct restored/superseded deployment identities from the same project, defaults to dry-run, emits only the exact provider command, performs zero provider calls on failed preconditions, and requires provider/domain verification before success may be recorded. An actual Vercel rollback is not required for Story 3.7、Epic 3 or V1 completion.

**OLD AC2**

> Given rollback fails ... current public deployment remains unchanged ...

**NEW AC2**

> Given provider failure, timeout or an indeterminate result, when rollback execution reports an error, then the system does not guess the public state, redacts output, does not blindly retry, documents provider/domain verification and escalation, and never substitutes destructive Git operations.

**OLD AC3**

> Operations documentation ... covers ... domain/DNS, account ownership, MFA, recovery, environment isolation, media archive ...

**NEW AC3**

> Operations documentation covers content/catalog updates, validation, Preview, approval, promotion, rollback, safe retry/escalation, domain/DNS, account ownership, MFA, recovery, environment isolation, media archive/rights backup, upgrades and handoff. External items are labelled as post-V1 responsibilities or unresolved evidence rather than completed facts; maintenance response times remain outside product behavior.

**OLD AC4**

> A second qualified maintainer ... can complete one non-product content update through Preview ...

**NEW AC4**

> A transferable handoff exercise template defines maintainer qualification, independent identity/access, one non-product change, validation, immutable Preview evidence, noindex/protection checks, approval/promotion/rollback identification, observations and sign-off. V1 verifies template completeness; a real second maintainer, provider access, exercise and signature are post-V1 operations.

**OLD AC5**

> Launch or major ownership change recovery readiness verifies Git history, known-good deployments, domain configuration, account recovery ownership, off-device backup, plan, billing owner, Root Directory and purchased-domain ownership.

**NEW AC5**

> A recovery-readiness ledger distinguishes repository-verified facts, read-only observations and unresolved external evidence for Git/Vercel/domain/account/environment/media backup readiness. It must not infer plan、billing、ownership、MFA、recovery、Root Directory、DNS、known-good status、backup access or restore success. Those external verifications and drills are post-V1 operations and do not block Story 3.7、Epic 3 or V1 completion.

#### G. Epic 3 completion rule（新增）

> Epic 3 is complete when its repository-owned data governance, validation, release/rollback contracts, operations documentation, handoff template and automated tests satisfy their acceptance criteria. External provider/account/domain/backup state and human drills are tracked as post-V1 operations and are not Epic/V1 completion gates.

### 4.8 Implementation Story：`3-7-recover-releases-and-hand-off-maintenance.md`

#### A. Status 與 Acceptance Criteria

**OLD**

> Status: in-progress

> AC 1–5 要求實際 rollback、真人交接與 launch／ownership 外部 readiness evidence。

**NEW（核准後且文件同步／回歸驗證通過時）**

> Status: done

> AC 1–5 完整同步採用本 proposal 4.7.F 的 repository-verifiable 版本。

#### B. 最後 Task

**OLD**

> Validate delivery and close only if every acceptance criterion is evidenced.

> Update Story/Sprint to `done`, commit, push, create a commit-bound Preview, obtain JP PUMP approval, and promote/deploy only if all external evidence and authorization gates are satisfied.

**NEW**

> Validate repository delivery and close when the revised AC 1–5 are evidenced by code, documentation, templates and automated tests.

> Update Story/Sprint to `done` only after the approved authority-document reconciliation and full regression checks pass. Do not commit, push, create Preview, promote, rollback or deploy unless a separate task explicitly authorizes those actions. Track external readiness items as post-V1 operations without fabrication.

#### C. Dev Notes／Completion Notes

**OLD**

> 現有 Root Directory、domain、plan、billing、MFA、backup、second maintainer、Preview/Production／rollback 等缺口為 Story acceptance blockers。

**NEW**

> 保留所有 observed／blocked facts及日期，不更名為 verified；將它們重新分類為 post-V1 operations responsibilities。明確記錄 Story 3.7 是因驗收邊界經核准調整後，以 repository deliverables 完成，而不是因外部證據已取得。

#### D. File List

保留現有全部 Story 3.7 files；新增下一次實施實際修改的權威文件、Story 與 sprint status。不得刪除 rollback tooling、operations docs、handoff template 或 tests。

### 4.9 Sprint Status：`sprint-status.yaml`

**OLD**

```yaml
epic-3: in-progress
3-7-recover-releases-and-hand-off-maintenance: in-progress
```

**NEW（只在 proposal 核准、文件同步完成且回歸驗證通過後）**

```yaml
epic-3: done
3-7-recover-releases-and-hand-off-maintenance: done
```

同時更新 `last_updated` 為實際實施時間。其他 Epic／Story／retrospective 狀態不變。

### 4.10 Supporting Operations Documents and Tests

以下不是要刪除的交付，而是下一個任務的最小語意同步：

- `website/docs/operations/recovery-readiness.md`
  - 保留 `VERIFIED`／`OBSERVED`／`BLOCKED` 真實狀態。
  - 將「阻止 Story 驗收／V1」改為「阻止相應實際 launch／promotion／rollback／domain／account 操作」。
  - 將「關閉順序」標為 post-V1 operations checklist，不是 V1 closeout checklist。
- `website/docs/operations/maintenance.md`
  - 保留所有實際營運安全前置條件；補註這些條件約束實際操作，不是 repository/V1 completion evidence。
- `website/docs/operations/handoff-exercise.md`
  - 保留目前 `BLOCKED`／未執行事實；改明確說明它是 post-V1 演練模板，不是假完成證據。
- `website/docs/operations/release.md`
  - 保留 approval binding、dry-run-first、atomic promotion、indeterminate handling 與 rollback guidance。
- `website/tests/release/*`
  - 保留安全與文件契約測試；只在文件文字變更造成必要契約更新時做最小同步，不降低斷言強度。

## 5. Change Navigation Checklist Result

### 5.1 Understand the Trigger and Context

- [x] 1.1 Triggering story：Story 3.7。
- [x] 1.2 Core problem：利害關係人變更驗收範圍；產品／repository acceptance 與 external operations acceptance 混用。
- [x] 1.3 Evidence：Story deliverables 與測試已完成；外部 evidence ledger 如實為 `OBSERVED`／`BLOCKED`；Story/Epic 仍 `in-progress`。

### 5.2 Epic Impact Assessment

- [x] 2.1 Epic 3 可透過調整完成定義而完成。
- [x] 2.2 修改 Epic 3、Story 3.5／3.6／3.7 的驗收邊界；不新增或移除 Epic。
- [x] 2.3 Epic 1、2、4 無功能性變更；Epic 4 的 repository crawl isolation 保留。
- [N/A] 2.4 不需新增 Epic，沒有未來 Epic 失效。
- [N/A] 2.5 不需重排或改變優先級。

### 5.3 Artifact Conflict and Impact Analysis

- [x] 3.1 PRD：SM-5、FR-23、NFR-5／7／10、依賴／風險／待決事項需同步。
- [x] 3.2 Architecture：AD-12／14／15／17、Stack／Capability／Deferred 與 reconciliation 需同步。
- [x] 3.3 UX：公開 UI 不變；DESIGN／EXPERIENCE 的 operational acceptance boundary 需同步。
- [x] 3.4 Other artifacts：Epics、Story 3.7、Sprint 與 operations docs 語意需同步；release tooling/tests 保留。

### 5.4 Path Forward Evaluation

- [x] 4.1 Direct Adjustment：可行；工作量低至中、風險低（治理風險中）。
- [x] 4.2 Potential Rollback：不採用；會損失安全交付且無法解決範圍混用。
- [x] 4.3 MVP Review：不需大幅重定義；只移出 external operations acceptance。
- [x] 4.4 Selected approach：Direct Adjustment。

### 5.5 Proposal Components

- [x] 5.1 Issue Summary 完成。
- [x] 5.2 Epic／artifact impact 完成。
- [x] 5.3 Recommended Approach 與替代方案完成。
- [x] 5.4 MVP impact 與 action plan 完成。
- [x] 5.5 Handoff plan 完成。

### 5.6 Final Review and Handoff

- [x] 6.1 Checklist 已完成；待核准項明列如下。
- [x] 6.2 Proposal 已依現況、權威文件與已完成 repository deliverables 核對。
- [!] 6.3 等待專案負責人明確核准／拒絕／要求修訂。
- [!] 6.4 Sprint status 僅在核准後的下一個 Developer／Dev Story 任務更新。
- [x] 6.5 Handoff 對象、順序與成功條件已定義。

## 6. Implementation Handoff

### 6.1 Scope Classification

**Moderate governance change / Direct Adjustment.** 原因是需要同步多份權威文件與 backlog/status，但不需要產品重構或新架構。

### 6.2 Handoff Recipients

#### 專案負責人／Product Owner

- 明確核准、拒絕或要求修訂本 proposal。
- 確認「外部營運項目不阻塞 Story 3.7、Epic 3 或 V1」的產品決策。
- 不以核准本 proposal 自動授權 commit、push、Preview、promotion、rollback 或 deployment。

#### Developer／Dev Story agent（核准後的下一個任務）

1. 依第 4 節同步 PRD、Addendum、Architecture Spine、Reconciliation、DESIGN、EXPERIENCE、Epics、Story 3.7 與 Sprint Status。
2. 只做必要的 operations docs／documentation tests 語意同步；保留安全工具、文件、模板與測試。
3. 不把任何外部缺口改寫為已驗證；改列 post-V1 responsibility／todo。
4. 重跑完整驗證並記錄實際結果。
5. 驗證通過後將 Story 3.7 與 Epic 3 設為 `done`。
6. 除非下一個任務另有明確授權，不 commit、不 push、不建立 Preview、不 promotion、不 rollback、不部署。

#### PM／Architect／UX document owners（審閱責任）

- 確認各權威文件使用同一 acceptance boundary。
- 確認沒有誤刪 Vercel target architecture、release safety、rollback capability、security responsibility 或 maintainer documentation。
- 確認沒有藉此新增 CMS、backend、database、auth 或 custom operations UI。

### 6.3 Implementation Sequence

1. 先更新 PRD／Addendum 的產品驗收邊界。
2. 同步 Architecture Spine／Reconciliation。
3. 同步 DESIGN／EXPERIENCE，只調整 operational acceptance boundary，不改公開 UI。
4. 同步 Epics（含 Story 3.5／3.6／3.7）與 Story 3.7。
5. 最小同步 operations docs／tests 的 blocker 語意。
6. 執行驗證。
7. 最後才更新 Story／Sprint 為 `done`。

### 6.4 Success Criteria

- 所有權威文件一致區分 V1 repository acceptance 與 post-V1 operations responsibility。
- Story 3.7 的 revised AC 1–5 都能由 repository code、docs、templates 與 tests 直接驗證。
- 外部 rollback、deployment、owner、MFA、billing、domain、DNS、isolation、backup、restore、真人 exercise 與 approval 仍明確未驗證，沒有捏造。
- rollback tooling、dry-run、安全前置條件、indeterminate handling、維運文件、handoff template 與 release tests 全部保留。
- 不承諾 SLA／RTO。
- 不新增 CMS、backend、database、authentication 或自訂營運 UI。
- 全部既有未提交變更均保留。
- 修改後 content validation、lint、build、release／documentation tests 與 Playwright 的實際結果被如實記錄。
- Story 3.7 與 Epic 3 只在上述條件達成後改為 `done`。

## 7. Approval Gate

本 proposal 目前狀態為 `proposed`／`approval: pending`。

**請專案負責人明確回覆：核准、拒絕，或要求修訂。**

核准只授權下一個 Developer／Dev Story 任務依本 proposal 實施文件同步、Story 收尾與 Sprint 狀態更新；是否 commit、push、建立 Preview、promotion、rollback 或部署仍需另有明確指示。
