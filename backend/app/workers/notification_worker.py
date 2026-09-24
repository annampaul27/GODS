import sys
import os
import uuid
import logging
from datetime import datetime, timedelta, date
from typing import Optional, Dict, Any, List

# Ensure parent directory is in python path when run as script
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.abspath(os.path.join(current_dir, "..", ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.db.database import get_db_connection

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("notification_worker")

def run_deadline_notifications_job(reference_date: Optional[date] = None) -> Dict[str, Any]:
    """
    FR-04 3-Week (21-Day) Deadline & Strategic Application Notification Worker.
    
    Logic:
    - Calculates target_date = reference_date (defaults to today) + 21 days (3 weeks).
    - Queries SQLite database for any saved jobs where application_deadline or opening_date
      matches target_date.
    - Generates user_notifications records with formatted action messages.
    """
    if reference_date is None:
        reference_date = datetime.now().date()
        
    target_date = reference_date + timedelta(days=21)
    target_date_str = target_date.strftime("%Y-%m-%d")
    current_date_str = reference_date.strftime("%Y-%m-%d")
    
    logger.info("=" * 60)
    logger.info("Executing FR-04 Strategic Notification Worker")
    logger.info(f"System Reference Date : {current_date_str}")
    logger.info(f"Target 3-Week Date     : {target_date_str} (Exactly 21 days ahead)")
    logger.info("=" * 60)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Query saved jobs matching either application_deadline or opening_date exactly 21 days out
    query = """
    SELECT 
        s.user_id,
        u.email,
        u.full_name as user_name,
        j.id as job_id,
        j.title as job_title,
        j.application_deadline,
        j.opening_date,
        date(j.application_deadline) as deadline_date,
        date(j.opening_date) as opening_date_only
    FROM saved_jobs s
    JOIN jobs j ON s.job_id = j.id
    JOIN users u ON s.user_id = u.id
    WHERE date(j.application_deadline) = ? OR date(j.opening_date) = ?
    """
    
    cursor.execute(query, (target_date_str, target_date_str))
    matches = cursor.fetchall()
    
    created_count = 0
    notifications_created = []
    
    for row in matches:
        user_id = row["user_id"]
        job_id = row["job_id"]
        job_title = row["job_title"]
        deadline_date = row["deadline_date"]
        opening_date_only = row["opening_date_only"]
        
        # Check if deadline is exactly 21 days out
        if deadline_date == target_date_str:
            notification_type = "deadline_warning"
            # Format: Action Required: The application window for [Job Title] closes in exactly 3 weeks on [Date].
            message = (
                f"Action Required: The application window for {job_title} "
                f"closes in exactly 3 weeks on {deadline_date}."
            )
            
            notif_id = f"notif-{uuid.uuid4().hex[:12]}"
            try:
                cursor.execute("""
                INSERT OR IGNORE INTO user_notifications (
                    id, user_id, job_id, message, notification_type, is_read, trigger_date
                ) VALUES (?, ?, ?, ?, ?, 0, ?)
                """, (notif_id, user_id, job_id, message, notification_type, current_date_str))
                
                if cursor.rowcount > 0:
                    created_count += 1
                    notifications_created.append({
                        "id": notif_id,
                        "user_id": user_id,
                        "user_name": row["user_name"],
                        "job_id": job_id,
                        "job_title": job_title,
                        "type": notification_type,
                        "message": message,
                        "trigger_date": current_date_str
                    })
                    logger.info(f"Generated alert for {row['user_name']} ({user_id}): {message}")
                else:
                    logger.info(f"Duplicate alert skipped for user {user_id} and job {job_id} on {current_date_str}")
            except Exception as e:
                logger.error(f"Error inserting notification: {e}")
                
        # Check if opening date is exactly 21 days out
        if opening_date_only == target_date_str:
            notification_type = "opening_warning"
            message = (
                f"Upcoming Opportunity: The application window for {job_title} "
                f"opens in exactly 3 weeks on {opening_date_only}."
            )
            notif_id = f"notif-{uuid.uuid4().hex[:12]}"
            try:
                cursor.execute("""
                INSERT OR IGNORE INTO user_notifications (
                    id, user_id, job_id, message, notification_type, is_read, trigger_date
                ) VALUES (?, ?, ?, ?, ?, 0, ?)
                """, (notif_id, user_id, job_id, message, notification_type, current_date_str))
                
                if cursor.rowcount > 0:
                    created_count += 1
                    notifications_created.append({
                        "id": notif_id,
                        "user_id": user_id,
                        "user_name": row["user_name"],
                        "job_id": job_id,
                        "job_title": job_title,
                        "type": notification_type,
                        "message": message,
                        "trigger_date": current_date_str
                    })
                    logger.info(f"Generated opening alert for {row['user_name']} ({user_id}): {message}")
            except Exception as e:
                logger.error(f"Error inserting opening notification: {e}")

    conn.commit()
    conn.close()
    
    logger.info(f"Summary: Matches Found: {len(matches)}, Notifications Created: {created_count}")
    return {
        "status": "success",
        "reference_date": current_date_str,
        "target_3_week_date": target_date_str,
        "matches_found": len(matches),
        "notifications_created": created_count,
        "details": notifications_created
    }

if __name__ == "__main__":
    result = run_deadline_notifications_job()
    print("\n--- CLI RUNNER RESULT ---")
    print(f"Status: {result['status']}")
    print(f"Reference Date: {result['reference_date']}")
    print(f"Target Date (3 weeks ahead): {result['target_3_week_date']}")
    print(f"Matches Found: {result['matches_found']}")
    print(f"Notifications Created: {result['notifications_created']}")
    for notif in result["details"]:
        print(f" -> [{notif['user_name']}] {notif['message']}")
