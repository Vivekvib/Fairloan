"""
Eligibility router — POST /api/v1/eligibility/check

Validates inputs, runs the rule engine, persists the result, and returns
a borrower-safe response. The rule_trace stored in DB contains plain language
only — thresholds and weights are never persisted or returned.
"""

from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends

from app.core.database import get_db
from app.models.eligibility import EligibilityCheck
from app.schemas.eligibility import EligibilityCheckRequest, EligibilityCheckResponse
from app.services.eligibility_engine import run_eligibility_check

router = APIRouter()


@router.post("/check", response_model=EligibilityCheckResponse)
def check_eligibility(
    payload: EligibilityCheckRequest,
    db: Session = Depends(get_db),
):
    """
    Run the prototype eligibility check.

    Does not require authentication — a save_token is returned for
    anonymous resume. No PII is collected at this stage.
    """
    output = run_eligibility_check(
        monthly_income=payload.monthly_income,
        employment_tenure_months=payload.employment_tenure_months,
        requested_amount=payload.requested_amount,
        existing_monthly_emi=payload.existing_monthly_emi,
        loan_tenure_months=payload.loan_tenure_months,
    )

    record = EligibilityCheck(
        monthly_income=payload.monthly_income,
        employment_tenure_months=payload.employment_tenure_months,
        requested_amount=payload.requested_amount,
        existing_monthly_emi=payload.existing_monthly_emi,
        loan_tenure_months=payload.loan_tenure_months,
        estimated_emi=float(output.estimated_emi),
        dti_ratio=float(output.dti_ratio),
        risk_score=output.risk_score,
        result=output.result.value,
        rule_trace=output.rule_trace,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return EligibilityCheckResponse(
        check_id=record.check_id,
        save_token=record.save_token,
        result=output.result.value,
        primary_reason=output.primary_reason,
        estimated_emi=float(output.estimated_emi),
        dti_ratio=float(output.dti_ratio),
        rule_explanation=output.rule_trace,
        checked_at=record.checked_at.isoformat(),
    )


@router.get("/{check_id}")
def get_eligibility_result(check_id: str, db: Session = Depends(get_db)):
    """Retrieve a previously run eligibility check by its ID."""
    record = db.query(EligibilityCheck).filter(
        EligibilityCheck.check_id == check_id
    ).first()
    if not record:
        from app.core.exceptions import NotFoundError
        raise NotFoundError("Eligibility check")
    return record
