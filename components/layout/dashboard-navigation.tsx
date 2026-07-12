"use client";

import { useEffect, useState } from "react";
import { NAVIGATION_ITEMS } from "@/content/dashboard";
import { DashboardIcon } from "@/components/ui/dashboard-icon";
import { useLanguage } from "@/components/providers/language-provider";
import type { DashboardSectionId } from "@/types/dashboard";

interface DashboardNavigationProps {
  readonly onNavigate?: () => void;
}

const firstSection = NAVIGATION_ITEMS[0].id;
const lastSection = NAVIGATION_ITEMS[NAVIGATION_ITEMS.length - 1].id;

function sectionFromHash(): DashboardSectionId | null {
  const hash = window.location.hash.slice(1);
  return NAVIGATION_ITEMS.find((item) => item.id === hash)?.id ?? null;
}

export function DashboardNavigation({ onNavigate }: DashboardNavigationProps) {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<DashboardSectionId>(firstSection);

  useEffect(() => {
    let animationFrame = 0;

    const updateActiveSection = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const activationLine = Math.min(window.innerHeight * 0.28, 180);
        const isAtPageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
        let nextSection: DashboardSectionId = firstSection;

        if (isAtPageBottom) {
          nextSection = lastSection;
        } else {
          NAVIGATION_ITEMS.forEach((item) => {
            const section = document.getElementById(item.id);
            if (section && section.getBoundingClientRect().top <= activationLine) nextSection = item.id;
          });
        }

        setActiveSection((currentSection) => currentSection === nextSection ? currentSection : nextSection);
      });
    };

    const handleHashChange = () => {
      const hashSection = sectionFromHash();
      if (hashSection) setActiveSection(hashSection);
      updateActiveSection();
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <nav className="space-y-1" aria-label={t("Dashboard navigation")}>
      {NAVIGATION_ITEMS.map((item) => {
        const isActive = item.id === activeSection;

        return (
          <a
            key={item.id}
            href={item.href}
            aria-current={isActive ? "location" : undefined}
            onClick={() => {
              setActiveSection(item.id);
              onNavigate?.();
            }}
            className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${isActive ? "bg-[#f1edfb] text-[#381c8d]" : "text-[#706a76] hover:bg-[#f7f6f9] hover:text-[#381c8d]"}`}
          >
            <span className={`grid size-9 place-items-center rounded-xl ${isActive ? "bg-white shadow-sm" : "bg-[#f7f6f9]"}`}>
              <DashboardIcon icon={item.icon} width="20" />
            </span>
            {t(item.label)}
          </a>
        );
      })}
    </nav>
  );
}
