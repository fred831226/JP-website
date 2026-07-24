/** Renders the governed missing-value label. Never invent or zero-fill. */
export default function MissingValue({ className = "" }: { className?: string }) {
  return (
    <span className={`italic text-[var(--color-identity-detail)] ${className}`.trim()}>未提供</span>
  );
}
