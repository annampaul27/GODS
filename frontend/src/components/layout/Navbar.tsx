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
  ChevronDown,
  Hash,
  LogIn,
  LogOut,
  CheckCircle,
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
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-[#0c1220]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <span className="font-semibold text-base text-white tracking-tight">
              SkillSetu
            </span>
          </Link>

          {/* Org Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-xs font-medium text-gray-300 transition-colors"
            >
              <span className="text-sm leading-none">{currentOrg.logo}</span>
              <span className="max-w-[140px] truncate">{currentOrg.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {orgDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-64 rounded-lg bg-gray-900 border border-gray-800 p-1.5 shadow-xl z-50">
                <div className="px-2.5 py-2 border-b border-gray-800 mb-1">
                  <p className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
                    Workspaces
                  </p>
                </div>
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => {
                      setCurrentOrg(org);
                      setOrgDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-md text-left text-xs transition-colors ${
                      currentOrg.id === org.id
                        ? "bg-blue-500/10 text-blue-400"
                        : "hover:bg-gray-800 text-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base">{org.logo}</span>
                      <div className="truncate">
                        <p className="font-medium truncate">{org.name}</p>
                        <p className="text-[10px] text-gray-500 capitalize">
                          {org.type} · {org.plan} ({org.seatsUsed}/{org.seatsTotal})
                        </p>
                      </div>
                    </div>
                    {currentOrg.id === org.id && (
                      <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2.5">
          {/* Role Tabs */}
          <nav className="flex items-center bg-gray-900 p-0.5 rounded-lg border border-gray-800">
            <button
              onClick={() => handleRoleChange("employer")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                pathname === "/employer" || (pathname === "/" && role === "employer")
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Employer</span>
            </button>
            <button
              onClick={() => handleRoleChange("student")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                pathname === "/student" || (pathname === "/" && role === "student")
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>
            <button
              onClick={() => handleRoleChange("admin")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                pathname === "/admin" || (pathname === "/" && role === "admin")
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Blind Screening Toggle — employer only */}
          {(pathname === "/employer" || role === "employer") && (
            <button
              onClick={() => setIsAnonymizedScreening(!isAnonymizedScreening)}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isAnonymizedScreening
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  : "bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-200"
              }`}
              title="Toggle blind screening mode"
            >
              {isAnonymizedScreening ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Blind: On</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Blind: Off</span>
                </>
              )}
            </button>
          )}

          {/* Verify Link */}
          <Link
            href={`/verify/${sampleHash}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-xs font-medium text-gray-400 hover:text-gray-200 transition-colors"
            title="Verify a credential"
          >
            <Hash className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Verify</span>
          </Link>

          {/* Notifications */}
          <NotificationCenter userId="cand-1" />

          {/* Auth */}
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-1.5 pl-2 border-l border-gray-800">
              <Link
                href="/login"
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-800 text-xs text-gray-300 transition-colors"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-md object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-md bg-gray-800 flex items-center justify-center text-[10px] font-medium text-gray-300">
                    {currentUser.name[0]}
                  </div>
                )}
                <span className="hidden xl:inline text-[11px] font-medium">
                  {currentUser.name.split(" ")[0]}
                </span>
              </Link>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-red-400 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
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
