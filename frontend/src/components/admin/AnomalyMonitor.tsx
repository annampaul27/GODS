"use client";

import React from "react";
import { useStore } from "@/lib/store";
import { AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function AnomalyMonitor() {
  const { anomalies, resolveAnomaly } = useStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-rose-950/60 border border-rose-800/80 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white">
                Assessment Integrity & Anomaly Detection
              </h3>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-medium">
                Live Audit
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Automated anomaly detection for tab-blur events, rapid submission patterns, and proctoring alerts.
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
                ? "bg-gray-950/40 border-gray-800/60 opacity-60"
                : anom.severity === "high"
                ? "bg-rose-950/20 border-rose-800/50"
                : "bg-amber-950/20 border-amber-800/50"
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
                    className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-medium border ${
                      anom.severity === "high"
                        ? "bg-rose-950 text-rose-300 border-rose-800"
                        : "bg-amber-950 text-amber-300 border-amber-800"
                    }`}
                  >
                    {anom.severity}
                  </span>
                  {anom.resolved && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                      Resolved
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-300 mt-1">{anom.description}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-500">
                  <span>Logged: {anom.timestamp}</span>
                  {anom.candidateName && <span>Candidate: {anom.candidateName}</span>}
                  {anom.orgName && <span>Org: {anom.orgName}</span>}
                </div>
              </div>
            </div>

            {!anom.resolved && (
              <button
                onClick={() => resolveAnomaly(anom.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-700 text-xs font-medium text-gray-300 hover:text-white transition-colors shrink-0"
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
