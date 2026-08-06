import type { Metadata } from "next";
import { WireframesPage } from "@/components/wireframes/wireframes-page";

export const metadata: Metadata = {
  title: "Homepage Wireframes | UI Exploration",
  description: "Review the low-fidelity homepage wireframes and work-country selection flow for the Payso remittance app.",
};

export default function HomepageWireframesPage() {
  return <WireframesPage />;
}
