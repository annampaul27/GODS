"use client";

import React, { useState } from "react";
import { Candidate, ProofOfWorkCredential } from "@/types";
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
  Shield,
} from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import { GitHubAnalysisModal } from "@/components/student/GitHubAnalysisModal";

interface CandidateDrawerProps {
  candidate: Candidate;
  onClose: () => void;
  onAuditCredential: (cred: ProofOfWorkCredential) => void;
  onDispatchSprint: (candId: string, skillId: string, skillName: string) => void;
}

export default function CandidateDrawer({
  candidate,
  onClose,
  onAuditCredential,
  onDispatchSprint,
}: CandidateDrawerProps) {
  const { isAnonymizedScreening, completeGapSprint } = useStore();
  const [isGitHubAnalysisOpen, setIsGitHubAnalysisOpen] = useState(false);

  const displayName = isAnonymizedScreening ? candidate.anonymizedId : candidate.fullName;
  const displayCollege = isAnonymizedScreening
    ? candidate.anonymizedCollege
    : candidate.college;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75">
      <div className="w-full max-w-xl h-full bg-gray-900 border-l border-gray-800 p-6 flex flex-col shadow-2xl overflow-y-auto">
        {/* Drawer Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            {isAnonymizedScreening ? (
              <div className="w-12 h-12 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400">
                <Shield className="w-6 h-6" />
              </div>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={candidate.avatarUrl}
                alt={candidate.fullName}
                className="w-12 h-12 rounded-lg object-cover border border-gray-700"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">{displayName}</h3>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-medium ${
                    candidate.currentTier === "job_ready"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : candidate.currentTier === "bridgeable"
                      ? "bg-amber-950 text-amber-400 border border-amber-800"
                      : "bg-red-950 text-red-400 border border-red-800"
                  }`}
                >
                  {candidate.currentTier.replace("_", " ")} ({candidate.readinessScore}%)
                </span>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                {displayCollege} • Class of {candidate.gradYear}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links bar */}
        {!isAnonymizedScreening && (
          <div className="flex items-center gap-3 py-3 border-b border-gray-800 text-xs">
            {candidate.githubUrl && (
              <>
                <a
                  href={candidate.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-950 border border-gray-800 text-gray-300 hover:text-white transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>

                <button
                  onClick={() => setIsGitHubAnalysisOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-800/50 text-purple-300 hover:text-white hover:bg-purple-900/40 transition-colors font-medium"
                  title="Run Deep AST Codebase & Commit Verifier on candidate"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-purple-400" />
                  <span>AST Code Audit</span>
                </button>
              </>
            )}
            {candidate.linkedinUrl && (
              <a
                href={candidate.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-950 border border-gray-800 text-gray-300 hover:text-white transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            )}
          </div>
        )}

        {/* Missing Competencies Alert & Dispatch */}
        {candidate.missingCompetencies.length > 0 && (
          <div className="mt-4 p-4 rounded-lg bg-amber-950/20 border border-amber-800/80">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <h4 className="text-xs font-semibold text-amber-300">
                  Target Skill Delta (Missing {candidate.missingCompetencies.length} Skill)
                </h4>
              </div>
              <span className="text-[10px] text-amber-400 font-medium">Bridgeable</span>
            </div>
            <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
              Missing verified proofs for:{" "}
              <strong className="text-white">
                {candidate.missingCompetencies.join(", ")}
              </strong>
            </p>
            <div className="mt-3">
              {candidate.sprintAssigned?.status === "pending" ? (
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-amber-950/40 border border-amber-800/80">
                  <span className="text-xs text-amber-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    Sprint Active: {candidate.sprintAssigned.skillName}
                  </span>
                  <button
                    onClick={() =>
                      completeGapSprint(
                        candidate.id,
                        candidate.sprintAssigned?.skillId || "postgres_optimization",
                        94
                      )
                    }
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
                    title="Simulate candidate completing challenge"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Simulate Pass</span>
                  </button>
                </div>
              ) : candidate.sprintAssigned?.status === "passed" ? (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Gap closed. Candidate evaluated and elevated to Job-Ready.</span>
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Gap Sprint</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Competency & Credential Ledger */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase font-medium tracking-wider text-gray-400">
              Verified Skills vs Self-Reported
            </h4>
            <span className="text-xs text-gray-500">
              Only verified skills count toward fit
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {candidate.skills.map((skill) => (
              <div
                key={skill.skillId}
                className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
                  skill.isVerified
                    ? "bg-gray-950 border-emerald-900/60"
                    : "bg-gray-950/60 border-gray-800 text-gray-400"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {skill.isVerified ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-500 shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-200">{skill.skillName}</span>
                      <span className="text-[10px] text-gray-500 capitalize">
                        [{skill.level}]
                      </span>
                    </div>
                    {skill.isVerified ? (
                      <span className="text-[11px] text-emerald-400 block">
                        SHA-256 Verified • Score: {skill.score}%
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-500 block">
                        Self-declared on resume
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
                    className="px-2.5 py-1 rounded bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 text-xs transition-colors"
                  >
                    View Proof
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Parsed Work Experience */}
        {candidate.workExperience && candidate.workExperience.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="text-xs uppercase font-medium tracking-wider text-gray-400 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-gray-400" />
              Work Experience ({candidate.workExperience.length})
            </h4>
            <div className="space-y-2">
              {candidate.workExperience.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-gray-950 border border-gray-800 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-white block">{exp.title}</span>
                      <span className="text-gray-400 text-xs">{exp.company}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1 bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      {exp.startDate} - {exp.endDate || "Present"}
                    </span>
                  </div>
                  {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-xs pt-1">
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

        {/* Verified Projects */}
        <div className="mt-6 space-y-3">
          <h4 className="text-xs uppercase font-medium tracking-wider text-gray-400 flex items-center gap-1.5">
            <FolderGit2 className="w-3.5 h-3.5 text-gray-400" />
            Projects ({candidate.projects.length})
          </h4>
          <div className="space-y-2">
            {candidate.projects.map((proj, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-gray-950 border border-gray-800 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-200">{proj.title}</span>
                  {proj.link && !isAnonymizedScreening && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs"
                    >
                      Repo <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-gray-400 leading-relaxed text-xs">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.tech.map((t, tidx) => (
                    <span
                      key={tidx}
                      className="text-[10px] px-2 py-0.5 rounded bg-gray-900 text-gray-300 border border-gray-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status History */}
        <div className="mt-6 pt-4 border-t border-gray-800 space-y-2 text-xs">
          <h4 className="text-xs uppercase font-medium tracking-wider text-gray-400">
            Pipeline History
          </h4>
          <div className="space-y-1.5">
            {candidate.statusHistory.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded bg-gray-950 border border-gray-800 text-xs"
              >
                <span className="text-blue-400 uppercase font-medium">
                  {h.status}
                </span>
                <span className="text-gray-400">{h.updatedBy}</span>
                <span className="text-gray-500 font-mono text-[11px]">{h.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

        {isGitHubAnalysisOpen && (
          <GitHubAnalysisModal
            isOpen={isGitHubAnalysisOpen}
            onClose={() => setIsGitHubAnalysisOpen(false)}
            defaultUsername={
              candidate.githubUrl
                ? candidate.githubUrl.split("/").filter(Boolean).pop() || "aaravsharma-dev"
                : "aaravsharma-dev"
            }
            candidateName={displayName}
          />
        )}
      </div>
    </div>
  );
}
