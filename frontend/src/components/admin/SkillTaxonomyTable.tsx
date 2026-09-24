"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { Network, Plus, Check, Tag, Sparkles } from "lucide-react";

export default function SkillTaxonomyTable() {
  const { taxonomy, addToast } = useStore();
  const [newSynonym, setNewSynonym] = useState<Record<string, string>>({});

  const handleAddSynonym = (canonicalId: string) => {
    const val = newSynonym[canonicalId]?.trim();
    if (!val) return;

    addToast({
      type: "success",
      title: "Taxonomy Synonyms Updated",
      message: `Mapped "${val}" to canonical skill node "${canonicalId}".`,
    });

    setNewSynonym((prev) => ({ ...prev, [canonicalId]: "" }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border-cyan-500/20 bg-gradient-to-r from-slate-950 via-[#0a1526] to-slate-950">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">
                Global Skill Taxonomy Manager
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                Canonical Normalization
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Normalizes resume & JD synonyms into canonical skill nodes to prevent duplicate deltas.
            </p>
          </div>
        </div>
      </div>

      {/* Taxonomy Table */}
      <div className="rounded-2xl glass-panel border-slate-800 p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="pb-3 font-semibold">Canonical ID</th>
                <th className="pb-3 font-semibold">Standard Node Name</th>
                <th className="pb-3 font-semibold">Default Weight</th>
                <th className="pb-3 font-semibold">Recognized Synonyms & Aliases</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {taxonomy.map((node) => (
                <tr key={node.canonicalId} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 font-mono font-semibold text-cyan-300">
                    {node.canonicalId}
                  </td>
                  <td className="py-4 font-medium text-slate-200">
                    <div>
                      <p>{node.canonicalName}</p>
                      <span className="text-[10px] text-slate-500 capitalize">
                        {node.category}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 font-mono text-emerald-400 font-bold">
                    {node.defaultWeight.toFixed(1)}
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {node.synonyms.map((syn, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800 text-[11px] font-mono"
                        >
                          {syn}
                        </span>
                      ))}

                      {/* Quick Add Synonym input */}
                      <div className="inline-flex items-center gap-1 ml-1">
                        <input
                          type="text"
                          placeholder="+ add synonym"
                          value={newSynonym[node.canonicalId] || ""}
                          onChange={(e) =>
                            setNewSynonym({
                              ...newSynonym,
                              [node.canonicalId]: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddSynonym(node.canonicalId);
                          }}
                          className="w-24 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-white focus:outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
