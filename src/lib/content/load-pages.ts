import "server-only";

import {
  CompanyPageSchema,
  ContactPageSchema,
  HomePageSchema,
  PartnersPageSchema,
  ServicesPageSchema,
  SitePageSchema,
  type CompanyPage,
  type ContactPage,
  type HomePage,
  type Partner,
  type ServicesPage,
  type SitePage,
} from "@/lib/validation/pages";
import homeRaw from "@content/pages/home.json";
import companyRaw from "@content/pages/company.json";
import contactRaw from "@content/pages/contact.json";
import servicesRaw from "@content/pages/services.json";
import partnersRaw from "@content/pages/partners.json";
import siteRaw from "@content/pages/site.json";

const home = HomePageSchema.parse(homeRaw);
const company = CompanyPageSchema.parse(companyRaw);
const contact = ContactPageSchema.parse(contactRaw);
const services = ServicesPageSchema.parse(servicesRaw);
const partners = PartnersPageSchema.parse(partnersRaw);
const site = SitePageSchema.parse(siteRaw);

export function getHomePage(): HomePage {
  return home;
}

export function getCompanyPage(): CompanyPage {
  return company;
}

export function getContactPage(): ContactPage {
  return contact;
}

export function getServicesPage(): ServicesPage {
  return services;
}

export function getPartnersPage(): Partner[] {
  return partners;
}

export function getSitePage(): SitePage {
  return site;
}
