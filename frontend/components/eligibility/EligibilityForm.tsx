"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import FieldWithReason from "@/components/shared/FieldWithReason";
import LiveEmiPreview from "./LiveEmiPreview";
import Button from "@/components/ui/button";
import { checkEligibility } from "@/lib/api";
import { CREDIT_CHECK_NOTE } from "@/lib/constants";
import { ShieldCheck } from "lucide-react";

interface FormState {
  monthly_income: string;
  employment_tenure_months: string;
  requested_amount: string;
  existing_monthly_emi: string;
  loan_tenure_months: string;
}

interface FormErrors {
  monthly_income?: string;
  employment_tenure_months?: string;
  requested_amount?: string;
  existing_monthly_emi?: string;
  loan_tenure_months?: string;
  _form?: string;
}

const TENURE_OPTIONS = [6, 12, 18, 24, 36];

export default function EligibilityForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    monthly_income: "",
    employment_tenure_months: "",
    requested_amount: "",
    existing_monthly_emi: "0",
    loan_tenure_months: "12",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  // Track whether form was started for analytics (fire-and-forget)
  const [started, setStarted] = useState(false);

  const handleChange = useCallback(
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (!started) {
        setStarted(true);
        // AC: track eligibility_form_started event
      }
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear field error on change
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [started]
  );

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    const income = Number(form.monthly_income);
    const tenure = Number(form.employment_tenure_months);
    const amount = Number(form.requested_amount);
    const emi = Number(form.existing_monthly_emi);

    if (!form.monthly_income || income <= 0)
      errs.monthly_income = "Please enter a monthly income greater than ₹0.";
    if (form.employment_tenure_months === "" || tenure < 0)
      errs.employment_tenure_months = "Please enter your employment tenure in months (0 or more).";
    if (!form.requested_amount || amount <= 0)
      errs.requested_amount = "Please enter the loan amount you need.";
    if (amount > 1_000_000)
      errs.requested_amount = "Prototype loan amount cannot exceed ₹10,00,000.";
    if (emi < 0)
      errs.existing_monthly_emi = "Existing EMI cannot be negative.";
    if (income > 0 && emi >= income)
      errs.existing_monthly_emi =
        "Your existing obligations already meet or exceed your stated income. Please check the values.";

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Move focus to first error — AC-9 (accessibility)
      const firstErrorKey = Object.keys(errs)[0] as keyof FormErrors;
      document.getElementById(firstErrorKey)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const result = await checkEligibility({
        monthly_income: Number(form.monthly_income),
        employment_tenure_months: Number(form.employment_tenure_months),
        requested_amount: Number(form.requested_amount),
        existing_monthly_emi: Number(form.existing_monthly_emi),
        loan_tenure_months: Number(form.loan_tenure_months),
      });

      // Store result in sessionStorage so the result page can read it
      sessionStorage.setItem("eligibility_result", JSON.stringify(result));
      router.push("/eligibility/result");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong on our side. Please try again.";
      setErrors({
        _form:
          "Something went wrong on our side. Your inputs have not been saved. Please try again.",
      });
      console.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const principal = Number(form.requested_amount) || 0;
  const tenure = Number(form.loan_tenure_months) || 12;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Eligibility pre-check form"
      className="flex flex-col gap-6"
    >
      {/* Credit check note — AC-E1 */}
      <div
        role="note"
        className="flex gap-2 bg-brand-50 border border-brand-100 rounded-xl px-4 py-3"
      >
        <ShieldCheck
          size={16}
          className="text-brand-700 shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <p className="text-xs text-brand-800">{CREDIT_CHECK_NOTE}</p>
      </div>

      {/* Income */}
      <FieldWithReason
        id="monthly_income"
        label="Monthly take-home income (₹)"
        type="number"
        min="1"
        inputMode="numeric"
        required
        placeholder="e.g. 28000"
        reason="We use your income to check whether the loan repayment would be affordable. We do not store your real salary information — this is a prototype using synthetic data."
        value={form.monthly_income}
        onChange={handleChange("monthly_income")}
        error={errors.monthly_income}
      />

      {/* Employment tenure */}
      <FieldWithReason
        id="employment_tenure_months"
        label="How long have you been in your current job? (months)"
        type="number"
        min="0"
        inputMode="numeric"
        required
        placeholder="e.g. 18"
        reason="Employment tenure is one of the inputs in the prototype eligibility model. Shorter tenure doesn't automatically disqualify you — it may trigger a review."
        value={form.employment_tenure_months}
        onChange={handleChange("employment_tenure_months")}
        error={errors.employment_tenure_months}
      />

      {/* Loan amount */}
      <FieldWithReason
        id="requested_amount"
        label="How much do you need to borrow? (₹)"
        type="number"
        min="1"
        max="1000000"
        inputMode="numeric"
        required
        placeholder="e.g. 30000"
        reason="This is the loan principal — the amount you receive. We use it to calculate your monthly EMI and total repayment cost."
        value={form.requested_amount}
        onChange={handleChange("requested_amount")}
        error={errors.requested_amount}
      />

      {/* Loan tenure */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="loan_tenure_months"
          className="text-sm font-medium text-slate-800"
        >
          Repayment period{" "}
          <span className="text-slate-500 font-normal">(months)</span>
        </label>
        <select
          id="loan_tenure_months"
          value={form.loan_tenure_months}
          onChange={handleChange("loan_tenure_months")}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {TENURE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t} months
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500">
          Longer tenure = lower EMI, higher total interest. The preview below
          updates as you change this.
        </p>
      </div>

      {/* Existing EMI */}
      <FieldWithReason
        id="existing_monthly_emi"
        label="Existing monthly EMI obligations (₹)"
        type="number"
        min="0"
        inputMode="numeric"
        placeholder="0"
        helpText="Enter 0 if you have no existing loans or EMIs."
        reason="We add your existing obligations to the new EMI to calculate your total monthly repayment burden. This is called a debt-to-income check."
        value={form.existing_monthly_emi}
        onChange={handleChange("existing_monthly_emi")}
        error={errors.existing_monthly_emi}
      />

      {/* Live EMI preview — AC-E3 */}
      {principal > 0 && tenure > 0 && (
        <LiveEmiPreview principal={principal} tenureMonths={tenure} />
      )}

      {/* Form-level error — AC-10 (backend unavailable) */}
      {errors._form && (
        <div role="alert" aria-live="assertive" className="rounded-xl bg-danger-50 border border-danger-200 px-4 py-3">
          <p className="text-sm text-danger-600">{errors._form}</p>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="w-full"
      >
        {submitting ? "Checking eligibility…" : "Check my eligibility"}
      </Button>

      <p className="text-xs text-center text-slate-500">
        No account required. You&apos;ll receive a reference number to resume
        later.
      </p>
    </form>
  );
}
