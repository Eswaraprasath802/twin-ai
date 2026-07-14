import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "TWIN AI — Digital Twin of India's Climate",
  description:
    "AI-Powered Digital Twin platform for monitoring, predicting and simulating India's climate, agriculture, disaster management and government planning.",
  keywords: ["Digital Twin", "India", "Climate", "AI", "ISRO", "Agriculture"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-space-950 text-slate-200 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
