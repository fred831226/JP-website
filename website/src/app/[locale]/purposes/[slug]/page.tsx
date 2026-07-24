import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPurposes, getPurpose, getSeriesByPurpose } from "@/lib/content/load-catalog";

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
  const seriesList = getSeriesByPurpose(purpose.id);

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-8 max-md:px-[var(--page-gutter-mobile)]">
      <h1 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
        {purpose.name}
      </h1>
      <p className="mt-2 max-w-[var(--text-max)] leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
        {purpose.description}
      </p>
      {seriesList.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--color-text-muted)]">此用途尚無已發布的產品系列。</p>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {seriesList.map((s) => (
            <Link key={s.id} href={`/zh-tw/series/${s.slug}`}
              className="flex flex-col rounded-[var(--product-card-radius)] bg-white p-5 shadow-[var(--product-card-shadow)] hover:shadow-lg focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]">
              <span className="text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] text-[var(--color-primary)]">{s.name}</span>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{s.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
