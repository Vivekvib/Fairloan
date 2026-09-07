"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, XCircle, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import Button from "@/components/ui/button";
import SaveTokenDisplay from "@/components/shared/SaveTokenDisplay";
import type { EligibilityResponse } from "@/lib/api";

const RESULT_CONFIG = {
  likely_eligible: {
    icon: CheckCircle2, iconClass: "text-blue-500",
    bgClass: "bg-blue-50 border-blue-200",
    headline: "You may be eligible to apply.",
    subtext: "Preliminary check passed. This is not a loan approval — prototype rules only.",
    primaryCta: { label: "Start your application", href: "/apply/consent" },
    secondaryCta: null,
  },
  needs_review: {
    icon: Clock, iconClass: "text-amber-500",
    bgClass: "bg-amber-50 border-amber-200",
    headline: "We need a little more information.",
    subtext: "One or more inputs are near a threshold. You can continue — no decision made yet.",
    primaryCta: { label: "Continue anyway", href: "/apply/consent" },
    secondaryCta: { label: "Go back and adjust", href: "/eligibility/check" },
  },
  not_progressed: {
    icon: XCircle, iconClass: "text-red-500",
    bgClass: "bg-red-50 border-red-200",
    headline: "This prototype would not progress your application.",
    subtext: "Not a real credit decision. This has not affected any credit bureau record.",
    primaryCta: { label: "Return to home", href: "/" },
    secondaryCta: null,
  },
};

const RULE_LABELS: Record<string, string> = {
  income_check: "Income check",
  amount_check: "Loan amount check",
  dti_check: "Repayment burden",
  tenure_check: "Employment tenure",
  repayment_check: "Repayment history",
};

export default function EligibilityResultPage() {
  const [result, setResult] = useState<EligibilityResponse | null>(null);
  const [rulesOpen, setRulesOpen] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("eligibility_result");
    if (stored) setResult(JSON.parse(stored));
  }, []);

  if (!result) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center text-slate-500 text-sm">
        No result found.{" "}
        <Link href="/eligibility/check" className="text-blue-600 underline">Run the check</Link>
      </div>
    );
  }

  const config = RESULT_CONFIG[result.result];
  const Icon = config.icon;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-4">

      {/* Result card */}
      <div className={`rounded-2xl border p-5 flex gap-4 items-start ${config.bgClass}`}>
        <Icon size={24} className={`${config.iconClass} shrink-0 mt-0.5`} aria-hidden="true"/>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-slate-900 mb-1">{config.headline}</h1>
          <p className="text-sm text-slate-600">{config.subtext}</p>
          {result.result !== "likely_eligible" && (
            <div className="mt-3 bg-white/70 rounded-xl px-3 py-2 border border-white">
              <p className="text-xs font-semibold text-slate-500 mb-0.5 uppercase tracking-wide">Primary reason</p>
              <p className="text-sm text-slate-800">{result.primary_reason}</p>
            </div>
          )}
        </div>
      </div>

      {/* Rule explanation — collapsible */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <button
          onClick={() => setRulesOpen(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors text-left"
          aria-expanded={rulesOpen}
        >
          <span className="text-sm font-medium text-slate-800">How is this calculated?</span>
          {rulesOpen
            ? <ChevronUp size={15} className="text-slate-400"/>
            : <ChevronDown size={15} className="text-slate-400"/>}
        </button>

        {rulesOpen && (
          <div className="border-t border-slate-100 px-4 py-3 flex flex-col gap-2 bg-slate-50">
            <p className="text-xs text-slate-400 mb-1">
              Thresholds not shown — prevents gaming. These are prototype rules only.
            </p>
            {Object.entries(result.rule_explanation).map(([key, outcome]) => (
              <div key={key} className={`rounded-xl px-3 py-2 border text-xs ${
                outcome.result === "pass"   ? "bg-blue-50 border-blue-100 text-blue-800" :
                outcome.result === "review" ? "bg-amber-50 border-amber-100 text-amber-800" :
                                              "bg-red-50 border-red-100 text-red-800"
              }`}>
                <div className="flex justify-between mb-0.5">
                  <span className="font-semibold">{RULE_LABELS[key] || key}</span>
                  <span className="capitalize">{outcome.result}</span>
                </div>
                <p>{outcome.plain}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save token */}
      <SaveTokenDisplay token={result.save_token} />

      {/* Prototype disclaimer — compact */}
      <p className="text-xs text-slate-400 text-center px-4">
        {result.prototype_disclaimer}
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <Link href={config.primaryCta.href}>
          <Button size="md">
            {config.primaryCta.label} <ArrowRight size={15} className="ml-1.5"/>
          </Button>
        </Link>
        {config.secondaryCta && (
          <Link href={config.secondaryCta.href}>
            <Button variant="secondary" size="md">{config.secondaryCta.label}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
