import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import HeroQuickFilter from "@/components/HeroQuickFilter";
import GatewayBlock from "@/components/GatewayBlock";
import { getBrands, getPumpTypes } from "@/lib/content/load-catalog";
import contentRaw from "@/data/catalog-content.json";
import homeData from "@/data/home.json";

const content = contentRaw as { homepagePumpTypes: { name: string; seriesId: string; slug: string; silhouette: string }[] };

export default function HomePage() {
  const { hero, companySummary, gateways } = homeData;
  const brands = getBrands();
  const pumpTypes = getPumpTypes();

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[480px] items-center overflow-hidden max-md:min-h-[400px]">
        <HeroCarousel images={hero.images} />
        <div className="relative z-10 mx-auto flex w-full max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-12 max-md:px-[var(--page-gutter-mobile)]">
          <div className="w-full max-w-[700px] rounded-r-[8px] border-l-[4px] border-[var(--color-identity-detail)] bg-[var(--color-primary)]/84 p-6 sm:p-8 md:w-[70%]">
            {hero.kicker && (
              <p className="mb-2 text-sm font-[750] text-[#d8c18d]">{hero.kicker}</p>
            )}
            <h1 className="text-[var(--font-display-size)] font-[var(--font-display-weight)] leading-[var(--font-display-line-height)] tracking-[var(--font-display-letter-spacing)] text-[var(--color-on-primary)] max-md:text-[var(--font-display-mobile-size)] max-md:leading-[var(--font-display-mobile-line-height)]">
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

      {/* Company Summary with facts panel */}
      <section className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-12 max-md:px-[var(--page-gutter-mobile)]">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
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
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-[8px] bg-[var(--color-background)] p-6 shadow-[0_10px_28px_rgba(11,42,61,0.08)]">
            <FactBox title="歷史與背景" text="正式年份與沿革待核准" />
            <FactBox title="工程能力" text="可公開的服務事實待核准" />
            <FactBox title="服務範圍" text="正式區域與能力待核准" />
            <FactBox title="回應方式" text="正式聯絡流程待核准" />
          </div>
        </div>
      </section>

      {/* Purpose Cards Section */}
      {content.homepagePumpTypes.length > 0 && (
        <section className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] pb-12 max-md:px-[var(--page-gutter-mobile)]">
          <div className="mb-8 max-w-[500px]">
            <p className="mb-2 text-xs font-[800] tracking-[0.08em] text-[var(--color-action)]">PRODUCT USES</p>
            <h2 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
              依產品用途找到合適系列
            </h2>
            <p className="mt-3 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
              用途名稱、排序與圖片須依正式受控分類核准。點擊整張卡片後前往系列產品頁。
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {content.homepagePumpTypes.map((pt) => (
              <Link
                key={pt.seriesId}
                href={`/zh-tw/series/${pt.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-[var(--product-card-radius)] bg-white shadow-[var(--product-card-shadow)] transition-shadow duration-300 hover:shadow-lg focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
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
                <span className="absolute bottom-5 right-5 text-2xl text-[var(--color-primary-muted)] opacity-60 transition-opacity group-hover:opacity-100" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Destination Gateways */}
      <section className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] pb-12 max-md:px-[var(--page-gutter-mobile)]">
        <GatewayBlock gateways={gateways} />
      </section>
    </>
  );
}

function FactBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[6px] bg-white p-4">
      <strong className="block text-base font-[700] text-[var(--color-primary)]">{title}</strong>
      <span className="mt-1 block text-xs leading-[var(--font-body-sm-line-height)] text-[var(--color-text-muted)]">{text}</span>
    </div>
  );
}
