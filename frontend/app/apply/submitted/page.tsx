"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";
import SaveTokenDisplay from "@/components/shared/SaveTokenDisplay";

export default function SubmittedPage() {
  const [refToken] = useState(() =>
    `${crypto.randomUUID()}`
  );

  useEffect(() => {
    sessionStorage.setItem("application_token", refToken);
  }, [refToken]);

  return (
    <div className="max-w-xl mx-auto px-4 py-12 flex flex-col gap-5">

      {/* Success state */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex gap-4 items-start">
        <CheckCircle2 size={28} className="text-blue-600 shrink-0 mt-0.5" aria-hidden="true"/>
        <div>
          <h1 className="text-xl font-bold text-slate-900 mb-1">Application submitted</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your prototype application has been received. A synthetic loan offer will be generated.
            This is not a real application — no credit decision will be made.
          </p>
        </div>
      </div>

      {/* What happens next */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <p className="text-sm font-semibold text-slate-800 mb-3">What happens next</p>
        <div className="flex flex-col gap-3">
          {[
            { step: "1", text: "Prototype eligibility rules run automatically" },
            { step: "2", text: "A synthetic loan offer is generated" },
            { step: "3", text: "You review the full cost breakdown before accepting" },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                {step}
              </div>
              <p className="text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reference token */}
      <SaveTokenDisplay token={refToken} />

      {/* Prototype note */}
      <p className="text-xs text-slate-400 text-center">
        Prototype submission — synthetic data only. No real loan created.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <Link href={`/offer/${refToken}`} className="flex-1 sm:flex-none">
          <Button size="lg" className="w-full">
            View your offer <ArrowRight size={16} className="ml-2"/>
          </Button>
        </Link>
        <Link href="/">
          <Button variant="secondary" size="lg">Return home</Button>
        </Link>
      </div>
    </div>
  );
}
