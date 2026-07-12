import { DASHBOARD_THEME } from "@/content/dashboard";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex min-h-16 min-w-0 items-center justify-between gap-2 border-b border-[#ece9f1] bg-white/90 px-3 py-3 backdrop-blur-xl sm:h-20 sm:gap-3 sm:px-8 sm:py-0 lg:px-10">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <MobileNavigation />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-[#99929f] sm:text-xs">Remittance App</p>
          <h1 className="truncate text-base font-bold tracking-[-0.02em] text-[#201b26] sm:text-lg">Homepage Design</h1>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden rounded-full border border-[#e7e3eb] bg-white px-3 py-2 text-xs font-semibold text-[#706a76] sm:inline-flex">{DASHBOARD_THEME.label}</span>
      </div>
    </header>
  );
}
