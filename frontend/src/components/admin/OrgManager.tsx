"use client";

import React from "react";
import { useStore } from "@/lib/store";
import { Building2, Shield, Plus, CheckCircle, Ban, RefreshCcw } from "lucide-react";
import { Organization } from "@/types";

export default function OrgManager() {
  const { organizations, setOrganizations, addToast } = useStore();

  const handleToggleStatus = (orgId: string) => {
    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.id !== orgId) return org;
        const newStatus = org.status === "active" ? "suspended" : "active";
        addToast({
          type: newStatus === "active" ? "success" : "warning",
          title: `Organization Status Changed`,
          message: `${org.name} has been ${newStatus.toUpperCase()}. Data remains intact for reinstatement.`,
        });
        return { ...org, status: newStatus };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border-indigo-500/20 bg-gradient-to-r from-slate-950 via-[#101429] to-slate-950">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">
                Multi-Tenant Organization Management
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-semibold">
                Superuser Console
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage enterprise tenants, seat quotas, and subscription lifecycle.
            </p>
          </div>
        </div>
      </div>

      {/* Orgs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {organizations.map((org) => {
          const isActive = org.status === "active";

          return (
            <div
              key={org.id}
              className={`p-5 rounded-2xl glass-panel border transition-all flex flex-col justify-between ${
                isActive ? "border-slate-800" : "border-red-500/30 bg-red-950/10"
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800">
                      {org.logo}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{org.name}</h4>
                      <p className="text-[11px] text-slate-400 capitalize font-mono">
                        {org.type} • {org.plan} Plan
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                      isActive
                        ? "bg-emerald-950/80 text-emerald-400 border-emerald-800/80"
                        : "bg-red-950/80 text-red-400 border-red-800/80"
                    }`}
                  >
                    {org.status}
                  </span>
                </div>

                {/* Seat Quotas & Metrics (A8, E15) */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Active Recruiter Seats:</span>
                    <span className="font-mono text-cyan-300 font-semibold">
                      {org.seatsUsed} / {org.seatsTotal} ({Math.round((org.seatsUsed / org.seatsTotal) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${(org.seatsUsed / org.seatsTotal) * 100}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Screened</span>
                      <span className="text-slate-200">{org.metrics.candidatesScreened}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Gap Sprints</span>
                      <span className="text-emerald-400">{org.metrics.gapSprintsCompleted}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons (A7) */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                  Created {org.createdDate}
                </span>
                <button
                  onClick={() => handleToggleStatus(org.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30"
                      : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  {isActive ? (
                    <>
                      <Ban className="w-3 h-3" /> Suspend Tenant
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3 h-3" /> Reinstate Tenant
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
