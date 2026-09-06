"""
Eligibility check — stores inputs, computed values, result, and rule trace.
rule_trace is shown to the borrower in plain language; raw weights are never exposed.
"""

import uuid
from sqlalchemy import Column, DateTime, Enum, Float, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class EligibilityCheck(Base):
    __tablename__ = "eligibility_checks"

    check_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    # save_token lets the user resume their application without creating an account
    save_token = Column(String(36), nullable=False, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=True)
    checked_at = Column(DateTime(timezone=True), server_default=func.now())

    # Synthetic inputs — no real financial data
    monthly_income = Column(Integer, nullable=False)
    employment_tenure_months = Column(Integer, nullable=False)
    requested_amount = Column(Integer, nullable=False)
    existing_monthly_emi = Column(Integer, nullable=False, default=0)
    loan_tenure_months = Column(Integer, nullable=False, default=12)

    # Computed values
    estimated_emi = Column(Float, nullable=False)
    dti_ratio = Column(Float, nullable=False)
    completeness_score = Column(Float, nullable=False, default=1.0)

    prior_repayment = Column(
        Enum("good", "mixed", "none", name="prior_repayment_enum"),
        default="none"
    )
    risk_score = Column(Float, nullable=True)  # 0.0–1.0 toy score, never shown raw

    result = Column(
        Enum("likely_eligible", "needs_review", "not_progressed", name="eligibility_result"),
        nullable=False
    )

    # JSON: { "income_check": { "result": "pass", "plain": "..." }, ... }
    # The "plain" field is what gets shown to the borrower
    rule_trace = Column(JSON, nullable=False)

    user = relationship("User", back_populates="eligibility_checks")
    applications = relationship("Application", back_populates="eligibility_check")
