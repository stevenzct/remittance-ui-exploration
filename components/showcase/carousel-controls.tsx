"use client";

import { useEffect, useState } from "react";
import { useSwiper } from "swiper/react";
import { DASHBOARD_ICONS } from "@/content/dashboard";
import { DashboardIcon } from "@/components/ui/dashboard-icon";

interface CarouselControlsProps {
  readonly current: number;
  readonly total: number;
}

export function CarouselControls({ current, total }: CarouselControlsProps) {
  const swiper = useSwiper();
  const [isBeginning, setIsBeginning] = useState(swiper.isBeginning);
  const [isEnd, setIsEnd] = useState(swiper.isEnd);

  useEffect(() => {
    const updateState = () => {
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    };

    updateState();
    swiper.on("slideChange", updateState);
    swiper.on("reachBeginning", updateState);
    swiper.on("reachEnd", updateState);

    return () => {
      swiper.off("slideChange", updateState);
      swiper.off("reachBeginning", updateState);
      swiper.off("reachEnd", updateState);
    };
  }, [swiper]);

  return (
    <div className="mt-8 flex flex-col gap-4 border-t border-[#e4dfe9] pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs font-semibold text-[#8c8592]">
        Sample <span className="text-[#381c8d]">{String(current).padStart(2, "0")}</span> of {String(total).padStart(2, "0")}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:flex">
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[#d9d3e2] bg-white px-4 text-sm font-bold text-[#4f4856] transition hover:border-[#bdb2d1] hover:bg-[#f5f2fb] disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => swiper.slidePrev()}
          disabled={isBeginning}
          aria-label="Previous sample"
        >
          <DashboardIcon icon={DASHBOARD_ICONS.previousSample} width="18" />
          Previous
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#381c8d] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(56,28,141,.2)] transition hover:bg-[#4b27a7] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          onClick={() => swiper.slideNext()}
          disabled={isEnd}
          aria-label="Next sample"
        >
          Next
          <DashboardIcon icon={DASHBOARD_ICONS.ctaArrow} width="18" />
        </button>
      </div>
    </div>
  );
}
