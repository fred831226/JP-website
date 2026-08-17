import type { Metadata } from "next";
import partners from "@/data/partners.json";
import ContentSection, { type ContentSection as SectionShape } from "@/components/ContentSection";

export const metadata: Metadata = {
  title: "合作夥伴",
  description: "傑平有限公司的合作品牌與夥伴關係。",
};

type Partner = {
  id: string;
  name: string;
  logo?: string;
  summary: string;
  website?: string;
  sections: SectionShape[];
};

export default function PartnersPage() {
  const list = partners as Partner[];

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-10 max-md:px-[var(--page-gutter-mobile)]">
      <h1 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
        合作夥伴
      </h1>

      {list.length === 0 ? (
        <p className="mt-4 leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
          尚無已核准的合作夥伴資訊。
        </p>
      ) : (
        <div className="mt-6 space-y-8">
          {list.map((p) => (
            <article
              key={p.id}
              className="rounded-[var(--product-card-radius)] bg-white p-6 shadow-[var(--product-card-shadow)] md:p-8"
            >
              <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
                {p.logo && (
                  <img src={p.logo} alt={`${p.name} 標誌`} className="h-16 w-16 shrink-0 object-contain" />
                )}
                <div className="flex flex-col items-center gap-2 md:items-start">
                  <h2 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
                    {p.name}
                  </h2>
                  <p className="text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
                    {p.summary}
                  </p>
                  {p.website && (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex min-h-[44px] items-center rounded-[var(--button-primary-radius)] bg-[var(--button-primary-bg)] px-4 text-sm font-[650] text-[var(--button-primary-fg)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2 hover:brightness-110"
                    >
                      拜訪網站
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-8 space-y-10">
                {p.sections.map((s) => (
                  <ContentSection key={s.id} section={s} />
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}