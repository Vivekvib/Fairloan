"""
Consent record — captures what the user agreed to and when.
Separates necessary from optional consent per product principle P2.
"""

import uuid
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, JSON, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class ConsentRecord(Base):
    __tablename__ = "consent_records"

    consent_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=True)
    consent_version = Column(String(20), nullable=False, default="v1.0")
    captured_at = Column(DateTime(timezone=True), server_default=func.now())

    # Stored as JSON dicts: { "identity_check": true, "affordability_check": true }
    necessary_consents = Column(JSON, nullable=False)
    optional_consents = Column(JSON, nullable=False, default=dict)

    # Hashed — never store raw IP or UA (privacy-by-design)
    ip_hash = Column(String(64), nullable=True)
    user_agent_hash = Column(String(64), nullable=True)

    # Populated if user withdraws optional consent after the fact
    withdrawn_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="consent_records")
    applications = relationship("Application", back_populates="consent_record")
