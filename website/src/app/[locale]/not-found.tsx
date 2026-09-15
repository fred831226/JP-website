import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-16 max-md:px-[var(--page-gutter-mobile)]">
      <h1 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
        找不到此頁面
      </h1>
      <p className="mt-4 max-w-[var(--text-max)] leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
        您要求的頁面不存在或已被移除。請檢查網址是否正確。
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/zh-tw/products"
          className="inline-flex min-h-[44px] items-center rounded-[var(--button-primary-radius)] bg-[var(--button-primary-bg)] px-6 text-sm font-[650] text-[var(--button-primary-fg)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
        >
          瀏覽產品
        </Link>
        <Link
          href="/zh-tw/contact"
          className="inline-flex min-h-[44px] items-center rounded-[var(--button-primary-radius)] bg-white px-6 text-sm font-[650] text-[var(--color-primary)] shadow-[0_3px_10px_rgba(11,42,61,0.10)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
        >
          聯絡我們
        </Link>
      </div>
    </div>
  );
}
