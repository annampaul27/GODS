"use client";

import React from "react";
import { useStore } from "@/lib/store";
import { AlertTriangle, ShieldAlert, CheckCircle2, Flag } from "lucide-react";

export default function AnomalyMonitor() {
  const { anomalies, resolveAnomaly } = useStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border-rose-500/20 bg-gradient-to-r from-slate-950 via-[#180d19] to-slate-950">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">
                Fraud & Conflict Sentinel Telemetry (A9, A10, A11)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 font-semibold">
                Integrity Monitor
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated anomaly detection for tab-blur spikes, rapid-fire submissions, and sponsor conflicts.
            </p>
          </div>
        </div>
      </div>

      {/* Anomalies List */}
      <div className="space-y-3">
        {anomalies.map((anom) => (
          <div
            key={anom.id}
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              anom.resolved
                ? "bg-slate-900/30 border-slate-800 opacity-60"
                : anom.severity === "high"
                ? "bg-rose-950/20 border-rose-500/40"
                : "bg-amber-950/20 border-amber-500/40"
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  anom.severity === "high" ? "text-rose-400" : "text-amber-400"
                }`}
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-white">{anom.type}</h4>
                  <span
                    className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold border ${
                      anom.severity === "high"
                        ? "bg-rose-950 text-rose-300 border-rose-800"
                        : "bg-amber-950 text-amber-300 border-amber-800"
                    }`}
                  >
                    {anom.severity} severity
                  </span>
                  {anom.resolved && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      Resolved
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1">{anom.description}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500 font-mono">
                  <span>Logged: {anom.timestamp}</span>
                  {anom.candidateName && <span>Candidate: {anom.candidateName}</span>}
                  {anom.orgName && <span>Org: {anom.orgName}</span>}
                </div>
              </div>
            </div>

            {!anom.resolved && (
              <button
                onClick={() => resolveAnomaly(anom.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark Resolved</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
