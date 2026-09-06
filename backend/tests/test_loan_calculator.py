"""
Tests for the loan calculator service.

All expected values verified manually against the reducing-balance formula.
These tests are the ground truth — if the calculator disagrees, fix the code.
"""

import pytest
from decimal import Decimal

from app.services.loan_calculator import (
    calculate_emi,
    build_amortisation_schedule,
    build_offer_summary,
)


class TestCalculateEmi:
    def test_priya_scenario(self):
        """Primary scenario: ₹30,000 at 18% for 12 months → ₹2,750.40."""
        result = calculate_emi(Decimal("30000"), Decimal("18"), 12)
        assert result.emi == Decimal("2750.40")

    def test_total_repayable(self):
        result = calculate_emi(Decimal("30000"), Decimal("18"), 12)
        assert result.total_repayable == Decimal("33004.80")

    def test_total_interest(self):
        result = calculate_emi(Decimal("30000"), Decimal("18"), 12)
        assert result.total_interest == Decimal("3004.80")

    def test_monthly_rate(self):
        """18% annual → 0.015 monthly."""
        result = calculate_emi(Decimal("30000"), Decimal("18"), 12)
        assert result.monthly_rate == Decimal("0.015")

    def test_zero_principal_raises(self):
        with pytest.raises(ValueError, match="Principal"):
            calculate_emi(Decimal("0"), Decimal("18"), 12)

    def test_negative_principal_raises(self):
        with pytest.raises(ValueError):
            calculate_emi(Decimal("-1000"), Decimal("18"), 12)

    def test_zero_rate_raises(self):
        with pytest.raises(ValueError, match="rate"):
            calculate_emi(Decimal("30000"), Decimal("0"), 12)

    def test_zero_tenure_raises(self):
        with pytest.raises(ValueError, match="Tenure"):
            calculate_emi(Decimal("30000"), Decimal("18"), 0)

    def test_single_month_tenure(self):
        """1-month loan: entire principal + 1 month's interest."""
        result = calculate_emi(Decimal("10000"), Decimal("12"), 1)
        # r = 0.01, EMI = 10000 * 0.01 * 1.01 / 0.01 = 10100.00
        assert result.emi == Decimal("10100.00")


class TestAmortisationSchedule:
    def test_schedule_length(self):
        result = calculate_emi(Decimal("30000"), Decimal("18"), 12)
        schedule = build_amortisation_schedule(result)
        assert len(schedule) == 12

    def test_month_1_interest(self):
        """Month 1 interest: 30000 × 0.015 = ₹450.00."""
        result = calculate_emi(Decimal("30000"), Decimal("18"), 12)
        schedule = build_amortisation_schedule(result)
        assert schedule[0].interest_component == Decimal("450.00")

    def test_month_1_principal(self):
        """Month 1 principal: 2750.40 − 450.00 = ₹2300.40."""
        result = calculate_emi(Decimal("30000"), Decimal("18"), 12)
        schedule = build_amortisation_schedule(result)
        assert schedule[0].principal_component == Decimal("2300.40")

    def test_final_balance_is_zero(self):
        """The closing balance on the last row must be exactly ₹0.00."""
        result = calculate_emi(Decimal("30000"), Decimal("18"), 12)
        schedule = build_amortisation_schedule(result)
        assert schedule[-1].closing_balance == Decimal("0.00")

    def test_interest_decreases_each_month(self):
        """On a reducing-balance loan, interest paid decreases each month."""
        result = calculate_emi(Decimal("30000"), Decimal("18"), 12)
        schedule = build_amortisation_schedule(result)
        interests = [row.interest_component for row in schedule]
        assert all(interests[i] > interests[i + 1] for i in range(len(interests) - 1))


class TestOfferSummary:
    def test_processing_fee_2pct(self):
        """2% of ₹30,000 = ₹600."""
        result = calculate_emi(Decimal("30000"), Decimal("18"), 12)
        summary = build_offer_summary(result)
        assert summary.processing_fee == Decimal("600.00")

    def test_total_cost_with_fee(self):
        """₹33,004.80 + ₹600 = ₹33,604.80."""
        result = calculate_emi(Decimal("30000"), Decimal("18"), 12)
        summary = build_offer_summary(result)
        assert summary.total_cost_with_fee == Decimal("33604.80")

    def test_prototype_labels_present(self):
        """Prototype labels must be non-empty strings — never stripped."""
        result = calculate_emi(Decimal("30000"), Decimal("18"), 12)
        summary = build_offer_summary(result)
        assert len(summary.processing_fee_note) > 0
        assert len(summary.apr_note) > 0
        assert "prototype" in summary.processing_fee_note.lower()
        assert "prototype" in summary.apr_note.lower()
