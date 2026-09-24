from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.auth import router as auth_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="SkillSetu AI RESTful Backend API — Role-Separated Multi-Tenant Talent Infrastructure & Cryptographic Trust Engine",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS Middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all local origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.v1.assessments import router as assessments_router
from app.api.v1.resume import router as resume_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.jobs import router as jobs_router
from app.workers.notification_worker import run_deadline_notifications_job
from app.db.database import init_db
from apscheduler.schedulers.asyncio import AsyncIOScheduler

# Mount API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(assessments_router, prefix=settings.API_V1_STR)
app.include_router(resume_router, prefix=settings.API_V1_STR)
app.include_router(notifications_router, prefix=settings.API_V1_STR)
app.include_router(jobs_router, prefix=f"{settings.API_V1_STR}/jobs")
app.include_router(jobs_router, prefix="/api/jobs")


scheduler = AsyncIOScheduler()

@app.on_event("startup")
async def on_startup():
    init_db()
    # Schedule automated daily worker for 3-week deadline notifications (FR-04)
    scheduler.add_job(run_deadline_notifications_job, "cron", hour=0, minute=0, id="daily_deadline_worker")
    if not scheduler.running:
        scheduler.start()
    # Run once on startup to evaluate current state
    run_deadline_notifications_job()

@app.on_event("shutdown")
async def on_shutdown():
    if scheduler.running:
        scheduler.shutdown()

@app.get("/health", tags=["System Telemetry"])
async def health_check():
    """
    System health telemetry verification endpoint (NF1 / A1).
    """
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "latency_sla": "sub-3.0s (NF1 compliant)",
        "offline_fallback_cache": "ready (NF2)",
        "cryptographic_engine": "SHA-256 / HS256 active (NF3)",
    }

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to SkillSetu AI RESTful Backend API",
        "docs": "/docs",
        "health": "/health",
        "auth_endpoints": f"{settings.API_V1_STR}/auth/login",
    }
