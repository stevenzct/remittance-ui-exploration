"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { DASHBOARD_ICONS } from "@/content/dashboard";
import { DashboardIcon } from "@/components/ui/dashboard-icon";

interface RevisionImageProps {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly sourceLabel: string;
  readonly cropAspectRatio?: string;
  readonly objectPosition?: string;
}

export function RevisionImage({
  src,
  alt,
  width,
  height,
  sourceLabel,
  cropAspectRatio,
  objectPosition = "center",
}: RevisionImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const isCompactArtwork = height / width > 0.7;
  const isCroppedPreview = Boolean(cropAspectRatio);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    const close = () => setIsOpen(false);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      requestAnimationFrame(() => trigger?.focus());
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`revision-image-trigger relative flex min-h-44 w-full items-center justify-center overflow-hidden rounded-[24px] border border-[#e8e3ed] bg-[#f4f2f6] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#5b2bd1]/30 sm:min-h-52 lg:min-h-56 ${isCroppedPreview ? "p-3 sm:p-4 lg:p-5" : "p-4 sm:p-5 lg:p-6"}`}
        onClick={() => setIsOpen(true)}
        aria-label={`Open larger image: ${alt}`}
      >
        {isCroppedPreview ? (
          <span
            className="relative block w-full overflow-hidden rounded-[16px] bg-white shadow-[0_12px_30px_rgba(25,23,28,.08)]"
            style={{ aspectRatio: cropAspectRatio }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 50vw, 90vw"
              className="object-cover"
              style={{ objectPosition }}
            />
          </span>
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="h-auto max-h-[22rem] max-w-full object-contain shadow-[0_18px_42px_rgba(37,27,57,.11)]"
            style={{ width: isCompactArtwork ? "min(100%, 22rem)" : "100%" }}
          />
        )}
      </button>

      {isOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${sourceLabel} preview`}
          className="fixed inset-0 z-[120] grid place-items-center bg-[#130d1d]/86 p-4 backdrop-blur-md sm:p-8"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-zoom-out"
            onClick={() => setIsOpen(false)}
            aria-label="Close review image preview"
            tabIndex={-1}
          />
          <div className="relative z-10 flex max-h-[calc(100dvh-2rem)] max-w-[min(1120px,calc(100vw-2rem))] items-center justify-center rounded-[28px] bg-white p-4 shadow-2xl sm:max-h-[calc(100dvh-4rem)] sm:max-w-[min(1120px,calc(100vw-4rem))] sm:p-7">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="max-h-[calc(100dvh-6rem)] h-auto w-auto max-w-full object-contain sm:max-h-[calc(100dvh-9rem)]"
            />
            <button
              ref={closeRef}
              type="button"
              className="ui-button absolute right-3 top-3 grid size-11 min-h-11 place-items-center rounded-2xl border border-[#e8e3ed] bg-white text-[#381c8d] shadow-lg sm:right-4 sm:top-4"
              onClick={() => setIsOpen(false)}
              aria-label="Close review image preview"
            >
              <DashboardIcon icon={DASHBOARD_ICONS.closeMenu} width="23" />
            </button>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
