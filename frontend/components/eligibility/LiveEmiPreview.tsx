"use client";

import { calculateEmi, formatRupee } from "@/lib/emi";
import { ANNUAL_INTEREST_RATE, PROCESSING_FEE_NOTE } from "@/lib/constants";

interface LiveEmiPreviewProps {
  principal: number;
  tenureMonths: number;
}

/**
 * LiveEmiPreview — updates in real-time as the user types.
 * Shows EMI, total repayable, and total interest so the user can
 * understand the cost before they submit the eligibility check.
 *
 * Product principle P1: comprehension before conversion.
 */
export default function LiveEmiPreview({
  principal,
  tenureMonths,
}: LiveEmiPreviewProps) {
  const result = calculateEmi(principal, ANNUAL_INTEREST_RATE, tenureMonths);

  if (!result) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Live loan cost estimate"
      className="bg-brand-50 border border-brand-100 rounded-xl p-4 flex flex-col gap-3"
    >
      <p className="text-xs font-semibold text-brand-800 uppercase tracking-wide">
        Estimated cost preview
      </p>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Monthly EMI" value={formatRupee(result.emi)} highlight />
        <Stat label="Total repayable" value={formatRupee(result.totalRepayable)} />
        <Stat label="Total interest" value={formatRupee(result.totalInterest)} />
        <Stat label="Processing fee" value={formatRupee(result.processingFee)} />
      </div>

      <p className="text-xs text-slate-500 border-t border-brand-100 pt-2">
        Based on {ANNUAL_INTEREST_RATE}% p.a. reducing balance.{" "}
        {PROCESSING_FEE_NOTE} This is a preview only — the final offer may differ.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? "text-brand-700" : "text-slate-800"}`}>
        {value}
      </p>
    </div>
  );
}
