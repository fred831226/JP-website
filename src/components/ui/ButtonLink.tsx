import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "contactPill";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "rounded-[var(--button-primary-radius)] bg-[var(--button-primary-bg)] px-[var(--button-primary-padding-inline)] text-[var(--button-primary-fg)] shadow-[var(--shadow-action)] hover:brightness-110 hover:translate-y-[-2px] hover:shadow-[var(--shadow-action-hover)]",
  secondary:
    "rounded-[var(--button-primary-radius)] bg-[var(--button-secondary-bg)] px-[var(--button-primary-padding-inline)] text-[var(--button-secondary-fg)] shadow-[var(--button-secondary-shadow)] hover:translate-y-[-2px] hover:shadow-[var(--shadow-control)]",
  contactPill:
    "rounded-[var(--radius-full)] bg-[var(--color-contact-surface)] px-4 text-[var(--color-on-primary)] hover:brightness-110",
};

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  external?: boolean;
};

const baseClass =
  "inline-flex min-h-[var(--button-primary-min-height)] items-center justify-center px-6 text-sm font-[650] transition-all duration-300 focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2";

export default function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
}: ButtonLinkProps) {
  const classes = `${baseClass} ${variantClass[variant]} ${className}`.trim();
  const isProtocolLink = /^(tel:|mailto:|sms:)/i.test(href);

  if (external || isProtocolLink) {
    return (
      <a
        href={href}
        className={classes}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
