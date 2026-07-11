import { SHOWCASE_THEMES } from "@/content/dashboard";
import { SampleCarousel } from "@/components/showcase/sample-carousel";

export function ShowcaseSection() {
  return (
    <section id="showcase" className="overflow-hidden rounded-[24px] border border-[#ece9f1] bg-white p-4 shadow-[0_18px_50px_rgba(37,27,57,.05)] sm:rounded-[32px] sm:p-8 lg:p-10">
      <div className="mb-7">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#381c8d]">UI Showcase</p>
          <h2 className="mt-2 text-3xl font-bold tracking-[-0.045em] sm:text-4xl">Compare each direction</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#807985]">Compare both visual themes without moving the surrounding page. Choose a theme, then use Previous or Next to update only the phone image and details.</p>
        </div>
      </div>

      <SampleCarousel themes={SHOWCASE_THEMES} />
    </section>
  );
}
