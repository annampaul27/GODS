#!/usr/bin/env python
"""
Manual Trigger Script for FR-04: Deadlines & Strategic Application Notifications.
Runs the 21-day (3-week) advance warning calculation and outputs the alerts generated.
"""
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.workers.notification_worker import run_deadline_notifications_job

if __name__ == "__main__":
    print("=" * 65)
    print("MANUAL TRIGGER: FR-04 DEADLINE NOTIFICATION CRON WORKER")
    print("=" * 65)
    result = run_deadline_notifications_job()
    print("\nWorker Execution Summary:")
    print(f" • Reference Date           : {result['reference_date']}")
    print(f" • Target 3-Week Check Date : {result['target_3_week_date']}")
    print(f" • Matches Found            : {result['matches_found']}")
    print(f" • New Alerts Inserted      : {result['notifications_created']}")
    print("-" * 65)
    if result["details"]:
        print("Generated Alerts:")
        for idx, alert in enumerate(result["details"], 1):
            print(f" [{idx}] User: {alert['user_name']} ({alert['user_id']})")
            print(f"     Job : {alert['job_title']}")
            print(f"     Msg : {alert['message']}")
    else:
        print("No new notifications generated (all matching records are already alerted).")
    print("=" * 65)
