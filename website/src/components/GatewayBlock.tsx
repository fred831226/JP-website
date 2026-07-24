import Link from "next/link";

interface Gateway {
  id: string;
  title: string;
  description: string;
  href: string;
}

interface GatewayBlockProps {
  gateways: Gateway[];
}

export default function GatewayBlock({ gateways }: GatewayBlockProps) {
  return (
    <div
      className="gateway-grid grid gap-3 md:grid-cols-[1fr_1fr_1fr]"
      role="group"
      aria-label="主要入口"
    >
      {gateways.map((g) => (
        <Link
          key={g.id}
          href={g.href}
          className="gateway flex flex-col justify-center rounded-[var(--product-card-radius)] bg-white p-6 shadow-[var(--product-card-shadow)] transition-all duration-300 ease-out hover:-translate-y-[3px] hover:bg-[var(--color-surface-subtle)] hover:shadow-lg focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2 max-md:w-full"
        >
          <span className="text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] text-[var(--color-primary)]">
            {g.title}
          </span>
          <span className="mt-2 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
            {g.description}
          </span>
        </Link>
      ))}
    </div>
  );
}
