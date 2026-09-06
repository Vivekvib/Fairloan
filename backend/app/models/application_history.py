"""
Application status history — immutable audit trail.
Never updated; only inserted. Supports Phase 2 ops dashboard.
"""

import uuid
from sqlalchemy import Column, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base

_STATUS_ENUM = Enum(
    "draft", "submitted", "under_review",
    "approved", "rejected", "cancelled", "disbursed",
    name="app_status_history_enum"
)


class ApplicationStatusHistory(Base):
    __tablename__ = "application_status_history"

    history_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String(36), ForeignKey("applications.application_id"), nullable=False)
    from_status = Column(_STATUS_ENUM, nullable=True)   # NULL for the initial "created" event
    to_status = Column(_STATUS_ENUM, nullable=False)
    changed_at = Column(DateTime(timezone=True), server_default=func.now())
    changed_by = Column(String(36), nullable=True)       # user_id of agent, or "system"
    change_reason = Column(String(500), nullable=True)   # Plain-language reason shown to borrower
    system_note = Column(Text, nullable=True)             # Internal note — never shown to borrower

    application = relationship("Application", back_populates="status_history")
