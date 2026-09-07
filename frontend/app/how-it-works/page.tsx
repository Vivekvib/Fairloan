import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";

const STEPS = [
  { n: "01", title: "See what you'll need", desc: "Every document and data field listed upfront — no surprises mid-application." },
  { n: "02", title: "Check eligibility", desc: "Three simple rules, plain-language result. No credit bureau impact." },
  { n: "03", title: "Give informed consent", desc: "Necessary vs optional consents separated. Withdraw anytime." },
  { n: "04", title: "Complete your application", desc: "Income, loan config, mock documents. Edit any section before submitting." },
  { n: "05", title: "Review your offer", desc: "Full cost breakdown — EMI, APR, interest, fee, total repayable — before you accept." },
];

export default function HowItWorksPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">How FairLoan works</h1>
        <p className="text-slate-500 text-sm">Five steps. Full transparency at each one.</p>
      </header>

      {/* Horizontal step strip on desktop, vertical on mobile */}
      <ol className="grid sm:grid-cols-5 gap-4 mb-10" aria-label="Application steps">
        {STEPS.map((step, i) => (
          <li key={step.n} className="flex sm:flex-col gap-3 sm:gap-2">
            <div className="flex sm:flex-col items-center sm:items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {step.n}
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden sm:block w-full h-px bg-slate-200 mt-1" aria-hidden="true"/>
              )}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-1">{step.title}</h2>
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <Link href="/what-you-need">
        <Button size="md">
          Start with what you'll need <ArrowRight size={15} className="ml-1.5"/>
        </Button>
      </Link>
    </div>
  );
}
