"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { RoleType } from "@/types";
import {
  Briefcase,
  GraduationCap,
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Building2,
  KeyRound,
  Code2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { role, setRole, organizations, currentOrg, setCurrentOrg, login, addToast } = useStore();

  const [selectedRole, setSelectedRole] = useState<RoleType>(role || "employer");
  const [selectedOrgId, setSelectedOrgId] = useState<string>(currentOrg?.id || organizations[0].id);
  const [email, setEmail] = useState<string>("priya.sharma@acme.com");
  const [password, setPassword] = useState<string>("••••••••••••");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>("");

  const handleRoleTabChange = (newRole: RoleType) => {
    setSelectedRole(newRole);
    if (newRole === "employer") {
      setEmail("priya.sharma@acme.com");
      setPassword("••••••••••••");
    } else if (newRole === "student") {
      setEmail("aditya.verma@example.com");
      setPassword("••••••••••••");
    } else if (newRole === "admin") {
      setEmail("root@skillsetu.ai");
      setPassword("••••••••••••");
    }
  };

  const handleQuickLogin = (demoRole: RoleType, demoEmail: string, orgId?: string) => {
    setSelectedRole(demoRole);
    setEmail(demoEmail);
    if (orgId) setSelectedOrgId(orgId);
    triggerLogin(demoRole, demoEmail, orgId);
  };

  const [backendOnline, setBackendOnline] = useState<boolean>(true);

  React.useEffect(() => {
    fetch("http://localhost:8000/health")
      .then((res) => {
        if (res.ok) setBackendOnline(true);
      })
      .catch(() => setBackendOnline(false));
  }, []);

  const triggerLogin = async (r: RoleType, em: string, orgId?: string) => {
    setIsLoading(true);
    const targetOrg = orgId || selectedOrgId;

    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: em,
          password: password === "••••••••••••" ? "SkillSetu@2026" : password,
          role: r,
          org_id: r === "employer" ? targetOrg : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (typeof window !== "undefined") {
          localStorage.setItem("skillsetu_jwt_token", data.access_token);
        }
        addToast({
          type: "credential",
          title: "Signed in successfully",
          message: `Session token issued.`,
        });
      }
    } catch (err) {
      console.warn("Backend offline, using offline mode:", err);
    } finally {
      login(r, em, targetOrg);
      setIsLoading(false);
      if (r === "employer") router.push("/employer");
      else if (r === "student") router.push("/student");
      else if (r === "admin") router.push("/admin");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerLogin(selectedRole, email, selectedOrgId);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForgotModal(false);
    addToast({
      type: "info",
      title: "Password Reset Sent",
      message: `A reset link has been sent to ${forgotEmail || email}.`,
    });
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md rounded-xl bg-gray-900 border border-gray-800 p-6 sm:p-8 space-y-5">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white font-bold text-sm mb-2">
            S
          </div>
          <h1 className="text-xl font-semibold text-white">
            Sign in to SkillSetu
          </h1>
          <p className="text-xs text-gray-400">
            Select your role and enter your credentials.
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-[10px]">
              <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? "bg-emerald-400" : "bg-amber-400"}`} />
              <span className={backendOnline ? "text-emerald-400" : "text-amber-400"}>
                {backendOnline ? "Backend online" : "Offline mode"}
              </span>
            </span>
          </div>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-gray-800 border border-gray-700">
          <button
            type="button"
            onClick={() => handleRoleTabChange("employer")}
            className={`flex flex-col items-center py-2 px-2 rounded-md text-xs font-medium transition-colors ${
              selectedRole === "employer"
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Briefcase className="w-4 h-4 mb-1" />
            <span>Employer</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange("student")}
            className={`flex flex-col items-center py-2 px-2 rounded-md text-xs font-medium transition-colors ${
              selectedRole === "student"
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <GraduationCap className="w-4 h-4 mb-1" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange("admin")}
            className={`flex flex-col items-center py-2 px-2 rounded-md text-xs font-medium transition-colors ${
              selectedRole === "admin"
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Shield className="w-4 h-4 mb-1" />
            <span>Admin</span>
          </button>
        </div>

        {/* Demo Accounts */}
        <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 space-y-1.5">
          <p className="text-[11px] text-gray-500 font-medium">Quick demo login</p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin("employer", "priya.sharma@acme.com", "org-acme")}
              className="p-2 rounded-md bg-gray-900 hover:bg-gray-800 border border-gray-800 text-left text-[11px] transition-colors"
            >
              <span className="font-medium text-gray-200 block truncate">Recruiter</span>
              <span className="text-[10px] text-gray-500">Acme Corp</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("student", "aditya.verma@example.com")}
              className="p-2 rounded-md bg-gray-900 hover:bg-gray-800 border border-gray-800 text-left text-[11px] transition-colors"
            >
              <span className="font-medium text-gray-200 block truncate">Student</span>
              <span className="text-[10px] text-gray-500">78% ready</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("admin", "root@skillsetu.ai")}
              className="p-2 rounded-md bg-gray-900 hover:bg-gray-800 border border-gray-800 text-left text-[11px] transition-colors"
            >
              <span className="font-medium text-gray-200 block truncate">Admin</span>
              <span className="text-[10px] text-gray-500">Full access</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {selectedRole === "employer" && (
            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-gray-500" />
                Organization
              </label>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.logo} {org.name} ({org.type} · {org.plan})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-500" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="user@example.com"
              className="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gray-500" />
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2.5 pr-10 rounded-lg bg-gray-800 border border-gray-700 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-0"
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>
                  Sign in as{" "}
                  {selectedRole === "employer"
                    ? "Employer"
                    : selectedRole === "student"
                    ? "Student"
                    : "Admin"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* SSO */}
        <div className="pt-3 border-t border-gray-800 space-y-2.5">
          <p className="text-[11px] text-center text-gray-500">
            Or sign in with
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("employer", "saml.recruiter@enterprise.com", "org-acme")}
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs text-gray-300 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>SAML / Okta</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("student", "github.engineer@skillsetu.ai")}
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs text-gray-300 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-gray-900 border border-gray-800 p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-800">
              <h3 className="text-sm font-medium text-white">Reset Password</h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Enter your email to receive a password reset link.
            </p>
            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <input
                type="email"
                required
                placeholder="name@organization.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
