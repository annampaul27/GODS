import pytest
import hashlib
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_generate_challenge_api_v1():
    """
    Test generating dynamic bug-fix challenge via /api/v1/sandbox/generate-challenge.
    """
    payload = {
        "skill_gap": "PostgreSQL indexing & query latency",
        "role": "Backend Engineer"
    }
    response = client.post("/api/v1/sandbox/generate-challenge", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "challenge_id" in data
    assert "title" in data
    assert "description" in data
    assert "starter_code" in data
    assert len(data["starter_code"]) > 0

def test_generate_challenge_root_alias():
    """
    Test generating dynamic bug-fix challenge via /api/generate-challenge (code-bug-fixer-engine compatibility).
    """
    payload = {
        "skill_gap": "Python Asyncio concurrency",
        "role": "Distributed Systems Engineer"
    }
    response = client.post("/api/generate-challenge", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "challenge_id" in data
    assert len(data["challenge_id"]) > 0
    assert "title" in data
    assert "starter_code" in data

def test_evaluate_bug_fix_success():
    """
    Test evaluating a valid bug fix code submission with passing tests and SHA-256 hash.
    """
    payload = {
        "challenge_id": "db-perf-01",
        "candidate_code": "CREATE INDEX idx_users_email ON users(email);"
    }
    response = client.post("/api/v1/sandbox/evaluate-bug", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_solved"] is True
    assert len(data["test_cases"]) >= 3
    for tc in data["test_cases"]:
        assert tc["status"] == "PASS"
        assert "latency_metric" in tc
    
    # Verify SHA-256 cryptographic proof
    assert "cryptographic_hash" in data
    assert len(data["cryptographic_hash"]) == 64
    assert data["cryptographic_hash"] != "INVALID_HASH_FIX_FAILED"

    # Verify deterministic hash calculation
    expected_seed = f"{payload['challenge_id']}:{payload['candidate_code']}:VERIFIED:2026"
    expected_hash = hashlib.sha256(expected_seed.encode()).hexdigest()
    assert data["cryptographic_hash"] == expected_hash

def test_evaluate_bug_fix_failure():
    """
    Test evaluating an incomplete bug fix submission with failing status and invalid hash.
    """
    payload = {
        "challenge_id": "db-perf-01",
        "candidate_code": "# TODO: fix this later\npass"
    }
    response = client.post("/api/evaluate-bug", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_solved"] is False
    assert data["cryptographic_hash"] == "INVALID_HASH_FIX_FAILED"
    assert any(tc["status"] == "FAIL" for tc in data["test_cases"])

def test_evaluate_async_bug_fix():
    """
    Test evaluating an async event-loop concurrency fix.
    """
    payload = {
        "challenge_id": "async-lock-01",
        "candidate_code": "import asyncio\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get('/metrics')\nasync def fetch_metrics():\n    await asyncio.sleep(0.01)\n    return {'status': 'ok'}"
    }
    response = client.post("/api/v1/sandbox/evaluate-bug", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_solved"] is True
    assert len(data["cryptographic_hash"]) == 64
