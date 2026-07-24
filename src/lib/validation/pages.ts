import { z } from "zod";

const NullableString = z.string().nullable();

export const HomePageSchema = z.object({
  hero: z.object({
    kicker: z.string(),
    title: z.string(),
    subtitle: z.string(),
    ctaLabel: z.string(),
    ctaHref: z.string(),
    images: z.array(z.string()),
  }),
  companySummary: z.object({
    heading: z.string(),
    body: z.string(),
  }),
  purposes: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      description: z.string(),
      image: z.string().optional(),
    }),
  ),
  gateways: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      href: z.string(),
    }),
  ),
  projects: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      title: z.string(),
      description: z.string(),
      image: z.string().optional(),
    }),
  ),
  partners: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      logo: z.string().optional(),
      website: z.string().optional(),
    }),
  ),
});

export const CompanyPageSchema = z.object({
  name: z.string(),
  brand: z.string(),
  foundedYear: z.number().nullable(),
  intro: z.string(),
  facts: z.array(z.string()),
  contact: z.object({
    phone: NullableString,
    email: NullableString,
    address: NullableString,
  }),
});

export const ContactPageSchema = z.object({
  hero: z.object({
    title: z.string(),
    summary: z.string(),
  }),
  info: z.object({
    phone: NullableString,
    email: NullableString,
    address: NullableString,
    line: NullableString,
  }),
  faq: z.array(
    z.object({
      q: z.string(),
      a: z.string(),
    }),
  ),
});

export const ServicesPageSchema = z.object({
  hero: z.object({
    title: z.string(),
    capabilities: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
      }),
    ),
    summary: z.string(),
  }),
  projects: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      type: z.string(),
      context: z.string(),
      scope: z.string().optional(),
      outcome: z.string().optional(),
      relatedProducts: z.array(z.string()).optional(),
      image: z.string().optional(),
    }),
  ),
});

export const PartnerSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  logo: z.string().optional(),
  url: z.string().optional(),
});

export const PartnersPageSchema = z.array(PartnerSchema);

export const SitePageSchema = z.object({
  companyName: z.string(),
  brandName: z.string(),
  nav: z.object({
    products: z.object({
      label: z.string(),
      href: z.string(),
      pumpTypes: z.array(
        z.object({
          id: z.string(),
          label: z.string(),
          href: z.string(),
        }),
      ),
    }),
    services: z.object({
      label: z.string(),
      href: z.string(),
    }),
    about: z.object({
      label: z.string(),
      children: z.array(
        z.object({
          id: z.string(),
          label: z.string(),
          href: z.string(),
        }),
      ),
    }),
    contact: z.object({
      label: z.string(),
      href: z.string(),
    }),
  }),
  contactInfo: z.object({
    phone: z.string(),
    email: z.string(),
    address: z.string(),
  }),
});

export type HomePage = z.infer<typeof HomePageSchema>;
export type CompanyPage = z.infer<typeof CompanyPageSchema>;
export type ContactPage = z.infer<typeof ContactPageSchema>;
export type ServicesPage = z.infer<typeof ServicesPageSchema>;
export type Partner = z.infer<typeof PartnerSchema>;
export type SitePage = z.infer<typeof SitePageSchema>;
