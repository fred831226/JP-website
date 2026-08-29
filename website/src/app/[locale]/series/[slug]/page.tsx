import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeriesList, getSeries, getBrands, getPumpTypes } from "@/lib/content/load-catalog";
import SeriesActions from "./SeriesActions";
import RevealSection from "@/components/RevealSection";
import homeData from "@/data/home.json";
import type { Series } from "@/lib/validation/catalog";

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
  const brand = getBrands().find((b) => b.id === series.brandId);
  const pumpType = getPumpTypes().find((type) => series.pumpTypeId === type.id);
  const heroImage = homeData.hero.images[0];

  return (
    <div className="series-sect">
      <section className="relative flex min-h-[360px] items-end overflow-hidden max-md:min-h-[280px]">
        {heroImage ? (
          <Image src={heroImage} alt="" fill priority sizes="100vw" className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[var(--color-primary)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/96 via-[var(--color-primary)]/82 to-[var(--color-primary)]/38" />
        <div
          className="pointer-events-none absolute inset-0 opacity-45"
          aria-hidden="true"
          style={{
            background: "linear-gradient(rgba(147,192,210,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(147,192,210,.1) 1px,transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-12 max-md:px-[var(--page-gutter-mobile)] max-md:py-9">
          <p className="mb-3 text-xs font-[800] tracking-[0.14em] text-[var(--color-identity-detail)]">PRODUCT SERIES</p>
          <h1 className="text-[var(--font-display-size)] font-[var(--font-display-weight)] leading-[var(--font-display-line-height)] tracking-[var(--font-display-letter-spacing)] text-white max-md:text-[var(--font-display-mobile-size)] max-md:leading-[var(--font-display-mobile-line-height)]">
            {series.name}
          </h1>
          <p className="mt-4 text-sm font-[650] leading-relaxed text-[#edf4f6]">
            {brand?.name ?? "未提供"}／{pumpType?.name ?? "未提供"}／{series.name}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-12 max-md:px-[var(--page-gutter-mobile)] max-md:py-9">
        <section data-series-section="suitability" aria-label="適用性確認" className="rounded-[var(--radius-md)] border-l-[3px] border-[var(--color-action)] bg-[var(--color-surface-subtle)] px-4 py-3 text-sm text-[var(--color-text-muted)]">
          最終選型、採購與適用性請聯絡傑平有限公司確認。
        </section>

        <section data-series-section="media" aria-label="產品圖片" className="mt-8">
          {series.images.length > 0 ? (
            <div className="relative mx-auto max-w-2xl overflow-hidden rounded-[var(--product-card-radius)] bg-white shadow-[var(--product-card-shadow)]">
              <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-[6px] bg-white/85 px-2 py-1 text-[11px] text-[var(--color-text-muted)]">點擊圖片放大檢視</div>
              <SeriesActions images={series.images} name={series.name} />
            </div>
          ) : (
            <div role="img" aria-label={`${series.name} 圖片未提供`} className="flex aspect-[4/3] w-full items-center justify-center rounded-[var(--product-card-radius)] bg-[var(--color-surface-subtle)] text-sm text-[var(--color-text-muted)]">圖片未提供</div>
          )}
        </section>

        <section data-series-section="key-data" aria-labelledby="series-key-data-title" className="mt-10">
          <h2 id="series-key-data-title" className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] text-[var(--color-primary)]">關鍵資料</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[["最小揚程", series.headMin, "m"], ["最大揚程", series.headMax, "m"], ["最小揚水量", series.flowMin, "L/min"], ["最大揚水量", series.flowMax, "L/min"]].map(([label, value, unit]) => (
              <div key={label} className="rounded-[var(--radius-md)] bg-white p-4 shadow-[var(--product-card-shadow)]">
                <dt className="text-sm text-[var(--color-text-muted)]">{label}</dt>
                <dd className="mt-1 text-lg font-[700] text-[var(--color-primary)]">{value === null ? "未提供" : `${value} ${unit}`}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section data-series-section="introduction" aria-labelledby="series-introduction-title" className="mt-10 max-w-[var(--text-max)]">
          <p className="mb-2 text-xs font-[800] tracking-[0.12em] text-[var(--color-action)]">PRODUCT INTRODUCTION</p>
          <h2 id="series-introduction-title" className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] text-[var(--color-primary)]">產品介紹</h2>
          <p className="mt-4 leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">{series.description || "未提供"}</p>
          {series.introduction && series.introduction !== series.description && <p className="mt-3 whitespace-pre-line leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">{series.introduction}</p>}
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">最後更新：{series.lastUpdatedDate}</p>
        </section>

        {/* Model Table */}
        <RevealSection delayMs={200}>
          <section data-series-section="models" aria-labelledby="series-specifications-title" className="mt-14 max-md:mt-10">
            <div className="mb-6">
              <p className="mb-2 text-xs font-[800] tracking-[0.12em] text-[var(--color-action)]">TECHNICAL DATA</p>
              <h2 id="series-specifications-title" className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
                產品規格
              </h2>
            </div>
            <div className="space-y-8">
              {specificationGroups(series.id, series.models).map((group) => (
                <section key={group.name} aria-labelledby={`specification-group-${group.name}`}>
                  <h3 id={`specification-group-${group.name}`} className="mb-3 text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] text-[var(--color-primary)]">
                    {group.name} 規格表
                  </h3>
                  {group.models.length === 0 ? (
                    <p className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-5 text-sm text-[var(--color-text-muted)]">規格資料未提供</p>
                  ) : (
                    <div role="region" aria-label={`${group.name} 型號規格表`} tabIndex={0} className="max-w-full overflow-x-auto overscroll-x-contain rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[0_2px_14px_rgba(11,42,61,.06)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]">
                    <p className="sticky left-0 w-full border-b border-[var(--color-border)] bg-white px-4 py-2 text-xs text-[var(--color-text-muted)]">表格可左右滑動查看完整規格</p>
                      <table className="model-table w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
                    <th className="sticky left-0 bg-[var(--color-surface-subtle)] px-4 py-3 text-left font-[650] text-[var(--color-text)]">型號</th>
                    <th className="px-4 py-3 text-left font-[650] text-[var(--color-text)]">揚程 (m)</th>
                    <th className="px-4 py-3 text-left font-[650] text-[var(--color-text)]">揚水量 (L/min)</th>
                    <th className="px-4 py-3 text-left font-[650] text-[var(--color-text)]">功率 (kW)</th>
                  </tr>
                </thead>
                <tbody>
                  {group.models.map((m, i) => (
                    <tr key={m.id} className={`border-b border-[var(--color-border)] transition-colors duration-200 ${i % 2 === 0 ? "bg-white" : "bg-[var(--color-background)]"}`}>
                      <td className="sticky left-0 bg-inherit px-4 py-2.5 font-[650] text-[var(--color-text)]">{m.name}</td>
                      <td className="px-4 py-2.5 text-[var(--color-text)]">{specValue(m.specs, "max_head_m", "rated_head_m", "total_head_m")}</td>
                      <td className="px-4 py-2.5 text-[var(--color-text)]">{specValue(m.specs, "max_flow_lmin", "rated_flow_lmin")}</td>
                      <td className="px-4 py-2.5 text-[var(--color-text)]">{powerValue(m.specs)}</td>
                    </tr>
                  ))}
                </tbody>
                      </table>
                    </div>
                  )}
                </section>
              ))}
            </div>
          </section>
        </RevealSection>

        {/* Pump type + Purpose tags（來自網頁_產品總覽 sheet） */}
        <RevealSection delayMs={220}>
          <div data-series-section="purposes" className="mt-6 flex flex-wrap gap-2" aria-label="用途標籤">
            {pumpType ? (
              <span className="rounded-[var(--radius-xs)] border border-[var(--color-action)] bg-[rgba(0,109,143,.06)] px-2.5 py-1 text-xs font-[650] text-[var(--color-action)]">
                {pumpType.name}
              </span>
            ) : null}
            {series.purposeTags.map((tag) => (
              <span key={tag} className="rounded-[var(--radius-xs)] border border-[var(--color-border)] bg-white px-2.5 py-1 text-xs text-[var(--color-primary)]">
                {tag}
              </span>
            ))}
          </div>
        </RevealSection>

        {/* Actions */}
        <RevealSection delayMs={250}>
          <div data-series-section="actions" className="mt-8 flex flex-col gap-3 border-t border-[var(--color-border)] pt-6 md:flex-row md:items-center md:justify-between">
            <Link
              href="/zh-tw/contact"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--button-primary-radius)] bg-[var(--button-primary-bg)] px-6 text-sm font-[650] text-[var(--button-primary-fg)] shadow-[0_6px_18px_rgba(0,109,143,.22)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_10px_26px_rgba(0,109,143,.35)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
            >
              前往聯絡頁
            </Link>
            <Link
              href="/zh-tw/products"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--button-primary-radius)] bg-white px-6 text-sm font-[650] text-[var(--color-primary)] shadow-[0_3px_10px_rgba(11,42,61,0.10)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_8px_22px_rgba(11,42,61,.15)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
            >
              返回產品總覽
            </Link>
          </div>
        </RevealSection>
      </div>
    </div>
  );
}

