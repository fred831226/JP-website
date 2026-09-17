import homeData from "@/data/home.json";
import Image from "next/image";

interface PageBannerProps {
  title?: string;
  summary?: string;
  eyebrow?: string;
  children?: React.ReactNode;
}

export default function PageBanner({ title, summary, eyebrow, children }: PageBannerProps) {
  const heroImage = homeData.hero.images[0];

  return (
    <section className="relative flex h-[320px] items-center overflow-hidden px-[var(--page-gutter-desktop)] py-10 max-md:min-h-[320px] max-md:h-auto max-md:px-[var(--page-gutter-mobile)] max-md:py-8">
      <div className="absolute inset-0" aria-hidden="true">
        <Image src={heroImage} alt="" fill sizes="100vw" loading="eager" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/95 via-[var(--color-primary)]/84 to-[var(--color-primary)]/58" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-[var(--content-max)]">
        {eyebrow && <p className="page-banner-reveal page-banner-reveal--eyebrow mb-3 text-xs font-[800] tracking-[0.14em] text-[var(--color-identity-detail)]">{eyebrow}</p>}
        {title && <h1 className="page-banner-reveal page-banner-reveal--title text-[clamp(2.5rem,5vw,4.5rem)] font-[var(--font-heading-lg-weight)] leading-[1.08] text-white">
          {title}
        </h1>}
        {summary && <p className={`page-banner-reveal page-banner-reveal--summary ${title ? "mt-4 " : ""} max-w-[var(--text-max)] leading-[var(--font-body-line-height)] text-[var(--color-on-primary)]/85`}>{summary}</p>}
        {children && <div className="page-banner-reveal page-banner-reveal--children">{children}</div>}
      </div>
    </section>
  );
}
