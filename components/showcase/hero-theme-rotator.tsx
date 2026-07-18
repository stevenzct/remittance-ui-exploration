"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ImagePreview } from "@/components/showcase/image-preview";
import { SHOWCASE_THEMES } from "@/content/dashboard";
import { useLanguage } from "@/components/providers/language-provider";
import type { ShowcaseSample } from "@/types/dashboard";

const HERO_THEME_SAMPLES = [
  SHOWCASE_THEMES[0].samples[0],
  SHOWCASE_THEMES[1].samples[0],
  SHOWCASE_THEMES[2].samples[0],
] as const satisfies readonly ShowcaseSample[];

const HERO_THEMES = [
  {
    id: SHOWCASE_THEMES[0].id,
    label: SHOWCASE_THEMES[0].label,
    name: SHOWCASE_THEMES[0].name,
    sample: HERO_THEME_SAMPLES[0],
    accent: "#381c8d",
    secondary: "#ba3245",
    surface: "#f4f1fa",
    phoneRotation: -3,
    phoneY: 0,
    glowX: 0,
    glowY: 0,
  },
  {
    id: SHOWCASE_THEMES[1].id,
    label: SHOWCASE_THEMES[1].label,
    name: SHOWCASE_THEMES[1].name,
    sample: HERO_THEME_SAMPLES[1],
    accent: "#ba3245",
    secondary: "#381c8d",
    surface: "#fbf1f3",
    phoneRotation: 2,
    phoneY: -4,
    glowX: 34,
    glowY: 18,
  },
  {
    id: SHOWCASE_THEMES[2].id,
    label: SHOWCASE_THEMES[2].label,
    name: SHOWCASE_THEMES[2].name,
    sample: HERO_THEME_SAMPLES[2],
    accent: "#2853bb",
    secondary: "#e6a713",
    surface: "#eef4ff",
    phoneRotation: -1,
    phoneY: 3,
    glowX: -18,
    glowY: 30,
  },
] as const;

const HOLD_DURATION = 1.02;
const TRANSITION_DURATION = 0.82;

