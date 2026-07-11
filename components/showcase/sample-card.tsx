import { DASHBOARD_THEME } from "@/content/dashboard";
import { PhoneMockup } from "@/components/showcase/phone-mockup";
import type { ShowcaseSample } from "@/types/dashboard";

interface SampleCardProps {
  readonly sample: ShowcaseSample;
  readonly number: number;
}

export function SampleCard({ sample, number }: SampleCardProps) {
  return (
    <article className="grid items-center gap-8 rounded-[28px] bg-[#faf9fc] p-5 sm:p-8 lg:grid-cols-[minmax(300px,.8fr)_1fr] lg:p-10">
      <div className="flex min-h-[620px] items-center justify-center rounded-[26px] bg-white p-7 shadow-[inset_0_0_0_1px_#ece9f1] sm:min-h-[730px]">
        <PhoneMockup src={sample.image} alt={sample.title} />
      </div>
      <div className="max-w-xl">
        <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-[#381c8d] text-base font-bold text-white shadow-[0_12px_28px_rgba(56,28,141,.2)]">{String(number).padStart(2, "0")}</div>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#ba3245]">{DASHBOARD_THEME.label} · {sample.label}</p>
        <h3 className="mt-3 text-3xl font-bold tracking-[-0.045em] text-[#201b26] sm:text-5xl">{sample.title}</h3>
        <p className="mt-4 text-base leading-7 text-[#7b7580]">{sample.description}</p>
        <div className="mt-7 flex flex-wrap gap-2">{sample.tags.map((tag) => <span key={tag} className="rounded-full border border-[#e4dfe9] bg-white px-3 py-2 text-xs font-semibold text-[#5a5261]">{tag}</span>)}</div>
      </div>
    </article>
  );
}
