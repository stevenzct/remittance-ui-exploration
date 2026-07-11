import Image from "next/image";
import {
  DASHBOARD_ICONS,
  DASHBOARD_THEME,
  NAVIGATION_ITEMS,
} from "@/content/dashboard";
import { DashboardIcon } from "@/components/ui/dashboard-icon";

export function DashboardSidebar() {
  return (
    <aside className="hidden w-[272px] flex-col border-r border-[#ece9f1] bg-white p-5 lg:sticky lg:top-0 lg:flex lg:h-screen">
      <div className="flex h-16 items-center justify-between border-b border-[#ece9f1] px-2 pb-4">
        <Image src="/payso-logo.svg" alt="Payso Merchant" width={159} height={46} priority className="h-10 w-auto object-contain" />
      </div>

      <p className="px-3 pb-2 pt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#aaa4b1]">Workspace</p>
      <nav className="space-y-1" aria-label="Dashboard navigation">
        {NAVIGATION_ITEMS.map((item, index) => (
          <a key={item.id} href={item.href} className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${index === 0 ? "bg-[#f1edfb] text-[#381c8d]" : "text-[#706a76] hover:bg-[#f7f6f9] hover:text-[#381c8d]"}`}>
            <span className={`grid size-9 place-items-center rounded-xl ${index === 0 ? "bg-white shadow-sm" : "bg-[#f7f6f9]"}`}>
              <DashboardIcon icon={item.icon} width="20" />
            </span>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-[#ece9f1] bg-[#faf9fc] p-4">
        <div className="mb-3 grid size-10 place-items-center rounded-2xl bg-[#381c8d] text-white">
          <DashboardIcon icon={DASHBOARD_ICONS.themeSummary} width="22" />
        </div>
        <p className="text-sm font-bold text-[#24202a]">{DASHBOARD_THEME.label} · {DASHBOARD_THEME.name}</p>
        <p className="mt-1 text-xs leading-5 text-[#837d89]">{DASHBOARD_THEME.summary}</p>
      </div>
    </aside>
  );
}
