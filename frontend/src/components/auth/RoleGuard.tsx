"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { RoleType } from "@/types";
import { ShieldAlert, Lock, ArrowRight, GraduationCap, Briefcase, ShieldCheck, LogIn } from "lucide-react";

interface RoleGuardProps {
  allowedRoles: RoleType[];
  portalName?: string;
  children: React.ReactNode;
}

export default function RoleGuard({
  allowedRoles,
  portalName = "Restricted Workspace",
  children,
}: RoleGuardProps) {
  const { isAuthenticated, currentUser } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Case 1: Unauthenticated
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-6 shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            Authentication Required
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight pt-2">
            Sign In to Access {portalName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Please log in with your verified credentials to enter this protected workspace.
          </p>
        </div>
        <div className="pt-2 flex justify-center">
          <Link
            href="/login"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-950/60 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Go to Sign In Gateway</span>
          </Link>
        </div>
      </div>
    );
  }

  // Case 2: Role Mismatch (e.g. Student trying to view Employer ATS)
  if (!allowedRoles.includes(currentUser.role)) {
    const isStudentTryingEmployer =
      currentUser.role === "student" && allowedRoles.includes("employer");
    const isStudentTryingAdmin =
      currentUser.role === "student" && allowedRoles.includes("admin");
    const isEmployerTryingStudent =
      currentUser.role === "employer" && allowedRoles.includes("student");

    return (
      <div className="max-w-3xl mx-auto my-16 p-8 sm:p-10 rounded-3xl bg-slate-950 border border-rose-500/30 text-center space-y-6 shadow-2xl shadow-rose-950/20 backdrop-blur-xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              <span>ROLE-BASED ACCESS CONTROL (RBAC) RESTRICTED</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {portalName} is Restricted
            </h1>

            <div className="max-w-lg mx-auto p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left text-xs space-y-1.5 mt-4">
              <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] pb-1 border-b border-slate-800">
                <span>Active Account Identity:</span>
                <span className="capitalize font-bold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-slate-300 font-semibold pt-1">
                {currentUser.name} <span className="text-slate-500 font-mono">({currentUser.email})</span>
              </p>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {isStudentTryingEmployer &&
                  "You are logged in with a Student Candidate profile. You do not have permission to view enterprise ATS candidate queues, review peer resumes, or dispatch recruitment sprints."}
                {isStudentTryingAdmin &&
                  "You are logged in with a Student Candidate profile. Root administrative governance and cryptographic key rotation are restricted to superusers."}
                {isEmployerTryingStudent &&
                  "You are logged in with an Employer / Recruiter profile. Private student assessments and individual credential vaults are restricted to candidate owners."}
                {!isStudentTryingEmployer &&
                  !isStudentTryingAdmin &&
                  !isEmployerTryingStudent &&
                  "Your current role permissions do not grant access to this workspace."}
              </p>
            </div>
          </div>

          {/* Recovery Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {currentUser.role === "student" ? (
              <Link
                href="/student"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/50 transition-all"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Return to Student Dashboard</span>
              </Link>
            ) : currentUser.role === "employer" ? (
              <Link
                href="/employer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-950/50 transition-all"
              >
                <Briefcase className="w-4 h-4" />
                <span>Return to Employer ATS</span>
              </Link>
            ) : (
              <Link
                href="/admin"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-950/50 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Return to Admin Console</span>
              </Link>
            )}

            <Link
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <span>Switch or Register Another Account</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Allowed
  return <>{children}</>;
}
