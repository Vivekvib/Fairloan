
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";

const STATES = {
  likely_eligible: {
    icon: CheckCircle2, iconClass: "text-blue-500",
    bg: "bg-blue-50 border-blue-200",
    headline: "Your application has been progressed.",
    body: "Based on the prototype eligibility rules, your application has been reviewed and progressed to offer stage. This is not a real credit approval.",
    primary: { label: "View your offer", href: (token: string) => `/offer/${token}` },
    secondary: null,
  },
  needs_review: {
    icon: Clock, iconClass: "text-amber-500",
    bg: "bg-amber-50 border-amber-200",
    headline: "Your application needs manual review.",
    body: "One or more aspects of your application require additional review. In a real flow, a loan officer would assess this. In this prototype, you can still proceed to see a synthetic offer.",
    primary: { label: "View synthetic offer anyway", href: (token) => `/offer/${token}` },
    secondary: { label: "Return home", href: () => "/" },
  },
  not_progressed: {
    icon: XCircle, iconClass: "text-red-500",
    bg: "bg-red-50 border-red-200",
    headline: "Your application was not progressed.",
    body: "Based on the prototype rules, your application did not meet the criteria for this prototype. This is not a real credit decision and has not affected any credit bureau record.",
    primary: { label: "Return home", href: () => "/" },
    secondary: { label: "Understand the criteria", href: () => "/eligibility/check" },
  },
};

const REASONS = {
  likely_eligible: [
    { rule: "Income check",      result: "pass", plain: "Your income meets the minimum threshold." },
    { rule: "Amount check",      result: "pass", plain: "The requested amount is within a reasonable range." },
    { rule: "Repayment burden",  result: "pass", plain: "Your estimated obligations are within an acceptable range." },
    { rule: "Tenure check",      result: "pass", plain: "Your employment tenure is sufficient." },
    { rule: "Repayment history", result: "pass", plain: "No adverse synthetic repayment history." },
  ],
};

export default function DecisionPage() {
  const { token } = useParams();
  const [decisionState, setDecisionState] = useState("likely_eligible");
  const [rulesOpen, setRulesOpen] = useState(false);

  useEffect(() => {
    // Read eligibility result from session to determine decision state
    const stored = sessionStorage.getItem("eligibility_result");
    if (stored) {
      const result = JSON.parse(stored);
      setDecisionState(result.result || "likely_eligible");
    }
  }, []);

  const config = STATES[decisionState] || STATES.likely_eligible;
  const Icon = config.icon;
  const reasons = REASONS[decisionState] || [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-5">

      <header>
        <p className="text-xs font-medium text-blue-600 mb-1 uppercase tracking-wide">Decision</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Application decision</h1>
        <p className="text-sm text-slate-500">Prototype decision using synthetic rules only.</p>
      </header>

      {/* Decision card */}
      <div className={`border rounded-2xl p-5 flex gap-4 items-start ${config.bg}`}>
        <Icon size={26} className={`${config.iconClass} shrink-0 mt-0.5`}/>
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">{config.headline}</h2>
          <p className="text-sm text-slate-700 leading-relaxed">{config.body}</p>
        </div>
      </div>

      {/* Rule breakdown — collapsible */}
      {reasons.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <button onClick={() => setRulesOpen(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 text-left"
            aria-expanded={rulesOpen}>
            <span className="text-sm font-medium text-slate-800">How this decision was made</span>
            <span className="text-xs text-slate-400">{rulesOpen ? "Hide" : "Show"}</span>
          </button>
          {rulesOpen && (
            <div className="border-t border-slate-100 px-4 py-3 flex flex-col gap-2 bg-slate-50">
              <p className="text-xs text-slate-400 mb-1">Prototype rules only. Internal thresholds not shown.</p>
              {reasons.map(({ rule, result, plain }) => (
                <div key={rule} className={`rounded-xl px-3 py-2 border text-xs ${
                  result === "pass" ? "bg-blue-50 border-blue-100 text-blue-800" :
                  result === "review" ? "bg-amber-50 border-amber-100 text-amber-800" :
                  "bg-red-50 border-red-100 text-red-800"
                }`}>
                  <div className="flex justify-between mb-0.5">
                    <span className="font-semibold">{rule}</span>
                    <span className="capitalize">{result}</span>
                  </div>
                  <p>{plain}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Prototype disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
        <p className="text-xs text-slate-500 leading-relaxed">
          <strong>Prototype:</strong> This decision uses synthetic rules and does not reflect any real
          lender criteria. It has not affected your credit score or any credit bureau record.
          A real lender would use regulated credit assessment processes.
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <Link href={config.primary.href(token)} className="flex-1 sm:flex-none">
          <Button size="lg" className="w-full">
            {config.primary.label} <ArrowRight size={16} className="ml-2"/>
          </Button>
        </Link>
        {config.secondary && (
          <Link href={config.secondary.href()}>
            <Button variant="secondary" size="lg">{config.secondary.label}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
