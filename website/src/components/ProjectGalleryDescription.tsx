import RevealSection from "@/components/RevealSection";

type Part = { text: string; strong: boolean };
type Paragraph = { parts: Part[] };

export default function ProjectGalleryDescription({ paragraphs, belowGallery = false }: { paragraphs: Paragraph[]; belowGallery?: boolean }) {
  return (
    <div className={`${belowGallery ? "mt-8 max-w-[760px]" : "mt-4 max-w-[660px]"} border-l-[3px] border-[var(--color-action)] pl-4 sm:pl-5`}>
      {paragraphs.map((paragraph, index) => (
        <RevealSection key={index} delayMs={index * 100} className={index > 0 ? "mt-3" : ""}>
          <p className={`leading-[var(--font-body-line-height)] ${index === 0 ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]"}`}>
            {paragraph.parts.map((part, partIndex) => part.strong ? (
              <strong key={partIndex} className="font-[750] text-[var(--color-primary)]">{part.text}</strong>
            ) : (
              <span key={partIndex}>{part.text}</span>
            ))}
          </p>
        </RevealSection>
      ))}
    </div>
  );
}
