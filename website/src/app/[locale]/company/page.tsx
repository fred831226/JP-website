import Link from "next/link";
import Image from "next/image";
import company from "@/data/company.json";
import homeData from "@/data/home.json";
import { type ContentSection as SectionShape } from "@/components/ContentSection";
import PageBanner from "@/components/PageBanner";
import RevealSection from "@/components/RevealSection";
import ProjectGalleryDescription from "@/components/ProjectGalleryDescription";
import { createPageMetadata } from "@/lib/seo";
import { englishContent } from "@/lib/content/en";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return locale === "en"
    ? createPageMetadata({ title: englishContent.company.title, description: englishContent.company.intro, pathname: "/en/company", locale: "en", alternatePathname: "/zh-tw/company" })
    : createPageMetadata({ title: "公司資訊", description: "傑平有限公司（JP PUMP）— 泵浦專業供應與服務公司，提供選型、估價、安裝與維修服務。", pathname: "/zh-tw/company", alternatePathname: "/en/company" });
}

export default async function CompanyPage({ params }: { params: Promise<{ locale: string }> }) {
  const en = (await params).locale === "en";
  const sections = company.sections as SectionShape[];
  const services = sections.find((section) => section.id === "services");
  const milestones = sections.find((section) => section.id === "milestones");
  const contact = sections.find((section) => section.id === "contact");
  const { projectGallery } = homeData;

  return (
    <>
      <PageBanner title={en ? englishContent.company.title : "關於傑平"} />
      <div className="relative z-10 mx-auto max-w-[var(--content-max)] space-y-14 px-[var(--page-gutter-desktop)] pb-12 pt-0 max-md:space-y-10 max-md:px-[var(--page-gutter-mobile)] max-md:pb-9">
        <section className="-mt-20 flex flex-col items-center text-center max-md:-mt-14">
          <div className="company-brand-sign w-full max-w-[440px] overflow-hidden rounded-[8px] bg-[var(--color-primary)] p-2 shadow-[0_18px_40px_rgba(11,42,61,.20)]">
            <Image src="/media/company-brand-sign.png" alt={en ? "JP PUMP company sign" : "傑平有限公司 JP PUMP 招牌"} width={880} height={660} className="aspect-[4/3] w-full object-cover" />
          </div>
          <div className="mt-8 max-w-[760px]">
            {company.foundedYear && <p className="text-xs font-[800] tracking-[0.12em] text-[var(--color-action)]">EST. {company.foundedYear}</p>}
            {services?.type === "paragraphs" && (
              <div className="mt-5 space-y-4">
                {(en ? [englishContent.view.companyServicesParagraph] : services.paragraphs).map((paragraph) => <p key={paragraph} className="leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">{paragraph}</p>)}
              </div>
            )}
            <p className="mt-4 leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">{en ? englishContent.company.intro : company.intro}</p>
          </div>
        </section>

        {milestones?.type === "milestones" && (
          <section>
            <p className="text-xs font-[800] tracking-[0.12em] text-[var(--color-action)]">SELECTED PROJECTS</p>
            <h2 className="mt-2 text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] text-[var(--color-primary)]">{en ? englishContent.view.milestonesHeading : milestones.heading}</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(en ? englishContent.view.milestones : milestones.milestones).map((milestone, index) => (
                <li key={milestone} className="flex min-h-[76px] items-center gap-4 border-l-[3px] border-[var(--color-action)] bg-[var(--color-surface)] px-4 shadow-[0_8px_20px_rgba(11,42,61,.07)]">
                  <span className="text-sm font-[800] tabular-nums text-[var(--color-primary-muted)]">{String(index + 1).padStart(2, "0")}</span>
                  <span className="font-[650] text-[var(--color-primary)]">{milestone}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {projectGallery && (
          <section className="project-gallery-section overflow-hidden rounded-[var(--radius-lg)] p-6 max-md:p-5">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
              <div className="max-w-[680px]">
                <RevealSection>
                  <p className="mb-2 text-xs font-[800] tracking-[0.08em] text-[var(--color-action)]">PROJECT GALLERY</p>
                  <h2 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
                    {en ? englishContent.view.projectGalleryHeading : projectGallery.heading}
                  </h2>
                </RevealSection>
                <ProjectGalleryDescription paragraphs={(en ? englishContent.view.projectGalleryDescription : projectGallery.description).slice(0, 2)} />
              </div>
              <RevealSection delayMs={160}>
                <Link
                  href={en ? "/en/contact" : "/zh-tw/services"}
                  className="inline-flex min-h-[44px] items-center font-[800] text-[var(--color-action)] underline underline-offset-[5px] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
                >
                  {en ? englishContent.view.galleryAction : "查看服務與實績"}
                </Link>
              </RevealSection>
            </div>
            <div className="project-gallery-grid" aria-label={en ? "Project photo gallery" : "工程實績照片牆"}>
              {projectGallery.photos.map((photo, index) => (
                <RevealSection key={photo.src} delayMs={index * 85} className="project-gallery-reveal">
                  <figure className="project-gallery-tile">
                    <Image src={photo.src} alt={en ? englishContent.view.photoAlts[index] : photo.alt} width={1200} height={800} loading="lazy" />
                  </figure>
                </RevealSection>
              ))}
            </div>
            <ProjectGalleryDescription paragraphs={(en ? englishContent.view.projectGalleryDescription : projectGallery.description).slice(2)} belowGallery />
          </section>
        )}

        {contact?.type === "contact" && (
          <RevealSection delayMs={80}>
            <section data-company-section="contact" className="company-contact relative overflow-hidden rounded-[12px] bg-white p-6 shadow-[0_18px_44px_rgba(11,42,61,.10)] max-md:p-5">
              <div className="company-contact-glow" aria-hidden="true" />
              <div className="relative z-[1] flex flex-wrap items-end justify-between gap-5 border-b border-[var(--color-border)] pb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-[800] tracking-[0.14em] text-[var(--color-action)]">
                    <span className="company-contact-mark" aria-hidden="true" />
                    CONTACT DETAILS
                  </div>
                  <h2 className="mt-3 text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] text-[var(--color-primary)]">{en ? englishContent.view.companyContactHeading : contact.heading}</h2>
                </div>
                <div className="text-right max-md:text-left">
                  <p className="text-xl font-[750] tracking-[0.02em] text-[var(--color-primary)]">{en ? "JIEPING CO., LTD" : "傑平泵浦有限公司"}</p>
                  <p className="mt-1 text-sm tracking-[0.12em] text-[var(--color-text-muted)]">JP Pump Solution</p>
                </div>
              </div>
              <dl className="relative z-[1] mt-6 grid gap-3 sm:grid-cols-2">
                {contact.contactRows.slice(1).map((row, index) => (
                  <div key={row.label + "-" + index} className="company-contact-card">
                    <dt className="flex items-center gap-2 text-xs font-[800] uppercase tracking-[0.1em] text-[var(--color-primary-muted)]">
                      <span className="company-contact-card-dot" aria-hidden="true" />
                      {en ? ({ "地址": "Address", "電話": "Phone", "傳真": "Fax", "Email": "Email" } as Record<string, string>)[row.label] ?? row.label : row.label}
                    </dt>
                    <dd className="mt-3 whitespace-pre-line text-[15px] leading-7 text-[var(--color-text)]">
                      {row.href ? <a href={row.href} className="company-contact-link focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2">{en && row.type === "address" ? row.value.split("\n")[1] : row.value}</a> : en && row.type === "address" ? row.value.split("\n")[1] : row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </RevealSection>
        )}
      </div>
    </>
  );
}
