"use client";

import React from "react";
import { useStore } from "@/lib/store";
import {
  Target,
  ShieldCheck,
  AlertCircle,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface SkillGapRadarProps {
  onLaunchSprint: (skillId: string) => void;
}

export default function SkillGapRadar({ onLaunchSprint }: SkillGapRadarProps) {
  const {
    jobs,
    activeJobId,
    setActiveJobId,
    activeJob,
    currentStudent,
    addToast,
  } = useStore();

  const targetJob = activeJob || jobs[0];

  // Map all skills required by the job against candidate's verified skills
  const allReqSkills = [...targetJob.criticalSkills, ...targetJob.optionalSkills];

  const skillDeltas = allReqSkills.map((req) => {
    const studentSkill = currentStudent.skills.find(
      (s) =>
        s.skillId === req.id ||
        s.skillName.toLowerCase() === req.name.toLowerCase()
    );

    let status: "verified" | "unverified" | "missing" = "missing";
    if (studentSkill) {
      status = studentSkill.isVerified ? "verified" : "unverified";
    }

    return {
      skill: req,
      status,
      score: studentSkill?.score,
      hash: studentSkill?.credentialHash,
    };
  });

  const verifiedCount = skillDeltas.filter((d) => d.status === "verified").length;
  const isJobReady = currentStudent.readinessScore >= targetJob.passThreshold;

  const handleApply = () => {
    if (isJobReady) {
      addToast({
        type: "success",
        title: "Application Submitted Successfully (S16)",
        message: `Your verified profile (Score: ${currentStudent.readinessScore}%) has been dispatched to ${targetJob.title} hiring managers.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Target Role Selector & High-Level Match Bar (S3, S4) */}
      <div className="p-6 rounded-2xl glass-panel border-cyan-500/30 bg-gradient-to-r from-slate-950 via-[#0a1224] to-slate-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-cyan-400" />
              <span className="text-xs uppercase font-mono text-cyan-300 font-semibold tracking-wider">
                Target Role Benchmark (S3)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={activeJobId}
                onChange={(e) => setActiveJobId(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white font-semibold text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} • {j.salaryRange}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Benchmarked against live demand • Threshold for direct application:{" "}
              <strong className="text-white font-mono">{targetJob.passThreshold}%</strong>
            </p>
          </div>

          {/* Current Fit Score & Direct Apply Gate (S16) */}
          <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800 shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">
                Your Job-Readiness Fit
              </span>
              <span
                className={`text-2xl font-bold font-mono ${
                  isJobReady
                    ? "text-emerald-400"
                    : currentStudent.readinessScore >= 60
                    ? "text-amber-400"
                    : "text-red-400"
                }`}
              >
                {currentStudent.readinessScore}%
              </span>
              <span
                className={`text-[9px] font-mono uppercase block font-semibold ${
                  isJobReady ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {currentStudent.currentTier.replace("_", " ")}
              </span>
            </div>

            <div>
              {isJobReady ? (
                <button
                  onClick={handleApply}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Apply Now (S16)</span>
                </button>
              ) : (
                <button
                  disabled
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed"
                  title="S16: Restricted to ≥85% Job-Ready tier. Close remaining gaps to unlock direct apply."
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Apply Locked (Requires 85%)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Skill Gap Delta Grid (S4, S15) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase font-mono tracking-wider text-slate-300 font-semibold flex items-center gap-2">
            <span>Skill Gap Delta Radar Breakdown (S4)</span>
          </h4>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Proficient (Verified)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Self-Declared (Unverified)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Missing Delta
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {skillDeltas.map((item) => {
            const isCritical = item.skill.isCritical;
            const isVerified = item.status === "verified";
            const isUnverified = item.status === "unverified";
            const isMissing = item.status === "missing";

            return (
              <div
                key={item.skill.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isVerified
                    ? "bg-slate-900/80 border-emerald-500/40 shadow-sm shadow-emerald-950/20"
                    : isUnverified
                    ? "bg-slate-900/60 border-amber-500/40"
                    : "bg-slate-950/80 border-rose-500/30"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-100">
                          {item.skill.name}
                        </span>
                        {isCritical ? (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                            Critical (w=3.0)
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            Optional (w=1.0)
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 capitalize block mt-0.5">
                        Category: {item.skill.category.replace("_", " ")}
                      </span>
                    </div>

                    <div className="text-right">
                      {isVerified ? (
                        <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5" /> Verified ({item.score}%)
                        </span>
                      ) : isUnverified ? (
                        <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Unverified (0 Fit Weight)
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-rose-400 font-semibold">
                          Missing Gap Delta
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    {isVerified
                      ? "Cryptographic proof issued and verified. This competency contributes full positive weight to employer fit score."
                      : isUnverified
                      ? "Claimed on resume, but lacks cryptographic proof-of-work. Complete the 10-minute micro-sprint to verify (S15)."
                      : "Required by target employer benchmark. Complete the 10-minute sprint to close this gap."}
                  </p>
                </div>

                {/* Action button */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                  {isVerified ? (
                    <span className="text-[10px] font-mono text-cyan-400 truncate max-w-[200px]">
                      Hash: {item.hash?.slice(0, 14)}...
                    </span>
                  ) : (
                    <button
                      onClick={() => onLaunchSprint(item.skill.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-semibold text-[11px] transition-all shadow-sm shadow-cyan-500/10"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Start 10-Min Micro-Sprint (S5)</span>
                    </button>
                  )}

                  {!isVerified && (
                    <span className="text-[10px] text-slate-500 font-mono">Est: 10 mins</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
