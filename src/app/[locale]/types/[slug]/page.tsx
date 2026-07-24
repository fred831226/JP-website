import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPumpTypes, getPumpType, getSeriesByPumpType } from "@/lib/content/load-catalog";
import TaxonomyLanding from "@/features/catalog/TaxonomyLanding";

export function generateStaticParams() {
  return getPumpTypes().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const type = getPumpType(decodeURIComponent(slug));
  if (!type) return {};
  return { title: type.name, description: type.description };
}

export default async function PumpTypePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const type = getPumpType(slug);
  if (!type) notFound();

  return (
    <TaxonomyLanding
      title={type.name}
      description={type.description}
      seriesList={getSeriesByPumpType(type.id)}
      emptyMessage="此分類尚無已發布的產品系列。"
    />
  );
}
