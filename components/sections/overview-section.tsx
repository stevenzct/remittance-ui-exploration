import { DASHBOARD_ICONS } from "@/content/dashboard";
import { PhoneMockup } from "@/components/showcase/phone-mockup";
import { DashboardIcon } from "@/components/ui/dashboard-icon";

export function OverviewSection() {
  return (
    <section id="overview" className="overflow-hidden rounded-[32px] border border-[#ece9f1] bg-white p-6 shadow-[0_18px_50px_rgba(37,27,57,.05)] sm:p-9 lg:p-11">
      <div className="grid items-center gap-10 xl:grid-cols-[1fr_.9fr]">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f1edfb] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#381c8d]">
            <DashboardIcon icon={DASHBOARD_ICONS.overviewBadge} width="16" />
            UI Design Exploration
          </span>
          <h2 className="mt-6 text-4xl font-bold leading-[.98] tracking-[-0.055em] text-[#1d1822] sm:text-6xl lg:text-7xl">
            A cleaner way to explore <span className="text-[#381c8d]">Payso.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#77717f] sm:text-lg">Five mobile interface variations presented in a focused, white-first dashboard designed for easier comparison and review.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#showcase" className="inline-flex items-center gap-2 rounded-2xl bg-[#381c8d] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(56,28,141,.22)]">
              Explore samples <DashboardIcon icon={DASHBOARD_ICONS.ctaArrow} width="18" />
            </a>
            <a href="#brand" className="inline-flex items-center gap-2 rounded-2xl border border-[#ded9e5] bg-white px-5 py-3 text-sm font-bold text-[#4f4856]">
              View brand system
            </a>
          </div>
        </div>

        <div className="relative mx-auto flex min-h-[560px] w-full max-w-[620px] items-center justify-center overflow-hidden rounded-[30px] bg-[#f4f1fa] p-8 sm:min-h-[650px]">
          <div className="absolute left-[8%] top-[12%] size-28 rounded-full bg-[#ba3245]/10 blur-2xl" />
          <div className="absolute bottom-[8%] right-[8%] size-40 rounded-full bg-[#381c8d]/10 blur-3xl" />
          <PhoneMockup src="/assets/sample-01.png" alt="Bold Active Navigation" priority className="relative z-10 -rotate-3" />
        </div>
      </div>
    </section>
  );
}
