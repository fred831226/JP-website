import Link from "next/link";

type SeriesCardProps = {
  name: string;
  slug: string;
  description: string;
};

export default function SeriesCard({ name, slug, description }: SeriesCardProps) {
  return (
    <Link
      href={`/zh-tw/series/${slug}`}
      className="flex flex-col rounded-[var(--product-card-radius)] bg-[var(--color-surface)] p-5 shadow-[var(--product-card-shadow)] transition-shadow hover:shadow-lg focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
    >
      <span className="text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] text-[var(--color-primary)]">
        {name}
      </span>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">{description}</p>
    </Link>
  );
}
