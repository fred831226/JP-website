"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DropdownMenu from "./DropdownMenu";
import MobileMenu from "./MobileMenu";
import navData from "@/data/site.json";

interface NavItem {
  label: string;
  href: string;
}

interface NavDropdown {
  label: string;
  pumpTypes?: { id: string; label: string; href: string }[];
  children?: { id: string; label: string; href: string }[];
}

interface DesktopItem {
  key: string;
  label: string;
  href?: string;
  dropdown?: { id: string; label: string; href: string }[];
}

interface MobileChild {
  id: string;
  label: string;
  href?: string;
  children?: { id: string; label: string; href: string }[];
}

const nav = navData.nav as Record<string, NavItem | NavDropdown>;

const products = nav.products as NavDropdown;
const services = nav.services as NavItem;
const about = nav.about as NavDropdown;
const contact = nav.contact as NavItem;

const desktopItems: DesktopItem[] = [
  {
    key: "products",
    label: products.label,
    dropdown: [
      { id: "all-products", label: "全部產品", href: "/zh-tw/products" },
      ...(products.pumpTypes ?? []).map((p) => ({
        id: p.id,
        label: p.label,
        href: p.href,
      })),
    ],
  },
  { key: "services", label: services.label, href: services.href },
  {
    key: "about",
    label: about.label,
    dropdown: (about.children ?? []).map((c) => ({
      id: c.id,
      label: c.label,
      href: c.href,
    })),
  },
  { key: "contact", label: contact.label, href: contact.href },
];

const mobileItems: MobileChild[] = [
  {
    id: "products",
    label: products.label,
    children: [
      { id: "all-products", label: "全部產品", href: "/zh-tw/products" },
      ...(products.pumpTypes ?? []).map((p) => ({
        id: p.id,
        label: p.label,
        href: p.href,
      })),
    ],
  },
  { id: "services", label: services.label, href: services.href },
  {
    id: "about",
    label: about.label,
    children: (about.children ?? []).map((c) => ({
      id: c.id,
      label: c.label,
      href: c.href,
    })),
  },
  { id: "contact", label: contact.label, href: contact.href },
  { id: "home", label: "首頁", href: "/zh-tw" },
];

export default function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <header className="relative z-40 border-b border-[var(--color-border)] bg-white">
      <div className="mx-auto flex h-16 max-w-[var(--content-max)] items-center justify-between px-[var(--page-gutter-desktop)] max-md:px-[var(--page-gutter-mobile)]">
        <Link
          href="/zh-tw"
          className="flex min-h-[44px] items-center focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
          aria-label="回首頁"
        >
          <img src="/media/jp-pump-logo.png" alt="JP PUMP" className="h-12 w-auto" />
        </Link>

        {/* Desktop nav */}
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
            const href = item.href!;
            return (
              <Link
                key={item.key}
                href={href}
                className={`flex min-h-[44px] items-center px-3 text-sm font-[650] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2 ${
                  isActive(href)
                    ? "text-[var(--color-action)] underline underline-offset-4"
                    : "text-[var(--color-text)] hover:text-[var(--color-action)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <MobileMenu items={mobileItems} />
      </div>
    </header>
  );
}
