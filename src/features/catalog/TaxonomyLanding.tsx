import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import SeriesCard from "@/features/catalog/SeriesCard";

type TaxonomySeries = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

type TaxonomyLandingProps = {
  title: string;
  description: string;
  seriesList: TaxonomySeries[];
  emptyMessage: string;
};

export default function TaxonomyLanding({
  title,
  description,
  seriesList,
  emptyMessage,
}: TaxonomyLandingProps) {
  return (
    <PageShell padding="sm">
      <SectionHeader title={title} description={description} />
      {seriesList.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--color-text-muted)]">{emptyMessage}</p>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {seriesList.map((s) => (
            <SeriesCard key={s.id} name={s.name} slug={s.slug} description={s.description} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
