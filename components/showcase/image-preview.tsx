"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import {
  type PointerEvent as ReactPointerEvent,
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
import type { ShowcaseSample } from "@/types/dashboard";

interface ImagePreviewProps {
  readonly src: string;
  readonly alt: string;
  readonly children: ReactNode;
  readonly samples?: readonly ShowcaseSample[];
}

interface PanPosition {
  readonly x: number;
  readonly y: number;
}

interface DragState extends PanPosition {
  readonly pointerId: number;
  readonly pointerX: number;
  readonly pointerY: number;
}

const FIT_ZOOM = 1;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.25;
const FITTED_POSITION: PanPosition = { x: 0, y: 0 };

function duration(value: number) {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : value;
}

function getImageIndex(samples: readonly ShowcaseSample[], src: string) {
  const index = samples.findIndex((sample) => sample.image === src);
  return index >= 0 ? index : 0;
}

export function ImagePreview({ src, alt, children, samples = SHOWCASE_SAMPLES }: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(() => getImageIndex(samples, src));
  const [zoom, setZoom] = useState(FIT_ZOOM);
  const [pan, setPan] = useState<PanPosition>(FITTED_POSITION);
  const [isDragging, setIsDragging] = useState(false);
  const isClosingRef = useRef(false);
  const isChangingImageRef = useRef(false);
  const imageDirectionRef = useRef(0);
  const dragRef = useRef<DragState | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const currentImage = samples[currentIndex];
  const isFirstImage = currentIndex === 0;
  const isLastImage = currentIndex === samples.length - 1;

  const clampPan = useCallback((position: PanPosition, targetZoom: number) => {
    const viewport = viewportRef.current;
    const image = imageRef.current;

    if (!viewport || !image || targetZoom <= FIT_ZOOM) return FITTED_POSITION;

    const maxX = Math.max(0, (image.offsetWidth * targetZoom - viewport.clientWidth) / 2);
    const maxY = Math.max(0, (image.offsetHeight * targetZoom - viewport.clientHeight) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, position.x)),
      y: Math.min(maxY, Math.max(-maxY, position.y)),
    };
  }, []);

  const resetView = useCallback(() => {
    dragRef.current = null;
    setIsDragging(false);
    setPan(FITTED_POSITION);
    setZoom(FIT_ZOOM);
  }, []);

  const openPreview = () => {
    setCurrentIndex(getImageIndex(samples, src));
    resetView();
    setIsOpen(true);
  };

  const closePreview = useCallback(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;

    if (!overlay || !panel || isClosingRef.current) return;

    isClosingRef.current = true;
    gsap.killTweensOf([overlay, panel]);
    gsap.timeline({
      onComplete: () => {
        setIsOpen(false);
        resetView();
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
  }, [resetView]);

  const showImage = useCallback((nextIndex: number, direction: number) => {
    const panel = panelRef.current;

    if (!panel || isChangingImageRef.current || nextIndex < 0 || nextIndex >= samples.length) return;

    isChangingImageRef.current = true;
    gsap.killTweensOf(panel);
    gsap.to(panel, {
      autoAlpha: 0,
      x: direction * -28,
      duration: duration(0.18),
      ease: "power2.in",
      onComplete: () => {
        imageDirectionRef.current = direction;
        resetView();
        setCurrentIndex(nextIndex);
      },
    });
  }, [resetView, samples.length]);

  const updateZoom = useCallback((nextZoom: number) => {
    const boundedZoom = Math.min(MAX_ZOOM, Math.max(FIT_ZOOM, nextZoom));

    if (boundedZoom === FIT_ZOOM) {
      dragRef.current = null;
      setIsDragging(false);
    }

    setZoom(boundedZoom);
    setPan((currentPan) => clampPan(currentPan, boundedZoom));
  }, [clampPan]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (zoom <= FIT_ZOOM || dragRef.current || (event.pointerType === "mouse" && event.button !== 0)) return;

    dragRef.current = {
      pointerId: event.pointerId,
      pointerX: event.clientX,
      pointerY: event.clientY,
      x: pan.x,
      y: pan.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    event.preventDefault();
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    setPan(clampPan({
      x: drag.x + event.clientX - drag.pointerX,
      y: drag.y + event.clientY - drag.pointerY,
    }, zoom));
    event.preventDefault();
  };

  const stopDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;

    dragRef.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  useEffect(() => {
    if (!isOpen || imageDirectionRef.current === 0 || !panelRef.current) return;

    const direction = imageDirectionRef.current;
    imageDirectionRef.current = 0;
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

  useEffect(() => {
    if (!isOpen) return;

    const keepPanInBounds = () => {
      setPan((currentPan) => clampPan(currentPan, zoom));
    };

    window.addEventListener("resize", keepPanInBounds);
    return () => window.removeEventListener("resize", keepPanInBounds);
  }, [clampPan, isOpen, zoom]);

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
      if (event.key === "ArrowRight" && currentIndex < samples.length - 1) showImage(currentIndex + 1, 1);
    };

    document.addEventListener("keydown", handleArrowKeys);
    return () => document.removeEventListener("keydown", handleArrowKeys);
  }, [currentIndex, isOpen, samples.length, showImage]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="group relative mx-auto flex w-full max-w-[330px] cursor-zoom-in justify-center rounded-[52px] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#381c8d]"
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
          className="image-preview-dialog fixed inset-0 z-[100] grid grid-rows-[2.75rem_minmax(0,1fr)_auto] gap-3 bg-[#130d1d]/82 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-md sm:gap-4 sm:px-6 sm:py-6"
        >
          <button type="button" className="absolute inset-0 cursor-zoom-out" onClick={closePreview} aria-label="Close image preview" tabIndex={-1} />

          <button
            ref={closeButtonRef}
            type="button"
            className="image-preview-close relative z-20 grid size-11 place-items-center justify-self-end rounded-2xl bg-white text-[#381c8d] shadow-[0_10px_30px_rgba(0,0,0,.25)] transition hover:bg-[#f1edfb]"
            onClick={closePreview}
            aria-label="Close image preview"
          >
            <DashboardIcon icon={DASHBOARD_ICONS.closeMenu} width="24" />
          </button>

          <div className="image-preview-stage relative z-10 flex min-h-0 min-w-0 items-center justify-center overflow-hidden">
            <div
              ref={panelRef}
              className="relative flex max-h-full max-w-full select-none items-center justify-center overflow-hidden overscroll-contain bg-transparent p-0 shadow-none"
            >
              <div
                ref={viewportRef}
                className={`relative aspect-[750/1624] w-[min(100cqw,46.18cqh)] overflow-hidden rounded-none ${zoom > FIT_ZOOM ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""}`}
                style={{ touchAction: zoom > FIT_ZOOM ? "none" : "auto" }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={stopDragging}
                onPointerCancel={stopDragging}
                onLostPointerCapture={() => {
                  dragRef.current = null;
                  setIsDragging(false);
                }}
              >
                <Image
                  ref={imageRef}
                  src={currentImage.image}
                  alt={currentImage.title}
                  width={750}
                  height={1624}
                  draggable={false}
                  className={`pointer-events-none h-full w-full rounded-none object-contain ${isDragging ? "" : "transition-transform duration-300 ease-out"}`}
                  style={{
                    transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                    transformOrigin: "center center",
                    willChange: zoom > FIT_ZOOM ? "transform" : undefined,
                  }}
                  onLoad={() => setPan((currentPan) => clampPan(currentPan, zoom))}
                />
                {zoom > FIT_ZOOM && (
                  <span className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#17131f]/80 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg backdrop-blur-sm" aria-hidden="true">
                    {isDragging ? "Moving image" : "Drag to move"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="relative z-20 mx-auto flex w-full max-w-[calc(100vw-1.5rem)] items-center justify-between gap-0.5 rounded-2xl bg-white p-1 shadow-[0_14px_40px_rgba(0,0,0,.28)] sm:w-auto sm:justify-start sm:gap-2 sm:p-1.5">
            <button type="button" className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-xl px-2 text-sm font-bold text-[#4f4856] transition hover:bg-[#f1edfb] disabled:cursor-not-allowed disabled:opacity-35 sm:px-3" onClick={() => showImage(currentIndex - 1, -1)} disabled={isFirstImage} aria-label="Previous image">
              <DashboardIcon icon={DASHBOARD_ICONS.previousSample} width="19" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            <span className="h-6 w-px shrink-0 bg-[#e4dfe9]" aria-hidden="true" />
            <button type="button" className="grid size-11 shrink-0 place-items-center rounded-xl text-[#381c8d] transition hover:bg-[#f1edfb] disabled:cursor-not-allowed disabled:opacity-35" onClick={() => updateZoom(zoom - ZOOM_STEP)} disabled={zoom <= FIT_ZOOM} aria-label="Zoom out">
              <DashboardIcon icon={DASHBOARD_ICONS.zoomOut} width="20" />
            </button>
            <button type="button" className="h-11 min-w-11 shrink-0 rounded-lg px-1 text-center text-xs font-bold text-[#5a5261] transition hover:bg-[#f1edfb] disabled:cursor-default sm:min-w-12" onClick={() => updateZoom(FIT_ZOOM)} disabled={zoom <= FIT_ZOOM} aria-label={zoom <= FIT_ZOOM ? "Image fitted to view" : "Reset image to fit"}>
              <span aria-live="polite">{zoom <= FIT_ZOOM ? "Fit" : `${Math.round(zoom * 100)}%`}</span>
            </button>
            <button type="button" className="grid size-11 shrink-0 place-items-center rounded-xl text-[#381c8d] transition hover:bg-[#f1edfb] disabled:cursor-not-allowed disabled:opacity-35" onClick={() => updateZoom(zoom + ZOOM_STEP)} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in">
              <DashboardIcon icon={DASHBOARD_ICONS.zoomIn} width="20" />
            </button>
            <span className="h-6 w-px shrink-0 bg-[#e4dfe9]" aria-hidden="true" />
            <button type="button" className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#381c8d] px-2 text-sm font-bold text-white transition hover:bg-[#4b27a7] disabled:cursor-not-allowed disabled:opacity-35 sm:px-3" onClick={() => showImage(currentIndex + 1, 1)} disabled={isLastImage} aria-label="Next image">
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
