from app.models.ats import ResumeSchema, JDSchema, ComparisonResultSchema

def compare_resume_to_jd(resume: ResumeSchema, jd: JDSchema) -> ComparisonResultSchema:
    """
    Deterministic Skill Gap Analysis & Weighted Deficit Resistance Model (E2, E3, E4).
    Categorizes skills into Critical (weight=3.0) and Optional (weight=1.0).
    Segments candidate into Job-Ready (>=85%), Bridgeable (60-84%), or Mismatch (<60%).
    """
    # Convert lists to sets with lowercasing for case-insensitive comparison
    resume_skills_set = {skill.strip().lower() for skill in resume.skills if skill.strip()}
    jd_mandatory_set = {skill.strip().lower() for skill in jd.mandatory_skills if skill.strip()}
    jd_nice_to_have_set = {skill.strip().lower() for skill in jd.nice_to_have_skills if skill.strip()}
    jd_all_skills_set = jd_mandatory_set.union(jd_nice_to_have_set)
    
    # Create mapping to return original casing based on the input words
    resume_skill_map = {skill.strip().lower(): skill.strip() for skill in resume.skills if skill.strip()}
    jd_mandatory_map = {skill.strip().lower(): skill.strip() for skill in jd.mandatory_skills if skill.strip()}
    jd_nice_map = {skill.strip().lower(): skill.strip() for skill in jd.nice_to_have_skills if skill.strip()}
    
    matched_lower = resume_skills_set.intersection(jd_mandatory_set)
    missing_lower = jd_mandatory_set.difference(resume_skills_set)
    bonus_lower = resume_skills_set.difference(jd_all_skills_set)
    
    # Map back to original casing
    matched_skills = [jd_mandatory_map[s] for s in matched_lower]
    missing_skills = [jd_mandatory_map[s] for s in missing_lower]
    bonus_skills = [resume_skill_map[s] for s in bonus_lower]
    
    # Weighted Score calculation (E2: Critical weight=3.0 (80%), Optional weight=1.0 (20%))
    mandatory_score = 0.0
    if jd_mandatory_set:
        mandatory_score = (len(matched_lower) / len(jd_mandatory_set)) * 80.0
    else:
        mandatory_score = 80.0 # If no mandatory skills specified, award full baseline
        
    nice_to_have_matched = resume_skills_set.intersection(jd_nice_to_have_set)
    nice_to_have_score = 0.0
    if jd_nice_to_have_set:
        nice_to_have_score = (len(nice_to_have_matched) / len(jd_nice_to_have_set)) * 20.0
    else:
        nice_to_have_score = 20.0 # Full points if no nice to have
        
    total_score = round(mandatory_score + nice_to_have_score, 2)
    
    # Tier Segmentation (E4)
    if total_score >= 85.0:
        tier = "job_ready"
    elif total_score >= 60.0:
        tier = "bridgeable"
    else:
        tier = "mismatch"
    
    return ComparisonResultSchema(
        match_score=total_score,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        bonus_skills=bonus_skills,
        tier=tier
    )
