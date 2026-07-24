import type { Metadata } from "next";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import { getCompanyPage } from "@/lib/content/load-pages";

export const metadata: Metadata = {
  title: "公司資訊",
  description: "傑平有限公司（JP PUMP）— 泵浦專業供應與服務公司。",
};

export default function CompanyPage() {
  const company = getCompanyPage();

  return (
    <PageShell padding="md">
      <SectionHeader
        title="公司資訊"
        description={company.intro}
        descriptionClassName="mt-4"
      />

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
    </PageShell>
  );
}
