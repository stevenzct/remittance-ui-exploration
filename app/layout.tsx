import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { LanguageProvider } from "@/components/providers/language-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "UI Exploration",
  description: "Remittance ui exploration dashboard UI exploration.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <DashboardShell>{children}</DashboardShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
