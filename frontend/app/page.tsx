"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, FileText } from "lucide-react";
import Button from "@/components/ui/button";
import { useEffect, useState } from "react";

function useCountUp(target: number, duration = 1400, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setValue(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

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

function AmortChart({ visible }: { visible: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="relative flex items-end gap-1 h-20">
      {AMORT.map((row, i) => (
        <div key={row.month}
          className="flex flex-col-reverse gap-0.5 flex-1 cursor-pointer relative"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <motion.div className="bg-amber-400 rounded-sm w-full"
            initial={{ height: 0 }}
            animate={visible ? { height: `${(row.interest / MAX_BAR) * 80}px` } : {}}
            transition={{ delay: i * 0.05 + 0.1, duration: 0.45, ease: "easeOut" }}
          />
          <motion.div className="bg-blue-400 rounded-sm w-full"
            initial={{ height: 0 }}
            animate={visible ? { height: `${(row.principal / MAX_BAR) * 80}px` } : {}}
            transition={{ delay: i * 0.05 + 0.1, duration: 0.45, ease: "easeOut" }}
          />
          {hovered === i && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs rounded-lg px-2 py-1.5 whitespace-nowrap z-10 pointer-events-none shadow-lg">
              <p className="font-semibold mb-0.5">Month {row.month}</p>
              <p className="text-blue-300">₹{row.principal.toLocaleString("en-IN")} principal</p>
              <p className="text-amber-300">₹{row.interest.toLocaleString("en-IN")} interest</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const COMPARISON = [
  { label: "Monthly EMI",           them: "✓ Shown",        us: "✓ Shown" },
  { label: "Total interest",        them: "✗ Hidden",       us: "✓ Shown" },
  { label: "Processing fee",        them: "Fine print",     us: "✓ Upfront" },
  { label: "APR",                   them: "✗ Absent",       us: "✓ Explained" },
  { label: "Amortisation schedule", them: "✗ Never",        us: "✓ Full" },
  { label: "Rejection reason",      them: "✗ Generic",      us: "✓ Plain language" },
  { label: "Consent explanation",   them: "✗ One checkbox", us: "✓ Per-field" },
];

const PRINCIPLES = [
  { icon: Shield,    title: "No dark patterns",       body: "No timers, no pre-checked consent, no shame in rejection." },
  { icon: FileText,  title: "Every cost upfront",     body: "Principal, interest, fee, APR — all visible before you agree." },
  { icon: TrendingUp,title: "Every decision explained",body: "Plain-language reasons, not generic error messages." },
];

export default function HomePage() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 300); return () => clearTimeout(t); }, []);

  const emi      = useCountUp(2750,  1400, visible);
  const total    = useCountUp(33604, 1400, visible);
  const interest = useCountUp(3004,  1400, visible);

  return (
    <div className="flex flex-col">

      {/* ── HERO — full viewport, two columns, no vertical overflow ─────── */}
      <section className="relative bg-[#0f1f3d] overflow-hidden flex items-center min-h-screen"
        aria-label="FairLoan hero">

        {/* Grid texture */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none"
          viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`v${i}`} x1={i*120} y1="0" x2={i*120} y2="900" stroke="white" strokeWidth="1"/>
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i*120} x2="1440" y2={i*120} stroke="white" strokeWidth="1"/>
          ))}
          <ellipse cx="380" cy="340" rx="500" ry="360" fill="#1e40af" opacity="0.35"/>
          <ellipse cx="1100" cy="580" rx="400" ry="280" fill="#1d4ed8" opacity="0.25"/>
        </svg>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12 items-center">

          {/* Left col */}
          <motion.div className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>

            <div className="inline-flex w-fit items-center gap-2 bg-blue-900/60 border border-blue-700/50 rounded-full px-4 py-1.5 text-xs font-medium text-blue-300">
              🎓 Educational prototype · Synthetic data only
            </div>

            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-[1.08] tracking-tight">
                Lending you can<br />
                <span className="text-blue-400">actually see through.</span>
              </h1>
              <p className="mt-4 text-base text-blue-100/65 leading-relaxed max-w-sm">
                Every cost visible. Every decision explained. No dark patterns, no hidden fees.
              </p>
            </div>

            {/* CTAs — primary filled, secondary clearly outlined with visible border */}
            <div className="flex flex-wrap gap-3">
              <Link href="/what-you-need">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-400 text-white border-0">
                  See what you'll need <ArrowRight size={16} className="ml-1.5" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                {/* Fixed: explicit visible border + text color that works on dark bg */}
                <Button size="lg"
                  className="bg-transparent border-2 border-blue-400 text-blue-300 hover:bg-blue-400/10 hover:text-white">
                  How it works
                </Button>
              </Link>
            </div>

            {/* Compact stat row — horizontal, no extra scrolling */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { label: "Monthly EMI",    val: emi,      suffix: "/mo" },
                { label: "Total interest", val: interest, suffix: "" },
                { label: "Total cost",     val: total,    suffix: "" },
              ].map(({ label, val, suffix }, i) => (
                <motion.div key={label}
                  initial={{ opacity: 0, y: 12 }} animate={visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.35 + i * 0.1, duration: 0.4 }}
                  className="bg-white/6 border border-white/10 rounded-xl p-3">
                  <p className="text-xs text-blue-300 mb-0.5">{label}</p>
                  <p className="text-lg font-bold text-white tabular-nums">
                    ₹{val.toLocaleString("en-IN")}{suffix}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right col — dashboard card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm flex flex-col gap-4 shadow-[0_8px_40px_rgba(0,0,0,0.45)]">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-300 mb-0.5">Prototype loan · ₹30,000 @ 18% p.a.</p>
                <p className="text-sm text-white font-semibold">12-month reducing-balance breakdown</p>
              </div>
              <span className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-2 py-0.5 text-xs text-blue-300 font-medium">
                Synthetic
              </span>
            </div>

            {/* Chart */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-blue-300 font-medium">Month-by-month</p>
                <div className="flex gap-3 text-xs text-blue-300">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"/>Principal</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"/>Interest</span>
                </div>
              </div>
              <AmortChart visible={visible} />
              <p className="text-xs text-blue-400/50 text-center mt-1">Hover bars · Month 1: ₹450 interest → Month 12: ₹41</p>
            </div>

            {/* Comparison table — right in the hero card */}
            <div className="border-t border-white/10 pt-4">
              <p className="text-xs text-blue-300 font-medium mb-3">What most apps hide vs FairLoan</p>
              <div className="flex flex-col gap-1.5">
                {COMPARISON.map(({ label, them, us }) => (
                  <div key={label} className="grid grid-cols-5 gap-1 items-center text-xs">
                    <span className="col-span-2 text-blue-200/70">{label}</span>
                    <span className="text-center py-0.5 rounded bg-red-500/15 text-red-300 col-span-1">{them}</span>
                    <span className="text-center py-0.5 rounded bg-blue-500/20 text-blue-300 col-span-2">{us}</span>
                  </div>
                ))}
                <div className="grid grid-cols-5 gap-1 text-xs text-blue-400/40 mt-0.5">
                  <span className="col-span-2"/>
                  <span className="text-center col-span-1">Typical</span>
                  <span className="text-center col-span-2 text-blue-400">FairLoan</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-blue-400/40 border-t border-white/5 pt-2">
              Prototype assumption · Not a real loan offer · Synthetic data only
            </p>
          </motion.div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* ── PRINCIPLES — horizontal 3-col, compact ───────────────────────── */}
      <section className="bg-slate-50 py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Built on one principle.</h2>
            <p className="text-slate-500 text-sm max-w-xs">Comprehension before conversion — every decision traces back to this.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {PRINCIPLES.map(({ icon: Icon, title, body }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-blue-700" aria-hidden="true"/>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">{title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP — compact ──────────────────────────────────────────── */}
      <section className="bg-[#0f1f3d] py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Ready to see the full picture?</h2>
            <p className="text-blue-300 text-sm">No account. No credit check. Synthetic data only.</p>
          </div>
          <Link href="/what-you-need">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-400 text-white border-0 whitespace-nowrap">
              Get started <ArrowRight size={16} className="ml-1.5"/>
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
