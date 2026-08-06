"use client";

import Image from "next/image";
import Link from "next/link";
import LightGallery from "lightgallery/react";
import { DASHBOARD_ICONS } from "@/content/dashboard";
import { DashboardIcon } from "@/components/ui/dashboard-icon";
import { useLanguage } from "@/components/providers/language-provider";
import { PAYSO_LIGHTGALLERY_PLUGINS_NO_THUMBNAIL } from "@/components/showcase/lightgallery-config";

const WIREFRAMES = [
  {
    step: "01",
    title: "Homepage structure",
    image: "/assets/wireframes/homepage-structure.png",
    width: 838,
    height: 1616,
    alt: "wireframe of the remittance homepage",
  },
  {
    step: "02",
    title: "Work-country selection",
    image: "/assets/wireframes/work-country-selection.png",
    width: 816,
    height: 1602,
    alt: "wireframe showing the work-country selection",
  },
  {
    step: "03",
    title: "Top navigation on scroll",
    image: "/assets/wireframes/localized-wallet.png",
    width: 800,
    height: 1564,
    alt: "wireframe of top navigation on scroll",
  },
] as const;

export function WireframesPage() {
  const { t } = useLanguage();
  return (
    <div className="wireframes-page space-y-4 sm:space-y-8 lg:space-y-10">
      <section className="wireframes-hero ui-surface relative isolate overflow-hidden rounded-[26px] sm:rounded-[36px]">
        <div className="relative px-5 py-11 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div className="wireframes-hero-grid absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-2xl bg-[#f1edfb] px-3 py-2 text-[10px] font-bold uppercase leading-snug tracking-[0.08em] text-[#381c8d] sm:rounded-full sm:text-[11px] sm:tracking-[0.14em]">
              <span className="shrink-0"><DashboardIcon icon={DASHBOARD_ICONS.wireframesNavigation} width="16" /></span>
              {t("Created by Product Manager Ms. Yolanda")}
            </span>
            <h2 className="mt-6 text-[2.45rem] font-bold leading-[.95] tracking-[-0.06em] text-[#1d1822] sm:mt-7 sm:text-6xl lg:text-7xl">
              <span className="block">{t("Interface Foundations")}</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[#77717f] sm:mt-7 sm:text-lg">
              {t("Early homepage and work-country flow before visual styling.")}
            </p>
            <div className="mx-auto mt-8 grid max-w-md grid-cols-1 gap-3 sm:mt-10 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center">
              <Link
                href="/prototype"
                className="ui-button inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#381c8d] px-5 text-sm font-bold text-white shadow-[0_14px_32px_rgba(56,28,141,.24)] sm:w-auto sm:px-6"
              >
                {t("View updated prototype")}
                <DashboardIcon icon={DASHBOARD_ICONS.ctaArrow} width="18" />
              </Link>
            </div>
          </div>
        </div>

        <div id="wireframe-flow" className="relative scroll-mt-24 p-5 sm:p-9 lg:p-12" aria-labelledby="wireframe-flow-title">
          <h3 id="wireframe-flow-title" className="sr-only">{t("Wireframe flow")}</h3>
          <LightGallery
            elementClassNames="grid gap-8 sm:gap-10 xl:grid-cols-3 xl:gap-6"
            selector=".wireframe-gallery-item"
            plugins={PAYSO_LIGHTGALLERY_PLUGINS_NO_THUMBNAIL}
            speed={350}
            download
            counter
            zoomFromOrigin={false}
            flipHorizontal={false}
            flipVertical={false}
            allowMediaOverlap={false}
            mobileSettings={{ controls: true, showCloseIcon: true, download: true }}
            addClass="payso-lightgallery"
          >
            {WIREFRAMES.map((wireframe) => (
              <article key={wireframe.step} className="group min-w-0">
                <div className="mb-4 flex items-center gap-3 px-1">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#381c8d] text-[11px] font-bold text-white shadow-[0_7px_18px_rgba(56,28,141,.18)]">
                    {wireframe.step}
                  </span>
                  <h4 className="text-lg font-bold tracking-[-.03em] text-[#2b2730]">{t(wireframe.title)}</h4>
                </div>

                <a
                  href={wireframe.image}
                  className="wireframe-gallery-item group/image mx-auto block w-full max-w-[330px] cursor-zoom-in rounded-[24px] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#381c8d] sm:rounded-[28px]"
                  data-src={wireframe.image}
                  data-lg-size={`${wireframe.width}-${wireframe.height}`}
                  aria-label={`${t("View larger")}: ${t(wireframe.title)}`}
                >
                  <span className="wireframe-image-stage relative block w-full overflow-hidden rounded-[24px] bg-[#f4f1fa] p-4 transition duration-300 group-hover/image:bg-[#f1edfb] sm:rounded-[28px] sm:p-5">
                    <span className="relative mx-auto block aspect-[0.519] w-full max-w-[23rem]">
                      <Image
                        src={wireframe.image}
                        alt={t(wireframe.alt)}
                        fill
                        sizes="(min-width: 1280px) 24vw, (min-width: 640px) 52vw, 92vw"
                        className="object-contain transition duration-300 group-hover/image:scale-[1.012]"
                      />
                    </span>
                    <span className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#17131f]/85 px-3 py-2 text-[11px] font-bold text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover/image:opacity-100 group-focus-visible/image:opacity-100">
                      {t("View larger")}
                    </span>
                  </span>
                </a>
              </article>
            ))}
          </LightGallery>
        </div>
      </section>

      <section className="revision-cta relative overflow-hidden rounded-[26px] bg-[#25105f] p-6 text-white shadow-[0_24px_64px_rgba(37,16,95,.24)] sm:rounded-[36px] sm:p-10 lg:p-12">
        <div className="revision-cta-grid" aria-hidden="true" />
        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#cabcf1]">{t("Ready to explore")}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-.05em] sm:text-5xl">{t("See how these wireframes became the final design.")}</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/68 sm:text-base sm:leading-7">
              {t("Open the interactive homepage to see how these early flows evolved into the current design.")}
            </p>
          </div>
          <Link
            href="/prototype"
            className="ui-button inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-bold text-[#381c8d] shadow-[0_14px_30px_rgba(0,0,0,.2)] sm:w-auto"
          >
            {t("Launch updated prototype")}
            <DashboardIcon icon={DASHBOARD_ICONS.ctaArrow} width="18" />
          </Link>
        </div>
      </section>
    </div>
  );
}
