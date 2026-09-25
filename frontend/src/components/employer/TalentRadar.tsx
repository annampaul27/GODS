"use client";

import React, { useState } from "react";
import { Candidate, ReadinessTier } from "@/types";
import { useStore } from "@/lib/store";
import {
  Zap,
  Shield,
  ShieldCheck,
  Filter,
  ArrowRight,
  TrendingUp,
  Eye,
  Mail,
  Sparkles,
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
  const {
    isAnonymizedScreening,
    setIsAnonymizedScreening,
    addToast,
    dispatchGapSprint,
    completeGapSprint,
    updateCandidatePipelineStatus,
  } = useStore();
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

  const handleToggleBlindScreening = () => {
    const nextVal = !isAnonymizedScreening;
    setIsAnonymizedScreening(nextVal);
    if (nextVal) {
      addToast({
        type: "info",
        title: "Blind Merit Screening Activated",
        message:
          "Candidate names, photos, and colleges are now anonymized to eliminate pedigree bias.",
      });
    } else {
      addToast({
        type: "info",
        title: "Blind Merit Screening Deactivated",
        message:
          "Candidate names, photos, and colleges are now visible.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Total Applicants</span>
            <span className="w-2 h-2 rounded-full bg-blue-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-1">
            {candidates.length} <span className="text-xs text-gray-400 font-sans font-normal">candidates</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">Evaluated across all requirements</p>
        </div>

        <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Job-Ready Tier (≥85%)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {jobReadyList.length}{" "}
            <span className="text-xs text-gray-400 font-sans font-normal">
              ({Math.round((jobReadyList.length / (candidates.length || 1)) * 100)}%)
            </span>
          </p>
          <p className="text-xs text-emerald-400/80 mt-1">High benchmark fit</p>
        </div>

        <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-300">Bridgeable (60-84%)</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-300 mt-1">
            {bridgeableList.length}{" "}
            <span className="text-xs text-gray-400 font-sans font-normal">
              ({Math.round((bridgeableList.length / (candidates.length || 1)) * 100)}%)
            </span>
          </p>
          <p className="text-xs text-amber-400/80 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Missing 1-2 skills only
          </p>
        </div>

        <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Est. Recruiter Time Saved</span>
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-400 mt-1">
            42.5 <span className="text-xs text-gray-400 font-sans font-normal">hrs</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">Automated skill verification</p>
        </div>
      </div>

      {/* Filter and Radar Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-gray-900 border border-gray-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs uppercase font-medium tracking-wider text-gray-300">
            Readiness Tiers:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedTier("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedTier === "all"
                  ? "bg-gray-800 text-white border border-gray-700"
                  : "bg-gray-950 text-gray-400 hover:text-gray-200 border border-gray-800"
              }`}
            >
              All Applicants ({candidates.length})
            </button>
            <button
              onClick={() => setSelectedTier("job_ready")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedTier === "job_ready"
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                  : "bg-gray-950 text-gray-400 hover:text-emerald-300 border border-gray-800"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Job-Ready ({jobReadyList.length})
            </button>
            <button
              onClick={() => setSelectedTier("bridgeable_only")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedTier === "bridgeable_only"
                  ? "bg-amber-950 text-amber-200 border border-amber-800"
                  : "bg-gray-950 text-amber-400 hover:text-amber-200 border border-gray-800"
              }`}
              title="Candidates missing 1-2 skills only"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Bridgeable ({bridgeableList.length})</span>
            </button>
            <button
              onClick={() => setSelectedTier("mismatch")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedTier === "mismatch"
                  ? "bg-red-950 text-red-300 border border-red-800"
                  : "bg-gray-950 text-gray-400 hover:text-gray-200 border border-gray-800"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Mismatch ({mismatchList.length})
            </button>
          </div>

          <div className="h-5 w-px bg-gray-800 hidden sm:block" />

          {/* Blind DEI / Merit-First Screening Toggle */}
          <button
            id="btn-blind-merit-screening-toggle"
            onClick={handleToggleBlindScreening}
            className={`cursor-pointer transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
              isAnonymizedScreening
                ? "bg-cyan-950/80 border border-cyan-500/60 text-cyan-300"
                : "bg-gray-950 border border-gray-800 text-gray-400 hover:text-white"
            }`}
            title="Toggle Blind DEI / Merit-First Candidate Evaluation"
          >
            {isAnonymizedScreening ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>Blind Merit Screening: ACTIVE</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-gray-400" />
                <span>Blind Merit Screening: OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Contextual Explanatory Banner (When Active) */}
      {isAnonymizedScreening && (
        <div className="p-4 rounded-xl border border-cyan-800/80 bg-cyan-950/20 flex items-center gap-3.5 text-xs text-cyan-200">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <p className="leading-relaxed">
            <strong className="text-cyan-300 font-semibold">Blind Merit Mode Active:</strong> Institutional pedigree and demographic identifiers are hidden. Candidate ranking is driven purely by demonstrated skills and verified proof-of-work badges.
          </p>
        </div>
      )}

      {/* Candidate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCandidates.map((candidate) => {
          const isJobReady = candidate.currentTier === "job_ready";
          const isBridgeable = candidate.currentTier === "bridgeable";
          const displayName = isAnonymizedScreening
            ? `Candidate #${candidate.id.slice(-4).toUpperCase()}`
            : candidate.fullName;
          const displayCollege = isAnonymizedScreening
            ? "Accredited Institution"
            : candidate.college;

          return (
            <div
              key={candidate.id}
              className={`p-5 rounded-xl bg-gray-900 border transition-colors flex flex-col justify-between ${
                isJobReady
                  ? "border-gray-800 hover:border-emerald-800"
                  : isBridgeable
                  ? "border-gray-800 hover:border-amber-800"
                  : "border-gray-800"
              }`}
            >
              <div>
                {/* Header with Tier Pill & Score */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {isAnonymizedScreening ? (
                      <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 text-gray-400" />
                      </div>
                    ) : (
                      <img
                        src={candidate.avatarUrl}
                        alt={candidate.fullName}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-700 shrink-0"
                      />
                    )}
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {displayName}
                      </h4>
                      <p className="text-xs text-gray-400 truncate max-w-[170px]">
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
                      className={`block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-medium border ${
                        isJobReady
                          ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                          : isBridgeable
                          ? "bg-amber-950 text-amber-400 border-amber-800"
                          : "bg-red-950 text-red-400 border-red-800"
                      }`}
                    >
                      {candidate.currentTier.replace("_", "-")}
                    </span>
                  </div>
                </div>

                {/* Readiness Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>Readiness Match</span>
                    <span>Target: 85%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isJobReady
                          ? "bg-emerald-500"
                          : isBridgeable
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${candidate.readinessScore}%` }}
                    />
                  </div>
                </div>

                {/* Verified Credentials Pills */}
                <div className="mt-3.5 space-y-1.5">
                  <span className="text-[10px] uppercase font-medium text-gray-400 block">
                    Verified Proofs ({candidate.credentials.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.credentials.length > 0 ? (
                      candidate.credentials.map((cred) => {
                        const tier = cred.score >= 90 ? "Platinum" : cred.score >= 80 ? "Gold" : "Silver";
                        return (
                          <button
                            key={cred.hash}
                            onClick={() => onAuditCredential(cred, candidate)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-950 text-blue-300 border border-gray-800 hover:border-gray-700 text-xs transition-colors"
                            title="Click to inspect verification proof"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                            <span>✔ {cred.skillName.split(" ")[0]} ({tier})</span>
                          </button>
                        );
                      })
                    ) : (
                      <span className="text-xs text-gray-500 italic">
                        No verified proofs yet
                      </span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                {candidate.missingCompetencies.length > 0 && (
                  <div className="mt-3 p-2.5 rounded-lg bg-gray-950 border border-gray-800">
                    <span className="text-[10px] uppercase text-amber-400 font-medium block mb-1">
                      Missing {candidate.missingCompetencies.length} Skill
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {candidate.missingCompetencies.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-amber-300 text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* In-Flight Gap Sprint Status */}
                {candidate.sprintAssigned?.status === "pending" && (
                  <div className="mt-2.5 p-2 rounded-lg bg-amber-950/20 border border-amber-800/60 flex items-center justify-between">
                    <span className="text-xs text-amber-300 flex items-center gap-1.5 truncate">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Sprint Active: {candidate.sprintAssigned.skillName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 shrink-0">
                      Dispatched
                    </span>
                  </div>
                )}
              </div>

              {/* Card Actions */}
              <div className="mt-4 pt-3 border-t border-gray-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {candidate.credentials.length > 0 ? (
                    <button
                      onClick={() => onAuditCredential(candidate.credentials[0], candidate)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-750 text-gray-200 border border-gray-700 text-xs transition-colors"
                      title="Inspect proof audit"
                    >
                      <span>Audit Proof</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectCandidate(candidate)}
                      className="text-xs text-gray-400 hover:text-white font-medium flex items-center gap-1 transition-colors"
                    >
                      View Profile <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      updateCandidatePipelineStatus(candidate.id, "shortlisted", "Recruiter Shortlist Action");
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors border ${
                      candidate.pipelineStatus === "shortlisted"
                        ? "bg-purple-950 text-purple-300 border-purple-800"
                        : "bg-gray-950 hover:bg-gray-800 text-gray-300 border-gray-800"
                    }`}
                    title="Shortlist candidate"
                  >
                    <Mail className="w-3 h-3" />
                    <span>{candidate.pipelineStatus === "shortlisted" ? "Shortlisted ✓" : "Shortlist"}</span>
                  </button>
                </div>

                {/* Gap Sprint Handling */}
                {candidate.sprintAssigned?.status === "pending" ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        completeGapSprint(
                          candidate.id,
                          candidate.sprintAssigned?.skillId || "postgres_optimization",
                          94
                        )
                      }
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
                      title="Simulate candidate passing challenge"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Simulate Pass</span>
                    </button>
                  </div>
                ) : candidate.sprintAssigned?.status === "passed" ? (
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Gap Closed
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
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors"
                    title="Trigger skill assessment to close delta"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Dispatch Sprint</span>
                  </button>
                ) : isJobReady ? (
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
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
