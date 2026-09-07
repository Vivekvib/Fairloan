"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FieldWithReason from "@/components/shared/FieldWithReason";
import Button from "@/components/ui/button";
import { calculateEmi, formatRupee } from "@/lib/emi";
import { ANNUAL_INTEREST_RATE } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

const PURPOSES = [
  { value: "medical",   label: "Medical emergency" },
  { value: "education", label: "Education or skill development" },
  { value: "home",      label: "Home repair or improvement" },
  { value: "personal",  label: "Personal expense" },
  { value: "other",     label: "Other" },
];

const TENURES = [6, 12, 18, 24, 36];

export default function LoanConfigPage() {
  const router = useRouter();
  const [amount, setAmount]   = useState("");
  const [tenure, setTenure]   = useState("12");
  const [purpose, setPurpose] = useState("");
  const [errors, setErrors]   = useState<Record<string, string>>({});

  const preview = calculateEmi(Number(amount), ANNUAL_INTEREST_RATE, Number(tenure));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!amount || Number(amount) <= 0) e.amount = "Please enter a loan amount.";
    if (Number(amount) > 1_000_000)     e.amount = "Maximum prototype amount is ₹10,00,000.";
    if (!purpose)                        e.purpose = "Please select a purpose.";
    return e;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    sessionStorage.setItem("loan_data", JSON.stringify({ amount, tenure, purpose }));
    router.push("/apply/documents");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-10 items-start">

      {/* Left — live preview (sticky) */}
      <div className="lg:sticky lg:top-20 flex flex-col gap-4">
        <div>
          <p className="text-xs font-medium text-blue-600 mb-1 uppercase tracking-wide">Step 4 of 5</p>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Loan details</h1>
          <p className="text-sm text-slate-500">Configure your loan and see the live cost breakdown.</p>
        </div>

        {/* Live cost preview — updates as user types */}
        <div className="bg-[#0f1f3d] rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-blue-300 font-medium">Live cost estimate</p>
            <span className="text-xs bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg px-2 py-0.5">
              Prototype · {ANNUAL_INTEREST_RATE}% p.a.
            </span>
          </div>

          {preview ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Monthly EMI",    value: formatRupee(preview.emi) },
                  { label: "Total interest", value: formatRupee(preview.totalInterest) },
                  { label: "Processing fee", value: formatRupee(preview.processingFee) },
                  { label: "Total cost",     value: formatRupee(preview.totalCostWithFee) },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-xs text-blue-300 mb-0.5">{label}</p>
                    <p className="text-sm font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-blue-400/50 text-center">
                Reducing-balance formula · Preview only · Not a real offer
              </p>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-blue-300/50 text-sm">Enter a loan amount to see cost breakdown</p>
            </div>
          )}
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-col gap-5">

        <FieldWithReason
          id="loan_amount"
          label="Loan amount"
          isNumeric
          required
          placeholder="30000"
          suffix="₹"
          reason="The principal amount you receive. Interest is calculated on the reducing balance each month."
          value={amount}
          onChange={e => { setAmount(e.target.value); setErrors(p => ({ ...p, amount: "" })); }}
          error={errors.amount}
        />

        {/* Tenure */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-800">Repayment period</label>
          <div className="grid grid-cols-5 gap-2">
            {TENURES.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTenure(String(t))}
                className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                  tenure === String(t)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-700 border-slate-300 hover:border-blue-400"
                }`}
              >
                {t}m
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500">Longer tenure = lower EMI, higher total interest.</p>
        </div>

        {/* Purpose */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="purpose" className="text-sm font-medium text-slate-800">
            Purpose of loan <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 items-start">
            <select
              id="purpose"
              value={purpose}
              onChange={e => { setPurpose(e.target.value); setErrors(p => ({ ...p, purpose: "" })); }}
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select purpose</option>
              {PURPOSES.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-slate-500">
            Purpose helps categorise the application. You are not required to provide details.
          </p>
          {errors.purpose && <p className="text-xs text-red-600">{errors.purpose}</p>}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button size="lg" onClick={handleNext} className="flex-1 sm:flex-none">
            Save and continue <ArrowRight size={16} className="ml-2"/>
          </Button>
          <Button variant="secondary" size="lg" onClick={() => router.back()}>Go back</Button>
        </div>
      </div>
    </div>
  );
}
