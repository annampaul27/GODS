"""
CareerCompass AI - GitHub Analysis Feature

Handles the preparation and structuring of GitHub repository
information for AI-based project analysis.

API/LLM integration is intentionally kept separate.
"""

from typing import Dict, List


def prepare_github_analysis(
    repository_name: str,
    repository_url: str,
    files: List[str],
    file_content: str
) -> Dict:
    """
    Prepare a GitHub repository for AI-based analysis.

    Parameters:
        repository_name: Name of the repository.
        repository_url: Repository URL.
        files: List of files found in the repository.
        file_content: Relevant repository/file content.

    Returns:
        Structured information for the AI analysis layer.
    """

    if not repository_name.strip():
        raise ValueError("Repository name cannot be empty.")

    if not repository_url.strip():
        raise ValueError("Repository URL cannot be empty.")

    return {
        "repository_name": repository_name.strip(),
        "repository_url": repository_url.strip(),
        "files": files,
        "file_content": file_content,
        "analysis_requirements": {
            "identify_project_type": True,
            "identify_tech_stack": True,
            "summarize_project": True,
            "assess_complexity": True,
            "suggest_improvements": True,
            "generate_resume_bullets": True,
        }
    }


def get_github_analysis_requirements() -> List[str]:
    """
    Return the information that CareerCompass expects
    from GitHub project analysis.
    """

    return [
        "Project name",
        "Project type",
        "Project summary",
        "Technology stack",
        "Complexity rating",
        "Resume bullet points",
        "Improvement suggestions",
    ]