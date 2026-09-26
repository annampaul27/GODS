"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Building2,
  ArrowRight,
  X,
  ShieldCheck,
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

  const fetchJobMatchNotifications = React.useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/notifications?user_id=${userId}`);
      if (!res.ok) return;
      const data = await res.json();
      const allNotifs: UserNotification[] = data.notifications || [];

      // Filter for job_match notifications
      const matches = allNotifs.filter((n) => n.notification_type === "job_match");
      setJobMatches(matches);

      if (isInitialFetchRef.current) {
        matches.forEach((m) => seenIdsRef.current.add(m.id));
        const latestUnread = matches.find((m) => !m.is_read);
        if (latestUnread) {
          setActiveToasts([latestUnread]);
        }
        isInitialFetchRef.current = false;
      } else {
        const newlyArrived = matches.filter((m) => !seenIdsRef.current.has(m.id) && !m.is_read);
        if (newlyArrived.length > 0) {
          newlyArrived.forEach((m) => seenIdsRef.current.add(m.id));
          setActiveToasts((prev) => [...newlyArrived, ...prev].slice(0, 3));

          // Auto-disappear after 5 seconds
          newlyArrived.forEach((toast) => {
            setTimeout(() => {
              setActiveToasts((prev) => prev.filter((t) => t.id !== toast.id));
            }, 5000);
          });
        }
      }
    } catch {
      // background fetch silent catch
    }
  }, [userId]);

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      if (!isCancelled) {
        await fetchJobMatchNotifications();
      }
    })();
    const timer = setInterval(fetchJobMatchNotifications, 5000);
    return () => {
      isCancelled = true;
      clearInterval(timer);
    };
  }, [fetchJobMatchNotifications]);

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
            className="pointer-events-auto relative overflow-hidden rounded-xl border border-gray-700 bg-gray-900 shadow-xl p-4 space-y-3 transition-all duration-200 animate-in slide-in-from-top-4 fade-in"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                      New Eligible Match
                    </span>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <h4 className="text-xs font-semibold text-white">
                    {toast.job_title}
                  </h4>
                </div>
              </div>

              <button
                onClick={(e) => dismissToast(toast.id, e)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification Call to Action Message */}
            <p className="text-xs text-gray-300 leading-relaxed">
              {toast.message}
            </p>

            {/* Footer with Action Button */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Match
              </span>

              <button
                id={`btn-view-job-${toast.job_id}`}
                onClick={() => {
                  dismissToast(toast.id);
                  handleMarkAsRead(toast.id);
                  onOpenJobDetails(toast.job_id);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                <span>View Details</span>
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
              <div className="w-6 h-6 rounded bg-emerald-950 border border-emerald-800 flex items-center justify-center">
                <BellRing className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Eligible Job Matches
              </h3>
            </div>
            <span className="text-xs text-gray-500">
              Live matching active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {jobMatches.map((item) => (
              <div
                key={item.id}
                id={`feed-match-card-${item.id}`}
                className={`p-4 rounded-xl border transition-colors flex flex-col justify-between space-y-3 ${
                  !item.is_read
                    ? "bg-gray-900 border-gray-700 shadow-sm"
                    : "bg-gray-900/60 border-gray-800 opacity-80 hover:opacity-100"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Eligible Match (≥80%)
                      </span>
                      {!item.is_read && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-950 text-blue-300 border border-blue-800">
                          NEW
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {item.trigger_date}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white">
                    {item.job_title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-800 text-xs">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    {item.company || "Employer Partner"}
                  </span>

                  <button
                    id={`btn-open-match-${item.job_id}`}
                    onClick={() => {
                      if (!item.is_read) handleMarkAsRead(item.id);
                      onOpenJobDetails(item.job_id);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                  >
                    <span>View Details</span>
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
