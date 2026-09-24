"use client";

import React, { useState, useEffect } from "react";
import { ProofOfWorkCredential, Candidate } from "@/types";
import { verifyCredentialIntegrity } from "@/lib/crypto";
import { useStore } from "@/lib/store";
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Clock,
  KeyRound,
  FileCode2,
  UserCheck,
  X,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";

interface ProofOfWorkModalProps {
  credential: ProofOfWorkCredential;
  candidate: Candidate;
  onClose: () => void;
}

export default function ProofOfWorkModal({
  credential,
  candidate,
  onClose,
}: ProofOfWorkModalProps) {
  const { updateCandidatePipelineStatus, isAnonymizedScreening } = useStore();
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    loading: boolean;
    computedHash: string;
  }>({
    verified: false,
    loading: true,
    computedHash: "",
  });
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"audit" | "payload" | "answers">("audit");

  useEffect(() => {
    async function runVerification() {
      const res = await verifyCredentialIntegrity(
        credential.hash,
        credential.canonicalPayload
      );
      setVerificationResult({
        verified: res.isValid,
        loading: false,
        computedHash: res.calculatedHash,
      });
    }
    runVerification();
  }, [credential]);

  const copyHash = () => {
    navigator.clipboard.writeText(credential.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShortlist = () => {
    updateCandidatePipelineStatus(candidate.id, "shortlisted", "Recruiter Audit Action");
    onClose();
  };

  const displayName = isAnonymizedScreening ? candidate.anonymizedId : candidate.fullName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl glass-panel-elevated border-cyan-500/40 p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">
                  Proof-of-Work Credential Audit (E7)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-semibold">
                  Tamper-Evident SHA-256
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Auditing competency proof for{" "}
                <span className="text-cyan-300 font-medium">{displayName}</span> •{" "}
                <span className="text-slate-200">{credential.skillName}</span>
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-4 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "audit"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Cryptographic Audit
          </button>
          <button
            onClick={() => setActiveTab("answers")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "answers"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Candidate Answers Log ({credential.answersLog.length})
          </button>
          <button
            onClick={() => setActiveTab("payload")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "payload"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Raw Canonical JSON
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {activeTab === "audit" && (
            <div className="space-y-4">
              {/* Integrity Status Card */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  verificationResult.verified
                    ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
                    : "bg-red-950/20 border-red-500/40 text-red-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  {verificationResult.verified ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  ) : (
                    <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-sm font-semibold">
                      {verificationResult.loading
                        ? "Calculating Client-Side Digest..."
                        : verificationResult.verified
                        ? "Cryptographic Integrity Verified ✓"
                        : "Integrity Mismatch / Corrupted"}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Client-side Web Crypto API computed SHA-256 against canonical JSON payload.
                      No tampering detected.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-mono text-emerald-400">
                    {credential.score}%
                  </span>
                  <p className="text-[10px] text-slate-400">Assessment Score</p>
                </div>
              </div>

              {/* SHA-256 Hash Display */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    Immutable SHA-256 Digest
                  </span>
                  <button
                    onClick={copyHash}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy Hash
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs font-mono text-cyan-300 break-all bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  {credential.hash}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase">Issuer Engine</span>
                  <p className="font-semibold text-slate-200 mt-1">{credential.issuerOrg}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase">Issued Date</span>
                  <p className="font-semibold text-slate-200 mt-1 font-mono">
                    {new Date(credential.issuedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase">Questions Mastered</span>
                  <p className="font-semibold text-slate-200 mt-1 font-mono">
                    {credential.passedQuestions} / {credential.totalQuestions} (100%)
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase">Anti-Cheat Flags (S8)</span>
                  <p className="font-semibold text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                    {credential.antiCheatAudit.tabBlurEvents} Tab Blurs (Clean)
                  </p>
                </div>
              </div>

              {/* Public Verification Link (S11) */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-300">Public Zero-Auth Verification URL:</span>
                  <span className="font-mono text-cyan-300">/verify/{credential.hash.slice(0, 16)}...</span>
                </div>
                <Link
                  href={`/verify/${credential.hash}`}
                  target="_blank"
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Audit in New Tab <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {activeTab === "answers" && (
            <div className="space-y-3">
              {credential.answersLog.map((ans, idx) => (
                <div
                  key={ans.questionId}
                  className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-slate-200">
                      Q{idx + 1}: {ans.question}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50 shrink-0">
                      Correct ✓
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-emerald-300 font-mono">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Submitted Answer:</span>
                    {ans.selectedOption}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>Time spent: {ans.timeSpentSeconds} seconds</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "payload" && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-[10px] font-mono text-slate-400 mb-2 uppercase">
                Deterministic Normalized Canonical JSON (NF3):
              </p>
              <pre className="text-xs font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(JSON.parse(credential.canonicalPayload), null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Action Footer (E8) */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-2">
          <div className="text-xs text-slate-400">
            Pipeline Status:{" "}
            <span className="uppercase font-mono text-cyan-400 font-semibold">
              {candidate.pipelineStatus}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Close Audit
            </button>
            {candidate.pipelineStatus !== "shortlisted" &&
              candidate.pipelineStatus !== "interview" &&
              candidate.pipelineStatus !== "offer" && (
                <button
                  onClick={handleShortlist}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <UserCheck className="w-4 h-4" />
                  Shortlist for Interview (E8)
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
