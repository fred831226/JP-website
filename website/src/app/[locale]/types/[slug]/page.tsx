import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPumpTypes, getPumpTypeBySlug, getSeriesByPumpType } from "@/lib/content/load-catalog";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return getPumpTypes().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const type = getPumpTypeBySlug(decodeURIComponent(slug));
  if (!type) return {};
  return { title: type.name, description: type.description };
}

export default async function PumpTypePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const type = getPumpTypeBySlug(slug);
  if (!type) notFound();
  const seriesList = getSeriesByPumpType(type.id);

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-8 max-md:px-[var(--page-gutter-mobile)]">
      <h1 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
        {type.name}
      </h1>
      <p className="mt-2 max-w-[var(--text-max)] leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
        {type.description}
      </p>
      {seriesList.length === 0 ? (
        <div className="mt-6 text-sm text-[var(--color-text-muted)]">
          <p>此分類尚無已發布的產品系列。</p>
          <div className="mt-3 flex gap-4"><Link href="/zh-tw/products">前往產品總覽</Link><Link href="/zh-tw/contact">聯絡我們</Link></div>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {seriesList.map((series) => <ProductCard key={series.id} series={series} pumpTypeName={type.name} />)}
        </div>
      )}
    </div>
  );
}
