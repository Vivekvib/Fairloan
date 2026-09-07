import Link from "next/link";
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";

const WILL_NEED = [
  { label: "Monthly take-home income",        reason: "Affordability check" },
  { label: "Existing monthly EMI obligations", reason: "Debt-to-income ratio" },
  { label: "Loan amount and tenure",           reason: "EMI and cost calculation" },
  { label: "Employment type and tenure",       reason: "Stability assessment" },
  { label: "Identity proof (any govt photo ID)", reason: "Mock upload only — no real file stored" },
  { label: "Income proof — salary slip OR bank statement", reason: "Mock upload only", warning: true },
  { label: "Address proof",                   reason: "Mock upload only" },
];

const WONT_NEED = [
  "Contacts or call logs",
  "Messages or photos",
  "Social media accounts",
  "GPS location",
  "Real PAN or Aadhaar",
  "Real bank account details",
];

export default function WhatYouNeedPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Header */}
      <header className="mb-6">
        <p className="text-xs font-medium text-blue-600 mb-1 uppercase tracking-wide">Before you start</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">What you'll need</h1>
        <p className="text-sm text-slate-500">Everything listed upfront — no surprises mid-application.</p>
      </header>

      {/* Salary slip warning — moved above the fold (Item 4) */}
      <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
        <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" aria-hidden="true"/>
        <p className="text-xs text-slate-700 leading-relaxed">
          <strong>Salary slip note:</strong> Salary slips may signal a loan application to your employer.
          You can use a <strong>bank statement instead</strong> — it shows the same income without involving your employer.
        </p>
      </div>

      {/* Two-column layout — will need / won't need side by side */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8">

        {/* Will need */}
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-blue-600"/> What we'll ask for
          </h2>
          <ul className="flex flex-col gap-2">
            {WILL_NEED.map(({ label, reason, warning }) => (
              <li key={label} className="bg-white border border-slate-200 rounded-xl px-3 py-2.5">
                <p className="text-xs font-medium text-slate-800 mb-0.5">{label}</p>
                <p className="text-xs text-slate-500">
                  {warning && <span className="text-amber-600 font-medium">⚠ </span>}
                  {reason}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Won't need */}
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
            <XCircle size={14} className="text-red-500"/> What we will NOT ask for
          </h2>
          <ul className="flex flex-col gap-2">
            {WONT_NEED.map((item) => (
              <li key={item}
                className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                <XCircle size={12} className="text-red-400 shrink-0" aria-hidden="true"/>
                <span className="text-xs text-slate-700">{item}</span>
              </li>
            ))}
          </ul>

          {/* Prototype disclaimer — compact */}
          <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>Prototype:</strong> No real personal or financial data is collected.
              All inputs are synthetic.{" "}
              <Link href="/disclaimer" className="underline hover:text-slate-700">Full disclaimer</Link>
            </p>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <Link href="/eligibility/check">
          <Button size="md">
            I'm ready — check my eligibility <ArrowRight size={15} className="ml-1.5"/>
          </Button>
        </Link>
        <Link href="/">
          <Button variant="secondary" size="md">Go back</Button>
        </Link>
      </div>
    </div>
  );
}
