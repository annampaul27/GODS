"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  RefreshCw,
} from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import {
  runDeepGitHubAudit,
  GitHubAuditResult,
} from "@/lib/backendApi";
import GitHubAuditView from "@/components/github/GitHubAuditView";

interface GitHubAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUsername?: string;
  candidateName?: string;
}

export const GitHubAnalysisModal: React.FC<GitHubAnalysisModalProps> = ({
  isOpen,
  onClose,
  defaultUsername = "aaravsharma-dev",
  candidateName = "Aarav Sharma",
}) => {
  const [username, setUsername] = useState(defaultUsername);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"audit" | "discrepancies" | "repos" | "proof">("audit");
  const [auditResult, setAuditResult] = useState<GitHubAuditResult | null>(null);
  const [mintedProof, setMintedProof] = useState<string | null>(null);
  const [scanningStep, setScanningStep] = useState<string>("");

  const handleRunAudit = useCallback(async (targetUser: string) => {
    setLoading(true);
    setMintedProof(null);
    setScanningStep("Connecting to FastAPI CareerCompass router...");

    try {
      setTimeout(() => setScanningStep("Scanning public repository AST syntax trees..."), 300);
      setTimeout(() => setScanningStep("Computing cyclomatic complexity & test file density..."), 700);
      setTimeout(() => setScanningStep("Cross-referencing resume claims against committed code..."), 1100);

      const result = await runDeepGitHubAudit(targetUser);
      setTimeout(() => {
        setAuditResult(result);
        setLoading(false);
        setScanningStep("");
      }, 1400);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setScanningStep("");
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      queueMicrotask(() => {
        handleRunAudit(defaultUsername);
      });
    }
  }, [isOpen, defaultUsername, handleRunAudit]);

  const handleMintBadge = () => {
    const hash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    setMintedProof(hash);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <GithubIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">
                  GitHub AST Codebase & Commit Verifier
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/40">
                  FastAPI Engine (/api/v1/career-compass)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Deep AST complexity scanner & resume claim anti-fraud verifier
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Bar */}
        <div className="px-6 py-3.5 bg-slate-900/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[280px]">
            <span className="text-xs font-mono text-slate-400">github.com/</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. aaravsharma-dev"
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
            />
            <button
              onClick={() => handleRunAudit(username)}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all shadow disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Auditing AST..." : "Audit GitHub Repos"}</span>
            </button>
          </div>

          {/* Preset Profiles */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-[11px] text-slate-500">Quick Test:</span>
            {[
              { label: "Aarav (Docker Discrepancy)", user: "aaravsharma-dev" },
              { label: "Pooja (Rust 94%)", user: "poojasundaram" },
              { label: "Aditya (FullStack)", user: "adityaverma-eng" },
            ].map((p) => (
              <button
                key={p.user}
                onClick={() => {
                  setUsername(p.user);
                  handleRunAudit(p.user);
                }}
                className={`text-[11px] px-2 py-1 rounded border transition-colors ${
                  username.toLowerCase().includes(p.user.slice(0, 5))
                    ? "bg-purple-950/60 border-purple-600 text-purple-200"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body with Shared GitHubAuditView */}
        <div className="flex-1 overflow-y-auto p-6">
          <GitHubAuditView
            username={username}
            auditResult={auditResult}
            loading={loading}
            scanningStep={scanningStep}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            mintedProof={mintedProof}
            onMintProof={handleMintBadge}
            candidateName={candidateName}
            variant="modal"
          />
        </div>
      </div>
    </div>
  );
};

export default GitHubAnalysisModal;
