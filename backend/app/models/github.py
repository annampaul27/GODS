from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class SecretLeakItem(BaseModel):
    file: str
    line: int
    pattern: str

class GithubRepo(BaseModel):
    id: Optional[int] = None
    name: str = "repo"
    full_name: str = "user/repo"
    html_url: str = ""
    description: Optional[str] = None
    has_readme: bool = True
    default_branch: str = "main"
    language: Optional[str] = "Python"
    stargazers_count: int = 0
    forks_count: int = 0
    is_private: bool = False

class RepoScan(BaseModel):
    repo_full_name: str = ""
    has_gitignore: bool = True
    has_env_file: bool = False
    has_readme: bool = True
    leaked_secrets: List[Dict[str, Any]] = Field(default_factory=list)
    ai_issues: List[str] = Field(default_factory=list)
    health_score: int = 100
    total_files: int = 0
    detected_manifests: List[str] = Field(default_factory=list)

class RemediationRequest(BaseModel):
    repo_full_name: str
    action: str = Field(..., description="add_gitignore | remove_env | fix_all")

class ScanRequest(BaseModel):
    repo_full_name: str
    username: Optional[str] = "aaravsharma-dev"
