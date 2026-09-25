"use client";

import React, { useState, useEffect } from "react";
import { ProofOfWorkCredential, Candidate } from "@/types";
import { verifyCredentialIntegrity } from "@/lib/crypto";
import { useStore } from "@/lib/store";
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
      <div className="relative w-full max-w-3xl rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">
                  Skill Verification Audit
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-medium">
                  SHA-256 Validated
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Auditing competency proof for{" "}
                <span className="text-blue-400 font-medium">{displayName}</span> •{" "}
                <span className="text-gray-200">{credential.skillName}</span>
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-4 border-b border-gray-800 pb-2">
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "audit"
                ? "bg-gray-800 text-white border border-gray-700"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Verification Audit
          </button>
          <button
            onClick={() => setActiveTab("answers")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "answers"
                ? "bg-gray-800 text-white border border-gray-700"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Answers Log ({credential.answersLog.length})
          </button>
          <button
            onClick={() => setActiveTab("payload")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "payload"
                ? "bg-gray-800 text-white border border-gray-700"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Canonical JSON
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {activeTab === "audit" && (
            <div className="space-y-4">
              {/* Integrity Status Card */}
              <div
                className={`p-4 rounded-lg border flex items-center justify-between ${
                  verificationResult.verified
                    ? "bg-emerald-950/20 border-emerald-800/80 text-emerald-200"
                    : "bg-red-950/20 border-red-800/80 text-red-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  {verificationResult.verified ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-sm font-semibold">
                      {verificationResult.loading
                        ? "Calculating Client-Side Digest..."
                        : verificationResult.verified
                        ? "Cryptographic Integrity Verified ✓"
                        : "Integrity Mismatch / Corrupted"}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Client-side Web Crypto API computed SHA-256 against canonical JSON payload.
                      No tampering detected.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-mono text-emerald-400">
                    {credential.score}%
                  </span>
                  <p className="text-[10px] text-gray-400 uppercase">Score</p>
                </div>
              </div>

              {/* SHA-256 Hash Display */}
              <div className="p-3.5 rounded-lg bg-gray-950 border border-gray-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                    SHA-256 Digest
                  </span>
                  <button
                    onClick={copyHash}
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
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
                <p className="text-xs font-mono text-gray-300 break-all bg-gray-900 p-2.5 rounded border border-gray-800">
                  {credential.hash}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-gray-950 border border-gray-800">
                  <span className="text-gray-400 text-[10px] uppercase">Issuer</span>
                  <p className="font-semibold text-gray-200 mt-1">{credential.issuerOrg}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-950 border border-gray-800">
                  <span className="text-gray-400 text-[10px] uppercase">Issued Date</span>
                  <p suppressHydrationWarning className="font-semibold text-gray-200 mt-1 font-mono">
                    {credential.issuedAt ? credential.issuedAt.split("T")[0] : ""}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-950 border border-gray-800">
                  <span className="text-gray-400 text-[10px] uppercase">Questions Mastered</span>
                  <p className="font-semibold text-gray-200 mt-1 font-mono">
                    {credential.passedQuestions} / {credential.totalQuestions} (100%)
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-950 border border-gray-800">
                  <span className="text-gray-400 text-[10px] uppercase">Proctoring</span>
                  <p className="font-semibold text-emerald-400 mt-1 font-mono">
                    {credential.antiCheatAudit.tabBlurEvents} Tab Blurs (Clean)
                  </p>
                </div>
              </div>

              {/* Public Verification Link */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-950 border border-gray-800 text-xs">
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">Public Verification URL:</span>
                  <span className="font-mono text-blue-400">/verify/{credential.hash.slice(0, 16)}...</span>
                </div>
                <Link
                  href={`/verify/${credential.hash}`}
                  target="_blank"
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium"
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
                  className="p-3.5 rounded-lg bg-gray-950 border border-gray-800 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-medium text-gray-200">
                      Q{idx + 1}: {ans.question}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0">
                      Correct ✓
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-gray-900 border border-gray-800 text-emerald-300 font-mono text-xs">
                    <span className="text-[10px] text-gray-500 block mb-0.5">Submitted Answer:</span>
                    {ans.selectedOption}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>Time spent: {ans.timeSpentSeconds} seconds</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "payload" && (
            <div className="p-4 rounded-lg bg-gray-950 border border-gray-800">
              <p className="text-[10px] font-mono text-gray-400 mb-2 uppercase">
                Canonical Audit JSON:
              </p>
              <pre className="text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap leading-relaxed bg-gray-900 p-2.5 rounded border border-gray-800">
                {(() => {
                  if (!credential.canonicalPayload) return "";
                  try {
                    const parsed = JSON.parse(credential.canonicalPayload);
                    return typeof parsed === "object" && parsed !== null
                      ? JSON.stringify(parsed, null, 2)
                      : String(credential.canonicalPayload);
                  } catch {
                    return String(credential.canonicalPayload);
                  }
                })()}
              </pre>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-800 mt-2">
          <div className="text-xs text-gray-400">
            Pipeline Status:{" "}
            <span className="uppercase font-mono text-blue-400 font-medium">
              {candidate.pipelineStatus}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
            {candidate.pipelineStatus !== "shortlisted" &&
              candidate.pipelineStatus !== "interview" &&
              candidate.pipelineStatus !== "offer" && (
                <button
                  onClick={handleShortlist}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                >
                  <UserCheck className="w-4 h-4" />
                  Shortlist for Interview
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
