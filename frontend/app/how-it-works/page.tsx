import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";

const STEPS = [
  {
    number: "01",
    title: "See what you'll need",
    description:
      "Before you start, we show you every piece of information and every document you'll be asked for — and exactly why we need it. No surprises.",
  },
  {
    number: "02",
    title: "Check your eligibility",
    description:
      "Enter a few financial details. Our prototype checks three simple rules and tells you the result — along with a plain-language explanation of every rule. This does not affect your credit score.",
  },
  {
    number: "03",
    title: "Give informed consent",
    description:
      "You'll see exactly what data we collect, why we collect it, and what we do with it. Necessary and optional consents are always separate. You can withdraw optional consent at any time.",
  },
  {
    number: "04",
    title: "Complete your application",
    description:
      "Enter your income, employment, and loan details. Upload mock documents. Review everything before submitting — with the ability to edit any section.",
  },
  {
    number: "05",
    title: "Review your offer",
    description:
      "Before you accept anything, you'll see a complete cost breakdown: principal, interest rate, APR, processing fee, monthly EMI, total interest, and total repayable. No hidden numbers.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-12">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          How FairLoan works
        </h1>
        <p className="text-slate-600 leading-relaxed">
          A transparent walkthrough of every step — so you know what to expect
          before you start.
        </p>
      </header>

      <ol className="flex flex-col gap-6" aria-label="Application steps">
        {STEPS.map((step, i) => (
          <li key={step.number} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {step.number}
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-px flex-1 bg-slate-200 mt-2" aria-hidden="true" />
              )}
            </div>
            <div className="pb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">
                {step.title}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <Link href="/what-you-need">
        <Button size="lg">
          Start with what you&apos;ll need
          <ArrowRight size={18} className="ml-2" aria-hidden="true" />
        </Button>
      </Link>
    </div>
  );
}
