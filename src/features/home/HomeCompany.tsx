import Link from "next/link";
import RevealSection from "@/components/RevealSection";
import type { HomePage } from "@/lib/validation/pages";

type HomeCompanyProps = {
  companySummary: HomePage["companySummary"];
};

export default function HomeCompany({ companySummary }: HomeCompanyProps) {
  return (
    <section className="company-preview relative overflow-hidden bg-[var(--color-surface)]">
      <svg
        className="company-pipe absolute inset-0 h-full w-full opacity-50"
        viewBox="0 0 1440 560"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="flow-line"
          d="M-60,420 C220,340 380,500 640,430 C900,360 1080,480 1500,380"
          stroke="color-mix(in srgb, var(--color-action) 18%, transparent)"
          strokeWidth="42"
        />
        <path
          className="flow-line"
          d="M-60,420 C220,340 380,500 640,430 C900,360 1080,480 1500,380"
          stroke="color-mix(in srgb, var(--color-primary-muted) 45%, transparent)"
          strokeWidth="3"
        />
      </svg>

      <div
        className="relative mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-14 max-md:px-[var(--page-gutter-mobile)]"
        style={{ isolation: "isolate" }}
      >
        <RevealSection className="relative z-10 max-w-[var(--text-max)]">
          <p className="mb-2 text-sm font-[650] text-[var(--color-action)]">關於傑平</p>
          <h2 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
            {companySummary.heading}
          </h2>
          <p className="mt-4 leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
            {companySummary.body}
          </p>
          <Link
            href="/zh-tw/company"
            className="mt-4 inline-flex min-h-[44px] items-center font-[800] text-[var(--color-action)] underline underline-offset-[5px] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
          >
            認識 JP PUMP
          </Link>
        </RevealSection>
      </div>
    </section>
  );
}
