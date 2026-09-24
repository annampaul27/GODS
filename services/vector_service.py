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

def compare_resume_to_jd(resume: ResumeSchema, jd: JDSchema) -> ComparisonResultSchema:
    # Deterministic set operations for exact skill gap analysis
    resume_skills_set = {skill.lower() for skill in resume.skills}
    jd_mandatory_set = {skill.lower() for skill in jd.mandatory_skills}
    jd_nice_to_have_set = {skill.lower() for skill in jd.nice_to_have_skills}
    jd_all_skills_set = jd_mandatory_set.union(jd_nice_to_have_set)
    
    # Create mapping to return original casing based on the input words
    resume_skill_map = {skill.lower(): skill for skill in resume.skills}
    jd_mandatory_map = {skill.lower(): skill for skill in jd.mandatory_skills}
    
    matched_lower = resume_skills_set.intersection(jd_mandatory_set)
    missing_lower = jd_mandatory_set.difference(resume_skills_set)
    bonus_lower = resume_skills_set.difference(jd_all_skills_set)
    
    matched_skills = [jd_mandatory_map[s] for s in matched_lower]
    missing_skills = [jd_mandatory_map[s] for s in missing_lower]
    bonus_skills = [resume_skill_map[s] for s in bonus_lower]
    
    # Score calculation
    mandatory_score = 0.0
    if jd_mandatory_set:
        mandatory_score = (len(matched_lower) / len(jd_mandatory_set)) * 80.0
    else:
        mandatory_score = 80.0
        
    nice_to_have_matched = resume_skills_set.intersection(jd_nice_to_have_set)
    nice_to_have_score = 0.0
    if jd_nice_to_have_set:
        nice_to_have_score = (len(nice_to_have_matched) / len(jd_nice_to_have_set)) * 20.0
    else:
        nice_to_have_score = 20.0
        
    total_score = round(mandatory_score + nice_to_have_score, 2)
    
    return ComparisonResultSchema(
        match_score=total_score,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        bonus_skills=bonus_skills
    )

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
