"use client";

import React from "react";
import { useStore } from "@/lib/store";
import { Building2, CheckCircle, Ban } from "lucide-react";

export default function OrgManager() {
  const { organizations, setOrganizations, addToast } = useStore();

  const handleToggleStatus = (orgId: string) => {
    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.id !== orgId) return org;
        const newStatus = org.status === "active" ? "suspended" : "active";
        addToast({
          type: newStatus === "active" ? "success" : "warning",
          title: "Organization Status Updated",
          message: `${org.name} has been ${newStatus}. Access and seats updated accordingly.`,
        });
        return { ...org, status: newStatus };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-800/80 flex items-center justify-center text-blue-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white">
                Organization & Tenant Management
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700 font-medium">
                Admin Console
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
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
              className={`p-5 rounded-xl border transition-colors flex flex-col justify-between ${
                isActive
                  ? "bg-gray-900 border-gray-800"
                  : "bg-red-950/10 border-red-800/40"
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl p-2 rounded-lg bg-gray-950 border border-gray-800">
                      {org.logo}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{org.name}</h4>
                      <p className="text-xs text-gray-400 capitalize">
                        {org.type} • {org.plan} Plan
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-medium border ${
                      isActive
                        ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                        : "bg-red-950 text-red-400 border-red-800"
                    }`}
                  >
                    {org.status}
                  </span>
                </div>

                {/* Seat Quotas & Metrics */}
                <div className="mt-4 pt-3 border-t border-gray-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Recruiter Seats:</span>
                    <span className="font-mono text-gray-200 font-medium">
                      {org.seatsUsed} / {org.seatsTotal} ({Math.round((org.seatsUsed / org.seatsTotal) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(org.seatsUsed / org.seatsTotal) * 100}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-gray-950 border border-gray-800">
                      <span className="text-gray-500 text-[11px] block">Screened</span>
                      <span className="text-gray-200 font-medium">{org.metrics.candidatesScreened}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-gray-950 border border-gray-800">
                      <span className="text-gray-500 text-[11px] block">Skill Sprints</span>
                      <span className="text-emerald-400 font-medium">{org.metrics.gapSprintsCompleted}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 pt-3 border-t border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Added {org.createdDate}
                </span>
                <button
                  onClick={() => handleToggleStatus(org.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/80"
                      : "bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/80"
                  }`}
                >
                  {isActive ? (
                    <>
                      <Ban className="w-3.5 h-3.5" /> Suspend
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" /> Activate
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
