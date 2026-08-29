import Image from "next/image";
import Link from "next/link";
import type { Series } from "@/lib/validation/catalog";

export default function ProductCard({ series, pumpTypeName, filterable = false }: { series: Series; pumpTypeName: string; filterable?: boolean }) {
  const range = (min: string | null, max: string | null) => min !== null && max !== null ? `${min}–${max}` : "未提供";
  return (
    <Link
      href={`/zh-tw/series/${series.slug}`}
      data-catalog-series={filterable ? series.id : undefined}
      aria-label={`查看 ${series.name} 系列`}
      className="pcat-card flex flex-col overflow-hidden rounded-[var(--product-card-radius)] border border-transparent bg-white shadow-[var(--product-card-shadow)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-surface-subtle)]">
        {series.image ? <Image src={series.image} alt={`${series.name} 產品圖片`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-[var(--color-text-muted)]">圖片未提供</div>}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="w-fit rounded-[var(--radius-xs)] bg-[var(--color-surface-subtle)] px-2.5 py-1 text-xs font-[650] text-[var(--color-action)]">{pumpTypeName}</span>
        <span className="text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] text-[var(--color-primary)]">{series.name}</span>
        <p className="flex-1 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">{series.description}</p>
        <div className="text-xs text-[var(--color-text-muted)]">
          <span>揚程範圍（m）{range(series.headMin, series.headMax)}</span>
          <span className="ml-2">揚水量範圍（L/min）{range(series.flowMin, series.flowMax)}</span>
        </div>
        <span className="pcat-arrow text-sm font-[650] text-[var(--color-text-muted)]">看更多 →</span>
      </div>
    </Link>
  );
}
