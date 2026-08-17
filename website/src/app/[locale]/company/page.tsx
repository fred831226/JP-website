import type { Metadata } from "next";
import company from "@/data/company.json";
import ContentSection, { type ContentSection as SectionShape } from "@/components/ContentSection";

export const metadata: Metadata = {
  title: "公司資訊",
  description: "傑平有限公司（JP PUMP）— 泵浦專業供應與服務公司，提供選型、估價、安裝與維修服務。",
};

export default function CompanyPage() {
  const sections = company.sections as SectionShape[];

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-10 max-md:px-[var(--page-gutter-mobile)]">
      <h1 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
        公司資訊
      </h1>
      <p className="mt-4 max-w-[var(--text-max)] leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
        {company.intro}
      </p>
      {company.foundedYear && (
        <p className="mt-4 text-sm text-[var(--color-text-muted)]">創立年份：{company.foundedYear}</p>
      )}

      <div className="mt-10 space-y-10">
        {sections.map((s) => (
          <ContentSection key={s.id} section={s} />
        ))}
      </div>
    </div>
  );
}