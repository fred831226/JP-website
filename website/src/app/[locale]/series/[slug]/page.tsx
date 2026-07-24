import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeriesList, getSeries, getBrand, getPurposes } from "@/lib/content/load-catalog";
import SeriesActions from "./SeriesActions";

export function generateStaticParams() {
  return getSeriesList().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeries(decodeURIComponent(slug));
  if (!series) return {};
  return { title: series.name, description: series.description };
}

export default async function SeriesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const series = getSeries(slug);
  if (!series) notFound();
  const brand = getBrand(series.brandId);

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-8 max-md:px-[var(--page-gutter-mobile)]">
      {/* Suitability note */}
      <p className="rounded-[var(--radius-md)] bg-[var(--color-surface-subtle)] px-4 py-3 text-sm text-[var(--color-text-muted)]">
        最終選型、採購與適用性請聯絡傑平有限公司確認。
      </p>

      {/* Image */}
      <div className="mt-6 flex justify-center">
        {series.image ? (
          <SeriesActions image={series.image} name={series.name} />
        ) : (
          <div className="flex aspect-[4/3] w-full max-w-lg items-center justify-center rounded-[var(--product-card-radius)] bg-[var(--color-surface-subtle)] text-sm text-[var(--color-text-muted)]">
            圖片未提供
          </div>
        )}
      </div>

      {/* Key Data */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <KeyData label="最小揚程" value={series.headMin} unit="m" />
        <KeyData label="最大揚程" value={series.headMax} unit="m" />
        <KeyData label="最小揚水量" value={series.flowMin} unit="L/min" />
        <KeyData label="最大揚水量" value={series.flowMax} unit="L/min" />
      </div>

      {/* Introduction */}
      <h1 className="mt-8 text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
        {series.name}
      </h1>
      {brand && (
        <p className="mt-1 text-sm text-[var(--color-primary-muted)]">品牌：{brand.name}</p>
      )}
      <p className="mt-3 max-w-[var(--text-max)] leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
        {series.description}
      </p>

      {/* Model Table */}
      <div className="mt-8 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
        <table className="w-full min-w-[400px] border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--color-surface-subtle)]">
              <th className="sticky left-0 bg-[var(--color-surface-subtle)] px-4 py-3 text-left font-[650] text-[var(--color-text)]">型號</th>
              <th className="px-4 py-3 text-left font-[650] text-[var(--color-text)]">揚程 (m)</th>
              <th className="px-4 py-3 text-left font-[650] text-[var(--color-text)]">揚水量 (L/min)</th>
              <th className="px-4 py-3 text-left font-[650] text-[var(--color-text)]">功率 (kW)</th>
            </tr>
          </thead>
          <tbody>
            {series.models.map((m, i) => (
              <tr key={m.id} className={i % 2 === 0 ? "bg-white" : "bg-[var(--color-background)]"}>
                <td className="sticky left-0 bg-inherit px-4 py-2.5 font-[650] text-[var(--color-text)]">{m.name}</td>
                <td className="px-4 py-2.5 text-[var(--color-text)]">{m.specs?.head ?? "未提供"}</td>
                <td className="px-4 py-2.5 text-[var(--color-text)]">{m.specs?.flow ?? "未提供"}</td>
                <td className="px-4 py-2.5 text-[var(--color-text)]">{m.specs?.power ?? "未提供"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Purpose tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {series.purposeIds.map((pid) => {
          const p = getPurposes().find((x) => x.id === pid);
          return p ? (
            <span key={pid} className="rounded-[var(--radius-xs)] bg-[var(--color-surface-subtle)] px-2.5 py-1 text-xs text-[var(--color-primary)]">
              {p.name}
            </span>
          ) : null;
        })}
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 border-t border-[var(--color-border)] pt-6 md:flex-row md:items-center md:justify-between">
        <Link
          href="/zh-tw/contact"
          className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--button-primary-radius)] bg-[var(--button-primary-bg)] px-6 text-sm font-[650] text-[var(--button-primary-fg)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] hover:brightness-110"
        >
          前往聯絡頁
        </Link>
        <Link
          href="/zh-tw/products"
          className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--button-primary-radius)] bg-white px-6 text-sm font-[650] text-[var(--color-primary)] shadow-[0_3px_10px_rgba(11,42,61,0.10)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
        >
          返回產品總覽
        </Link>
      </div>
    </div>
  );
}

function KeyData({ label, value, unit }: { label: string; value: string | null; unit: string }) {
  return (
    <div className="rounded-[var(--radius-md)] bg-white p-4 shadow-[var(--product-card-shadow)]">
      <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-lg font-[700] text-[var(--color-primary)]">
        {value ?? "未提供"} <span className="text-sm font-[400] text-[var(--color-text-muted)]">{unit}</span>
      </p>
    </div>
  );
}
