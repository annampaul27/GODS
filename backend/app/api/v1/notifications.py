from fastapi import APIRouter, HTTPException, status, Query, Body, Depends
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import uuid
import json

from app.db.database import get_db_connection
from app.workers.notification_worker import run_deadline_notifications_job

router = APIRouter(prefix="/notifications", tags=["FR-04 Deadlines & Notifications"])

@router.get("")
async def get_user_notifications(
    user_id: Optional[str] = Query("cand-1", description="User ID to fetch notifications for")
):
    """
    Fetch unread and read notifications for a given candidate/user.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = """
    SELECT 
        n.id,
        n.user_id,
        n.job_id,
        n.message,
        n.notification_type,
        n.is_read,
        n.trigger_date,
        n.created_at,
        j.title as job_title,
        j.application_deadline,
        j.opening_date,
        j.location as job_location,
        j.salary_range
    FROM user_notifications n
    LEFT JOIN jobs j ON n.job_id = j.id
    WHERE n.user_id = ?
    ORDER BY n.created_at DESC
    """
    cursor.execute(query, (user_id,))
    rows = cursor.fetchall()
    
    notifications = []
    unread_count = 0
    for r in rows:
        is_read_bool = bool(r["is_read"])
        if not is_read_bool:
            unread_count += 1
            
        notifications.append({
            "id": r["id"],
            "user_id": r["user_id"],
            "job_id": r["job_id"],
            "job_title": r["job_title"] or "Target Opportunity",
            "message": r["message"],
            "notification_type": r["notification_type"],
            "is_read": is_read_bool,
            "trigger_date": r["trigger_date"],
            "application_deadline": r["application_deadline"],
            "opening_date": r["opening_date"],
            "location": r["job_location"],
            "created_at": r["created_at"],
        })
        
    conn.close()
    
    return {
        "user_id": user_id,
        "unread_count": unread_count,
        "total_count": len(notifications),
        "notifications": notifications
    }

@router.patch("/{notification_id}/read")
async def mark_notification_as_read(notification_id: str):
    """
    Mark a notification as read (updates is_read to 1).
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, is_read FROM user_notifications WHERE id = ?", (notification_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Notification with id '{notification_id}' not found"
        )
        
    cursor.execute("UPDATE user_notifications SET is_read = 1 WHERE id = ?", (notification_id,))
    conn.commit()
    conn.close()
    
    return {
        "success": True,
        "id": notification_id,
        "is_read": True,
        "message": "Notification marked as read"
    }

@router.post("/mark-all-read")
async def mark_all_notifications_as_read(
    payload: Dict[str, Any] = Body(default={"user_id": "cand-1"})
):
    """
    Mark all notifications for a given user as read.
    """
    user_id = payload.get("user_id", "cand-1")
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("UPDATE user_notifications SET is_read = 1 WHERE user_id = ?", (user_id,))
    updated_count = cursor.rowcount
    conn.commit()
    conn.close()
    
    return {
        "success": True,
        "user_id": user_id,
        "updated_count": updated_count,
        "message": f"Marked {updated_count} notifications as read"
    }

@router.post("/trigger-cron")
async def trigger_cron_worker():
    """
    Manually trigger the 3-week deadline and opening notification worker.
    """
    result = run_deadline_notifications_job()
    return result

@router.get("/jobs")
async def list_jobs():
    """
    List all platform jobs with their opening dates and application deadlines.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    SELECT 
        id, org_id, title, department, location, type, experience_min_years,
        salary_range, description, pass_threshold, opening_date, application_deadline,
        status, created_at
    FROM jobs
    ORDER BY created_at DESC
    """)
    rows = cursor.fetchall()
    
    jobs = [dict(r) for r in rows]
    conn.close()
    return {"jobs": jobs, "count": len(jobs)}

@router.post("/jobs/mock-deadline")
async def create_mock_job_with_deadline(
    title: str = Body("Lead Distributed Systems Engineer", embed=True),
    days_from_now: int = Body(21, embed=True),
    user_id: str = Body("cand-1", embed=True),
):
    """
    Convenience endpoint to inject a mock job with a deadline exactly N days from now (defaults to 21)
    and save it for a candidate for instant verification.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    now = datetime.now()
    deadline = now + timedelta(days=days_from_now)
    job_id = f"job-mock-{uuid.uuid4().hex[:8]}"
    save_id = f"save-{uuid.uuid4().hex[:8]}"
    
    cursor.execute("""
    INSERT INTO jobs (
        id, org_id, title, department, location, type, experience_min_years,
        salary_range, description, pass_threshold, opening_date, application_deadline,
        critical_skills_json, optional_skills_json, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        job_id,
        "org-acme",
        title,
        "Infrastructure Engineering",
        "Bengaluru / Hybrid",
        "Full-Time",
        3.0,
        "₹32,00,000 - ₹44,00,000",
        "Spearhead high-throughput distributed database replication and consensus engines.",
        85,
        now.strftime("%Y-%m-%d %H:%M:%S"),
        deadline.strftime("%Y-%m-%d %H:%M:%S"),
        json.dumps([{"id": "python", "name": "Python Core", "weight": 3.0}]),
        json.dumps([{"id": "docker", "name": "Docker", "weight": 1.0}]),
        "active"
    ))
    
    cursor.execute("INSERT OR IGNORE INTO saved_jobs (id, user_id, job_id) VALUES (?, ?, ?)", (save_id, user_id, job_id))
    
    conn.commit()
    conn.close()
    
    return {
        "success": True,
        "job_id": job_id,
        "title": title,
        "application_deadline": deadline.strftime("%Y-%m-%d %H:%M:%S"),
        "days_from_now": days_from_now,
        "user_id": user_id,
        "message": f"Mock job created and saved for {user_id}. Ready for cron worker run."
    }
