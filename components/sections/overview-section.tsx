import { DASHBOARD_ICONS } from "@/content/dashboard";
import { HeroThemeRotator } from "@/components/showcase/hero-theme-rotator";
import { DashboardIcon } from "@/components/ui/dashboard-icon";

export function OverviewSection() {
  return (
    <section id="overview" className="overflow-hidden rounded-[24px] border border-[#ece9f1] bg-white p-4 shadow-[0_18px_50px_rgba(37,27,57,.05)] sm:rounded-[32px] sm:p-9 lg:p-11">
      <div className="grid items-center gap-8 sm:gap-10 xl:grid-cols-[1fr_.9fr]">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f1edfb] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#381c8d]">
            <DashboardIcon icon={DASHBOARD_ICONS.overviewBadge} width="16" />
            UI Design Exploration
          </span>
          <h2 className="mt-5 text-3xl font-bold leading-[.98] tracking-[-0.055em] text-[#1d1822] sm:mt-6 sm:text-6xl lg:text-7xl">
              A better remittance experience
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#77717f] sm:text-lg">Exploring layouts across three visual themes for review</p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <a href="#showcase" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#381c8d] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(56,28,141,.22)]">
              Explore samples <DashboardIcon icon={DASHBOARD_ICONS.ctaArrow} width="18" />
            </a>
            <a href="#brand" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#ded9e5] bg-white px-5 py-3 text-sm font-bold text-[#4f4856]">
              View brand system
            </a>
          </div>
        </div>

        <HeroThemeRotator />
      </div>
    </section>
  );
}
