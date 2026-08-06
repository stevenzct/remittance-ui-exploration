import type { Metadata } from "next";
import { RefinementsPage } from "@/components/revisions/revisions-page";

export const metadata: Metadata = {
  title: "Homepage Refinements | UI Exploration",
  description: "Explore the homepage UI refinements, applied feedback, and connected interactive prototype.",
};

export default function HomepageRefinementsPage() {
  return <RefinementsPage />;
}
