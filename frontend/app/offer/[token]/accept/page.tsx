
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";
import SaveTokenDisplay from "@/components/shared/SaveTokenDisplay";
import { calculateEmi, formatRupee } from "@/lib/emi";
import { ANNUAL_INTEREST_RATE } from "@/lib/constants";

export default function AcceptPage() {
  const { token } = useParams();
  const router = useRouter();
  const [loanData, setLoanData] = useState<Record<string, string> | null>(null);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const ld = sessionStorage.getItem("loan_data");
    if (ld) setLoanData(JSON.parse(ld));
  }, []);

  const principal = Number(loanData?.amount) || 30000;
  const tenure    = Number(loanData?.tenure) || 12;
  const preview   = calculateEmi(principal, ANNUAL_INTEREST_RATE, tenure);

  const handleAccept = () => {
    sessionStorage.setItem("offer_accepted_at", new Date().toISOString());
    setAccepted(true);
  };

  if (accepted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 flex flex-col gap-5">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex gap-4 items-start">
          <CheckCircle2 size={28} className="text-blue-600 shrink-0 mt-0.5"/>
          <div>
            <h1 className="text-xl font-bold text-slate-900 mb-1">Offer accepted</h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your prototype loan has been accepted. In a real flow, disbursement would follow within 1-2 business days.
              This is a prototype — no real disbursement will occur.
            </p>
          </div>
        </div>

        {preview && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-sm font-semibold text-slate-800 mb-3">Accepted terms</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Principal",     value: formatRupee(principal) },
                { label: "Monthly EMI",   value: formatRupee(preview.emi) },
                { label: "Tenure",        value: `${tenure} months` },
                { label: "Total repayable", value: formatRupee(preview.totalCostWithFee) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-slate-800">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <SaveTokenDisplay token={String(token)} />

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <p className="text-xs text-amber-800">
            <strong>Cooling-off period:</strong> You may cancel within 3 days (prototype assumption).
            {" "}<Link href={`/cancel/${token}`} className="underline hover:text-amber-900">Cancel this loan</Link>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href={`/repayment/${token}`} className="flex-1 sm:flex-none">
            <Button size="lg" className="w-full">
              View repayment dashboard <ArrowRight size={16} className="ml-2"/>
            </Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" size="lg">Return home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 flex flex-col gap-5">
      <header>
        <p className="text-xs font-medium text-blue-600 mb-1 uppercase tracking-wide">Final step</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Confirm acceptance</h1>
        <p className="text-sm text-slate-500">This is the last step. After this, the prototype loan is accepted.</p>
      </header>

      {preview && (
        <div className="bg-[#0f1f3d] rounded-2xl p-5">
          <p className="text-xs text-blue-300 mb-3 font-medium">You are accepting</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Principal",      value: formatRupee(principal) },
              { label: "Monthly EMI",    value: formatRupee(preview.emi), highlight: true },
              { label: "Interest rate",  value: `${ANNUAL_INTEREST_RATE}% p.a.` },
              { label: "Total cost",     value: formatRupee(preview.totalCostWithFee) },
            ].map(({ label, value, highlight }) => (
              <div key={label} className={`rounded-xl p-3 ${highlight ? "bg-blue-600/30 border border-blue-500/30" : "bg-white/5 border border-white/10"}`}>
                <p className="text-xs text-blue-300 mb-0.5">{label}</p>
                <p className={`text-sm font-bold text-white ${highlight ? "text-base" : ""}`}>{value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-blue-400/50 mt-3">Prototype · Not a real loan · Synthetic data only</p>
        </div>
      )}

      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
        <p className="text-xs text-slate-600 leading-relaxed">
          By accepting, you confirm you have read the Key Facts Statement and understood all costs.
          This is a prototype acceptance — no real financial commitment is made.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button size="lg" onClick={handleAccept} className="flex-1 sm:flex-none">
          Accept this loan offer <ArrowRight size={16} className="ml-2"/>
        </Button>
        <Button variant="secondary" size="lg" onClick={() => router.back()}>Go back</Button>
      </div>
    </div>
  );
}
