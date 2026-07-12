import Image from "next/image";
import {
  DASHBOARD_ICONS,
  DASHBOARD_THEME,
} from "@/content/dashboard";
import { DashboardNavigation } from "@/components/layout/dashboard-navigation";
import { DashboardIcon } from "@/components/ui/dashboard-icon";

export function DashboardSidebar() {
  return (
    <aside className="hidden w-[272px] flex-col overflow-y-auto overscroll-contain border-r border-[#ece9f1] bg-white p-5 lg:sticky lg:top-0 lg:flex lg:h-dvh">
      <div className="flex h-16 items-center justify-center border-b border-[#ece9f1] px-2 pb-4">
        <Image src="/payso-logo.svg" alt="Payso logo" width={159} height={46} priority className="h-10 w-auto object-contain" />
      </div>

      <p className="px-3 pb-2 pt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#aaa4b1]">Workspace</p>
      <DashboardNavigation />

      <div className="mt-auto rounded-3xl border border-[#ece9f1] bg-[#faf9fc] p-4">
        <div className="mb-3 grid size-10 place-items-center rounded-2xl bg-[#381c8d] text-white">
          <DashboardIcon icon={DASHBOARD_ICONS.themeSummary} width="22" />
        </div>
        <p className="text-sm font-bold text-[#24202a]">{DASHBOARD_THEME.name}</p>
        <p className="mt-1 text-xs leading-5 text-[#837d89]">{DASHBOARD_THEME.summary}</p>
      </div>
    </aside>
  );
}
