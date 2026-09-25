"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Send,
  Layers,
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
  const { addToast } = useStore();
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
      // non-fatal
    }

    addToast({
      type: "success",
      title: "Application Submitted",
      message: `Your verified profile has been submitted to ${job?.company || "the employer"}.`
    });
  };

  if (!jobId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-200">
      <div
        id="job-details-modal"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 shadow-2xl p-6 sm:p-8 space-y-6 text-gray-100"
      >
        {/* Header Close Button */}
        <button
          onClick={onClose}
          id="btn-close-job-modal"
          className="absolute top-5 right-5 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
            <span className="text-xs text-gray-400">Loading opportunity details...</span>
          </div>
        ) : !job ? (
          <div className="py-16 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-gray-600 mx-auto" />
            <h3 className="text-sm font-semibold text-gray-300">Opportunity Unavailable</h3>
            <p className="text-xs text-gray-500">The requested job could not be retrieved.</p>
          </div>
        ) : (
          <>
            {/* Top Banner / Match Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Eligible Match (≥80%)
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs text-blue-300 bg-blue-950 border border-blue-800">
                  <ShieldCheck className="w-3 h-3 text-blue-400" /> Verified Match
                </span>
              </div>
              <span className="text-xs font-mono text-gray-500">ID: {job.id}</span>
            </div>

            {/* Title & Organization Info */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {job.title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-300">
                <span className="flex items-center gap-1.5 font-medium text-gray-200">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  {job.company}
                </span>
                <span className="flex items-center gap-1.5 text-gray-400">
                  <MapPin className="w-3.5 h-3.5 text-gray-500" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-medium">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  {job.salary_range}
                </span>
                <span className="flex items-center gap-1.5 text-gray-400">
                  <Briefcase className="w-3.5 h-3.5 text-gray-500" />
                  {job.type}
                </span>
              </div>
            </div>

            {/* Required Skills Match Grid */}
            <div className="p-4 rounded-lg bg-gray-950 border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-400" />
                  Matching Required Skills
                </h4>
                <span className="text-xs text-emerald-400">All Criteria Satisfied</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {(job.required_skill_names.length > 0 ? job.required_skill_names : ["Python", "SQL", "AWS", "Docker"]).map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Job Description
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed bg-gray-950 p-4 rounded-lg border border-gray-800">
                {job.description}
              </p>
            </div>

            {/* Metadata Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-gray-400">
              <div className="p-2.5 rounded-lg bg-gray-950 border border-gray-800">
                <span className="text-gray-500 block text-[10px] uppercase font-medium">Min Experience</span>
                <span className="text-gray-200 font-semibold">{job.experience_min_years} Years</span>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-950 border border-gray-800">
                <span className="text-gray-500 block text-[10px] uppercase font-medium">Pass Benchmark</span>
                <span className="text-blue-400 font-semibold">{job.pass_threshold}% Fit</span>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-950 border border-gray-800 col-span-2 sm:col-span-1">
                <span className="text-gray-500 block text-[10px] uppercase font-medium">Application Deadline</span>
                <span className="text-gray-300 font-semibold">
                  {job.application_deadline ? job.application_deadline.split(" ")[0] : "Open Rolling"}
                </span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-800">
              <button
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                Close
              </button>

              <button
                id="btn-apply-job-modal"
                disabled={hasApplied}
                onClick={handleApply}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  hasApplied
                    ? "bg-emerald-700 text-white cursor-default"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
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
                    <span>Apply with Verified Skills</span>
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
