import Image from "next/image";
import oldUiReview from "@/assets/revisionsold-ui-review-enhanced.png";
import { DASHBOARD_ICONS } from "@/content/dashboard";
import { PhoneMockup } from "@/components/showcase/phone-mockup";
import { DashboardIcon } from "@/components/ui/dashboard-icon";

export function RevisionOverview() {
  return (
    <div id="refinement-comparison" aria-label="Old and updated homepage comparison" className="refinement-comparison scroll-mt-24 p-5 sm:p-9 lg:p-12">
      <div className="mx-auto w-full max-w-[52rem]">
        <figure className="min-w-0">
          <figcaption className="mb-6 flex items-center justify-between gap-4 rounded-[20px] border border-[#e5e1e8] bg-[#f6f4f7] px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-xs font-bold text-[#6f6874] shadow-[0_5px_16px_rgba(37,27,57,.07)] sm:size-12 sm:rounded-2xl">
                01
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#8a838e]">Before refinement</p>
                <h3 className="mt-1 text-xl font-bold tracking-[-.035em] text-[#29242d] sm:text-2xl">Old UI</h3>
              </div>
            </div>
            <span className="hidden rounded-full border border-[#e1dce5] bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#756e7a] sm:inline-flex">
              Original review
            </span>
          </figcaption>
          <div className="relative overflow-hidden rounded-[22px] bg-[#d5d5d5] shadow-[0_16px_42px_rgba(37,27,57,.12)] sm:rounded-[24px]">
            <Image
              src={oldUiReview}
              alt="Annotated review of the old Payso homepage UI"
              sizes="(min-width: 1024px) 52rem, 92vw"
              className="h-auto w-full"
              priority
            />
            <span
              className="pointer-events-none absolute left-[31%] top-[11.5%] z-10 w-[13.85%] border-t border-dashed border-[#8f8c91]"
              aria-hidden="true"
            />
          </div>
        </figure>

        <div className="relative my-8 flex items-center justify-center sm:my-10" aria-hidden="true">
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#cad9f7] to-transparent" />
          <span className="relative grid size-11 place-items-center rounded-full border border-[#d5e1ff] bg-white text-[#2853bb] shadow-[0_8px_24px_rgba(40,83,187,.12)] sm:size-12">
            <span className="rotate-90">
              <DashboardIcon icon={DASHBOARD_ICONS.ctaArrow} width="18" />
            </span>
          </span>
        </div>

        <figure className="min-w-0">
          <figcaption className="mb-6 flex items-center justify-between gap-4 rounded-[20px] border border-[#dce7fb] bg-[linear-gradient(135deg,#ffffff_0%,#f6f9fe_100%)] px-4 py-4 shadow-[0_10px_30px_rgba(40,83,187,.06)] sm:px-6 sm:py-5">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#2853bb] text-xs font-bold text-white shadow-[0_8px_20px_rgba(40,83,187,.22)] sm:size-12 sm:rounded-2xl">
                02
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#2853bb]">After refinement</p>
                <h3 className="mt-1 text-xl font-bold tracking-[-.035em] text-[#424242] sm:text-2xl">Updated prototype</h3>
              </div>
            </div>
            <span className="hidden rounded-full border border-[#d5e1ff] bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#2853bb] shadow-[0_4px_14px_rgba(40,83,187,.06)] sm:inline-flex">
              Current design
            </span>
          </figcaption>
          <div className="revision-phone-stage flex min-w-0 items-center justify-center overflow-hidden py-6 sm:py-10">
            <div className="relative z-10 flex w-full justify-center">
              <PhoneMockup
                src="/assets/prototype-reference.png"
                alt="Updated Payso homepage prototype"
                className="revision-phone-shell"
                preview={false}
              />
            </div>
          </div>
        </figure>
      </div>
    </div>
  );
}
