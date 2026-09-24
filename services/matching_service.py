from schemas import ResumeSchema, JDSchema, ComparisonResultSchema

def compare_resume_to_jd(resume: ResumeSchema, jd: JDSchema) -> ComparisonResultSchema:
    # Convert lists to sets with lowercasing for case-insensitive comparison
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
    
    # Map back to original casing
    matched_skills = [jd_mandatory_map[s] for s in matched_lower]
    missing_skills = [jd_mandatory_map[s] for s in missing_lower]
    bonus_skills = [resume_skill_map[s] for s in bonus_lower]
    
    # Score calculation
    # Let's say mandatory skills account for 80% of the score and nice-to-have 20%
    mandatory_score = 0.0
    if jd_mandatory_set:
        mandatory_score = (len(matched_lower) / len(jd_mandatory_set)) * 80.0
    else:
        mandatory_score = 80.0 # If no mandatory skills, give full points for this section
        
    nice_to_have_matched = resume_skills_set.intersection(jd_nice_to_have_set)
    nice_to_have_score = 0.0
    if jd_nice_to_have_set:
        nice_to_have_score = (len(nice_to_have_matched) / len(jd_nice_to_have_set)) * 20.0
    else:
        nice_to_have_score = 20.0 # Full points if no nice to have
        
    total_score = round(mandatory_score + nice_to_have_score, 2)
    
    return ComparisonResultSchema(
        match_score=total_score,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        bonus_skills=bonus_skills
    )
