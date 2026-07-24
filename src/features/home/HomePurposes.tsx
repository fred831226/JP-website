import Link from "next/link";
import RevealSection from "@/components/RevealSection";
import type { HomePage } from "@/lib/validation/pages";

type HomePurpose = HomePage["purposes"][number];

type HomePurposesProps = {
  purposes: HomePurpose[];
};

function splitSentences(text: string): string[] {
  const parts = text
    .split(/(?<=[。！？])/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.slice(0, 2);
}

export default function HomePurposes({ purposes }: HomePurposesProps) {
  if (purposes.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[var(--color-background)]">
      <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-14 max-md:px-[var(--page-gutter-mobile)]">
        <RevealSection>
          <div className="mb-8 max-w-[500px]">
            <p className="mb-2 text-sm font-[650] text-[var(--color-action)]">產品用途</p>
            <h2 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
              依產品用途找到合適系列
            </h2>
            <p className="mt-3 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
              用途名稱、排序與圖片須依正式受控分類核准。點擊整張卡片後前往該用途說明頁。
            </p>
          </div>
        </RevealSection>
        <div className="grid gap-6 md:grid-cols-2">
          {purposes.map((pt, i) => {
            const sentences = splitSentences(pt.description);
            return (
              <RevealSection key={pt.id} delayMs={i * 80} className={i < 6 ? `rv-d${i + 1}` : ""}>
                <Link
                  href={`/zh-tw/purposes/${encodeURIComponent(pt.slug)}`}
                  className="purpose-card group relative flex flex-col overflow-hidden rounded-[var(--product-card-radius)] bg-[var(--color-surface)] shadow-[var(--product-card-shadow)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
                >
                  <div className="aspect-[16/9] bg-[var(--color-surface-subtle)]">
                    {pt.image ? (
                      <img
                        src={pt.image}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2 p-5 pr-12">
                    <span className="text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] text-[var(--color-primary)]">
                      {pt.name}
                    </span>
                    {sentences.map((s) => (
                      <p key={s} className="text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
                        {s}
                      </p>
                    ))}
                  </div>
                  <span
                    className="purpose-arrow-hover absolute bottom-5 right-5 text-2xl text-[var(--color-primary-muted)] opacity-55 transition-all duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              </RevealSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
