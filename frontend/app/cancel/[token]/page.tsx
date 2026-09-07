
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";

export default function CancelPage() {
  const { token } = useParams();
  const router = useRouter();
  const [cancelled, setCancelled] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleCancel = () => {
    sessionStorage.setItem("loan_cancelled_at", new Date().toISOString());
    setCancelled(true);
  };

  if (cancelled) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 flex flex-col gap-5">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
          <p className="text-4xl mb-3">✓</p>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Loan cancelled</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your prototype loan has been cancelled. In a real flow, the lender would confirm
            cancellation in writing within 24 hours. No funds were disbursed in this prototype.
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <p className="text-xs text-amber-800">
            <strong>What happens next (real flow, prototype assumption):</strong> Any disbursed amount
            would need to be returned within the cooling-off window. No cancellation fee applies
            within 3 days — prototype assumption, not a real policy.
          </p>
        </div>
        <Link href="/">
          <Button size="lg" className="w-full">Return home <ArrowRight size={16} className="ml-2"/></Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 flex flex-col gap-5">

      <header>
        <p className="text-xs font-medium text-blue-600 mb-1 uppercase tracking-wide">Cooling-off</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Cancel your loan</h1>
        <p className="text-sm text-slate-500">
          You are within the prototype cooling-off window. You may cancel without penalty.
        </p>
      </header>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5"/>
        <div>
          <p className="text-sm font-semibold text-amber-900 mb-1">
            Cooling-off period — 3 days
            <span className="text-xs font-normal text-amber-700 ml-2">[Prototype assumption]</span>
          </p>
          <p className="text-xs text-amber-800 leading-relaxed">
            This prototype assumes a 3-day window from acceptance. In a real lending flow,
            the cooling-off period and any applicable charges are defined in the loan agreement
            and regulated by applicable RBI guidelines.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
        <p className="text-sm font-semibold text-slate-800">What cancellation means</p>
        {[
          { label: "Return of funds",       value: "Any disbursed amount must be returned (prototype assumption)" },
          { label: "Cancellation fee",       value: "None within 3 days (prototype assumption)" },
          { label: "Credit bureau impact",   value: "None — this is a prototype, no real credit record exists" },
          { label: "Timeline",               value: "Confirmation within 24 hours (prototype assumption)" },
        ].map(({ label, value }) => (
          <div key={label} className="flex gap-3 text-sm">
            <span className="text-slate-500 w-36 shrink-0">{label}</span>
            <span className="text-slate-800">{value}</span>
          </div>
        ))}
      </div>

      {/* Confirmation checkbox */}
      <div
        className={`border rounded-xl px-4 py-4 flex gap-3 items-start cursor-pointer transition-colors ${confirmed ? "border-red-300 bg-red-50" : "border-slate-200 bg-white"}`}
        onClick={() => setConfirmed(v => !v)}
      >
        <input type="checkbox" checked={confirmed}
          onChange={e => setConfirmed(e.target.checked)}
          className="w-4 h-4 mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-500"
          id="cancel-confirm"/>
        <label htmlFor="cancel-confirm" className="text-sm text-slate-700 cursor-pointer leading-relaxed">
          I understand I am cancelling this prototype loan and that in a real flow I would need to return any disbursed funds.
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          size="lg"
          onClick={handleCancel}
          disabled={!confirmed}
          className="bg-red-600 hover:bg-red-700 text-white border-0 flex-1 sm:flex-none"
        >
          Confirm cancellation
        </Button>
        <Button variant="secondary" size="lg" onClick={() => router.back()}>
          Keep my loan
        </Button>
      </div>
    </div>
  );
}
