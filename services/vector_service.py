import chromadb
from schemas import ResumeSchema, JDSchema, ComparisonResultSchema
import uuid

# Initialize ChromaDB Persistent Client
chroma_client = chromadb.PersistentClient(path="./chroma_db")

# Create or get collections
resume_collection = chroma_client.get_or_create_collection(name="resumes")
jd_collection = chroma_client.get_or_create_collection(name="jds")

def store_resume(resume_id: str, resume_data: ResumeSchema):
    skills_text = ", ".join(resume_data.skills)
    document_text = f"Skills: {skills_text}. Summary: {resume_data.summary}"
    
    resume_collection.add(
        documents=[document_text],
        metadatas=[{"name": resume_data.name}],
        ids=[resume_id]
    )

def store_jd(jd_id: str, jd_data: JDSchema):
    skills_text = ", ".join(jd_data.mandatory_skills + jd_data.nice_to_have_skills)
    document_text = f"Required Skills: {skills_text}. Description: {jd_data.description_summary}"
    
    jd_collection.add(
        documents=[document_text],
        metadatas=[{"job_title": jd_data.job_title}],
        ids=[jd_id]
    )

def calculate_weighted_match(resume_skills: list, jd_data: JDSchema) -> ComparisonResultSchema:
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

def compare_resume_to_jd(resume: ResumeSchema, jd: JDSchema) -> ComparisonResultSchema:
    return calculate_weighted_match(resume.skills, jd)


def query_matching_jds(resume_summary: str, n_results: int = 5):
    """Query ChromaDB for similar Job Descriptions"""
    results = jd_collection.query(
        query_texts=[resume_summary],
        n_results=n_results
    )
    return results

def query_matching_resumes(jd_summary: str, n_results: int = 5):
    """Query ChromaDB for similar Resumes"""
    results = resume_collection.query(
        query_texts=[jd_summary],
        n_results=n_results
    )
    return results
