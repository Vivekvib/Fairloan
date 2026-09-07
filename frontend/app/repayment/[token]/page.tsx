
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock, ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";
import { calculateEmi, formatRupee } from "@/lib/emi";
import { ANNUAL_INTEREST_RATE } from "@/lib/constants";

export default function RepaymentPage() {
  const { token } = useParams();
  const [loanData, setLoanData] = useState(null);

  useEffect(() => {
    const ld = sessionStorage.getItem("loan_data");
    if (ld) setLoanData(JSON.parse(ld));
  }, []);

  const principal = Number(loanData?.amount) || 30000;
  const tenure    = Number(loanData?.tenure) || 12;
  const preview   = calculateEmi(principal, ANNUAL_INTEREST_RATE, tenure);

  const firstEmiDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const SYNTHETIC_SCHEDULE = Array.from({ length: tenure }, (_, i) => {
    const r = ANNUAL_INTEREST_RATE / 1200;
    const compound = Math.pow(1 + r, tenure);
    const emi = preview ? preview.emi : 0;
    const bal = principal * Math.pow(1 + r, i + 1) - emi * (Math.pow(1 + r, i + 1) - 1) / r;
    return {
      month: i + 1,
      emi: preview?.emi || 0,
      status: i === 0 ? "upcoming" : "scheduled",
      dueDate: new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000)
        .toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    };
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">

      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-blue-600 mb-1 uppercase tracking-wide">Repayment dashboard</p>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Your loan</h1>
          <p className="text-xs text-slate-500">
            Prototype · Synthetic data only · Read-only dashboard
          </p>
        </div>
        <Link href={`/cancel/${token}`}>
          <Button variant="secondary" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
            Cancel loan
          </Button>
        </Link>
      </header>

      {/* Summary strip */}
      {preview && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Loan amount",      value: formatRupee(principal) },
            { label: "Monthly EMI",      value: formatRupee(preview.emi), highlight: true },
            { label: "Outstanding",      value: formatRupee(principal) },
            { label: "Next due",         value: firstEmiDate },
          ].map(({ label, value, highlight }) => (
            <div key={label} className={`rounded-2xl p-4 border ${highlight ? "bg-[#0f1f3d] border-blue-900" : "bg-white border-slate-200"}`}>
              <p className={`text-xs mb-1 ${highlight ? "text-blue-300" : "text-slate-500"}`}>{label}</p>
              <p className={`text-sm font-bold ${highlight ? "text-white" : "text-slate-900"}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming instalment */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <Clock size={18} className="text-blue-600"/>
          </div>
          <div>
            <p className="text-xs text-blue-600 font-medium">Next payment due</p>
            <p className="text-lg font-bold text-slate-900">{preview ? formatRupee(preview.emi) : "—"}</p>
            <p className="text-xs text-slate-600">{firstEmiDate}</p>
          </div>
        </div>
        <Button size="sm" className="shrink-0">Pay now (mock)</Button>
      </div>

      {/* Payment schedule */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
          <p className="text-sm font-semibold text-slate-800">Payment schedule</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">Month</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">Due date</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-500">Amount</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {SYNTHETIC_SCHEDULE.map((row, i) => (
                <tr key={row.month} className={`border-b border-slate-50 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                  <td className="px-4 py-2.5 text-slate-700 font-medium">{row.month}</td>
                  <td className="px-4 py-2.5 text-slate-600">{row.dueDate}</td>
                  <td className="px-4 py-2.5 text-right text-slate-800 font-medium">{preview ? formatRupee(row.emi) : "—"}</td>
                  <td className="px-4 py-2.5 text-right">
                    {row.status === "upcoming"
                      ? <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2 py-0.5"><Clock size={10}/>Upcoming</span>
                      : <span className="text-xs text-slate-400">Scheduled</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Support link */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
        <p className="text-sm text-slate-600">Have a question about your repayment?</p>
        <Link href="/support/faq">
          <Button variant="ghost" size="sm">Get help <ArrowRight size={13} className="ml-1"/></Button>
        </Link>
      </div>

      <p className="text-xs text-center text-slate-400">
        Prototype dashboard · Read-only · Synthetic data only · No real payments processed
      </p>
    </div>
  );
}
