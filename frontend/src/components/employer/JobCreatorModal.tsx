"use client";

import React, { useState } from "react";
import { SkillNode } from "@/types";
import { useStore } from "@/lib/store";
import {
  FileText,
  Sparkles,
  X,
  ArrowRight,
} from "lucide-react";

interface JobCreatorModalProps {
  onClose: () => void;
}

const TEMPLATES = [
  {
    name: "Full-Stack Next.js 15 & FastAPI Systems Architect",
    department: "Core Engineering",
    critical: [
      { id: "react_server_components", name: "React Server Components & Streaming", category: "frontend" as const, weight: 3.0, isCritical: true },
      { id: "fastapi_async", name: "FastAPI Async Architecture", category: "backend" as const, weight: 3.0, isCritical: true },
      { id: "postgres_optimization", name: "PostgreSQL Indexing & Query Tuning", category: "backend" as const, weight: 3.0, isCritical: true },
    ],
    optional: [
      { id: "redis_caching", name: "Redis Distributed Locks & Caching", category: "backend" as const, weight: 1.0, isCritical: false },
      { id: "docker_containerization", name: "Docker Multi-stage Builds", category: "devops" as const, weight: 1.0, isCritical: false },
    ],
    description: "Seeking a senior architect with hands-on experience in async Python runtimes, SQL query tuning, and streaming RSC.",
  },
  {
    name: "AI Systems & Inference Infrastructure Engineer",
    department: "Applied AI",
    critical: [
      { id: "llm_evaluation", name: "LLM Pipeline Evaluation & Tracing", category: "data_ai" as const, weight: 3.0, isCritical: true },
      { id: "vector_db", name: "Vector Embeddings & HNSW Indexing", category: "data_ai" as const, weight: 3.0, isCritical: true },
      { id: "fastapi_async", name: "FastAPI Async Architecture", category: "backend" as const, weight: 3.0, isCritical: true },
    ],
    optional: [
      { id: "redis_caching", name: "Redis Distributed Locks & Caching", category: "backend" as const, weight: 1.0, isCritical: false },
      { id: "docker_containerization", name: "Docker Multi-stage Builds", category: "devops" as const, weight: 1.0, isCritical: false },
    ],
    description: "Looking for an engineer to build low-latency RAG architectures and high-throughput model gateways.",
  },
  {
    name: "Cloud Native Microservices & Kubernetes SRE",
    department: "Cloud Operations",
    critical: [
      { id: "k8s_orchestration", name: "Kubernetes Custom Controllers", category: "devops" as const, weight: 3.0, isCritical: true },
      { id: "distributed_tracing", name: "Distributed Tracing & OpenTelemetry", category: "devops" as const, weight: 3.0, isCritical: true },
      { id: "postgres_optimization", name: "PostgreSQL High Availability & Patroni", category: "backend" as const, weight: 3.0, isCritical: true },
    ],
    optional: [
      { id: "docker_containerization", name: "Docker Multi-stage Builds", category: "devops" as const, weight: 1.0, isCritical: false },
      { id: "redis_caching", name: "Redis Sentinel & Clustering", category: "backend" as const, weight: 1.0, isCritical: false },
    ],
    description: "Lead our reliability engineering practice across multiregion clusters with sub-second failovers.",
  },
];

