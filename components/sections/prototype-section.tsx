import { RemittancePrototype } from "@/components/prototype/remittance-prototype";

export function PrototypeSection() {
  return (
    <section id="prototype" className="ui-surface scroll-mt-24 overflow-hidden rounded-[26px] p-3 sm:rounded-[36px] sm:p-9 lg:p-12 xl:p-14">
      <RemittancePrototype />
    </section>
  );
}
