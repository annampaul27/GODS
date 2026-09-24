import hashlib
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import instructor
from groq import Groq
from schemas import BugFixRequest, BugFixResponse, ChallengeRequest, ChallengeResponse
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Interactive Code Bug-Fixer Engine",
    version="1.0.0",
    description=(
        "Backend evaluation engine for real-world code bug-fixes and"
        " cryptographic proof-of-work."
    ),
)

# Enable CORS so your frontend partner's app can communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for easy frontend integration
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client with Instructor for structured JSON enforcement
client = instructor.from_groq(
    Groq(api_key=os.environ.get("GROQ_API_KEY")),
    mode=instructor.Mode.JSON,
)


@app.post("/api/evaluate-bug", response_model=BugFixResponse)
def evaluate_bug_fix(data: BugFixRequest):
  """Receives candidate code, evaluates performance and bug-fix criteria via Groq, and generates SHA-256 proof."""
  try:
    prompt = f"""
        You are a strict, automated senior engineering test runner. Evaluate this candidate code submission for challenge '{data.challenge_id}'.
        
        Candidate Code:
        {data.candidate_code}
        
        Instructions:
        1. Determine if the bug is successfully fixed (e.g., syntax errors resolved, async loops corrected, missing database indexes added).
        2. Generate 3 rigorous test cases (e.g., Port exposure/container check, query latency optimization, concurrency/memory leak validation).
        3. Assign realistic performance metrics (e.g., '1420ms -> 12ms via B-Tree index' or '0.12s').
        4. Set 'is_solved' to true only if the code successfully resolves the problem.
        """

    # Enforce structured output matching BugFixResponse schema
    result = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        response_model=BugFixResponse,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2048,
    )

    # Generate a verifiable SHA-256 cryptographic proof-of-work hash if successful
    if result.is_solved:
      raw_seed = f"{data.challenge_id}:{data.candidate_code}:VERIFIED:2026"
      result.cryptographic_hash = hashlib.sha256(raw_seed.encode()).hexdigest()
    else:
      result.cryptographic_hash = "INVALID_HASH_FIX_FAILED"

    return result

  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/generate-challenge", response_model=ChallengeResponse)
def generate_dynamic_challenge(data: ChallengeRequest):
  """Dynamically generates a custom engineering bug-fix challenge and starter code based on candidate skill gaps."""
  try:
    prompt = f"""
        You are a principal software engineer and technical hiring manager. 
        Create a realistic, hands-on production bug-fix challenge for a candidate who has a skill gap in '{data.skill_gap}' for a '{data.role}' position.
        
        Instructions:
        1. Create a unique challenge_id (e.g., 'db-perf-02' or 'async-lock-01').
        2. Provide a professional title.
        3. Write a clear scenario description explaining a production problem (e.g., memory leak, unindexed query, race condition).
        4. Write a snippet of broken starter_code that contains the bug for the candidate to fix.
        """

    result = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        response_model=ChallengeResponse,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2048,
    )
    return result

  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
def root():
  return {
      "status": "Running",
      "docs": "Visit /docs for interactive Swagger UI test sandbox",
  }