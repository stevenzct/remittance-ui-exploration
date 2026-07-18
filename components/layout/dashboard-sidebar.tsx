"use client";

import Image from "next/image";
import {
  DASHBOARD_ICONS,
  DASHBOARD_THEME,
} from "@/content/dashboard";
import { DashboardNavigation } from "@/components/layout/dashboard-navigation";
import { DashboardIcon } from "@/components/ui/dashboard-icon";
import { useLanguage } from "@/components/providers/language-provider";

export function DashboardSidebar() {
  const { t } = useLanguage();
  return (
    <aside className="hidden w-[272px] flex-col overflow-y-auto overscroll-contain border-r border-white/80 bg-white/88 p-5 shadow-[12px_0_40px_rgba(37,27,57,.025)] backdrop-blur-2xl lg:sticky lg:top-0 lg:flex lg:h-dvh">
      <div className="flex h-16 items-center justify-center border-b border-[#ece9f1] px-2 pb-4">
        <Image src="/payso-logo.svg" alt="Payso logo" width={159} height={46} priority className="h-10 w-auto object-contain" />
      </div>

      <p className="px-3 pb-2 pt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#aaa4b1]">{t("Workspace")}</p>
      <DashboardNavigation />

      <div className="mt-auto rounded-3xl border border-[#e9e4ef] bg-[linear-gradient(145deg,#fbfafd,#f4f0f9)] p-4 shadow-[0_14px_32px_rgba(37,27,57,.045)]">
        <div className="mb-3 grid size-10 place-items-center rounded-2xl bg-[#381c8d] text-white">
          <DashboardIcon icon={DASHBOARD_ICONS.themeSummary} width="22" />
        </div>
        <p className="text-sm font-bold text-[#24202a]">{t(DASHBOARD_THEME.name)}</p>
        <p className="mt-1 text-xs leading-5 text-[#837d89]">{t(DASHBOARD_THEME.summary)}</p>
      </div>
    </aside>
  );
}
