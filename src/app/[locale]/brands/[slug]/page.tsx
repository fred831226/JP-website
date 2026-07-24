import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrands, getBrand, getSeriesByBrand } from "@/lib/content/load-catalog";
import TaxonomyLanding from "@/features/catalog/TaxonomyLanding";

export function generateStaticParams() {
  return getBrands().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(decodeURIComponent(slug));
  if (!brand) return {};
  return { title: brand.name, description: brand.description };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  return (
    <TaxonomyLanding
      title={brand.name}
      description={brand.description}
      seriesList={getSeriesByBrand(brand.id)}
      emptyMessage="此品牌尚無已發布的產品系列。"
    />
  );
}
