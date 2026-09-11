"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

const TAKEOFF_ARC_MOTION = {
  from: {
    x: "-26cqw",
    y: "11cqw",
    z: 0,
    rotationX: 3,
    rotationY: -8,
    rotationZ: -7,
  },
  cruise: {
    x: "-6cqw",
    y: "-3cqw",
    z: 0,
    rotationX: 1,
    rotationY: -2,
    rotationZ: -3,
  },
  approach: {
    x: "2cqw",
    y: "-1.1cqw",
    z: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: -1,
  },
} as const;

interface TakeoffArcTransitionProps {
  readonly destination: string;
  readonly assetSrc: string;
  readonly onCovered?: () => void;
  readonly onComplete: () => void;
}

export function TakeoffArcTransition({
  destination,
  assetSrc,
  onCovered,
  onComplete,
}: TakeoffArcTransitionProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const artworkRef = useRef<HTMLDivElement | null>(null);
  const onCompleteRef = useRef(onComplete);
  const onCoveredRef = useRef(onCovered);
  const [readyAssetSrc, setReadyAssetSrc] = useState<string | null>(null);

  useLayoutEffect(() => {
    onCompleteRef.current = onComplete;
    onCoveredRef.current = onCovered;
  }, [onComplete, onCovered]);

  useLayoutEffect(() => {
    if (readyAssetSrc !== assetSrc) return;

    const overlay = overlayRef.current;
    const artwork = artworkRef.current;
    if (!overlay || !artwork) return;

    const targets = [overlay, artwork];
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(overlay, { autoAlpha: 1, yPercent: 0 });
      onCoveredRef.current?.();
      gsap.set(artwork, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
      });

      const finishTimer = window.setTimeout(() => onCompleteRef.current(), 400);

      return () => {
        window.clearTimeout(finishTimer);
        gsap.set(targets, { clearProps: "all" });
      };
    }

    gsap.set(artwork, {
      transformPerspective: 900,
      transformStyle: "preserve-3d",
      willChange: "transform,opacity",
    });

    const timeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => {
        gsap.set(artwork, { clearProps: "willChange" });
        onCompleteRef.current();
      },
    });

    timeline
      .fromTo(
        overlay,
        { autoAlpha: 0, yPercent: 100 },
        { autoAlpha: 1, yPercent: 0, duration: .18, ease: "power3.out" },
        0,
      )
      .call(() => onCoveredRef.current?.(), [], .18)
      .fromTo(
        artwork,
        {
          autoAlpha: 0,
          ...TAKEOFF_ARC_MOTION.from,
          transformOrigin: "64% 52%",
          force3D: true,
        },
        {
          autoAlpha: 1,
          ...TAKEOFF_ARC_MOTION.cruise,
          duration: .42,
          ease: "power3.out",
        },
        .04,
      )
      .to(artwork, {
        ...TAKEOFF_ARC_MOTION.approach,
        duration: .24,
        ease: "sine.out",
      }, .46)
      .to(artwork, {
        x: 0,
        y: 0,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        duration: .18,
        ease: "sine.out",
      }, .7)
      .to(overlay, { autoAlpha: 0, duration: .14, ease: "power1.in" }, 1.02);

    return () => {
      timeline.kill();
      gsap.killTweensOf(targets);
      gsap.set(targets, { clearProps: "all" });
    };
  }, [assetSrc, destination, readyAssetSrc]);

  return (
    <div
      ref={overlayRef}
      className="prototype-work-location-loading"
      role="status"
      aria-live="assertive"
      aria-label={`Loading ${destination}`}
    >
      <div ref={artworkRef} className="prototype-work-location-loading-artwork">
        <Image
          src={assetSrc}
          alt=""
          width={305}
          height={228}
          priority
          onLoad={() => setReadyAssetSrc(assetSrc)}
          onError={() => setReadyAssetSrc(assetSrc)}
        />
      </div>
    </div>
  );
}
