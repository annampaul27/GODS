"use client";

import React, { useState, useEffect, useRef } from "react";
import { useStore, ToastNotification } from "@/lib/store";
import { CheckCircle2, AlertTriangle, Info, ShieldCheck, X } from "lucide-react";

interface ToastItemProps {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
  durationMs?: number;
}

function ToastCard({ toast, onDismiss, durationMs = 4000 }: ToastItemProps) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(durationMs);

  useEffect(() => {
    if (isPaused) return;

    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newRemaining = Math.max(0, remainingTimeRef.current - elapsed);
      const newProgress = Math.max(0, (newRemaining / durationMs) * 100);

      setProgress(newProgress);

      if (newRemaining <= 0) {
        clearInterval(interval);
        onDismiss(toast.id);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isPaused, durationMs, onDismiss, toast.id]);

  const handleMouseEnter = () => {
    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  let icon = <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />;
  let borderColor = "border-slate-800";
  let progressColor = "bg-blue-400";

  if (toast.type === "success") {
    icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
    borderColor = "border-emerald-500/30";
    progressColor = "bg-emerald-400";
  } else if (toast.type === "warning") {
    icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />;
    borderColor = "border-amber-500/30";
    progressColor = "bg-amber-400";
  } else if (toast.type === "credential") {
    icon = <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />;
    borderColor = "border-purple-500/30";
    progressColor = "bg-purple-400";
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`pointer-events-auto relative overflow-hidden flex flex-col p-3.5 rounded-xl bg-slate-900/95 backdrop-blur-xl border ${borderColor} shadow-2xl shadow-slate-950/80 transition-all duration-200 animate-in fade-in slide-in-from-bottom-3`}
    >
      <div className="flex items-start gap-2.5">
        {icon}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-semibold text-white leading-tight">{toast.title}</h4>
            <span className="text-[10px] text-slate-500 font-mono shrink-0">{toast.timestamp}</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed break-words">
            {toast.message}
          </p>
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
          title="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Auto-disappear Animated Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800/80 overflow-hidden">
        <div
          className={`h-full ${progressColor} transition-all duration-75 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          toast={toast}
          onDismiss={dismissToast}
          durationMs={4000}
        />
      ))}
    </div>
  );
}
