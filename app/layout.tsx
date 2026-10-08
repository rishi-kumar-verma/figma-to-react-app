import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Figma → React AI Agent | Enterprise Code Generator",
  description:
    "Autonomous multi-agent platform for transforming Figma designs into production-ready React and Next.js applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-sky-500 selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
