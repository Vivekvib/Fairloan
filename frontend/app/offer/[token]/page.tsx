"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Info } from "lucide-react";
import Button from "@/components/ui/button";
import { calculateEmi, formatRupee } from "@/lib/emi";
import { ANNUAL_INTEREST_RATE, PROCESSING_FEE_NOTE, APR_NOTE } from "@/lib/constants";

const AMORT_MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function buildSchedule(principal: number, annualRate: number, tenure: number) {
  const r = annualRate / 1200;
  const compound = Math.pow(1 + r, tenure);
  const emi = (principal * r * compound) / (compound - 1);
  const rows = [];
  let balance = principal;
  for (let m = 1; m <= tenure; m++) {
    const interest = balance * r;
    const princ = m === tenure ? balance : emi - interest;
    balance = m === tenure ? 0 : balance - princ;
    rows.push({
      month: m,
      emi: Math.round(emi * 100) / 100,
      principal: Math.round(princ * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    });
  }
  return rows;
}

export default function OfferPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [loanData, setLoanData] = useState<Record<string, string> | null>(null);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [kfsTime, setKfsTime] = useState<number>(0);

  useEffect(() => {
    const ld = sessionStorage.getItem("loan_data");
    if (ld) setLoanData(JSON.parse(ld));
    // Track when offer screen was viewed — borrower-protection metric
    const start = Date.now();
    setKfsTime(start);
    sessionStorage.setItem("offer_viewed_at", String(start));
  }, []);

  const principal = Number(loanData?.amount) || 30000;
  const tenure    = Number(loanData?.tenure) || 12;
  const preview   = calculateEmi(principal, ANNUAL_INTEREST_RATE, tenure);
  const schedule  = buildSchedule(principal, ANNUAL_INTEREST_RATE, tenure);

  if (!preview) return null;

  const apr = (ANNUAL_INTEREST_RATE + 2).toFixed(2); // 2% fee annualised — prototype

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">

      <header>
        <p className="text-xs font-medium text-blue-600 mb-1 uppercase tracking-wide">Loan offer</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Your prototype loan offer</h1>
        <p className="text-sm text-slate-500">
          Review the full cost breakdown before accepting. Nothing is finalised until you confirm on the next screen.
        </p>
      </header>

      {/* Prototype disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex gap-2">
        <Info size={14} className="text-amber-600 shrink-0 mt-0.5" aria-hidden="true"/>
        <p className="text-xs text-amber-800">
          This is a <strong>prototype offer</strong> using synthetic rules and a fixed 18% p.a. rate.
          Not a real loan offer. Not RBI-compliant. Calculations use the reducing-balance method.
        </p>
      </div>

      {/* Main offer grid */}
      <div className="grid sm:grid-cols-2 gap-4">

        {/* Left — key numbers */}
        <div className="bg-[#0f1f3d] rounded-2xl p-5 flex flex-col gap-4">
          <p className="text-xs text-blue-300 font-medium uppercase tracking-wide">Offer summary</p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Principal",       value: formatRupee(principal),               note: "Amount you receive" },
              { label: "Monthly EMI",     value: formatRupee(preview.emi),             note: "For 12 months", highlight: true },
              { label: "Interest rate",   value: `${ANNUAL_INTEREST_RATE}% p.a.`,      note: "Reducing balance" },
              { label: "APR (prototype)", value: `${apr}%`,                             note: APR_NOTE.slice(0, 40) + "…" },
              { label: "Processing fee",  value: formatRupee(preview.processingFee),   note: PROCESSING_FEE_NOTE.slice(0, 30) + "…" },
              { label: "Total interest",  value: formatRupee(preview.totalInterest),   note: `Over ${tenure} months` },
            ].map(({ label, value, note, highlight }) => (
              <div key={label} className={`rounded-xl p-3 ${highlight ? "bg-blue-600/30 border border-blue-500/30" : "bg-white/5 border border-white/10"}`}>
                <p className="text-xs text-blue-300 mb-0.5">{label}</p>
                <p className={`text-sm font-bold ${highlight ? "text-white text-base" : "text-white"}`}>{value}</p>
                <p className="text-xs text-blue-400/60 mt-0.5 leading-tight">{note}</p>
              </div>
            ))}
          </div>

          {/* Total repayable — highlighted */}
          <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
            <p className="text-xs text-blue-300 mb-1">Total amount repayable</p>
            <p className="text-2xl font-bold text-white">{formatRupee(preview.totalCostWithFee)}</p>
            <p className="text-xs text-blue-300/70 mt-0.5">
              Including {formatRupee(preview.processingFee)} processing fee
            </p>
          </div>

          <p className="text-xs text-blue-400/40">
            Prototype assumption · Not a real loan offer · Synthetic data only
          </p>
        </div>

        {/* Right — amortisation */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">Repayment schedule</p>
            <button
              onClick={() => setShowFullSchedule(v => !v)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              {showFullSchedule ? "Show less" : "Show all months"}
            </button>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-4 gap-1 px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-medium text-slate-500">
            <span>Month</span>
            <span className="text-right">EMI</span>
            <span className="text-right text-blue-600">Principal</span>
            <span className="text-right text-amber-600">Interest</span>
          </div>

          {/* Rows */}
          <div className="overflow-y-auto" style={{ maxHeight: showFullSchedule ? "400px" : "260px" }}>
            {schedule.map((row, i) => (
              <motion.div
                key={row.month}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`grid grid-cols-4 gap-1 px-4 py-2.5 text-xs border-b border-slate-50 ${
                  i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                }`}
              >
                <span className="text-slate-600 font-medium">{row.month}</span>
                <span className="text-right text-slate-700">{formatRupee(row.emi)}</span>
                <span className="text-right text-blue-700 font-medium">{formatRupee(row.principal)}</span>
                <span className="text-right text-amber-700">{formatRupee(row.interest)}</span>
              </motion.div>
            ))}
          </div>

          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
            <div className="grid grid-cols-4 gap-1 text-xs font-semibold text-slate-800">
              <span>Total</span>
              <span className="text-right">{formatRupee(preview.totalRepayable)}</span>
              <span className="text-right text-blue-700">{formatRupee(principal)}</span>
              <span className="text-right text-amber-700">{formatRupee(preview.totalInterest)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key insight callout */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex gap-2">
        <Info size={14} className="text-blue-600 shrink-0 mt-0.5" aria-hidden="true"/>
        <p className="text-xs text-blue-800 leading-relaxed">
          <strong>Why does month 1 cost more?</strong> On a reducing-balance loan, interest is charged
          on the outstanding balance. Month 1: ₹{schedule[0]?.interest.toFixed(0)} interest.
          Month {tenure}: ₹{schedule[tenure - 1]?.interest.toFixed(0)} interest.
          The balance reduces as you repay — so does the interest.
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <Link href={`/offer/${token}/kfs`} className="flex-1 sm:flex-none">
          <Button size="lg" className="w-full">
            Review Key Facts Statement <ArrowRight size={16} className="ml-2"/>
          </Button>
        </Link>
        <Button variant="secondary" size="lg" onClick={() => router.back()}>Go back</Button>
      </div>
    </div>
  );
}
