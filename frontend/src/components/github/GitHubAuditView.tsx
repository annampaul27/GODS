"use client";

import React from "react";
import {
  Code2,
  AlertTriangle,
  Layers,
  Cpu,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Zap,
  Award,
  ShieldCheck,
} from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import { GitHubAuditResult } from "@/lib/api";

export interface GitHubAuditViewProps {
  username: string;
  auditResult: GitHubAuditResult | null;
  loading: boolean;
  scanningStep?: string;
  activeTab: "audit" | "discrepancies" | "repos" | "proof";
  onTabChange: (tab: "audit" | "discrepancies" | "repos" | "proof") => void;
  mintedProof: string | null;
  onMintProof: () => void;
  candidateName?: string;
  variant?: "modal" | "page";
}

export const GitHubAuditView: React.FC<GitHubAuditViewProps> = ({
  username,
  auditResult,
  loading,
  scanningStep = "",
  activeTab,
  onTabChange,
  mintedProof,
  onMintProof,
  candidateName = "Aarav Sharma",
  variant = "page",
}) => {
  const isModal = variant === "modal";

  return (
    <div className="space-y-6">
      {/* Tab Controls */}
      <div className={`flex border-b border-slate-800 ${isModal ? "px-2" : "px-2"}`}>
        {[
          { id: "audit", label: "📊 AST Overview & Score", icon: Code2 },
          { id: "discrepancies", label: "🚨 Resume vs Code Discrepancies", icon: AlertTriangle },
          { id: "repos", label: "📦 Audited Repositories", icon: Layers },
          { id: "proof", label: "🛡️ Mint SHA-256 Proof", icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as "audit" | "discrepancies" | "repos" | "proof")}
              className={`flex items-center gap-2 py-3 px-4 ${
                isModal ? "text-xs" : "text-sm"
              } font-medium border-b-2 transition-colors ${
                isActive
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className={isModal ? "w-3.5 h-3.5" : "w-4 h-4"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div
          className={`${
            isModal ? "py-16" : "py-24"
          } flex flex-col items-center justify-center text-center space-y-4 rounded-2xl bg-slate-900/30 border border-slate-800`}
        >
          <div className="relative">
            <div
              className={`${
                isModal ? "w-12 h-12" : "w-16 h-16"
              } rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin`}
            />
            <GithubIcon
              className={`${
                isModal ? "w-6 h-6" : "w-8 h-8"
              } text-purple-400 absolute inset-0 m-auto`}
            />
          </div>
          <div className="space-y-1">
            <p className={`${isModal ? "text-sm" : "text-base"} font-semibold text-white`}>
              Auditing Codebase for @{username}
            </p>
            <p className="text-xs text-purple-400 font-mono animate-pulse">
              {scanningStep || "Parsing AST syntaxes and calculating code metrics..."}
            </p>
          </div>
        </div>
      ) : auditResult ? (
        <div className="space-y-6">
          {/* TAB 1: AST OVERVIEW */}
          {activeTab === "audit" && (
            <div className="space-y-6">
              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div
                  className={`${
                    isModal ? "p-4" : "p-5"
                  } rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1`}
                >
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                    AST Code Quality
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className={`${isModal ? "text-2xl" : "text-3xl"} font-bold text-white`}>
                      {auditResult.overallScore}/100
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Grade {auditResult.grade}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Across {auditResult.repoCount} public repositories
                  </p>
                </div>

                <div
                  className={`${
                    isModal ? "p-4" : "p-5"
                  } rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1`}
                >
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                    Cyclomatic Complexity
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`${
                        isModal ? "text-2xl" : "text-3xl"
                      } font-bold text-emerald-400`}
                    >
                      {auditResult.astComplexityScore}
                    </span>
                    <span className="text-xs text-emerald-300 font-medium">Clean / Low</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Modular functions & clean architecture
                  </p>
                </div>

                <div
                  className={`${
                    isModal ? "p-4" : "p-5"
                  } rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1`}
                >
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                    Verified Velocity
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`${
                        isModal ? "text-2xl" : "text-3xl"
                      } font-bold text-indigo-400`}
                    >
                      {auditResult.commitConsistency.last90DaysCommits}
                    </span>
                    <span className="text-xs text-slate-400">/ 90 days</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {auditResult.commitConsistency.activeDays} active days · organic commits
                  </p>
                </div>

                <div
                  className={`${
                    isModal ? "p-4" : "p-5"
                  } rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1`}
                >
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                    Test Coverage
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className={`${isModal ? "text-2xl" : "text-3xl"} font-bold text-cyan-400`}>
                      {auditResult.testCoverageEstimate}%
                    </span>
                    <span className="text-xs text-cyan-300 font-medium">High Density</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Unit & integration test suites detected
                  </p>
                </div>
              </div>

              {/* Language Distribution */}
              <div
                className={`${
                  isModal ? "p-5" : "p-6"
                } rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-purple-400" />
                    <span>Verified Programming Languages</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    FastAPI Backend: {auditResult.backendSource}
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                  {auditResult.verifiedLanguages.map((lang) => (
                    <div
                      key={lang.name}
                      style={{
                        width: `${lang.percentage}%`,
                        backgroundColor: lang.color,
                      }}
                      className="h-full transition-all duration-500"
                      title={`${lang.name}: ${lang.percentage}%`}
                    />
                  ))}
                </div>

                <div className="flex flex-wrap gap-5 pt-1">
                  {auditResult.verifiedLanguages.map((lang) => (
                    <div key={lang.name} className="flex items-center gap-2 text-xs">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: lang.color }}
                      />
                      <span className="text-slate-200 font-medium">{lang.name}</span>
                      <span className="text-slate-400 font-mono">{lang.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frameworks & Tooling */}
              <div
                className={`${
                  isModal ? "p-5" : "p-6"
                } rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3`}
              >
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <span>Verified Frameworks & Infrastructure</span>
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {auditResult.verifiedFrameworks.map((fw) => (
                    <span
                      key={fw}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{fw}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RESUME VS CODE DISCREPANCIES */}
          {activeTab === "discrepancies" && (
            <div className="space-y-4">
              <div
                className={`${
                  isModal ? "p-4" : "p-5"
                } rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Resume Claim vs. Actual GitHub Verification</span>
                  </h3>
                  <span className="text-xs font-mono text-purple-400 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800/40">
                    Anti-Fraud Verification Active
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  Compares skills claimed on candidate resumes against their public code commits, AST import statements, and repository structures.
                </p>
              </div>

              <div className="space-y-3">
                {auditResult.discrepancies.map((item, idx) => {
                  const isVerified = item.status === "verified";
                  const isDiscrepancy = item.status === "discrepancy";
                  return (
                    <div
                      key={idx}
                      className={`p-5 rounded-2xl border transition-all ${
                        isVerified
                          ? "bg-emerald-950/10 border-emerald-800/40"
                          : isDiscrepancy
                          ? "bg-rose-950/20 border-rose-800/60"
                          : "bg-amber-950/10 border-amber-800/40"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          {isVerified ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                          ) : isDiscrepancy ? (
                            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                          )}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white">
                                {item.skill}
                              </span>
                              <span
                                className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                  isVerified
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                    : isDiscrepancy
                                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                              {item.evidence}
                            </p>
                          </div>
                        </div>

                        <div className="sm:text-right shrink-0">
                          <span className="text-xs text-slate-400 block">
                            Resume: {item.claimedOnResume ? "Claimed" : "Not Claimed"}
                          </span>
                          <span
                            className={`text-xs font-semibold block ${
                              item.verifiedInGithub ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            GitHub: {item.verifiedInGithub ? "VERIFIED" : "UNVERIFIED"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: AUDITED REPOSITORIES */}
          {activeTab === "repos" && (
            <div className="space-y-4">
              {auditResult.auditedRepos.map((repo, idx) => (
                <div
                  key={idx}
                  className={`${
                    isModal ? "p-5" : "p-6"
                  } rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-base font-semibold text-white font-mono">
                          {repo.name}
                        </span>
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {repo.primaryLanguage}
                        </span>
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Score {repo.codeQualityScore}/100
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">{repo.summary}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="font-mono text-slate-500">
                        {repo.linesOfCode.toLocaleString()} LOC · {repo.testFilesDetected} Tests
                      </span>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* AI Resume Bullets */}
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                      <span className="text-xs font-semibold text-purple-400 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI-Generated Resume Bullet Points</span>
                      </span>
                      <ul className="space-y-2">
                        {repo.resumeBullets.map((bullet, bIdx) => (
                          <li
                            key={bIdx}
                            className="text-xs text-slate-300 flex items-start gap-2"
                          >
                            <span className="text-purple-400 font-bold">·</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Improvements */}
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                      <span className="text-xs font-semibold text-indigo-400 flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5" />
                        <span>AST Refactor & Production Enhancements</span>
                      </span>
                      <ul className="space-y-2">
                        {repo.improvements.map((imp, iIdx) => (
                          <li
                            key={iIdx}
                            className="text-xs text-slate-400 flex items-start gap-2"
                          >
                            <span className="text-indigo-400 font-bold">→</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: MINT SHA-256 PROOF */}
          {activeTab === "proof" && (
            <div className="max-w-xl mx-auto py-8 text-center space-y-6">
              <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">
                  Mint Verified GitHub Code Credential
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Issue a tamper-proof cryptographic proof binding {candidateName} (@{auditResult.username})&apos;s public AST code quality score ({auditResult.overallScore}/100) to their profile for employers to verify.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-2.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-400">GitHub Handle:</span>
                  <span className="font-mono text-purple-400">@{auditResult.username}</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-400">AST Code Quality Score:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {auditResult.overallScore}/100 (Grade {auditResult.grade})
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-400">Audited Repositories:</span>
                  <span className="font-mono text-white">{auditResult.repoCount} repos</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-400">Verification Engine:</span>
                  <span className="font-mono text-slate-300">FastAPI CareerCompass Engine</span>
                </div>
              </div>

              {mintedProof ? (
                <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-800 space-y-2 text-left animate-in zoom-in-95">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Cryptographic Credential Minted Successfully</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono break-all bg-black/60 p-3 rounded-xl border border-emerald-900/50">
                    {mintedProof}
                  </p>
                  <p className="text-xs text-emerald-300">
                    Verified badge added to student profile. Visible to hiring managers across TalentRadar.
                  </p>
                </div>
              ) : (
                <button
                  onClick={onMintProof}
                  className="px-8 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:opacity-90 text-white shadow-xl shadow-purple-500/25 transition-all"
                >
                  Mint Cryptographic Credential
                </button>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default GitHubAuditView;
