"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { Network } from "lucide-react";

export default function SkillTaxonomyTable() {
  const { taxonomy, addToast } = useStore();
  const [newSynonym, setNewSynonym] = useState<Record<string, string>>({});

  const handleAddSynonym = (canonicalId: string) => {
    const val = newSynonym[canonicalId]?.trim();
    if (!val) return;

    addToast({
      type: "success",
      title: "Taxonomy Synonyms Updated",
      message: `Mapped "${val}" to canonical skill "${canonicalId}".`,
    });

    setNewSynonym((prev) => ({ ...prev, [canonicalId]: "" }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-800/80 flex items-center justify-center text-blue-400">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white">
                Skill Taxonomy & Synonym Mapping
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700 font-medium">
                Normalization Engine
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Normalizes resume & job description terms into standardized skill nodes.
            </p>
          </div>
        </div>
      </div>

      {/* Taxonomy Table */}
      <div className="rounded-xl bg-gray-900 border border-gray-800 p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-medium">Canonical ID</th>
                <th className="pb-3 font-medium">Skill Name</th>
                <th className="pb-3 font-medium">Default Weight</th>
                <th className="pb-3 font-medium">Synonyms & Aliases</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-sans">
              {taxonomy.map((node) => (
                <tr key={node.canonicalId} className="hover:bg-gray-850/50 transition-colors">
                  <td className="py-3.5 font-mono text-gray-300 font-medium">
                    {node.canonicalId}
                  </td>
                  <td className="py-3.5 font-medium text-gray-200">
                    <div>
                      <p>{node.canonicalName}</p>
                      <span className="text-[11px] text-gray-500 capitalize">
                        {node.category}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 font-mono text-emerald-400 font-semibold">
                    {node.defaultWeight.toFixed(1)}
                  </td>
                  <td className="py-3.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {node.synonyms.map((syn, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded bg-gray-950 text-gray-300 border border-gray-800 text-xs"
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
                          className="w-28 px-2 py-1 rounded bg-gray-950 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
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
