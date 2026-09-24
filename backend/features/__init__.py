"""
CareerCompass AI Feature Package
Authored by Jayasree A B (branch: features)
"""

from .career_roadmap import prepare_career_roadmap, create_roadmap_phase, get_career_roadmap_requirements
from .github_analysis import prepare_github_analysis, get_github_analysis_requirements
from .interview_coach import (
    prepare_interview_question,
    build_interview_question,
    prepare_answer_evaluation,
    build_interview_evaluation,
)
from .job_market_analysis import prepare_job_market_analysis, classify_demand, build_market_result
from .portfolio_builder import prepare_portfolio
from .resume_analysis import prepare_resume_analysis, get_resume_analysis_requirements
from .skill_gap_analysis import (
    prepare_skill_gap_analysis,
    build_competency_area,
    VALID_SKILL_LEVELS,
)

__author__ = "Jayasree A B <jayasreeab2004@gmail.com>"
__all__ = [
    "prepare_career_roadmap",
    "create_roadmap_phase",
    "get_career_roadmap_requirements",
    "prepare_github_analysis",
    "get_github_analysis_requirements",
    "prepare_interview_question",
    "build_interview_question",
    "prepare_answer_evaluation",
    "build_interview_evaluation",
    "prepare_job_market_analysis",
    "classify_demand",
    "build_market_result",
    "prepare_portfolio",
    "prepare_resume_analysis",
    "get_resume_analysis_requirements",
    "prepare_skill_gap_analysis",
    "build_competency_area",
    "VALID_SKILL_LEVELS",
]
