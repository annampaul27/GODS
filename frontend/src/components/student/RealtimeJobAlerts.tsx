"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Briefcase,
  Building2,
  ArrowRight,
  X,
  ShieldCheck,
  CheckCircle2,
  BellRing
} from "lucide-react";
import { UserNotification } from "@/types";

interface RealtimeJobAlertsProps {
  userId?: string;
  onOpenJobDetails: (jobId: string) => void;
}

export default function RealtimeJobAlerts({
  userId = "cand-1",
  onOpenJobDetails
}: RealtimeJobAlertsProps) {
  const [activeToasts, setActiveToasts] = useState<UserNotification[]>([]);
  const [jobMatches, setJobMatches] = useState<UserNotification[]>([]);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const isInitialFetchRef = useRef<boolean>(true);

  const fetchJobMatchNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/notifications?user_id=${userId}`);
      if (!res.ok) return;
      const data = await res.json();
      const allNotifs: UserNotification[] = data.notifications || [];

      // Filter for job_match notifications
      const matches = allNotifs.filter((n) => n.notification_type === "job_match");
      setJobMatches(matches);

      if (isInitialFetchRef.current) {
        // On first page load, register existing IDs so we don't bombard user with past toasts,
        // but if there are unread ones, surface the latest unread one.
        matches.forEach((m) => seenIdsRef.current.add(m.id));
        const latestUnread = matches.find((m) => !m.is_read);
        if (latestUnread) {
          setActiveToasts([latestUnread]);
        }
        isInitialFetchRef.current = false;
      } else {
        // Detect newly arrived notifications
        const newlyArrived = matches.filter((m) => !seenIdsRef.current.has(m.id) && !m.is_read);
        if (newlyArrived.length > 0) {
          newlyArrived.forEach((m) => seenIdsRef.current.add(m.id));
          setActiveToasts((prev) => [...newlyArrived, ...prev].slice(0, 3));
        }
      }
    } catch (err) {
      // Background poll silently catches network hiccups
    }
  };

  useEffect(() => {
    fetchJobMatchNotifications();
    // High-responsiveness short-polling (every 2.5 seconds) for instant zero-reload trigger
    const timer = setInterval(fetchJobMatchNotifications, 2500);
    return () => clearInterval(timer);
  }, [userId]);

  const dismissToast = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleMarkAsRead = async (notifId: string) => {
    try {
      await fetch(`http://localhost:8000/api/v1/notifications/${notifId}/read`, {
        method: "PATCH",
      });
      setJobMatches((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, is_read: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* Real-Time Floating Actionable Toast Alerts (Upper Viewport) */}
      <div
        id="realtime-job-alerts-container"
        className="fixed top-20 right-4 sm:right-8 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none"
      >
        {activeToasts.map((toast) => (
          <div
            key={toast.id}
            id={`job-match-toast-${toast.id}`}
            className="pointer-events-auto relative overflow-hidden rounded-2xl border border-cyan-400/50 bg-[#070e1e]/95 backdrop-blur-xl shadow-2xl shadow-cyan-950/80 p-5 space-y-3 transition-all duration-300 animate-in slide-in-from-top-4 fade-in"
          >
            {/* Ambient Animated Glow Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-500 animate-pulse" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-slate-950 shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                      Real-Time Ingestion Match
                    </span>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <h4 className="text-xs font-bold text-white tracking-tight">
                    {toast.job_title}
                  </h4>
                </div>
              </div>

              <button
                onClick={(e) => dismissToast(toast.id, e)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification Call to Action Message */}
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {toast.message}
            </p>

            {/* Footer with Action Button */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified Skill Fit
              </span>

              <button
                id={`btn-view-job-${toast.job_id}`}
                onClick={() => {
                  dismissToast(toast.id);
                  handleMarkAsRead(toast.id);
                  onOpenJobDetails(toast.job_id);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all border border-cyan-400/40"
              >
                <span>View Job Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Embedded Real-Time Job Match Feed Banner on Student Dashboard */}
      {jobMatches.length > 0 && (
        <div id="realtime-job-matches-feed" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <BellRing className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
              </div>
              <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-emerald-400">
                Live Eligible Job Matches
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Matching Engine: Real-Time Stream Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {jobMatches.map((item) => (
              <div
                key={item.id}
                id={`feed-match-card-${item.id}`}
                className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 ${
                  !item.is_read
                    ? "bg-gradient-to-r from-cyan-950/40 via-[#071324] to-emerald-950/30 border-cyan-500/40 shadow-xl shadow-cyan-950/20"
                    : "bg-slate-950/60 border-slate-800/80 opacity-80 hover:opacity-100"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Eligible Match (≥80%)
                      </span>
                      {!item.is_read && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          NEW
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {item.trigger_date}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white tracking-tight">
                    {item.job_title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    {item.company || "Employer Partner"}
                  </span>

                  <button
                    id={`btn-open-match-${item.job_id}`}
                    onClick={() => {
                      if (!item.is_read) handleMarkAsRead(item.id);
                      onOpenJobDetails(item.job_id);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors"
                  >
                    <span>View Job Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
