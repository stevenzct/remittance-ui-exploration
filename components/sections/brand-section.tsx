"use client";

import Image from "next/image";
import { DASHBOARD_ICONS, THEME_COLORS } from "@/content/dashboard";
import { DashboardIcon } from "@/components/ui/dashboard-icon";
import { useLanguage } from "@/components/providers/language-provider";

export function BrandSection() {
  const { t } = useLanguage();
  return (
    <section id="brand" className="grid gap-4 sm:gap-8 xl:grid-cols-[.8fr_1.2fr]">
      <div className="ui-surface rounded-[26px] p-6 sm:rounded-[36px] sm:p-10 lg:p-12">
        <span className="grid size-12 place-items-center rounded-2xl bg-[#f1edfb] text-[#381c8d]"><DashboardIcon icon={DASHBOARD_ICONS.palette} width="25" /></span>
        <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.16em] text-[#381c8d]">{t("Brand System")}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tighter sm:text-4xl">{t("Trust with energy.")}</h2>
        <p className="mt-5 text-sm leading-7 text-[#7b7580] sm:text-base">{t("Blue Gem leads the interface while Brick Red remains a focused accent for moments that need emphasis.")}</p>
        <div className="mt-9 space-y-3">
          {THEME_COLORS.map((color) => (
            <div key={color.hex} className="flex items-center gap-4 rounded-[20px] border border-[#ece9f1] bg-white/70 p-3.5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(37,27,57,.06)]"><span className="size-12 shrink-0 rounded-[14px] shadow-[inset_0_0_0_1px_rgba(255,255,255,.3)]" style={{ background: color.value }} /><div className="min-w-0"><p className="text-sm font-bold">{t(color.name)}</p><p className="mt-0.5 text-xs text-[#918a96]">{color.hex}</p></div></div>
          ))}
        </div>
      </div>
      <div className="space-y-4 sm:space-y-6">
        <div className="ui-surface overflow-hidden rounded-[26px] p-3 sm:rounded-[36px] sm:p-6">
          <Image src="/assets/brand-colors.png" alt={t("Payso brand color reference")} width={1600} height={1000} className="h-auto w-full rounded-[18px] object-contain sm:rounded-3xl" />
        </div>
        <div className="ui-surface rounded-[26px] p-5 sm:rounded-[36px] sm:p-7">
          <div className="mx-auto max-w-60 overflow-hidden rounded-[18px] shadow-[0_14px_30px_rgba(37,27,57,.14)] sm:max-w-80 sm:rounded-3xl">
            <Image src="/assets/ph-flag.png" alt={t("Philippine flag inspiration for Theme 03")} width={980} height={552} className="h-32 w-full object-cover sm:h-40" />
          </div>
          <p className="mt-3 text-center text-xs leading-5 text-[#918a96]">{t("Theme 03 comes from this Philippine flag inspiration, which guides the blue theme color and the flag card.")}</p>
        </div>
      </div>
    </section>
  );
}
