"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";

interface CountryCurtainLoaderProps {
  readonly selectedCountry: string;
  readonly onComplete: () => void;
  readonly assetSrc: string;
}

export function CountryCurtainLoader({
  selectedCountry,
  onComplete,
  assetSrc,
}: CountryCurtainLoaderProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const sheenRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const image = imageRef.current;
    const sheen = sheenRef.current;
    if (!overlay || !image || !sheen) return;

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
      gsap.set(overlay, {
        autoAlpha: 1,
        "--curtain-top": "0%",
        "--curtain-bottom": "0%",
        "--curtain-radius": "0%",
      });
      gsap.set(image, { scale: 1, yPercent: 0, filter: "blur(0px)" });
      gsap.set(sheen, { autoAlpha: 0 });
      finishTimer = window.setTimeout(finish, 450);

      return () => {
        disposed = true;
        window.clearTimeout(finishTimer);
        gsap.set([overlay, image, sheen], { clearProps: "all" });
      };
    }

    gsap.set(overlay, {
      autoAlpha: 1,
      "--curtain-top": "100%",
      "--curtain-bottom": "0%",
      "--curtain-radius": "52%",
      willChange: "clip-path",
    });
    gsap.set(image, {
      scale: 1.16,
      yPercent: 7,
      filter: "blur(7px)",
      transformOrigin: "50% 55%",
      willChange: "transform,filter",
    });
    gsap.set(sheen, {
      autoAlpha: 0,
      yPercent: 135,
      rotation: -10,
      willChange: "transform,opacity",
    });

    const timeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: finish,
    });

    timeline
      .to(overlay, {
        "--curtain-top": "0%",
        "--curtain-radius": "0%",
        duration: .92,
        ease: "power4.inOut",
      }, 0)
      .to(image, {
        scale: 1,
        yPercent: 0,
        filter: "blur(0px)",
        duration: 1.18,
        ease: "power3.out",
      }, .05)
      .to(sheen, {
        autoAlpha: .48,
        duration: .16,
        ease: "power1.out",
      }, .28)
      .to(sheen, {
        yPercent: -155,
        duration: .92,
        ease: "power2.inOut",
      }, .26)
      .to(sheen, {
        autoAlpha: 0,
        duration: .24,
        ease: "power2.out",
      }, .88)
      .to(overlay, {
        autoAlpha: 0,
        duration: .48,
        ease: "power2.inOut",
      }, 1.42);

    return () => {
      disposed = true;
      window.clearTimeout(finishTimer);
      timeline.kill();
      gsap.killTweensOf([overlay, image, sheen]);
      gsap.set([overlay, image, sheen], { clearProps: "all" });
    };
  }, [assetSrc, onComplete, selectedCountry]);

  return (
    <div
      ref={overlayRef}
      className="prototype-work-location-loading prototype-country-curtain-loading"
      role="status"
      aria-live="assertive"
      aria-label={`Loading ${selectedCountry}`}
    >
      <Image
        ref={imageRef}
        className="prototype-country-curtain-image"
        src={assetSrc}
        alt=""
        fill
        sizes="381px"
        priority
      />
      <span ref={sheenRef} className="prototype-country-curtain-sheen" aria-hidden="true" />
    </div>
  );
}
