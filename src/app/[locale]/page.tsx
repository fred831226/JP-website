import HomeHero from "@/features/home/HomeHero";
import HomeCompany from "@/features/home/HomeCompany";
import HomePurposes from "@/features/home/HomePurposes";
import HomeGateways from "@/features/home/HomeGateways";
import HomeProjects from "@/features/home/HomeProjects";
import HomePartners from "@/features/home/HomePartners";
import { getBrands, getPurposes } from "@/lib/content/load-catalog";
import { getHomePage } from "@/lib/content/load-pages";

export default function HomePage() {
  const homeData = getHomePage();
  const brands = getBrands();
  const purposes = getPurposes();

  return (
    <>
      <HomeHero
        hero={homeData.hero}
        brands={brands.map((b) => ({ id: b.id, name: b.name }))}
        purposes={purposes.map((p) => ({ id: p.id, name: p.name }))}
      />
      <HomeCompany companySummary={homeData.companySummary} />
      <HomePurposes purposes={homeData.purposes} />
      <HomeGateways gateways={homeData.gateways} />
      <HomeProjects projects={homeData.projects} />
      <HomePartners partners={homeData.partners} />
    </>
  );
}
