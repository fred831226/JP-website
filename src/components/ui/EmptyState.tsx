import type { ReactNode } from "react";

type EmptyStateProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export default function EmptyState({ title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div
      className={`rounded-[var(--product-card-radius)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-[var(--product-card-shadow)] ${className}`.trim()}
    >
      <p className="text-lg font-[700] text-[var(--color-primary)]">{title}</p>
      {description ? (
        <p className="mt-2 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div> : null}
    </div>
  );
}