export default function JobCreatorModal({ onClose }: JobCreatorModalProps) {
  const { addNewJob, currentOrg, addToast } = useStore();
  const [tab, setTab] = useState<"template" | "raw">("template");

  // Form states
  const [title, setTitle] = useState(TEMPLATES[0].name);
  const [department, setDepartment] = useState(TEMPLATES[0].department);
  const [location, setLocation] = useState("Bengaluru / Remote");
  const [experienceMinYears, setExperienceMinYears] = useState(3);
  const [salaryRange, setSalaryRange] = useState("₹28,00,000 - ₹38,00,000");
  const [description, setDescription] = useState(TEMPLATES[0].description);
  const [criticalSkills, setCriticalSkills] = useState<SkillNode[]>(TEMPLATES[0].critical);
  const [optionalSkills, setOptionalSkills] = useState<SkillNode[]>(TEMPLATES[0].optional);

  // Raw JD text parser state
  const [rawJDText, setRawJDText] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  const handleApplyTemplate = (tmpl: (typeof TEMPLATES)[0]) => {
    setTitle(tmpl.name);
    setDepartment(tmpl.department);
    setDescription(tmpl.description);
    setCriticalSkills(tmpl.critical);
    setOptionalSkills(tmpl.optional);
  };

  const handleParseRawJD = async () => {
    if (!rawJDText.trim()) return;
    setIsParsing(true);

    try {
      const response = await fetch("http://localhost:8000/api/v1/ats/parse-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_text: rawJDText }),
      });

      if (response.ok) {
        const jdData = await response.json();
        
        const parsedCritical: SkillNode[] = (jdData.mandatory_skills || []).map((skillName: string, idx: number) => ({
          id: `crit_${skillName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${idx}`,
          name: skillName,
          category: skillName.toLowerCase().includes("react") || skillName.toLowerCase().includes("next") ? "frontend" : "backend",
          weight: 3.0,
          isCritical: true,
        }));

        const parsedOptional: SkillNode[] = (jdData.nice_to_have_skills || []).map((skillName: string, idx: number) => ({
          id: `opt_${skillName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${idx}`,
          name: skillName,
          category: skillName.toLowerCase().includes("docker") || skillName.toLowerCase().includes("k8s") ? "devops" : "backend",
          weight: 1.0,
          isCritical: false,
        }));

        if (parsedCritical.length > 0) setCriticalSkills(parsedCritical);
        if (parsedOptional.length > 0) setOptionalSkills(parsedOptional);
        if (jdData.job_title) setTitle(jdData.job_title);
        if (jdData.description_summary) setDescription(jdData.description_summary);
        if (jdData.years_of_experience_required) setExperienceMinYears(jdData.years_of_experience_required);

        addToast({
          type: "success",
          title: "Job Description Parsed",
          message: `Extracted ${parsedCritical.length} mandatory skills and ${parsedOptional.length} preferred skills from job description.`,
        });
        setIsParsing(false);
        setTab("template");
        return;
      }
    } catch (err) {
      console.warn("Backend ATS offline, using local parser fallback:", err);
    }

    // Local deterministic fallback
    const foundCritical: SkillNode[] = [];
    const foundOptional: SkillNode[] = [];

    if (/react|next|frontend/i.test(rawJDText)) {
      foundCritical.push({
        id: "react_server_components",
        name: "React Server Components & Streaming",
        category: "frontend",
        weight: 3.0,
        isCritical: true,
      });
    }
    if (/fastapi|python|backend/i.test(rawJDText)) {
      foundCritical.push({
        id: "fastapi_async",
        name: "FastAPI Async Architecture",
        category: "backend",
        weight: 3.0,
        isCritical: true,
      });
    }
    if (/postgres|sql|database/i.test(rawJDText)) {
      foundCritical.push({
        id: "postgres_optimization",
        name: "PostgreSQL Indexing & Query Tuning",
        category: "backend",
        weight: 3.0,
        isCritical: true,
      });
    }
    if (/redis|cache/i.test(rawJDText)) {
      foundOptional.push({
        id: "redis_caching",
        name: "Redis Distributed Locks & Caching",
        category: "backend",
        weight: 1.0,
        isCritical: false,
      });
    }
    if (/docker|container|k8s/i.test(rawJDText)) {
      foundOptional.push({
        id: "docker_containerization",
        name: "Docker Multi-stage Builds",
        category: "devops",
        weight: 1.0,
        isCritical: false,
      });
    }

    setCriticalSkills(foundCritical.length > 0 ? foundCritical : TEMPLATES[0].critical);
    setOptionalSkills(foundOptional.length > 0 ? foundOptional : TEMPLATES[0].optional);
    setTitle("Lead Full-Stack Systems Engineer");
    setDescription(rawJDText.slice(0, 180) + "...");
    setIsParsing(false);
    setTab("template");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNewJob({
      orgId: currentOrg.id,
      title,
      department,
      location,
      type: "Full-Time",
      experienceMinYears,
      salaryRange,
      criticalSkills,
      optionalSkills,
      description,
      status: "active",
      passThreshold: 85,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
      <div className="relative w-full max-w-3xl rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Create Job Requisition
              </h3>
              <p className="text-xs text-gray-400">
                Configure job details manually or paste a job description for automated skill extraction.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 mt-4 border-b border-gray-800 pb-2">
          <button
            onClick={() => setTab("template")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              tab === "template"
                ? "bg-gray-800 text-white border border-gray-700"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Configure Requisition
          </button>
          <button
            onClick={() => setTab("raw")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              tab === "raw"
                ? "bg-gray-800 text-white border border-gray-700"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Paste Job Description
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {tab === "raw" ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-950 border border-gray-800">
                <label className="text-xs font-medium text-gray-200 block mb-1">
                  Job Description Text:
                </label>
                <textarea
                  value={rawJDText}
                  onChange={(e) => setRawJDText(e.target.value)}
                  placeholder="Paste JD text here (e.g. 'We are hiring a Senior Software Engineer with strong experience in FastAPI, PostgreSQL performance tuning, and Next.js React Server Components...')"
                  rows={8}
                  className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
                <button
                  type="button"
                  onClick={handleParseRawJD}
                  disabled={isParsing || !rawJDText.trim()}
                  className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {isParsing ? "Extracting Skills..." : "Extract Skills from Text"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Preconfigured Templates Row */}
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-gray-400 block">
                  Role Templates:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyTemplate(tmpl)}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                        title === tmpl.name
                          ? "bg-gray-800 border-gray-600 text-white"
                          : "bg-gray-950 border-gray-800 text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      <p className="font-semibold line-clamp-1">{tmpl.name}</p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        {tmpl.critical.length} Mandatory • {tmpl.optional.length} Preferred
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Job Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Structured Skills Section */}
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-lg bg-gray-950 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Mandatory Skills (Weight: 3.0)
                    </span>
                    <span className="text-xs text-gray-500">
                      {criticalSkills.length} skills
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {criticalSkills.map((sk) => (
                      <span
                        key={sk.id}
                        className="px-2.5 py-1 rounded bg-gray-900 text-emerald-300 border border-gray-800 text-xs flex items-center gap-1.5"
                      >
                        {sk.name}
                        <span className="text-[10px] text-gray-500 font-bold">3.0</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-gray-950 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-gray-500" />
                      Preferred Skills (Weight: 1.0)
                    </span>
                    <span className="text-xs text-gray-500">
                      {optionalSkills.length} skills
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {optionalSkills.map((sk) => (
                      <span
                        key={sk.id}
                        className="px-2.5 py-1 rounded bg-gray-900 text-gray-300 border border-gray-800 text-xs flex items-center gap-1.5"
                      >
                        {sk.name}
                        <span className="text-[10px] text-gray-500">1.0</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-200 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-lg text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                >
                  <span>Publish Job Requisition</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
