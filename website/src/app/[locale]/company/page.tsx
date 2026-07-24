import type { Metadata } from "next";
import company from "@/data/company.json";

export const metadata: Metadata = {
  title: "公司資訊",
  description: "傑平有限公司（JP PUMP）— 泵浦專業供應與服務公司。",
};

export default function CompanyPage() {
  return (
    <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-10 max-md:px-[var(--page-gutter-mobile)]">
      <h1 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
        公司資訊
      </h1>
      <p className="mt-4 max-w-[var(--text-max)] leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
        {company.intro}
      </p>

      {company.foundedYear && (
        <p className="mt-4 text-sm text-[var(--color-text-muted)]">
          創立年份：{company.foundedYear}
        </p>
      )}

      {company.facts.length > 0 && (
        <ul className="mt-6 space-y-3">
          {company.facts.map((fact, i) => (
            <li key={i} className="leading-[var(--font-body-line-height)] text-[var(--color-text)]">
              {fact}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
