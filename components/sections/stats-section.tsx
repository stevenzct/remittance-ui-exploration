import { DASHBOARD_STATISTICS } from "@/content/dashboard";
import { DashboardIcon } from "@/components/ui/dashboard-icon";

export function StatsSection() {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {DASHBOARD_STATISTICS.map((statistic) => (
        <div key={statistic.id} className="flex items-center gap-4 rounded-3xl border border-[#ece9f1] bg-white p-5 shadow-[0_12px_35px_rgba(37,27,57,.035)]">
          <span className="grid size-12 place-items-center rounded-2xl bg-[#f1edfb] text-[#381c8d]"><DashboardIcon icon={statistic.icon} width="24" /></span>
          <div><p className="text-2xl font-bold tracking-[-0.04em]">{statistic.value}</p><p className="text-xs font-medium text-[#8c8592]">{statistic.label}</p></div>
        </div>
      ))}
    </section>
  );
}
