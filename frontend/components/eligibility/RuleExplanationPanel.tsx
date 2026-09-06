"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { clsx } from "clsx";
import type { RuleExplanation } from "@/lib/api";

interface RuleExplanationPanelProps {
  ruleExplanation: Record<string, RuleExplanation>;
}

const RULE_LABELS: Record<string, string> = {
  income_check: "Income check",
  amount_check: "Loan amount check",
  dti_check: "Repayment burden check",
  tenure_check: "Employment tenure check",
  repayment_check: "Repayment history check",
};

const RESULT_STYLES = {
  pass: "text-brand-700 bg-brand-50 border-brand-100",
  review: "text-warning-600 bg-warning-50 border-warning-200",
  fail: "text-danger-600 bg-danger-50 border-danger-200",
};

const RESULT_LABELS = {
  pass: "Passed",
  review: "Needs review",
  fail: "Not met",
};

/**
 * RuleExplanationPanel — shows borrower-safe rule outcomes.
 * Never exposes internal thresholds — only plain-language explanations.
 * AC-E5: raw weights never shown.
 */
export default function RuleExplanationPanel({
  ruleExplanation,
}: RuleExplanationPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50 transition-colors text-left"
      >
        <span className="text-sm font-medium text-slate-800">
          How is this calculated?
        </span>
        {open ? (
          <ChevronUp size={16} className="text-slate-500" aria-hidden="true" />
        ) : (
          <ChevronDown size={16} className="text-slate-500" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div className="border-t border-slate-200 p-4 flex flex-col gap-3 bg-slate-50">
          <p className="text-xs text-slate-500 mb-1">
            These are the prototype rules used in this check. Thresholds and
            weights are not shown — this prevents gaming and reflects how real
            lender models work.
          </p>

          {Object.entries(ruleExplanation).map(([key, outcome]) => (
            <div
              key={key}
              className={clsx(
                "rounded-lg border px-3 py-2.5",
                RESULT_STYLES[outcome.result]
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold">
                  {RULE_LABELS[key] || key}
                </span>
                <span className="text-xs font-medium">
                  {RESULT_LABELS[outcome.result]}
                </span>
              </div>
              <p className="text-xs leading-relaxed">{outcome.plain}</p>
            </div>
          ))}

          <p className="text-xs text-slate-500 border-t border-slate-200 pt-2">
            These rules are a prototype assumption and do not reflect any real
            lender&apos;s criteria.
          </p>
        </div>
      )}
    </div>
  );
}
