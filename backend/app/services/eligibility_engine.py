"""
Eligibility rule engine — transparent toy model using synthetic data only.

Design decisions:
- Rules are explicit Python functions, not a black-box model, so the
  rule_trace can be generated deterministically for borrower explanation.
- Thresholds are not exposed to the borrower to prevent gaming.
- The engine returns a result + a rule_trace; the trace contains only
  the plain-language explanation, never internal weights or thresholds.
- Gender, caste, religion, contacts, or location are never inputs.
"""

from dataclasses import dataclass
from decimal import Decimal
from enum import Enum

from app.services.loan_calculator import calculate_emi


class EligibilityResult(str, Enum):
    LIKELY_ELIGIBLE = "likely_eligible"
    NEEDS_REVIEW = "needs_review"
    NOT_PROGRESSED = "not_progressed"


@dataclass(frozen=True)
class RuleOutcome:
    result: str           # "pass" | "review" | "fail"
    plain: str            # Borrower-facing explanation — no jargon, no thresholds


@dataclass(frozen=True)
class EngineOutput:
    result: EligibilityResult
    estimated_emi: Decimal
    dti_ratio: Decimal
    risk_score: float
    rule_trace: dict[str, RuleOutcome]
    primary_reason: str   # Plain-language summary for the result screen


# ── Internal thresholds — never exposed to the borrower ──────────────────────

_MIN_INCOME = 10_000          # ₹ minimum monthly income
_MAX_DTI = Decimal("0.50")   # 50% DTI → not progressed
_REVIEW_DTI = Decimal("0.40") # 40–50% DTI → needs review
_MIN_TENURE_MONTHS = 3        # Employment tenure below this → review
_MAX_AMOUNT_INCOME_RATIO = 10 # Requested amount > 10× income → not progressed


def run_eligibility_check(
    monthly_income: int,
    employment_tenure_months: int,
    requested_amount: int,
    existing_monthly_emi: int,
    loan_tenure_months: int,
    prior_repayment: str = "none",
) -> EngineOutput:
    """
    Run the prototype eligibility rule engine.

    Returns an EngineOutput with result, computed values, and a rule_trace
    suitable for borrower display. The trace uses plain language only —
    internal thresholds are never included.

    Args:
        monthly_income: Stated monthly take-home income in ₹.
        employment_tenure_months: Months in current employment.
        requested_amount: Loan amount requested in ₹.
        existing_monthly_emi: Sum of existing monthly EMI obligations in ₹.
        loan_tenure_months: Requested repayment period in months.
        prior_repayment: Synthetic repayment history indicator.

    Returns:
        EngineOutput with result, metrics, and rule_trace.
    """
    emi_result = calculate_emi(
        principal=Decimal(str(requested_amount)),
        annual_rate=Decimal("18.00"),
        tenure_months=loan_tenure_months,
    )
    estimated_emi = emi_result.emi
    total_obligations = existing_monthly_emi + float(estimated_emi)
    dti_ratio = Decimal(str(total_obligations / monthly_income)) if monthly_income > 0 else Decimal("99")

    # ── Rule 1: Income check ─────────────────────────────────────────────────
    if monthly_income < _MIN_INCOME:
        income_rule = RuleOutcome(
            result="fail",
            plain="Your stated income does not meet the minimum required for this prototype.",
        )
    else:
        income_rule = RuleOutcome(
            result="pass",
            plain="Your income meets the minimum threshold for the requested amount.",
        )

    # ── Rule 2: Amount-to-income ratio ───────────────────────────────────────
    amount_ratio = requested_amount / monthly_income if monthly_income > 0 else 999
    if amount_ratio > _MAX_AMOUNT_INCOME_RATIO:
        amount_rule = RuleOutcome(
            result="fail",
            plain="The requested amount is significantly higher than your stated monthly income.",
        )
    else:
        amount_rule = RuleOutcome(
            result="pass",
            plain="The requested amount is within a reasonable range relative to your income.",
        )

    # ── Rule 3: DTI check ────────────────────────────────────────────────────
    if dti_ratio >= _MAX_DTI:
        dti_rule = RuleOutcome(
            result="fail",
            plain=(
                "Adding this loan's monthly payment to your existing obligations would "
                "result in a high repayment burden relative to your income."
            ),
        )
    elif dti_ratio >= _REVIEW_DTI:
        dti_rule = RuleOutcome(
            result="review",
            plain=(
                "Your total estimated monthly obligations, including this loan, "
                "are on the higher side. This application needs additional review."
            ),
        )
    else:
        dti_rule = RuleOutcome(
            result="pass",
            plain="Your estimated monthly obligations are within an acceptable range.",
        )

    # ── Rule 4: Employment tenure ─────────────────────────────────────────────
    if employment_tenure_months < _MIN_TENURE_MONTHS:
        tenure_rule = RuleOutcome(
            result="review",
            plain=(
                "Your employment tenure is short. "
                "This application may require additional information."
            ),
        )
    else:
        tenure_rule = RuleOutcome(
            result="pass",
            plain="Your employment tenure is sufficient for this prototype check.",
        )

    # ── Rule 5: Prior repayment (synthetic) ──────────────────────────────────
    if prior_repayment == "mixed":
        repayment_rule = RuleOutcome(
            result="review",
            plain="Your synthetic repayment history includes some missed payments. Additional review required.",
        )
    else:
        repayment_rule = RuleOutcome(
            result="pass",
            plain="No adverse repayment history in the synthetic dataset.",
        )

    rule_trace = {
        "income_check": income_rule,
        "amount_check": amount_rule,
        "dti_check": dti_rule,
        "tenure_check": tenure_rule,
        "repayment_check": repayment_rule,
    }

    # ── Aggregate result ──────────────────────────────────────────────────────
    # A single "fail" → not_progressed; show only the primary failing reason
    # Any "review" without "fail" → needs_review
    # All "pass" → likely_eligible

    failing_rules = [k for k, v in rule_trace.items() if v.result == "fail"]
    review_rules = [k for k, v in rule_trace.items() if v.result == "review"]

    if failing_rules:
        result = EligibilityResult.NOT_PROGRESSED
        # Show only the first failing rule's explanation — not a list that enables gaming
        primary_reason = rule_trace[failing_rules[0]].plain
    elif review_rules:
        result = EligibilityResult.NEEDS_REVIEW
        primary_reason = "We need to review a few aspects of your application before proceeding."
    else:
        result = EligibilityResult.LIKELY_ELIGIBLE
        primary_reason = (
            "Based on the information you entered, you may be eligible to apply. "
            "This is not a loan approval."
        )

    # Toy risk score: lower is better, 0.0 = clean, 1.0 = highest risk
    # Formula is a prototype assumption — never shown raw to the borrower
    risk_score = min(1.0, float(dti_ratio) * 0.6 + (0.2 if prior_repayment == "mixed" else 0.0))

    return EngineOutput(
        result=result,
        estimated_emi=estimated_emi,
        dti_ratio=dti_ratio,
        risk_score=risk_score,
        rule_trace={k: {"result": v.result, "plain": v.plain} for k, v in rule_trace.items()},
        primary_reason=primary_reason,
    )
