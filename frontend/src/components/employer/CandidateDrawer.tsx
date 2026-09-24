"use client";

import React from "react";
import { Candidate } from "@/types";
import { useStore } from "@/lib/store";
import {
  X,
  Code2,
  Globe,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Calendar,
  Send,
  Sparkles,
  Zap,
} from "lucide-react";

interface CandidateDrawerProps {
  candidate: Candidate;
  onClose: () => void;
  onAuditCredential: (cred: any) => void;
  onDispatchSprint: (candId: string, skillId: string, skillName: string) => void;
}

export default function CandidateDrawer({
  candidate,
  onClose,
  onAuditCredential,
  onDispatchSprint,
}: CandidateDrawerProps) {
  const { isAnonymizedScreening, completeGapSprint } = useStore();

  const displayName = isAnonymizedScreening ? candidate.anonymizedId : candidate.fullName;
  const displayCollege = isAnonymizedScreening
    ? candidate.anonymizedCollege
    : candidate.college;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl h-full bg-[#0a0f1d] border-l border-slate-800 p-6 flex flex-col shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {isAnonymizedScreening ? (
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-cyan-400 font-bold text-sm">
                #BIAS_OFF
              </div>
            ) : (
              <img
                src={candidate.avatarUrl}
                alt={candidate.fullName}
                className="w-12 h-12 rounded-xl object-cover border border-slate-700"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{displayName}</h3>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                    candidate.currentTier === "job_ready"
                      ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/80"
                      : candidate.currentTier === "bridgeable"
                      ? "bg-amber-950/80 text-amber-400 border border-amber-800/80"
                      : "bg-red-950/80 text-red-400 border border-red-800/80"
                  }`}
                >
                  {candidate.currentTier.replace("_", " ")} ({candidate.readinessScore}%)
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                {displayCollege} • Class of {candidate.gradYear}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links bar (E10) */}
        {!isAnonymizedScreening && (
          <div className="flex items-center gap-3 py-3 border-b border-slate-800/80 text-xs">
            {candidate.githubUrl && (
              <a
                href={candidate.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Verified GitHub Profile</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            )}
            {candidate.linkedinUrl && (
              <a
                href={candidate.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            )}
          </div>
        )}

        {/* Missing Competencies Alert & Dispatch (E5, E6) */}
        {candidate.missingCompetencies.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-amber-950/20 border border-amber-500/40">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <h4 className="text-xs font-semibold text-amber-300">
                  Target Skill Delta (Missing {candidate.missingCompetencies.length} Competency)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-amber-400">Bridgeable</span>
            </div>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Candidate lacks verified proof for:{" "}
              <strong className="text-white">
                {candidate.missingCompetencies.join(", ")}
              </strong>
              .
            </p>
            <div className="mt-3">
              {candidate.sprintAssigned?.status === "pending" ? (
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-amber-500/15 border border-amber-500/40">
                  <span className="text-xs font-mono text-amber-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
                    Sprint Active: {candidate.sprintAssigned.skillName} (E6)
                  </span>
                  <button
                    onClick={() =>
                      completeGapSprint(
                        candidate.id,
                        candidate.sprintAssigned?.skillId || "postgres_optimization",
                        94
                      )
                    }
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/25 hover:bg-emerald-500/35 text-emerald-200 border border-emerald-500/50 text-xs font-bold transition-all shadow-sm shadow-emerald-500/20 hover:scale-[1.02]"
                    title="E9: Simulate candidate passing targeted 10-min challenge & elevate to Job-Ready"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Simulate Pass (E9)</span>
                  </button>
                </div>
              ) : candidate.sprintAssigned?.status === "passed" ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Gap Closed & Verified! Candidate elevated to Job-Ready (E9).</span>
                </div>
              ) : (
                <button
                  onClick={() =>
                    onDispatchSprint(
                      candidate.id,
                      candidate.missingCompetencies[0]?.toLowerCase().replace(/\s+/g, "_") || "postgres_optimization",
                      candidate.missingCompetencies[0] || "PostgreSQL Indexing & Optimization"
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-medium transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch 1-Click Gap Sprint (E6)</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Competency & Credential Ledger (S15, E7) */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold">
              Skill Trust Matrix (S15: Verified vs Unverified)
            </h4>
            <span className="text-[11px] text-slate-500">
              Only verified skills count toward job fit
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {candidate.skills.map((skill) => (
              <div
                key={skill.skillId}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  skill.isVerified
                    ? "bg-slate-900/80 border-emerald-500/30"
                    : "bg-slate-950/60 border-slate-800 text-slate-400"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {skill.isVerified ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500/60 shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-200">{skill.skillName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        [{skill.level}]
                      </span>
                    </div>
                    {skill.isVerified ? (
                      <span className="text-[10px] text-emerald-400 font-mono block">
                        SHA-256 Verified • Score: {skill.score}%
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400/80 block">
                        Unverified (Self-declared on resume)
                      </span>
                    )}
                  </div>
                </div>

                {skill.isVerified && skill.credentialHash && (
                  <button
                    onClick={() => {
                      const c = candidate.credentials.find(
                        (cr) => cr.skillId === skill.skillId
                      );
                      if (c) onAuditCredential(c);
                    }}
                    className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 text-[11px] font-mono transition-colors"
                  >
                    Inspect Hash (E7)
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Parsed Work Experience (E10) */}
        {candidate.workExperience && candidate.workExperience.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              Parsed Work Experience ({candidate.workExperience.length}) (E10)
            </h4>
            <div className="space-y-2.5">
              {candidate.workExperience.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">{exp.title}</span>
                      <span className="text-slate-400 text-[11px]">{exp.company}</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {exp.startDate} - {exp.endDate || "Present"}
                    </span>
                  </div>
                  {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] pt-1">
                      {exp.bulletPoints.map((bp, bidx) => (
                        <li key={bidx} className="leading-relaxed">
                          {bp}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parsed Projects (E10) */}
        <div className="mt-6 space-y-3">
          <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
            Verified Projects ({candidate.projects.length})
          </h4>
          <div className="space-y-2.5">
            {candidate.projects.map((proj, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{proj.title}</span>
                  {proj.link && !isAnonymizedScreening && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
                    >
                      Repo <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.tech.map((t, tidx) => (
                    <span
                      key={tidx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline History (E16) */}
        <div className="mt-6 pt-4 border-t border-slate-800 space-y-2 text-xs">
          <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold">
            Status Audit Log (E16)
          </h4>
          <div className="space-y-1.5">
            {candidate.statusHistory.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80 text-[11px]"
              >
                <span className="font-mono text-cyan-400 uppercase font-semibold">
                  {h.status}
                </span>
                <span className="text-slate-400">{h.updatedBy}</span>
                <span className="text-slate-500 font-mono">{h.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
