import os
from dotenv import load_dotenv

# Load environment variables from the .env file FIRST
load_dotenv()
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import uuid
from contextlib import asynccontextmanager

from schemas import ResumeSchema, JDSchema, ComparisonResultSchema
from services.parser_service import extract_text, parse_resume, parse_jd
from services.vector_service import store_resume, store_jd, compare_resume_to_jd, query_matching_resumes, query_matching_jds

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ChromaDB persistent client is automatically initialized when vector_service is imported
    yield

app = FastAPI(title="Gemini AI Skill Matching API with ChromaDB", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/parse-resume", response_model=ResumeSchema)
async def api_parse_resume(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        raw_text = await extract_text(file_bytes, file.filename)
        # Parse using Gemini
        resume_data = parse_resume(raw_text)
        
        # Store in ChromaDB
        resume_id = str(uuid.uuid4())
        store_resume(resume_id, resume_data)
        
        return resume_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class JDRequest(BaseModel):
    raw_text: str

@app.post("/api/parse-jd", response_model=JDSchema)
async def api_parse_jd(request: JDRequest):
    try:
        # Parse using Gemini
        jd_data = parse_jd(request.raw_text)
        
        # Store in ChromaDB
        jd_id = str(uuid.uuid4())
        store_jd(jd_id, jd_data)
        
        return jd_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def calculate_weighted_match(resume_skills: list, jd_data) -> ComparisonResultSchema:
    # Normalize to lowercase for robust matching
    res_skills_lower = {s.lower() for s in resume_skills}

    mandatory = jd_data.mandatory_skills
    optional = jd_data.nice_to_have_skills

    matched_mand = [s for s in mandatory if s.lower() in res_skills_lower]
    missing_mand = [s for s in mandatory if s.lower() not in res_skills_lower]
    matched_opt = [s for s in optional if s.lower() in res_skills_lower]

    bonus = [
        s
        for s in resume_skills
        if s.lower()
        not in {m.lower() for m in mandatory + optional}
    ]

    # Weights: Mandatory = 3.0, Optional = 1.0
    weight_mand = 3.0
    weight_opt = 1.0

    max_possible_score = (len(mandatory) * weight_mand) + (
        len(optional) * weight_opt
    )

    if max_possible_score > 0:
        earned_score = (len(matched_mand) * weight_mand) + (
            len(matched_opt) * weight_opt
        )
        match_score = round((earned_score / max_possible_score) * 100, 2)
    else:
        match_score = 0.0

    # Tier Segmentation (E4)
    if match_score >= 85.0:
        tier = "Job-Ready"
    elif match_score >= 60.0:
        tier = "Bridgeable"
    else:
        tier = "Mismatch"

    return ComparisonResultSchema(
        match_score=match_score,
        tier=tier,
        matched_mandatory_skills=matched_mand,
        matched_optional_skills=matched_opt,
        missing_mandatory_skills=missing_mand,
        bonus_skills=bonus,
    )

@app.post("/api/compare", response_model=ComparisonResultSchema)
async def api_compare(
    resume_file: UploadFile = File(None),
    resume_text: str = Form(None),
    jd_text: str = Form(...)
):
    try:
        # 1. Parse Resume
        if resume_file:
            file_bytes = await resume_file.read()
            raw_resume_text = await extract_text(file_bytes, resume_file.filename)
        elif resume_text:
            raw_resume_text = resume_text
        else:
            raise HTTPException(status_code=400, detail="Must provide either resume_file or resume_text")
            
        resume_data = parse_resume(raw_resume_text)
        
        # 2. Parse JD
        jd_data = parse_jd(jd_text)
        
        # 3. Compare (Weighted Deficit Resistance Model & Tier Segmentation)
        comparison_result = calculate_weighted_match(resume_data.skills, jd_data)
        
        # 4. Store them both in ChromaDB for future querying
        store_resume(str(uuid.uuid4()), resume_data)
        store_jd(str(uuid.uuid4()), jd_data)
        
        return comparison_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class QueryRequest(BaseModel):
    query_text: str
    n_results: int = 5

@app.post("/api/query/resumes")
async def api_query_resumes(request: QueryRequest):
    """Find resumes that semantically match a given job description text"""
    try:
        return query_matching_resumes(request.query_text, request.n_results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/query/jds")
async def api_query_jds(request: QueryRequest):
    """Find job descriptions that semantically match a given resume text"""
    try:
        return query_matching_jds(request.query_text, request.n_results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
