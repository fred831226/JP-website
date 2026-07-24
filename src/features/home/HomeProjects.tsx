import Link from "next/link";
import RevealSection from "@/components/RevealSection";
import type { HomePage } from "@/lib/validation/pages";

type HomeProject = HomePage["projects"][number];

type HomeProjectsProps = {
  projects: HomeProject[];
};

export default function HomeProjects({ projects }: HomeProjectsProps) {
  const approved = projects.filter((p) => p.image && !p.title.includes("待核准"));
  if (approved.length === 0) return null;

  return (
    <section className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-14 max-md:px-[var(--page-gutter-mobile)]">
      <RevealSection className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-[650] text-[var(--color-action)]">精選實績</p>
          <h2 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
            精選建案實績
          </h2>
        </div>
        <Link
          href="/zh-tw/services"
          className="inline-flex min-h-[44px] items-center whitespace-nowrap font-[800] text-[var(--color-action)] underline underline-offset-[5px]"
        >
          瀏覽全部服務與實績
        </Link>
      </RevealSection>
      <div className="space-y-8">
        {approved.map((p, i) => (
          <RevealSection key={p.id} delayMs={i * 100}>
            <article className="grid gap-6 border-b border-[var(--color-border)] pb-8 md:grid-cols-2 md:items-center">
              <div className="aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)]">
                <img src={p.image} alt="" className="h-full w-full object-cover" />
              </div>
              <div>
                <span className="text-sm font-[650] text-[var(--color-primary-muted)]">{p.type}</span>
                <h3 className="mt-1 text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] text-[var(--color-primary)]">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
                  {p.description}
                </p>
                <Link
                  href="/zh-tw/services"
                  className="mt-4 inline-flex min-h-[44px] items-center font-[700] text-[var(--color-action)] underline underline-offset-[4px]"
                >
                  在服務與實績頁查看
                </Link>
              </div>
            </article>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}
