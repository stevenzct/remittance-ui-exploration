import { DashboardShell } from "@/components/layout/dashboard-shell";
import { BrandSection } from "@/components/sections/brand-section";
import { OverviewSection } from "@/components/sections/overview-section";
import { ShowcaseSection } from "@/components/sections/showcase-section";
import { StatsSection } from "@/components/sections/stats-section";

export default function HomePage() {
  return (
    <DashboardShell>
      <OverviewSection />
      <StatsSection />
      <ShowcaseSection />
      <BrandSection />
    </DashboardShell>
  );
}
