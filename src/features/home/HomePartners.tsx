import Link from "next/link";
import RevealSection from "@/components/RevealSection";
import type { HomePage } from "@/lib/validation/pages";

type HomePartner = HomePage["partners"][number];

type HomePartnersProps = {
  partners: HomePartner[];
};

export default function HomePartners({ partners }: HomePartnersProps) {
  if (!partners.length) return null;

  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-14 max-md:px-[var(--page-gutter-mobile)]">
        <RevealSection className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-[650] text-[var(--color-action)]">合作夥伴</p>
            <h2 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
              合作品牌與夥伴
            </h2>
          </div>
          <Link
            href="/zh-tw/partners"
            className="inline-flex min-h-[44px] items-center whitespace-nowrap font-[800] text-[var(--color-action)] underline underline-offset-[5px]"
          >
            查看合作夥伴
          </Link>
        </RevealSection>
        {partners.map((p, i) => (
          <RevealSection key={p.id} delayMs={i * 120}>
            <div className="partner-row flex flex-col items-center gap-6 rounded-[var(--product-card-radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-[var(--shadow-control)] transition-all duration-300 ease-out md:flex-row md:text-left">
              <div className="flex h-[72px] w-[120px] flex-shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-2">
                {p.logo ? (
                  <img src={p.logo} alt={p.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-[11px] font-[700] tracking-[.1em] text-[var(--color-text-muted)]">
                    標誌待核准
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <strong className="text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] text-[var(--color-primary)]">
                  {p.name}
                </strong>
                <p className="mt-1 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
                  {p.description}
                </p>
                {p.website && (
                  <a
                    href={p.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex min-h-[44px] items-center text-sm font-[700] text-[var(--color-action)] underline underline-offset-[4px]"
                  >
                    拜訪網站
                  </a>
                )}
              </div>
            </div>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}
