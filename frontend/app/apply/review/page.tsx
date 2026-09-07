"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Edit2, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/button";
import { calculateEmi, formatRupee } from "@/lib/emi";
import { ANNUAL_INTEREST_RATE } from "@/lib/constants";

export default function ReviewPage() {
  const router = useRouter();
  const [income, setIncome]       = useState<Record<string, string> | null>(null);
  const [loan, setLoan]           = useState<Record<string, string> | null>(null);
  const [docs, setDocs]           = useState<Record<string, string> | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setIncome(JSON.parse(sessionStorage.getItem("income_data") || "null"));
    setLoan(JSON.parse(sessionStorage.getItem("loan_data") || "null"));
    setDocs(JSON.parse(sessionStorage.getItem("documents_data") || "null"));
  }, []);

  const preview = loan
    ? calculateEmi(Number(loan.amount), ANNUAL_INTEREST_RATE, Number(loan.tenure))
    : null;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 900)); // Simulate API call
      sessionStorage.setItem("application_submitted", "true");
      router.push("/apply/submitted");
    } finally {
      setSubmitting(false);
    }
  };

  const SECTIONS = [
    {
      title: "Income & employment",
      href: "/apply/income",
      items: income ? [
        { label: "Employment type",   value: income.employment_type || "—" },
        { label: "Employer",          value: income.employer_name || "—" },
        { label: "Monthly income",    value: income.monthly_income ? `₹${Number(income.monthly_income).toLocaleString("en-IN")}/month` : "—" },
        { label: "Tenure",            value: income.employment_tenure_months ? `${income.employment_tenure_months} months` : "—" },
        { label: "Existing EMI",      value: income.existing_monthly_emi ? `₹${Number(income.existing_monthly_emi).toLocaleString("en-IN")}/month` : "₹0/month" },
      ] : [],
    },
    {
      title: "Loan details",
      href: "/apply/loan",
      items: loan ? [
        { label: "Amount",            value: loan.amount ? formatRupee(Number(loan.amount)) : "—" },
        { label: "Tenure",            value: `${loan.tenure} months` },
        { label: "Purpose",           value: loan.purpose || "—" },
        { label: "Monthly EMI",       value: preview ? formatRupee(preview.emi) : "—" },
        { label: "Total repayable",   value: preview ? formatRupee(preview.totalRepayable) : "—" },
        { label: "Processing fee",    value: preview ? formatRupee(preview.processingFee) : "—" },
        { label: "Total cost",        value: preview ? formatRupee(preview.totalCostWithFee) : "—" },
      ] : [],
    },
    {
      title: "Documents",
      href: "/apply/documents",
      items: docs ? Object.entries(docs).map(([k, v]) => ({
        label: k.replace(/_/g, " "),
        value: v ? "✓ Uploaded (mock)" : "—",
      })) : [],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-6">
        <p className="text-xs font-medium text-blue-600 mb-1 uppercase tracking-wide">Review</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Review your application</h1>
        <p className="text-sm text-slate-500">Check everything before you submit. You can edit any section.</p>
      </header>

      <div className="flex flex-col gap-4 mb-6">
        {SECTIONS.map(({ title, href, items }) => (
          <div key={title} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
              <Link href={href}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                <Edit2 size={12}/> Edit
              </Link>
            </div>
            <div className="px-4 py-3 grid sm:grid-cols-2 gap-x-6 gap-y-2">
              {items.map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-slate-500 mb-0.5 capitalize">{label}</p>
                  <p className="text-sm font-medium text-slate-800">{value}</p>
                </div>
              ))}
              {items.length === 0 && (
                <p className="text-sm text-slate-400 col-span-2">No data — go back and complete this section.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Prototype disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-6">
        <p className="text-xs text-slate-500 leading-relaxed">
          <strong>Prototype:</strong> Submitting this application creates a synthetic record only.
          No real loan will be created. No real credit decision will be made.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button size="lg" onClick={handleSubmit} disabled={submitting} className="flex-1 sm:flex-none">
          {submitting ? "Submitting…" : "Submit application"}
          <ArrowRight size={16} className="ml-2"/>
        </Button>
        <Button variant="secondary" size="lg" onClick={() => router.back()}>Go back</Button>
      </div>
    </div>
  );
}
