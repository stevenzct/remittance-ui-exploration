"use client";

import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(MotionPathPlugin);

const GLOBE_ASSET = "/assets/prototype-figma/work-location-globe.png";
const AIRPLANE_ASSET = "/assets/prototype-figma/work-location-airplane.png";
const REFERENCE_WIDTH = 522;
const REFERENCE_HEIGHT = 696;
const PLANE_NOSE = { x: 416, y: 86 };
const PLANE_TRANSFORM_ORIGIN = "79.693% 49.425%";

const DESTINATION_PINS: Readonly<Record<string, { readonly x: number; readonly y: number }>> = {
  "Hong Kong": { x: 332, y: 335 },
  Philippines: { x: 400, y: 408 },
  "Saudi Arabia": { x: 116, y: 360 },
  Singapore: { x: 267, y: 418 },
};

const DESTINATION_TILT: Readonly<Record<string, number>> = {
  "Hong Kong": -5.5,
  Philippines: -7,
  "Saudi Arabia": 6,
  Singapore: -1.5,
};

interface WorkLocationWorldLoaderProps {
  readonly destination: string;
  readonly onComplete: () => void;
}

function destinationPin(destination: string) {
  return DESTINATION_PINS[destination] ?? DESTINATION_PINS["Hong Kong"];
}

function destinationPosition(pin: { x: number; y: number }) {
  return {
    left: `${(pin.x / REFERENCE_WIDTH) * 100}%`,
    top: `${(pin.y / REFERENCE_HEIGHT) * 100}%`,
  };
}

function routePath(
  width: number,
  height: number,
  destination: { x: number; y: number },
) {
  const scaleX = width / REFERENCE_WIDTH;
  const scaleY = height / REFERENCE_HEIGHT;
  const start = { x: -56, y: 205 };
  const deltaX = destination.x - start.x;
  const deltaY = destination.y - start.y;
  const points = [
    start,
    { x: start.x + deltaX * .25, y: start.y + deltaY * .1 },
    { x: start.x + deltaX * .7, y: start.y + deltaY * .65 },
    destination,
  ];

  return points.map((point) => ({
    x: (point.x - PLANE_NOSE.x) * scaleX,
    y: (point.y - PLANE_NOSE.y) * scaleY,
  }));
}

function pathStartAngle(path: readonly { x: number; y: number }[]) {
  const start = path[0];
  const control = path[1];
  return Math.atan2(control.y - start.y, control.x - start.x) * 180 / Math.PI;
}

