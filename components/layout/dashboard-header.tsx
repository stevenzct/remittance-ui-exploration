import { DASHBOARD_ICONS, DASHBOARD_THEME } from "@/content/dashboard";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { DashboardIcon } from "@/components/ui/dashboard-icon";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#ece9f1] bg-white/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
      <div className="flex items-center gap-3">
        <MobileNavigation />
        <div>
          <p className="text-xs font-semibold text-[#99929f]">Payso Merchant</p>
          <h1 className="text-lg font-bold tracking-[-0.02em] text-[#201b26]">UI Design Dashboard</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden rounded-full border border-[#e7e3eb] bg-white px-3 py-2 text-xs font-semibold text-[#706a76] sm:inline-flex">{DASHBOARD_THEME.label}</span>
        <button type="button" className="grid size-10 place-items-center rounded-2xl bg-[#381c8d] text-white shadow-[0_10px_24px_rgba(56,28,141,.2)]" aria-label="More options">
          <DashboardIcon icon={DASHBOARD_ICONS.moreOptions} width="20" />
        </button>
      </div>
    </header>
  );
}
