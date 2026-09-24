"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  RoleType,
  Organization,
  JobOpening,
  Candidate,
  ProofOfWorkCredential,
  AnomalyLog,
  ReadinessTier,
} from "@/types";
import {
  INITIAL_ORGS,
  INITIAL_JOBS,
  INITIAL_CANDIDATES,
  INITIAL_CREDENTIALS,
  INITIAL_TAXONOMY,
  INITIAL_ANOMALIES,
} from "./mockData";
import { computeSHA256, canonicalizeJSON } from "./crypto";

interface ToastNotification {
  id: string;
  type: "success" | "warning" | "info" | "credential";
  title: string;
  message: string;
  timestamp: string;
}

interface StoreContextType {
  role: RoleType;
  setRole: (role: RoleType) => void;
  currentOrg: Organization;
  setCurrentOrg: (org: Organization) => void;
  organizations: Organization[];
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>;
  
  jobs: JobOpening[];
  activeJobId: string;
  setActiveJobId: (id: string) => void;
  activeJob: JobOpening | undefined;
  addNewJob: (job: Omit<JobOpening, "id" | "createdAt" | "applicantsCount">) => void;

  candidates: Candidate[];
  isAnonymizedScreening: boolean;
  setIsAnonymizedScreening: (val: boolean) => void;
  dispatchGapSprint: (candidateId: string, skillId: string, skillName: string) => void;
  updateCandidatePipelineStatus: (
    candidateId: string,
    newStatus: Candidate["pipelineStatus"],
    actorName: string
  ) => void;

  credentials: ProofOfWorkCredential[];
  mintCredential: (
    credData: Omit<ProofOfWorkCredential, "hash" | "canonicalPayload" | "issuedAt">
  ) => Promise<ProofOfWorkCredential>;
  getCredentialByHash: (hash: string) => ProofOfWorkCredential | undefined;

  // Student specific
  currentStudent: Candidate;
  updateStudentProfile: (updates: Partial<Candidate>) => void;
  studentPrivacyHideAttempts: boolean;
  setStudentPrivacyHideAttempts: (val: boolean) => void;

  // Admin & Oversight
  taxonomy: typeof INITIAL_TAXONOMY;
  anomalies: AnomalyLog[];
  resolveAnomaly: (id: string) => void;
  logAnomaly: (anomaly: Omit<AnomalyLog, "id" | "timestamp" | "resolved">) => void;

