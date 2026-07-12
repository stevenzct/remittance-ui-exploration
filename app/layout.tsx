import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UI Exploration",
  description: "Remittance ui exploration dashboard UI exploration.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
