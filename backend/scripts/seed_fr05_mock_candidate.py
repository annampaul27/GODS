#!/usr/bin/env python
"""
Seed script for FR-05: Real-Time Eligibility Job Matching Alerts
Seeds mock users with exactly 4 verified skills: Python, SQL, AWS, Docker.
"""
import sys
import os
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.database import get_db_connection, init_db

def seed_fr05():
    print("=" * 65)
    print("SEEDING FR-05 MOCK CANDIDATES WITH 4 VERIFIED SKILLS")
    print("=" * 65)
    
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    verified_skills = ["Python", "SQL", "AWS", "Docker"]
    verified_skills_json = json.dumps(verified_skills)

    # 1. Update cand-1 (the student active on the dashboard)
    cursor.execute("""
    UPDATE users 
    SET verified_skills_json = ?,
        readiness_score = 90,
        current_tier = 'job_ready'
    WHERE id = 'cand-1'
    """, (verified_skills_json,))

    # 2. Ensure cand-mock-01 exists with exactly those 4 verified skills
    cursor.execute("SELECT id FROM users WHERE id = 'cand-mock-01'")
    if cursor.fetchone():
        cursor.execute("""
        UPDATE users
        SET verified_skills_json = ?,
            readiness_score = 94,
            current_tier = 'job_ready'
        WHERE id = 'cand-mock-01'
        """, (verified_skills_json,))
    else:
        cursor.execute("""
        INSERT INTO users (
            id, email, full_name, role, user_class, college, experience_years,
            readiness_score, current_tier, avatar_url, verified_skills_json
        ) VALUES (
            'cand-mock-01', 'cloud.engineer@example.com', 'Alex Rivera', 'student', 'Experienced',
            'Indian Institute of Technology (IIT) Delhi', 3.0, 94, 'job_ready',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            ?
        )
        """, (verified_skills_json,))

    conn.commit()

    # Query back to verify
    cursor.execute("SELECT id, full_name, email, verified_skills_json FROM users WHERE id IN ('cand-1', 'cand-mock-01')")
    users = cursor.fetchall()
    for u in users:
        print(f" [OK] User [{u['id']}] {u['full_name']} ({u['email']}):")
        print(f"   Verified Skills ({len(json.loads(u['verified_skills_json']))}): {u['verified_skills_json']}")

    conn.close()
    print("=" * 65)
    print("SEEDING COMPLETE: Verified candidates ready for real-time match tests.")
    print("=" * 65)

if __name__ == "__main__":
    seed_fr05()
