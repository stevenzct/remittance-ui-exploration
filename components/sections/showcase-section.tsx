import { SHOWCASE_SAMPLES } from "@/content/dashboard";
import { SampleCard } from "@/components/showcase/sample-card";
import { SampleCarousel } from "@/components/showcase/sample-carousel";

export function ShowcaseSection() {
  return (
    <section id="showcase" className="rounded-[32px] border border-[#ece9f1] bg-white p-5 shadow-[0_18px_50px_rgba(37,27,57,.05)] sm:p-8 lg:p-10">
      <div className="mb-7">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#381c8d]">UI Showcase</p>
          <h2 className="mt-2 text-3xl font-bold tracking-[-0.045em] sm:text-4xl">Compare each direction</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#807985]">Swipe through the five interface studies. Each screen keeps its original content inside the same phone frame for a consistent review.</p>
        </div>
      </div>

      <SampleCarousel slideIds={SHOWCASE_SAMPLES.map((sample) => sample.id)}>
        {SHOWCASE_SAMPLES.map((sample, index) => (
          <SampleCard key={sample.id} sample={sample} number={index + 1} total={SHOWCASE_SAMPLES.length} />
        ))}
      </SampleCarousel>
    </section>
  );
}
