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
      <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-800/80 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">
                  Credential Verification Ledger
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700 font-medium">
                  SHA-256 Audited
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Tamper-evident verification records and cryptographic proofs issued across organizations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hash, candidate, or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg bg-gray-950 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase font-medium tracking-wider text-gray-400">
            Issued Credentials ({filteredCredentials.length})
          </h4>
          <span className="text-xs text-gray-500">
            Canonical SHA-256 Verification
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-medium">Hash</th>
                <th className="pb-3 font-medium">Candidate</th>
                <th className="pb-3 font-medium">Skill</th>
                <th className="pb-3 font-medium">Score</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-sans">
              {filteredCredentials.map((c) => {
                const isVerified = verifiedMap[c.hash];

                return (
                  <tr key={c.hash} className="hover:bg-gray-850/50 transition-colors">
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-gray-300 font-medium">
                          {c.hash.slice(0, 16)}...{c.hash.slice(-8)}
                        </span>
                        <button
                          onClick={() => copyHash(c.hash)}
                          className="text-gray-500 hover:text-gray-300 transition-colors"
                          title="Copy full hash"
                        >
                          {copiedHash === c.hash ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 font-medium text-gray-200">
                      <div>
                        <p>{c.candidateName}</p>
                        <p className="text-[11px] text-gray-500">{c.candidateEmail}</p>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="text-gray-300 font-medium">{c.skillName}</span>
                      {c.isSponsored && (
                        <span className="block text-[10px] text-blue-400">
                          Sponsored by {c.sponsorOrg}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 font-mono font-semibold text-emerald-400">
                      {c.score}%
                    </td>
                    <td className="py-3.5 text-gray-400 text-xs">
                      {new Date(c.issuedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        {isVerified === true ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                            <CheckCircle className="w-3.5 h-3.5" /> Valid
                          </span>
                        ) : (
                          <button
                            onClick={() => handleVerifyOnDemand(c.hash, c.canonicalPayload)}
                            className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-750 border border-gray-700 text-xs text-gray-300 hover:text-white transition-colors"
                          >
                            Verify
                          </button>
                        )}

                        <Link
                          href={`/verify/${c.hash}`}
                          target="_blank"
                          className="text-gray-400 hover:text-white p-1"
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