export function HeroThemeRotator() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const primaryGlowRef = useRef<HTMLDivElement>(null);
  const secondaryGlowRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const screenRefs = useRef<Array<HTMLImageElement | null>>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isPausedRef = useRef(false);

  const activeTheme = HERO_THEMES[activeIndex];

  useLayoutEffect(() => {
    const root = rootRef.current;
    const surface = surfaceRef.current;
    const primaryGlow = primaryGlowRef.current;
    const secondaryGlow = secondaryGlowRef.current;
    const phone = phoneRef.current;
    const label = labelRef.current;
    const screens = screenRefs.current.filter((screen): screen is HTMLImageElement => Boolean(screen));

    if (!root || !surface || !primaryGlow || !secondaryGlow || !phone || !label || screens.length !== HERO_THEMES.length) return;

    const context = gsap.context(() => {
      gsap.set(screens, {
        autoAlpha: 0,
        clipPath: "inset(100% 0% 0% 0%)",
        scale: 1.055,
        transformOrigin: "50% 50%",
        yPercent: 11,
        zIndex: 0,
      });
      gsap.set(screens[0], {
        autoAlpha: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        yPercent: 0,
        zIndex: 1,
      });
      gsap.set(phone, {
        rotation: HERO_THEMES[0].phoneRotation,
        y: HERO_THEMES[0].phoneY,
      });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const timeline = gsap.timeline({ repeat: -1 });
      timelineRef.current = timeline;

      HERO_THEMES.forEach((_, currentIndex) => {
        const nextIndex = (currentIndex + 1) % HERO_THEMES.length;
        const currentScreen = screens[currentIndex];
        const nextScreen = screens[nextIndex];
        const nextTheme = HERO_THEMES[nextIndex];

        timeline.to({}, { duration: HOLD_DURATION });
        const transitionStart = timeline.duration();

        timeline
          .call(() => {
            gsap.set(currentScreen, { zIndex: 1 });
            gsap.set(nextScreen, {
              autoAlpha: 1,
              clipPath: "inset(100% 0% 0% 0%)",
              scale: 1.055,
              yPercent: 11,
              zIndex: 2,
            });
          }, [], transitionStart)
          .to(currentScreen, {
            duration: TRANSITION_DURATION,
            ease: "power3.inOut",
            scale: 0.955,
            yPercent: -5,
          }, transitionStart)
          .to(nextScreen, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: TRANSITION_DURATION,
            ease: "expo.inOut",
            scale: 1,
            yPercent: 0,
          }, transitionStart)
          .to(surface, {
            backgroundColor: nextTheme.surface,
            duration: TRANSITION_DURATION,
            ease: "power2.inOut",
          }, transitionStart)
          .to(primaryGlow, {
            backgroundColor: nextTheme.accent,
            duration: TRANSITION_DURATION,
            ease: "power2.inOut",
            xPercent: nextTheme.glowX,
            yPercent: nextTheme.glowY,
          }, transitionStart)
          .to(secondaryGlow, {
            backgroundColor: nextTheme.secondary,
            duration: TRANSITION_DURATION,
            ease: "power2.inOut",
            xPercent: -nextTheme.glowX,
            yPercent: -nextTheme.glowY,
          }, transitionStart)
          .to(phone, {
            duration: TRANSITION_DURATION,
            ease: "power3.inOut",
            rotation: nextTheme.phoneRotation,
            y: nextTheme.phoneY,
          }, transitionStart)
          .to(label, {
            autoAlpha: 0,
            duration: 0.2,
            ease: "power2.in",
            y: -8,
          }, transitionStart)
          .call(() => setActiveIndex(nextIndex), [], transitionStart + 0.34)
          .fromTo(label, {
            autoAlpha: 0,
            y: 10,
          }, {
            autoAlpha: 1,
            duration: 0.38,
            ease: "power3.out",
            immediateRender: false,
            y: 0,
          }, transitionStart + 0.4)
          .set(currentScreen, {
            autoAlpha: 0,
            clipPath: "inset(100% 0% 0% 0%)",
            scale: 1.055,
            yPercent: 11,
            zIndex: 0,
          }, transitionStart + TRANSITION_DURATION);
      });

      const handleVisibilityChange = () => {
        if (document.hidden) timeline.pause();
        else if (!isPausedRef.current) timeline.resume();
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, root);

    return () => {
      timelineRef.current = null;
      context.revert();
    };
  }, []);

  const togglePlayback = () => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const nextIsPaused = !isPausedRef.current;
    isPausedRef.current = nextIsPaused;
    setIsPaused(nextIsPaused);
    timeline.paused(nextIsPaused);
  };

  return (
    <div
      ref={rootRef}
      className="relative mx-auto flex min-h-[500px] w-full max-w-[620px] items-center justify-center overflow-hidden rounded-[26px] border border-white/80 p-5 shadow-[0_24px_60px_rgba(37,27,57,.08)] sm:min-h-[650px] sm:rounded-[32px] sm:p-8"
      role="group"
      aria-label={t("Automatically rotating previews of the three remittance themes")}
    >
      <div ref={surfaceRef} className="absolute inset-0 bg-[#f4f1fa]" />
      <div ref={primaryGlowRef} className="absolute left-[8%] top-[12%] size-28 rounded-full bg-[#381c8d] opacity-10 blur-2xl will-change-transform" />
      <div ref={secondaryGlowRef} className="absolute bottom-[8%] right-[8%] size-40 rounded-full bg-[#ba3245] opacity-10 blur-3xl will-change-transform" />

      <div ref={labelRef} className="pointer-events-none absolute left-4 top-4 z-20 rounded-full border border-white/70 bg-white/75 px-3 py-2 shadow-sm backdrop-blur-md sm:left-6 sm:top-6">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a8390]">{t(activeTheme.label)}</p>
        <p className="mt-0.5 text-xs font-bold text-[#211b28] sm:text-sm">{t(activeTheme.name)}</p>
      </div>

      <div ref={phoneRef} className="relative z-10 w-full will-change-transform">
        <ImagePreview src={activeTheme.sample.image} alt={t(activeTheme.sample.title)} samples={HERO_THEME_SAMPLES}>
          <div className="phone-shell">
            <div className="phone-screen-viewport">
              {HERO_THEMES.map((theme, index) => (
                <Image
                  key={theme.id}
                  ref={(screen) => {
                    screenRefs.current[index] = screen;
                  }}
                  src={theme.sample.image}
                  alt=""
                  aria-hidden="true"
                  width={750}
                  height={1624}
                  priority={index === 0}
                  loading={index === 0 ? undefined : "eager"}
                  draggable={false}
                  className="phone-screen pointer-events-none absolute inset-0 select-none"
                  style={{
                    clipPath: index === 0 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
                    opacity: index === 0 ? 1 : 0,
                    visibility: index === 0 ? "visible" : "hidden",
                    willChange: "clip-path, transform, opacity",
                    zIndex: index === 0 ? 1 : 0,
                  }}
                />
              ))}
            </div>
          </div>
        </ImagePreview>
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-6">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {HERO_THEMES.map((theme, index) => (
            <span key={theme.id} className="h-1 w-6 overflow-hidden rounded-full bg-white/75 shadow-sm">
              <span
                className="block h-full w-full origin-left rounded-full transition-transform duration-500"
                style={{
                  backgroundColor: theme.accent,
                  transform: index === activeIndex ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            </span>
          ))}
        </div>

        <button
          type="button"
          className="ui-button motion-reduce:hidden inline-flex min-h-11 items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#4f4856] shadow-sm backdrop-blur-md hover:bg-white"
          onClick={togglePlayback}
          aria-label={isPaused ? t("Resume theme rotation") : t("Pause theme rotation")}
        >
          <span className="inline-flex size-3 items-center justify-center" aria-hidden="true">
            {isPaused ? (
              <span className="ml-0.5 block h-0 w-0 border-y-[4px] border-l-[7px] border-y-transparent border-l-current" />
            ) : (
              <span className="flex gap-0.5"><span className="h-2.5 w-0.5 rounded-full bg-current" /><span className="h-2.5 w-0.5 rounded-full bg-current" /></span>
            )}
          </span>
          {isPaused ? t("Play") : t("Pause")}
        </button>
      </div>
    </div>
  );
}
