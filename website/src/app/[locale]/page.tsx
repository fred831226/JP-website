import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import HeroQuickFilter from "@/components/HeroQuickFilter";
import RevealSection from "@/components/RevealSection";
import { getBrands, getPumpTypes } from "@/lib/content/load-catalog";
import contentRaw from "@/data/catalog-content.json";
import homeData from "@/data/home.json";

const content = contentRaw as { homepagePumpTypes: { name: string; seriesId: string; slug: string; silhouette: string }[] };

export default function HomePage() {
  const { hero, companySummary, gateways, projects, partners } = homeData;
  const brands = getBrands();
  const pumpTypes = getPumpTypes();

  return (
    <>
      {/* ================================================================
          Hero Section — carousel + overlay + quick filter
          ================================================================ */}
      <section className="relative flex min-h-[480px] items-center overflow-hidden max-md:min-h-[400px]">
        <HeroCarousel images={hero.images} />

        {/* decorative: blueprint grid */}
        <div className="pointer-events-none absolute inset-0 z-[1] opacity-50" aria-hidden="true" style={{
          background: `linear-gradient(rgba(147,192,210,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(147,192,210,.08) 1px,transparent 1px)`,
          backgroundSize: "52px 52px",
          maskImage: "radial-gradient(ellipse 90% 80% at 28% 45%,#000 18%,transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 28% 45%,#000 18%,transparent 75%)",
        }} />

        {/* decorative: aurora blobs */}
        <div className="pointer-events-none absolute z-[1] h-[560px] w-[560px] rounded-full opacity-[.45] blur-[100px]" aria-hidden="true" style={{
          background: "radial-gradient(circle,rgba(0,109,143,.35),transparent 68%)",
          right: "-6%", top: "-16%",
        }} />
        <div className="pointer-events-none absolute z-[1] h-[440px] w-[440px] rounded-full opacity-[.35] blur-[90px]" aria-hidden="true" style={{
          background: "radial-gradient(circle,rgba(55,173,201,.28),transparent 68%)",
          right: "18%", bottom: "-26%",
        }} />

        {/* decorative: flowing water line at bottom */}
        <svg className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-[180px]" viewBox="0 0 1440 180" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-40,110 C240,52 420,158 720,106 C1020,54 1200,150 1480,94" stroke="rgba(0,109,143,.28)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="18 26">
            <animate attributeName="stroke-dashoffset" from="0" to="-160" dur="3.4s" repeatCount="indefinite" />
          </path>
          <path d="M-40,142 C260,98 460,180 760,132 C1060,84 1240,170 1480,120" stroke="rgba(55,173,201,.22)" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="18 26">
            <animate attributeName="stroke-dashoffset" from="0" to="-160" dur="5s" repeatCount="indefinite" />
          </path>
        </svg>

        <div className="relative z-10 mx-auto flex w-full max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-12 max-md:px-[var(--page-gutter-mobile)]">
          <div className="w-full max-w-[700px] rounded-r-[8px] border-l-[4px] border-[var(--color-identity-detail)] bg-[var(--color-primary)]/84 p-6 sm:p-8 md:w-[70%]">
            {hero.kicker && (
              <p className="mb-2 inline-flex items-center gap-2 text-sm font-[750] text-[#d8c18d]">
                <span className="kicker-dot" aria-hidden="true" />
                {hero.kicker}
              </p>
            )}
            <h1
              className="text-[var(--font-display-size)] font-[var(--font-display-weight)] leading-[var(--font-display-line-height)] tracking-[var(--font-display-letter-spacing)] text-[var(--color-on-primary)] max-md:text-[var(--font-display-mobile-size)] max-md:leading-[var(--font-display-mobile-line-height)]"
              style={{
                backgroundImage: "linear-gradient(110deg,#fff 18%,#80CCE2 48%,#5CC4D4 60%,#fff 88%)",
                backgroundSize: "220% 100%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "title-shine 7s ease-in-out infinite",
              } as React.CSSProperties}
            >
              {hero.title}
            </h1>
            <p className="mt-4 max-w-[var(--text-max)] text-base leading-[var(--font-body-line-height)] text-[#edf4f6]">
              {hero.subtitle}
            </p>
            <Link
              href={hero.ctaHref}
              className="mt-3 inline-flex min-h-[44px] items-center font-[800] text-[var(--color-on-primary)] underline decoration-[var(--color-identity-detail)] decoration-2 underline-offset-[6px] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
            >
              {hero.ctaLabel}
            </Link>

            <div className="mt-7 rounded-[8px] bg-white p-4 shadow-[0_12px_32px_rgba(11,42,61,0.12)]">
              <p className="mb-3 text-sm font-[700] text-[var(--color-primary)]">依品牌與泵浦類型找到產品系列</p>
              <HeroQuickFilter
                brands={brands.map((b) => ({ id: b.id, name: b.name }))}
                pumpTypes={pumpTypes.map((t) => ({ id: t.id, name: t.name }))}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Motion note */}
      <aside className="grid gap-2 border-b border-[var(--color-border)] bg-white px-[var(--page-gutter-desktop)] py-4 text-sm text-[var(--color-text-muted)] max-md:px-[var(--page-gutter-mobile)] md:grid-cols-[auto_1fr] md:gap-4">
        <strong className="text-[var(--color-primary)]">≤ 5 秒／靜態降級</strong>
        <span>照片序列只播放一次、總長不超過 5 秒，最後停在此靜態畫面；偏好減少動態、手機省數據或媒體失敗時直接顯示最後一張，文案、篩選與「認識我們」完全不變。</span>
      </aside>

      {/* ================================================================
          Company Summary — with pipe-flow decoration + fact panel
          ================================================================ */}
      <section className="company-preview relative overflow-hidden bg-gradient-to-br from-white via-[#f5fafb] to-[#e8f3f6]">
        {/* pipe-flow SVG decoration */}
        <svg className="company-pipe absolute inset-0 h-full w-full opacity-60" viewBox="0 0 1440 560" preserveAspectRatio="none" aria-hidden="true">
          <path className="flow-line" d="M-60,420 C220,340 380,500 640,430 C900,360 1080,480 1500,380" stroke="rgba(0,109,143,.18)" strokeWidth="42" />
          <path className="flow-line" d="M-60,420 C220,340 380,500 640,430 C900,360 1080,480 1500,380" stroke="rgba(136,201,216,.55)" strokeWidth="3" />
        </svg>

        <div className="relative mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-14 max-md:px-[var(--page-gutter-mobile)]" style={{ isolation: "isolate" }}>
          <div className="relative z-10 grid gap-10 md:grid-cols-2 md:items-center">
            <RevealSection>
              <p className="mb-2 text-xs font-[800] tracking-[0.08em] text-[var(--color-action)]">ABOUT JP PUMP</p>
              <h2 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
                {companySummary.heading}
              </h2>
              <p className="mt-4 leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
                {companySummary.body}
              </p>
              <Link
                href="/zh-tw/company"
                className="mt-4 inline-flex min-h-[44px] items-center font-[800] text-[var(--color-action)] underline underline-offset-[5px] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
              >
                認識 JP PUMP
              </Link>
            </RevealSection>
            <RevealSection delayMs={120}>
              <div className="grid grid-cols-2 gap-3 rounded-[8px] bg-[var(--color-background)] p-6 shadow-[0_10px_28px_rgba(11,42,61,0.08)]">
                <FactBox title="歷史與背景" text="正式年份與沿革待核准" />
                <FactBox title="工程能力" text="可公開的服務事實待核准" />
                <FactBox title="服務範圍" text="正式區域與能力待核准" />
                <FactBox title="回應方式" text="正式聯絡流程待核准" />
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ================================================================
          Purpose Cards — radial-glow bg, reveal with stagger delays
          ================================================================ */}
      {content.homepagePumpTypes.length > 0 && (
        <section className="relative overflow-hidden" style={{ background: "radial-gradient(ellipse 62% 50% at 85% -2%,rgba(0,109,143,.1),transparent 60%),var(--color-background)" }}>
          <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-14 max-md:px-[var(--page-gutter-mobile)]">
            <RevealSection>
              <div className="mb-8 max-w-[500px]">
                <p className="mb-2 text-xs font-[800] tracking-[0.08em] text-[var(--color-action)]">PRODUCT USES</p>
                <h2 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
                  依產品用途找到合適系列
                </h2>
                <p className="mt-3 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
                  用途名稱、排序與圖片須依正式受控分類核准。點擊整張卡片後前往系列產品頁。
                </p>
              </div>
            </RevealSection>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {content.homepagePumpTypes.map((pt, i) => (
                <RevealSection key={pt.seriesId} delayMs={i * 80} className={i < 6 ? `rv-d${i + 1}` : ""}>
                  <Link
                    href={`/zh-tw/series/${pt.slug}`}
                    className="purpose-card group relative flex flex-col overflow-hidden rounded-[var(--product-card-radius)] border border-transparent bg-white shadow-[var(--product-card-shadow)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
                  >
                    <div className="aspect-[16/9] bg-[var(--color-surface-subtle)]">
                      {pt.silhouette && (
                        <img src={pt.silhouette} alt="" className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2 p-5">
                      <span className="text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] text-[var(--color-primary)]">
                        {pt.name}
                      </span>
                    </div>
                    <span className="purpose-arrow-hover absolute bottom-5 right-5 text-2xl text-[var(--color-primary-muted)] opacity-55 transition-all duration-300 group-hover:opacity-100" aria-hidden="true">→</span>
                  </Link>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================
          Destination Gateways — grid bg, ghost numbers, expansion
          ================================================================ */}
      <section className="gateways-section relative overflow-hidden">
        <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-14 max-md:px-[var(--page-gutter-mobile)]">
          <RevealSection className="mb-10 max-w-[600px]">
            <p className="mb-2 text-xs font-[800] tracking-[0.08em] text-[var(--color-action)]">PRODUCTS &amp; SERVICES</p>
            <h2 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
              從產品探索到工程支援，選擇下一步
            </h2>
            <p className="mt-3 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
              此區負責說明網站的三條主要路徑，不重複 Hero 篩選器。
            </p>
          </RevealSection>
          <RevealSection delayMs={100}>
            <div
              className="gateway-grid grid gap-3 md:grid-cols-[1fr_1fr_1fr]"
              role="group"
              aria-label="主要入口"
            >
              {gateways.map((g, i) => (
                <Link
                  key={g.id}
                  href={g.href}
                  className="gateway group relative flex flex-col justify-between gap-8 rounded-[var(--product-card-radius)] border border-[var(--color-border)] bg-white p-7 shadow-[var(--product-card-shadow)] transition-all duration-300 ease-out hover:-translate-y-[3px] hover:border-[rgba(0,109,143,.35)] hover:bg-[var(--color-surface-subtle)] hover:shadow-lg focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
                >
                  <div>
                    <span className="gateway-no block" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <span className="block text-sm font-[700] tracking-[.16em] text-[var(--color-action)]">{getGatewayLabel(g.id)}</span>
                    <span className="mt-1 block text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] text-[var(--color-primary)]">
                      {g.title}
                    </span>
                    <span className="mt-2 block text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
                      {g.description}
                    </span>
                  </div>
                  <span className="text-sm font-[700] text-[var(--color-action)]">{getGatewayAction(g.id)}</span>
                </Link>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ================================================================
          Featured Projects — card grid with placeholder content
          ================================================================ */}
      {projects && projects.length > 0 && (
        <section className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-14 max-md:px-[var(--page-gutter-mobile)]">
          <RevealSection className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="mb-2 text-xs font-[800] tracking-[0.08em] text-[var(--color-action)]">FEATURED WORK</p>
              <h2 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
                精選建案實績
              </h2>
            </div>
            <Link
              href="/zh-tw/services"
              className="min-h-[44px] whitespace-nowrap font-[800] text-[var(--color-action)] underline underline-offset-[5px]"
            >
              瀏覽全部服務與實績
            </Link>
          </RevealSection>
          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((p, i) => (
              <RevealSection key={p.id} delayMs={i * 100}>
                <Link
                  href="/zh-tw/services"
                  className="project-card group flex flex-col overflow-hidden rounded-[var(--product-card-radius)] border border-[var(--color-border)] bg-white shadow-[var(--product-card-shadow)] transition-all duration-400"
                >
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[var(--color-surface-subtle)] text-center" style={{
                    backgroundImage: "repeating-linear-gradient(135deg,rgba(0,109,143,.07) 0 10px,transparent 10px 20px),linear-gradient(150deg,#E8EEF1,#D8E2E7)",
                  }}>
                    <div className="project-shine pointer-events-none absolute inset-0 z-1" style={{
                      background: "linear-gradient(105deg,transparent 38%,rgba(0,109,143,.09) 50%,transparent 62%)",
                      transform: "translateX(-100%)",
                    }} aria-hidden="true" />
                    <div className="relative z-0">
                      <b className="block text-sm font-[700] text-[var(--color-primary)]">正式實績照片待核准</b>
                      <span className="mt-1 block text-[11px] text-[var(--color-text-muted)]">來源、使用權與真實性確認後顯示</span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <span className="text-[11px] font-[700] tracking-[.14em] text-[var(--color-identity-detail)]">{p.type}</span>
                    <h3 className="text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] text-[var(--color-primary)]">{p.title}</h3>
                    <p className="text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">{p.description}</p>
                  </div>
                </Link>
              </RevealSection>
            ))}
          </div>
        </section>
      )}

      {/* ================================================================
          Partners — logo rows with hover accent
          ================================================================ */}
      {partners && partners.length > 0 && (
        <section className="border-t border-[var(--color-border)]" style={{
          background: "radial-gradient(ellipse 50% 62% at 10% 50%,rgba(0,109,143,.06),transparent 62%),var(--color-surface)",
        }}>
          <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-14 max-md:px-[var(--page-gutter-mobile)]">
            <RevealSection className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="mb-2 text-xs font-[800] tracking-[0.08em] text-[var(--color-action)]">PARTNERS</p>
                <h2 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
                  合作品牌與夥伴
                </h2>
              </div>
              <Link
                href="/zh-tw/partners"
                className="min-h-[44px] whitespace-nowrap font-[800] text-[var(--color-action)] underline underline-offset-[5px]"
              >
                查看合作夥伴
              </Link>
            </RevealSection>
            {partners.map((p, i) => (
              <RevealSection key={p.id} delayMs={i * 120}>
                <div className="partner-row flex items-center gap-6 rounded-[var(--product-card-radius)] border border-[var(--color-border)] bg-white p-6 shadow-[0_4px_18px_rgba(11,42,61,.06)] transition-all duration-300 ease-out">
                  <div className="flex h-[72px] w-[120px] flex-shrink-0 items-center justify-center rounded-[8px] bg-white p-2">
                    {p.logo ? (
                      <img src={p.logo} alt={p.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-[11px] font-[700] tracking-[.1em] text-[var(--color-text-muted)]">LOGO</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <strong className="text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] text-[var(--color-primary)]">{p.name}</strong>
                    <p className="mt-1 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">{p.description}</p>
                    {p.website && (
                      <a
                        href={p.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex min-h-[36px] items-center text-sm font-[700] text-[var(--color-action)] underline underline-offset-[4px]"
                      >
                        拜訪網站
                      </a>
                    )}
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function FactBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="fact-tile rounded-[6px] bg-white p-4 shadow-[0_2px_12px_rgba(11,42,61,.04)] transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[0_8px_26px_rgba(11,42,61,.12)]">
      <div className="flex items-start justify-between">
        <strong className="text-base font-[700] text-[var(--color-primary)]">{title}</strong>
        <span className="fact-dot mt-0.5 block h-[7px] w-[7px] rounded-full bg-[var(--color-primary-muted)] opacity-25" aria-hidden="true" />
      </div>
      <span className="mt-1 block text-xs leading-[var(--font-body-sm-line-height)] text-[var(--color-text-muted)]">{text}</span>
    </div>
  );
}

function getGatewayLabel(id: string) {
  switch (id) {
    case "products": return "產品探索";
    case "services": return "工程服務";
    case "contact":  return "技術聯絡";
    default:         return "";
  }
}

function getGatewayAction(id: string) {
  switch (id) {
    case "products": return "前往產品總覽 →";
    case "services": return "查看服務與實績 →";
    case "contact":  return "聯絡 JP PUMP →";
    default:         return "了解更多 →";
  }
}
