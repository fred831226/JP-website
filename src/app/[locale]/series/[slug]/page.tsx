import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSeriesList, getSeries, getBrand, getPumpTypes } from "@/lib/content/load-catalog";
import SeriesActions from "./SeriesActions";
import RevealSection from "@/components/RevealSection";
import PageShell from "@/components/ui/PageShell";
import ButtonLink from "@/components/ui/ButtonLink";
import MissingValue from "@/components/ui/MissingValue";
import Heading from "@/components/ui/Heading";

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
    <div className="series-sect">
      <PageShell padding="sm">

        {/* Suitability note */}
        <RevealSection>
          <div className="rounded-[var(--radius-md)] border-l-[3px] border-[var(--color-action)] bg-[var(--color-surface-subtle)] px-4 py-3 text-sm text-[var(--color-text-muted)]">
            最終選型、採購與適用性請聯絡傑平有限公司確認。
          </div>
        </RevealSection>

        {/* Image */}
        <div className="mt-6 flex justify-center">
          <RevealSection delayMs={100}>
            {series.image ? (
              <div className="relative overflow-hidden rounded-[var(--product-card-radius)] bg-[var(--color-surface)] shadow-[var(--product-card-shadow)]">
                <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-[var(--radius-md)] bg-[var(--color-surface)]/80 px-2 py-1 text-[11px] text-[var(--color-text-muted)]">
                  點擊圖片放大檢視
                </div>
                <SeriesActions image={series.image} name={series.name} />
              </div>
            ) : (
              <div className="flex aspect-[4/3] w-full max-w-lg items-center justify-center rounded-[var(--product-card-radius)] bg-[var(--color-surface-subtle)] text-sm text-[var(--color-text-muted)]">
                圖片未提供
              </div>
            )}
          </RevealSection>
        </div>

        {/* Key Data */}
        <RevealSection delayMs={150}>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <KeyData label="最小揚程" value={series.headMin} unit="m" />
            <KeyData label="最大揚程" value={series.headMax} unit="m" />
            <KeyData label="最小揚水量" value={series.flowMin} unit="L/min" />
            <KeyData label="最大揚水量" value={series.flowMax} unit="L/min" />
          </div>
        </RevealSection>

        {/* Introduction */}
        <RevealSection delayMs={180}>
          <Heading as="h1" size="lg" className="mt-8">
            {series.name}
          </Heading>
          {brand && (
            <p className="mt-1 text-sm text-[var(--color-primary-muted)]">品牌：{brand.name}</p>
          )}
          <p className="mt-3 max-w-[var(--text-max)] leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
            {series.description}
          </p>
        </RevealSection>

        {/* Model Table */}
        <RevealSection delayMs={200}>
          <div className="mt-8 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-control)]">
            <div className="overflow-x-auto">
              <table className="model-table w-full min-w-[400px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
                    <th className="sticky left-0 bg-[var(--color-surface-subtle)] px-4 py-3 text-left font-[650] text-[var(--color-text)]">型號</th>
                    <th className="px-4 py-3 text-left font-[650] text-[var(--color-text)]">揚程 (m)</th>
                    <th className="px-4 py-3 text-left font-[650] text-[var(--color-text)]">揚水量 (L/min)</th>
                    <th className="px-4 py-3 text-left font-[650] text-[var(--color-text)]">功率 (kW)</th>
                  </tr>
                </thead>
                <tbody>
                  {series.models.map((m, i) => (
                    <tr key={m.id} className={`border-b border-[var(--color-border)] transition-colors duration-200 ${i % 2 === 0 ? "bg-[var(--color-surface)]" : "bg-[var(--color-background)]"}`}>
                      <td className="sticky left-0 bg-inherit px-4 py-2.5 font-[650] text-[var(--color-text)]">{m.name}</td>
                      <td className="px-4 py-2.5 text-[var(--color-text)]">{m.specs?.head ?? <MissingValue />}</td>
                      <td className="px-4 py-2.5 text-[var(--color-text)]">{m.specs?.flow ?? <MissingValue />}</td>
                      <td className="px-4 py-2.5 text-[var(--color-text)]">{m.specs?.power ?? <MissingValue />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </RevealSection>

        {/* Pump type + Purpose tags（來自網頁_產品總覽 sheet） */}
        <RevealSection delayMs={220}>
          <div className="mt-6 flex flex-wrap gap-2">
            {series.pumpTypeIds.map((tid) => {
              const pt = getPumpTypes().find((x) => x.id === tid);
              return pt ? (
                <span key={tid} className="rounded-[var(--radius-xs)] bg-[var(--color-surface-subtle)] px-2.5 py-1 text-xs font-[650] text-[var(--color-primary)]">
                  {pt.name}
                </span>
              ) : null;
            })}
            {series.purposeTags.map((tag) => (
              <span key={tag} className="rounded-[var(--radius-xs)] bg-[var(--color-surface-subtle)] px-2.5 py-1 text-xs text-[var(--color-primary)]">
                {tag}
              </span>
            ))}
          </div>
        </RevealSection>

        {/* Actions */}
        <RevealSection delayMs={250}>
          <div className="mt-8 flex flex-col gap-3 border-t border-[var(--color-border)] pt-6 md:flex-row md:items-center md:justify-between">
            <ButtonLink href="/zh-tw/contact">前往聯絡頁</ButtonLink>
            <ButtonLink href="/zh-tw/products" variant="secondary">
              返回產品總覽
            </ButtonLink>
          </div>
        </RevealSection>
      </PageShell>
    </div>
  );
}

function KeyData({ label, value, unit }: { label: string; value: string | null; unit: string }) {
  return (
    <div className="keydata-tile rounded-[var(--radius-md)] border border-transparent bg-[var(--color-surface)] p-4 shadow-[var(--product-card-shadow)]">
      <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-lg font-[700] text-[var(--color-primary)]">
        {value ?? <MissingValue />}{" "}
        <span className="text-sm font-[400] text-[var(--color-text-muted)]">{unit}</span>
      </p>
    </div>
  );
}
