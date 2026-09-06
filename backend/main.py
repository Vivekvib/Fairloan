"""
FairLoan API — entry point.

Registers all routers and configures CORS. The app is intentionally thin here;
all business logic lives in services/, not in routers or here.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine
from app.routers import eligibility, applications, offers, consent, support, analytics

# Create all tables on startup for SQLite dev convenience.
# In production, Alembic migrations handle schema changes — this line is a no-op
# if the tables already exist.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FairLoan API",
    description=(
        "Educational fintech prototype API. "
        "Synthetic data only. Not a real lending product."
    ),
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prefix all routes with /api/v1 so the frontend can version its calls
app.include_router(eligibility.router, prefix="/api/v1/eligibility", tags=["Eligibility"])
app.include_router(applications.router, prefix="/api/v1/applications", tags=["Applications"])
app.include_router(offers.router, prefix="/api/v1/offers", tags=["Offers"])
app.include_router(consent.router, prefix="/api/v1/consent", tags=["Consent"])
app.include_router(support.router, prefix="/api/v1/support", tags=["Support"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])


@app.get("/health")
def health_check():
    """Lightweight liveness probe for deployment platforms."""
    return {"status": "ok", "prototype": True}
