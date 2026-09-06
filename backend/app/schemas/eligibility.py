"""Pydantic schemas for eligibility check request and response."""

from decimal import Decimal
from typing import Literal
from pydantic import BaseModel, Field, field_validator


class EligibilityCheckRequest(BaseModel):
    monthly_income: int = Field(..., gt=0, description="Monthly take-home income in ₹")
    employment_tenure_months: int = Field(..., ge=0, description="Months in current employment")
    requested_amount: int = Field(..., gt=0, description="Loan amount requested in ₹")
    existing_monthly_emi: int = Field(0, ge=0, description="Sum of existing EMI obligations in ₹")
    loan_tenure_months: int = Field(12, ge=1, le=60, description="Repayment period in months")

    @field_validator("requested_amount")
    @classmethod
    def amount_must_be_reasonable(cls, v: int) -> int:
        """Cap at ₹10L for the prototype — not a real lending limit."""
        if v > 1_000_000:
            raise ValueError("Prototype loan amount cannot exceed ₹10,00,000.")
        return v


class RuleExplanation(BaseModel):
    result: Literal["pass", "review", "fail"]
    plain: str


class EligibilityCheckResponse(BaseModel):
    check_id: str
    save_token: str
    result: Literal["likely_eligible", "needs_review", "not_progressed"]
    primary_reason: str
    estimated_emi: float
    dti_ratio: float
    rule_explanation: dict[str, RuleExplanation]
    prototype_disclaimer: str = (
        "This is a prototype result using synthetic rules. "
        "It is not a credit assessment and does not affect any credit bureau record."
    )
    checked_at: str
