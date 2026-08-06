"use client";

import Link from "next/link";
import { DASHBOARD_ICONS } from "@/content/dashboard";
import { DashboardIcon } from "@/components/ui/dashboard-icon";
import { useLanguage } from "@/components/providers/language-provider";
import { RevisionOverview } from "@/components/revisions/revision-overview";

export function RefinementsPage() {
  const { t } = useLanguage();
  return (
    <div className="revisions-page space-y-4 sm:space-y-8 lg:space-y-10">
      <section className="ui-surface overflow-hidden rounded-[26px] sm:rounded-[36px]">
        <div className="revision-hero relative isolate p-5 sm:p-9 lg:p-12 xl:p-14">
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f1edfb] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#381c8d]">
              <DashboardIcon icon={DASHBOARD_ICONS.revisionsNavigation} width="16" />
              {t("UI review applied")}
            </span>
            <h2 className="mt-6 text-[2.45rem] font-bold leading-[.95] tracking-[-0.06em] text-[#1d1822] sm:mt-7 sm:text-6xl lg:text-7xl">
              <span className="block">{t("Homepage")}</span>
              <span className="block">{t("Refinements")}</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#77717f] sm:mt-7 sm:text-lg sm:leading-8">
              {t("A focused before-and-after review of the homepage improvements shaped by feedback from Product Manager Ms. Yolanda.")}
            </p>
            <div className="mx-auto mt-8 grid max-w-md grid-cols-1 gap-3 sm:mt-10 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center">
              <Link
                href="/prototype"
                className="ui-button inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#381c8d] px-5 text-sm font-bold text-white shadow-[0_14px_32px_rgba(56,28,141,.24)] sm:w-auto sm:px-6"
              >
                {t("View updated prototype")}
                <DashboardIcon icon={DASHBOARD_ICONS.ctaArrow} width="18" />
              </Link>
              <a
                href="#refinement-comparison"
                className="ui-button inline-flex w-full items-center justify-center rounded-2xl border border-[#ded9e5] bg-white/90 px-5 text-sm font-bold text-[#4f4856] shadow-[0_8px_20px_rgba(37,27,57,.04)] sm:w-auto sm:px-6"
              >
                {t("Compare before & after")}
              </a>
            </div>
          </div>
        </div>
        <RevisionOverview />
      </section>

      <section className="revision-cta relative overflow-hidden rounded-[26px] bg-[#25105f] p-6 text-white shadow-[0_24px_64px_rgba(37,16,95,.24)] sm:rounded-[36px] sm:p-10 lg:p-12">
        <div className="revision-cta-grid" aria-hidden="true" />
        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#cabcf1]">{t("Ready to explore")}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-.05em] sm:text-5xl">{t("See every refinement in action.")}</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/68 sm:text-base sm:leading-7">
              {t("Open the interactive homepage to test the revised navigation, country switcher, wallet, and key actions.")}
            </p>
          </div>
          <Link
            href="/prototype"
            className="ui-button inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-bold text-[#381c8d] shadow-[0_14px_30px_rgba(0,0,0,.2)] sm:w-auto"
          >
            {t("Launch updated prototype")}
            <DashboardIcon icon={DASHBOARD_ICONS.ctaArrow} width="18" />
          </Link>
        </div>
      </section>
    </div>
  );
}
