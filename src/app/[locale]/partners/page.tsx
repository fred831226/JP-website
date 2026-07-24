import type { Metadata } from "next";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import EmptyState from "@/components/ui/EmptyState";
import ButtonLink from "@/components/ui/ButtonLink";
import Heading from "@/components/ui/Heading";
import { getPartnersPage } from "@/lib/content/load-pages";

export const metadata: Metadata = {
  title: "合作夥伴",
  description: "傑平有限公司的合作品牌與夥伴關係。",
};

export default function PartnersPage() {
  const partners = getPartnersPage();

  return (
    <PageShell padding="md">
      <SectionHeader title="合作夥伴" />

      {partners.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="尚無已核准的合作夥伴資訊。"
            description="經核准的夥伴關係將於此公開。"
          />
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {partners.map((p) => (
            <div
              key={p.id}
              className="flex flex-col items-center gap-4 rounded-[var(--product-card-radius)] bg-[var(--color-surface)] p-6 shadow-[var(--product-card-shadow)] md:flex-row md:items-start"
            >
              {p.logo && (
                <img src={p.logo} alt={`${p.name} 標誌`} className="h-16 w-16 object-contain" />
              )}
              <div className="flex flex-col items-center gap-3 md:items-start">
                <Heading as="h2" size="sm">
                  {p.name}
                </Heading>
                <p className="text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
                  {p.description}
                </p>
                {p.url && (
                  <ButtonLink href={p.url} external>
                    拜訪網站
                  </ButtonLink>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
