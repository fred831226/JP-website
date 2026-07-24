import type { SitePage } from "@/lib/validation/pages";

export type NavDropdownItem = {
  id: string;
  label: string;
  href: string;
};

export type DesktopNavItem = {
  key: string;
  label: string;
  href?: string;
  dropdown?: NavDropdownItem[];
};

export type MobileNavItem = {
  id: string;
  label: string;
  href?: string;
  children?: NavDropdownItem[];
};

/** Pure nav model from governed site page — shared by Server Header. */
export function buildDesktopNav(site: SitePage): DesktopNavItem[] {
  const { products, services, about, contact } = site.nav;

  return [
    {
      key: "products",
      label: products.label,
      dropdown: [
        { id: "all-products", label: "全部產品", href: "/zh-tw/products" },
        ...products.pumpTypes.map((p) => ({
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
      dropdown: about.children.map((c) => ({
        id: c.id,
        label: c.label,
        href: c.href,
      })),
    },
    { key: "contact", label: contact.label, href: contact.href },
  ];
}

export function buildMobileNav(site: SitePage): MobileNavItem[] {
  const { products, services, about, contact } = site.nav;

  return [
    {
      id: "products",
      label: products.label,
      children: [
        { id: "all-products", label: "全部產品", href: "/zh-tw/products" },
        ...products.pumpTypes.map((p) => ({
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
      children: about.children.map((c) => ({
        id: c.id,
        label: c.label,
        href: c.href,
      })),
    },
    { id: "contact", label: contact.label, href: contact.href },
    { id: "home", label: "首頁", href: "/zh-tw" },
  ];
}