export function WorkLocationWorldLoader({
  destination,
  onComplete,
}: WorkLocationWorldLoaderProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const artworkRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<HTMLDivElement | null>(null);
  const planeFlightRef = useRef<HTMLDivElement | null>(null);
  const planeVisualRef = useRef<HTMLDivElement | null>(null);
  const destinationMarkerRef = useRef<HTMLSpanElement | null>(null);
  const destinationPulseRef = useRef<HTMLSpanElement | null>(null);
  const onCompleteRef = useRef(onComplete);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const runIdRef = useRef(0);

  useLayoutEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const artwork = artworkRef.current;
    const globe = globeRef.current;
    const planeFlight = planeFlightRef.current;
    const planeVisual = planeVisualRef.current;
    const destinationMarker = destinationMarkerRef.current;
    const destinationPulse = destinationPulseRef.current;

    if (
      !overlay
      || !artwork
      || !globe
      || !planeFlight
      || !planeVisual
      || !destinationMarker
      || !destinationPulse
    ) {
      return;
    }

    const runId = ++runIdRef.current;
    let cancelled = false;
    const pin = destinationPin(destination);
    const width = artwork.clientWidth || REFERENCE_WIDTH;
    const height = artwork.clientHeight || REFERENCE_HEIGHT;
    const path = routePath(width, height, pin);
    const startAngle = pathStartAngle(path);
    const globeTilt = DESTINATION_TILT[destination] ?? DESTINATION_TILT["Hong Kong"];
    const targets = [
      overlay,
      artwork,
      globe,
      planeFlight,
      planeVisual,
      destinationPulse,
    ];

    timelineRef.current?.kill();
    timelineRef.current = null;
    gsap.killTweensOf(targets);
    gsap.set(destinationMarker, destinationPosition(pin));

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set([overlay, artwork, globe], { autoAlpha: 1 });
      gsap.set(globe, { xPercent: 0, rotation: 0, rotationY: 0, scale: 1 });
      gsap.set(planeVisual, { autoAlpha: 0 });
      gsap.set(destinationPulse, { autoAlpha: .7, scale: 1 });
      const finishTimer = window.setTimeout(() => {
        if (!cancelled && runId === runIdRef.current) onCompleteRef.current();
      }, 450);

      return () => {
        cancelled = true;
        window.clearTimeout(finishTimer);
        gsap.set(targets, { clearProps: "all" });
      };
    }

    gsap.set(overlay, { autoAlpha: 0, yPercent: 0 });
    gsap.set(artwork, {
      autoAlpha: 0,
      scale: .975,
      transformOrigin: "50% 60%",
    });
    gsap.set(globe, {
      autoAlpha: 1,
      xPercent: 0,
      rotation: 0,
      rotationY: 0,
      scale: 1,
      transformOrigin: "50% 50%",
      transformPerspective: 1000,
      force3D: true,
      willChange: "transform",
    });
    gsap.set(planeFlight, {
      ...path[0],
      rotation: startAngle,
      transformOrigin: PLANE_TRANSFORM_ORIGIN,
      force3D: true,
      willChange: "transform",
    });
    gsap.set(planeVisual, {
      autoAlpha: 0,
      scale: .5,
      transformOrigin: PLANE_TRANSFORM_ORIGIN,
      force3D: true,
      willChange: "transform,opacity",
    });
    gsap.set(destinationPulse, {
      autoAlpha: 0,
      scale: .64,
      willChange: "transform,opacity",
    });

    const timeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => {
        if (cancelled || runId !== runIdRef.current) return;
        gsap.set([globe, planeFlight, planeVisual, destinationPulse], {
          clearProps: "willChange",
        });
        onCompleteRef.current();
      },
    });
    timelineRef.current = timeline;

    timeline
      .to(overlay, { autoAlpha: 1, duration: .16, ease: "power1.out" }, 0)
      .to(artwork, { autoAlpha: 1, scale: 1, duration: .28, ease: "power2.out" }, .02)
      .to(globe, {
        xPercent: globeTilt * .11,
        rotation: globeTilt * .09,
        rotationY: globeTilt,
        scale: 1.012,
        duration: .7,
        ease: "power2.inOut",
      }, .04)
      .to(globe, {
        xPercent: 0,
        rotation: 0,
        rotationY: 0,
        scale: 1,
        duration: 1.08,
        ease: "sine.out",
      }, .72)
      .to(planeVisual, { autoAlpha: 1, duration: .2, ease: "power2.out" }, .34)
      .to(planeFlight, {
        motionPath: {
          path,
          type: "cubic",
          autoRotate: true,
        },
        duration: 1.46,
        ease: "power2.inOut",
      }, .36)
      .to(planeVisual, { scale: .34, duration: 1.46, ease: "sine.inOut" }, .36)
      .to(destinationPulse, {
        autoAlpha: .7,
        scale: 1,
        duration: .4,
        ease: "power2.out",
      }, 1.74)
      .to(planeVisual, { autoAlpha: 0, duration: .24, ease: "sine.out" }, 1.9)
      .to(overlay, { autoAlpha: 0, duration: .22, ease: "power1.in" }, 2.35);

    return () => {
      cancelled = true;
      timeline.kill();
      if (timelineRef.current === timeline) timelineRef.current = null;
      gsap.killTweensOf(targets);
      gsap.set(targets, { clearProps: "all" });
    };
  }, [destination]);

  const initialPin = destinationPin(destination);

  return (
    <div
      ref={overlayRef}
      className="prototype-work-location-loading prototype-world-route-loading"
      role="status"
      aria-live="polite"
      aria-label={`Loading ${destination}`}
    >
      <div
        ref={artworkRef}
        className="prototype-work-location-loading-artwork prototype-work-location-loading-artwork--world"
      >
        <div ref={globeRef} className="prototype-world-route-globe" aria-hidden="true">
          <Image src={GLOBE_ASSET} alt="" width={516} height={516} priority />
        </div>

        <div ref={planeFlightRef} className="prototype-world-route-plane-flight" aria-hidden="true">
          <div ref={planeVisualRef} className="prototype-world-route-plane-visual">
            <Image src={AIRPLANE_ASSET} alt="" width={522} height={174} priority />
          </div>
        </div>

        <span
          ref={destinationMarkerRef}
          className="prototype-world-route-destination"
          style={destinationPosition(initialPin)}
          aria-hidden="true"
        >
          <span ref={destinationPulseRef} />
        </span>
      </div>
    </div>
  );
}
