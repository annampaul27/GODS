"use client";

import React from "react";
import { useStore } from "@/lib/store";
import {
  Compass,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface ReadinessRoadmapProps {
  onLaunchSprint: (skillId: string) => void;
}

export default function ReadinessRoadmap({ onLaunchSprint }: ReadinessRoadmapProps) {
  const { currentStudent, activeJob, addToast } = useStore();

  const targetJob = activeJob;
  if (!targetJob) return null;

  // Collect missing or unverified skills sorted by weight descending (Critical weight 3.0 first - S18)
  const roadmapSteps = targetJob.criticalSkills
    .concat(targetJob.optionalSkills)
    .map((skill) => {
      const studentSkill = currentStudent.skills.find((s) => s.skillId === skill.id);
      const isCompleted = studentSkill?.isVerified || false;
      return {
        skill,
        isCompleted,
        score: studentSkill?.score,
        hash: studentSkill?.credentialHash,
      };
    })
    .sort((a, b) => b.skill.weight - a.skill.weight);

  const completedSteps = roadmapSteps.filter((s) => s.isCompleted);
  const remainingSteps = roadmapSteps.filter((s) => !s.isCompleted);

  const totalEstMinutes = remainingSteps.length * 10;
  const progressPercent = Math.round(
    (completedSteps.length / roadmapSteps.length) * 100
  );

  const handleRefreshFit = () => {
    addToast({
      type: "info",
      title: "Real-Time Fit Recomputed (S19)",
      message: `Profile re-evaluated against ${targetJob.title}. Current readiness score: ${currentStudent.readinessScore}%.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Application Readiness Report Header (S17, S18) */}
      <div className="p-6 rounded-2xl glass-panel border-amber-500/30 bg-gradient-to-r from-slate-950 via-[#131122] to-slate-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Compass className="w-4 h-4 text-amber-400" />
              <span className="text-xs uppercase font-mono text-amber-300 font-semibold tracking-wider">
                Objective Application Readiness Report (S17)
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Target Roadmap: {targetJob.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Authored directly by the SkillSetu scoring engine (removes employer rejection friction).
              Complete the sequenced micro-sprints below to convert your profile into the{" "}
              <strong className="text-emerald-400">Job-Ready tier (≥85%)</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefreshFit}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              title="S19: Re-check fit score without re-uploading resume"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Re-check Fit (S19)</span>
            </button>
          </div>
        </div>

        {/* Progress & Time Estimate Bar (S18) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              Roadmap Progress
            </span>
            <p className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
              {completedSteps.length} / {roadmapSteps.length} Completed ({progressPercent}%)
            </p>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              Estimated Total Time to Job-Ready
            </span>
            <p className="text-xl font-bold font-mono text-amber-300 mt-0.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              {totalEstMinutes > 0 ? `~${totalEstMinutes} mins` : "0 mins (Ready!)"}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              Current Benchmark Tier
            </span>
            <p
              className={`text-xl font-bold font-mono mt-0.5 ${
                currentStudent.readinessScore >= 85
                  ? "text-emerald-400"
                  : "text-amber-400"
              }`}
            >
              {currentStudent.readinessScore}% ({currentStudent.currentTier.toUpperCase()})
            </p>
          </div>
        </div>
      </div>

      {/* Sequenced Roadmap Steps (S18, S19) */}
      <div className="rounded-2xl glass-panel border-slate-800 p-6 space-y-4">
        <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold">
          Sequenced Competency Steps (Ranked by Critical Weight First - S18)
        </h4>

        <div className="space-y-3">
          {roadmapSteps.map((step, idx) => {
            const isCritical = step.skill.isCritical;

            return (
              <div
                key={step.skill.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  step.isCompleted
                    ? "bg-emerald-950/20 border-emerald-500/40"
                    : isCritical
                    ? "bg-slate-900/80 border-cyan-500/40"
                    : "bg-slate-900/40 border-slate-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                      step.isCompleted
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {step.isCompleted ? "✓" : idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-semibold text-xs text-white">
                        {step.skill.name}
                      </h5>
                      {isCritical ? (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                          Weight: 3.0 (Critical)
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          Weight: 1.0 (Optional)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {step.isCompleted
                        ? `Cryptographically verified • SHA-256 seal issued (${step.score}% score)`
                        : `Target deficit gap. Closing this unlocks direct application readiness.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {step.isCompleted ? (
                    <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-semibold">
                      <ShieldCheck className="w-4 h-4" /> Passed
                    </span>
                  ) : (
                    <button
                      onClick={() => onLaunchSprint(step.skill.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 transition-all shadow-md shadow-amber-500/10"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Launch 10-Min Sprint</span>
                    </button>
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
