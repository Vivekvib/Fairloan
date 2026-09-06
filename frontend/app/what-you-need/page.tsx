import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  FileText,
  Briefcase,
  IndianRupee,
} from "lucide-react";
import Button from "@/components/ui/button";

const INFO_SECTIONS = [
  {
    icon: IndianRupee,
    title: "Information you'll enter",
    items: [
      {
        label: "Monthly take-home income",
        reason: "We use this to assess whether the loan repayment is affordable for you.",
      },
      {
        label: "Existing monthly EMI obligations",
        reason:
          "We add this to your new EMI to calculate your total monthly repayment burden — this is called debt-to-income ratio.",
      },
      {
        label: "Loan amount and repayment period",
        reason:
          "This determines your monthly installment and total cost. You can adjust both and see the impact before applying.",
      },
      {
        label: "Employment type and how long you've been employed",
        reason:
          "Employment stability is one of the inputs in the prototype eligibility model. We explain every rule we use.",
      },
    ],
  },
  {
    icon: FileText,
    title: "Documents you'll upload (mock only)",
    items: [
      {
        label: "Identity proof — any government-issued photo ID",
        reason:
          "Required to verify identity in a real lending flow. In this prototype, you upload a mock filename only — no real file is stored.",
      },
      {
        label: "Income proof — last 3 months' salary slips OR bank statement",
        reason:
          "Used to verify stated income. See the important note below about salary slips.",
        warning: true,
      },
      {
        label: "Address proof — utility bill or equivalent",
        reason:
          "Standard requirement in a real lending flow. Synthetic only in this prototype.",
      },
    ],
  },
  {
    icon: Briefcase,
    title: "Employment details",
    items: [
      {
        label: "Employer name (synthetic — do not enter your real employer)",
        reason:
          "Used as a contextual label in the prototype. In a real flow, employer verification is a standard step.",
      },
    ],
  },
];

const NOT_COLLECTED = [
  "Your contacts or call logs",
  "Access to your messages or photos",
  "Your social media accounts",
  "Your exact GPS location",
  "Real PAN or Aadhaar number — this is a prototype",
  "Real bank account details",
];

export default function WhatYouNeedPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-10">

      {/* Page header */}
      <header>
        <p className="text-sm font-medium text-brand-700 mb-2">Before you start</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          What you&apos;ll need
        </h1>
        <p className="text-slate-600 leading-relaxed">
          Here is everything you&apos;ll be asked for during the prototype
          application — and exactly why we need it. No surprises halfway through.
        </p>
      </header>

      {/* Salary slip social friction warning — AC-W2 */}
      <div
        role="note"
        aria-label="Important note about salary slips"
        className="flex gap-3 bg-warning-50 border border-warning-200 rounded-xl p-4"
      >
        <AlertTriangle
          size={20}
          className="text-warning-600 shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-semibold text-slate-800 mb-1">
            A note about salary slips
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Salary slips sometimes show your employer that you are applying for a
            loan — even if you&apos;d prefer to keep it private. In a real
            application, you can usually provide a{" "}
            <strong>bank statement instead</strong>, which shows the same income
            without involving your employer. We ask for income proof — not
            specifically salary slips.
          </p>
        </div>
      </div>

      {/* Information sections */}
      {INFO_SECTIONS.map(({ icon: Icon, title, items }) => (
        <section key={title} aria-labelledby={title.replace(/\s+/g, "-")}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
              <Icon size={16} className="text-brand-700" aria-hidden="true" />
            </div>
            <h2
              id={title.replace(/\s+/g, "-")}
              className="text-lg font-semibold text-slate-900"
            >
              {title}
            </h2>
          </div>

          <ul className="flex flex-col gap-3">
            {items.map(({ label, reason, warning }) => (
              <li
                key={label}
                className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-2"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-brand-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-slate-800">
                    {label}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  <span className="font-medium text-slate-500">Why: </span>
                  {reason}
                </p>
                {warning && (
                  <p className="text-xs text-warning-600 font-medium pl-6">
                    ↑ See the salary slip note above.
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* What we will NOT collect — AC-W3 */}
      <section aria-labelledby="not-collected-heading">
        <h2
          id="not-collected-heading"
          className="text-lg font-semibold text-slate-900 mb-4"
        >
          What we will <span className="text-danger-600">not</span> ask for
        </h2>
        <ul className="flex flex-col gap-2">
          {NOT_COLLECTED.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <XCircle
                size={16}
                className="text-danger-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span className="text-sm text-slate-700">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Prototype disclaimer — AC-W4: visible without scrolling on mobile */}
      <div
        role="note"
        aria-label="Prototype disclaimer"
        className="bg-amber-50 border border-amber-200 rounded-xl p-4"
      >
        <p className="text-sm text-amber-800 leading-relaxed">
          <strong>Prototype disclaimer:</strong> This is an educational project
          using synthetic data only. No real personal or financial information is
          collected or processed. No real loan will be created. Eligibility
          decisions use prototype rules — they do not reflect any real
          lender&apos;s criteria and do not affect your credit record.
        </p>
      </div>

      {/* CTAs — AC-W5 and AC-W6 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/eligibility/check" className="flex-1">
          <Button size="lg" className="w-full">
            I&apos;m ready — check my eligibility
            <ArrowRight size={18} className="ml-2" aria-hidden="true" />
          </Button>
        </Link>
        <Link href="/">
          <Button variant="secondary" size="lg">
            Go back
          </Button>
        </Link>
      </div>
    </div>
  );
}
