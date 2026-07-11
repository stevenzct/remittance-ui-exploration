import Image from "next/image";
import { DASHBOARD_ICONS, THEME_COLORS } from "@/content/dashboard";
import { DashboardIcon } from "@/components/ui/dashboard-icon";

export function BrandSection() {
  return (
    <section id="brand" className="grid gap-7 lg:grid-cols-[.8fr_1.2fr]">
      <div className="rounded-[32px] border border-[#ece9f1] bg-white p-7 shadow-[0_18px_50px_rgba(37,27,57,.05)] sm:p-9">
        <span className="grid size-12 place-items-center rounded-2xl bg-[#f1edfb] text-[#381c8d]"><DashboardIcon icon={DASHBOARD_ICONS.palette} width="25" /></span>
        <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.16em] text-[#381c8d]">Brand system</p>
        <h2 className="mt-2 text-4xl font-bold tracking-[-0.05em]">Trust with energy.</h2>
        <p className="mt-4 text-sm leading-6 text-[#7b7580]">Blue Gem leads the interface while Brick Red remains a focused accent for moments that need emphasis.</p>
        <div className="mt-8 space-y-3">
          {THEME_COLORS.map((color) => (
            <div key={color.hex} className="flex items-center gap-4 rounded-2xl border border-[#ece9f1] p-3"><span className="size-12 rounded-xl" style={{ background: color.value }} /><div><p className="text-sm font-bold">{color.name}</p><p className="text-xs text-[#918a96]">{color.hex}</p></div></div>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-[32px] border border-[#ece9f1] bg-white p-4 shadow-[0_18px_50px_rgba(37,27,57,.05)] sm:p-6">
        <Image src="/assets/brand-colors.png" alt="Payso brand color reference" width={1600} height={1000} className="h-full min-h-[360px] w-full rounded-[24px] object-cover" />
      </div>
    </section>
  );
}
