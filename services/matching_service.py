from schemas import ResumeSchema, JDSchema, ComparisonResultSchema

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

def compare_resume_to_jd(resume: ResumeSchema, jd: JDSchema) -> ComparisonResultSchema:
    return calculate_weighted_match(resume.skills, jd)
