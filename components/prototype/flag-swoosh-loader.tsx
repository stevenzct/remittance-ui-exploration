"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";

interface FlagSwooshLoaderProps {
  readonly selectedCountry: string;
  readonly onComplete: () => void;
  readonly assetSrc: string;
  readonly durationSeconds?: number;
}

export function FlagSwooshLoader({
  selectedCountry,
  onComplete,
  assetSrc,
  durationSeconds = 1.7,
}: FlagSwooshLoaderProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const artworkRef = useRef<HTMLDivElement | null>(null);
  const flashRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const artwork = artworkRef.current;
    const flash = flashRef.current;

    if (!overlay || !artwork || !flash) return;

    let disposed = false;
    let completed = false;
    let finishTimer = 0;

    const finish = () => {
      if (disposed || completed) return;
      completed = true;
      onComplete();
    };

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(overlay, { autoAlpha: 1 });
      gsap.set(artwork, { "--reveal-edge": "130%", scale: 1 });
      gsap.set(flash, { autoAlpha: 0 });
      finishTimer = window.setTimeout(finish, 400);

      return () => {
        disposed = true;
        window.clearTimeout(finishTimer);
        gsap.set([overlay, artwork, flash], { clearProps: "all" });
      };
    }

    gsap.set(artwork, { "--reveal-edge": "-25%", scale: 1.05, willChange: "transform" });
    gsap.set(flash, { autoAlpha: 0, willChange: "opacity" });

    const timeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => {
        gsap.set([artwork, flash], { clearProps: "willChange" });
        finishTimer = window.setTimeout(finish, 140);
      },
    });

    timeline
      // Overlay snaps in — the flag artwork is already behind it, hidden by
      // the mask, so there is no flash of unmasked content.
      .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: .18, ease: "power2.out" }, 0)
      // The reveal sweeps in along the same diagonal as the artwork's own
      // plane trail (bottom-left to top-right), so the wipe reads as a
      // continuation of that motion rather than a generic transition.
      .to(artwork, {
        "--reveal-edge": "125%",
        duration: .82,
        ease: "power2.inOut",
      }, .06)
      .to(artwork, { scale: 1, duration: .9, ease: "power3.out" }, .06)
      // A quick soft flash sells the moment the trail reaches the plane.
      .fromTo(flash, { autoAlpha: 0 }, { autoAlpha: .5, duration: .14, ease: "power1.out" }, .72)
      .to(flash, { autoAlpha: 0, duration: .3, ease: "power2.out" }, .86)
      // Brief hold on the fully-revealed flag, then dissolve to reveal the
      // (already updated) app underneath.
      .to(overlay, { autoAlpha: 0, duration: .2, ease: "power1.in" }, 1.28);

    const naturalEnd = 1.28 + .2;
    const holdDuration = Math.max(0, durationSeconds - naturalEnd);
    if (holdDuration > 0) timeline.to({}, { duration: holdDuration }, naturalEnd);

    return () => {
      disposed = true;
      window.clearTimeout(finishTimer);
      timeline.kill();
      gsap.killTweensOf([overlay, artwork, flash]);
      gsap.set([overlay, artwork, flash], { clearProps: "all" });
    };
  }, [selectedCountry, onComplete, assetSrc, durationSeconds]);

  return (
    <div
      ref={overlayRef}
      className="prototype-work-location-loading prototype-flag-swoosh-loading"
      role="status"
      aria-live="assertive"
      aria-label={`Loading ${selectedCountry}`}
    >
      <div ref={artworkRef} className="prototype-flag-swoosh-artwork">
        <Image src={assetSrc} alt="" fill sizes="381px" priority style={{ objectFit: "cover" }} />
        <span ref={flashRef} className="prototype-flag-swoosh-flash" aria-hidden="true" />
      </div>
    </div>
  );
}
