import Link from "next/link";
import Image from "next/image";
import HeroCarousel from "@/components/HeroCarousel";
import HeroQuickFilter from "@/components/HeroQuickFilter";
import RevealSection from "@/components/RevealSection";
import ProjectGalleryDescription from "@/components/ProjectGalleryDescription";
import { getBrands, getPumpTypes } from "@/lib/content/load-catalog";
import contentRaw from "@/data/catalog-content.json";
import homeData from "@/data/home.json";
import { createPageMetadata } from "@/lib/seo";
import { englishContent } from "@/lib/content/en";

const content = contentRaw as { homepagePumpTypes: { name: string; seriesId: string; pumpTypeId: string; silhouette: string }[] };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return locale === "en"
    ? createPageMetadata({ description: englishContent.home.intro, pathname: "/en", locale: "en", alternatePathname: "/zh-tw" })
    : createPageMetadata({ description: "傑平有限公司（JP PUMP）— 專業泵浦選型、供應、安裝、維修與顧問服務。", pathname: "/zh-tw", alternatePathname: "/en" });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale === "en" ? "en" : "zh-tw";
  const en = locale === "en";
  const { hero, companySummary, projectGallery, gateways, partners } = homeData;
  const brands = getBrands();
  const pumpTypes = getPumpTypes();

  return (
    <>
      {/* ================================================================
          Hero Section — carousel + overlay + quick filter
          ================================================================ */}
      <section className="relative flex min-h-[calc(100svh-102px)] items-center overflow-hidden max-md:min-h-[calc(100svh-76px)]">
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

        <div className="relative z-10 mx-auto flex w-full max-w-[var(--content-max)] justify-end px-[var(--page-gutter-desktop)] py-8 max-md:px-[var(--page-gutter-mobile)]">
          <div className="flex w-full max-w-[500px] flex-col items-end">
            <h1 className="sr-only">JP PUMP</h1>
            <div className="home-hero-panel w-full max-w-[360px] rounded-l-[8px] border-r-[4px] border-[var(--color-identity-detail)] bg-[var(--color-primary)]/76 p-3 sm:p-4">
              {hero.kicker && (
                <p className="mb-2 inline-flex items-center gap-2 text-sm font-[750] text-[#d8c18d]">
                  <span className="kicker-dot" aria-hidden="true" />
                  {en ? englishContent.view.heroKicker : hero.kicker}
                </p>
              )}
              <Link
                href={en ? "/en/company" : hero.ctaHref}
                className="mt-3 flex min-h-[44px] w-fit items-center font-[800] text-[var(--color-on-primary)] underline decoration-[var(--color-identity-detail)] decoration-2 underline-offset-[6px] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
              >
                {en ? englishContent.shared.learnMore : hero.ctaLabel}
              </Link>

              <div className="mt-4 rounded-[8px] bg-white p-3 shadow-[0_12px_32px_rgba(11,42,61,0.12)]">
                <HeroQuickFilter
                  brands={brands.map((b) => ({ id: b.id, name: en ? (b.id === "grundfos" ? "Grundfos" : "JP PUMP") : b.name }))}
                  pumpTypes={pumpTypes.map((type, index) => ({ id: type.id, name: en ? englishContent.view.pumpTypeNames[index] : type.name }))}
                  locale={locale}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Summary — restrained technical field */}
      <section className="company-preview relative overflow-visible">
        <div className="relative mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-14 max-md:px-[var(--page-gutter-mobile)]" style={{ isolation: "isolate" }}>
          <div className="relative z-10 grid gap-8 md:grid-cols-[minmax(260px,.8fr)_minmax(0,1.2fr)] md:items-center md:gap-12">
            <RevealSection className="order-2 md:order-1">
              <div className="relative z-[2] overflow-hidden rounded-[8px] bg-[var(--color-primary)] p-2 shadow-[0_18px_40px_rgba(11,42,61,.16)] md:-mt-24">
                <Image
                  src="/media/company-brand-sign.png"
                  alt={en ? "JP PUMP company sign" : "傑平有限公司 JP PUMP 招牌"}
                  width={880}
                  height={660}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </RevealSection>
            <RevealSection className="order-1 md:order-2">
              <p className="mb-2 text-xs font-[800] tracking-[0.08em] text-[var(--color-action)]">ABOUT JP PUMP</p>
              <h2 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
                {en ? englishContent.view.companySummaryHeading : companySummary.heading}
              </h2>
              <p className="mt-4 whitespace-pre-line leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
                {en ? englishContent.view.companySummaryBody : companySummary.body}
              </p>
              <Link
                href={`/${locale}/company`}
                className="mt-4 inline-flex min-h-[44px] items-center font-[800] text-[var(--color-action)] underline underline-offset-[5px] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
              >
                {en ? englishContent.company.title : "認識 JP PUMP"}
              </Link>
            </RevealSection>
          </div>
        </div>
      </section>

      {projectGallery && (
        <section className="project-gallery-section relative overflow-hidden">
          <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-14 max-md:px-[var(--page-gutter-mobile)]">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
              <div className="max-w-[680px]">
                <RevealSection>
                  <p className="mb-2 text-xs font-[800] tracking-[0.08em] text-[var(--color-action)]">PROJECT GALLERY</p>
                  <h2 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
                    {en ? englishContent.view.projectGalleryHeading : projectGallery.heading}
                  </h2>
                </RevealSection>
                <ProjectGalleryDescription paragraphs={(en ? englishContent.view.projectGalleryDescription : projectGallery.description).slice(0, 2)} />
              </div>
              <RevealSection delayMs={160}>
                <Link
                  href={en ? "/en/contact" : "/zh-tw/services"}
                  className="inline-flex min-h-[44px] items-center font-[800] text-[var(--color-action)] underline underline-offset-[5px] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
                >
                  {en ? englishContent.view.galleryAction : "查看服務與實績"}
                </Link>
              </RevealSection>
            </div>
            <div className="project-gallery-grid" aria-label={en ? "Project photo gallery" : "工程實績照片牆"}>
              {projectGallery.photos.map((photo, i) => (
                <RevealSection key={photo.src} delayMs={i * 85} className="project-gallery-reveal">
                  <figure className="project-gallery-tile">
                    <Image src={photo.src} alt={en ? englishContent.view.photoAlts[i] : photo.alt} width={1200} height={800} loading="lazy" />
                  </figure>
                </RevealSection>
              ))}
            </div>
            <ProjectGalleryDescription paragraphs={(en ? englishContent.view.projectGalleryDescription : projectGallery.description).slice(2)} belowGallery />
          </div>
        </section>
      )}

      {/* ================================================================
          Product Type Cards — radial-glow bg, reveal with stagger delays
          ================================================================ */}
      {content.homepagePumpTypes.length > 0 && (
        <section className="relative overflow-hidden" style={{ background: "radial-gradient(ellipse 62% 50% at 85% -2%,rgba(0,109,143,.1),transparent 60%),var(--color-background)" }}>
          <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-14 max-md:px-[var(--page-gutter-mobile)]">
            <RevealSection>
              <div className="mb-8 max-w-[500px]">
                <p className="mb-2 text-xs font-[800] tracking-[0.08em] text-[var(--color-action)]">PRODUCT USES</p>
                <h2 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
                  {en ? englishContent.view.pumpTypesHeading : "依產品類別找到合適系列"}
                </h2>
              </div>
            </RevealSection>
            <div className="mx-auto grid max-w-[var(--content-max)] gap-5 md:grid-cols-3">
              {content.homepagePumpTypes.map((pt, i) => (
                <RevealSection key={pt.seriesId} delayMs={i * 80} className={i < 6 ? `rv-d${i + 1}` : ""}>
                  <Link
                    href={`/${locale}/products?type=${pt.pumpTypeId}`}
                    className="product-type-card group relative flex flex-col overflow-hidden rounded-[var(--product-card-radius)] border border-transparent bg-white shadow-[var(--product-card-shadow)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
                  >
                    <div className="product-type-card-media relative h-[280px] bg-[var(--color-surface-subtle)] sm:h-[340px]">
                      {pt.silhouette && (
                        <Image src={pt.silhouette} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-contain px-5 pt-5 pb-20 transition-transform duration-300 group-hover:scale-105" />
                      )}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[rgba(11,42,61,.96)] via-[rgba(11,42,61,.64)] to-transparent" aria-hidden="true" />
                      <span className="absolute inset-x-12 bottom-3 z-[2] text-center text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] !text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.72)]" style={{ color: "#fff" }}>
                        {en ? englishContent.view.pumpTypeNames[i] : pt.name}
                      </span>
                      <span className="product-type-arrow-hover absolute bottom-2 right-5 z-[2] text-2xl text-white/85 transition-all duration-300 group-hover:text-white" aria-hidden="true">→</span>
                    </div>
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
              {en ? englishContent.view.gatewaysHeading : "從產品探索到工程支援，選擇下一步"}
            </h2>
          </RevealSection>
          <RevealSection delayMs={260}>
            <div
              className="gateway-grid grid gap-5"
              role="group"
              aria-label={en ? "Main destinations" : "主要入口"}
            >
              {gateways.map((g, i) => (
                <Link
                  key={g.id}
                  href={en ? (g.id === "products" ? "/en/products" : "/en/contact") : g.href}
                  className={`gateway gateway--${g.id} group relative flex min-h-[200px] flex-col justify-center overflow-hidden rounded-[var(--product-card-radius)] border border-[var(--color-border)] p-7 shadow-[var(--product-card-shadow)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2 ${g.id === "services" ? "items-start text-left" : "items-end text-right"}`}
                >
                  <span className="gateway-media pointer-events-none absolute inset-0" aria-hidden="true">
                    <Image src={g.background} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                  </span>
                  <div className="relative z-[2] max-w-[640px]">
                    <span className="block text-sm font-[700] tracking-[.16em] text-[var(--color-identity-detail)]">{en ? (g.id === "products" ? "PRODUCTS" : g.id === "services" ? "SERVICES" : "CONTACT") : getGatewayLabel(g.id)}</span>
                    <span className="mt-1 block text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.7)]">
                      {en ? englishContent.view.gatewayTitles[i] : g.title}
                    </span>
                    <span className="mt-2 block text-sm leading-[var(--font-body-line-height)] text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,.7)]">
                      {en ? englishContent.view.gatewayDescriptions[i] : g.description}
                    </span>
                  </div>
                  <span className="relative z-[2] mt-5 text-sm font-[700] text-white underline decoration-[var(--color-identity-detail)] underline-offset-[5px] drop-shadow-[0_2px_8px_rgba(0,0,0,.7)]">{en ? englishContent.view.gatewayActions[i] : getGatewayAction(g.id)}</span>
                </Link>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

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
                  {en ? englishContent.view.partnerHeading : "授權經銷品牌"}
                </h2>
              </div>
              <Link
                href={`/${locale}/partners`}
                className="min-h-[44px] whitespace-nowrap font-[800] text-[var(--color-action)] underline underline-offset-[5px]"
              >
                {en ? englishContent.view.partnerAction : "查看授權經銷品牌"}
              </Link>
            </RevealSection>
            {partners.map((p, i) => (
              <RevealSection key={p.id} delayMs={i * 120}>
                <div className="partner-row flex items-center gap-6 rounded-[var(--product-card-radius)] border border-[var(--color-border)] bg-white p-6 shadow-[0_4px_18px_rgba(11,42,61,.06)] transition-all duration-300 ease-out">
                  <div className="flex h-[104px] w-[184px] flex-shrink-0 items-center justify-center rounded-[8px] bg-white p-2">
                    {p.logo ? (
                      <Image src={p.logo} alt={en ? "Grundfos" : p.name} width={368} height={208} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-[11px] font-[700] tracking-[.1em] text-[var(--color-text-muted)]">LOGO</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <strong className="text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] text-[var(--color-primary)]">{en ? "Grundfos" : p.name}</strong>
                    <p className="mt-1 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">{en ? englishContent.partners.grundfosSummary : p.description}</p>
                    {p.website && (
                      <a
                        href={p.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex min-h-[36px] items-center text-sm font-[700] text-[var(--color-action)] underline underline-offset-[4px]"
                      >
                        {en ? englishContent.partners.websiteAction : "拜訪網站"}
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
