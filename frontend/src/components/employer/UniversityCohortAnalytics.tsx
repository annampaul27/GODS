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
} from "lucide-react";

export default function UniversityCohortAnalytics() {
  const { currentOrg, addToast } = useStore();
  const [exported, setExported] = useState(false);

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
      title: "NAAC/NIRF Accreditation Dossier Exported",
      message:
        "Generated NAAC Criterion 5.1.4 / NIRF Placement Readiness Compliance CSV and verifiable cryptographic hash summary.",
    });
    setTimeout(() => setExported(false), 4000);
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
                  University Cohort Readiness & NAAC/NIRF Analytics
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                  TPO Institutional Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregated cohort skill deficit telemetry for {currentOrg.name} • Class of 2026 (480 Candidates)
              </p>
            </div>
          </div>

          <button
            onClick={handleExportNAAC}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{exported ? "Dossier Exported ✓" : "1-Click NAAC/NIRF Export"}</span>
          </button>
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

      {/* Cohort Skill Deficit Table (E21) */}
      <div className="rounded-2xl glass-panel border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
              Cohort-Wide Skill Gap Delta Heatmap
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
    </div>
  );
}
