import contact from "@/data/contact.json";
import Image from "next/image";
import FaqDisclosure from "@/components/FaqDisclosure";
import PageBanner from "@/components/PageBanner";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "聯絡我們",
  description: "傑平有限公司（JP PUMP）— 電話、Email 與聯絡資訊。",
  pathname: "/zh-tw/contact",
});

export default function ContactPage() {
  const { hero, info, faq } = contact;
  const emails = info.emails?.length ? info.emails : [info.email].filter(Boolean);
  const mapQuery = encodeURIComponent(info.address);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  return (
    <>
      <PageBanner title={hero.title} summary={hero.summary} />
      <div className="bg-[var(--color-contact-surface)] text-[var(--color-on-primary)]">
      <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-14 max-md:px-[var(--page-gutter-mobile)]">
        <div className="grid gap-12 md:grid-cols-[1.15fr_0.85fr] md:items-start md:gap-16">
          <section aria-labelledby="contact-brand-title" className="space-y-8">
            <div>
              <Image
                src="/media/jp-pump-logo-edited.png"
                alt="JP PUMP"
                width={360}
                height={144}
                className="h-20 w-auto object-contain object-left"
              />
              <h2 id="contact-brand-title" className="mt-5 text-2xl font-[750] text-[var(--color-on-primary)]">
                傑平有限公司
              </h2>
              <p className="mt-2 text-sm tracking-[0.12em] text-[var(--color-contact-text-muted)]">
                JP Pump Solution
              </p>
            </div>

            {info.address && (
              <div className="overflow-hidden rounded-[var(--radius-md)] border border-white/15 bg-[var(--color-contact-surface-raised)]">
                <iframe
                  title="傑平有限公司位置地圖"
                  src={mapEmbedUrl}
                  className="h-[320px] w-full border-0 max-md:h-[260px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="flex items-center justify-between gap-4 px-4 py-3 max-md:flex-col max-md:items-start">
                  <p className="text-sm leading-6 text-[var(--color-contact-text-muted)]">{info.address}</p>
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] shrink-0 items-center rounded-[var(--button-primary-radius)] bg-[var(--button-primary-bg)] px-4 text-sm font-[650] text-[var(--button-primary-fg)] transition-[filter] hover:brightness-110 focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
                  >
                    在 Google 地圖開啟
                  </a>
                </div>
              </div>
            )}
          </section>

          <section aria-labelledby="contact-info-title">
            <h2 id="contact-info-title" className="text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] text-[var(--color-on-primary)]">
              聯絡資訊
            </h2>
            <div className="mt-5 space-y-4">
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
            {emails.length > 0 && (
              <div>
                <span className="text-sm font-[650] text-[var(--color-contact-text-muted)]">Email</span>
                <div className="mt-1 space-y-2">
                  {emails.map((email) => (
                    <a
                      key={email}
                      href={`mailto:${email}`}
                      className="flex min-h-[44px] items-center rounded-[var(--radius-md)] bg-[var(--color-contact-surface-raised)] px-4 text-sm text-[var(--color-on-primary)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2 hover:brightness-110"
                    >
                      {email}
                    </a>
                  ))}
                </div>
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
          </section>

          {/* FAQ */}
          {faq.length > 0 && (
            <section className="md:col-start-2">
              <h2 className="text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] text-[var(--color-on-primary)]">
                常見問題
              </h2>
              <div className="mt-4">
                <FaqDisclosure items={faq} />
              </div>
            </section>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
