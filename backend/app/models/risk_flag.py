"""
Risk flags — Phase 2 ops dashboard.
One flag per issue per application. Ops agents resolve flags with notes.
"""

import uuid
from sqlalchemy import Column, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class RiskFlag(Base):
    __tablename__ = "risk_flags"

    flag_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String(36), ForeignKey("applications.application_id"), nullable=False)

    flag_type = Column(
        Enum(
            "high_dti",
            "low_income",
            "incomplete_docs",
            "prior_repayment_mixed",
            "manual_review_required",
            name="risk_flag_type"
        ),
        nullable=False
    )

    flagged_at = Column(DateTime(timezone=True), server_default=func.now())
    flagged_by = Column(Enum("system", "ops_agent", name="flag_source"), nullable=False)

    resolved_at = Column(DateTime(timezone=True), nullable=True)
    resolution_note = Column(String(500), nullable=True)

    application = relationship("Application", back_populates="risk_flags")