  // Notifications
  toasts: ToastNotification[];
  dismissToast: (id: string) => void;
  addToast: (toast: Omit<ToastNotification, "id" | "timestamp">) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<RoleType>("employer");
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGS);
  const [currentOrg, setCurrentOrg] = useState<Organization>(INITIAL_ORGS[0]);
  const [jobs, setJobs] = useState<JobOpening[]>(INITIAL_JOBS);
  const [activeJobId, setActiveJobId] = useState<string>(INITIAL_JOBS[0].id);
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [credentials, setCredentials] = useState<ProofOfWorkCredential[]>(INITIAL_CREDENTIALS);
  const [isAnonymizedScreening, setIsAnonymizedScreening] = useState<boolean>(false);
  const [studentPrivacyHideAttempts, setStudentPrivacyHideAttempts] = useState<boolean>(true);
  const [taxonomy] = useState(INITIAL_TAXONOMY);
  const [anomalies, setAnomalies] = useState<AnomalyLog[]>(INITIAL_ANOMALIES);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // The logged-in student persona defaults to cand-1 ("Aditya Verma", Bridgeable at 78%)
  const [currentStudentId, setCurrentStudentId] = useState<string>("cand-1");

  const activeJob = jobs.find((j) => j.id === activeJobId) || jobs[0];
  const currentStudent = candidates.find((c) => c.id === currentStudentId) || candidates[0];

  const addToast = (toast: Omit<ToastNotification, "id" | "timestamp">) => {
    const newToast: ToastNotification = {
      ...toast,
      id: "toast-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toLocaleTimeString(),
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addNewJob = (jobData: Omit<JobOpening, "id" | "createdAt" | "applicantsCount">) => {
    const newJob: JobOpening = {
      ...jobData,
      id: "job-" + Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
      applicantsCount: 0,
    };
    setJobs((prev) => [newJob, ...prev]);
    setActiveJobId(newJob.id);
    addToast({
      type: "success",
      title: "Job Ingested Successfully",
      message: `"${newJob.title}" parsed with ${newJob.criticalSkills.length} critical skills and ${newJob.optionalSkills.length} optional skills.`,
    });
  };

  const dispatchGapSprint = (candidateId: string, skillId: string, skillName: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c;
        return {
          ...c,
          sprintAssigned: {
            skillId,
            skillName,
            dispatchedAt: new Date().toLocaleString(),
            status: "pending",
          },
        };
      })
    );

    const cand = candidates.find((c) => c.id === candidateId);
    addToast({
      type: "info",
      title: "1-Click Gap Sprint Dispatched",
      message: `Sent targeted challenge invitation for "${skillName}" to ${
        isAnonymizedScreening ? cand?.anonymizedId : cand?.fullName
      }.`,
    });
  };

  const updateCandidatePipelineStatus = (
    candidateId: string,
    newStatus: Candidate["pipelineStatus"],
    actorName: string
  ) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c;
        const newHistory = [
          ...c.statusHistory,
          {
            status: newStatus,
            timestamp: new Date().toLocaleString([], { dateStyle: "short", timeStyle: "short" }),
            updatedBy: actorName,
          },
        ];
        return {
          ...c,
          pipelineStatus: newStatus,
          statusHistory: newHistory,
        };
      })
    );

    const cand = candidates.find((c) => c.id === candidateId);
    addToast({
      type: "success",
      title: "Pipeline Status Updated",
      message: `${isAnonymizedScreening ? cand?.anonymizedId : cand?.fullName} moved to "${newStatus.toUpperCase()}".`,
    });
  };

  const updateStudentProfile = (updates: Partial<Candidate>) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === currentStudent.id ? { ...c, ...updates } : c))
    );
  };

  const mintCredential = async (
    credData: Omit<ProofOfWorkCredential, "hash" | "canonicalPayload" | "issuedAt">
  ): Promise<ProofOfWorkCredential> => {
    const issuedAt = new Date().toISOString();
    
    // Canonical payload matching deterministic keys
    const canonicalObj = {
      candidateEmail: credData.candidateEmail,
      candidateId: credData.candidateId,
      issuedAt,
      passedQuestions: credData.passedQuestions,
      score: credData.score,
      skillId: credData.skillId,
      totalQuestions: credData.totalQuestions,
    };

    const canonicalPayload = canonicalizeJSON(canonicalObj);
    const hash = await computeSHA256(canonicalPayload);

    const newCred: ProofOfWorkCredential = {
      ...credData,
      hash,
      canonicalPayload,
      issuedAt,
    };

    setCredentials((prev) => [newCred, ...prev]);

    // Automatically boost candidate profile (S12, E9)
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== credData.candidateId) return c;

        // Mark skill as verified
        const updatedSkills = c.skills.map((s) => {
          if (s.skillId === credData.skillId) {
            return {
              ...s,
              isVerified: true,
              credentialHash: hash,
              verifiedAt: issuedAt.split("T")[0],
              score: credData.score,
            };
          }
          return s;
        });

        // If skill wasn't in list, add it
        const exists = updatedSkills.some((s) => s.skillId === credData.skillId);
        if (!exists) {
          updatedSkills.push({
            skillId: credData.skillId,
            skillName: credData.skillName,
            category: "backend",
            level: "Advanced",
            isVerified: true,
            credentialHash: hash,
            verifiedAt: issuedAt.split("T")[0],
            score: credData.score,
          });
        }

        // Remove from missing competencies
        const updatedMissing = c.missingCompetencies.filter(
          (m) => m.toLowerCase() !== credData.skillName.toLowerCase()
        );

        // Recompute readiness score (Weighted Deficit Resistance Model)
        // With missing competency closed, score boosts to >= 85% Job-Ready!
        const boostedScore = Math.min(100, Math.max(88, c.readinessScore + 14));
        const newTier: ReadinessTier = boostedScore >= 85 ? "job_ready" : "bridgeable";

        return {
          ...c,
          skills: updatedSkills,
          missingCompetencies: updatedMissing,
          readinessScore: boostedScore,
          currentTier: newTier,
          credentials: [newCred, ...c.credentials],
          sprintAssigned: c.sprintAssigned
            ? { ...c.sprintAssigned, status: "passed" }
            : undefined,
        };
      })
    );

    addToast({
      type: "credential",
      title: "Cryptographic Credential Minted! 🛡️",
      message: `SHA-256 seal issued for ${credData.skillName}. Score: ${credData.score}%. Verification hash: ${hash.substring(0, 16)}...`,
    });

    return newCred;
  };

  const getCredentialByHash = (hash: string) => {
    return credentials.find((c) => c.hash.toLowerCase() === hash.toLowerCase());
  };

  const logAnomaly = (anomaly: Omit<AnomalyLog, "id" | "timestamp" | "resolved">) => {
    const newAnomaly: AnomalyLog = {
      ...anomaly,
      id: "anom-" + Date.now(),
      timestamp: new Date().toLocaleString(),
      resolved: false,
    };
    setAnomalies((prev) => [newAnomaly, ...prev]);
    addToast({
      type: "warning",
      title: `Anomaly Detected: ${anomaly.type}`,
      message: anomaly.description,
    });
  };

  const resolveAnomaly = (id: string) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
  };

  return (
    <StoreContext.Provider
      value={{
        role,
        setRole,
        currentOrg,
        setCurrentOrg,
        organizations,
        setOrganizations,
        jobs,
        activeJobId,
        setActiveJobId,
        activeJob,
        addNewJob,
        candidates,
        isAnonymizedScreening,
        setIsAnonymizedScreening,
        dispatchGapSprint,
        updateCandidatePipelineStatus,
        credentials,
        mintCredential,
        getCredentialByHash,
        currentStudent,
        updateStudentProfile,
        studentPrivacyHideAttempts,
        setStudentPrivacyHideAttempts,
        taxonomy,
        anomalies,
        resolveAnomaly,
        logAnomaly,
        toasts,
        dismissToast,
        addToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
