import { BrandSection } from "@/components/sections/brand-section";
import { OverviewSection } from "@/components/sections/overview-section";
import { ShowcaseSection } from "@/components/sections/showcase-section";

export default function HomePage() {
  return (
    <>
      <OverviewSection />
      <ShowcaseSection />
      <BrandSection />
    </>
  );
}
