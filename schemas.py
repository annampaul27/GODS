from pydantic import BaseModel, Field
from typing import List, Optional

class WorkExperience(BaseModel):
    company: str = Field(description="Name of the company or employer")
    title: str = Field(description="Job title or role")
    start_date: str = Field(description="Start date of employment (e.g., Jan 2023)")
    end_date: Optional[str] = Field(description="End date of employment or 'Present'")
    bullet_points: List[str] = Field(description="List of responsibilities, achievements, or bullet points")

class ResumeSchema(BaseModel):
  name: str
  email: Optional[str] = None
  phone: Optional[str] = None  # <--- Change this to Optional[str] = None
  work_experience: List[WorkExperience]
  skills: List[str] = Field(description="Normalized list of extracted skills.")
  summary: str = Field(description="A brief professional summary.")

class JDSchema(BaseModel):
    job_title: str = Field(description="Title of the job role")
    mandatory_skills: List[str] = Field(description="Must-have skills required for the job.")
    nice_to_have_skills: List[str] = Field(description="Preferred but optional skills.")
    years_of_experience_required: Optional[int] = Field(description="Years of experience required")
    description_summary: str = Field(description="A brief summary of the job role.")

class ComparisonResultSchema(BaseModel):
    match_score: float = Field(description="Percentage match score")
    matched_skills: List[str] = Field(description="Intersection of resume skills and JD mandatory skills")
    missing_skills: List[str] = Field(description="JD mandatory skills minus resume skills")
    bonus_skills: List[str] = Field(description="Resume skills not found in the JD")

