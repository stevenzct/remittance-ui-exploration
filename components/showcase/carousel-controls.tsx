"use client";

import { DASHBOARD_ICONS } from "@/content/dashboard";
import { DashboardIcon } from "@/components/ui/dashboard-icon";

interface CarouselControlsProps {
  readonly current: number;
  readonly total: number;
  readonly isFirst: boolean;
  readonly isLast: boolean;
  readonly previousLabel: "Previous" | "Previous theme";
  readonly nextLabel: "Next" | "Next theme";
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly accent: "blue" | "rose" | "royal";
}

export function CarouselControls({
  current,
  total,
  isFirst,
  isLast,
  previousLabel,
  nextLabel,
  onPrevious,
  onNext,
  accent,
}: CarouselControlsProps) {
  const accentTextClassName = accent === "rose" ? "text-[#ba3245]" : accent === "royal" ? "text-[#2853bb]" : "text-[#381c8d]";
  const primaryButtonClassName = accent === "rose"
    ? "bg-[#ba3245] shadow-[0_10px_24px_rgba(186,50,69,.2)] hover:bg-[#a72b3d]"
    : accent === "royal"
      ? "bg-[#2853bb] shadow-[0_10px_24px_rgba(40,83,187,.2)] hover:bg-[#22469d]"
      : "bg-[#381c8d] shadow-[0_10px_24px_rgba(56,28,141,.2)] hover:bg-[#4b27a7]";

  return (
    <div className="mt-8 flex flex-col gap-4 border-t border-[#e4dfe9] pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs font-semibold text-[#8c8592]">
        Sample <span className={accentTextClassName}>{String(current).padStart(2, "0")}</span> of {String(total).padStart(2, "0")}
      </p>
      <div className="grid min-w-0 grid-cols-2 gap-2 sm:flex">
        <button
          type="button"
          className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-2xl border border-[#d9d3e2] bg-white px-2 text-xs font-bold text-[#4f4856] transition hover:border-[#bdb2d1] hover:bg-[#f5f2fb] disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
          onClick={onPrevious}
          disabled={isFirst}
          aria-label={previousLabel === "Previous theme" ? "Go to the previous theme" : "Previous sample"}
        >
          <DashboardIcon icon={DASHBOARD_ICONS.previousSample} width="18" />
          {previousLabel}
        </button>
        <button
          type="button"
          className={`inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-2xl px-2 text-xs font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none sm:px-5 sm:text-sm ${primaryButtonClassName}`}
          onClick={onNext}
          disabled={isLast}
          aria-label={nextLabel === "Next theme" ? "Go to the next theme" : "Next sample"}
        >
          {nextLabel}
          <DashboardIcon icon={DASHBOARD_ICONS.ctaArrow} width="18" />
        </button>
      </div>
    </div>
  );
}
