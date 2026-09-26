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
        title: "Application Submitted",
        message: `Your verified profile (Score: ${currentStudent.readinessScore}%) has been submitted for ${targetJob.title}.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Target Role Selector & High-Level Match Bar */}
      <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-xs uppercase text-blue-400 font-semibold tracking-wider">
                Target Role Benchmark
              </span>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={activeJobId}
                onChange={(e) => setActiveJobId(e.target.value)}
                className="bg-gray-950 border border-gray-800 text-white font-medium text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} • {j.salaryRange}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Benchmarked against active job requisitions • Direct apply threshold:{" "}
              <strong className="text-white font-mono">{targetJob.passThreshold}%</strong>
            </p>
          </div>

          {/* Current Fit Score & Direct Apply Gate */}
          <div className="flex items-center gap-4 bg-gray-950 p-4 rounded-lg border border-gray-800 shrink-0">
            <div className="text-right">
              <span className="text-xs text-gray-400 uppercase block">
                Job Readiness Fit
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
                className={`text-[10px] font-mono uppercase block font-semibold ${
                  isJobReady ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {currentStudent.currentTier.replace("_", " ")}
              </span>
              <span className="text-[10px] text-gray-500 block font-mono">
                {verifiedCount}/{skillDeltas.length} Verified
              </span>
            </div>

            <div>
              {isJobReady ? (
                <button
                  onClick={handleApply}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Apply Now</span>
                </button>
              ) : (
                <button
                  disabled
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-gray-850 text-gray-400 border border-gray-800 cursor-not-allowed"
                  title="Restricted to ≥85% Job-Ready tier. Close remaining gaps to unlock direct apply."
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Apply Locked (Requires 85%)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Skill Gap Delta Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase font-medium tracking-wider text-gray-400 flex items-center gap-2">
            <span>Skill Gap Breakdown</span>
          </h4>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Verified
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Self-Reported
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Missing Gap
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {skillDeltas.map((item) => {
            const isCritical = item.skill.isCritical;
            const isVerified = item.status === "verified";
            const isUnverified = item.status === "unverified";

            return (
              <div
                key={item.skill.id}
                className={`p-4 rounded-lg border transition-colors flex flex-col justify-between ${
                  isVerified
                    ? "bg-gray-900 border-gray-800 hover:border-emerald-800"
                    : isUnverified
                    ? "bg-gray-900 border-gray-800 hover:border-amber-800"
                    : "bg-gray-900 border-gray-800 hover:border-rose-900"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-white">
                          {item.skill.name}
                        </span>
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
                      <span className="text-xs text-gray-500 capitalize block mt-0.5">
                        Category: {item.skill.category.replace("_", " ")}
                      </span>
                    </div>

                    <div className="text-right">
                      {isVerified ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5" /> Verified ({item.score}%)
                        </span>
                      ) : isUnverified ? (
                        <span className="text-xs text-amber-400 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" /> Unverified
                        </span>
                      ) : (
                        <span className="text-xs text-rose-400 font-medium">
                          Missing Gap
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    {isVerified
                      ? "Verified credential active. Contributes positive weight to your job readiness match."
                      : isUnverified
                      ? "Declared on resume, but lacks verified proof. Complete the 10-minute sprint to verify."
                      : "Required by target employer benchmark. Complete the 10-minute sprint to bridge this gap."}
                  </p>
                </div>

                {/* Action button */}
                <div className="mt-3 pt-2.5 border-t border-gray-800 flex items-center justify-between">
                  {isVerified ? (
                    <span className="text-xs font-mono text-gray-400 truncate max-w-[200px]">
                      Hash: {item.hash?.slice(0, 14)}...
                    </span>
                  ) : (
                    <button
                      onClick={() => onLaunchSprint(item.skill.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Start 10-Min Sprint</span>
                    </button>
                  )}

                  {!isVerified && (
                    <span className="text-xs text-gray-500">~10 mins</span>
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
