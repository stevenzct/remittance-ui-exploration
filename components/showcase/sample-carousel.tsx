"use client";

import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { CarouselControls } from "@/components/showcase/carousel-controls";
import { PhoneMockup } from "@/components/showcase/phone-mockup";
import { useLanguage } from "@/components/providers/language-provider";
import type { ShowcaseTheme } from "@/types/dashboard";

interface SampleCarouselProps {
  readonly themes: readonly ShowcaseTheme[];
}

interface SwipeStart {
  readonly pointerId: number;
  readonly x: number;
}

function duration(value: number) {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : value;
}

export function SampleCarousel({ themes }: SampleCarouselProps) {
  const { t } = useLanguage();
  const [themeIndex, setThemeIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageContentRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef(1);
  const hasChangedRef = useRef(false);
  const isChangingRef = useRef(false);
  const swipeStartRef = useRef<SwipeStart | null>(null);
  const suppressClickUntilRef = useRef(0);

  const theme = themes[themeIndex];
  const samples = theme.samples;
  const sample = samples[currentIndex];
  const isFirst = themeIndex === 0 && currentIndex === 0;
  const isLast = themeIndex === themes.length - 1 && currentIndex === samples.length - 1;
  const previousLabel = currentIndex === 0 && themeIndex > 0 ? "Previous theme" : "Previous";
  const nextLabel = currentIndex === samples.length - 1 && themeIndex < themes.length - 1 ? "Next theme" : "Next";
  const accent = theme.id === "theme-02" ? "rose" : theme.id === "theme-03" ? "royal" : "blue";
  const accentBackgroundClassName = accent === "rose"
    ? "bg-[#ba3245] shadow-[0_8px_20px_rgba(186,50,69,.18)]"
    : accent === "royal"
      ? "bg-[#2853bb] shadow-[0_8px_20px_rgba(40,83,187,.18)]"
      : "bg-[#381c8d] shadow-[0_8px_20px_rgba(56,28,141,.18)]";
  const accentHoverClassName = accent === "rose" ? "hover:text-[#ba3245]" : accent === "royal" ? "hover:text-[#2853bb]" : "hover:text-[#381c8d]";
  const accentButtonClassName = accent === "rose"
    ? "bg-[#ba3245] shadow-[0_12px_28px_rgba(186,50,69,.2)]"
    : accent === "royal"
      ? "bg-[#2853bb] shadow-[0_12px_28px_rgba(40,83,187,.2)]"
      : "bg-[#381c8d] shadow-[0_12px_28px_rgba(56,28,141,.2)]";

  const changeContent = useCallback((nextThemeIndex: number, nextIndex: number, direction: number) => {
    const nextTheme = themes[nextThemeIndex];
    if (
      isChangingRef.current
      || !nextTheme
      || nextIndex < 0
      || nextIndex >= nextTheme.samples.length
      || (nextThemeIndex === themeIndex && nextIndex === currentIndex)
    ) return;

    const imageContent = imageContentRef.current;
    const textContent = textContentRef.current;
    if (!imageContent || !textContent) return;

    isChangingRef.current = true;
    directionRef.current = direction;
    const textItems = Array.from(textContent.children);
    gsap.killTweensOf([imageContent, textContent, ...textItems]);
    gsap.timeline({
      onComplete: () => {
        hasChangedRef.current = true;
        setThemeIndex(nextThemeIndex);
        setCurrentIndex(nextIndex);
      },
    })
      .to(imageContent, {
        autoAlpha: 0.45,
        x: direction * -30,
        scale: 0.94,
        rotation: direction * -1.2,
        duration: duration(0.42),
        ease: "power3.inOut",
      }, 0)
      .to(textItems, {
        autoAlpha: 0,
        x: direction * -8,
        y: -14,
        duration: duration(0.24),
        stagger: duration(0.025),
        ease: "power2.in",
      }, 0.04);
  }, [currentIndex, themeIndex, themes]);

  useLayoutEffect(() => {
    if (!hasChangedRef.current) return;

    const imageContent = imageContentRef.current;
    const textContent = textContentRef.current;
    if (!imageContent || !textContent) return;

    const direction = directionRef.current;
    const textItems = Array.from(textContent.children);
    const timeline = gsap.timeline({
      onComplete: () => {
        isChangingRef.current = false;
      },
    })
      .fromTo(imageContent, {
        autoAlpha: 0.45,
        x: direction * 30,
        scale: 0.94,
        rotation: direction * 1.2,
      }, {
        autoAlpha: 1,
        x: 0,
        scale: 1,
        rotation: 0,
        duration: duration(0.64),
        ease: "expo.out",
      }, 0)
      .fromTo(textItems, {
        autoAlpha: 0,
        x: direction * 12,
        y: 22,
      }, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        duration: duration(0.48),
        stagger: duration(0.045),
        ease: "power3.out",
      }, 0.12);

    return () => {
      timeline.kill();
    };
  }, [currentIndex, themeIndex]);

  const showPrevious = () => {
    if (currentIndex > 0) {
      changeContent(themeIndex, currentIndex - 1, -1);
      return;
    }

    const previousThemeIndex = themeIndex - 1;
    const previousTheme = themes[previousThemeIndex];
    if (previousTheme) changeContent(previousThemeIndex, previousTheme.samples.length - 1, -1);
  };

  const showNext = () => {
    if (currentIndex < samples.length - 1) {
      changeContent(themeIndex, currentIndex + 1, 1);
      return;
    }

    const nextThemeIndex = themeIndex + 1;
    if (themes[nextThemeIndex]) changeContent(nextThemeIndex, 0, 1);
  };
  const showTheme = (nextThemeIndex: number) => {
    changeContent(nextThemeIndex, 0, nextThemeIndex > themeIndex ? 1 : -1);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    swipeStartRef.current = { pointerId: event.pointerId, x: event.clientX };
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    if (!start || start.pointerId !== event.pointerId) return;

    const distance = event.clientX - start.x;
    swipeStartRef.current = null;
    if (Math.abs(distance) < 50) return;

    suppressClickUntilRef.current = Date.now() + 350;
    if (distance < 0) showNext();
    else showPrevious();
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") showPrevious();
    if (event.key === "ArrowRight") showNext();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid w-full grid-cols-3 gap-1 rounded-2xl bg-[#f4f1fa] p-1 sm:inline-flex sm:w-auto" role="tablist" aria-label={t("Showcase theme")}>
          {themes.map((item, index) => {
            const isActive = index === themeIndex;

            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`min-h-11 min-w-0 rounded-xl px-2 text-xs font-bold transition sm:flex-none sm:px-4 sm:text-sm ${isActive ? `${accentBackgroundClassName} text-white` : `text-[#706a76] hover:bg-white ${accentHoverClassName}`}`}
                onClick={() => showTheme(index)}
              >
                {t(item.label)}
              </button>
            );
          })}
        </div>
        <p className="text-xs font-semibold text-[#8c8592]">{t(theme.name)} · {samples.length} {t("directions")}</p>
      </div>

      <article
        className="grid min-w-0 items-center gap-6 rounded-[22px] bg-[#faf9fc] p-3 sm:gap-8 sm:rounded-[28px] sm:p-8 lg:p-10 xl:grid-cols-[minmax(300px,.8fr)_1fr]"
        aria-label={`${t(theme.label)} ${t("UI sample comparison")}`}
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div
          className="phone-presentation relative flex min-h-[440px] min-w-0 items-center justify-center overflow-hidden rounded-[20px] bg-white p-3 shadow-[inset_0_0_0_1px_#ece9f1] sm:min-h-[730px] sm:rounded-[26px] sm:p-7"
          style={{ touchAction: "pan-y" }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            swipeStartRef.current = null;
          }}
          onClickCapture={(event) => {
            if (Date.now() > suppressClickUntilRef.current) return;
            suppressClickUntilRef.current = 0;
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <div ref={imageContentRef} className="relative z-10 flex w-full items-center justify-center will-change-transform">
            <PhoneMockup key={`${theme.id}-${sample.id}`} src={sample.image} alt={t(sample.title)} samples={samples} />
          </div>
        </div>

        <div className="sm:hidden">
          <CarouselControls
            current={currentIndex + 1}
            total={samples.length}
            isFirst={isFirst}
            isLast={isLast}
            previousLabel={previousLabel}
            nextLabel={nextLabel}
            onPrevious={showPrevious}
            onNext={showNext}
            accent={accent}
          />
        </div>

        <div ref={textContentRef} className="min-w-0 max-w-xl" aria-live="polite">
          <div className={`mb-6 grid size-14 place-items-center rounded-2xl text-base font-bold text-white ${accentButtonClassName}`}>{String(currentIndex + 1).padStart(2, "0")}</div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#ba3245]">{t(theme.label)} · {t(sample.label)}</p>
          <h3 className="mt-3 text-2xl font-bold tracking-[-0.045em] text-[#201b26] sm:text-3xl md:text-4xl xl:text-5xl">{t(sample.title)}</h3>
          <p className="mt-4 text-base leading-7 text-[#7b7580]">{t(sample.description)}</p>
          <div className="mt-7 flex flex-wrap gap-2">{sample.tags.map((tag) => <span key={tag} className="rounded-full border border-[#e4dfe9] bg-white px-3 py-2 text-xs font-semibold text-[#5a5261]">{t(tag)}</span>)}</div>
          <div className="hidden sm:block">
            <CarouselControls
              current={currentIndex + 1}
              total={samples.length}
              isFirst={isFirst}
              isLast={isLast}
              previousLabel={previousLabel}
              nextLabel={nextLabel}
              onPrevious={showPrevious}
              onNext={showNext}
              accent={accent}
            />
          </div>
        </div>
      </article>
    </div>
  );
}
