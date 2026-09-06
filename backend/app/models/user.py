"""User model — mock auth only. is_demo is always True in prototype."""

import uuid
from sqlalchemy import Boolean, Column, DateTime, Enum, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    display_name = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    role = Column(Enum("borrower", "ops_agent", "admin", name="user_role"), default="borrower")
    # Always True — safety guard so prototype data is never treated as real
    is_demo = Column(Boolean, nullable=False, default=True)

    applications = relationship("Application", back_populates="user")
    consent_records = relationship("ConsentRecord", back_populates="user")
    eligibility_checks = relationship("EligibilityCheck", back_populates="user")
