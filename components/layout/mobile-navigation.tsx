"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DASHBOARD_ICONS,
  DASHBOARD_THEME,
} from "@/content/dashboard";
import { DashboardNavigation } from "@/components/layout/dashboard-navigation";
import { DashboardIcon } from "@/components/ui/dashboard-icon";
import { useLanguage } from "@/components/providers/language-provider";

const drawerId = "mobile-navigation-drawer";

export function MobileNavigation() {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) {
      if (wasOpenRef.current) {
        wasOpenRef.current = false;
        triggerRef.current?.focus({ preventScroll: true });
      }

      return;
    }

    wasOpenRef.current = true;
    const previousBodyOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      event.preventDefault();
      closeMenu();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, menuOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="ui-button grid size-11 min-h-11 shrink-0 place-items-center rounded-2xl border border-[#e8e3ef] bg-white text-[#381c8d] shadow-[0_6px_18px_rgba(37,27,57,.05)] sm:size-10 sm:min-h-10 lg:hidden"
        onClick={() => setMenuOpen(true)}
        aria-label={t("Open menu")}
        aria-expanded={menuOpen}
        aria-controls={drawerId}
      >
        <DashboardIcon icon={DASHBOARD_ICONS.openMenu} width="22" />
      </button>

      <aside
        id={drawerId}
        className={`fixed left-0 top-0 z-50 flex h-dvh w-[min(272px,calc(100vw-1.5rem))] flex-col overflow-y-auto overscroll-contain border-r border-[#ece9f1] bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] transition-transform duration-300 sm:px-5 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pt-[max(1.25rem,env(safe-area-inset-top))] lg:hidden ${menuOpen ? "pointer-events-auto translate-x-0" : "pointer-events-none -translate-x-full"}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#ece9f1] px-2 pb-4">
          <Image src="/payso-logo.svg" alt="Payso logo" width={159} height={46} priority className="h-10 w-auto object-contain" />
          <button type="button" className="ui-button grid size-11 min-h-11 place-items-center rounded-2xl text-[#5d5765] hover:bg-[#f5f3f8] lg:hidden" onClick={closeMenu} aria-label={t("Close menu")}>
            <DashboardIcon icon={DASHBOARD_ICONS.closeMenu} width="24" />
          </button>
        </div>

        <p className="px-3 pb-2 pt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#aaa4b1]">{t("Workspace")}</p>
        <DashboardNavigation onNavigate={closeMenu} />

        <div className="mt-auto shrink-0 rounded-3xl border border-[#ece9f1] bg-[#faf9fc] p-4">
          <div className="mb-3 grid size-10 place-items-center rounded-2xl bg-[#381c8d] text-white">
            <DashboardIcon icon={DASHBOARD_ICONS.themeSummary} width="22" />
          </div>
          <p className="text-sm font-bold text-[#24202a]">{t(DASHBOARD_THEME.name)}</p>
          <p className="mt-1 text-xs leading-5 text-[#837d89]">{t(DASHBOARD_THEME.summary)}</p>
        </div>
      </aside>

      {menuOpen && <button type="button" className="fixed inset-0 z-40 bg-[#1e1729]/25 backdrop-blur-sm lg:hidden" onClick={closeMenu} aria-label={t("Close menu overlay")} />}
    </>
  );
}
