import Link from "next/link";
import navData from "@/data/site.json";

interface NavItem {
  label: string;
  href: string;
}

interface NavAbout {
  label: string;
  children: { id: string; label: string; href: string }[];
}

type NavSection = NavItem | NavAbout;

const nav = navData.nav as Record<string, NavSection>;
const contact = navData.contactInfo as { phone: string; email: string; address: string };

export default function Footer() {
  return (
    <footer className="bg-[var(--footer-bg)] text-[var(--footer-fg)]">
      <div className="mx-auto flex max-w-[var(--content-max)] flex-col gap-8 px-[var(--page-gutter-desktop)] py-10 max-md:px-[var(--page-gutter-mobile)] max-md:gap-6 md:flex-row md:justify-between">
        {/* Company identity */}
        <div className="flex flex-col gap-2">
          <img src="/media/jp-pump-logo.png" alt="JP PUMP" className="h-14 w-auto brightness-0 invert" />
        </div>

        {/* Navigation */}
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
            href={(nav.products as NavItem).href}
            className="flex min-h-[44px] items-center text-sm text-[var(--color-contact-text-muted)] hover:text-[var(--color-on-primary)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
          >
            {(nav.products as NavItem).label}
          </Link>
          <Link
            href={(nav.services as NavItem).href}
            className="flex min-h-[44px] items-center text-sm text-[var(--color-contact-text-muted)] hover:text-[var(--color-on-primary)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
          >
            {(nav.services as NavItem).label}
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
            href={(nav.contact as NavItem).href}
            className="flex min-h-[44px] items-center text-sm text-[var(--color-contact-text-muted)] hover:text-[var(--color-on-primary)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
          >
            {(nav.contact as NavItem).label}
          </Link>
        </nav>

        {/* Contact */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-[650]">聯絡資訊</span>
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="flex min-h-[44px] items-center text-sm text-[var(--color-contact-text-muted)] hover:text-[var(--color-on-primary)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
            >
              {contact.phone}
            </a>
          )}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="flex min-h-[44px] items-center text-sm text-[var(--color-contact-text-muted)] hover:text-[var(--color-on-primary)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
            >
              {contact.email}
            </a>
          )}
          {contact.address && (
            <span className="flex min-h-[44px] items-center text-sm text-[var(--color-contact-text-muted)]">
              {contact.address}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
