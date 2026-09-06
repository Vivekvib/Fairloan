"""Repayment schedule — one row per installment. Read-only in MVP."""

import uuid
from sqlalchemy import Column, DateTime, Enum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Repayment(Base):
    __tablename__ = "repayments"

    repayment_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    offer_id = Column(String(36), ForeignKey("loan_offers.offer_id"), nullable=False)
    installment_no = Column(Integer, nullable=False)   # 1-based
    due_date = Column(DateTime(timezone=True), nullable=False)  # Synthetic
    amount_due = Column(Float, nullable=False)
    amount_paid = Column(Float, nullable=True)         # NULL until paid (synthetic action)
    paid_at = Column(DateTime(timezone=True), nullable=True)

    status = Column(
        Enum("upcoming", "paid", "overdue", "waived", name="repayment_status"),
        nullable=False,
        default="upcoming"
    )

    # Late fee is a prototype assumption — always labelled as such on screen
    late_fee_applied = Column(Float, nullable=False, default=0.0)

    loan_offer = relationship("LoanOffer", back_populates="repayments")
