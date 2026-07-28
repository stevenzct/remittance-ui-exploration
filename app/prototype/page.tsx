import type { Metadata } from "next";
import { PrototypeSection } from "@/components/sections/prototype-section";

export const metadata: Metadata = {
  title: "Interactive Prototype | UI Exploration",
  description: "Explore and test the interactive Payso remittance application prototype.",
};

export default function PrototypePage() {
  return <PrototypeSection />;
}
