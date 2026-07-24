import type { Metadata } from "next";
import FaqDisclosure from "@/features/content/FaqDisclosure";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import Heading from "@/components/ui/Heading";
import ButtonLink from "@/components/ui/ButtonLink";
import { getContactPage } from "@/lib/content/load-pages";

export const metadata: Metadata = {
  title: "聯絡我們",
  description: "傑平有限公司（JP PUMP）— 電話、Email 與聯絡資訊。",
};

export default function ContactPage() {
  const { hero, info, faq } = getContactPage();
  const hasContactFields = Boolean(info.phone || info.email || info.address || info.line);

  return (
    <div className="bg-[var(--color-contact-surface)] text-[var(--color-on-primary)]">
      <PageShell padding="lg">
        <SectionHeader
          title={hero.title}
          tone="on-primary"
          description={hero.summary}
          descriptionClassName="mt-4 text-[var(--color-contact-text-muted)]"
        />

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {hasContactFields && (
            <div className="space-y-4 rounded-[var(--radius-lg)] bg-[var(--color-contact-surface-raised)] p-6 shadow-[var(--shadow-contact-block)]">
              {info.phone && (
                <div>
                  <span className="text-sm font-[650] text-[var(--color-contact-text-muted)]">電話</span>
                  <div className="mt-1">
                    <ButtonLink href={`tel:${info.phone}`} variant="contactPill">
                      {info.phone}
                    </ButtonLink>
                  </div>
                </div>
              )}
              {info.email && (
                <div>
                  <span className="text-sm font-[650] text-[var(--color-contact-text-muted)]">Email</span>
                  <div className="mt-1">
                    <ButtonLink href={`mailto:${info.email}`} variant="contactPill">
                      {info.email}
                    </ButtonLink>
                  </div>
                </div>
              )}
              {info.address && (
                <div>
                  <span className="text-sm font-[650] text-[var(--color-contact-text-muted)]">地址</span>
                  <p className="mt-1 text-sm leading-[var(--font-body-line-height)] text-[var(--color-on-primary)]">
                    {info.address}
                  </p>
                </div>
              )}
              {info.line && (
                <div>
                  <span className="text-sm font-[650] text-[var(--color-contact-text-muted)]">LINE</span>
                  <p className="mt-1 text-sm leading-[var(--font-body-line-height)] text-[var(--color-on-primary)]">
                    {info.line}
                  </p>
                </div>
              )}
            </div>
          )}

          {faq.length > 0 && (
            <div>
              <Heading as="h2" size="sm" tone="on-primary">
                常見問題
              </Heading>
              <div className="mt-4">
                <FaqDisclosure items={faq} />
              </div>
            </div>
          )}
        </div>
      </PageShell>
    </div>
  );
}
