from pydantic import BaseModel, Field
from typing import List, Optional


class WorkExperience(BaseModel):
    company: str = Field(description="Name of the company or employer")
    title: str = Field(description="Job title or role")
    start_date: str = Field(description="Start date of employment")
    end_date: Optional[str] = Field(
        default=None, description="End date of employment or 'Present'"
    )
    bullet_points: List[str] = Field(
        default=[], description="List of responsibilities or achievements"
    )


class ProjectSchema(BaseModel):
    title: str = Field(description="Project title")
    description: Optional[str] = Field(
        default=None, description="Brief project description"
    )
    github_url: Optional[str] = Field(
        default=None, description="Verified GitHub repository URL for the project"
    )


class ResumeSchema(BaseModel):
    name: str = Field(description="Full name of the candidate")
    email: Optional[str] = Field(default=None, description="Email address")
    phone: Optional[str] = Field(default=None, description="Phone number")
    github_url: Optional[str] = Field(
        default=None, description="Candidate's main GitHub profile link if present"
    )
    projects: List[ProjectSchema] = Field(
        default=[], description="List of notable projects"
    )
    work_experience: List[WorkExperience] = Field(
        default=[], description="List of work history"
    )
    skills: List[str] = Field(
        default=[], description="Normalized list of extracted skills"
    )
    summary: str = Field(default="", description="Professional summary")


class JDSchema(BaseModel):
    job_title: str = Field(description="Title of the job role")
    mandatory_skills: List[str] = Field(
        default=[], description="Must-have skills required (weight=3.0)"
    )
    nice_to_have_skills: List[str] = Field(
        default=[], description="Optional skills (weight=1.0)"
    )
    years_of_experience_required: Optional[int] = Field(
        default=None, description="Years of experience required"
    )
    description_summary: str = Field(
        default="", description="Summary of the job role"
    )


class ComparisonResultSchema(BaseModel):
    match_score: float = Field(
        description="Weighted deficit resistance percentage score (0-100%)"
    )
    tier: str = Field(
        description=(
            "Candidate Tier: Job-Ready (>=85%), Bridgeable (60-84%), or Mismatch (<60%)"
        )
    )
    matched_mandatory_skills: List[str] = Field(default=[])
    matched_optional_skills: List[str] = Field(default=[])
    missing_mandatory_skills: List[str] = Field(default=[])
    bonus_skills: List[str] = Field(default=[])

