"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { DASHBOARD_ICONS, SHOWCASE_SAMPLES } from "@/content/dashboard";
import { DashboardIcon } from "@/components/ui/dashboard-icon";

interface ImagePreviewProps {
  readonly src: string;
  readonly alt: string;
  readonly children: ReactNode;
}

function duration(value: number) {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : value;
}

function getImageIndex(src: string) {
  const index = SHOWCASE_SAMPLES.findIndex((sample) => sample.image === src);
  return index >= 0 ? index : 0;
}

export function ImagePreview({ src, alt, children }: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(() => getImageIndex(src));
  const [zoom, setZoom] = useState(1);
  const isClosingRef = useRef(false);
  const isChangingImageRef = useRef(false);
  const imageDirectionRef = useRef(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const currentImage = SHOWCASE_SAMPLES[currentIndex];
  const isFirstImage = currentIndex === 0;
  const isLastImage = currentIndex === SHOWCASE_SAMPLES.length - 1;

  const openPreview = () => {
    setCurrentIndex(getImageIndex(src));
    setZoom(1);
    setIsOpen(true);
  };

  const closePreview = useCallback(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;

    if (!overlay || !panel || isClosingRef.current) return;

    isClosingRef.current = true;
    gsap.killTweensOf([overlay, panel, imageRef.current]);
    gsap.timeline({
      onComplete: () => {
        setIsOpen(false);
        setZoom(1);
        isClosingRef.current = false;
        triggerRef.current?.focus();
      },
    })
      .to(panel, {
        autoAlpha: 0,
        y: 28,
        scale: 0.96,
        duration: duration(0.24),
        ease: "power2.in",
      }, 0)
      .to(overlay, {
        autoAlpha: 0,
        duration: duration(0.28),
        ease: "power2.inOut",
      }, 0);
  }, []);

  const showImage = useCallback((nextIndex: number, direction: number) => {
    const panel = panelRef.current;

    if (!panel || isChangingImageRef.current || nextIndex < 0 || nextIndex >= SHOWCASE_SAMPLES.length) return;

    isChangingImageRef.current = true;
    gsap.killTweensOf(panel);
    gsap.to(panel, {
      autoAlpha: 0,
      x: direction * -28,
      duration: duration(0.18),
      ease: "power2.in",
      onComplete: () => {
        imageDirectionRef.current = direction;
        setZoom(1);
        setCurrentIndex(nextIndex);
      },
    });
  }, []);

  const updateZoom = (nextZoom: number) => {
    const boundedZoom = Math.min(2.5, Math.max(1, nextZoom));
    setZoom(boundedZoom);
    gsap.to(imageRef.current, {
      scale: boundedZoom,
      duration: duration(0.3),
      ease: "power2.out",
      transformOrigin: "center center",
    });
  };

  useEffect(() => {
    if (!isOpen || imageDirectionRef.current === 0 || !panelRef.current) return;

    const direction = imageDirectionRef.current;
    imageDirectionRef.current = 0;
    gsap.set(imageRef.current, { scale: 1 });
    gsap.fromTo(panelRef.current, {
      autoAlpha: 0,
      x: direction * 28,
    }, {
      autoAlpha: 1,
      x: 0,
      duration: duration(0.28),
      ease: "power3.out",
      onComplete: () => {
        isChangingImageRef.current = false;
      },
    });
  }, [currentIndex, isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePreview();
    };

    document.addEventListener("keydown", handleKeyDown);

    const context = gsap.context(() => {
      gsap.timeline({ onComplete: () => closeButtonRef.current?.focus() })
        .fromTo(overlay, {
          autoAlpha: 0,
        }, {
          autoAlpha: 1,
          duration: duration(0.3),
          ease: "power2.out",
        }, 0)
        .fromTo(panel, {
          autoAlpha: 0,
          y: 36,
          scale: 0.94,
        }, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: duration(0.46),
          ease: "power3.out",
        }, 0.04);
    }, overlay);

    return () => {
      context.revert();
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closePreview, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleArrowKeys = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && currentIndex > 0) showImage(currentIndex - 1, -1);
      if (event.key === "ArrowRight" && currentIndex < SHOWCASE_SAMPLES.length - 1) showImage(currentIndex + 1, 1);
    };

    document.addEventListener("keydown", handleArrowKeys);
    return () => document.removeEventListener("keydown", handleArrowKeys);
  }, [currentIndex, isOpen, showImage]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="group relative block w-full max-w-[330px] cursor-zoom-in rounded-[52px] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#381c8d]"
        onClick={openPreview}
        aria-label={`Open ${alt} image preview`}
        aria-haspopup="dialog"
      >
        {children}
        <span className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-[#17131f]/85 px-3 py-2 text-[11px] font-bold text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          View larger
        </span>
      </button>

      {isOpen && createPortal(
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#130d1d]/82 p-4 pb-20 backdrop-blur-md sm:p-8 sm:pb-24"
        >
          <button type="button" className="absolute inset-0 cursor-zoom-out" onClick={closePreview} aria-label="Close image preview" tabIndex={-1} />

          <button
            ref={closeButtonRef}
            type="button"
            className="absolute right-4 top-4 z-20 grid size-11 place-items-center rounded-2xl bg-white text-[#381c8d] shadow-[0_10px_30px_rgba(0,0,0,.25)] transition hover:bg-[#f1edfb] sm:right-7 sm:top-7"
            onClick={closePreview}
            aria-label="Close image preview"
          >
            <DashboardIcon icon={DASHBOARD_ICONS.closeMenu} width="24" />
          </button>

          <div ref={panelRef} className="relative z-10 flex max-h-[80vh] max-w-[min(88vw,760px)] items-center justify-center overflow-hidden rounded-[26px] bg-white p-3 shadow-[0_30px_100px_rgba(0,0,0,.38)] sm:p-4">
            <Image ref={imageRef} src={currentImage.image} alt={currentImage.title} width={750} height={1624} className="max-h-[74vh] w-auto max-w-full rounded-[16px] object-contain" />
          </div>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-2xl bg-white p-1.5 shadow-[0_14px_40px_rgba(0,0,0,.28)] sm:bottom-7 sm:gap-2">
            <button type="button" className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-bold text-[#4f4856] transition hover:bg-[#f1edfb] disabled:cursor-not-allowed disabled:opacity-35" onClick={() => showImage(currentIndex - 1, -1)} disabled={isFirstImage} aria-label="Previous image">
              <DashboardIcon icon={DASHBOARD_ICONS.previousSample} width="19" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            <span className="h-6 w-px bg-[#e4dfe9]" aria-hidden="true" />
            <button type="button" className="grid size-10 place-items-center rounded-xl text-[#381c8d] transition hover:bg-[#f1edfb] disabled:cursor-not-allowed disabled:opacity-35" onClick={() => updateZoom(zoom - 0.25)} disabled={zoom <= 1} aria-label="Zoom out">
              <DashboardIcon icon={DASHBOARD_ICONS.zoomOut} width="20" />
            </button>
            <output className="min-w-12 text-center text-xs font-bold text-[#5a5261]" aria-live="polite">{Math.round(zoom * 100)}%</output>
            <button type="button" className="grid size-10 place-items-center rounded-xl text-[#381c8d] transition hover:bg-[#f1edfb] disabled:cursor-not-allowed disabled:opacity-35" onClick={() => updateZoom(zoom + 0.25)} disabled={zoom >= 2.5} aria-label="Zoom in">
              <DashboardIcon icon={DASHBOARD_ICONS.zoomIn} width="20" />
            </button>
            <span className="h-6 w-px bg-[#e4dfe9]" aria-hidden="true" />
            <button type="button" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#381c8d] px-3 text-sm font-bold text-white transition hover:bg-[#4b27a7] disabled:cursor-not-allowed disabled:opacity-35" onClick={() => showImage(currentIndex + 1, 1)} disabled={isLastImage} aria-label="Next image">
              <span className="hidden sm:inline">Next</span>
              <DashboardIcon icon={DASHBOARD_ICONS.ctaArrow} width="19" />
            </button>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
