"use client";

import React from "react";
import { useStore } from "@/lib/store";
import { CheckCircle2, AlertTriangle, Info, ShieldCheck, X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />;
        let borderColor = "border-sky-500/30";
        let glowColor = "shadow-sky-950/40";

        if (toast.type === "success") {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />;
          borderColor = "border-emerald-500/30";
        } else if (toast.type === "warning") {
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />;
          borderColor = "border-amber-500/40";
        } else if (toast.type === "credential") {
          icon = <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />;
          borderColor = "border-cyan-500/50";
          glowColor = "shadow-cyan-950/60";
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl glass-panel-elevated ${borderColor} shadow-xl ${glowColor} transition-all duration-300 animate-in fade-in slide-in-from-bottom-5`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-slate-100">{toast.title}</h4>
                <span className="text-[10px] text-slate-400 font-mono">{toast.timestamp}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed break-words">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1 -mr-1 -mt-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
