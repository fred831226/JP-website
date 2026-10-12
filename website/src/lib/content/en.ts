import "server-only";

import { z } from "zod";
import raw from "@/data/en.json";

const Text = z.string().trim().min(1);
const EnglishContentSchema = z.object({
  nav: z.object({ home: Text, products: Text, company: Text, partners: Text, contact: Text }),
  home: z.object({ eyebrow: Text, title: Text, intro: Text, companyHeading: Text, companyBody: Text, productHeading: Text, productBody: Text, partnerHeading: Text, contactHeading: Text }),
  company: z.object({ title: Text, intro: Text, serviceHeading: Text, services: z.array(Text).min(1), detailsHeading: Text }),
  partners: z.object({ title: Text, intro: Text, grundfosSummary: Text, websiteAction: Text }),
  products: z.object({ title: Text, intro: Text, inquiryAction: Text, noDetails: Text }),
  contact: z.object({ title: Text, intro: Text, phone: Text, fax: Text, email: Text, address: Text }),
  shared: z.object({ learnMore: Text, viewProducts: Text, contactUs: Text, backHome: Text, notFoundTitle: Text, notFoundBody: Text }),
  view: z.object({
    heroKicker: Text, companySummaryHeading: Text, companySummaryBody: Text,
    projectGalleryHeading: Text, projectGalleryDescription: Text, galleryAction: Text,
    pumpTypesHeading: Text, gatewaysHeading: Text, partnerHeading: Text, partnerAction: Text,
    photoAlts: z.array(Text).length(11), pumpTypeNames: z.array(Text).length(6),
    gatewayTitles: z.array(Text).length(3), gatewayDescriptions: z.array(Text).length(3), gatewayActions: z.array(Text).length(3),
    companyServicesParagraph: Text, milestonesHeading: Text, milestones: z.array(Text).length(9), companyContactHeading: Text,
    partnerSectionHeading: Text, partnerParagraphs: z.array(Text).length(2), seriesDescriptions: z.record(z.string(), Text),
  }),
});

export const englishContent = EnglishContentSchema.parse(raw);
