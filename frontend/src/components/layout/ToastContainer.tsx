"use client";

import React from "react";
import { useStore } from "@/lib/store";
import { CheckCircle2, AlertTriangle, Info, ShieldCheck, X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />;
        let borderColor = "border-gray-700";

        if (toast.type === "success") {
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
          borderColor = "border-emerald-500/20";
        } else if (toast.type === "warning") {
          icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />;
          borderColor = "border-amber-500/20";
        } else if (toast.type === "credential") {
          icon = <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />;
          borderColor = "border-blue-500/20";
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3.5 rounded-lg bg-gray-900 border ${borderColor} shadow-lg transition-all duration-200`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-medium text-white">{toast.title}</h4>
                <span className="text-[10px] text-gray-500">{toast.timestamp}</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5 break-words">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-gray-500 hover:text-gray-300 transition-colors p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
