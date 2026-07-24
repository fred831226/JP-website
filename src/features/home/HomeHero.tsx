import Link from "next/link";
import HeroCarousel from "@/features/content/HeroCarousel";
import HeroQuickFilter from "@/features/catalog/HeroQuickFilter";
import type { HomePage } from "@/lib/validation/pages";

type FilterOption = { id: string; name: string };

type HomeHeroProps = {
  hero: HomePage["hero"];
  brands: FilterOption[];
  purposes: FilterOption[];
};

export default function HomeHero({ hero, brands, purposes }: HomeHeroProps) {
  return (
    <section className="relative flex min-h-[480px] items-center overflow-hidden max-md:min-h-[400px]">
      <HeroCarousel images={hero.images} />

      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-40"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(color-mix(in srgb, var(--color-primary-muted) 12%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-primary-muted) 12%, transparent) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          maskImage: "radial-gradient(ellipse 90% 80% at 28% 45%, #000 18%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 28% 45%, #000 18%, transparent 75%)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-12 max-md:px-[var(--page-gutter-mobile)]">
        <div className="w-full max-w-[700px] rounded-r-[var(--radius-lg)] border-l-[4px] border-[var(--color-identity-detail)] bg-[var(--color-primary)]/84 p-6 sm:p-8 md:w-[70%]">
          {hero.kicker && (
            <p className="mb-2 inline-flex items-center gap-2 text-sm font-[750] text-[var(--color-identity-highlight)]">
              <span className="kicker-dot" aria-hidden="true" />
              {hero.kicker}
            </p>
          )}
          <h1 className="text-[var(--font-display-size)] font-[var(--font-display-weight)] leading-[var(--font-display-line-height)] tracking-[var(--font-display-letter-spacing)] text-[var(--color-on-primary)] max-md:text-[var(--font-display-mobile-size)] max-md:leading-[var(--font-display-mobile-line-height)]">
            {hero.title}
          </h1>
          <p className="mt-4 max-w-[var(--text-max)] text-base leading-[var(--font-body-line-height)] text-[var(--color-on-primary-muted)]">
            {hero.subtitle}
          </p>
          <Link
            href={hero.ctaHref}
            className="mt-3 inline-flex min-h-[44px] items-center font-[800] text-[var(--color-on-primary)] underline decoration-[var(--color-identity-detail)] decoration-2 underline-offset-[6px] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
          >
            {hero.ctaLabel}
          </Link>

          <div className="mt-7 rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-4 shadow-[var(--product-card-shadow)]">
            <p className="mb-3 text-sm font-[700] text-[var(--color-primary)]">依品牌與用途找到產品系列</p>
            <HeroQuickFilter brands={brands} purposes={purposes} />
          </div>
        </div>
      </div>
    </section>
  );
}
