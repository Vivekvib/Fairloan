"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";
import SaveTokenDisplay from "@/components/shared/SaveTokenDisplay";
import RuleExplanationPanel from "@/components/eligibility/RuleExplanationPanel";
import type { EligibilityResponse } from "@/lib/api";

// Result state configuration — avoids a large conditional render block
const RESULT_CONFIG = {
  likely_eligible: {
    icon: CheckCircle2,
    iconClass: "text-brand-600",
    bgClass: "bg-brand-50 border-brand-200",
    headline: "You may be eligible to apply.",
    // AC-E6: no shame language, no urgency, no dark patterns
    subtext:
      "Based on the information you entered, this prototype check did not find any issues. This is not a loan approval — it is a preliminary check using prototype rules only.",
    primaryCta: { label: "Start your application", href: "/apply/consent" },
    secondaryCta: null,
  },
  needs_review: {
    icon: Clock,
    iconClass: "text-warning-600",
    bgClass: "bg-warning-50 border-warning-200",
    headline: "We need a little more information.",
    subtext:
      "One or more aspects of your entry are near the boundary of our prototype criteria. You can continue to a full application — no decision has been made yet.",
    primaryCta: { label: "Continue anyway", href: "/apply/consent" },
    secondaryCta: { label: "Go back and adjust", href: "/eligibility/check" },
  },
  not_progressed: {
    icon: XCircle,
    iconClass: "text-danger-600",
    bgClass: "bg-danger-50 border-danger-200",
    headline: "This prototype would not progress your application at this stage.",
    subtext:
      "Based on the information entered, the prototype rules did not progress this application. This is not a real credit decision and has not affected any credit bureau record.",
    primaryCta: { label: "Return to home", href: "/" },
    secondaryCta: null,
  },
};

export default function EligibilityResultPage() {
  const [result, setResult] = useState<EligibilityResponse | null>(null);

  useEffect(() => {
    // Read result written by EligibilityForm before redirect
    const stored = sessionStorage.getItem("eligibility_result");
    if (stored) {
      setResult(JSON.parse(stored));
      // Move focus to the result heading for screen readers — AC-9
      document.getElementById("result-heading")?.focus();
    }
  }, []);

  if (!result) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-slate-500 text-sm">
        No eligibility result found.{" "}
        <Link href="/eligibility/check" className="text-brand-700 underline">
          Run the check
        </Link>
        .
      </div>
    );
  }

  const config = RESULT_CONFIG[result.result];
  const Icon = config.icon;

  return (
    <div className="max-w-xl mx-auto px-4 py-12 flex flex-col gap-6">
      {/* Result card */}
      <div
        className={`rounded-2xl border p-6 flex flex-col gap-4 ${config.bgClass}`}
      >
        <div className="flex items-start gap-3">
          <Icon
            size={28}
            className={`${config.iconClass} shrink-0 mt-0.5`}
            aria-hidden="true"
          />
          <div>
            <h1
              id="result-heading"
              tabIndex={-1}
              className="text-xl font-bold text-slate-900 mb-1 focus:outline-none"
            >
              {config.headline}
            </h1>
            <p className="text-sm text-slate-700 leading-relaxed">
              {config.subtext}
            </p>
          </div>
        </div>

        {/* Primary reason for not_progressed and needs_review — AC-E4 */}
        {result.result !== "likely_eligible" && (
          <div className="bg-white rounded-xl px-4 py-3 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
              Primary reason
            </p>
            <p className="text-sm text-slate-800">{result.primary_reason}</p>
          </div>
        )}
      </div>

      {/* Prototype disclaimer — AC-E5 */}
      <div
        role="note"
        className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
      >
        <p className="text-xs text-amber-800">{result.prototype_disclaimer}</p>
      </div>

      {/* Rule explanation panel — AC-6 */}
      <RuleExplanationPanel ruleExplanation={result.rule_explanation} />

      {/* Save token — AC-7 */}
      <SaveTokenDisplay token={result.save_token} />

      {/* CTAs */}
      <div className="flex flex-col gap-3">
        <Link href={config.primaryCta.href}>
          <Button size="lg" className="w-full">
            {config.primaryCta.label}
            <ArrowRight size={18} className="ml-2" aria-hidden="true" />
          </Button>
        </Link>

        {config.secondaryCta && (
          <Link href={config.secondaryCta.href}>
            <Button variant="secondary" size="lg" className="w-full">
              {config.secondaryCta.label}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
