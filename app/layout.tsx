import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Payso Merchant — UI Exploration",
  description: "Payso Merchant remittance dashboard UI exploration.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
