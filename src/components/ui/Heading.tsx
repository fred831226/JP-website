import type { ReactNode } from "react";

type HeadingLevel = "h1" | "h2" | "h3";
type HeadingSize = "display" | "lg" | "md" | "sm";

const sizeClass: Record<HeadingSize, string> = {
  display:
    "text-[var(--font-display-size)] font-[var(--font-display-weight)] leading-[var(--font-display-line-height)] tracking-[var(--font-display-letter-spacing)] max-md:text-[var(--font-display-mobile-size)] max-md:leading-[var(--font-display-mobile-line-height)]",
  lg: "text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)]",
  md: "text-[var(--font-heading-md-size)] font-[var(--font-heading-md-weight)] leading-[var(--font-heading-md-line-height)]",
  sm: "text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)]",
};

type HeadingProps = {
  children: ReactNode;
  as?: HeadingLevel;
  size?: HeadingSize;
  className?: string;
  tone?: "primary" | "on-primary" | "inherit";
};

export default function Heading({
  children,
  as: Tag = "h1",
  size = "lg",
  className = "",
  tone = "primary",
}: HeadingProps) {
  const toneClass =
    tone === "primary"
      ? "text-[var(--color-primary)]"
      : tone === "on-primary"
        ? "text-[var(--color-on-primary)]"
        : "";

  return <Tag className={`${sizeClass[size]} ${toneClass} ${className}`.trim()}>{children}</Tag>;
}
