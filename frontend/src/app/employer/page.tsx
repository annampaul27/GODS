"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { Candidate, ProofOfWorkCredential } from "@/types";
import TalentRadar from "@/components/employer/TalentRadar";
import PipelineKanban from "@/components/employer/PipelineKanban";
import ProofOfWorkModal from "@/components/employer/ProofOfWorkModal";
import CandidateDrawer from "@/components/employer/CandidateDrawer";
import JobCreatorModal from "@/components/employer/JobCreatorModal";
import UniversityCohortAnalytics from "@/components/employer/UniversityCohortAnalytics";
import {
  Briefcase,
  Plus,
  Layers,
  GraduationCap,
  Users,
  Eye,
  EyeOff,
  Share2,
  Check,
} from "lucide-react";

export default function EmployerPage() {
  const {
    candidates,
    currentOrg,
    activeJob,
    dispatchGapSprint,
    isAnonymizedScreening,
    setIsAnonymizedScreening,
    addToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"radar" | "pipeline" | "cohort">("radar");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [auditCredential, setAuditCredential] = useState<{
    cred: ProofOfWorkCredential;
    candidate: Candidate;
  } | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  const handleAudit = (cred: ProofOfWorkCredential, candidate: Candidate) => {
    setAuditCredential({ cred, candidate });
  };

  const handleShareShortlist = () => {
    // E18: shareable read-only shortlist link
    const url = window.location.origin + "/verify/" + (auditCredential?.cred.hash || "sample");
    navigator.clipboard.writeText(url);
    setCopiedShareLink(true);
    addToast({
      type: "info",
      title: "Shareable Shortlist Link Copied (E18)",
      message: "External client link copied to clipboard for stakeholder review.",
    });
    setTimeout(() => setCopiedShareLink(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Top Requisition & Org Context Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border-cyan-500/20 bg-gradient-to-r from-slate-950 via-[#0a1226] to-slate-950 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-2xl shadow-inner">
            {currentOrg.logo}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {activeJob?.title || "Lead Software Architect"}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                ACTIVE REQUISITION
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>{currentOrg.name}</span> • <span>{activeJob?.department}</span> •{" "}
              <span>{activeJob?.salaryRange}</span> •{" "}
              <span className="text-cyan-400 font-mono">
                {candidates.length} Applicants Evaluated
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Anonymized Screening Toggle (E17) */}
          <button
            onClick={() => setIsAnonymizedScreening(!isAnonymizedScreening)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
              isAnonymizedScreening
                ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            {isAnonymizedScreening ? (
              <>
                <EyeOff className="w-4 h-4 text-amber-400" />
                <span>Blind Mode: ON (E17)</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Blind Mode: OFF</span>
              </>
            )}
          </button>

          {/* Shareable Link (E18) */}
          <button
            onClick={handleShareShortlist}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            title="E18: Shareable, read-only candidate shortlist link"
          >
            {copiedShareLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Share Shortlist (E18)</span>
              </>
            )}
          </button>

          {/* New Requisition Button (E1, E2) */}
          <button
            onClick={() => setIsJobModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ingest Job / JD (E1)</span>
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("radar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "radar"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Talent Radar & Gap Sprints (E3-E6)</span>
          </button>

          <button
            onClick={() => setActiveTab("pipeline")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "pipeline"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Pipeline Kanban (E16)</span>
          </button>

          {/* Show University Cohort Analytics Tab if Org is University (E21, E22) */}
          <button
            onClick={() => setActiveTab("cohort")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "cohort"
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>University Cohort & NAAC Analytics (E21)</span>
          </button>
        </div>

        <div className="hidden sm:block text-xs font-mono text-slate-500">
          Org Plan: <strong className="text-slate-300">{currentOrg.plan}</strong> • Seats:{" "}
          <strong className="text-slate-300">
            {currentOrg.seatsUsed}/{currentOrg.seatsTotal}
          </strong>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "radar" && (
        <TalentRadar
          candidates={candidates}
          onSelectCandidate={(cand) => setSelectedCandidate(cand)}
          onAuditCredential={(cred, cand) => handleAudit(cred, cand)}
        />
      )}

      {activeTab === "pipeline" && (
        <PipelineKanban
          onSelectCandidate={(cand) => setSelectedCandidate(cand)}
          onAuditCredential={(cred, cand) => handleAudit(cred, cand)}
        />
      )}

      {activeTab === "cohort" && <UniversityCohortAnalytics />}

      {/* Modals & Drawers */}
      {selectedCandidate && (
        <CandidateDrawer
          candidate={
            candidates.find((c) => c.id === selectedCandidate.id) || selectedCandidate
          }
          onClose={() => setSelectedCandidate(null)}
          onAuditCredential={(cred) => handleAudit(cred, selectedCandidate)}
          onDispatchSprint={(candId, skillId, skillName) => {
            dispatchGapSprint(candId, skillId, skillName);
          }}
        />
      )}

      {auditCredential && (
        <ProofOfWorkModal
          credential={auditCredential.cred}
          candidate={auditCredential.candidate}
          onClose={() => setAuditCredential(null)}
        />
      )}

      {isJobModalOpen && (
        <JobCreatorModal onClose={() => setIsJobModalOpen(false)} />
      )}
    </div>
  );
}
