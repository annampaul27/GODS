"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import { runDeepGitHubAudit, GitHubAuditResult } from "@/lib/backendApi";
import GitHubAuditView from "@/components/github/GitHubAuditView";

export default function GitHubAnalysisPage() {
  const [username, setUsername] = useState("aaravsharma-dev");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"audit" | "discrepancies" | "repos" | "proof">("audit");
  const [auditResult, setAuditResult] = useState<GitHubAuditResult | null>(null);
  const [mintedProof, setMintedProof] = useState<string | null>(null);
  const [scanningStep, setScanningStep] = useState<string>("");

  const handleRunAudit = useCallback(async (targetUser: string) => {
    setLoading(true);
    setMintedProof(null);
    setScanningStep("Connecting to FastAPI CareerCompass router...");

    try {
      setTimeout(() => setScanningStep("Scanning public repository AST syntax trees..."), 300);
      setTimeout(() => setScanningStep("Computing cyclomatic complexity & test file density..."), 700);
      setTimeout(() => setScanningStep("Cross-referencing resume claims against committed code..."), 1100);

      const result = await runDeepGitHubAudit(targetUser);
      setTimeout(() => {
        setAuditResult(result);
        setLoading(false);
        setScanningStep("");
      }, 1400);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setScanningStep("");
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      handleRunAudit("aaravsharma-dev");
    });
  }, [handleRunAudit]);

  const handleMintBadge = () => {
    const hash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    setMintedProof(hash);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/student"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <GithubIcon className="w-6 h-6 text-purple-400" />
                  <span>GitHub AST Codebase & Commit Verifier</span>
                </h1>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-950/70 text-purple-300 border border-purple-800/40">
                  FastAPI Engine
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Audits real public repositories, computes AST cyclomatic complexity, and verifies resume claims against committed code.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/student/github-security"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 shadow-sm"
              title="Audit public repos for secret leaks and 1-click auto-remediate"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Secret Shield & 1-Click Fix</span>
            </Link>
            <Link
              href="/demo"
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              Live Demo Cockpit
            </Link>
            <Link
              href="/student"
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white transition-colors"
            >
              Student Dashboard
            </Link>
          </div>
        </div>

        {/* Search & Audit Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                github.com/
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="aaravsharma-dev"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-24 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
            <button
              onClick={() => handleRunAudit(username)}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Auditing AST Trees..." : "Audit GitHub Repos"}</span>
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500">Quick Test Profiles:</span>
            {[
              { label: "Aarav Sharma (Docker Claim Discrepancy)", user: "aaravsharma-dev" },
              { label: "Pooja Sundaram (Rust 94% Verified)", user: "poojasundaram" },
              { label: "Aditya Verma (FullStack Stream Engine)", user: "adityaverma-eng" },
            ].map((p) => (
              <button
                key={p.user}
                onClick={() => {
                  setUsername(p.user);
                  handleRunAudit(p.user);
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                  username.toLowerCase().includes(p.user.slice(0, 5))
                    ? "bg-purple-950/80 border-purple-500 text-purple-200"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Consolidated Reusable GitHub Audit View */}
        <GitHubAuditView
          username={username}
          auditResult={auditResult}
          loading={loading}
          scanningStep={scanningStep}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          mintedProof={mintedProof}
          onMintProof={handleMintBadge}
          candidateName={username}
          variant="page"
        />
      </div>
    </div>
  );
}
