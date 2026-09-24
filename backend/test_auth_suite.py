import json
import urllib.request
import urllib.error
import sys

BASE_URL = "http://localhost:8000"

def make_request(path, method="GET", body=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            status_code = response.status
            content = json.loads(response.read().decode("utf-8"))
            return status_code, content
    except urllib.error.HTTPError as e:
        error_content = {}
        try:
            error_content = json.loads(e.read().decode("utf-8"))
        except Exception:
            pass
        return e.code, error_content
    except Exception as e:
        return 0, {"error": str(e)}

def run_auth_test_suite():
    tests_run = 0
    tests_passed = 0
    report = []

    def record_test(name, passed, detail):
        nonlocal tests_run, tests_passed
        tests_run += 1
        if passed:
            tests_passed += 1
        status_label = "PASS" if passed else "FAIL"
        report.append(f"[{status_label}] {name}: {detail}")
        print(f"[{status_label}] {name}: {detail}")

    print("\n================ AUTHENTICATION & LOGIN TEST SUITE ================")

    # Test 1: Valid Employer Login
    code, data = make_request("/api/v1/auth/login", method="POST", body={
        "email": "priya.sharma@acme.com",
        "password": "SkillSetu@2026",
        "role": "employer",
        "org_id": "org-acme"
    })
    employer_token = data.get("access_token")
    passed = (code == 200 and employer_token is not None and data.get("user", {}).get("role") == "employer")
    record_test("Employer Login (Valid)", passed, f"Status: {code} | User: {data.get('user', {}).get('full_name')} | Org: {data.get('organization', {}).get('name')}")

    # Test 2: Protected /me validation with Employer JWT
    code, data = make_request("/api/v1/auth/me", method="GET", token=employer_token)
    passed = (code == 200 and data.get("email") == "priya.sharma@acme.com" and data.get("org_name") == "Acme HyperScale Systems")
    record_test("Protected Profile /me (Valid Bearer JWT)", passed, f"Status: {code} | Profile email: {data.get('email')} | Org: {data.get('org_name')}")

    # Test 3: Valid Student Login
    code, data = make_request("/api/v1/auth/login", method="POST", body={
        "email": "aditya.verma@example.com",
        "password": "SkillSetu@2026",
        "role": "student"
    })
    student_token = data.get("access_token")
    passed = (code == 200 and student_token is not None and data.get("user", {}).get("readiness_score") == 78)
    record_test("Student Login (Valid)", passed, f"Status: {code} | User: {data.get('user', {}).get('full_name')} | Score: {data.get('user', {}).get('readiness_score')}%")

    # Test 4: Valid Admin Login
    code, data = make_request("/api/v1/auth/login", method="POST", body={
        "email": "root@skillsetu.ai",
        "password": "SkillSetu@2026",
        "role": "admin"
    })
    admin_token = data.get("access_token")
    passed = (code == 200 and admin_token is not None and data.get("user", {}).get("role") == "admin")
    record_test("Admin Superuser Login (Valid)", passed, f"Status: {code} | Role: {data.get('user', {}).get('role')}")

    # Test 5: Invalid Password Check
    code, data = make_request("/api/v1/auth/login", method="POST", body={
        "email": "priya.sharma@acme.com",
        "password": "WrongPassword999!",
        "role": "employer",
        "org_id": "org-acme"
    })
    passed = (code == 401 and "Invalid email or password" in data.get("detail", ""))
    record_test("Login with Invalid Password (Rejected)", passed, f"Status: {code} | Detail: {data.get('detail')}")

    # Test 6: Role Mismatch Check (User registered as employer tries to log in as student)
    code, data = make_request("/api/v1/auth/login", method="POST", body={
        "email": "priya.sharma@acme.com",
        "password": "SkillSetu@2026",
        "role": "student"
    })
    passed = (code == 403 and "Account exists under role" in data.get("detail", ""))
    record_test("Role Mismatch Enforcement (Rejected)", passed, f"Status: {code} | Detail: {data.get('detail')}")

    # Test 7: Invalid Organization ID Scoping
    code, data = make_request("/api/v1/auth/login", method="POST", body={
        "email": "priya.sharma@acme.com",
        "password": "SkillSetu@2026",
        "role": "employer",
        "org_id": "org-non-existent-99"
    })
    passed = (code == 404 and "not found" in data.get("detail", ""))
    record_test("Non-Existent Tenant Scoping (Rejected)", passed, f"Status: {code} | Detail: {data.get('detail')}")

    # Test 8: Unauthenticated Access to Protected Route
    code, data = make_request("/api/v1/auth/me", method="GET", token=None)
    passed = (code == 401 or code == 403)
    record_test("Unauthorized Access /me without Token (Blocked)", passed, f"Status: {code} | Detail: {data.get('detail')}")

    # Test 9: Tampered / Corrupt Bearer Token
    code, data = make_request("/api/v1/auth/me", method="GET", token="invalid.token.signature")
    passed = (code == 401)
    record_test("Corrupted Bearer Token Access (Blocked)", passed, f"Status: {code} | Detail: {data.get('detail')}")

    # Test 10: Auto-provision Sandbox User on Login
    code, data = make_request("/api/v1/auth/login", method="POST", body={
        "email": "guest.evaluator@talenttest.org",
        "password": "TemporaryPassword123",
        "role": "student"
    })
    passed = (code == 200 and data.get("access_token") is not None and data.get("user", {}).get("email") == "guest.evaluator@talenttest.org")
    record_test("Dynamic Sandbox User Auto-Provisioning", passed, f"Status: {code} | Created: {data.get('user', {}).get('full_name')} ({data.get('user', {}).get('id')})")

    # Test 11: Forgot Password Cryptographic Dispatch
    code, data = make_request("/api/v1/auth/forgot-password", method="POST", body={
        "email": "aditya.verma@example.com"
    })
    passed = (code == 200 and data.get("success") is True)
    record_test("Cryptographic Password Reset Dispatch", passed, f"Status: {code} | Message: {data.get('message')}")

    # Test 12: List Tenant Organizations
    code, data = make_request("/api/v1/auth/organizations", method="GET")
    passed = (code == 200 and isinstance(data, list) and len(data) >= 3)
    record_test("Tenant Organization Directory Listing", passed, f"Status: {code} | Found {len(data)} tenant organizations")

    print("\n======================= TEST SUMMARY =======================")
    print(f"Total Tests Executed: {tests_run}")
    print(f"Passed: {tests_passed}")
    print(f"Failed: {tests_run - tests_passed}")
    success = (tests_passed == tests_run)
    print(f"OVERALL RESULT: {'ALL PASS' if success else 'FAILURES DETECTED'}")
    print("============================================================\n")
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    run_auth_test_suite()
