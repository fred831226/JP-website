import type { Metadata } from "next";
import contact from "@/data/contact.json";
import FaqDisclosure from "@/components/FaqDisclosure";

export const metadata: Metadata = {
  title: "聯絡我們",
  description: "傑平有限公司（JP PUMP）— 電話、Email 與聯絡資訊。",
};

export default function ContactPage() {
  const { hero, info, faq } = contact;

  return (
    <div className="bg-[var(--color-contact-surface)] text-[var(--color-on-primary)]">
      <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-14 max-md:px-[var(--page-gutter-mobile)]">
        {/* Hero */}
        <h1 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)]">
          {hero.title}
        </h1>
        <p className="mt-4 max-w-[var(--text-max)] leading-[var(--font-body-line-height)] text-[var(--color-contact-text-muted)]">
          {hero.summary}
        </p>

        {/* Contact Info + FAQ */}
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-4">
            {info.phone && (
              <div>
                <span className="text-sm font-[650] text-[var(--color-contact-text-muted)]">電話</span>
                <a
                  href={`tel:${info.phone}`}
                  className="mt-1 flex min-h-[44px] items-center rounded-[var(--radius-md)] bg-[var(--color-contact-surface-raised)] px-4 text-sm text-[var(--color-on-primary)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2 hover:brightness-110"
                >
                  {info.phone}
                </a>
              </div>
            )}
            {info.email && (
              <div>
                <span className="text-sm font-[650] text-[var(--color-contact-text-muted)]">Email</span>
                <a
                  href={`mailto:${info.email}`}
                  className="mt-1 flex min-h-[44px] items-center rounded-[var(--radius-md)] bg-[var(--color-contact-surface-raised)] px-4 text-sm text-[var(--color-on-primary)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2 hover:brightness-110"
                >
                  {info.email}
                </a>
              </div>
            )}
            {info.address && (
              <div>
                <span className="text-sm font-[650] text-[var(--color-contact-text-muted)]">地址</span>
                <p className="mt-1 flex min-h-[44px] items-center rounded-[var(--radius-md)] bg-[var(--color-contact-surface-raised)] px-4 text-sm">
                  {info.address}
                </p>
              </div>
            )}
            {info.line && (
              <div>
                <span className="text-sm font-[650] text-[var(--color-contact-text-muted)]">LINE</span>
                <p className="mt-1 flex min-h-[44px] items-center rounded-[var(--radius-md)] bg-[var(--color-contact-surface-raised)] px-4 text-sm">
                  {info.line}
                </p>
              </div>
            )}
          </div>

          {/* FAQ */}
          {faq.length > 0 && (
            <div>
              <h2 className="text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] text-[var(--color-on-primary)]">
                常見問題
              </h2>
              <div className="mt-4">
                <FaqDisclosure items={faq} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
