import type { Metadata } from "next";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import EmptyState from "@/components/ui/EmptyState";
import ButtonLink from "@/components/ui/ButtonLink";
import Heading from "@/components/ui/Heading";
import { getServicesPage } from "@/lib/content/load-pages";

export const metadata: Metadata = {
  title: "服務與實績",
  description: "傑平有限公司的泵浦技術服務與經核准的真實建案實績。",
};

export default function ServicesPage() {
  const services = getServicesPage();
  const projects = services.projects;

  return (
    <>
      <section className="bg-[var(--color-primary)]">
        <PageShell padding="lg" className="text-[var(--color-on-primary)]">
          <SectionHeader
            title={services.hero.title}
            tone="on-primary"
            description={services.hero.summary}
            descriptionClassName="mt-6 text-[var(--color-on-primary)]/80"
          />
          <div className="mt-6 flex flex-wrap gap-3">
            {services.hero.capabilities.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center rounded-[var(--radius-xs)] bg-[var(--color-on-primary)]/15 px-3 py-1 text-sm font-[650] text-[var(--color-on-primary)]"
              >
                {c.label}
              </span>
            ))}
          </div>
        </PageShell>
      </section>

      <PageShell as="section" padding="md">
        {projects.length === 0 ? (
          <EmptyState
            title="尚無公開的建案實績資料。"
            action={<ButtonLink href="/zh-tw/contact">聯絡我們</ButtonLink>}
          />
        ) : (
          <div className="space-y-10">
            {projects.map((p) => (
              <article
                key={p.id}
                className="flex flex-col gap-6 rounded-[var(--product-card-radius)] bg-[var(--color-surface)] p-6 shadow-[var(--product-card-shadow)] md:flex-row"
              >
                <div className="flex-1">
                  <span className="text-sm font-[650] text-[var(--color-primary-muted)]">
                    {p.type}
                  </span>
                  <Heading as="h2" size="sm" className="mt-1">
                    {p.title}
                  </Heading>
                  <p className="mt-3 leading-[var(--font-body-line-height)] text-[var(--color-text)]">
                    {p.context}
                  </p>
                  {p.scope && (
                    <p className="mt-2 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
                      <span className="font-[650]">工作範圍：</span>
                      {p.scope}
                    </p>
                  )}
                  {p.outcome && (
                    <p className="mt-1 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
                      <span className="font-[650]">成果：</span>
                      {p.outcome}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </PageShell>
    </>
  );
}
