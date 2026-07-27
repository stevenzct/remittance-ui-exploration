"use client";

import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { PrototypeIcon } from "@/components/prototype/prototype-icon";

gsap.registerPlugin(MotionPathPlugin);

const DEFAULT_ASSET = "/assets/prototype-figma/work-location-globe-landing.png";
const REFERENCE_WIDTH = 359;
const REFERENCE_HEIGHT = 269;

/**
 * The plane sprite's crop-window, as fractions of the 1448x1086 source
 * composite. Its untransformed rest position sits here inside the artwork
 * box, so the GSAP x/y offsets used for the flight path are relative to this
 * rest position, not absolute artwork-box coordinates.
 */
const PLANE_RECT = { left: 72 / 1448, right: 640 / 1448, top: 343 / 1086, bottom: 840 / 1086 };
const PLANE_CENTER = {
  x: (PLANE_RECT.left + PLANE_RECT.right) / 2,
  y: (PLANE_RECT.top + PLANE_RECT.bottom) / 2,
};

/**
 * Globe bounding box (sphere + ring), also as fractions of the source image.
 * In the raw composite the globe sits off to one side, so the viewport crops
 * to exactly this box and centers it in the artwork — the plane then lands
 * on that same centered point.
 */
const GLOBE_RECT = { left: 675 / 1448, right: 1402 / 1448, top: 178 / 1086, bottom: 827 / 1086 };

function flightPath(width: number, height: number, landX: number, landY: number) {
  return [
    { x: width * -.46, y: height * -.05 },
    { x: width * -.04, y: height * -.19 },
    { x: landX, y: landY },
  ];
}

interface GlobeLandingLoaderProps {
  readonly selectedCountry: string;
  readonly onComplete: () => void;
  readonly durationSeconds?: number;
  readonly assetSrc?: string;
  readonly flagSrc?: string;
}

