"use client";

import React, { useState } from "react";
import { Candidate, ReadinessTier } from "@/types";
import { useStore } from "@/lib/store";
import {
  Radar,
  Sparkles,
  Zap,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Filter,
  Send,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface TalentRadarProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onAuditCredential: (cred: any, cand: Candidate) => void;
}

export default function TalentRadar({
  candidates,
  onSelectCandidate,
  onAuditCredential,
}: TalentRadarProps) {
  const { isAnonymizedScreening, dispatchGapSprint, completeGapSprint, activeJob } = useStore();
  const [selectedTier, setSelectedTier] = useState<ReadinessTier | "all" | "bridgeable_only">("all");

  const jobReadyList = candidates.filter((c) => c.currentTier === "job_ready");
  const bridgeableList = candidates.filter((c) => c.currentTier === "bridgeable");
  const mismatchList = candidates.filter((c) => c.currentTier === "mismatch");

  const filteredCandidates = candidates.filter((c) => {
    if (selectedTier === "all") return true;
    if (selectedTier === "bridgeable_only")
      return c.currentTier === "bridgeable" && c.missingCompetencies.length <= 2;
    return c.currentTier === selectedTier;
  });

  return (
    <div className="space-y-6">
      {/* Metrics Row (E19: Org ROI) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border-cyan-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Applicants</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-1">
            {candidates.length} <span className="text-xs text-slate-400 font-sans font-normal">candidates</span>
          </p>
          <p className="text-[11px] text-cyan-400 mt-1 font-mono">100% Parsed & Scored (E3)</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Job-Ready Tier (≥85%)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {jobReadyList.length}{" "}
            <span className="text-xs text-slate-400 font-sans font-normal">
              ({Math.round((jobReadyList.length / candidates.length) * 100)}%)
            </span>
          </p>
          <p className="text-[11px] text-emerald-400/80 mt-1 font-mono">Zero Resume Spam (E4)</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border-amber-500/30 bg-amber-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-300 font-medium">Bridgeable (60-84%)</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-300 mt-1">
            {bridgeableList.length}{" "}
            <span className="text-xs text-slate-400 font-sans font-normal">
              ({Math.round((bridgeableList.length / candidates.length) * 100)}%)
            </span>
          </p>
          <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3" /> Missing 1-2 skills only (E5)
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Est. Recruiter Hours Saved</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-indigo-300 mt-1">
            42.5 <span className="text-xs text-slate-400 font-sans font-normal">hrs</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">Deficit Resistance Model</p>
        </div>
      </div>

      {/* Filter and Radar Controls (E4, E5) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Readiness Tiers:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedTier("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedTier === "all"
                ? "bg-slate-700 text-white border border-slate-600 shadow"
                : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            All Applicants ({candidates.length})
          </button>
          <button
            onClick={() => setSelectedTier("job_ready")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedTier === "job_ready"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-500/10"
                : "bg-slate-900/80 text-slate-400 hover:text-emerald-300 border border-slate-800"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Job-Ready ({jobReadyList.length})
          </button>
          <button
            onClick={() => setSelectedTier("bridgeable_only")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedTier === "bridgeable_only"
                ? "bg-amber-500/25 text-amber-200 border border-amber-500/60 shadow-md shadow-amber-500/20"
                : "bg-slate-900/80 text-amber-400 hover:text-amber-200 border border-slate-800"
            }`}
            title="E5: Dedicated Bridgeable Candidates diagnostic filter isolating applicants missing 1-2 competencies"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">Bridgeable Diagnostic Filter (E5)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-950/80 rounded border border-amber-800/80 text-amber-300">
              {bridgeableList.length}
            </span>
          </button>
          <button
            onClick={() => setSelectedTier("mismatch")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedTier === "mismatch"
                ? "bg-red-500/20 text-red-300 border border-red-500/50"
                : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400" />
            Mismatch ({mismatchList.length})
          </button>
        </div>
      </div>

      {/* Bridgeable Diagnostic Filter Callout Banner (E5) */}
      {selectedTier === "bridgeable_only" && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 border border-amber-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-200 flex items-center gap-2">
                Bridgeable Diagnostic Wedge (E5)
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                  {bridgeableList.length} High-Potential Candidates
                </span>
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                These candidates are missing only 1 to 2 discrete skills. Dispatch a 1-Click Gap Sprint (E6) to close the delta; passing elevates them to Job-Ready in real-time (E9).
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-amber-300 bg-amber-950/90 px-3 py-1.5 rounded-xl border border-amber-800/80 font-semibold self-start sm:self-auto shrink-0">
            ⚡ Quickest Reqs To Fill
          </span>
        </div>
      )}

      {/* Candidate Grid (E3, E4, E6) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCandidates.map((candidate) => {
          const isJobReady = candidate.currentTier === "job_ready";
          const isBridgeable = candidate.currentTier === "bridgeable";
          const displayName = isAnonymizedScreening
            ? candidate.anonymizedId
            : candidate.fullName;
          const displayCollege = isAnonymizedScreening
            ? candidate.anonymizedCollege
            : candidate.college;

          return (
            <div
              key={candidate.id}
              className={`p-5 rounded-2xl glass-panel transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1 relative group flex flex-col justify-between ${
                isJobReady
                  ? "border-emerald-500/30 shadow-emerald-950/20"
                  : isBridgeable
                  ? "border-amber-500/30 shadow-amber-950/20"
                  : "border-slate-800"
              }`}
            >
              <div>
                {/* Header with Tier Pill & Score */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {isAnonymizedScreening ? (
                      <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center font-mono text-cyan-400 font-bold text-xs">
                        {candidate.anonymizedId.replace("Candidate #", "#")}
                      </div>
                    ) : (
                      <img
                        src={candidate.avatarUrl}
                        alt={candidate.fullName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                      />
                    )}
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {displayName}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
                        {displayCollege}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-lg font-bold font-mono ${
                        isJobReady
                          ? "text-emerald-400"
                          : isBridgeable
                          ? "text-amber-400"
                          : "text-red-400"
                      }`}
                    >
                      {candidate.readinessScore}%
                    </span>
                    <span
                      className={`block text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded font-bold border ${
                        isJobReady
                          ? "bg-emerald-950/80 text-emerald-400 border-emerald-800/60"
                          : isBridgeable
                          ? "bg-amber-950/80 text-amber-400 border-amber-800/60"
                          : "bg-red-950/80 text-red-400 border-red-800/60"
                      }`}
                    >
                      {candidate.currentTier.replace("_", "-")}
                    </span>
                  </div>
                </div>

                {/* Readiness Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                    <span>Deficit Resistance Score</span>
                    <span>Target: 85%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isJobReady
                          ? "bg-gradient-to-r from-emerald-500 to-cyan-400"
                          : isBridgeable
                          ? "bg-gradient-to-r from-amber-500 to-amber-300"
                          : "bg-gradient-to-r from-red-500 to-rose-400"
                      }`}
                      style={{ width: `${candidate.readinessScore}%` }}
                    />
                  </div>
                </div>

                {/* Verified Credentials Pills (E7) */}
                <div className="mt-3.5 space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">
                    Cryptographic Proofs ({candidate.credentials.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.credentials.length > 0 ? (
                      candidate.credentials.map((cred) => (
                        <button
                          key={cred.hash}
                          onClick={() => onAuditCredential(cred, candidate)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 hover:bg-cyan-900 text-[10px] font-mono transition-colors"
                          title="Click to inspect SHA-256 cryptographic audit modal"
                        >
                          <ShieldCheck className="w-3 h-3 text-cyan-400" />
                          <span>{cred.skillName.split(" ")[0]} ({cred.score}%)</span>
                        </button>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">
                        No cryptographic proofs minted yet
                      </span>
                    )}
                  </div>
                </div>

                {/* Missing Skills (E5) */}
                {candidate.missingCompetencies.length > 0 && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold block mb-1">
                      Delta: Missing {candidate.missingCompetencies.length} Competency
                    </span>
                    <p className="text-[11px] text-slate-300">
                      {candidate.missingCompetencies.join(", ")}
                    </p>
                  </div>
                )}

                {/* In-Flight Gap Sprint Status (E6) */}
                {candidate.sprintAssigned?.status === "pending" && (
                  <div className="mt-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-300 flex items-center gap-1.5 truncate">
                      <Zap className="w-3 h-3 text-amber-400 animate-pulse shrink-0" /> Sprint In Flight: {candidate.sprintAssigned.skillName}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 shrink-0">
                      E6 Dispatched
                    </span>
                  </div>
                )}
              </div>

              {/* Card Actions (E6, E9, E10) */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => onSelectCandidate(candidate)}
                  className="text-xs text-slate-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
                >
                  Inspect Profile <ArrowRight className="w-3 h-3" />
                </button>

                {/* E6 & E9 Gap Sprint Handling */}
                {candidate.sprintAssigned?.status === "pending" ? (
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                      <Zap className="w-3 h-3 text-amber-400" /> Sprint Sent (E6)
                    </span>
                    <button
                      onClick={() =>
                        completeGapSprint(
                          candidate.id,
                          candidate.sprintAssigned?.skillId || "postgres_optimization",
                          94
                        )
                      }
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/25 hover:bg-emerald-500/35 text-emerald-200 border border-emerald-500/50 text-[11px] font-bold transition-all shadow-sm shadow-emerald-500/20 hover:scale-[1.02]"
                      title="E9: Simulate candidate passing targeted 10-min challenge & elevate to Job-Ready"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-300" />
                      <span>Simulate Pass (E9)</span>
                    </button>
                  </div>
                ) : candidate.sprintAssigned?.status === "passed" ? (
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Gap Closed & Elevated (E9)
                  </span>
                ) : isBridgeable ? (
                  <button
                    onClick={() =>
                      dispatchGapSprint(
                        candidate.id,
                        candidate.missingCompetencies[0]?.toLowerCase().replace(/\s+/g, "_") || "postgres_optimization",
                        candidate.missingCompetencies[0] || "PostgreSQL Indexing & Optimization"
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-[11px] font-semibold transition-all shadow-sm shadow-amber-500/10 hover:scale-[1.02]"
                    title="E6: Trigger automated targeted challenge invitation to close skill delta"
                  >
                    <Send className="w-3 h-3" />
                    <span>1-Click Sprint (E6)</span>
                  </button>
                ) : isJobReady ? (
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> High Readiness
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
