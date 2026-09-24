# SkillSetu AI — Role-Separated Talent Infrastructure & Trust Engine

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black.svg?logo=next.js&logoColor=white)](https://nextjs.org)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB.svg?logo=python&logoColor=white)](https://python.org)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector_Store-FF6B6B.svg)](https://trychroma.com)
[![Groq](https://img.shields.io/badge/Groq-Llama3_Extraction-F55036.svg)](https://groq.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

SkillSetu AI bridges the gap between talent supply (students) and employer demand (corporates, universities, staffing agencies). It combines an AI-powered Applicant Tracking System (ATS), cryptographic proof-of-work credentialing (SHA-256), and deterministic deficit-resistance skill matching.

---

## 👥 Contributors & Feature Attribution

| Contributor | GitHub | Role & Subsystems Engineered |
|---|---|---|
| **Annam Paul** | [@annampaul27](https://github.com/annampaul27) | **Core Feature Architect — ATS Engine**<br>• Designed & implemented the ATS FastAPI microservices (`/api/v1/ats/*`)<br>• Structured LLM parsing pipeline via Groq + Instructor (`ResumeSchema`, `JDSchema`)<br>• ChromaDB persistent vector repository & semantic applicant retrieval<br>• Deterministic skill gap comparison & tier segmentation (**E1, E2, E3, E4, E10**) |
| **Core Engineering Team** | [@rdnk2004](https://github.com/rdnk2004) | **Platform & Trust Engine Architects**<br>• Multi-tenant role-separated architecture (Corporate, University, Staffing)<br>• Next.js 15 App Router interface & Talent Radar<br>• SHA-256 cryptographic proof-of-work credential ledger & public verification portal<br>• Timed assessment anti-cheat execution runner |

---

## 🚀 Key Modules & Requirement Coverage

### Employer Workflow (ATS & Talent Radar)
* **E1 (Active Job Requisition Ingestion):** Employers input openings via pre-configured tech templates or raw text paste.
* **E2 (Automated JD Parsing & Weighting):** Fast ATS LLM parser categorizes skills into **Critical** (weight=3.0) and **Optional** (weight=1.0) hiring benchmarks.
* **E3 (Talent Radar Scoring):** Weighted Deficit Resistance Model computes candidate job-readiness percentage (0–100%).
* **E4 (Three-Tier Candidate Segmentation):** Automatic segmentation into **Job-Ready (≥85%)**, **Bridgeable (60–84%)**, and **Mismatch (<60%)**.
* **E10 (Candidate Profile & Experience Drawer):** Detailed drawer displaying parsed work experience, past verified projects, and verified GitHub repository links.

### Student & Trust Engine
* **S1 & S2 (Resume Ingestion):** PDF/DOCX multi-page extraction via `pdfplumber` and `python-docx` into structured candidate profiles.
* **S10 & S11 (Proof-of-Work Minting):** Immutable SHA-256 cryptographic micro-credentials with zero-auth public verification (`/verify/[hash]`).
* **NF1 & NF2 (Performance & Offline Mode):** Sub-3.0s processing with an automated offline fallback cache for zero-downtime reliability.

---

## 📂 Project Architecture

```
AI-Skill/
├── backend/
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── auth.py          # JWT authentication & session management
│   │   │   └── ats.py           # ATS resume/JD parsing, comparison & vector querying
│   │   ├── core/
│   │   │   ├── config.py        # Settings, API keys, CORS origins
│   │   │   └── security.py      # SHA-256 & bcrypt cryptographic utilities
│   │   ├── models/
│   │   │   ├── ats.py           # Pydantic models (ResumeSchema, JDSchema, Comparison)
│   │   │   └── schemas.py       # Auth & Organization models
│   │   ├── services/ats/
│   │   │   ├── parser_service.py   # PDF/DOCX text extraction & Groq LLM parsing
│   │   │   ├── matching_service.py # Deterministic skill gap & deficit scoring
│   │   │   └── vector_service.py   # ChromaDB persistence & similarity querying
│   │   └── main.py              # FastAPI app initialization & route mounting
│   ├── requirements.txt         # Python dependencies
│   ├── test_ats_suite.py        # Pytest test suite for ATS features
│   └── run.py                   # Local dev server launcher (Port 8000)
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── employer/page.tsx # Talent Radar, Requisitions & Candidate Pipeline
│   │   │   ├── student/page.tsx  # Skill Gap Radar & Micro-Learning Sprints
│   │   │   ├── admin/page.tsx    # Multi-tenant oversight & credential ledger
│   │   │   └── login/page.tsx    # Role-separated authentication
│   │   ├── components/
│   │   │   ├── employer/         # CandidateDrawer (E10), JobCreatorModal (E1, E2), TalentRadar (E3, E4)
│   │   │   ├── student/          # ResumeUploadDrawer (S1, S2, E10), Roadmap, SprintModal
│   │   │   └── layout/Navbar.tsx # Contributor credits & navigation
│   │   ├── lib/                  # State store & mock datasets
│   │   └── types/index.ts        # TypeScript contracts
│   └── package.json
└── SkillSetu_AI_SRS_v2.md        # Software Requirements Specification (v2.0)
```

---

## 🛠️ Setup & Running Locally

### 1. Backend (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
cp .env.example .env   # Configure GROQ_API_KEY if desired
python run.py
```
* API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
* Telemetry Health Check: [http://localhost:8000/health](http://localhost:8000/health)

### 2. Frontend (Next.js 15)
```bash
cd frontend
npm install
npm run dev
```
* Frontend Application: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing the Integration

Run the ATS test suite to verify requirements **E1, E2, E3, E4, E10**:
```bash
cd backend
python -m pytest -v test_ats_suite.py
```
All 6 tests validate schema integrity, deterministic deficit math, ChromaDB vector querying, and contributor attribution.
