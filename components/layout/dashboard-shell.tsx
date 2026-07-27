import type { ReactNode } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

interface DashboardShellProps {
  readonly children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[272px_1fr]">
      <DashboardSidebar />
      <main className="dashboard-main min-w-0">
        <DashboardHeader />
        <div className="mx-auto max-w-[1500px] space-y-4 px-3 pb-8 pt-3 sm:space-y-8 sm:p-7 lg:space-y-10 lg:p-10 xl:p-12">{children}</div>
      </main>
    </div>
  );
}
