"use client";

import Image from "next/image";
import LightGallery from "lightgallery/react";
import oldUiReview from "@/assets/revisionsold-ui-review-enhanced.png";
import { DASHBOARD_ICONS } from "@/content/dashboard";
import { PhoneMockup } from "@/components/showcase/phone-mockup";
import { DashboardIcon } from "@/components/ui/dashboard-icon";
import { useLanguage } from "@/components/providers/language-provider";
import { PAYSO_LIGHTGALLERY_PLUGINS_NO_THUMBNAIL } from "@/components/showcase/lightgallery-config";

export function RevisionOverview() {
  const { t } = useLanguage();
  return (
    <div id="refinement-comparison" aria-label={t("Old and updated homepage comparison")} className="refinement-comparison scroll-mt-24 p-5 sm:p-9 lg:p-12">
      <LightGallery
        elementClassNames="mx-auto w-full max-w-[52rem]"
        selector=".revision-gallery-item"
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
        <figure className="min-w-0">
          <figcaption className="mb-6 flex items-center justify-between gap-4 rounded-[20px] border border-[#e5e1e8] bg-[#f6f4f7] px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-xs font-bold text-[#6f6874] shadow-[0_5px_16px_rgba(37,27,57,.07)] sm:size-12 sm:rounded-2xl">
                01
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#8a838e]">{t("Before refinement")}</p>
                <h3 className="mt-1 text-xl font-bold tracking-[-.035em] text-[#29242d] sm:text-2xl">{t("Old UI")}</h3>
              </div>
            </div>
            <span className="hidden rounded-full border border-[#e1dce5] bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#756e7a] sm:inline-flex">
              {t("Original review")}
            </span>
          </figcaption>
          <a
            href={oldUiReview.src}
            className="revision-gallery-item group/image relative block cursor-zoom-in overflow-hidden rounded-[22px] bg-[#d5d5d5] shadow-[0_16px_42px_rgba(37,27,57,.12)] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#381c8d] sm:rounded-[24px]"
            data-src={oldUiReview.src}
            data-lg-size={`${oldUiReview.width}-${oldUiReview.height}`}
            aria-label={`${t("View larger")}: ${t("Old UI")}`}
          >
            <Image
              src={oldUiReview}
              alt={t("Annotated review of the old Payso homepage UI")}
              sizes="(min-width: 1024px) 52rem, 92vw"
              className="h-auto w-full transition duration-300 group-hover/image:scale-[1.012]"
              priority
            />
            <span
              className="pointer-events-none absolute left-[31%] top-[11.5%] z-10 w-[13.85%] border-t border-dashed border-[#8f8c91]"
              aria-hidden="true"
            />
            <span className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#17131f]/85 px-3 py-2 text-[11px] font-bold text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover/image:opacity-100 group-focus-visible/image:opacity-100">
              {t("View larger")}
            </span>
          </a>
        </figure>

        <div className="relative my-8 flex items-center justify-center sm:my-10" aria-hidden="true">
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#cad9f7] to-transparent" />
          <span className="relative grid size-11 place-items-center rounded-full border border-[#d5e1ff] bg-white text-[#2853bb] shadow-[0_8px_24px_rgba(40,83,187,.12)] sm:size-12">
            <span className="rotate-90">
              <DashboardIcon icon={DASHBOARD_ICONS.ctaArrow} width="18" />
            </span>
          </span>
        </div>

        <figure className="min-w-0">
          <figcaption className="mb-6 flex items-center justify-between gap-4 rounded-[20px] border border-[#dce7fb] bg-[linear-gradient(135deg,#ffffff_0%,#f6f9fe_100%)] px-4 py-4 shadow-[0_10px_30px_rgba(40,83,187,.06)] sm:px-6 sm:py-5">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#2853bb] text-xs font-bold text-white shadow-[0_8px_20px_rgba(40,83,187,.22)] sm:size-12 sm:rounded-2xl">
                02
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#2853bb]">{t("After refinement")}</p>
                <h3 className="mt-1 text-xl font-bold tracking-[-.035em] text-[#424242] sm:text-2xl">{t("Updated prototype")}</h3>
              </div>
            </div>
            <span className="hidden rounded-full border border-[#d5e1ff] bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#2853bb] shadow-[0_4px_14px_rgba(40,83,187,.06)] sm:inline-flex">
              {t("Current design")}
            </span>
          </figcaption>
          <p className="mb-6 text-left text-sm leading-6 text-[#77717f] sm:text-center sm:text-base sm:leading-7">
            {t("This remittance app is continuously being improved, revised, and refined to enhance its UI and overall user experience. More updates are coming soon.")}
          </p>
          <div className="revision-phone-stage flex min-w-0 items-center justify-center overflow-hidden py-6 sm:py-10">
            <a
              href="/assets/prototype-reference.png"
              className="revision-gallery-item group/image relative z-10 flex w-full cursor-zoom-in justify-center focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#381c8d]"
              data-src="/assets/prototype-reference.png"
              data-lg-size="750-1624"
              aria-label={`${t("View larger")}: ${t("Updated prototype")}`}
            >
              <PhoneMockup
                src="/assets/prototype-reference.png"
                alt={t("Updated Payso homepage prototype")}
                className="revision-phone-shell"
                preview={false}
              />
              <span className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#17131f]/85 px-3 py-2 text-[11px] font-bold text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover/image:opacity-100 group-focus-visible/image:opacity-100">
                {t("View larger")}
              </span>
            </a>
          </div>
        </figure>
      </LightGallery>
    </div>
  );
}
