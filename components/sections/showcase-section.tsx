"use client";

import { SHOWCASE_THEMES } from "@/content/dashboard";
import { SampleCarousel } from "@/components/showcase/sample-carousel";
import { useLanguage } from "@/components/providers/language-provider";

export function ShowcaseSection() {
  const { t } = useLanguage();
  return (
    <section id="showcase" className="overflow-hidden rounded-[24px] border border-[#ece9f1] bg-white p-4 shadow-[0_18px_50px_rgba(37,27,57,.05)] sm:rounded-[32px] sm:p-8 lg:p-10">
      <div className="mb-7">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#381c8d]">{t("UI Showcase")}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-[-0.045em] sm:text-4xl">{t("Compare each direction")}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#807985]"> {t("Compare both visual themes Choose a theme, then use Previous or Next to see the samples, or select from the tab.")}</p>
        </div>
      </div>

      <SampleCarousel themes={SHOWCASE_THEMES} />
    </section>
  );
}
