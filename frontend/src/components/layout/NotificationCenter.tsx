"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  CheckCheck,
  Clock,
  Calendar,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Bookmark,
} from "lucide-react";
import { UserNotification } from "@/types";

interface NotificationCenterProps {
  userId?: string;
}

export default function NotificationCenter({ userId = "cand-1" }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTriggering, setIsTriggering] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/notifications?user_id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      }
    } catch (err) {
      console.warn("Could not fetch notifications from backend:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Polling every 15s
    return () => clearInterval(interval);
  }, [userId]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (notificationId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      const res = await fetch(`http://localhost:8000/api/v1/notifications/${notificationId}/read`, {
        method: "PATCH",
      });
      if (!res.ok) {
        // Rollback on failure
        fetchNotifications();
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })));
    setUnreadCount(0);

    try {
      await fetch("http://localhost:8000/api/v1/notifications/mark-all-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      fetchNotifications();
    }
  };

  const triggerCronWorker = async () => {
    setIsTriggering(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/notifications/trigger-cron", {
        method: "POST",
      });
      if (res.ok) {
        await fetchNotifications();
      }
    } catch (err) {
      console.error("Failed to trigger worker:", err);
    } finally {
      setIsTriggering(false);
    }
  };

  const displayedNotifications = notifications.filter((notif) =>
    activeTab === "unread" ? !notif.is_read : true
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Trigger Button */}
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all duration-200 border ${
          isOpen
            ? "bg-slate-800 text-cyan-400 border-cyan-500/50 shadow-lg shadow-cyan-500/10"
            : unreadCount > 0
            ? "bg-slate-900/90 text-slate-200 border-slate-700/80 hover:border-cyan-500/40 hover:text-cyan-300"
            : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
        }`}
        title="Deadlines & Strategic Application Notifications"
        aria-label="Application Deadlines & Notifications"
      >
        <Bell className="w-4 h-4" />

        {/* Pulsing Unread Badge Counter */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center px-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"></span>
            <span className="relative inline-flex rounded-full h-4 min-w-4 px-1 text-[10px] font-bold font-mono bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 items-center justify-center shadow-md">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Glassmorphic Dropdown Popover */}
      {isOpen && (
        <div
          id="notification-dropdown-panel"
          className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-700/80 bg-[#080d1a]/95 backdrop-blur-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Bell className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white tracking-tight">
                    Strategic Alerts
                  </h3>
                </div>
                <p className="text-[10px] text-slate-400">
                  {unreadCount === 0 ? "All caught up" : `${unreadCount} action required`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Trigger Worker On-demand */}
              <button
                onClick={triggerCronWorker}
                disabled={isTriggering}
                title="Run 3-Week Deadline Check Worker"
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTriggering ? "animate-spin text-cyan-400" : ""}`} />
              </button>

              {/* Mark All Read */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded-lg hover:bg-cyan-950/40 transition-colors"
                  title="Mark all notifications as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 px-3 pt-2 pb-1 border-b border-slate-800/60 text-xs">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all ${
                activeTab === "all"
                  ? "bg-slate-800 text-cyan-300 border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab("unread")}
              className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all flex items-center gap-1.5 ${
                activeTab === "unread"
                  ? "bg-slate-800 text-cyan-300 border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/50">
            {isLoading && notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
                <span>Synchronizing application alerts...</span>
              </div>
            ) : displayedNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400/80" />
                </div>
                <p className="font-semibold text-slate-300">No Notifications</p>
                <p className="text-[11px] text-slate-500 max-w-[200px]">
                  {activeTab === "unread"
                    ? "You've read all your deadline alerts."
                    : "No application deadline warnings at this time."}
                </p>
              </div>
            ) : (
              displayedNotifications.map((notif) => {
                const isDeadline = notif.notification_type === "deadline_warning";
                return (
                  <div
                    key={notif.id}
                    id={`notification-item-${notif.id}`}
                    onClick={() => {
                      if (!notif.is_read) {
                        markAsRead(notif.id);
                      }
                    }}
                    className={`p-3.5 transition-all cursor-pointer relative group ${
                      !notif.is_read
                        ? "bg-cyan-950/20 hover:bg-cyan-950/30 border-l-2 border-l-cyan-400"
                        : "hover:bg-slate-900/50 opacity-75 hover:opacity-100 border-l-2 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border mt-0.5 ${
                          !notif.is_read
                            ? notif.notification_type === "job_match"
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : isDeadline
                              ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                              : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                            : "bg-slate-800 border-slate-700 text-slate-400"
                        }`}
                      >
                        {notif.notification_type === "job_match" ? (
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                        ) : isDeadline ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : (
                          <Calendar className="w-4 h-4" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span
                            className={`text-[10px] font-mono font-semibold uppercase px-1.5 py-0.2 rounded border ${
                              !notif.is_read
                                ? notif.notification_type === "job_match"
                                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-800/60"
                                  : isDeadline
                                  ? "bg-rose-950/80 text-rose-300 border-rose-800/60"
                                  : "bg-cyan-950/80 text-cyan-300 border-cyan-800/60"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            {notif.notification_type === "job_match"
                              ? "⚡ Eligible Job Match"
                              : isDeadline
                              ? "3-Week Deadline Warning"
                              : "3-Week Window Opening"}
                          </span>

                          <span className="text-[10px] font-mono text-slate-500">
                            {notif.trigger_date}
                          </span>
                        </div>

                        {/* Title & Message */}
                        <p className={`text-xs leading-relaxed ${!notif.is_read ? "font-medium text-slate-200" : "text-slate-400"}`}>
                          {notif.message}
                        </p>

                        {/* Metadata Footer */}
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/40 text-[10px] text-slate-400">
                          <div className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            <span>Target: {notif.application_deadline ? notif.application_deadline.split(" ")[0] : notif.trigger_date}</span>
                          </div>

                          {!notif.is_read ? (
                            <button
                              onClick={(e) => markAsRead(notif.id, e)}
                              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-0.5 hover:underline"
                            >
                              <span>Mark read</span>
                            </button>
                          ) : (
                            <span className="text-slate-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-slate-500" /> Read
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1 font-mono text-slate-400">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Automated 21-Day Advance Warning Engine
            </span>
            <span className="font-mono text-cyan-400/80">Worker: Daily 00:00</span>
          </div>
        </div>
      )}
    </div>
  );
}
