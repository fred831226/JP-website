import type { ReactNode } from "react";
import Heading from "@/components/ui/Heading";

type SectionHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: "display" | "lg" | "md" | "sm";
  className?: string;
  tone?: "primary" | "on-primary" | "inherit";
  descriptionClassName?: string;
};

export default function SectionHeader({
  title,
  description,
  eyebrow,
  as = "h1",
  size = "lg",
  className = "",
  tone = "primary",
  descriptionClassName = "",
}: SectionHeaderProps) {
  const muted =
    tone === "on-primary"
      ? "text-[var(--color-contact-text-muted)]"
      : "text-[var(--color-text-muted)]";

  return (
    <header className={className}>
      {eyebrow ? <div className="mb-2">{eyebrow}</div> : null}
      <Heading as={as} size={size} tone={tone}>
        {title}
      </Heading>
      {description ? (
        <p
          className={`mt-2 max-w-[var(--text-max)] leading-[var(--font-body-line-height)] ${muted} ${descriptionClassName}`.trim()}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}
