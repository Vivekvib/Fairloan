"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  {
    q: "Is FairLoan a real lending company?",
    a: "No. This is an educational PM portfolio prototype using synthetic data. No real loans, no real money, no real personal data.",
  },
  {
    q: "Does the eligibility check affect my CIBIL score?",
    a: "No — and this is a prototype, so no real credit bureau is involved. In a real flow, a soft enquiry (pre-check) typically doesn't affect your score; a hard enquiry (full application) may. A real lender must tell you which type they're running.",
  },
  {
    q: "Why does the app ask for salary information?",
    a: "Income is used to calculate affordability — whether the monthly repayment fits your income. In this prototype all inputs are synthetic.",
  },
  {
    q: "What is a Key Facts Statement (KFS)?",
    a: "A standardised loan summary showing interest rate, APR, processing fee, EMI, and total repayable. RBI guidelines require lenders to provide a KFS before acceptance. FairLoan shows what this should look like.",
  },
  {
    q: "What is APR vs interest rate?",
    a: "The interest rate covers only the principal cost. APR includes the interest rate plus all mandatory fees expressed as one annualised percentage — a more complete picture of total borrowing cost.",
  },
  {
    q: "What happens if I miss an EMI?",
    a: "In this prototype, late fees are labelled as assumptions. A real lender must disclose all late-payment consequences in the loan agreement.",
  },
  {
    q: "Can I cancel after accepting?",
    a: "The cooling-off flow demonstrates what a responsible cancellation experience should look like. All timing and fee assumptions are clearly labelled.",
  },
  {
    q: "Who built this?",
    a: "Vivek Nishad, a CS student at Delhi University, as a PM portfolio project demonstrating fintech domain knowledge and responsible design.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-slate-800 pr-4">{q}</span>
        {open
          ? <ChevronUp size={15} className="text-slate-400 shrink-0"/>
          : <ChevronDown size={15} className="text-slate-400 shrink-0"/>}
      </button>
      {open && (
        <div className="px-4 pb-3 border-t border-slate-100 bg-slate-50">
          <p className="text-sm text-slate-600 leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">FAQ</h1>
        <p className="text-sm text-slate-500">Everything about this prototype.</p>
      </header>
      <div className="flex flex-col gap-2">
        {FAQS.map(({ q, a }) => (
          <FaqItem key={q} q={q} a={a} />
        ))}
      </div>
    </div>
  );
}
