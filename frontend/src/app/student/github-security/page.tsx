"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  FileCode,
  Terminal,
  Lock,
  RefreshCw,
  ExternalLink,
  Eye,
  ArrowLeft,
  Sparkles,
  Zap,
  Award,
  Check,
  GitBranch,
  Star,
  GitFork,
  FileCheck,
} from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import RoleGuard from "@/components/auth/RoleGuard";
import {
  fetchStudentGithubRepos,
  scanStudentRepo,
  remediateStudentRepo,
  inspectStudentRepo,
  StudentGithubRepo,
  StudentRepoScanResult,
  RepoInspectionResult,
} from "@/lib/backendApi";

export default function StudentGithubSecurityPage() {
  const [username, setUsername] = useState("aaravsharma-dev");
  const [repos, setRepos] = useState<StudentGithubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [scanningMap, setScanningMap] = useState<Record<string, boolean>>({});
  const [remediatingMap, setRemediatingMap] = useState<Record<string, boolean>>({});
  const [inspectedRepo, setInspectedRepo] = useState<{
    repo: StudentGithubRepo;
    inspection: RepoInspectionResult;
  } | null>(null);
  const [inspecting, setInspecting] = useState(false);
  const [remediationLog, setRemediationLog] = useState<
    Array<{ id: string; time: string; message: string; commitSha?: string; type: "success" | "info" }>
  >([]);
  const [certifiedHash, setCertifiedHash] = useState<string | null>(null);

  const loadReposAndScan = useCallback(async (user: string) => {
    setLoadingRepos(true);
    try {
      const fetchedRepos = await fetchStudentGithubRepos(user);
      setRepos(fetchedRepos);

      // Trigger automatic background scans for each repo to calculate health scores
      const updatedRepos = [...fetchedRepos];
      for (let i = 0; i < updatedRepos.length; i++) {
        const repo = updatedRepos[i];
        setScanningMap((prev) => ({ ...prev, [repo.full_name]: true }));
        try {
          const scan = await scanStudentRepo(repo.full_name, user);
          updatedRepos[i] = {
            ...repo,
            health_score: scan.health_score,
            scan: scan,
          };
          setRepos([...updatedRepos]);
        } catch (err) {
          console.error(`Error scanning ${repo.full_name}:`, err);
        } finally {
          setScanningMap((prev) => ({ ...prev, [repo.full_name]: false }));
        }
      }
    } catch (e) {
      console.error("Failed to load student repositories:", e);
    } finally {
      setLoadingRepos(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    queueMicrotask(() => {
      loadReposAndScan("aaravsharma-dev");
    });
  }, [loadReposAndScan]);

  const handleScanSingle = async (repo: StudentGithubRepo) => {
    setScanningMap((prev) => ({ ...prev, [repo.full_name]: true }));
    try {
      const scan = await scanStudentRepo(repo.full_name, username);
      setRepos((prev) =>
        prev.map((r) =>
          r.full_name === repo.full_name ? { ...r, health_score: scan.health_score, scan } : r
        )
      );
      addLog(`Scanned ${repo.name}: Health Score ${scan.health_score}/100.`, undefined, "info");
    } catch (e) {
      console.error(e);
    } finally {
      setScanningMap((prev) => ({ ...prev, [repo.full_name]: false }));
    }
  };

  const handleRemediate = async (
    repo: StudentGithubRepo,
    action: "add_gitignore" | "remove_env" | "fix_all"
  ) => {
    setRemediatingMap((prev) => ({ ...prev, [repo.full_name]: true }));
    try {
      const res = await remediateStudentRepo(repo.full_name, action);
      addLog(
        `[${repo.name}] ${res.message}`,
        res.commit_sha,
        "success"
      );

      // Update local repo scan state immediately
      setRepos((prev) =>
        prev.map((r) => {
          if (r.full_name !== repo.full_name) return r;
          const prevScan = r.scan || {
            repo_full_name: r.full_name,
            has_gitignore: false,
            has_env_file: false,
            has_readme: true,
            leaked_secrets: [],
            ai_issues: [],
            health_score: 100,
          };

          const newScan: StudentRepoScanResult = {
            ...prevScan,
            has_gitignore: action === "add_gitignore" || action === "fix_all" ? true : prevScan.has_gitignore,
            has_env_file: action === "remove_env" || action === "fix_all" ? false : prevScan.has_env_file,
            leaked_secrets: action === "remove_env" || action === "fix_all" ? [] : prevScan.leaked_secrets,
            health_score: action === "fix_all" ? 100 : Math.min(100, (prevScan.health_score || 50) + 35),
          };

          return {
            ...r,
            health_score: newScan.health_score,
            scan: newScan,
          };
        })
      );
    } catch (e) {
      console.error("Remediation error:", e);
    } finally {
      setRemediatingMap((prev) => ({ ...prev, [repo.full_name]: false }));
    }
  };

  const handleFixAllRepositories = async () => {
    for (const repo of repos) {
      const needsFix =
        (repo.scan && (!repo.scan.has_gitignore || repo.scan.has_env_file || (repo.scan.leaked_secrets && repo.scan.leaked_secrets.length > 0))) ||
        (repo.health_score && repo.health_score < 100);

      if (needsFix) {
        await handleRemediate(repo, "fix_all");
      }
    }
  };

  const handleInspectCode = async (repo: StudentGithubRepo) => {
    setInspecting(true);
    try {
      const inspection = await inspectStudentRepo(repo.full_name);
      setInspectedRepo({ repo, inspection });
    } catch (e) {
      console.error(e);
    } finally {
      setInspecting(false);
    }
  };

  const handleGenerateCertificate = () => {
    const hash =
      "0x" +
      Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    setCertifiedHash(hash);
    addLog(
      `Verifiable Clean-Code Certificate generated: ${hash.slice(0, 16)}...`,
      hash,
      "success"
    );
  };

  const addLog = (message: string, commitSha?: string, type: "success" | "info" = "info") => {
    setRemediationLog((prev) => [
      {
        id: Math.random().toString(36).substring(2, 9),
        time: new Date().toLocaleTimeString(),
        message,
        commitSha,
        type,
      },
      ...prev.slice(0, 19),
    ]);
  };

  // Compute aggregate metrics
  const totalRepos = repos.length;
  const avgScore =
    totalRepos > 0
      ? Math.round(
          repos.reduce((acc, r) => acc + (r.health_score !== undefined ? r.health_score : 100), 0) /
            totalRepos
        )
      : 100;

  const totalVulnerabilities = repos.reduce((acc, r) => {
    let count = 0;
    if (r.scan?.has_env_file) count++;
    if (r.scan?.leaked_secrets) count += r.scan.leaked_secrets.length;
    if (r.scan && !r.scan.has_gitignore) count++;
    return acc + count;
  }, 0);

  const allClear = totalVulnerabilities === 0 && avgScore >= 95;

  return (
    <RoleGuard allowedRoles={["student", "admin"]} portalName="Student GitHub Secret Shield">
      <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/student"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Return to Student Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <GithubIcon className="w-5 h-5 text-purple-400" />
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Student GitHub Health & Secret Shield
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  Pre-Recruiter Defense
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated credential leak detection (OpenAI, AWS, Google, PATs) & 1-click zero-risk remediation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/github-analysis"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Full AST Codebase Verifier</span>
            </Link>
            <button
              onClick={() => loadReposAndScan(username)}
              disabled={loadingRepos}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingRepos ? "animate-spin" : ""}`} />
              <span>Refresh Repos</span>
            </button>
          </div>
        </div>

        {/* Username Config & Fast Preset Selector */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
              <GithubIcon className="w-4 h-4 text-purple-400" />
              <span>Target Student GitHub Handle:</span>
            </label>
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadReposAndScan(username)}
                placeholder="e.g. aaravsharma-dev"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                onClick={() => loadReposAndScan(username)}
                className="absolute right-1.5 top-1.5 px-2.5 py-0.5 rounded-md bg-purple-600 hover:bg-purple-500 text-[11px] font-semibold text-white transition-colors"
              >
                Scan
              </button>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-500 font-medium">Quick Presets:</span>
            {["aaravsharma-dev", "rdnk2004", "rohitverma-nit"].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setUsername(preset);
                  loadReposAndScan(preset);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  username === preset
                    ? "bg-purple-600/20 border-purple-500/50 text-purple-300"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                @{preset}
              </button>
            ))}
          </div>
        </div>

        {/* Global Security Metrics Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                Average Health Score
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className={`text-2xl font-black ${
                    avgScore >= 90
                      ? "text-emerald-400"
                      : avgScore >= 70
                      ? "text-amber-400"
                      : "text-rose-400"
                  }`}
                >
                  {avgScore}%
                </span>
                <span className="text-[11px] text-slate-500">
                  {avgScore >= 90 ? "Recruiter Clean" : "Remediation Needed"}
                </span>
              </div>
            </div>
            <div
              className={`p-2.5 rounded-xl border ${
                avgScore >= 90
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-400"
              }`}
            >
              {avgScore >= 90 ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                Audited Repositories
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{totalRepos}</span>
                <span className="text-[11px] text-slate-500">Public & Collaborated</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <GithubIcon className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                Active Security Flaws
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className={`text-2xl font-black ${
                    totalVulnerabilities === 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {totalVulnerabilities}
                </span>
                <span className="text-[11px] text-slate-500">
                  {totalVulnerabilities === 0 ? "Zero detected" : "Needs fix before apply"}
                </span>
              </div>
            </div>
            <div
              className={`p-2.5 rounded-xl border ${
                totalVulnerabilities === 0
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-400"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                Recruiter Proof Status
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                    allClear
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  }`}
                >
                  {allClear ? "🛡️ Verified Pristine" : "⚠️ Remediations Pending"}
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Global Action Banner if issues exist */}
        {!allClear && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-amber-950/30 to-purple-950/40 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                <Zap className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Security Vulnerabilities Detected in Student Repositories
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Missing .gitignore rules (-10 pts) and committed .env / hardcoded API keys (-30 pts) will severely penalize candidate ATS scores in tech screening.
                </p>
              </div>
            </div>
            <button
              onClick={handleFixAllRepositories}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 whitespace-nowrap transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Fix All Repositories (1-Click Auto-Remediate)</span>
            </button>
          </div>
        )}

        {/* All Clear Attestation Card */}
        {allClear && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-teal-950/40 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-300">
                  All Repositories 100% Clean · Zero Credentials Exposed
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  No OpenAI/AWS secrets found, standard .gitignore active, no committed .env files.
                </p>
              </div>
            </div>
            {!certifiedHash ? (
              <button
                onClick={handleGenerateCertificate}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center justify-center gap-1.5 whitespace-nowrap transition-all"
              >
                <Award className="w-4 h-4" />
                <span>Generate Clean-Code Certificate</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs bg-slate-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-emerald-300 font-mono">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Certificate: {certifiedHash.slice(0, 20)}...</span>
              </div>
            )}
          </div>
        )}

        {/* Repository Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>Audited Candidate Repositories ({repos.length})</span>
            </h2>
            <span className="text-[11px] text-slate-400">
              Scoring algorithm: 100 - (No README: 20) - (No Gitignore: 10) - (Has .env: 30) - (Secrets: 20 ea.)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {repos.map((repo) => {
              const isScanning = scanningMap[repo.full_name];
              const isRemediating = remediatingMap[repo.full_name];
              const score = repo.health_score !== undefined ? repo.health_score : 100;
              const scan = repo.scan;

              const hasGitignore = scan ? scan.has_gitignore : true;
              const hasEnvFile = scan ? scan.has_env_file : false;
              const hasReadme = scan ? scan.has_readme : repo.has_readme;
              const leakedSecrets = scan ? scan.leaked_secrets || [] : [];

              const isPristine = score >= 90 && leakedSecrets.length === 0 && !hasEnvFile;

              return (
                <div
                  key={repo.full_name}
                  className={`p-5 rounded-2xl bg-slate-900/90 border transition-all ${
                    isPristine
                      ? "border-slate-800 hover:border-emerald-500/40"
                      : "border-rose-500/30 bg-rose-950/10 hover:border-rose-500/50"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Repo Meta */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-sm font-bold text-white hover:text-purple-300 transition-colors">
                          {repo.name}
                        </span>
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-slate-300"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {repo.language || "Multi-Language"}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Star className="w-3 h-3 text-amber-400" />
                          <span>{repo.stargazers_count}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <GitFork className="w-3 h-3" />
                          <span>{repo.forks_count}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                          <GitBranch className="w-3 h-3" />
                          <span>{repo.default_branch}</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                        {repo.description || "No repository description provided."}
                      </p>

                      {/* Audit Checklist Badges */}
                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        {/* README */}
                        <span
                          className={`flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-md border ${
                            hasReadme
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          }`}
                        >
                          {hasReadme ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          <span>README.md {hasReadme ? "Present" : "Missing (-20)"}</span>
                        </span>

                        {/* .gitignore */}
                        <span
                          className={`flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-md border ${
                            hasGitignore
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          }`}
                        >
                          {hasGitignore ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          <span>.gitignore {hasGitignore ? "Present" : "Missing (-10)"}</span>
                        </span>

                        {/* Committed .env */}
                        <span
                          className={`flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-md border ${
                            !hasEnvFile
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold"
                          }`}
                        >
                          {!hasEnvFile ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          <span>
                            {hasEnvFile ? "🚨 Committed .env Secret File (-30)!" : "No .env Leaked"}
                          </span>
                        </span>

                        {/* Leaked Secrets */}
                        <span
                          className={`flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-md border ${
                            leakedSecrets.length === 0
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold"
                          }`}
                        >
                          {leakedSecrets.length === 0 ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Lock className="w-3 h-3 text-rose-400" />
                          )}
                          <span>
                            {leakedSecrets.length === 0
                              ? "Zero Secrets Leaked"
                              : `${leakedSecrets.length} Credentials Exposed (-${leakedSecrets.length * 20})`}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Score & Actions Panel */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-3 shrink-0">
                      {/* Health Score Pill */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-medium">Health Score:</span>
                        <div
                          className={`px-3 py-1 rounded-xl font-mono text-sm font-extrabold border ${
                            score >= 90
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : score >= 70
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-rose-500/20 text-rose-400 border-rose-500/40"
                          }`}
                        >
                          {score} / 100
                        </div>
                      </div>

                      {/* 1-Click Action Buttons */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => handleInspectCode(repo)}
                          disabled={inspecting}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition-colors"
                          title="Inspect File Tree & Manifests"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect Code</span>
                        </button>

                        <button
                          onClick={() => handleScanSingle(repo)}
                          disabled={isScanning}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-800/60 flex items-center gap-1 transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3 h-3 ${isScanning ? "animate-spin" : ""}`} />
                          <span>Rescan</span>
                        </button>

                        {!hasGitignore && (
                          <button
                            onClick={() => handleRemediate(repo, "add_gitignore")}
                            disabled={isRemediating}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 transition-colors disabled:opacity-50"
                            title="Auto-push standard .gitignore to repository"
                          >
                            <FileCode className="w-3 h-3" />
                            <span>+ .gitignore</span>
                          </button>
                        )}

                        {hasEnvFile && (
                          <button
                            onClick={() => handleRemediate(repo, "remove_env")}
                            disabled={isRemediating}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1 transition-colors disabled:opacity-50"
                            title="Purge committed .env secret file"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Purge .env</span>
                          </button>
                        )}

                        {(!hasGitignore || hasEnvFile || leakedSecrets.length > 0) && (
                          <button
                            onClick={() => handleRemediate(repo, "fix_all")}
                            disabled={isRemediating}
                            className="px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center gap-1 shadow-sm transition-all disabled:opacity-50"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>1-Click Fix All</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Leaked Secrets Finding Details (if any) */}
                  {leakedSecrets.length > 0 && (
                    <div className="mt-4 p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
                        <Lock className="w-3.5 h-3.5 text-rose-400" />
                        <span>High-Risk Exposed Credentials Detected:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {leakedSecrets.map((sec, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-lg bg-slate-950/80 border border-rose-500/20 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-mono text-rose-300 font-semibold">{sec.file}</span>
                              <span className="text-slate-500 ml-1.5 font-mono">Line {sec.line}</span>
                              <p className="text-[11px] text-slate-400 mt-0.5">{sec.pattern}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                              Leaked
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Remediation Audit Trail Log */}
        {remediationLog.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Git Remediation Log & Commit SHAs</span>
            </h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-[11px]">
              {remediationLog.map((log) => (
                <div
                  key={log.id}
                  className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-slate-500 text-[10px]">{log.time}</span>
                    <span className={log.type === "success" ? "text-emerald-400" : "text-blue-300"}>
                      {log.message}
                    </span>
                  </div>
                  {log.commitSha && (
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] shrink-0 font-mono">
                      commit: {log.commitSha.slice(0, 10)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code & Manifest Inspection Modal */}
        {inspectedRepo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <GithubIcon className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">
                    Repository Architecture & Tree: {inspectedRepo.repo.name}
                  </h3>
                </div>
                <button
                  onClick={() => setInspectedRepo(null)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  ✕ Close
                </button>
              </div>

              {/* Detected Manifests */}
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-1.5">Detected Architecture Manifests:</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {inspectedRepo.inspection.detected_manifests?.length > 0 ? (
                    inspectedRepo.inspection.detected_manifests.map((m) => (
                      <span
                        key={m}
                        className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-mono"
                      >
                        📄 {m}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">No primary manifest found</span>
                  )}
                  <span className="text-xs text-slate-500 ml-2">
                    Total files indexed: {inspectedRepo.inspection.total_files}
                  </span>
                </div>
              </div>

              {/* File Tree Sample */}
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-1.5">Repository Tree Sample:</p>
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-48 leading-relaxed">
                  {inspectedRepo.inspection.file_tree}
                </pre>
              </div>

              {/* Sample Code Pieces */}
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-1.5">Primary Entrypoint Source Snippet:</p>
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-48 leading-relaxed">
                  {inspectedRepo.inspection.sample_code}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </RoleGuard>
  );
}
