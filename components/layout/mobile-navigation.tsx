"use client";

import Image from "next/image";
import { useState } from "react";
import {
  DASHBOARD_ICONS,
  DASHBOARD_THEME,
  NAVIGATION_ITEMS,
} from "@/content/dashboard";
import { DashboardIcon } from "@/components/ui/dashboard-icon";

const drawerId = "mobile-navigation-drawer";

export function MobileNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="grid size-10 place-items-center rounded-2xl border border-[#ece9f1] bg-white text-[#381c8d] lg:hidden"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
        aria-expanded={menuOpen}
        aria-controls={drawerId}
      >
        <DashboardIcon icon={DASHBOARD_ICONS.openMenu} width="22" />
      </button>

      <aside
        id={drawerId}
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-[#ece9f1] bg-white p-5 transition-transform duration-300 lg:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!menuOpen}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#ece9f1] px-2 pb-4">
          <Image src="/payso-logo.svg" alt="Payso Merchant" width={159} height={46} priority className="h-10 w-auto object-contain" />
          <button type="button" className="grid size-9 place-items-center rounded-xl text-[#5d5765] hover:bg-[#f5f3f8] lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <DashboardIcon icon={DASHBOARD_ICONS.closeMenu} width="24" />
          </button>
        </div>

        <p className="px-3 pb-2 pt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#aaa4b1]">Workspace</p>
        <nav className="space-y-1" aria-label="Dashboard navigation">
          {NAVIGATION_ITEMS.map((item, index) => (
            <a key={item.id} href={item.href} onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${index === 0 ? "bg-[#f1edfb] text-[#381c8d]" : "text-[#706a76] hover:bg-[#f7f6f9] hover:text-[#381c8d]"}`}>
              <span className={`grid size-9 place-items-center rounded-xl ${index === 0 ? "bg-white shadow-sm" : "bg-[#f7f6f9]"}`}>
                <DashboardIcon icon={item.icon} width="20" />
              </span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-auto rounded-3xl border border-[#ece9f1] bg-[#faf9fc] p-4">
          <div className="mb-3 grid size-10 place-items-center rounded-2xl bg-[#381c8d] text-white">
            <DashboardIcon icon={DASHBOARD_ICONS.themeSummary} width="22" />
          </div>
          <p className="text-sm font-bold text-[#24202a]">{DASHBOARD_THEME.label} · {DASHBOARD_THEME.name}</p>
          <p className="mt-1 text-xs leading-5 text-[#837d89]">{DASHBOARD_THEME.summary}</p>
        </div>
      </aside>

      {menuOpen && <button type="button" className="fixed inset-0 z-40 bg-[#1e1729]/25 backdrop-blur-sm lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close menu overlay" />}
    </>
  );
}
