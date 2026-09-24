import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Navbar from "@/components/layout/Navbar";
import ToastContainer from "@/components/layout/ToastContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillSetu AI — Cryptographic Skill Gap & Verified Talent Engine",
  description:
    "Role-Separated Multi-Tenant Talent Infrastructure: Employer Talent Radar, Proof-of-Work Credential Trust Chain, and Targeted 10-Minute Micro-Learning Sprints.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full`}>
      <body className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
        <StoreProvider>
          <div className="relative min-h-screen flex flex-col bg-grid-pattern">
            <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />
            <Navbar />
            <main className="flex-1 relative z-10">{children}</main>
            <ToastContainer />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
