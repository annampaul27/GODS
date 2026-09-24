"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  Briefcase,
  GraduationCap,
  Shield,
  Eye,
  EyeOff,
  Building2,
  ChevronDown,
  Sparkles,
  Search,
  CheckCircle,
  Hash,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { RoleType } from "@/types";
import NotificationCenter from "./NotificationCenter";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    role,
    setRole,
    currentOrg,
    setCurrentOrg,
    organizations,
    isAnonymizedScreening,
    setIsAnonymizedScreening,
    credentials,
    isAuthenticated,
    currentUser,
    logout,
  } = useStore();

  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

  const sampleHash =
    credentials[0]?.hash ||
    "a4f89d3810c92bf2234e405e6081297e68cfb939e6a0d0a52479e0237d45f3ba";

  const handleRoleChange = (newRole: RoleType) => {
    setRole(newRole);
    if (newRole === "employer") router.push("/employer");
    else if (newRole === "student") router.push("/student");
    else if (newRole === "admin") router.push("/admin");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070b16]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 p-[1px] transition-transform duration-300 group-hover:scale-105 shadow-md shadow-cyan-500/20">
              <div className="w-full h-full bg-[#080d1a] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300 font-sans">
                  SkillSetu<span className="text-cyan-400">.AI</span>
                </span>
                <span className="text-[10px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
                Proof-of-Work Credential Trust Chain & Talent Radar
              </p>
            </div>
          </Link>

          {/* Org Selector (Multi-Tenant E11, E13) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-xs font-medium text-slate-300 transition-colors"
            >
              <span className="text-base leading-none">{currentOrg.logo}</span>
              <span className="max-w-[150px] truncate">{currentOrg.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                {currentOrg.type}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {orgDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 rounded-xl glass-panel-elevated p-2 shadow-2xl z-50 animate-in fade-in">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="text-[11px] uppercase tracking-wider font-mono text-slate-400 font-semibold">
                    Multi-Tenant Workspace
                  </p>
                </div>
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => {
                      setCurrentOrg(org);
                      setOrgDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition-colors ${
                      currentOrg.id === org.id
                        ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                        : "hover:bg-slate-800/60 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-lg">{org.logo}</span>
                      <div className="truncate">
                        <p className="font-semibold truncate">{org.name}</p>
                        <p className="text-[10px] text-slate-400 capitalize">
                          {org.type} • {org.plan} ({org.seatsUsed}/{org.seatsTotal} seats)
                        </p>
                      </div>
                    </div>
                    {currentOrg.id === org.id && (
                      <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation & Role Selectors */}
        <div className="flex items-center gap-3">
          {/* Role Pills */}
          <nav className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => handleRoleChange("employer")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                pathname === "/employer" || (pathname === "/" && role === "employer")
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Employer</span>
            </button>
            <button
              onClick={() => handleRoleChange("student")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                pathname === "/student" || (pathname === "/" && role === "student")
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>
            <button
              onClick={() => handleRoleChange("admin")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                pathname === "/admin" || (pathname === "/" && role === "admin")
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/10"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Anonymized Screening Toggle (E17) - visible in Employer view */}
          {(pathname === "/employer" || role === "employer") && (
            <button
              onClick={() => setIsAnonymizedScreening(!isAnonymizedScreening)}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                isAnonymizedScreening
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/10"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
              title="Anonymized screening mode hides candidate name, photo, and college until shortlisting"
            >
              {isAnonymizedScreening ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>Blind Screening: ON</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Blind Screening: OFF</span>
                </>
              )}
            </button>
          )}

          {/* Public Verification Link */}
          <Link
            href={`/verify/${sampleHash}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            title="Zero-auth public cryptographic ledger verification"
          >
            <Hash className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Verify Credential</span>
          </Link>

          {/* FR-04: Deadlines & Strategic Application Notification Center */}
          <NotificationCenter userId="cand-1" />

          {/* User Authentication Status / Sign In Button */}
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
              <Link
                href="/login"
                className="flex items-center gap-2 p-1 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-all group"
                title="Switch Account / Terminal Session"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-[10px] font-mono text-cyan-400 font-bold">
                    {currentUser.name[0]}
                  </div>
                )}
                <span className="hidden xl:inline text-[11px] font-medium pr-1 group-hover:text-cyan-300">
                  {currentUser.name.split(" ")[0]}
                </span>
              </Link>
              <button
                onClick={logout}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                title="Terminate Session (Sign Out)"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-semibold text-xs shadow-sm shadow-cyan-500/10 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
