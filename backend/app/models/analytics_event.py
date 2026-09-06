"""
Analytics events — session-scoped, not user-linked by default.
Privacy-by-design: funnel metrics do not require linking events to a user identity.
"""

import uuid
from sqlalchemy import Boolean, Column, DateTime, JSON, String
from sqlalchemy.sql import func

from app.core.database import Base


class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    event_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    # session_id is generated client-side per browser session — no user linkage
    session_id = Column(String(36), nullable=False, index=True)
    event_name = Column(String(100), nullable=False, index=True)
    occurred_at = Column(DateTime(timezone=True), server_default=func.now())
    # e.g. { "screen": "loan_offer", "time_on_screen_sec": 42 }
    properties = Column(JSON, nullable=True)
    # Always True in prototype — prevents accidental real-data ingestion
    is_demo = Column(Boolean, nullable=False, default=True)
