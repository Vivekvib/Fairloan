"""Tests for the eligibility rule engine — boundary conditions and all three states."""

import pytest
from app.services.eligibility_engine import run_eligibility_check, EligibilityResult


class TestEligibilityResults:
    def test_priya_likely_eligible(self):
        """Priya's scenario should pass all rules."""
        output = run_eligibility_check(28000, 18, 30000, 0, 12)
        assert output.result == EligibilityResult.LIKELY_ELIGIBLE

    def test_low_income_not_progressed(self):
        """Income below minimum threshold → not_progressed."""
        output = run_eligibility_check(5000, 12, 20000, 0, 12)
        assert output.result == EligibilityResult.NOT_PROGRESSED

    def test_high_amount_ratio_not_progressed(self):
        """Requested amount > 10× income → not_progressed."""
        output = run_eligibility_check(15000, 12, 200000, 0, 24)
        assert output.result == EligibilityResult.NOT_PROGRESSED

    def test_high_dti_not_progressed(self):
        """DTI ≥ 50% → not_progressed."""
        output = run_eligibility_check(20000, 12, 80000, 8000, 12)
        assert output.result == EligibilityResult.NOT_PROGRESSED

    def test_review_dti_range(self):
        """DTI in review range (40–50%) → needs_review.
        
        Inputs chosen so DTI lands between _REVIEW_DTI (0.40) and _MAX_DTI (0.50).
        Income=30000, existing_emi=5000, requested=50000@18%/24m → EMI≈2497
        Total obligations ≈ 7497, DTI ≈ 0.25 — too low.
        Use income=18000, existing_emi=4000, requested=30000@18%/12m → EMI≈2750
        Total obligations ≈ 6750, DTI ≈ 0.375 — still below review band.
        Use income=15000, existing_emi=3000, requested=25000@18%/12m → EMI≈2292
        Total ≈ 5292, DTI ≈ 0.353 — still below.
        Target: income=14000, existing=3000, amount=20000/12m → EMI≈1834
        Total ≈ 4834, DTI ≈ 0.345.
        Use income=12000, existing=2500, amount=25000/12m → EMI≈2292
        Total ≈ 4792, DTI ≈ 0.399 — just below review.
        Use income=12000, existing=3000, amount=25000/12m → total≈5292, DTI≈0.441 ✓
        """
        output = run_eligibility_check(12000, 12, 25000, 3000, 12)
        assert output.result == EligibilityResult.NEEDS_REVIEW

    def test_short_tenure_review(self):
        """Employment tenure < 3 months → needs_review (not an automatic rejection)."""
        output = run_eligibility_check(30000, 1, 20000, 0, 12)
        assert output.result == EligibilityResult.NEEDS_REVIEW

    def test_mixed_repayment_review(self):
        """Prior repayment = mixed → at minimum needs_review."""
        output = run_eligibility_check(30000, 12, 20000, 0, 12, prior_repayment="mixed")
        assert output.result in (EligibilityResult.NEEDS_REVIEW, EligibilityResult.NOT_PROGRESSED)


class TestRuleTrace:
    def test_rule_trace_keys_present(self):
        """rule_trace must contain all five rule keys."""
        output = run_eligibility_check(28000, 18, 30000, 0, 12)
        expected_keys = {"income_check", "amount_check", "dti_check", "tenure_check", "repayment_check"}
        assert set(output.rule_trace.keys()) == expected_keys

    def test_rule_trace_has_plain_language(self):
        """Every rule outcome must have a non-empty plain-language explanation."""
        output = run_eligibility_check(28000, 18, 30000, 0, 12)
        for key, outcome in output.rule_trace.items():
            assert len(outcome["plain"]) > 0, f"Rule '{key}' has no plain-language explanation."

    def test_no_thresholds_in_plain(self):
        """Internal thresholds must not appear in borrower-facing rule_trace."""
        output = run_eligibility_check(8000, 2, 50000, 3000, 12)
        for outcome in output.rule_trace.values():
            assert "10000" not in outcome["plain"], "Threshold leaked into plain-language output."
            assert "0.50" not in outcome["plain"]
            assert "50%" not in outcome["plain"]


class TestEdgeCases:
    def test_existing_emi_equals_income(self):
        """When existing EMI already exceeds income, DTI is extreme → not_progressed."""
        output = run_eligibility_check(20000, 12, 30000, 20000, 12)
        assert output.result == EligibilityResult.NOT_PROGRESSED

    def test_risk_score_range(self):
        """Risk score must always be between 0.0 and 1.0."""
        for income, amount in [(5000, 200000), (50000, 10000), (28000, 30000)]:
            output = run_eligibility_check(income, 12, amount, 0, 12)
            assert 0.0 <= output.risk_score <= 1.0
