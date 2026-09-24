import sqlite3
import os
import json
from datetime import datetime
from typing import Optional, Dict, Any, List

DB_PATH = os.path.join(os.path.dirname(__file__), "skillsetu.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'student',
        user_class TEXT NOT NULL DEFAULT 'Fresher',
        college TEXT,
        experience_years REAL DEFAULT 0.0,
        readiness_score INTEGER DEFAULT 70,
        current_tier TEXT DEFAULT 'bridgeable',
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 2. Skills Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS skills (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        weight REAL DEFAULT 3.0,
        is_critical BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 3. Assessments Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS assessments (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        skill_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL DEFAULT 20,
        correct_count INTEGER NOT NULL,
        time_taken_seconds INTEGER NOT NULL,
        verification_status TEXT NOT NULL,
        badge_tier TEXT,
        answers_log_json TEXT,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (skill_id) REFERENCES skills (id)
    )
    """)

    # 4. ATS Resumes Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ats_resumes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        file_name TEXT,
        parsed_json TEXT NOT NULL,
        ats_score INTEGER DEFAULT 85,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    """)

    # Seed Initial Data if empty
    cursor.execute("SELECT COUNT(*) FROM skills")
    if cursor.fetchone()[0] == 0:
        initial_skills = [
            ("postgresql", "PostgreSQL Optimization & Architecture", "backend", "Advanced query optimization, execution plans, B-Tree & GIN indexing, vacuuming, and replication.", 3.0, 1),
            ("python", "Python Core, Concurrency & AsyncIO", "backend", "Generators, decorators, asyncio event loop, GIL management, and memory optimization.", 3.0, 1),
            ("react", "React 19 & Next.js Architecture", "frontend", "Server components, hooks, concurrent rendering, hydration, and bundle optimization.", 3.0, 1),
            ("docker", "Docker, Containerization & CI/CD", "devops", "Multi-stage builds, container lifecycle, layer caching, and orchestration.", 1.0, 0),
        ]
        cursor.executemany(
            "INSERT INTO skills (id, name, category, description, weight, is_critical) VALUES (?, ?, ?, ?, ?, ?)",
            initial_skills
        )

    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        initial_users = [
            ("cand-1", "aditya.verma@example.com", "Aditya Verma", "student", "Experienced", "Indian Institute of Information Technology (IIIT)", 2.5, 78, "bridgeable", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"),
            ("cand-2", "pooja.s@example.com", "Pooja Sundaram", "student", "Fresher", "National Institute of Technology (NIT) Trichy", 0.0, 91, "job_ready", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"),
            ("cand-3", "rahul.mehta@example.com", "Rahul Mehta", "student", "Fresher", "BITS Pilani", 0.5, 64, "mismatch", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80")
        ]
        cursor.executemany(
            "INSERT INTO users (id, email, full_name, role, user_class, college, experience_years, readiness_score, current_tier, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            initial_users
        )

    conn.commit()
    conn.close()

# Auto-initialize DB on import
init_db()
