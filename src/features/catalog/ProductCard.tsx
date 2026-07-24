import Link from "next/link";
import RevealSection from "@/components/RevealSection";
import MissingValue from "@/components/ui/MissingValue";

export type ProductCardSeries = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  headMin: string | null;
  headMax: string | null;
  flowMin: string | null;
  flowMax: string | null;
};

export default function ProductCard({
  series,
  delay = 0,
}: {
  series: ProductCardSeries;
  delay?: number;
}) {
  const headRange =
    series.headMin !== null && series.headMax !== null ? (
      `${series.headMin}–${series.headMax}`
    ) : (
      <MissingValue />
    );

  return (
    <RevealSection delayMs={delay}>
      <Link
        href={`/zh-tw/series/${series.slug}`}
        className="pcat-card flex flex-col overflow-hidden rounded-[var(--product-card-radius)] border border-transparent bg-[var(--color-surface)] shadow-[var(--product-card-shadow)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
      >
        <div className="aspect-[16/9] overflow-hidden bg-[var(--color-surface-subtle)]">
          {series.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- approved media paths; next/image domain config deferred
            <img src={series.image} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-[var(--color-text-muted)]">
              圖片未提供
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <span className="text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] text-[var(--color-primary)]">
            {series.name}
          </span>
          <p className="flex-1 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
            {series.description}
          </p>
          <div className="flex items-end justify-between gap-2">
            <div className="text-xs text-[var(--color-text-muted)]">
              <span>揚程範圍（m）{headRange}</span>
              {series.flowMin !== null && series.flowMax !== null ? (
                <span className="ml-2">
                  揚水量範圍（L/min）{series.flowMin}–{series.flowMax}
                </span>
              ) : null}
            </div>
            <span className="pcat-arrow text-sm font-[650] text-[var(--color-text-muted)] transition-colors duration-300">
              看更多 →
            </span>
          </div>
        </div>
      </Link>
    </RevealSection>
  );
}
