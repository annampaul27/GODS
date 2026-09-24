"use client";

import React, { useState } from "react";
import { SkillNode } from "@/types";
import { useStore } from "@/lib/store";
import {
  FileText,
  Sparkles,
  Check,
  Plus,
  Trash2,
  X,
  Layers,
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
  const { addNewJob, currentOrg } = useStore();
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

  // Raw JD text parser state (E1, E2)
  const [rawJDText, setRawJDText] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  const handleApplyTemplate = (tmpl: (typeof TEMPLATES)[0]) => {
    setTitle(tmpl.name);
    setDepartment(tmpl.department);
    setDescription(tmpl.description);
    setCriticalSkills(tmpl.critical);
    setOptionalSkills(tmpl.optional);
  };

  const handleParseRawJD = () => {
    if (!rawJDText.trim()) return;
    setIsParsing(true);
    setTimeout(() => {
      // Deterministic NLP extraction simulation based on common keywords
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

      setCriticalSkills(
        foundCritical.length > 0 ? foundCritical : TEMPLATES[0].critical
      );
      setOptionalSkills(
        foundOptional.length > 0 ? foundOptional : TEMPLATES[0].optional
      );
      setTitle("Custom Ingested Requisition: Lead Engineer");
      setDescription(rawJDText.slice(0, 180) + "...");
      setIsParsing(false);
      setTab("template");
    }, 700);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl glass-panel-elevated border-cyan-500/40 p-6 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Job Ingestion & Benchmark Parser
              </h3>
              <p className="text-xs text-slate-400">
                Input job opening via industry template or paste raw JD for automatic skill node extraction.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 mt-4 border-b border-slate-800 pb-2">
          <button
            onClick={() => setTab("template")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              tab === "template"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Configure Requisition
          </button>
          <button
            onClick={() => setTab("raw")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              tab === "raw"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Paste Raw JD Text (Automated Parser)
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {tab === "raw" ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <label className="text-xs font-medium text-slate-200 block mb-1">
                  Paste Raw Job Description Text:
                </label>
                <textarea
                  value={rawJDText}
                  onChange={(e) => setRawJDText(e.target.value)}
                  placeholder="Paste JD text here (e.g. 'We are hiring a Senior Software Engineer with strong experience in FastAPI, PostgreSQL performance tuning, and Next.js React Server Components...')"
                  rows={8}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors font-mono resize-none"
                />
                <button
                  type="button"
                  onClick={handleParseRawJD}
                  disabled={isParsing || !rawJDText.trim()}
                  className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {isParsing ? "Extracting Skill Nodes..." : "Parse JD into Critical & Optional Nodes"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Preconfigured Templates Row */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                  Select Pre-Configured Template:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyTemplate(tmpl)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        title === tmpl.name
                          ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <p className="font-semibold line-clamp-1">{tmpl.name}</p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {tmpl.critical.length} Critical • {tmpl.optional.length} Optional
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Job Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Structured Skills Section (E2) */}
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-emerald-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-emerald-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Critical Skills (Must-Have, Weight = 3.0)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {criticalSkills.length} nodes
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {criticalSkills.map((sk) => (
                      <span
                        key={sk.id}
                        className="px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 text-xs font-mono flex items-center gap-1.5"
                      >
                        {sk.name}
                        <span className="text-[10px] text-emerald-500 font-bold">w=3.0</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-500" />
                      Optional Skills (Nice-to-Have, Weight = 1.0)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {optionalSkills.length} nodes
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {optionalSkills.map((sk) => (
                      <span
                        key={sk.id}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-xs font-mono flex items-center gap-1.5"
                      >
                        {sk.name}
                        <span className="text-[10px] text-slate-500">w=1.0</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-slate-400 block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <span>Publish Requisition & Benchmark Applicants</span>
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
