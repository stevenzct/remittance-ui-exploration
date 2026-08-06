"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DASHBOARD_THEME } from "@/content/dashboard";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { useLanguage } from "@/components/providers/language-provider";

export function DashboardHeader() {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pageTitle = pathname === "/refinements" || pathname === "/revisions"
    ? "Homepage Refinements"
    : pathname === "/wireframes"
      ? "Homepage Wireframes"
    : pathname === "/prototype"
      ? "Interactive Prototype"
      : "Homepage Design";

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen();
    }
  };

  const fullscreenLabel = isFullscreen ? t("Exit full screen (F11)") : t("Full screen (F11)");

  return (
    <header className="sticky top-0 z-30 flex min-h-[4.5rem] min-w-0 items-center justify-between gap-2 border-b border-white/80 bg-white/82 px-3 py-3 shadow-[0_8px_30px_rgba(37,27,57,.035)] backdrop-blur-2xl sm:h-20 sm:gap-3 sm:px-8 sm:py-0 lg:px-10">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <MobileNavigation />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-[#99929f] sm:text-xs">{t("Remittance App")}</p>
          <h1 className="truncate text-base font-bold tracking-[-0.02em] text-[#201b26] sm:text-lg">{t(pageTitle)}</h1>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          className="ui-tooltip hidden size-11 items-center justify-center rounded-2xl border border-[#e7e3eb] bg-white/90 text-[#4f4856] shadow-[0_6px_18px_rgba(37,27,57,.04)] transition hover:bg-[#f5f2fb] hover:text-[#381c8d] focus-visible:outline-2 focus-visible:outline-[#5b2bd1] sm:inline-flex"
          onClick={toggleFullscreen}
          aria-pressed={isFullscreen}
          aria-label={fullscreenLabel}
          data-tooltip-label={fullscreenLabel}
        >
          <Icon icon={isFullscreen ? "mdi:fullscreen-exit" : "mdi:fullscreen"} width="22" aria-hidden="true" />
        </button>
        <span className="hidden rounded-full border border-[#e7e3eb] bg-white px-3 py-2 text-xs font-semibold text-[#706a76] sm:inline-flex">{t(DASHBOARD_THEME.label)}</span>
        <div className="inline-flex min-h-11 items-center rounded-2xl border border-[#e7e3eb] bg-white/90 px-1.5 text-xs font-semibold shadow-[0_6px_18px_rgba(37,27,57,.04)]" aria-label={t("Language")}>
          <button
            type="button"
            className={`ui-tooltip inline-flex min-h-9 items-center gap-1 rounded-xl px-1.5 transition hover:bg-[#f5f2fb] focus-visible:outline-2 focus-visible:outline-[#5b2bd1] ${language === "en" ? "text-[#381c8d]" : "text-[#99929f]"}`}
            onClick={() => setLanguage("en")}
            aria-label={t("English")}
            aria-pressed={language === "en"}
            data-tooltip-label={t("English")}
          >
            <Icon icon="circle-flags:us" width="16" aria-hidden="true" /> <span className="hidden sm:inline">EN</span>
          </button>
          <span className="px-1.5 text-[#c8c3cc]" aria-hidden="true">|</span>
          <button
            type="button"
            className={`ui-tooltip ui-tooltip--end inline-flex min-h-9 items-center gap-1 rounded-xl px-1.5 transition hover:bg-[#f5f2fb] focus-visible:outline-2 focus-visible:outline-[#5b2bd1] ${language === "zh" ? "text-[#381c8d]" : "text-[#99929f]"}`}
            onClick={() => setLanguage("zh")}
            aria-label={t("Simplified Chinese")}
            aria-pressed={language === "zh"}
            data-tooltip-label={t("Simplified Chinese")}
          >
            <Icon icon="circle-flags:cn" width="16" aria-hidden="true" /> <span className="hidden sm:inline">中文</span>
          </button>
        </div>
      </div>
    </header>
  );
}
