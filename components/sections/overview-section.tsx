"use client";

import { DASHBOARD_ICONS } from "@/content/dashboard";
import { HeroThemeRotator } from "@/components/showcase/hero-theme-rotator";
import { DashboardIcon } from "@/components/ui/dashboard-icon";
import { useLanguage } from "@/components/providers/language-provider";

export function OverviewSection() {
  const { t } = useLanguage();
  return (
    <section id="overview" className="ui-surface overflow-hidden rounded-[26px] p-5 sm:rounded-[36px] sm:p-9 lg:p-12 xl:p-14">
      <div className="grid items-center gap-9 sm:gap-12 xl:grid-cols-[1fr_.9fr] xl:gap-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f1edfb] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#381c8d]">
            <DashboardIcon icon={DASHBOARD_ICONS.overviewBadge} width="16" />
            {t("UI Design Exploration")}
          </span>
          <h2 className="mt-6 text-[2.45rem] font-bold leading-[.95] tracking-[-0.06em] text-[#1d1822] sm:mt-7 sm:text-6xl lg:text-7xl">
              <span className="lg:block">{t("A better remittance")}</span>{" "}
              <span className="lg:block">{t("experience")}</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#77717f] sm:mt-7 sm:text-lg sm:leading-8">{t("Exploring layouts across three visual themes for review")}</p>
          <div className="mt-8 grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 sm:mt-10 sm:flex sm:flex-wrap">
            <a href="#showcase" className="ui-button inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#381c8d] px-5 text-sm font-bold text-white shadow-[0_14px_32px_rgba(56,28,141,.24)] sm:w-auto sm:px-6">
              {t("Explore samples")} <DashboardIcon icon={DASHBOARD_ICONS.ctaArrow} width="18" />
            </a>
            <a href="#brand" className="ui-button inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#ded9e5] bg-white px-5 text-sm font-bold text-[#4f4856] shadow-[0_8px_20px_rgba(37,27,57,.04)] sm:w-auto sm:px-6">
              {t("View brand system")}
            </a>
          </div>
        </div>

        <HeroThemeRotator />
      </div>
    </section>
  );
}
