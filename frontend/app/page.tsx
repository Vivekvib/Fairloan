import Link from "next/link";
import { ArrowRight, ShieldCheck, FileText, BarChart3 } from "lucide-react";
import Button from "@/components/ui/button";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "No hidden fees",
    body: "Every cost is shown before you agree to anything — principal, interest, processing fee, and total repayable.",
  },
  {
    icon: FileText,
    title: "Clear explanations",
    body: "Every data field explains why it's being asked. Every decision explains why it was made.",
  },
  {
    icon: BarChart3,
    title: "Understand your loan",
    body: "See a full repayment schedule — how much goes to interest each month and when the balance reaches zero.",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 flex flex-col gap-20">

      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-6">
        <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-full px-4 py-1.5 text-xs font-medium text-brand-700">
          🎓 Portfolio prototype — synthetic data only
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight max-w-2xl">
          Borrow clearly.{" "}
          <span className="text-brand-700">Repay confidently.</span>
        </h1>

        <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
          FairLoan demonstrates what a transparent digital-lending experience
          should feel like — no dark patterns, no hidden fees, no confusing
          jargon.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link href="/what-you-need">
            <Button size="lg">
              See what you&apos;ll need
              <ArrowRight size={18} className="ml-2" aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/how-it-works">
            <Button variant="secondary" size="lg">
              How it works
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">
          Key features
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                <Icon size={20} className="text-brand-700" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-brand-700 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">
            Ready to explore?
          </h2>
          <p className="text-brand-100 text-sm">
            Start with what you&apos;ll need — no account required.
          </p>
        </div>
        <Link href="/what-you-need">
          <Button
            variant="secondary"
            size="lg"
            className="whitespace-nowrap bg-white text-brand-700 border-0 hover:bg-brand-50"
          >
            Get started
            <ArrowRight size={18} className="ml-2" aria-hidden="true" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
