"""
Loan calculation service — pure functions, no DB calls.

Uses Python's Decimal throughout to avoid floating-point drift in EMI
calculations. The final month's principal component is adjusted to
eliminate any residual from rounding so the closing balance is exactly ₹0.

All outputs carry prototype labels when surfaced in API responses.
This module is the single source of truth for all monetary calculations.
"""

from dataclasses import dataclass
from decimal import ROUND_HALF_UP, Decimal


@dataclass(frozen=True)
class EmiResult:
    """Immutable output of a single EMI calculation."""
    principal: Decimal
    annual_rate: Decimal        # e.g. Decimal("18.00")
    monthly_rate: Decimal       # annual_rate / 12 / 100
    tenure_months: int
    emi: Decimal                # Monthly installment amount
    total_repayable: Decimal    # emi × tenure_months
    total_interest: Decimal     # total_repayable − principal


@dataclass(frozen=True)
class AmortisationRow:
    """One row in the amortisation schedule."""
    month: int
    emi: Decimal
    principal_component: Decimal
    interest_component: Decimal
    closing_balance: Decimal


@dataclass(frozen=True)
class OfferSummary:
    """Full prototype loan offer summary."""
    emi_result: EmiResult
    processing_fee: Decimal
    processing_fee_note: str      # Always carries a prototype label
    apr_prototype: Decimal
    apr_note: str                 # Always carries a prototype label
    total_cost_with_fee: Decimal
    amortisation_schedule: list[AmortisationRow]


def calculate_emi(
    principal: Decimal,
    annual_rate: Decimal,
    tenure_months: int,
) -> EmiResult:
    """
    Calculate EMI using the standard reducing-balance formula:
        EMI = P × r × (1+r)^n / [(1+r)^n − 1]

    Args:
        principal: Loan amount in ₹ (whole rupees, no paise).
        annual_rate: Annual interest rate as a percentage (e.g. Decimal("18.00")).
        tenure_months: Repayment period in months.

    Returns:
        EmiResult with all computed values.

    Raises:
        ValueError: If principal, rate, or tenure are zero or negative.

    Example:
        >>> result = calculate_emi(Decimal("30000"), Decimal("18"), 12)
        >>> float(result.emi)
        2750.40
    """
    if principal <= 0:
        raise ValueError("Principal must be greater than ₹0.")
    if annual_rate <= 0:
        raise ValueError("Annual interest rate must be greater than 0%.")
    if tenure_months <= 0:
        raise ValueError("Tenure must be at least 1 month.")

    monthly_rate = annual_rate / Decimal("1200")  # annual% / 12 / 100

    # (1 + r)^n computed with Decimal for precision
    compound = (1 + monthly_rate) ** tenure_months

    emi = (principal * monthly_rate * compound / (compound - 1)).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )

    total_repayable = (emi * tenure_months).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )
    total_interest = (total_repayable - principal).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )

    return EmiResult(
        principal=principal,
        annual_rate=annual_rate,
        monthly_rate=monthly_rate,
        tenure_months=tenure_months,
        emi=emi,
        total_repayable=total_repayable,
        total_interest=total_interest,
    )


def build_amortisation_schedule(emi_result: EmiResult) -> list[AmortisationRow]:
    """
    Generate a month-by-month amortisation breakdown.

    The last month's principal component is adjusted to absorb any
    rounding residual — guaranteeing closing_balance == 0 on the
    final row regardless of how many decimal places accumulated.

    Args:
        emi_result: Output of calculate_emi().

    Returns:
        List of AmortisationRow, length == emi_result.tenure_months.
    """
    schedule: list[AmortisationRow] = []
    balance = emi_result.principal
    r = emi_result.monthly_rate

    for month in range(1, emi_result.tenure_months + 1):
        interest_component = (balance * r).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )
        principal_component = emi_result.emi - interest_component

        # Final month: adjust principal to kill any floating residual
        if month == emi_result.tenure_months:
            principal_component = balance
            closing_balance = Decimal("0.00")
        else:
            closing_balance = (balance - principal_component).quantize(
                Decimal("0.01"), rounding=ROUND_HALF_UP
            )

        schedule.append(AmortisationRow(
            month=month,
            emi=emi_result.emi,
            principal_component=principal_component,
            interest_component=interest_component,
            closing_balance=closing_balance,
        ))
        balance = closing_balance

    return schedule


def build_offer_summary(
    emi_result: EmiResult,
    processing_fee_pct: Decimal = Decimal("0.02"),
) -> OfferSummary:
    """
    Combine an EMI result with prototype fee assumptions to produce a
    full offer summary suitable for display on the transparent offer screen.

    Processing fee and APR are prototype assumptions. Both carry explicit
    labels that must be surfaced in the UI — never strip these labels.

    Args:
        emi_result: Output of calculate_emi().
        processing_fee_pct: Fee as a decimal fraction (default 0.02 = 2%).
                            This is a prototype assumption.

    Returns:
        OfferSummary with full cost breakdown and amortisation schedule.
    """
    processing_fee = (emi_result.principal * processing_fee_pct).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )

    # Prototype APR: annualised effective rate including the processing fee.
    # This is a simplified calculation and not a regulatory APR figure.
    fee_as_rate = (processing_fee / emi_result.principal) * Decimal("100")
    apr_prototype = (emi_result.annual_rate + fee_as_rate).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )

    total_cost_with_fee = (emi_result.total_repayable + processing_fee).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )

    schedule = build_amortisation_schedule(emi_result)

    return OfferSummary(
        emi_result=emi_result,
        processing_fee=processing_fee,
        processing_fee_note=(
            f"{int(processing_fee_pct * 100)}% of loan principal. "
            "Prototype assumption — not a real fee schedule."
        ),
        apr_prototype=apr_prototype,
        apr_note=(
            "Prototype APR includes the processing fee annualised over the loan tenure. "
            "Actual APR from a real lender will differ and must be disclosed per RBI guidelines."
        ),
        total_cost_with_fee=total_cost_with_fee,
        amortisation_schedule=schedule,
    )
