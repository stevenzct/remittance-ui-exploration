import Image from "next/image";
import { DASHBOARD_ICONS, THEME_COLORS } from "@/content/dashboard";
import { DashboardIcon } from "@/components/ui/dashboard-icon";

export function BrandSection() {
  return (
    <section id="brand" className="grid gap-7 xl:grid-cols-[.8fr_1.2fr]">
      <div className="rounded-3xl border border-[#ece9f1] bg-white p-5 shadow-[0_18px_50px_rgba(37,27,57,.05)] sm:rounded-4xl sm:p-9">
        <span className="grid size-12 place-items-center rounded-2xl bg-[#f1edfb] text-[#381c8d]"><DashboardIcon icon={DASHBOARD_ICONS.palette} width="25" /></span>
        <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.16em] text-[#381c8d]">Brand system</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tighter sm:text-4xl">Trust with energy.</h2>
        <p className="mt-4 text-sm leading-6 text-[#7b7580]">Blue Gem leads the interface while Brick Red remains a focused accent for moments that need emphasis.</p>
        <div className="mt-8 space-y-3">
          {THEME_COLORS.map((color) => (
            <div key={color.hex} className="flex items-center gap-4 rounded-2xl border border-[#ece9f1] p-3"><span className="size-12 shrink-0 rounded-xl" style={{ background: color.value }} /><div className="min-w-0"><p className="text-sm font-bold">{color.name}</p><p className="text-xs text-[#918a96]">{color.hex}</p></div></div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="overflow-hidden rounded-3xl border border-[#ece9f1] bg-white p-3 shadow-[0_18px_50px_rgba(37,27,57,.05)] sm:rounded-4xl sm:p-6">
          <Image src="/assets/brand-colors.png" alt="Payso brand color reference" width={1600} height={1000} className="h-auto w-full rounded-[18px] object-contain sm:rounded-3xl" />
        </div>
        <div className="rounded-3xl border border-[#ece9f1] bg-white p-3 shadow-[0_18px_50px_rgba(37,27,57,.05)] sm:rounded-4xl sm:p-6">
          <div className="mx-auto max-w-60 overflow-hidden rounded-[18px] shadow-[0_14px_30px_rgba(37,27,57,.14)] sm:max-w-80 sm:rounded-3xl">
            <Image src="/assets/ph-flag.png" alt="Philippine flag inspiration for Theme 03" width={980} height={552} className="h-32 w-full object-cover sm:h-40" />
          </div>
          <p className="mt-3 text-center text-xs leading-5 text-[#918a96]">Theme 03 comes from this Philippine flag inspiration, which guides the blue theme color and the flag card.</p>
        </div>
      </div>
    </section>
  );
}
