import type { Metadata } from "next";
import partners from "@/data/partners.json";

export const metadata: Metadata = {
  title: "合作夥伴",
  description: "傑平有限公司的合作品牌與夥伴關係。",
};

export default function PartnersPage() {
  return (
    <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-10 max-md:px-[var(--page-gutter-mobile)]">
      <h1 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
        合作夥伴
      </h1>

      {partners.length === 0 ? (
        <p className="mt-4 leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
          尚無已核准的合作夥伴資訊。
        </p>
      ) : (
        <div className="mt-6 space-y-8">
          {partners.map((p: { id: string; name: string; logo?: string; description: string; url?: string }) => (
            <div
              key={p.id}
              className="flex flex-col items-center gap-4 rounded-[var(--product-card-radius)] bg-white p-6 shadow-[var(--product-card-shadow)] md:flex-row md:items-start"
            >
              {p.logo && (
                <img src={p.logo} alt={`${p.name} 標誌`} className="h-16 w-16 object-contain" />
              )}
              <div className="flex flex-col items-center gap-3 md:items-start">
                <h2 className="text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] text-[var(--color-primary)]">
                  {p.name}
                </h2>
                <p className="text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
                  {p.description}
                </p>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center rounded-[var(--button-primary-radius)] bg-[var(--button-primary-bg)] px-4 text-sm font-[650] text-[var(--button-primary-fg)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2 hover:brightness-110"
                  >
                    拜訪網站
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
