import type { Metadata } from "next";
import { PrototypeV1Page } from "@/components/prototype-v1/prototype-v1-page";

export const metadata: Metadata = {
  title: "Prototype V1 | UI Exploration",
  description: "First-launch Payso mobile application prototype.",
};

export default function PrototypeV1Route() {
  return <PrototypeV1Page />;
}