export function GlobeLandingLoader({
  selectedCountry,
  onComplete,
  durationSeconds = 2,
  assetSrc = DEFAULT_ASSET,
  flagSrc,
}: GlobeLandingLoaderProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const artworkRef = useRef<HTMLDivElement | null>(null);
  const globeViewportRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<HTMLDivElement | null>(null);
  const shineRef = useRef<HTMLSpanElement | null>(null);
  const planeFlightRef = useRef<HTMLDivElement | null>(null);
  const planeVisualRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLSpanElement | null>(null);
  const markerRef = useRef<HTMLDivElement | null>(null);
  const rippleRef = useRef<HTMLSpanElement | null>(null);
  const confirmRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const artwork = artworkRef.current;
    const globeViewport = globeViewportRef.current;
    const globe = globeRef.current;
    const shine = shineRef.current;
    const planeFlight = planeFlightRef.current;
    const planeVisual = planeVisualRef.current;
    const glow = glowRef.current;
    const marker = markerRef.current;
    const ripple = rippleRef.current;
    const confirm = confirmRef.current;

    if (
      !overlay || !artwork || !globeViewport || !globe || !shine || !planeFlight
      || !planeVisual || !glow || !marker || !ripple || !confirm
    ) {
      return;
    }

    let disposed = false;
    let completed = false;
    let finishTimer = 0;

    const finish = () => {
      if (disposed || completed) return;
      completed = true;
      onComplete();
    };

    const width = artwork.clientWidth || REFERENCE_WIDTH;
    const height = artwork.clientHeight || REFERENCE_HEIGHT;
    const landX = (.5 - PLANE_CENTER.x) * width;
    const landY = (.5 - PLANE_CENTER.y) * height;
    const path = flightPath(width, height, landX, landY);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Crop the shared artwork down to just the globe's bounding box and
    // center that box in the artwork — this is what moves the globe from its
    // off-center spot in the raw composite to the middle of the loading area.
    gsap.set(globeViewport, {
      width: width * (GLOBE_RECT.right - GLOBE_RECT.left),
      height: height * (GLOBE_RECT.bottom - GLOBE_RECT.top),
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
    });
    gsap.set(globe, {
      width,
      height,
      left: -width * GLOBE_RECT.left,
      top: -height * GLOBE_RECT.top,
    });
    gsap.set([glow, marker, ripple, confirm], {
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
    });

    if (prefersReducedMotion) {
      gsap.set(overlay, { autoAlpha: 1 });
      gsap.set(globe, { autoAlpha: 1, rotationY: 0 });
      gsap.set(planeFlight, { x: landX, y: landY, rotation: 0 });
      gsap.set(planeVisual, { autoAlpha: 1, scale: .65 });
      gsap.set(glow, { autoAlpha: .85, scale: 1 });
      gsap.set(marker, { autoAlpha: 1, y: 0, scale: 1 });
      gsap.set(confirm, { autoAlpha: 1, scale: 1 });
      gsap.set(ripple, { autoAlpha: 0 });
      finishTimer = window.setTimeout(finish, 500);

      return () => {
        disposed = true;
        window.clearTimeout(finishTimer);
        gsap.set(
          [overlay, globe, planeFlight, planeVisual, glow, marker, ripple, confirm],
          { clearProps: "all" },
        );
        gsap.set(globeViewport, { clearProps: "all" });
      };
    }

    gsap.set(artwork, { transformPerspective: 700 });
    gsap.set(globe, { autoAlpha: 1, rotationY: -16, transformOrigin: "50% 50%", willChange: "transform" });
    gsap.set(planeFlight, { x: path[0].x, y: path[0].y, rotation: 0, transformOrigin: "50% 50%", willChange: "transform" });
    gsap.set(planeVisual, { autoAlpha: 0, scale: .45, transformOrigin: "50% 50%", willChange: "transform,opacity" });
    gsap.set(glow, { autoAlpha: 0, scale: .4, willChange: "transform,opacity" });
    gsap.set(marker, { autoAlpha: 0, y: -14, scale: .4, willChange: "transform,opacity" });
    gsap.set(ripple, { autoAlpha: 0, scale: .3, willChange: "transform,opacity" });
    gsap.set(confirm, { autoAlpha: 0, y: 6, scale: .5, willChange: "transform,opacity" });

    // A globe is a sphere — spinning a flat cropped image a full 360° via
    // rotationY makes it go edge-on and (since the artwork's images use
    // backface-visibility: hidden) vanish for half the cycle, not rotate. A
    // confident sway within a safe angle (never near 90°) reads as a globe
    // turning in place instead. Slows via timeScale once the plane lands
    // rather than stopping outright.
    const sway = gsap.to(globe, {
      rotationY: 16,
      duration: 1.3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // A soft diagonal light band drifting across the globe, looping — reads
    // as the sphere's surface catching light as it turns.
    const shineLoop = gsap.fromTo(
      shine,
      { xPercent: -140, autoAlpha: 0 },
      {
        xPercent: 140,
        autoAlpha: .8,
        duration: 1.6,
        ease: "sine.inOut",
        repeat: -1,
        repeatDelay: .4,
      },
    );

    const timeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => {
        gsap.set([planeVisual, marker, ripple, confirm], { clearProps: "willChange" });
        finishTimer = window.setTimeout(finish, 160);
      },
    });

    timeline
      // Overlay and plane snap into existence together — one confident beat.
      .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: .2, ease: "power2.out" }, 0)
      .to(planeVisual, { autoAlpha: 1, scale: .85, duration: .22, ease: "back.out(2)" }, .05)
      // One continuous curved flight. Ease-in-out so it visibly accelerates
      // away from the start instead of decelerating the whole way (which
      // reads as sluggish) — it only settles down near the landing itself.
      .to(planeFlight, {
        motionPath: { path, curviness: .65, autoRotate: true },
        duration: .92,
        ease: "power1.inOut",
      }, .08)
      // Landing: one quick, decisive settle — no bounce, no overshoot.
      .to(planeVisual, { scale: .6, duration: .22, ease: "power2.out" }, .82)
      .to(sway, { timeScale: .35, duration: .32, ease: "sine.out" }, .96)
      // Glow lands first, one clean beat under the plane.
      .to(glow, { autoAlpha: .9, scale: 1, duration: .3, ease: "back.out(2.5)" }, 1.02)
      // Pin & flag drop onto the destination right after — a small, decisive
      // bounce, like a map pin snapping into place.
      .to(marker, { autoAlpha: 1, y: 0, scale: 1, duration: .3, ease: "back.out(2.6)" }, 1.08)
      // A single ripple pulses outward from underneath the pin to sell the
      // "arrived" moment without dragging the sequence out.
      .to(ripple, { autoAlpha: .55, scale: 1, duration: .05, ease: "none" }, 1.1)
      .to(ripple, { autoAlpha: 0, scale: 2.1, duration: .5, ease: "power2.out" }, 1.1)
      // A checkmark badge confirms the destination is locked in.
      .to(confirm, { autoAlpha: 1, y: 0, scale: 1, duration: .26, ease: "back.out(2.4)" }, 1.32)
      // Brief hold on the confirmed state, then the whole scene dissolves to
      // reveal the (already updated) app underneath.
      .to(overlay, { autoAlpha: 0, duration: .2, ease: "power1.in" }, 1.72);

    // Hold the completed state briefly before firing onComplete — anchored to
    // where the sequence above actually finishes, not a hardcoded position,
    // so a longer `durationSeconds` genuinely extends the hold.
    const naturalEnd = 1.72 + .2;
    const holdDuration = Math.max(0, durationSeconds - naturalEnd);
    if (holdDuration > 0) timeline.to({}, { duration: holdDuration }, naturalEnd);

    return () => {
      disposed = true;
      window.clearTimeout(finishTimer);
      sway.kill();
      shineLoop.kill();
      timeline.kill();
      gsap.killTweensOf([overlay, globe, shine, planeFlight, planeVisual, glow, marker, ripple, confirm]);
      gsap.set(
        [overlay, globe, shine, planeFlight, planeVisual, glow, marker, ripple, confirm],
        { clearProps: "all" },
      );
      gsap.set(globeViewport, { clearProps: "all" });
    };
  }, [selectedCountry, onComplete, durationSeconds, assetSrc, flagSrc]);

  return (
    <div
      ref={overlayRef}
      className="prototype-work-location-loading"
      role="status"
      aria-live="assertive"
      aria-label={`Loading ${selectedCountry}`}
    >
      <div ref={artworkRef} className="prototype-work-location-loading-artwork prototype-work-location-loading-artwork--world">
        <div ref={globeViewportRef} className="prototype-globe-landing-viewport" aria-hidden="true">
          <div ref={globeRef} className="prototype-globe-landing-fallback">
            <Image src={assetSrc} alt="" width={359} height={269} priority />
            <span ref={shineRef} className="prototype-globe-landing-shine" />
          </div>
        </div>
        <div ref={planeFlightRef} className="prototype-globe-landing-plane-flight" aria-hidden="true">
          <div ref={planeVisualRef} className="prototype-globe-landing-plane-visual">
            <Image src={assetSrc} alt="" width={359} height={269} priority />
          </div>
        </div>
        <span ref={glowRef} className="prototype-globe-landing-glow" aria-hidden="true" />
        <div ref={markerRef} className="prototype-globe-landing-marker" aria-hidden="true">
          <span className="prototype-globe-landing-pin">
            {flagSrc && <Image src={flagSrc} alt="" width={16} height={16} />}
          </span>
        </div>
        <span ref={rippleRef} className="prototype-globe-landing-ripple" aria-hidden="true" />
        <div ref={confirmRef} className="prototype-globe-landing-confirm" aria-hidden="true">
          <PrototypeIcon name="check" size={12} />
        </div>
      </div>
    </div>
  );
}
