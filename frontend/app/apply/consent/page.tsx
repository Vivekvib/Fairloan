"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ChevronDown, ChevronUp, ArrowRight, Info } from "lucide-react";
import Button from "@/components/ui/button";

// ── Consent data ──────────────────────────────────────────────────────────────
const NECESSARY = [
  {
    id: "identity_check",
    label: "Identity verification",
    why: "Required to confirm you are a real person before processing an application. In a real flow this would involve a government-issued ID. In this prototype, no real ID is collected.",
  },
  {
    id: "affordability_check",
    label: "Affordability assessment",
    why: "We use your stated income and obligations to check whether the loan repayment is manageable. This is the core eligibility calculation.",
  },
  {
    id: "application_processing",
    label: "Application processing",
    why: "We store your application data to generate a loan offer and track the application status. Prototype only — synthetic data, no real storage of personal information.",
  },
];

const OPTIONAL = [
  {
    id: "analytics",
    label: "Anonymous usage analytics",
    why: "Session-scoped events (which screens you visit, time spent) help improve the prototype. Not linked to your identity. You can decline this and the application works identically.",
  },
  {
    id: "research",
    label: "Product research participation",
    why: "Allows your anonymised responses to be used in PM portfolio research and case studies. Completely optional — no impact on your application.",
  },
];

// ── Consent item component ────────────────────────────────────────────────────
function ConsentItem({
  id, label, why, checked, locked, onChange,
}: {
  id: string; label: string; why: string;
  checked: boolean; locked?: boolean; onChange?: (v: boolean) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${
      checked ? "border-blue-200 bg-blue-50/40" : "border-slate-200 bg-white"
    }`}>
      <div className="flex items-start gap-3 px-4 py-3">
        {/* Checkbox */}
        <div className="mt-0.5 shrink-0">
          <input
            type="checkbox"
            id={id}
            checked={checked}
            disabled={locked}
            onChange={e => onChange?.(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>

        {/* Label + why toggle */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor={id}
              className={`text-sm font-medium cursor-pointer ${locked ? "cursor-not-allowed text-slate-600" : "text-slate-800"}`}
            >
              {label}
              {locked && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 font-medium">
                  Required
                </span>
              )}
            </label>
            <button
              type="button"
              onClick={() => setOpen(v => !v)}
              aria-expanded={open}
              aria-label={`Why we need ${label}`}
              className="text-slate-400 hover:text-blue-600 transition-colors shrink-0"
            >
              {open
                ? <ChevronUp size={14} aria-hidden="true" />
                : <ChevronDown size={14} aria-hidden="true" />}
            </button>
          </div>

          {/* Why explanation */}
          {open && (
            <div className="mt-2 text-xs text-slate-600 leading-relaxed bg-white border border-slate-100 rounded-lg px-3 py-2">
              {why}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ConsentPage() {
  const router = useRouter();
  const [optionalConsents, setOptionalConsents] = useState<Record<string, boolean>>(
    Object.fromEntries(OPTIONAL.map(c => [c.id, false]))
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleOptional = (id: string, value: boolean) => {
    setOptionalConsents(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      // Store consent record in sessionStorage for the application flow
      const consentRecord = {
        necessary: Object.fromEntries(NECESSARY.map(c => [c.id, true])),
        optional: optionalConsents,
        captured_at: new Date().toISOString(),
        version: "v1.0",
      };
      sessionStorage.setItem("consent_record", JSON.stringify(consentRecord));

      // POST to backend
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/consent/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          necessary_consents: consentRecord.necessary,
          optional_consents: consentRecord.optional,
          consent_version: "v1.0",
        }),
      });

      router.push("/apply/income");
    } catch {
      // Non-blocking — consent stored in sessionStorage regardless
      // Backend failure should not block the user from proceeding
      router.push("/apply/income");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-10 items-start">

      {/* Left — explanation (sticky) */}
      <div className="lg:sticky lg:top-20 flex flex-col gap-4">
        <div>
          <p className="text-xs font-medium text-blue-600 mb-1 uppercase tracking-wide">Step 2 of 5</p>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Your data and consent</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Before we collect anything, here is exactly what we need and why.
            You choose what's optional.
          </p>
        </div>

        {/* What we collect summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">What we collect</p>
          {[
            { label: "Income and employment details", purpose: "Affordability check" },
            { label: "Loan amount and tenure", purpose: "EMI calculation" },
            { label: "Mock document references", purpose: "Application completeness" },
          ].map(({ label, purpose }) => (
            <div key={label} className="flex items-start gap-2">
              <ShieldCheck size={13} className="text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-xs font-medium text-slate-700">{label}</p>
                <p className="text-xs text-slate-500">{purpose}</p>
              </div>
            </div>
          ))}
        </div>

        {/* RBI reference */}
        <div className="flex gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
          <Info size={13} className="text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-blue-700 leading-relaxed">
            <strong>Regulatory reference:</strong> RBI Digital Lending Guidelines (2022) require
            lenders to obtain explicit borrower consent before collecting data.
            Necessary and optional consents must be presented separately.{" "}
            <span className="text-blue-500">[Prototype assumption — not legally compliant]</span>
          </p>
        </div>

        {/* What we will never do */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-red-700 mb-2 uppercase tracking-wide">We will never</p>
          {[
            "Access your contacts, messages, or call logs",
            "Share your data with third parties for marketing",
            "Use your data beyond the stated purpose",
            "Collect real PAN, Aadhaar, or bank account data",
          ].map(item => (
            <p key={item} className="text-xs text-red-700 flex items-start gap-1.5 mb-1">
              <span aria-hidden="true">✗</span> {item}
            </p>
          ))}
        </div>
      </div>

      {/* Right — consent checklist */}
      <div className="flex flex-col gap-6">

        {/* Necessary consents */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-800">
              Necessary consents
            </h2>
            <span className="text-xs text-slate-500">Required to proceed</span>
          </div>
          <div className="flex flex-col gap-2">
            {NECESSARY.map(c => (
              <ConsentItem
                key={c.id}
                id={c.id}
                label={c.label}
                why={c.why}
                checked={true}
                locked={true}
              />
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2 pl-1">
            These are required to process your application. You cannot proceed without them.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200" />

        {/* Optional consents */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-800">
              Optional consents
            </h2>
            <span className="text-xs text-slate-500">Unchecked by default</span>
          </div>
          <div className="flex flex-col gap-2">
            {OPTIONAL.map(c => (
              <ConsentItem
                key={c.id}
                id={c.id}
                label={c.label}
                why={c.why}
                checked={optionalConsents[c.id]}
                onChange={v => handleOptional(c.id, v)}
              />
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2 pl-1">
            Declining optional consents has no effect on your application or loan offer.
          </p>
        </div>

        {/* Prototype disclaimer */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong>Prototype:</strong> This consent record is stored with synthetic data only.
            No real personal information is collected. You can withdraw optional consent at any
            time from your application dashboard.{" "}
            <a href="/privacy" className="underline hover:text-slate-700">Privacy policy</a>
          </p>
        </div>

        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 sm:flex-none"
          >
            {submitting ? "Saving consent…" : "I understand — continue"}
            <ArrowRight size={16} className="ml-2" aria-hidden="true" />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.back()}
            disabled={submitting}
          >
            Go back
          </Button>
        </div>

        <p className="text-xs text-slate-400 text-center">
          By continuing you confirm you have read and understood the consents above.
          This is not a blanket agreement — each consent is listed separately.
        </p>
      </div>
    </div>
  );
}
