"use client";

import React from "react";
import { Candidate } from "@/types";
import { useStore } from "@/lib/store";
import {
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowRight,
  Clock,
} from "lucide-react";

interface PipelineKanbanProps {
  onSelectCandidate: (candidate: Candidate) => void;
  onAuditCredential: (cred: any, cand: Candidate) => void;
}

const STAGES: { id: Candidate["pipelineStatus"]; title: string; color: string }[] = [
  { id: "applied", title: "Applied", color: "border-slate-700 text-slate-400" },
  { id: "screened", title: "Screened", color: "border-cyan-500/40 text-cyan-400" },
  { id: "shortlisted", title: "Shortlisted", color: "border-indigo-500/40 text-indigo-400" },
  { id: "interview", title: "Interview", color: "border-amber-500/40 text-amber-400" },
  { id: "offer", title: "Offer Extended", color: "border-emerald-500/40 text-emerald-400" },
];

export default function PipelineKanban({
  onSelectCandidate,
  onAuditCredential,
}: PipelineKanbanProps) {
  const {
    candidates,
    updateCandidatePipelineStatus,
    isAnonymizedScreening,
  } = useStore();

  const handleMoveStage = (
    candidateId: string,
    currentStatus: Candidate["pipelineStatus"],
    direction: "next" | "prev"
  ) => {
    const stageIds = STAGES.map((s) => s.id);
    const currentIndex = stageIds.indexOf(currentStatus);
    const targetIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (targetIndex >= 0 && targetIndex < stageIds.length) {
      updateCandidatePipelineStatus(
        candidateId,
        stageIds[targetIndex],
        "Recruiter Kanban Action"
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
            Candidate Pipeline Status Workflow (E16)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time stage transitions with full audit log history. Advance candidates as proofs are verified.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 overflow-x-auto min-h-[480px]">
        {STAGES.map((stage, idx) => {
          const stageCandidates = candidates.filter((c) => c.pipelineStatus === stage.id);

          return (
            <div
              key={stage.id}
              className="flex flex-col rounded-2xl glass-panel p-3 border-slate-800/90 bg-[#090e1c]/80 min-w-[220px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${stage.color.split(" ")[1]}`} />
                  <span className="text-xs font-bold text-slate-200">{stage.title}</span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                  {stageCandidates.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {stageCandidates.map((candidate) => {
                  const displayName = isAnonymizedScreening
                    ? candidate.anonymizedId
                    : candidate.fullName;

                  return (
                    <div
                      key={candidate.id}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-2 group shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <button
                          onClick={() => onSelectCandidate(candidate)}
                          className="text-left font-semibold text-xs text-slate-200 group-hover:text-cyan-300 transition-colors truncate max-w-[140px]"
                        >
                          {displayName}
                        </button>
                        <span
                          className={`text-[10px] font-mono font-bold ${
                            candidate.currentTier === "job_ready"
                              ? "text-emerald-400"
                              : candidate.currentTier === "bridgeable"
                              ? "text-amber-400"
                              : "text-red-400"
                          }`}
                        >
                          {candidate.readinessScore}%
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-400 truncate">
                        {isAnonymizedScreening
                          ? candidate.anonymizedCollege
                          : candidate.college}
                      </p>

                      {/* Cryptographic Badges */}
                      <div className="flex flex-wrap gap-1">
                        {candidate.credentials.map((cred) => (
                          <button
                            key={cred.hash}
                            onClick={() => onAuditCredential(cred, candidate)}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1 hover:bg-cyan-900"
                            title="Audit SHA-256 hash"
                          >
                            <ShieldCheck className="w-2.5 h-2.5 text-cyan-400" />
                            {cred.skillName.split(" ")[0]}
                          </button>
                        ))}
                      </div>

                      {/* Stage Move Controls (E16) */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        {idx > 0 ? (
                          <button
                            onClick={() => handleMoveStage(candidate.id, candidate.pipelineStatus, "prev")}
                            className="text-[10px] text-slate-400 hover:text-white transition-colors"
                          >
                            ← Prev
                          </button>
                        ) : (
                          <span />
                        )}
                        {idx < STAGES.length - 1 && (
                          <button
                            onClick={() => handleMoveStage(candidate.id, candidate.pipelineStatus, "next")}
                            className="flex items-center gap-0.5 text-[10px] font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            Advance →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {stageCandidates.length === 0 && (
                  <div className="py-8 text-center text-xs text-slate-600 font-mono italic">
                    Empty Stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
