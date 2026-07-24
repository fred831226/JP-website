import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPurposes, getPurpose, getSeriesByPurpose } from "@/lib/content/load-catalog";
import TaxonomyLanding from "@/features/catalog/TaxonomyLanding";

export function generateStaticParams() {
  return getPurposes().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const purpose = getPurpose(decodeURIComponent(slug));
  if (!purpose) return {};
  return { title: purpose.name, description: purpose.description };
}

export default async function PurposePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const purpose = getPurpose(slug);
  if (!purpose) notFound();

  return (
    <TaxonomyLanding
      title={purpose.name}
      description={purpose.description}
      seriesList={getSeriesByPurpose(purpose.id)}
      emptyMessage="此用途尚無已發布的產品系列。"
    />
  );
}
