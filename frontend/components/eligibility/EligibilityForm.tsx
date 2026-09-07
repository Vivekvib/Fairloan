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

  // Item 0: isNumeric=true on all monetary fields — no type="number" anywhere
  const handleChange = useCallback(
    (field: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      },
    []
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
        "Your existing obligations already meet or exceed your stated income.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0] as keyof FormErrors;
      document.getElementById(firstKey)?.focus();
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
      sessionStorage.setItem("eligibility_result", JSON.stringify(result));
      router.push("/eligibility/result");
    } catch {
      setErrors({
        _form: "Something went wrong on our side. Your inputs have not been saved. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const principal = Number(form.requested_amount) || 0;
  const tenure = Number(form.loan_tenure_months) || 12;

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Eligibility pre-check form"
      className="flex flex-col gap-6">

      {/* Credit check disclaimer */}
      <div role="note"
        className="flex gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <ShieldCheck size={16} className="text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-blue-800">{CREDIT_CHECK_NOTE}</p>
      </div>

      {/* Item 0: isNumeric=true — type="text" + inputMode="numeric", no scroll-jacking */}
      <FieldWithReason
        id="monthly_income"
        label="Monthly take-home income"
        isNumeric
        required
        placeholder="28000"
        suffix="₹ / month"
        reason="We use your income to check whether the loan repayment would be affordable. No real salary data is collected — this is a prototype."
        value={form.monthly_income}
        onChange={handleChange("monthly_income")}
        error={errors.monthly_income}
      />

      <FieldWithReason
        id="employment_tenure_months"
        label="Time in current job"
        isNumeric
        required
        placeholder="18"
        suffix="months"
        reason="Employment tenure is one input in the prototype eligibility model. Short tenure may trigger review — not automatic rejection."
        value={form.employment_tenure_months}
        onChange={handleChange("employment_tenure_months")}
        error={errors.employment_tenure_months}
      />

      <FieldWithReason
        id="requested_amount"
        label="How much do you need to borrow"
        isNumeric
        required
        placeholder="30000"
        suffix="₹"
        reason="This is the loan principal. We use it to calculate your monthly EMI and total repayment cost."
        value={form.requested_amount}
        onChange={handleChange("requested_amount")}
        error={errors.requested_amount}
      />

      {/* Tenure select — Item 2: one filled CTA */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="loan_tenure_months" className="text-sm font-medium text-slate-800">
          Repayment period
        </label>
        <select
          id="loan_tenure_months"
          value={form.loan_tenure_months}
          onChange={handleChange("loan_tenure_months")}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {TENURE_OPTIONS.map((t) => (
            <option key={t} value={t}>{t} months</option>
          ))}
        </select>
        <p className="text-xs text-slate-500">
          Longer tenure = lower EMI, higher total interest.
        </p>
      </div>

      <FieldWithReason
        id="existing_monthly_emi"
        label="Existing monthly EMI obligations"
        isNumeric
        placeholder="0"
        suffix="₹ / month"
        helpText="Enter 0 if you have no existing loans or EMIs."
        reason="We add your existing obligations to the new EMI to calculate your total monthly repayment burden — this is a debt-to-income check."
        value={form.existing_monthly_emi}
        onChange={handleChange("existing_monthly_emi")}
        error={errors.existing_monthly_emi}
      />

      {/* Live preview */}
      {principal > 0 && tenure > 0 && (
        <LiveEmiPreview principal={principal} tenureMonths={tenure} />
      )}

      {errors._form && (
        <div role="alert" aria-live="assertive"
          className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-600">{errors._form}</p>
        </div>
      )}

      {/* Item 2: single filled primary CTA */}
      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? "Checking eligibility…" : "Check my eligibility"}
      </Button>

      <p className="text-xs text-center text-slate-500">
        No account required. You'll get a reference number to resume later.
      </p>
    </form>
  );
}
