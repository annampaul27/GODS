from pydantic import BaseModel, Field
from typing import List, Optional, Any


class BugFixRequest(BaseModel):
  challenge_id: str = Field(description="Unique identifier for the bug challenge")
  candidate_code: str = Field(
      description="The code snippet submitted by the developer"
  )


class TestCaseResult(BaseModel):
  test_name: Optional[str] = Field(
      default="Test Case",
      alias="name",
      description="Name of the test case",
  )
  status: str = Field(
      default="PASS", description="Must be 'PASS' or 'FAIL' or 'pass'"
  )
  latency_metric: Optional[Any] = Field(
      default="N/A", description="Performance metric output"
  )
  details: Optional[str] = Field(
      default="Passed successfully", description="Explanation of test result"
  )

  class Config:
    populate_by_name = True


class BugFixResponse(BaseModel):
  is_solved: bool = Field(
      description="True if all production criteria and tests pass successfully"
  )
  test_cases: List[TestCaseResult] = Field(
      description="Detailed test case execution suite"
  )
  cryptographic_hash: str = Field(
      description="SHA-256 proof-of-work security hash token"
  )


class ChallengeRequest(BaseModel):
  skill_gap: str = Field(
      description="The specific missing skill to test, e.g., 'PostgreSQL indexing' or 'Python Asyncio'"
  )
  role: str = Field(
      description="The target job role, e.g., 'Backend Engineer'"
  )


class ChallengeResponse(BaseModel):
  challenge_id: Optional[str] = Field(
      default="bug-challenge-01", description="Unique identifier"
  )
  title: Optional[str] = Field(
      default="Production Bug Fix", description="Catchy title of the challenge"
  )
  description: Optional[str] = Field(
      default="Fix the bug in the given snippet.",
      description="Detailed scenario description",
  )
  starter_code: Optional[str] = Field(
      default="# Write your fix here",
      description="The broken starter code snippet",
  )

  class Config:
    populate_by_name = True