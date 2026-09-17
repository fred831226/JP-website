import Image from "next/image";
import Link from "next/link";
import type { Series } from "@/lib/validation/catalog";
import { formatCatalogRange } from "@/lib/catalog-format";

export default function ProductCard({ series, pumpTypeName, filterable = false }: { series: Series; pumpTypeName: string; filterable?: boolean }) {
  return (
    <Link
      href={`/zh-tw/series/${series.slug}`}
      data-catalog-series={filterable ? series.id : undefined}
      aria-label={`查看 ${series.name} 系列`}
      className="pcat-card flex flex-col overflow-hidden rounded-[var(--product-card-radius)] border border-transparent bg-white shadow-[var(--product-card-shadow)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-subtle)]">
        {series.image ? <Image src={series.image} alt={`${series.name} 產品圖片`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain p-4" /> : <div className="flex h-full items-center justify-center text-sm text-[var(--color-text-muted)]">圖片未提供</div>}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="w-fit rounded-[var(--radius-xs)] bg-[var(--color-surface-subtle)] px-2.5 py-1 text-xs font-[650] text-[var(--color-action)]">{pumpTypeName}</span>
        <span className="text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] text-[var(--color-primary)]">{series.name}</span>
        <p className="flex-1 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">{series.description}</p>
        <div className="text-xs font-[600] text-[var(--color-action)]">
          <span>揚程範圍（m）{formatCatalogRange(series.headMin, series.headMax)}</span>
          <span className="ml-2">揚水量範圍（L/min）{formatCatalogRange(series.flowMin, series.flowMax)}</span>
        </div>
        <span className="pcat-arrow mt-2 inline-flex min-h-[44px] w-11 self-end items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h13" />
            <path d="m13 6 6 6-6 6" />
          </svg>
          <span className="sr-only">查看 {series.name} 系列</span>
        </span>
      </div>
    </Link>
  );
}
