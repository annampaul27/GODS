"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { MICRO_SPRINTS } from "@/lib/mockData";
import { MicroSprintData } from "@/types";
import SkillGapRadar from "@/components/student/SkillGapRadar";
import ReadinessRoadmap from "@/components/student/ReadinessRoadmap";
import SprintModal from "@/components/student/SprintModal";
import ResumeUploadDrawer from "@/components/student/ResumeUploadDrawer";
import SkillVerificationModal from "@/components/student/SkillVerificationModal";
import ATSResumeManagerModal from "@/components/student/ATSResumeManagerModal";
import {
  GraduationCap,
  UploadCloud,
  Compass,
  Radar,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ExternalLink,
  Award,
  FileText,
  Clock,
  AlertTriangle,
  Bell,
  Calendar,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { UserNotification } from "@/types";
import RealtimeJobAlerts from "@/components/student/RealtimeJobAlerts";
import JobDetailsModal from "@/components/student/JobDetailsModal";

export default function StudentPage() {
  const { currentStudent, activeJob } = useStore();
  const [activeTab, setActiveTab] = useState<"radar" | "roadmap">("radar");
  const [activeSprint, setActiveSprint] = useState<MicroSprintData | null>(null);
  const [isResumeDrawerOpen, setIsResumeDrawerOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isATSResumeModalOpen, setIsATSResumeModalOpen] = useState(false);
  const [verificationSkillId, setVerificationSkillId] = useState("postgresql");
  const [verificationSkillName, setVerificationSkillName] = useState("PostgreSQL Optimization & Architecture");
  const [deadlineAlerts, setDeadlineAlerts] = useState<UserNotification[]>([]);
  const [selectedJobModalId, setSelectedJobModalId] = useState<string | null>(null);


  // Fetch deadline notifications for candidate
  React.useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/notifications?user_id=cand-1");
        if (res.ok) {
          const data = await res.json();
          setDeadlineAlerts(data.notifications || []);
        }
      } catch (e) {
        console.warn("Unable to fetch deadline notifications:", e);
      }
    };
    fetchAlerts();
    const timer = setInterval(fetchAlerts, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleMarkAlertRead = async (alertId: string) => {
    setDeadlineAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, is_read: true } : a))
    );
    try {
      await fetch(`http://localhost:8000/api/v1/notifications/${alertId}/read`, {
        method: "PATCH",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleLaunchSprint = (skillId: string) => {
    // Select sprint from library, or fallback to postgres_optimization
    const sprint = MICRO_SPRINTS[skillId] || MICRO_SPRINTS["postgres_optimization"];
    setActiveSprint(sprint);
  };

  const isJobReady = currentStudent.readinessScore >= 85;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Student Welcome & Profile Summary Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border-emerald-500/20 bg-gradient-to-r from-slate-950 via-[#09151e] to-slate-950 shadow-2xl">
        <div className="flex items-center gap-4">
          <img
            src={currentStudent.avatarUrl}
            alt={currentStudent.fullName}
            className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {currentStudent.fullName}
              </h2>
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold border ${
                  isJobReady
                    ? "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                    : "bg-amber-950/80 text-amber-400 border-amber-800"
                }`}
              >
                {currentStudent.currentTier.replace("_", " ")} ({currentStudent.readinessScore}%)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>{currentStudent.college}</span> • <span>Class of {currentStudent.gradYear}</span> •{" "}
              <span className="text-cyan-400 font-mono">
                {currentStudent.credentials.length} Cryptographic Proofs Minted
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* FR-01: Skill Verification Engine (20 Qs, 12-min Timer) */}
          <button
            id="btn-start-verification-assessment"
            onClick={() => {
              setVerificationSkillId("postgresql");
              setVerificationSkillName("PostgreSQL Optimization & Architecture");
              setIsVerificationModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all border border-cyan-400/40"
          >
            <Award className="w-4 h-4" />
            <span>Verify Skill Assessment (20 Qs • 12-Min)</span>
          </button>

          {/* FR-02: ATS-Friendly Tailored Resume Parser & Editor */}
          <button
            id="btn-open-ats-resume-studio"
            onClick={() => setIsATSResumeModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all border border-emerald-400/40"
          >
            <FileText className="w-4 h-4" />
            <span>ATS Resume Studio</span>
          </button>

          <button
            onClick={() => setIsResumeDrawerOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            <span>Profile Drawer</span>
          </button>
        </div>
      </div>

      {/* FR-05: Real-Time Eligibility Job Matching Alerts (Realtime Live Updates & Actionable Alert) */}
      <RealtimeJobAlerts
        userId={currentStudent.id}
        onOpenJobDetails={(jobId) => setSelectedJobModalId(jobId)}
      />

      {/* FR-04: Deadlines & Strategic Application Notification Widget */}
      {deadlineAlerts.length > 0 && (
        <div id="deadline-alerts-banner" className="space-y-3">
          {deadlineAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                !alert.is_read
                  ? "bg-gradient-to-r from-rose-950/40 via-slate-900/90 to-amber-950/20 border-rose-500/40 shadow-xl shadow-rose-950/20"
                  : "bg-slate-950/60 border-slate-800/80 opacity-75"
              }`}
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    !alert.is_read
                      ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  }`}
                >
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                      Deadline Warning
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {alert.job_title}
                    </span>
                    {!alert.is_read && (
                      <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {alert.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                {!alert.is_read ? (
                  <button
                    onClick={() => handleMarkAlertRead(alert.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 transition-colors"
                  >
                    Mark as Read
                  </button>
                ) : (
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Acknowledged
                  </span>
                )}
                <button
                  onClick={() => {
                    setActiveTab("roadmap");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors"
                >
                  <span>Accelerate Prep</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("radar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "radar"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Radar className="w-4 h-4" />
            <span>Skill Gap Delta Radar</span>
          </button>

          <button
            onClick={() => setActiveTab("roadmap")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "roadmap"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Application Readiness Report & Roadmap</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs">
          <span className="text-slate-400">Target Role:</span>
          <span className="font-semibold text-slate-200">{activeJob?.title}</span>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "radar" && (
        <SkillGapRadar onLaunchSprint={handleLaunchSprint} />
      )}

      {activeTab === "roadmap" && (
        <ReadinessRoadmap onLaunchSprint={handleLaunchSprint} />
      )}

      {/* Minted Credentials Proof Showcase (S10, S11) */}
      <div className="rounded-2xl glass-panel border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            <h4 className="text-xs uppercase font-mono tracking-wider text-slate-300 font-semibold">
              My Cryptographic Proof-of-Work Badges
            </h4>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Zero-Trust Public Ledger
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {currentStudent.credentials.map((cred) => (
            <div
              key={cred.hash}
              className="p-4 rounded-xl border border-cyan-500/30 bg-slate-900/60 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-semibold text-xs text-white">
                      {cred.skillName}
                    </h5>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Issued by {cred.issuerOrg} • {new Date(cred.issuedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800">
                    {cred.score}% Pass
                  </span>
                </div>

                <div className="mt-2 p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">
                    Tamper-Evident SHA-256 Digest:
                  </span>
                  <p className="text-[11px] font-mono text-cyan-300 break-all">
                    {cred.hash}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Immutable Verification URL
                </span>
                <Link
                  href={`/verify/${cred.hash}`}
                  target="_blank"
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium text-[11px]"
                >
                  Verify Publicly <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {isVerificationModalOpen && (
        <SkillVerificationModal
          skillId={verificationSkillId}
          skillName={verificationSkillName}
          onClose={() => setIsVerificationModalOpen(false)}
        />
      )}

      {isATSResumeModalOpen && (
        <ATSResumeManagerModal
          onClose={() => setIsATSResumeModalOpen(false)}
        />
      )}

      {activeSprint && (
        <SprintModal
          sprint={activeSprint}
          onClose={() => setActiveSprint(null)}
        />
      )}

      {isResumeDrawerOpen && (
        <ResumeUploadDrawer onClose={() => setIsResumeDrawerOpen(false)} />
      )}

      {/* FR-05: Actionable Job Details Modal */}
      {selectedJobModalId && (
        <JobDetailsModal
          jobId={selectedJobModalId}
          onClose={() => setSelectedJobModalId(null)}
        />
      )}
    </div>
  );
}
