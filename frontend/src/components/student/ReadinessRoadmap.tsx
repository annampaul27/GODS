"use client";

import React from "react";
import { useStore } from "@/lib/store";
import {
  Compass,
  Clock,
  ShieldCheck,
  Zap,
  RefreshCw,
} from "lucide-react";

interface ReadinessRoadmapProps {
  onLaunchSprint: (skillId: string) => void;
}

export default function ReadinessRoadmap({ onLaunchSprint }: ReadinessRoadmapProps) {
  const { currentStudent, activeJob, addToast } = useStore();

  const targetJob = activeJob;
  if (!targetJob) return null;

  // Collect missing or unverified skills sorted by weight descending
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
      title: "Fit Score Recomputed",
      message: `Profile re-evaluated against ${targetJob.title}. Current readiness score: ${currentStudent.readinessScore}%.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Application Readiness Report Header */}
      <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Compass className="w-4 h-4 text-blue-400" />
              <span className="text-xs uppercase text-blue-400 font-semibold tracking-wider">
                Application Readiness Report
              </span>
            </div>
            <h3 className="text-base font-semibold text-white">
              Target Roadmap: {targetJob.title}
            </h3>
            <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
              Complete the sequenced skill modules below to advance your profile into the{" "}
              <strong className="text-emerald-400">Job-Ready tier (≥85%)</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefreshFit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-950 border border-gray-800 text-xs font-medium text-gray-300 hover:text-white transition-colors"
              title="Re-check fit score without re-uploading resume"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              <span>Re-check Fit</span>
            </button>
          </div>
        </div>

        {/* Progress & Time Estimate Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-gray-800">
          <div>
            <span className="text-xs text-gray-500 uppercase block">
              Roadmap Progress
            </span>
            <p className="text-lg font-bold font-mono text-blue-400 mt-0.5">
              {completedSteps.length} / {roadmapSteps.length} Completed ({progressPercent}%)
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500 uppercase block">
              Est. Time to Job-Ready
            </span>
            <p className="text-lg font-bold font-mono text-amber-400 mt-0.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              {totalEstMinutes > 0 ? `~${totalEstMinutes} mins` : "0 mins (Ready)"}
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500 uppercase block">
              Current Benchmark
            </span>
            <p
              className={`text-lg font-bold font-mono mt-0.5 ${
                currentStudent.readinessScore >= 85
                  ? "text-emerald-400"
                  : "text-amber-400"
              }`}
            >
              {currentStudent.readinessScore}% ({currentStudent.currentTier.replace("_", "-").toUpperCase()})
            </p>
          </div>
        </div>
      </div>

      {/* Sequenced Roadmap Steps */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6 space-y-4">
        <h4 className="text-xs uppercase font-medium tracking-wider text-gray-400">
          Sequenced Competency Steps (Priority Ranked)
        </h4>

        <div className="space-y-3">
          {roadmapSteps.map((step, idx) => {
            const isCritical = step.skill.isCritical;

            return (
              <div
                key={step.skill.id}
                className={`p-4 rounded-lg border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  step.isCompleted
                    ? "bg-gray-950 border-emerald-900/60"
                    : isCritical
                    ? "bg-gray-950 border-gray-800 hover:border-gray-700"
                    : "bg-gray-950/60 border-gray-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                      step.isCompleted
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    {step.isCompleted ? "✓" : idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-xs text-white">
                        {step.skill.name}
                      </h5>
                      {isCritical ? (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-medium">
                          Critical (3.0)
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                          Optional (1.0)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {step.isCompleted
                        ? `Verified credential issued (${step.score}% score)`
                        : "Target deficit gap. Closing this unlocks direct application readiness."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {step.isCompleted ? (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                      <ShieldCheck className="w-4 h-4" /> Passed
                    </span>
                  ) : (
                    <button
                      onClick={() => onLaunchSprint(step.skill.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
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