type ModelSpecs = Series["models"][number]["specs"];

function specValue(specs: ModelSpecs, ...keys: (keyof ModelSpecs)[]): React.ReactNode {
  for (const k of keys) {
    const v = specs[k];
    if (v != null && v !== "" && v !== "null") return v;
  }
  return <span className="italic text-[var(--color-identity-detail)]">未提供</span>;
}

function powerValue(specs: ModelSpecs): React.ReactNode {
  const kw = specs["power_kw"];
  if (kw != null && kw !== "" && kw !== "null") return kw;
  return <span className="italic text-[var(--color-identity-detail)]">未提供</span>;
}

function specificationGroups<T extends { name: string }>(seriesId: string, models: T[]): { name: string; models: T[] }[] {
  const groupDefinitions: Record<string, { name: string; matches: (name: string) => boolean }[]> = {
    "grundfos-cm-cme": [
      { name: "CM", matches: (name) => /^CM(?:\s|$)/.test(name) },
      { name: "CME", matches: (name) => /^CME(?:\s|$)/.test(name) },
    ],
    "grundfos-dwk-dpk": [
      { name: "DWK", matches: (name) => /^DWK(?:\.|\s|$)/.test(name) },
      { name: "DPK", matches: (name) => /^DPK(?:\.|\s|$)/.test(name) },
    ],
    "grundfos-sc-hc": [
      { name: "SC", matches: (name) => /^\d*SC[CEV]/.test(name) },
      { name: "HC", matches: (name) => /^\d*HCC/.test(name) },
      { name: "HS／SS", matches: (name) => /^\d*(?:HSV|SSV|SSC)/.test(name) },
    ],
    "grundfos-cl-lf": [
      { name: "CL", matches: (name) => /^CL(?:\s|$)/.test(name) },
      { name: "LF", matches: (name) => /^LF(?:\s|$)/.test(name) },
    ],
    "grundfos-nb-nbg-nk-nkg-nbe-nbge-nke-nkge": [
      { name: "NB／NBE／NK／NKE", matches: (name) => /^(?:NB|NBE|NK|NKE)(?:\s|$)/.test(name) },
      { name: "NBG／NBGE／NKG／NKGE", matches: (name) => /^(?:NBG|NBGE|NKG|NKGE)(?:\s|$)/.test(name) },
    ],
  };
  const definitions = groupDefinitions[seriesId];
  if (!definitions) return [{ name: "型號", models }];
  return definitions.map((group) => ({ ...group, models: models.filter((model) => group.matches(model.name)) }));
}
