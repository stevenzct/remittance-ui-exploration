export type AnimationSourceTabId = "component" | "styles" | "integration";

export interface AnimationSourceTab {
  readonly id: AnimationSourceTabId;
  readonly label: string;
  readonly fileName: string;
  readonly language: string;
  readonly code: string;
}

export const ANIMATION_01_TIMELINE = [
  { time: "0.00–0.18s", label: "Enter", detail: "The white overlay rises into the phone viewport." },
  { time: "0.04–0.46s", label: "Cruise", detail: "The country artwork accelerates in along a tilted 3D arc." },
  { time: "0.46–0.70s", label: "Approach", detail: "A small overshoot gives the arrival energy and direction." },
  { time: "0.70–0.88s", label: "Settle", detail: "Position and rotation resolve cleanly to their final values." },
  { time: "1.02–1.16s", label: "Reveal", detail: "The overlay fades and hands control back to the app." },
] as const;

export const ANIMATION_01_SOURCE_TABS = [
  {
    id: "component",
    label: "Component",
    fileName: "takeoff-arc-transition.tsx",
    language: "TSX",
    code: String.raw`"use client";

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
  readonly onComplete: () => void;
}

export function TakeoffArcTransition({
  destination,
  assetSrc,
  onComplete,
}: TakeoffArcTransitionProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const artworkRef = useRef<HTMLDivElement | null>(null);
  const onCompleteRef = useRef(onComplete);
  const [readyAssetSrc, setReadyAssetSrc] = useState<string | null>(null);

  useLayoutEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useLayoutEffect(() => {
    if (readyAssetSrc !== assetSrc) return;

    const overlay = overlayRef.current;
    const artwork = artworkRef.current;
    if (!overlay || !artwork) return;

    const targets = [overlay, artwork];
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      gsap.set(overlay, { autoAlpha: 1, yPercent: 0 });
      gsap.set(artwork, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
      });

      const timer = window.setTimeout(
        () => onCompleteRef.current(),
        400,
      );

      return () => {
        window.clearTimeout(timer);
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
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: .18,
          ease: "power3.out",
        },
        0,
      )
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
      .to(
        artwork,
        {
          ...TAKEOFF_ARC_MOTION.approach,
          duration: .24,
          ease: "sine.out",
        },
        .46,
      )
      .to(
        artwork,
        {
          x: 0,
          y: 0,
          z: 0,
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          duration: .18,
          ease: "sine.out",
        },
        .7,
      )
      .to(
        overlay,
        {
          autoAlpha: 0,
          duration: .14,
          ease: "power1.in",
        },
        1.02,
      );

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
      aria-label={"Loading " + destination}
    >
      <div
        ref={artworkRef}
        className="prototype-work-location-loading-artwork"
      >
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
}`,
  },
  {
    id: "styles",
    label: "Styles",
    fileName: "takeoff-arc-transition.css",
    language: "CSS",
    code: String.raw`/* cqw units are relative to this phone-sized query container. */
.prototype-screen {
  position: relative;
  width: min(100%, 381px);
  aspect-ratio: 750 / 1624;
  overflow: hidden;
  border-radius: 16px 16px 47px 47px;
  background: #fff;
  container-type: inline-size;
}

.prototype-work-location-loading {
  position: absolute;
  z-index: 130;
  inset: 0;
  overflow: hidden;
  background: var(--prototype-surface, #fff);
  opacity: 0;
  visibility: hidden;
  cursor: progress;
}

.prototype-work-location-loading-artwork {
  position: absolute;
  top: 77.867cqw;
  left: 9.333cqw;
  width: 81.333cqw;
  height: 60.8cqw;
  isolation: isolate;
  perspective: 160cqw;
  transform-style: preserve-3d;
}

.prototype-work-location-loading-artwork img {
  display: block;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  object-fit: cover;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .prototype-work-location-loading-artwork {
    transform: none;
  }
}`,
  },
  {
    id: "integration",
    label: "Integration",
    fileName: "country-switcher.tsx",
    language: "TSX",
    code: String.raw`"use client";

import { useState } from "react";
import { TakeoffArcTransition } from "./takeoff-arc-transition";
import "./takeoff-arc-transition.css";

const COUNTRY_ARTWORK: Readonly<Record<string, string>> = {
  Philippines:
    "/assets/prototype-figma/work-location-philippines-loading.png",
  "Hong Kong":
    "/assets/prototype-figma/work-location-hongkong-loading.png",
};

export function CountrySwitcher() {
  const [country, setCountry] = useState("Philippines");
  const [loadingCountry, setLoadingCountry] = useState<string | null>(null);

  const changeCountry = (nextCountry: string) => {
    // Keep the old screen visible while the transition covers it.
    setLoadingCountry(nextCountry);
  };

  const finishTransition = () => {
    if (!loadingCountry) return;

    setCountry(loadingCountry);
    setLoadingCountry(null);
  };

  return (
    <section className="prototype-screen" aria-label={"Current country: " + country}>
      <button type="button" onClick={() => changeCountry("Hong Kong")}>
        Switch to Hong Kong
      </button>

      {loadingCountry ? (
        <TakeoffArcTransition
          destination={loadingCountry}
          assetSrc={COUNTRY_ARTWORK[loadingCountry]}
          onComplete={finishTransition}
        />
      ) : null}
    </section>
  );
}

// Install the only animation dependency:
// npm install gsap`,
  },
] as const satisfies readonly AnimationSourceTab[];
