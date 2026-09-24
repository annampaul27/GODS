"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import {
  GraduationCap,
  Download,
  FileCheck2,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Award,
  CheckCircle,
  CheckCircle2,
  Rocket,
  Zap,
  Clock,
  X,
} from "lucide-react";

export default function UniversityCohortAnalytics() {
  const { currentOrg, addToast } = useStore();
  const [exported, setExported] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [isBatchSprintActive, setIsBatchSprintActive] = useState(false);

  const cohortDeficits = [
    {
      skill: "PostgreSQL Indexing & Execution Plans",
      studentsAssessed: 480,
      deficitCount: 231,
      deficitPercentage: 48.1,
      status: "Critical Curriculum Gap",
      recommendedAction: "Mandate Database Engineering Lab Sprint #4",
    },
    {
      skill: "React Server Components & Streaming",
      studentsAssessed: 480,
      deficitCount: 259,
      deficitPercentage: 54.0,
      status: "High Industry Gap",
      recommendedAction: "Deploy Web Platform Sprint to Final Year Batch",
    },
    {
      skill: "FastAPI Async Architecture & Event Loops",
      studentsAssessed: 480,
      deficitCount: 182,
      deficitPercentage: 37.9,
      status: "Moderate Gap",
      recommendedAction: "Bridgeable via 10-minute micro-learning modules",
    },
    {
      skill: "Docker Multi-stage Builds & Security",
      studentsAssessed: 480,
      deficitCount: 144,
      deficitPercentage: 30.0,
      status: "Normal Dispersion",
      recommendedAction: "Elective workshop",
    },
  ];

  const handleExportNAAC = () => {
    setExported(true);
    addToast({
      type: "success",
      title: "NAAC/NIRF Accreditation Dossier Exported (E22)",
      message:
        "Generated NAAC Criterion 5.1.4 / NIRF Placement Readiness Compliance CSV and verifiable cryptographic hash summary.",
    });
    setTimeout(() => setExported(false), 4000);
  };

  const handleConfirmSprint = () => {
    setIsSprintModalOpen(false);
    setIsBatchSprintActive(true);
    addToast({
      type: "success",
      title: "Placement Sprint Dispatched (NAAC Criterion 5)",
      message:
        "Dispatched PostgreSQL & FastAPI gap sprints to 64 bridgeable students. Auto-grading enabled.",
    });
  };

  return (
    <div className="space-y-6">
      {/* University Cohort Header */}
      <div className="p-6 rounded-2xl glass-panel border-cyan-500/20 bg-gradient-to-r from-slate-950 via-[#0b1426] to-slate-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  University Cohort Readiness & NAAC/NIRF Analytics (E21, E22)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                  TPO Institutional Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregated cohort skill deficit telemetry for {currentOrg?.name || "Anna University / Partner Colleges"} • Class of 2026 (480 Candidates)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Header Action Button: TPO 1-Click Batch Placement Sprint */}
            <button
              onClick={() => setIsSprintModalOpen(true)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-950/40 flex items-center gap-2 text-sm transition-all"
            >
              <Rocket className="w-4 h-4" />
              <span>Launch 48-Hour Campus Placement Sprint</span>
            </button>

            <button
              onClick={handleExportNAAC}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{exported ? "Dossier Exported ✓" : "1-Click NAAC/NIRF Export (E22)"}</span>
            </button>
          </div>
        </div>

        {/* Accreditation Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div>
            <span className="text-[11px] text-slate-400 font-mono uppercase">Batch Benchmark Fit</span>
            <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">76.4% Avg</p>
            <span className="text-[10px] text-slate-500">+14% post gap-sprints</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-mono uppercase">Bridgeable Rate</span>
            <p className="text-xl font-bold font-mono text-amber-400 mt-0.5">42.8% of Batch</p>
            <span className="text-[10px] text-slate-500">185 students ready to bridge</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-mono uppercase">Verified SHA-256 Credentials</span>
            <p className="text-xl font-bold font-mono text-cyan-400 mt-0.5">432 Minted</p>
            <span className="text-[10px] text-slate-500">Tamper-proof proof of work</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-mono uppercase">NIRF Employability Index</span>
            <p className="text-xl font-bold font-mono text-indigo-300 mt-0.5">Rank Band 94</p>
            <span className="text-[10px] text-slate-500">Tier-1 Alignment</span>
          </div>
        </div>
      </div>

      {/* Active Batch Sprint Banner */}
      {isBatchSprintActive && (
        <div className="p-5 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shadow-emerald-950/30 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 font-mono tracking-wide">
                  Active Batch Sprint: PostgreSQL Optimization — 47h 59m remaining (64 students enrolled, 18 already completed)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" /> Live
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Curriculum remediation in progress • Direct alignment with Swiggy, Zoho &amp; Snowflake active openings
              </p>
            </div>
          </div>
          <div className="w-full md:w-56 shrink-0 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Cohort Progress</span>
              <span className="text-emerald-400 font-bold">18 / 64 completed (28%)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 animate-pulse transition-all duration-500"
                style={{ width: "28.1%" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Cohort Skill Deficit Table (E21) */}
      <div className="rounded-2xl glass-panel border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
              Cohort-Wide Skill Gap Delta Heatmap (E21)
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies exact curriculum blind spots based on real employer requisition benchmarks.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="pb-3 font-semibold">Competency Node</th>
                <th className="pb-3 font-semibold">Batch Assessed</th>
                <th className="pb-3 font-semibold">Deficit Rate</th>
                <th className="pb-3 font-semibold">Curriculum Diagnosis</th>
                <th className="pb-3 font-semibold">TPO Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {cohortDeficits.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 font-medium text-slate-200">
                    {row.skill}
                  </td>
                  <td className="py-3.5 text-slate-400 font-mono">
                    {row.studentsAssessed} Students
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            row.deficitPercentage > 50
                              ? "bg-rose-500"
                              : row.deficitPercentage > 35
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${row.deficitPercentage}%` }}
                        />
                      </div>
                      <span className="font-mono font-semibold text-slate-300">
                        {row.deficitPercentage}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold border ${
                        row.deficitPercentage > 50
                          ? "bg-rose-950/80 text-rose-400 border-rose-800/80"
                          : row.deficitPercentage > 35
                          ? "bg-amber-950/80 text-amber-400 border-amber-800/80"
                          : "bg-emerald-950/80 text-emerald-400 border-emerald-800/80"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-400 text-[11px]">
                    {row.recommendedAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Confirmation Modal */}
      {isSprintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl rounded-2xl glass-panel border border-emerald-500/30 bg-slate-950 p-6 md:p-8 space-y-6 shadow-2xl shadow-emerald-950/50 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Rocket className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    🚀 Launch 48-Hour Batch Placement Sprint (NAAC Criterion 5)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Institutional Targeted Upskilling for {currentOrg?.name || "Anna University / Partner Colleges"} • Class of 2026
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSprintModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cohort Target Stats */}
            <div className="grid grid-cols-1 gap-2.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400 font-medium">Target Audience</span>
                <span className="text-emerald-300 font-semibold font-mono">
                  64 &apos;Bridgeable&apos; Students (Missing 1-2 skills)
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400 font-medium">Target Sprint Modules</span>
                <span className="text-cyan-300 font-semibold">
                  PostgreSQL Indexing &amp; FastAPI Async Workers
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-400 font-medium">Employer Partner Benchmarks</span>
                <span className="text-slate-200 font-semibold text-right">
                  Direct alignment with Swiggy, Zoho &amp; Snowflake active openings
                </span>
              </div>
            </div>

            {/* Impact Projection Card (Emerald glass border) */}
            <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider font-mono">
                <TrendingUp className="w-4 h-4" />
                <span>Accreditation &amp; Placement Impact Projection</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Projected Placement Readiness: <strong>+28% eligibility</strong></span>
                </div>
                <div className="flex items-center gap-2 text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>21 additional students</strong> unlock immediate technical interview shortlists</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsSprintModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSprint}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all border border-emerald-400/40"
              >
                <Zap className="w-4 h-4" />
                <span>⚡ Confirm &amp; Dispatch Sprints to 64 Students</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
