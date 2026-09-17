import Link from "next/link";
import services from "@/data/services.json";
import PageBanner from "@/components/PageBanner";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "服務與實績",
  description: "傑平有限公司的泵浦技術服務與經核准的真實建案實績。",
  pathname: "/zh-tw/services",
});

interface Project {
  id: string;
  title: string;
  type: string;
  context: string;
  scope?: string;
  outcome?: string;
  relatedProducts?: string[];
  image?: string;
}

export default function ServicesPage() {
  const projects = services.projects as Project[];
  const stats = services.stats;

  return (
    <>
      <PageBanner title={services.hero.title} summary={services.hero.summary}>
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
      </PageBanner>

      {/* Track record */}
      {stats && (
        <section data-services-section="stats" className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] pt-10 max-md:px-[var(--page-gutter-mobile)]">
          <div className="overflow-hidden rounded-[8px] bg-[var(--color-primary)] px-6 py-8 shadow-[0_16px_36px_rgba(11,42,61,.18)] max-md:px-5">
            <p className="text-xs font-[800] tracking-[0.12em] text-[#d8c18d]">TRACK RECORD</p>
            <h2 className="mt-2 text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] text-[var(--color-on-primary)]">完成實績</h2>
            <dl className="mt-6 grid gap-px overflow-hidden rounded-[6px] bg-white/20 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-[var(--color-primary)] px-5 py-6 text-center">
                  <dt className="mt-2 text-sm text-[var(--color-contact-text-muted)]">{stat.label}</dt>
                  <dd className="order-first text-3xl font-[800] tracking-[-.02em] text-[var(--color-on-primary)]">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Projects */}
      <section className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-10 max-md:px-[var(--page-gutter-mobile)]">
        {projects.length === 0 ? (
          <div className="rounded-[var(--product-card-radius)] bg-white p-8 shadow-[var(--product-card-shadow)]">
            <p className="leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
              尚無公開的建案實績資料。
            </p>
            <Link
              href="/zh-tw/contact"
              className="mt-4 inline-flex min-h-[44px] items-center rounded-[var(--button-primary-radius)] bg-[var(--button-primary-bg)] px-4 text-sm font-[650] text-[var(--button-primary-fg)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2 hover:brightness-110"
            >
              聯絡我們
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {projects.map((p) => (
              <article
                key={p.id}
                className="flex flex-col gap-6 rounded-[var(--product-card-radius)] bg-white p-6 shadow-[var(--product-card-shadow)] md:flex-row"
              >
                <div className="flex-1">
                  <span className="text-sm font-[650] text-[var(--color-primary-muted)]">
                    {p.type}
                  </span>
                  <h2 className="mt-1 text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] text-[var(--color-primary)]">
                    {p.title}
                  </h2>
                  <p className="mt-3 leading-[var(--font-body-line-height)] text-[var(--color-text)]">
                    {p.context}
                  </p>
                  {p.scope && (
                    <p className="mt-2 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
                      <span className="font-[650]">工作範圍：</span>{p.scope}
                    </p>
                  )}
                  {p.outcome && (
                    <p className="mt-1 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
                      <span className="font-[650]">成果：</span>{p.outcome}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
