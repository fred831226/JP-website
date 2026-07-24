import Link from "next/link";
import type { SitePage } from "@/lib/validation/pages";

interface FooterProps {
  site: SitePage;
}

export default function Footer({ site }: FooterProps) {
  const { products, services, contact } = site.nav;
  const contactInfo = site.contactInfo;

  return (
    <footer className="bg-[var(--footer-bg)] text-[var(--footer-fg)]">
      <div className="mx-auto flex max-w-[var(--content-max)] flex-col gap-8 px-[var(--page-gutter-desktop)] py-10 max-md:px-[var(--page-gutter-mobile)] max-md:gap-6 md:flex-row md:justify-between">
        <div className="flex flex-col gap-2">
          <img src="/media/jp-pump-logo.png" alt="JP PUMP" className="h-14 w-auto brightness-0 invert" />
        </div>

        <nav
          className="flex flex-col gap-3"
          role="navigation"
          aria-label="頁尾導覽"
        >
          <Link
            href="/zh-tw"
            className="flex min-h-[44px] items-center text-sm text-[var(--color-contact-text-muted)] hover:text-[var(--color-on-primary)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
          >
            首頁
          </Link>
          <Link
            href={products.href}
            className="flex min-h-[44px] items-center text-sm text-[var(--color-contact-text-muted)] hover:text-[var(--color-on-primary)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
          >
            {products.label}
          </Link>
          <Link
            href={services.href}
            className="flex min-h-[44px] items-center text-sm text-[var(--color-contact-text-muted)] hover:text-[var(--color-on-primary)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
          >
            {services.label}
          </Link>
          <Link
            href="/zh-tw/company"
            className="flex min-h-[44px] items-center text-sm text-[var(--color-contact-text-muted)] hover:text-[var(--color-on-primary)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
          >
            公司資訊
          </Link>
          <Link
            href="/zh-tw/partners"
            className="flex min-h-[44px] items-center text-sm text-[var(--color-contact-text-muted)] hover:text-[var(--color-on-primary)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
          >
            合作夥伴
          </Link>
          <Link
            href={contact.href}
            className="flex min-h-[44px] items-center text-sm text-[var(--color-contact-text-muted)] hover:text-[var(--color-on-primary)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
          >
            {contact.label}
          </Link>
        </nav>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-[650]">聯絡資訊</span>
          {contactInfo.phone && (
            <a
              href={`tel:${contactInfo.phone}`}
              className="flex min-h-[44px] items-center text-sm text-[var(--color-contact-text-muted)] hover:text-[var(--color-on-primary)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
            >
              {contactInfo.phone}
            </a>
          )}
          {contactInfo.email && (
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex min-h-[44px] items-center text-sm text-[var(--color-contact-text-muted)] hover:text-[var(--color-on-primary)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
            >
              {contactInfo.email}
            </a>
          )}
          {contactInfo.address && (
            <span className="flex min-h-[44px] items-center text-sm text-[var(--color-contact-text-muted)]">
              {contactInfo.address}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
