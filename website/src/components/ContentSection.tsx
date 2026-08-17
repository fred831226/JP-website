export type ContactRow = {
  label: string;
  value: string;
  type: "address" | "phone" | "email" | "url" | "text";
  href?: string;
};

export type ContentSection =
  | { id: string; heading: string; type: "paragraphs"; paragraphs: string[] }
  | { id: string; heading: string; type: "stats"; stats: { value: string; label: string }[] }
  | { id: string; heading: string; type: "milestones"; milestones: string[] }
  | { id: string; heading: string; type: "contact"; note?: string; contactRows: ContactRow[] }
  | { id: string; heading: string; type: "vision"; author?: string | null; paragraphs: string[] };

export default function ContentSection({ section }: { section: ContentSection }) {
  return (
    <section aria-labelledby={`section-${section.id}`}>
      <h2
        id={`section-${section.id}`}
        className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]"
      >
        {section.heading}
      </h2>

      {section.type === "paragraphs" && (
        <div className="mt-4 space-y-3">
          {section.paragraphs.map((p, i) => (
            <p key={i} className="max-w-[var(--text-max)] leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
              {p}
            </p>
          ))}
        </div>
      )}

      {section.type === "stats" && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {section.stats.map((st) => (
            <div key={st.label} className="rounded-[var(--radius-md)] bg-white p-5 text-center shadow-[var(--product-card-shadow)]">
              <p className="text-2xl font-[700] text-[var(--color-primary)]">{st.value}</p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{st.label}</p>
            </div>
          ))}
        </div>
      )}

      {section.type === "milestones" && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {section.milestones.map((m) => (
            <li key={m} className="rounded-[var(--radius-xs)] border border-[var(--color-border)] bg-white px-3 py-1.5 text-sm text-[var(--color-text)]">
              {m}
            </li>
          ))}
        </ul>
      )}

      {section.type === "contact" && (
        <div className="mt-4 space-y-4">
          {section.contactRows.length === 0 ? (
            <p className="text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">{section.note}</p>
          ) : (
            section.contactRows.map((r, i) => (
              <div key={`${r.label}-${i}`}>
                <span className="text-sm font-[650] text-[var(--color-text)]">{r.label}</span>
                {r.type === "phone" ? (
                  <a
                    href={r.href ?? `tel:${r.value.replace(/\s+/g, "")}`}
                    className="mt-1 flex min-h-[44px] items-center rounded-[var(--radius-md)] bg-white px-4 text-sm text-[var(--color-action)] shadow-[var(--product-card-shadow)] hover:underline focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
                  >
                    {r.value}
                  </a>
                ) : r.type === "email" ? (
                  <a
                    href={r.href ?? `mailto:${r.value}`}
                    className="mt-1 flex min-h-[44px] items-center rounded-[var(--radius-md)] bg-white px-4 text-sm text-[var(--color-action)] shadow-[var(--product-card-shadow)] hover:underline focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
                  >
                    {r.value}
                  </a>
) : r.type === "url" ? (
                  <a
                    href={r.href ?? r.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex min-h-[44px] items-center rounded-[var(--radius-md)] bg-white px-4 text-sm text-[var(--color-action)] shadow-[var(--product-card-shadow)] hover:underline focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
                  >
                    {r.value}
                  </a>
                ) : (
                  <p className="mt-1 flex min-h-[44px] items-center whitespace-pre-line rounded-[var(--radius-md)] bg-white px-4 text-sm text-[var(--color-text)] shadow-[var(--product-card-shadow)]">
                    {r.value}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {section.type === "vision" && (
        <blockquote className="mt-4 rounded-[var(--radius-md)] border-l-[3px] border-[var(--color-action)] bg-[var(--color-surface-subtle)] px-5 py-4">
          <div className="space-y-3">
            {section.paragraphs.map((p, i) => (
              <p key={i} className="max-w-[var(--text-max)] leading-[var(--font-body-line-height)] text-[var(--color-text)]">
                {p}
              </p>
            ))}
          </div>
          {section.author && (
            <footer className="mt-3 text-sm font-[650] text-[var(--color-primary)]">— {section.author}</footer>
          )}
        </blockquote>
      )}
    </section>
  );
}