import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "TWIN AI — Digital Twin of India's Climate",
  description:
    "AI-Powered Digital Twin platform for monitoring, predicting and simulating India's climate, agriculture, disaster management and government planning.",
  keywords: ["Digital Twin", "India", "Climate", "AI", "ISRO", "Agriculture"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased transition-colors duration-300">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storageKey = "twin-ai-theme";
                  var theme = localStorage.getItem(storageKey);
                  if (theme !== "light" && theme !== "dark") {
                    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                  }
                  document.documentElement.dataset.theme = theme;
                  document.documentElement.style.colorScheme = theme;
                } catch (error) {}
              })();
            `,
          }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
