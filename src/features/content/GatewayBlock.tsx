import Link from "next/link";

export interface Gateway {
  id: string;
  title: string;
  description: string;
  href: string;
}

interface GatewayBlockProps {
  gateways: Gateway[];
}

/** Home destination gateways — sole implementation (desktop :has() expand via globals.css). */
export default function GatewayBlock({ gateways }: GatewayBlockProps) {
  return (
    <div
      className="gateway-grid grid gap-3 md:grid-cols-[1fr_1fr_1fr]"
      role="group"
      aria-label="主要入口"
    >
      {gateways.map((g, i) => (
        <Link
          key={g.id}
          href={g.href}
          className="gateway group relative flex flex-col justify-between gap-8 rounded-[var(--product-card-radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 shadow-[var(--product-card-shadow)] transition-all duration-300 ease-out hover:-translate-y-[2px] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-subtle)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
        >
          <div>
            <span className="gateway-no block" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="block text-sm font-[700] text-[var(--color-action)]">
              {gatewayEyebrow(g.id)}
            </span>
            <span className="mt-1 block text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] text-[var(--color-primary)]">
              {g.title}
            </span>
            <span className="mt-2 block text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
              {g.description}
            </span>
          </div>
          <span className="text-sm font-[700] text-[var(--color-action)]">
            {gatewayAction(g.id)}
          </span>
        </Link>
      ))}
    </div>
  );
}

function gatewayEyebrow(id: string): string {
  switch (id) {
    case "products":
      return "產品探索";
    case "services":
      return "工程服務";
    case "contact":
      return "技術聯絡";
    default:
      return "";
  }
}

function gatewayAction(id: string): string {
  switch (id) {
    case "products":
      return "前往產品總覽 →";
    case "services":
      return "查看服務與實績 →";
    case "contact":
      return "聯絡 JP PUMP →";
    default:
      return "了解更多 →";
  }
}
