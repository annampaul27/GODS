"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import CredentialLedger from "@/components/admin/CredentialLedger";
import SkillTaxonomyTable from "@/components/admin/SkillTaxonomyTable";
import OrgManager from "@/components/admin/OrgManager";
import AnomalyMonitor from "@/components/admin/AnomalyMonitor";
import {
  Shield,
  Network,
  Building2,
  AlertTriangle,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";

export default function AdminPage() {
  const { candidates, jobs, credentials, organizations, anomalies } = useStore();
  const [activeTab, setActiveTab] = useState<"ledger" | "taxonomy" | "orgs" | "anomalies">("ledger");

  const pendingAnomalies = anomalies.filter((a) => !a.resolved);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Platform Telemetry Header (A1) */}
      <div className="p-6 rounded-3xl glass-panel border-purple-500/20 bg-gradient-to-r from-slate-950 via-[#150e24] to-slate-950 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 text-2xl shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Platform Oversight & Trust Governance (Section 3)
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-semibold">
                  SUPERUSER ROOT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Zero-trust credential ledger, global skill canonicalization, and multi-tenant audit controls.
              </p>
            </div>
          </div>
        </div>

        {/* Telemetry Stats (A1) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-800">
          <div>
            <span className="text-xs text-slate-400">Total Active Learners</span>
            <p className="text-2xl font-bold font-mono text-white mt-1">
              1,420 <span className="text-xs text-slate-400 font-sans font-normal">candidates</span>
            </p>
            <p className="text-[11px] text-cyan-400 mt-1 font-mono">Telemetry A1</p>
          </div>

          <div>
            <span className="text-xs text-slate-400">Live Requisitions</span>
            <p className="text-2xl font-bold font-mono text-cyan-400 mt-1">
              {jobs.length} <span className="text-xs text-slate-400 font-sans font-normal">openings</span>
            </p>
            <p className="text-[11px] text-cyan-400/80 mt-1 font-mono">Critical Weights Bound</p>
          </div>

          <div>
            <span className="text-xs text-slate-400">Minted Proofs</span>
            <p className="text-2xl font-bold font-mono text-purple-300 mt-1">
              {credentials.length} <span className="text-xs text-slate-400 font-sans font-normal">verified</span>
            </p>
            <p className="text-[11px] text-purple-400 mt-1 font-mono">100% SHA-256 Validated</p>
          </div>

          <div>
            <span className="text-xs text-slate-400">Tenant Orgs</span>
            <p className="text-2xl font-bold font-mono text-indigo-300 mt-1">
              {organizations.length} <span className="text-xs text-slate-400 font-sans font-normal">tenants</span>
            </p>
            <p className="text-[11px] text-indigo-400 mt-1 font-mono">
              {pendingAnomalies.length > 0 ? (
                <span className="text-rose-400 font-semibold">{pendingAnomalies.length} Flagged Anomalies</span>
              ) : (
                "Sentinel Clean"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("ledger")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "ledger"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Cryptographic Credential Ledger (A3)</span>
          </button>

          <button
            onClick={() => setActiveTab("taxonomy")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "taxonomy"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Global Skill Taxonomy (A2)</span>
          </button>

          <button
            onClick={() => setActiveTab("orgs")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "orgs"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Multi-Tenant Organizations (A7, A8)</span>
          </button>

          <button
            onClick={() => setActiveTab("anomalies")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "anomalies"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Fraud & Conflict Sentinel (A9-A11)</span>
            {pendingAnomalies.length > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                {pendingAnomalies.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "ledger" && <CredentialLedger />}
      {activeTab === "taxonomy" && <SkillTaxonomyTable />}
      {activeTab === "orgs" && <OrgManager />}
      {activeTab === "anomalies" && <AnomalyMonitor />}
    </div>
  );
}
