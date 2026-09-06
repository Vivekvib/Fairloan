"""
Loan offer — all monetary values stored as Float (display only).
Calculations are done in Python Decimal in the service layer;
results are cast to Float for storage.

kfs_confirmed_at: timestamp when user confirmed reading the Key Facts Statement.
Tracks the borrower-protection metric: "KFS shown and confirmed before acceptance."
"""

import uuid
from sqlalchemy import Column, DateTime, Enum, Float, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class LoanOffer(Base):
    __tablename__ = "loan_offers"

    offer_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String(36), ForeignKey("applications.application_id"), nullable=False)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())

    # Monetary fields — all in ₹
    principal = Column(Integer, nullable=False)
    annual_interest_rate = Column(Float, nullable=False)
    apr_prototype = Column(Float, nullable=False)      # Labelled as prototype estimate
    processing_fee = Column(Integer, nullable=False)
    processing_fee_pct = Column(Float, nullable=False)
    tenure_months = Column(Integer, nullable=False)

    # Computed — calculated in service layer using Decimal, stored as Float
    emi_amount = Column(Float, nullable=False)
    total_interest = Column(Float, nullable=False)
    total_repayable = Column(Float, nullable=False)
    total_cost_with_fee = Column(Float, nullable=False)

    first_emi_date = Column(DateTime(timezone=True), nullable=True)  # Synthetic
    amortisation_schedule = Column(JSON, nullable=True)               # Full schedule as JSON

    status = Column(
        Enum("pending_acceptance", "accepted", "rejected", "expired", name="offer_status"),
        nullable=False,
        default="pending_acceptance"
    )

    accepted_at = Column(DateTime(timezone=True), nullable=True)
    # KFS confirmation timestamp — borrower-protection metric
    kfs_confirmed_at = Column(DateTime(timezone=True), nullable=True)
    offer_version = Column(Integer, nullable=False, default=1)

    application = relationship("Application", back_populates="loan_offer")
    repayments = relationship("Repayment", back_populates="loan_offer")
