"""
Application — the core entity of the lending flow.
document_social_friction_acknowledged tracks that we warned the user
about salary-slip employer visibility before asking for the document.
"""

import uuid
from sqlalchemy import Boolean, Column, DateTime, Enum, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Application(Base):
    __tablename__ = "applications"

    application_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    save_token = Column(String(36), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=True)
    eligibility_id = Column(String(36), ForeignKey("eligibility_checks.check_id"), nullable=True)
    consent_id = Column(String(36), ForeignKey("consent_records.consent_id"), nullable=True)

    status = Column(
        Enum(
            "draft", "submitted", "under_review",
            "approved", "rejected", "cancelled", "disbursed",
            name="application_status"
        ),
        nullable=False,
        default="draft"
    )

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    last_updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Loan configuration
    loan_amount = Column(Integer, nullable=False)
    loan_tenure_months = Column(Integer, nullable=False)
    loan_purpose_category = Column(
        Enum("medical", "education", "home", "personal", "other", name="loan_purpose"),
        nullable=False
    )

    # Employment — synthetic only
    employment_type = Column(
        Enum("salaried", "self_employed", "contract", name="employment_type"),
        nullable=False
    )
    monthly_income = Column(Integer, nullable=False)
    existing_monthly_emi = Column(Integer, nullable=False, default=0)

    # Document checklist — mock filenames only, no real file storage
    doc_checklist = Column(JSON, nullable=True)
    missing_fields = Column(JSON, nullable=True)  # For ops dashboard Phase 2

    # Tracks that we showed the salary-slip employer-visibility warning
    # before asking for the document — product principle P2 compliance
    document_social_friction_acknowledged = Column(Boolean, nullable=False, default=False)

    # Safety guard
    is_demo = Column(Boolean, nullable=False, default=True)

    user = relationship("User", back_populates="applications")
    eligibility_check = relationship("EligibilityCheck", back_populates="applications")
    consent_record = relationship("ConsentRecord", back_populates="applications")
    status_history = relationship("ApplicationStatusHistory", back_populates="application")
    loan_offer = relationship("LoanOffer", back_populates="application", uselist=False)
    risk_flags = relationship("RiskFlag", back_populates="application")
