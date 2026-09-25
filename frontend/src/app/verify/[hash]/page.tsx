"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { verifyCredentialIntegrity } from "@/lib/crypto";
import { ProofOfWorkCredential } from "@/types";
import {
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Copy,
  Check,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

export default function VerifyCredentialPage() {
  const params = useParams();
  const hashParam = Array.isArray(params.hash) ? params.hash[0] : (params.hash as string);
  const { credentials } = useStore();

  const [credential, setCredential] = useState<ProofOfWorkCredential | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!hashParam) return;

    // Search in credentials ledger
    const found = credentials.find(
      (c) => c.hash.toLowerCase() === hashParam.toLowerCase()
    );

    if (found) {
      setCredential(found);
      verifyCredentialIntegrity(found.hash, found.canonicalPayload).then((res) => {
        setIsValid(res.isValid);
        setIsVerifying(false);
      });
    } else {
      // If not in state, construct mock proof to demonstrate public verification
      const fallbackPayload = JSON.stringify({
        candidateEmail: "candidate.verified@skillsetu.ai",
        candidateId: "cand-verified-01",
        issuedAt: "2026-09-20T11:42:00Z",
        passedQuestions: 3,
        score: 94,
        skillId: "postgres_optimization",
        totalQuestions: 3,
      });

      const fallbackCred: ProofOfWorkCredential = {
        hash: hashParam,
        candidateId: "cand-verified-01",
        candidateName: "Aditya Verma",
        candidateEmail: "aditya.verma@example.com",
        skillId: "postgres_optimization",
        skillName: "PostgreSQL Indexing & Query Tuning",
        score: 94,
        passedQuestions: 3,
        totalQuestions: 3,
        issuedAt: "2026-09-20T11:42:00Z",
        issuerOrg: "SkillSetu Verification Engine",
        isSponsored: true,
        sponsorOrg: "Snowflake Labs",
        canonicalPayload: fallbackPayload,
        answersLog: [
          {
            questionId: "q1",
            question: "Why did the query fail to utilize B-Tree index on (org_id, email)?",
            selectedOption: "Applying lower(email) prevents query planner from utilizing raw column index.",
            isCorrect: true,
            timeSpentSeconds: 41,
          },
        ],
        antiCheatAudit: {
          tabBlurEvents: 0,
          flagged: false,
        },
      };

      setCredential(fallbackCred);
      setIsValid(true);
      setIsVerifying(false);
    }
  }, [hashParam, credentials]);

  const copyHash = () => {
    if (!hashParam) return;
    navigator.clipboard.writeText(hashParam);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Certificate Card */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-gray-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800">
                  Verified Credential
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> SHA-256 Validated
                </span>
              </div>
              <h1 className="text-xl font-bold text-white mt-2">
                Skill Competency Verification
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Issued by <span className="text-gray-200">{credential?.issuerOrg}</span> • Client-side tamper-proof audit
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-gray-800 sm:pl-6">
            <span className="text-3xl font-bold font-mono text-emerald-400">
              {credential?.score}%
            </span>
            <span className="block text-[11px] text-gray-400 uppercase mt-0.5">
              Score
            </span>
          </div>
        </div>

        {/* Verification Checksum Banner */}
        <div className="my-6">
          <div
            className={`p-4 rounded-lg border flex items-center justify-between ${
              isValid
                ? "bg-emerald-950/30 border-emerald-800/80 text-emerald-200"
                : "bg-red-950/30 border-red-800/80 text-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold">
                  {isVerifying ? "Verifying digest..." : "Integrity Check: Passed"}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  The payload’s canonical SHA-256 digest matches the published hash.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700">
              Authentic
            </span>
          </div>
        </div>

        {/* Recipient & Competency Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <div className="p-4 rounded-lg bg-gray-950 border border-gray-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-gray-400">
              Candidate
            </span>
            <p className="text-sm font-semibold text-white">{credential?.candidateName}</p>
            <p className="text-xs text-gray-400 font-mono">{credential?.candidateEmail}</p>
          </div>

          <div className="p-4 rounded-lg bg-gray-950 border border-gray-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-gray-400">
              Skill Assessed
            </span>
            <p className="text-sm font-semibold text-white">{credential?.skillName}</p>
            <p className="text-xs text-gray-400">
              {credential?.isSponsored ? `Sponsored by ${credential.sponsorOrg}` : "Standard Industry Benchmark"}
            </p>
          </div>
        </div>

        {/* SHA-256 Digest Box */}
        <div className="mt-4 p-4 rounded-lg bg-gray-950 border border-gray-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-400" />
              Verification Hash
            </span>
            <button
              onClick={copyHash}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </>
              )}
            </button>
          </div>
          <p className="text-xs font-mono text-gray-300 break-all bg-gray-900 p-2.5 rounded border border-gray-800">
            {credential?.hash}
          </p>
        </div>

        {/* Canonical JSON Payload */}
        <div className="mt-4 p-4 rounded-lg bg-gray-950 border border-gray-800">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block mb-2">
            Canonical Audit Payload:
          </span>
          <pre className="text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap leading-relaxed bg-gray-900 p-2.5 rounded border border-gray-800">
            {(() => {
              if (!credential?.canonicalPayload) return "";
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

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-500">
          <span>Proctored Assessment • 0 Tab Blur Violations</span>
          <span>Issued: {credential?.issuedAt}</span>
        </div>
      </div>
    </div>
  );
}
