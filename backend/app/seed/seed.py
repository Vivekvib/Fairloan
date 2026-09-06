"""
Synthetic seed data — 5 borrower profiles covering all eligibility states.
Run with: python -m app.seed.seed

All data is synthetic. is_demo=True on every record.
No real PAN, Aadhaar, bank, or salary data is used.
"""

from decimal import Decimal
from app.core.database import SessionLocal, engine
from app.core.database import Base
from app.models.user import User
from app.models.eligibility import EligibilityCheck
from app.services.eligibility_engine import run_eligibility_check


# Import all models so Base.metadata knows about them
from app.models import (  # noqa: F401
    user, consent, eligibility, application,
    application_history, loan_offer, repayment,
    risk_flag, support_contact, analytics_event
)

SYNTHETIC_PROFILES = [
    {
        "display_name": "Priya S.",          # Provisional persona — research-informed
        "monthly_income": 28000,
        "employment_tenure_months": 18,
        "requested_amount": 30000,
        "existing_monthly_emi": 0,
        "loan_tenure_months": 12,
        "expected_result": "likely_eligible",
    },
    {
        "display_name": "Rohan K.",           # High DTI — needs review
        "monthly_income": 22000,
        "employment_tenure_months": 6,
        "requested_amount": 80000,
        "existing_monthly_emi": 5000,
        "loan_tenure_months": 24,
        "expected_result": "needs_review",
    },
    {
        "display_name": "Aman T.",            # Low income — not progressed
        "monthly_income": 8000,
        "employment_tenure_months": 2,
        "requested_amount": 50000,
        "existing_monthly_emi": 3000,
        "loan_tenure_months": 12,
        "expected_result": "not_progressed",
    },
    {
        "display_name": "Divya M.",           # Clean profile — likely eligible
        "monthly_income": 45000,
        "employment_tenure_months": 36,
        "requested_amount": 50000,
        "existing_monthly_emi": 2000,
        "loan_tenure_months": 18,
        "expected_result": "likely_eligible",
    },
    {
        "display_name": "Suresh P.",          # High amount-to-income — not progressed
        "monthly_income": 15000,
        "employment_tenure_months": 12,
        "requested_amount": 200000,
        "existing_monthly_emi": 0,
        "loan_tenure_months": 24,
        "expected_result": "not_progressed",
    },
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Avoid re-seeding on repeated runs
        existing = db.query(User).filter(User.is_demo == True).count()
        if existing > 0:
            print(f"Seed data already present ({existing} demo users). Skipping.")
            return

        for profile in SYNTHETIC_PROFILES:
            user = User(display_name=profile["display_name"], role="borrower", is_demo=True)
            db.add(user)
            db.flush()

            output = run_eligibility_check(
                monthly_income=profile["monthly_income"],
                employment_tenure_months=profile["employment_tenure_months"],
                requested_amount=profile["requested_amount"],
                existing_monthly_emi=profile["existing_monthly_emi"],
                loan_tenure_months=profile["loan_tenure_months"],
            )

            check = EligibilityCheck(
                user_id=user.user_id,
                monthly_income=profile["monthly_income"],
                employment_tenure_months=profile["employment_tenure_months"],
                requested_amount=profile["requested_amount"],
                existing_monthly_emi=profile["existing_monthly_emi"],
                loan_tenure_months=profile["loan_tenure_months"],
                estimated_emi=float(output.estimated_emi),
                dti_ratio=float(output.dti_ratio),
                risk_score=output.risk_score,
                result=output.result.value,
                rule_trace=output.rule_trace,
            )
            db.add(check)

            actual = output.result.value
            expected = profile["expected_result"]
            status = "✓" if actual == expected else f"✗ (expected {expected})"
            print(f"  {profile['display_name']:15} → {actual:20} {status}")

        db.commit()
        print("\nSeed complete.")

    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    print("Seeding FairLoan prototype database with synthetic data...\n")
    seed()
