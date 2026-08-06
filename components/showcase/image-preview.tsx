"use client";

import { type ReactNode, useMemo, useRef } from "react";
import LightGallery from "lightgallery/react";
import type { LightGallery as LightGalleryCore } from "lightgallery/lightgallery";
import { SHOWCASE_SAMPLES } from "@/content/dashboard";
import { useLanguage } from "@/components/providers/language-provider";
import { PAYSO_LIGHTGALLERY_PLUGINS } from "@/components/showcase/lightgallery-config";
import type { ShowcaseSample } from "@/types/dashboard";

interface ImagePreviewProps {
  readonly src: string;
  readonly alt: string;
  readonly children: ReactNode;
  readonly samples?: readonly ShowcaseSample[];
}

function getImageIndex(samples: readonly ShowcaseSample[], src: string) {
  const index = samples.findIndex((sample) => sample.image === src);
  return index >= 0 ? index : 0;
}

export function ImagePreview({ src, alt, children, samples = SHOWCASE_SAMPLES }: ImagePreviewProps) {
  const { t } = useLanguage();
  const galleryRef = useRef<LightGalleryCore | null>(null);
  const galleryItems = useMemo(() => samples.map((sample) => ({
    src: sample.image,
    thumb: sample.image,
    alt: t(sample.title),
  })), [samples, t]);

  return (
    <>
      <button
        type="button"
        className="group relative mx-auto flex w-full max-w-[330px] cursor-zoom-in justify-center rounded-[52px] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#381c8d]"
        onClick={() => galleryRef.current?.openGallery(getImageIndex(samples, src))}
        aria-label={`${t("Open image preview")}: ${alt}`}
        aria-haspopup="dialog"
      >
        {children}
        <span className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-[#17131f]/85 px-3 py-2 text-[11px] font-bold text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          {t("View larger")}
        </span>
      </button>

      <LightGallery
        dynamic
        dynamicEl={galleryItems}
        plugins={PAYSO_LIGHTGALLERY_PLUGINS}
        speed={350}
        download
        counter
        zoomFromOrigin={false}
        allowMediaOverlap={false}
        thumbWidth={72}
        thumbHeight="108px"
        thumbMargin={8}
        flipHorizontal={false}
        flipVertical={false}
        mobileSettings={{ controls: true, showCloseIcon: true, download: true }}
        addClass="payso-lightgallery"
        onInit={({ instance }) => {
          galleryRef.current = instance;
        }}
      />
    </>
  );
}
