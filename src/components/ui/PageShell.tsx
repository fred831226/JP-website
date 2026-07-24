import type { ReactNode } from "react";

type PageShellPadding = "sm" | "md" | "lg" | "xl";

const paddingClass: Record<PageShellPadding, string> = {
  sm: "py-8",
  md: "py-10",
  lg: "py-14",
  xl: "py-16",
};

type PageShellProps = {
  children: ReactNode;
  as?: "div" | "section" | "main";
  padding?: PageShellPadding;
  className?: string;
};

/** Content-max width + responsive page gutters. */
export default function PageShell({
  children,
  as: Tag = "div",
  padding = "sm",
  className = "",
}: PageShellProps) {
  return (
    <Tag
      className={`mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] max-md:px-[var(--page-gutter-mobile)] ${paddingClass[padding]} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
