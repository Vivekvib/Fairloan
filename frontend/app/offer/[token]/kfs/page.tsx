
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileText, ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";
import { calculateEmi, formatRupee } from "@/lib/emi";
import { ANNUAL_INTEREST_RATE } from "@/lib/constants";

export default function KfsPage() {
  const { token } = useParams();
  const router    = useRouter();
  const [loanData, setLoanData] = useState<Record<string, string> | null>(null);
  const [confirmed, setConfirmed]   = useState(false);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const ld = sessionStorage.getItem("loan_data");
    if (ld) setLoanData(JSON.parse(ld));
    const start = Date.now();
    const interval = setInterval(() => {
      setTimeOnPage(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const principal = Number(loanData?.amount) || 30000;
  const tenure    = Number(loanData?.tenure) || 12;
  const purpose   = loanData?.purpose || "personal";
  const preview   = calculateEmi(principal, ANNUAL_INTEREST_RATE, tenure);
  if (!preview) return null;

  const apr = (ANNUAL_INTEREST_RATE + 2).toFixed(2);
  const firstEmiDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const handleAccept = async () => {
    setSubmitting(true);
    sessionStorage.setItem("kfs_confirmed_at", new Date().toISOString());
    sessionStorage.setItem("kfs_time_on_screen_sec", String(timeOnPage));
    await new Promise(r => setTimeout(r, 600));
    router.push(`/offer/${token}/accept`);
  };

  const KFS_ROWS = [
    { label: "Loan amount (principal)",  value: formatRupee(principal),               bold: false },
    { label: "Annual interest rate",      value: `${ANNUAL_INTEREST_RATE}% p.a.`,      bold: false },
    { label: "Annual Percentage Rate",    value: `${apr}% (prototype estimate)`,        bold: false },
    { label: "Loan tenure",               value: `${tenure} months`,                    bold: false },
    { label: "Monthly EMI",               value: formatRupee(preview.emi),              bold: true  },
    { label: "Total interest payable",    value: formatRupee(preview.totalInterest),    bold: false },
    { label: "Processing fee (2%)",       value: formatRupee(preview.processingFee),    bold: false },
    { label: "Total amount repayable",    value: formatRupee(preview.totalCostWithFee), bold: true  },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
          <FileText size={20} className="text-blue-600" />
        </div>
        <div>
          <p className="text-xs font-medium text-blue-600 mb-0.5 uppercase tracking-wide">Key Facts Statement</p>
          <h1 className="text-2xl font-bold text-slate-900">Read this before you accept</h1>
          <p className="text-sm text-slate-500 mt-1">RBI guidelines require this summary before loan acceptance. Prototype — not legally compliant.</p>
        </div>
      </div>

      <div className="border-2 border-blue-200 rounded-2xl overflow-hidden">
        <div className="bg-blue-600 px-5 py-3 flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-sm">KEY FACTS STATEMENT</p>
            <p className="text-blue-200 text-xs">Prototype · Synthetic data only</p>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-1.5 text-right">
            <p className="text-white text-xs font-medium">Issued</p>
            <p className="text-blue-200 text-xs">{new Date().toLocaleDateString("en-IN")}</p>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-4">

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Cost summary</p>
            <div className="bg-slate-50 rounded-xl overflow-hidden">
              {KFS_ROWS.map(({ label, value, bold }, i) => (
                <div key={label}
                  className={`flex justify-between items-center px-4 py-2.5 text-sm border-b border-slate-200 last:border-0 ${bold ? "bg-blue-50 font-semibold" : i % 2 === 0 ? "bg-white" : ""}`}>
                  <span className={bold ? "text-slate-900" : "text-slate-600"}>{label}</span>
                  <span className={bold ? "text-blue-700 text-base" : "text-slate-800"}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100"/>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Repayment</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Number of instalments", value: `${tenure} monthly EMIs` },
                { label: "First EMI due",          value: firstEmiDate },
                { label: "EMI amount",             value: formatRupee(preview.emi) },
                { label: "Payment method",         value: "Auto-debit (prototype)" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-slate-800">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100"/>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Late payment <span className="text-amber-600 font-normal normal-case">[Prototype assumption]</span>
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <ul className="text-xs text-slate-700 space-y-1.5">
                <li>• Penal interest of 2% p.m. on overdue amount (prototype assumption)</li>
                <li>• Adverse credit bureau reporting after 30 days overdue (prototype assumption)</li>
                <li>• Recovery process after 90 days overdue (prototype assumption)</li>
              </ul>
              <p className="text-xs text-amber-700 mt-2 font-medium">A real lender must disclose exact charges in the loan agreement.</p>
            </div>
          </div>

          <div className="border-t border-slate-100"/>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Cooling-off <span className="text-amber-600 font-normal normal-case">[Prototype assumption]</span>
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              This prototype assumes a 3-day cooling-off period after acceptance. In a real flow, terms are governed by the loan agreement and RBI guidelines.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400">
        <div className={`w-2 h-2 rounded-full ${timeOnPage >= 15 ? "bg-green-400" : "bg-amber-400"}`}/>
        {timeOnPage < 15
          ? `Reading time: ${timeOnPage}s — we recommend at least 15 seconds on this page`
          : `Reading time: ${timeOnPage}s ✓`}
      </div>

      <div className={`border rounded-xl px-4 py-4 flex gap-3 items-start cursor-pointer transition-colors ${confirmed ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"}`}
        onClick={() => setConfirmed(v => !v)}>
        <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)}
          className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" id="kfs-confirm"/>
        <label htmlFor="kfs-confirm" className="text-sm text-slate-700 leading-relaxed cursor-pointer">
          I have read and understood the Key Facts Statement. I understand the total cost, monthly EMI, and late payment consequences.
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button size="lg" onClick={handleAccept} disabled={!confirmed || submitting} className="flex-1 sm:flex-none">
          {submitting ? "Confirming…" : "I understand — accept offer"}
          <ArrowRight size={16} className="ml-2"/>
        </Button>
        <Button variant="secondary" size="lg" onClick={() => router.back()}>Go back and review</Button>
      </div>
      {!confirmed && <p className="text-xs text-center text-slate-400">You must confirm you have read the KFS before accepting.</p>}
    </div>
  );
}
