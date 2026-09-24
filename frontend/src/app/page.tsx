"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import {
  Briefcase,
  GraduationCap,
  Shield,
  Zap,
  ArrowRight,
  ShieldCheck,
  Radar,
  Sparkles,
  Layers,
  Award,
  Lock,
  EyeOff,
  FileCheck2,
  Cpu,
} from "lucide-react";

export default function HomePage() {
  const { setRole, credentials } = useStore();

  const sampleHash =
    credentials[0]?.hash ||
    "a4f89d3810c92bf2234e405e6081297e68cfb939e6a0d0a52479e0237d45f3ba";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in">
      {/* Hero Executive Banner */}
      <div className="relative rounded-3xl glass-panel-elevated border-cyan-500/30 p-8 sm:p-12 overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 text-xs font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>SkillSetu AI — Hackathon Engineering Edition v2.0</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Proof-of-Work Credential Trust Chain &{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
              Talent Radar
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            A deterministic, role-separated platform connecting employers, learners, and academic institutions.
            Eliminates resume spam via the{" "}
            <strong className="text-white">Weighted Deficit Resistance Model</strong>, closes 1–2 skill deltas with{" "}
            <strong className="text-amber-400">10-minute micro-sprints</strong>, and guarantees authenticity with{" "}
            <strong className="text-emerald-400 font-mono">tamper-proof SHA-256 credentials</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/employer"
              onClick={() => setRole("employer")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Briefcase className="w-4 h-4" />
              <span>Launch Employer Talent Radar</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/student"
              onClick={() => setRole("student")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white transition-all shadow-md"
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Launch Student Learning Engine</span>
            </Link>

            <Link
              href={`/verify/${sampleHash}`}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-mono text-cyan-400 hover:text-cyan-300 border border-cyan-800/80 bg-cyan-950/40 hover:bg-cyan-950/80 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Audit Public SHA-256 Hash</span>
            </Link>
          </div>
        </div>
      </div>

      {/* The 3 Core Role Portals (Section 1, 2, 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Role 1: Employer */}
        <Link
          href="/employer"
          onClick={() => setRole("employer")}
          className="group p-6 rounded-3xl glass-panel border-cyan-500/20 hover:border-cyan-500/60 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Section 1 • The Buyer Workflow
              </span>
              <h3 className="text-lg font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                Employer & Recruiter Suite
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Automated job description parsing into Critical (3.0) and Optional (1.0) nodes.
                Talent Radar segmented into Job-Ready (≥85%), Bridgeable (60–84%), and Mismatch.
              </p>
            </div>

            <div className="space-y-1.5 pt-2 text-[11px] font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>1-Click Gap Sprint Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>SHA-256 Proof-of-Work Audit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Blind Bias-Free Screening Mode</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>University NAAC / NIRF Analytics</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400">
            <span>Open Employer Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Role 2: Student */}
        <Link
          href="/student"
          onClick={() => setRole("student")}
          className="group p-6 rounded-3xl glass-panel border-emerald-500/20 hover:border-emerald-500/60 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Section 2 • Talent Supply Engine
              </span>
              <h3 className="text-lg font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
                Student & Learner Suite
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Resume spatial parsing, live job role delta radar, 10-minute micro-sprints with concept breakdown,
                real incident debugging, and 90s timed anti-cheat challenges.
              </p>
            </div>

            <div className="space-y-1.5 pt-2 text-[11px] font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Skill Gap Delta Radar</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>90s Countdown & Tab-Blur Anti-Cheat</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>SHA-256 Micro-Credential Minting</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Application Readiness Roadmap</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400">
            <span>Open Student Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Role 3: Admin & Institutional Oversight */}
        <Link
          href="/admin"
          onClick={() => setRole("admin")}
          className="group p-6 rounded-3xl glass-panel border-purple-500/20 hover:border-purple-500/60 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-semibold">
                Section 3 • Trust Governance
              </span>
              <h3 className="text-lg font-bold text-white mt-1 group-hover:text-purple-300 transition-colors">
                Admin & Institutional Portal
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Global immutable credential ledger, synonym taxonomy canonicalization, multi-tenant organization lifecycle,
                and conflict-of-interest sentinel.
              </p>
            </div>

            <div className="space-y-1.5 pt-2 text-[11px] font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>Immutable Credential Ledger</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>Skill Taxonomy Synonym Mapper</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Tenant Organization Management</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>Fraud & Conflict Sentinel</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-purple-400">
            <span>Open Admin Ledger</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Engineering Rigor & Architectural Guarantees (Section 4) */}
      <div className="rounded-3xl glass-panel border-slate-800 p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider">
              Section 4: Engineering Rigor & Cryptographic Guarantees
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Production-grade architecture ensuring high responsiveness and zero-trust verification.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800">
            FastAPI Contract Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold block">
              Ultra-Low Latency & Cache
            </span>
            <h4 className="font-semibold text-white">Sub-3.0s Engine & 100ms Cache</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Instant skill gap delta computation and offline cache fallback safeguards against network drops during live reviews.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block">
              Zero-Trust Math
            </span>
            <h4 className="font-semibold text-white">Deterministic SHA-256 Digest</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Cryptographic hashing over sorted canonical JSON payloads. Zero reliance on private vendor lock-in.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-mono text-purple-400 font-bold block">
              Multi-Tenant Isolation
            </span>
            <h4 className="font-semibold text-white">Org-Scoped Data Partitioning</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Complete organizational boundary isolation at the data query layer across corporate, staffing, and university tiers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
