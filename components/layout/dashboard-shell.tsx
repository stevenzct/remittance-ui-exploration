import type { ReactNode } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

interface DashboardShellProps {
  readonly children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f7fa] lg:grid lg:grid-cols-[272px_1fr]">
      <DashboardSidebar />
      <main className="min-w-0">
        <DashboardHeader />
        <div className="mx-auto max-w-[1500px] space-y-5 p-3 sm:space-y-7 sm:p-7 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
