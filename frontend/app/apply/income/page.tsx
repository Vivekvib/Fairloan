"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FieldWithReason from "@/components/shared/FieldWithReason";
import Button from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface IncomeForm {
  employment_type: string;
  employer_name: string;
  monthly_income: string;
  employment_tenure_months: string;
  existing_monthly_emi: string;
}

interface IncomeErrors {
  employment_type?: string;
  monthly_income?: string;
  employment_tenure_months?: string;
  existing_monthly_emi?: string;
}

export default function IncomePage() {
  const router = useRouter();
  const [form, setForm] = useState<IncomeForm>({
    employment_type: "",
    employer_name: "",
    monthly_income: "",
    employment_tenure_months: "",
    existing_monthly_emi: "0",
  });
  const [errors, setErrors] = useState<IncomeErrors>({});

  const set = (field: keyof IncomeForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm(p => ({ ...p, [field]: e.target.value }));
      setErrors(p => ({ ...p, [field]: undefined }));
    };

  const validate = (): IncomeErrors => {
    const e: IncomeErrors = {};
    if (!form.employment_type) e.employment_type = "Please select your employment type.";
    if (!form.monthly_income || Number(form.monthly_income) <= 0)
      e.monthly_income = "Please enter a monthly income greater than ₹0.";
    if (form.employment_tenure_months === "" || Number(form.employment_tenure_months) < 0)
      e.employment_tenure_months = "Please enter months in current job (0 or more).";
    if (Number(form.existing_monthly_emi) < 0)
      e.existing_monthly_emi = "Existing EMI cannot be negative.";
    return e;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    sessionStorage.setItem("income_data", JSON.stringify(form));
    router.push("/apply/loan");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-10 items-start">

      {/* Left — sticky context */}
      <div className="lg:sticky lg:top-20 flex flex-col gap-4">
        <div>
          <p className="text-xs font-medium text-blue-600 mb-1 uppercase tracking-wide">Step 3 of 5</p>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Income & employment</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Used only to assess affordability. No real salary data is collected — this is a prototype.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-800 mb-2">Why we ask this</p>
          <ul className="text-xs text-blue-700 space-y-1.5">
            <li>📊 Income → monthly EMI affordability check</li>
            <li>📅 Tenure → employment stability indicator</li>
            <li>💳 Existing EMI → debt-to-income ratio</li>
          </ul>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
          <p className="text-xs text-slate-500">
            <strong>Prototype:</strong> Do not enter real employer name or income.
            Use synthetic values only.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-col gap-5">

        {/* Employment type */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="employment_type" className="text-sm font-medium text-slate-800">
            Employment type <span className="text-red-500">*</span>
          </label>
          <select
            id="employment_type"
            value={form.employment_type}
            onChange={set("employment_type")}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select type</option>
            <option value="salaried">Salaried</option>
            <option value="self_employed">Self-employed</option>
            <option value="contract">Contract / Freelance</option>
          </select>
          {errors.employment_type && (
            <p className="text-xs text-red-600">{errors.employment_type}</p>
          )}
        </div>

        {/* Employer name — synthetic only */}
        <FieldWithReason
          id="employer_name"
          label="Employer name (synthetic — do not use real name)"
          reason="Used as a contextual label in the prototype only. In a real flow, employer verification is a standard step."
          placeholder="e.g. Acme Corp"
          value={form.employer_name}
          onChange={set("employer_name")}
        />

        <FieldWithReason
          id="monthly_income"
          label="Monthly take-home income"
          isNumeric
          required
          placeholder="28000"
          suffix="₹ / month"
          reason="Used to calculate whether the EMI is affordable relative to your income."
          value={form.monthly_income}
          onChange={set("monthly_income")}
          error={errors.monthly_income}
        />

        <FieldWithReason
          id="employment_tenure_months"
          label="Time in current job"
          isNumeric
          required
          placeholder="18"
          suffix="months"
          reason="Tenure is a stability indicator in the prototype eligibility model."
          value={form.employment_tenure_months}
          onChange={set("employment_tenure_months")}
          error={errors.employment_tenure_months}
        />

        <FieldWithReason
          id="existing_monthly_emi"
          label="Existing monthly EMI obligations"
          isNumeric
          placeholder="0"
          suffix="₹ / month"
          helpText="Enter 0 if you have no existing loans or EMIs."
          reason="Added to your new EMI to calculate total monthly repayment burden (debt-to-income ratio)."
          value={form.existing_monthly_emi}
          onChange={set("existing_monthly_emi")}
          error={errors.existing_monthly_emi}
        />

        <div className="flex flex-wrap gap-3 pt-2">
          <Button size="lg" onClick={handleNext} className="flex-1 sm:flex-none">
            Save and continue <ArrowRight size={16} className="ml-2"/>
          </Button>
          <Button variant="secondary" size="lg" onClick={() => router.back()}>
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
}
