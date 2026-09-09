import Link from "next/link";
import { ArrowRight, Shield, FileText, TrendingUp } from "lucide-react";
import Button from "@/components/ui/button";
import { formatRupee } from "@/lib/emi";

/**
 * Home page — no animations, no emojis, no vague copy.
 * Static chart. Factual headline. Real numbers only.
 */

const AMORT = [
  { month: 1,  interest: 450,  principal: 2300 },
  { month: 2,  interest: 415,  principal: 2335 },
  { month: 3,  interest: 380,  principal: 2370 },
  { month: 4,  interest: 344,  principal: 2406 },
  { month: 5,  interest: 308,  principal: 2442 },
  { month: 6,  interest: 271,  principal: 2479 },
  { month: 7,  interest: 234,  principal: 2516 },
  { month: 8,  interest: 196,  principal: 2554 },
  { month: 9,  interest: 157,  principal: 2593 },
  { month: 10, interest: 120,  principal: 2630 },
  { month: 11, interest: 81,   principal: 2669 },
  { month: 12, interest: 41,   principal: 2710 },
];
const MAX_BAR = 2750;

const PRINCIPLES = [
  {
    icon: Shield,
    title: "No dark patterns",
    body: "No pre-checked consent boxes. No countdown timers. No urgency language. No hidden fees revealed after acceptance.",
  },
  {
    icon: FileText,
    title: "Full cost disclosure before acceptance",
    body: "Principal, interest rate, APR, processing fee, EMI, and total repayable are shown on a single screen before the user agrees to anything.",
  },
  {
    icon: TrendingUp,
    title: "Plain-language decision explanations",
    body: "Every application outcome carries a specific reason in plain language. Not-progressed applications are not given a generic error message.",
  },
];

