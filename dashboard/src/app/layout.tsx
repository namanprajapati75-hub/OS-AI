import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PhaseAI — Business OS",
  description: "Autonomous AI Operating System for your startup",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#030712] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
