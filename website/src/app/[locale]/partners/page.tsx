import partners from "@/data/partners.json";
import Image from "next/image";
import ContentSection, { type ContentSection as SectionShape } from "@/components/ContentSection";
import PageBanner from "@/components/PageBanner";
import { createPageMetadata } from "@/lib/seo";
import { englishContent } from "@/lib/content/en";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return locale === "en"
    ? createPageMetadata({ title: englishContent.partners.title, description: englishContent.partners.intro, pathname: "/en/partners", locale: "en", alternatePathname: "/zh-tw/partners" })
    : createPageMetadata({ title: "授權經銷品牌", description: "JP PUMP 傑平有限公司的授權經銷品牌。", pathname: "/zh-tw/partners", alternatePathname: "/en/partners" });
}

type Partner = {
  id: string;
  name: string;
  logo?: string;
  summary: string;
  website?: string;
  sections: SectionShape[];
};

export default async function PartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const en = (await params).locale === "en";
  const list = partners as Partner[];

  return (
    <>
      <PageBanner title={en ? englishContent.partners.title : "授權經銷品牌"} summary={en ? englishContent.partners.intro : "認識 JP PUMP 的授權經銷品牌。"} />
      <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-10 max-md:px-[var(--page-gutter-mobile)]">

      {list.length === 0 ? (
        <p className="mt-4 leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
          {en ? "No approved partner information is available yet." : "尚無已核准的授權經銷品牌資訊。"}
        </p>
      ) : (
        <div className="mt-6 space-y-8">
          {list.map((p) => (
            <article
              key={p.id}
              className="rounded-[var(--product-card-radius)] bg-white p-6 shadow-[var(--product-card-shadow)] md:p-8"
            >
              <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
                {p.logo && (
                  <Image src={p.logo} alt={en ? "Grundfos authorized dealer logo" : `${p.name} 授權經銷標誌`} width={640} height={360} className="h-auto w-full max-w-[320px] shrink-0 object-contain md:w-72" />
                )}
                <div className="flex flex-col items-center gap-2 md:items-start">
                  <h2 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
                    {en ? "Grundfos" : p.name}
                  </h2>
                  <p className="text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
                    {en ? englishContent.partners.grundfosSummary : p.summary}
                  </p>
                  {p.website && (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex min-h-[44px] items-center rounded-[var(--button-primary-radius)] bg-[var(--button-primary-bg)] px-4 text-sm font-[650] text-[var(--button-primary-fg)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2 hover:brightness-110"
                    >
                      {en ? englishContent.partners.websiteAction : "拜訪網站"}
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-8 space-y-10">
                {p.sections.map((s) => (
                  <ContentSection key={s.id} section={en && s.type === "paragraphs" ? { ...s, heading: englishContent.view.partnerSectionHeading, paragraphs: englishContent.view.partnerParagraphs } : s} />
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
