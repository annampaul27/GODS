"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  GraduationCap,
  Mail,
  Building,
  Calendar,
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Edit3,
  Save,
  ArrowLeft,
  Sparkles,
  Zap,
  Lock,
  LogOut,
  Briefcase,
} from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import RoleGuard from "@/components/auth/RoleGuard";

export default function StudentProfilePage() {
  const router = useRouter();
  const { currentStudent, updateStudentProfile, logout, addToast } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(currentStudent.fullName);
  const [email, setEmail] = useState(currentStudent.email);
  const [college, setCollege] = useState(currentStudent.college);
  const [gradYear, setGradYear] = useState(currentStudent.gradYear);
  const [targetRole, setTargetRole] = useState(currentStudent.targetRole);
  const [githubUrl, setGithubUrl] = useState(currentStudent.githubUrl || "https://github.com/aaravsharma-dev");
  const [linkedinUrl, setLinkedinUrl] = useState(currentStudent.linkedinUrl || "https://linkedin.com/in/aaravsharma");
  const [newSkillInput, setNewSkillInput] = useState("");

  const isJobReady = currentStudent.readinessScore >= 85;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile({
      fullName,
      email,
      college,
      gradYear: Number(gradYear),
      targetRole,
      githubUrl,
      linkedinUrl,
    });
    setIsEditing(false);
    addToast({
      type: "success",
      title: "Profile Updated",
      message: "Your student credentials and contact information have been saved.",
    });
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    const skillName = newSkillInput.trim();
    const updatedSkills = [
      ...currentStudent.skills,
      {
        skillId: skillName.toLowerCase().replace(/[^a-z0-9]/g, "_"),
        skillName,
        category: "core",
        level: "Intermediate" as const,
        isVerified: false,
      },
    ];
    updateStudentProfile({ skills: updatedSkills });
    setNewSkillInput("");
    addToast({
      type: "info",
      title: "Skill Added",
      message: `${skillName} added to your profile. Complete a verification sprint to mint your SHA-256 seal.`,
    });
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <RoleGuard allowedRoles={["student", "admin"]} portalName="Student Profile & Credential Vault">
      <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/student"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Return to Student Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <h1 className="text-xl font-bold text-white tracking-tight">Student Profile & Credentials</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Candidate ID: {currentStudent.anonymizedId}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage your academic credentials, verified skill portfolio, and recruiter visibility.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/student"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span>Dashboard</span>
            </Link>
            <Link
              href="/student/github-security"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-800/60 transition-colors flex items-center gap-1.5"
            >
              <GithubIcon className="w-3.5 h-3.5 text-purple-300" />
              <span>GitHub Shield</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/50 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Hero Candidate Profile Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/90 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentStudent.avatarUrl}
                alt={currentStudent.fullName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/30 shadow-lg shadow-emerald-950/40"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-bold text-white tracking-tight">{currentStudent.fullName}</h2>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      isJobReady
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    }`}
                  >
                    {isJobReady ? "🛡️ Job-Ready (Top Tier)" : "⚡ Bridgeable (Sprint Ready)"}
                  </span>
                </div>
                <p className="text-xs text-slate-300 flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentStudent.college}</span>
                  <span className="text-slate-600">·</span>
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Class of {currentStudent.gradYear}</span>
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-purple-300 font-medium">Target Role: {currentStudent.targetRole}</span>
                  <span className="text-slate-600">·</span>
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono text-slate-300">{currentStudent.email}</span>
                </p>
              </div>
            </div>

            {/* Readiness Gauge & Quick Stats */}
            <div className="flex items-center gap-4 self-start md:self-center bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <div className="text-center px-2">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Readiness Score</span>
                <span className={`text-2xl font-black ${isJobReady ? "text-emerald-400" : "text-amber-400"}`}>
                  {currentStudent.readinessScore}%
                </span>
                <span className="text-[10px] text-slate-500 block">Weighted Deficit</span>
              </div>
              <div className="w-px h-10 bg-slate-800" />
              <div className="text-center px-2">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Verified Skills</span>
                <span className="text-2xl font-black text-purple-300">
                  {currentStudent.skills.filter((s) => s.isVerified).length}
                </span>
                <span className="text-[10px] text-slate-500 block">SHA-256 Sealed</span>
              </div>
              <div className="w-px h-10 bg-slate-800" />
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? "Close" : "Edit Profile"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Edit Form Drawer / Card */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-slate-900 border border-purple-500/40 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-400" />
                <span>Edit Candidate Information</span>
              </h3>
              <span className="text-xs text-slate-400">Updates sync directly with ATS talent radar</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Graduation Year</label>
                <input
                  type="number"
                  value={gradYear}
                  onChange={(e) => setGradYear(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Target Engineering Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">GitHub Profile URL</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white flex items-center gap-1.5 shadow-md shadow-purple-950/50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Skills & Missing Competencies */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills & Cryptographic Verification */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>Technical Competencies ({currentStudent.skills.length})</span>
                </h3>
                <span className="text-[11px] text-slate-400">Green badges indicate tamper-proof SHA-256 seals</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentStudent.skills.map((skill) => (
                  <div
                    key={skill.skillId}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      skill.isVerified
                        ? "bg-emerald-950/20 border-emerald-500/30"
                        : "bg-slate-950 border-slate-800"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white">{skill.skillName}</span>
                        {skill.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 capitalize">
                        {skill.level} · {skill.category}
                      </span>
                    </div>

                    {skill.isVerified ? (
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-emerald-400 block font-bold">
                          Score: {skill.score || 90}%
                        </span>
                        {skill.credentialHash && (
                          <Link
                            href={`/verify/${skill.credentialHash}`}
                            className="text-[9px] font-mono text-purple-400 hover:underline flex items-center gap-0.5 justify-end"
                            title="Verify tamper-proof hash"
                          >
                            <span>{skill.credentialHash.slice(0, 8)}...</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        )}
                      </div>
                    ) : (
                      <Link
                        href="/student"
                        className="px-2 py-1 rounded-md text-[10px] font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 transition-colors"
                      >
                        Verify Skill
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Custom Skill Form */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                  placeholder="Add a new technical competency (e.g. Kubernetes, Redis, GraphQL)"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors"
                >
                  + Add Skill
                </button>
              </div>
            </div>

            {/* Missing Competencies / Gap Sprints */}
            {currentStudent.missingCompetencies.length > 0 && (
              <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Recommended Gap Closure Sprints
                  </h3>
                </div>
                <p className="text-xs text-slate-300">
                  Target role matching detects {currentStudent.missingCompetencies.length} missing competencies. Closing these raises your readiness score to 95%+.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {currentStudent.missingCompetencies.map((m) => (
                    <div
                      key={m}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center gap-2 text-xs"
                    >
                      <span className="text-amber-200 font-medium">{m}</span>
                      <Link
                        href="/student"
                        className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold transition-colors"
                      >
                        Start Sprint
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cryptographic Proof of Work Credentials */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Tamper-Proof Credential Ledger ({currentStudent.credentials.length})</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-500">SHA-256 Merkle Verification</span>
              </div>

              {currentStudent.credentials.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
                  <Lock className="w-6 h-6 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">
                    No credentials minted yet. Pass a verified assessment or complete a micro-sprint to issue your first cryptographic badge.
                  </p>
                  <Link
                    href="/student"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                  >
                    <span>Take Skill Assessment</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentStudent.credentials.map((cred) => (
                    <div
                      key={cred.hash}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{cred.skillName}</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                            {cred.score}% Pass
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          Issued: {new Date(cred.issuedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Link
                        href={`/verify/${cred.hash}`}
                        className="px-3 py-1 rounded-lg text-xs font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 transition-colors flex items-center gap-1 shrink-0"
                      >
                        <span>{cred.hash.slice(0, 10)}...</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Code Repositories & Quick Actions */}
          <div className="space-y-6">
            {/* GitHub Integration Widget */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/30 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GithubIcon className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    GitHub Code Defense
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Live Scanner
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Connected GitHub: <strong className="text-white font-mono">{currentStudent.githubUrl || "aaravsharma-dev"}</strong>
              </p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Secret Leak Shield:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">1-Click Auto-Remediation:</span>
                  <span className="text-purple-300 font-semibold">Ready (.gitignore & .env)</span>
                </div>
              </div>

              <Link
                href="/student/github-security"
                className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center gap-2 shadow-md shadow-purple-950/50 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Launch GitHub Health Shield</span>
              </Link>
            </div>

            {/* Quick Links & Learning Hub */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Student Navigation Hub</span>
              </h3>
              <div className="space-y-2">
                <Link
                  href="/student"
                  className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span>Skill Gap Radar & Roadmap</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </Link>

                <Link
                  href="/hub"
                  className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span>13-Course Micro-Academy</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </Link>

                <Link
                  href="/student"
                  className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span>Skill Gap Radar & Sandbox</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </RoleGuard>
  );
}
