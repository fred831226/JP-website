import Link from "next/link";
import DropdownMenu from "./DropdownMenu";
import MobileMenu from "./MobileMenu";
import NavTextLink from "./NavTextLink";
import { buildDesktopNav, buildMobileNav } from "./build-nav";
import type { SitePage } from "@/lib/validation/pages";

interface HeaderProps {
  site: SitePage;
}

/** Server chrome: logo + nav skeleton. Client islands: dropdown, mobile, active links. */
export default function Header({ site }: HeaderProps) {
  const desktopItems = buildDesktopNav(site);
  const mobileItems = buildMobileNav(site);

  return (
    <header className="relative z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex h-16 max-w-[var(--content-max)] items-center justify-between px-[var(--page-gutter-desktop)] max-md:px-[var(--page-gutter-mobile)]">
        <Link
          href="/zh-tw"
          className="flex min-h-[44px] items-center focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
          aria-label="回首頁"
        >
          <img src="/media/jp-pump-logo.png" alt="JP PUMP" className="h-12 w-auto" />
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          role="navigation"
          aria-label="主導覽"
        >
          {desktopItems.map((item) => {
            if (item.dropdown) {
              return (
                <DropdownMenu
                  key={item.key}
                  label={item.label}
                  items={item.dropdown}
                />
              );
            }
            return (
              <NavTextLink key={item.key} href={item.href!}>
                {item.label}
              </NavTextLink>
            );
          })}
        </nav>

        <MobileMenu items={mobileItems} />
      </div>
    </header>
  );
}
