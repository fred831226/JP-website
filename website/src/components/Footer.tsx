import Link from "next/link";
import Image from "next/image";
import navData from "@/data/site.json";

interface NavItem {
  label: string;
  href: string;
}

interface NavAbout {
  label: string;
  children: NavItem[];
}

interface FooterData {
  displayName: string;
  tagline: string;
  headOfficeTitle: string;
}

const nav = navData.nav as Record<string, NavItem | NavAbout>;
const contact = navData.contactInfo as { phone: string; email: string; emails?: string[]; address: string };
const footer = navData.footer as FooterData;
const about = nav.about as NavAbout;
const contactEmails = contact.emails?.length ? contact.emails : [contact.email];

const footerNavigation: NavItem[] = [
  { label: "首頁", href: "/zh-tw" },
  nav.products as NavItem,
  nav.services as NavItem,
  ...about.children,
  nav.contact as NavItem,
];

export default function Footer() {
  return (
    <footer className="bg-[var(--footer-bg)] text-[var(--footer-fg)]">
      <div className="mx-auto grid max-w-[var(--content-max)] gap-8 px-[var(--page-gutter-desktop)] py-9 max-md:px-[var(--page-gutter-mobile)] md:grid-cols-[1.2fr_3.35fr] md:gap-12">
        <section aria-label="品牌資訊" className="flex flex-col items-start">
          <Image src="/media/jp-pump-logo-edited.png" alt="JP PUMP" width={360} height={144} className="h-24 w-auto object-contain object-left" />
          <p className="mt-4 text-xl font-[750] tracking-[0.02em] text-[var(--color-on-primary)]">{footer.displayName}</p>
          <p className="mt-1 text-sm tracking-[0.12em] text-[var(--color-contact-text-muted)]">{footer.tagline}</p>
        </section>

        <div>
          <nav aria-label="頁尾導覽" className="flex min-h-[52px] flex-wrap items-start gap-x-8 gap-y-1 border-b border-white/20 pb-3 max-md:gap-x-5">
            {footerNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-[44px] items-center text-sm font-[650] text-[var(--color-contact-text-muted)] transition-colors hover:text-[var(--color-on-primary)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="pt-6">
            <section aria-labelledby="footer-office-title">
              <h2 id="footer-office-title" className="text-sm font-[750] text-[var(--color-on-primary)]">{footer.headOfficeTitle}</h2>
              <address className="mt-4 flex not-italic flex-col gap-2 text-sm leading-6 text-[var(--color-contact-text-muted)]">
                <a href={`tel:${contact.phone}`} className="transition-colors hover:text-[var(--color-on-primary)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2">電話：{contact.phone}</a>
                {contactEmails.map((email) => (
                  <a key={email} href={`mailto:${email}`} className="transition-colors hover:text-[var(--color-on-primary)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2">信箱：{email}</a>
                ))}
                <span>地址：{contact.address}</span>
              </address>
            </section>

          </div>
        </div>
      </div>
    </footer>
  );
}
