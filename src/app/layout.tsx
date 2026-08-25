import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SkillGap AI — AI-Powered Skill Gap Analysis & Career Intelligence",
  description:
    "Compare your current skills with the requirements of your target role. Get your career readiness score and discover exactly what you need to learn next.",
  keywords: [
    "Skill Gap Analysis",
    "Career Intelligence",
    "AI Career Coach",
    "Skill Readiness Score",
    "Developer Career Path",
    "Tech Skill Roadmap",
  ],
  authors: [{ name: "SkillGap AI Team" }],
  openGraph: {
    title: "SkillGap AI — Know Exactly What You're Missing",
    description:
      "AI-powered skill gap analysis platform helping students, developers, and professionals land their target role.",
    type: "website",
    siteName: "SkillGap AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillGap AI — Know Exactly What You're Missing",
    description:
      "Compare your current skills with the requirements of your target role.",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf9ff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#FAF9FF] text-slate-900 antialiased selection:bg-indigo-500/20 selection:text-indigo-700 flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
