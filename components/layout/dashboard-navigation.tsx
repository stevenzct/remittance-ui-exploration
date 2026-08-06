"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS } from "@/content/dashboard";
import { DashboardIcon } from "@/components/ui/dashboard-icon";
import { useLanguage } from "@/components/providers/language-provider";
import type { DashboardSectionId } from "@/types/dashboard";

interface DashboardNavigationProps {
  readonly onNavigate?: () => void;
}

const pageSectionItems = NAVIGATION_ITEMS.filter((item) => item.href.startsWith("/#"));
const firstSection = pageSectionItems[0].id;
const lastSection = pageSectionItems[pageSectionItems.length - 1].id;

function sectionFromHash(): DashboardSectionId | null {
  const hash = window.location.hash.slice(1);
  return NAVIGATION_ITEMS.find((item) => item.id === hash)?.id ?? null;
}

export function DashboardNavigation({ onNavigate }: DashboardNavigationProps) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<DashboardSectionId>(firstSection);
  const visibleActiveSection = pathname === "/prototype"
    ? "prototype"
    : pathname === "/refinements" || pathname === "/revisions"
      ? "refinements"
      : activeSection;

  useEffect(() => {
    if (pathname !== "/") return;

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
  }, [pathname]);

  return (
    <nav className="space-y-1" aria-label={t("Dashboard navigation")}>
      {NAVIGATION_ITEMS.map((item) => {
        const isActive = item.id === visibleActiveSection;

        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={isActive ? "location" : undefined}
            onClick={() => {
              setActiveSection(item.id);
              onNavigate?.();
            }}
            className={`flex min-h-12 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#5b2bd1]/25 ${isActive ? "bg-[#f1edfb] text-[#381c8d] shadow-[inset_0_0_0_1px_rgba(91,43,209,.06)]" : "text-[#706a76] hover:translate-x-0.5 hover:bg-[#f7f6f9] hover:text-[#381c8d]"}`}
          >
            <span className={`grid size-9 place-items-center rounded-xl ${isActive ? "bg-white shadow-sm" : "bg-[#f7f6f9]"}`}>
              <DashboardIcon icon={item.icon} width="20" />
            </span>
            {t(item.label)}
          </Link>
        );
      })}
    </nav>
  );
}
