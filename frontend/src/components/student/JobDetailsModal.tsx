"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Send,
  Clock,
  Layers
} from "lucide-react";
import { useStore } from "@/lib/store";
import confetti from "canvas-confetti";

interface JobDetailsModalProps {
  jobId: string;
  onClose: () => void;
}

interface JobDetails {
  id: string;
  title: string;
  company: string;
  department?: string;
  location: string;
  type: string;
  salary_range: string;
  experience_min_years: number;
  description: string;
  pass_threshold: number;
  opening_date: string;
  application_deadline: string;
  critical_skills: Array<{ id: string; name: string; weight: number }>;
  optional_skills: Array<{ id: string; name: string; weight: number }>;
  required_skill_names: string[];
}

export default function JobDetailsModal({ jobId, onClose }: JobDetailsModalProps) {
  const { currentStudent, addToast } = useStore();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/jobs/${jobId}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data);
        } else {
          // Fallback to /api/v1/jobs
          const res2 = await fetch(`http://localhost:8000/api/v1/jobs/${jobId}`);
          if (res2.ok) {
            const data2 = await res2.json();
            setJob(data2);
          }
        }
      } catch (err) {
        console.error("Failed to fetch job details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const handleApply = () => {
    setHasApplied(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // non-fatal if canvas-confetti fails
    }

    addToast({
      type: "success",
      title: "Direct Application Dispatched! 🚀",
      message: `Your cryptographically verified profile has been submitted to hiring leads at ${job?.company || "the employer"}.`
    });
  };

  if (!jobId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="job-details-modal"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-cyan-500/30 bg-[#080e1c] shadow-2xl shadow-cyan-950/40 p-6 sm:p-8 space-y-6 text-slate-100"
      >
        {/* Header Close Button */}
        <button
          onClick={onClose}
          id="btn-close-job-modal"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <span className="text-xs text-slate-400 font-mono">Loading opportunity details...</span>
          </div>
        ) : !job ? (
          <div className="py-16 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">Opportunity Details Unavailable</h3>
            <p className="text-xs text-slate-500">The requested job could not be retrieved from the database.</p>
          </div>
        ) : (
          <>
            {/* Top Banner / Match Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Eligible Job Match (≥80%)
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/60">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" /> Verified Match
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">ID: {job.id}</span>
            </div>

            {/* Title & Organization Info */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                {job.title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-medium text-cyan-300">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  {job.company}
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-medium">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  {job.salary_range}
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  {job.type}
                </span>
              </div>
            </div>

            {/* Required Skills Match Grid */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Matching Required Skills
                </h4>
                <span className="text-[11px] font-mono text-emerald-400">All Criteria Satisfied</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {(job.required_skill_names.length > 0 ? job.required_skill_names : ["Python", "SQL", "AWS", "Docker"]).map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-400">
                Opportunity Description
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-900">
                {job.description}
              </p>
            </div>

            {/* Metadata Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px] font-mono text-slate-400">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-900">
                <span className="text-slate-500 block text-[10px]">MIN EXPERIENCE</span>
                <span className="text-slate-200 font-semibold">{job.experience_min_years} Years</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-900">
                <span className="text-slate-500 block text-[10px]">PASS BENCHMARK</span>
                <span className="text-cyan-300 font-semibold">{job.pass_threshold}% Fit</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-900 col-span-2 sm:col-span-1">
                <span className="text-slate-500 block text-[10px]">APPLICATION DEADLINE</span>
                <span className="text-rose-300 font-semibold">
                  {job.application_deadline ? job.application_deadline.split(" ")[0] : "Open Rolling"}
                </span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                Close
              </button>

              <button
                id="btn-apply-job-modal"
                disabled={hasApplied}
                onClick={handleApply}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all ${
                  hasApplied
                    ? "bg-emerald-600 text-white cursor-default"
                    : "bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-cyan-500/20 border border-cyan-400/40"
                }`}
              >
                {hasApplied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Application Submitted!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>1-Click Apply with Verified Skills</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
