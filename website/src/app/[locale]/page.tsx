import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import HeroQuickFilter from "@/components/HeroQuickFilter";
import GatewayBlock from "@/components/GatewayBlock";
import { getBrands, getPurposes, getSeriesByPurpose } from "@/lib/content/load-catalog";
import homeData from "@/data/home.json";

export default function HomePage() {
  const { hero, companySummary, gateways } = homeData;
  const brands = getBrands();
  const purposes = getPurposes();

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[480px] items-center overflow-hidden max-md:min-h-[400px]">
        <HeroCarousel images={hero.images} />
        <div className="relative z-10 mx-auto flex w-full max-w-[var(--content-max)] flex-col gap-6 px-[var(--page-gutter-desktop)] py-12 max-md:px-[var(--page-gutter-mobile)]">
          <h1 className="text-[var(--font-display-size)] font-[var(--font-display-weight)] leading-[var(--font-display-line-height)] tracking-[var(--font-display-letter-spacing)] text-[var(--color-on-primary)] max-md:text-[var(--font-display-mobile-size)] max-md:leading-[var(--font-display-mobile-line-height)] max-md:tracking-[var(--font-display-mobile-letter-spacing)]">
            {hero.title}
          </h1>
          <p className="max-w-[var(--text-max)] text-lg leading-[var(--font-body-line-height)] text-[var(--color-on-primary)]/80">
            {hero.subtitle}
          </p>
          <HeroQuickFilter
            brands={brands.map((b) => ({ id: b.id, name: b.name }))}
            purposes={purposes.map((p) => ({ id: p.id, name: p.name }))}
          />
          <div className="flex flex-wrap items-end gap-4 max-md:flex-col">
            <Link
              href={hero.ctaHref}
              className="inline-flex min-h-[44px] items-center rounded-[var(--button-primary-radius)] bg-[var(--button-primary-bg)] px-[var(--button-primary-padding-inline)] text-sm font-[650] text-[var(--button-primary-fg)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2 hover:brightness-110"
            >
              {hero.ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* Company Summary */}
      <section className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-10 max-md:px-[var(--page-gutter-mobile)]">
        <h2 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
          {companySummary.heading}
        </h2>
        <p className="mt-4 max-w-[var(--text-max)] leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
          {companySummary.body}
        </p>
      </section>

      {/* Purpose Cards */}
      {purposes.length > 0 && (
        <section className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] pb-10 max-md:px-[var(--page-gutter-mobile)]">
          <div className="grid gap-6 md:grid-cols-2">
            {purposes.map((p) => (
              <Link
                key={p.id}
                href={`/zh-tw/products?purpose=${p.id}`}
                className="group relative flex flex-col overflow-hidden rounded-[var(--product-card-radius)] bg-white shadow-[var(--product-card-shadow)] transition-shadow duration-300 hover:shadow-lg focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
              >
                <div className="aspect-[16/9] bg-[var(--color-surface-subtle)]" />
                <div className="flex flex-col gap-2 p-5">
                  <span className="text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] text-[var(--color-primary)]">
                    {p.name}
                  </span>
                  <p className="text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
                    {p.description}
                  </p>
                </div>
                <span className="absolute bottom-5 right-5 text-2xl text-[var(--color-primary-muted)] opacity-60 transition-opacity group-hover:opacity-100" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Destination Gateways */}
      <section className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] pb-10 max-md:px-[var(--page-gutter-mobile)]">
        <GatewayBlock gateways={gateways} />
      </section>
    </>
  );
}
