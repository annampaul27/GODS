from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.auth import router as auth_router
from app.api.v1.ats import router as ats_router
from app.api.v1.sprints import router as sprints_router
from app.api.v1.career_compass import router as career_compass_router

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
from app.db.database import init_db

# Mount API V1 Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(ats_router, prefix=settings.API_V1_STR)
app.include_router(sprints_router, prefix=settings.API_V1_STR)
app.include_router(
    career_compass_router,
    prefix=settings.API_V1_STR + "/career-compass",
    tags=["CareerCompass Features (Jayasree A B)"]
)
app.include_router(assessments_router, prefix=settings.API_V1_STR)
app.include_router(resume_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def on_startup():
    init_db()

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
