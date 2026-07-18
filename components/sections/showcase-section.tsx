"use client";

import { SHOWCASE_THEMES } from "@/content/dashboard";
import { SampleCarousel } from "@/components/showcase/sample-carousel";
import { useLanguage } from "@/components/providers/language-provider";

export function ShowcaseSection() {
  const { t } = useLanguage();
  return (
    <section id="showcase" className="ui-surface overflow-hidden rounded-[26px] p-5 sm:rounded-[36px] sm:p-9 lg:p-12">
      <div className="mb-9 sm:mb-12">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#381c8d]">{t("UI Showcase")}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] sm:text-5xl">{t("Compare each direction")}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#807985] sm:text-base sm:leading-7"> {t("Compare both visual themes Choose a theme, then use Previous or Next to see the samples, or select from the tab.")}</p>
        </div>
      </div>

      <SampleCarousel themes={SHOWCASE_THEMES} />
    </section>
  );
}
