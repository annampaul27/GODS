"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { verifyCredentialIntegrity } from "@/lib/crypto";
import {
  ShieldCheck,
  Search,
  ExternalLink,
  CheckCircle,
  Copy,
  Check,
  FileCode2,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function CredentialLedger() {
  const { credentials } = useStore();
  const [search, setSearch] = useState("");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [verifiedMap, setVerifiedMap] = useState<Record<string, boolean>>({});

  const handleVerifyOnDemand = async (hash: string, payload: string) => {
    const res = await verifyCredentialIntegrity(hash, payload);
    setVerifiedMap((prev) => ({ ...prev, [hash]: res.isValid }));
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filteredCredentials = credentials.filter(
    (c) =>
      c.hash.toLowerCase().includes(search.toLowerCase()) ||
      c.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      c.skillName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Ledger Header */}
      <div className="p-6 rounded-2xl glass-panel border-purple-500/20 bg-gradient-to-r from-slate-950 via-[#140e24] to-slate-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  Immutable Cryptographic Credential Ledger (A3)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-semibold">
                  Zero-Trust SHA-256
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Publicly auditable, tamper-evident cryptographic proofs minted across organizations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hash, candidate, or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500 w-64 font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl glass-panel border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold">
            Minted Micro-Credentials ({filteredCredentials.length} Recorded)
          </h4>
          <span className="text-[11px] text-slate-500 font-mono">
            Deterministic Canonicalization (NF3)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="pb-3 font-semibold">SHA-256 Digest</th>
                <th className="pb-3 font-semibold">Candidate</th>
                <th className="pb-3 font-semibold">Competency Node</th>
                <th className="pb-3 font-semibold">Score</th>
                <th className="pb-3 font-semibold">Issued Date</th>
                <th className="pb-3 font-semibold">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredCredentials.map((c) => {
                const isVerified = verifiedMap[c.hash];

                return (
                  <tr key={c.hash} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-300 font-medium">
                          {c.hash.slice(0, 16)}...{c.hash.slice(-8)}
                        </span>
                        <button
                          onClick={() => copyHash(c.hash)}
                          className="text-slate-500 hover:text-slate-300 transition-colors"
                          title="Copy full 64-char hex hash"
                        >
                          {copiedHash === c.hash ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 font-medium text-slate-200">
                      <div>
                        <p>{c.candidateName}</p>
                        <p className="text-[10px] text-slate-500">{c.candidateEmail}</p>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="text-slate-300 font-medium">{c.skillName}</span>
                      {c.isSponsored && (
                        <span className="block text-[9px] font-mono text-indigo-400">
                          Sponsored by {c.sponsorOrg}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 font-mono font-bold text-emerald-400">
                      {c.score}%
                    </td>
                    <td className="py-3.5 text-slate-400 font-mono text-[11px]">
                      {new Date(c.issuedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        {isVerified === true ? (
                          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold">
                            <CheckCircle className="w-3.5 h-3.5" /> SHA-256 Valid
                          </span>
                        ) : (
                          <button
                            onClick={() => handleVerifyOnDemand(c.hash, c.canonicalPayload)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            Run Checksum
                          </button>
                        )}

                        <Link
                          href={`/verify/${c.hash}`}
                          target="_blank"
                          className="text-slate-400 hover:text-white p-1"
                          title="Open public verification page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