const COMPARISON = [
  { label: "Monthly EMI",            them: "Shown",           us: "Shown" },
  { label: "Total interest paid",    them: "Not shown",       us: "Shown" },
  { label: "Processing fee",         them: "Fine print",      us: "Shown upfront" },
  { label: "APR",                    them: "Absent",          us: "Shown and explained" },
  { label: "Amortisation schedule",  them: "Not provided",    us: "Full breakdown" },
  { label: "Rejection reason",       them: "Generic message", us: "Specific plain-language reason" },
  { label: "Consent explanation",    them: "Single checkbox", us: "Per-field explanation" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* HERO */}
      <section
        className="relative bg-[#0f1f3d] overflow-hidden flex items-center min-h-screen"
        aria-label="FairLoan introduction"
      >
        {/* Subtle grid — no blobs, no gradients */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 120} y1="0" x2={i * 120} y2="900" stroke="white" strokeWidth="1" />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 120} x2="1440" y2={i * 120} stroke="white" strokeWidth="1" />
          ))}
        </svg>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-14 items-center">

          {/* Left */}
          <div className="flex flex-col gap-7">
            <div className="inline-block w-fit border border-blue-700/60 rounded-sm px-3 py-1 text-xs text-blue-400 font-medium tracking-wide uppercase">
              Portfolio prototype — synthetic data only
            </div>

            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight">
                A responsible lending<br />
                reference design built on<br />
                <span className="text-blue-400">RBI Digital Lending Guidelines.</span>
              </h1>
              <p className="mt-5 text-base text-blue-200/70 leading-relaxed max-w-md">
                FairLoan demonstrates what transparent digital lending should look like: full cost disclosure before acceptance, explicit consent, and plain-language decisions.
              </p>
            </div>

            {/* CTAs — one filled, one outlined */}
            <div className="flex flex-wrap gap-3">
              <Link href="/what-you-need">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white border-0">
                  See what you'll need
                  <ArrowRight size={15} className="ml-2" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" className="bg-transparent border border-blue-600 text-blue-300 hover:bg-blue-600/10 hover:text-white">
                  How it works
                </Button>
              </Link>
            </div>

            {/* Key numbers — static, no animation */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {[
                { label: "Monthly EMI",    value: "₹2,750",   sub: "on ₹30,000 loan" },
                { label: "Total interest", value: "₹3,004",   sub: "over 12 months" },
                { label: "Total cost",     value: "₹33,604",  sub: "including 2% fee" },
              ].map(({ label, value, sub }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-md p-3">
                  <p className="text-xs text-blue-400 mb-1">{label}</p>
                  <p className="text-base font-bold text-white tabular-nums">{value}</p>
                  <p className="text-xs text-blue-400/50 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — static dashboard card */}
          <div className="bg-white/5 border border-white/10 rounded-md p-5 flex flex-col gap-5">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-400 mb-0.5">Prototype scenario</p>
                <p className="text-sm text-white font-semibold">₹30,000 at 18% p.a. over 12 months</p>
              </div>
              <span className="border border-blue-700/50 rounded-sm px-2 py-0.5 text-xs text-blue-400">
                Synthetic
              </span>
            </div>

            {/* Static amortisation chart */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-blue-400 font-medium">Principal vs interest per month</p>
                <div className="flex gap-3 text-xs text-blue-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-500 inline-block rounded-sm" />Principal
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-amber-500 inline-block rounded-sm" />Interest
                  </span>
                </div>
              </div>
              <div className="flex items-end gap-1 h-20">
                {AMORT.map(row => (
                  <div key={row.month} className="flex flex-col-reverse gap-px flex-1">
                    <div
                      className="bg-amber-500 w-full rounded-sm"
                      style={{ height: `${(row.interest / MAX_BAR) * 80}px` }}
                    />
                    <div
                      className="bg-blue-500 w-full rounded-sm"
                      style={{ height: `${(row.principal / MAX_BAR) * 80}px` }}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-blue-400/40 text-center mt-1">
                Month 1: ₹450 interest. Month 12: ₹41 interest. Reducing-balance method.
              </p>
            </div>

            {/* Comparison table */}
            <div className="border-t border-white/10 pt-4">
              <p className="text-xs text-blue-400 font-medium mb-3 uppercase tracking-wide">
                Typical app vs FairLoan
              </p>
              <div className="flex flex-col gap-1.5">
                {COMPARISON.map(({ label, them, us }) => (
                  <div key={label} className="grid grid-cols-5 gap-1 items-center text-xs">
                    <span className="col-span-2 text-blue-300/60">{label}</span>
                    <span className="text-center py-0.5 rounded-sm bg-slate-700/40 text-slate-400 col-span-1">
                      {them}
                    </span>
                    <span className="text-center py-0.5 rounded-sm bg-blue-600/20 text-blue-300 col-span-2">
                      {us}
                    </span>
                  </div>
                ))}
                <div className="grid grid-cols-5 gap-1 text-xs text-blue-400/30 mt-0.5">
                  <span className="col-span-2" />
                  <span className="text-center col-span-1">Typical</span>
                  <span className="text-center col-span-2 text-blue-400/60">FairLoan</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-blue-400/30 border-t border-white/5 pt-2">
              18% p.a. reducing balance. 2% processing fee. Prototype assumption. Not a real loan offer.
            </p>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,24 C480,48 960,0 1440,24 L1440,48 L0,48 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="bg-slate-50 py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <h2 className="text-xl font-bold text-slate-900">Design principles</h2>
            <p className="text-sm text-slate-500 max-w-xs">
              Each principle maps to a specific screen in the prototype.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {PRINCIPLES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="bg-white border border-slate-200 rounded-md p-5 flex gap-4 items-start"
              >
                <div className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-md flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-blue-700" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0f1f3d] py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">
              Walk through the prototype
            </h2>
            <p className="text-blue-300 text-sm">
              No account. No credit check. Synthetic data only.
            </p>
          </div>
          <Link href="/what-you-need">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white border-0 whitespace-nowrap">
              Start the flow
              <ArrowRight size={15} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
