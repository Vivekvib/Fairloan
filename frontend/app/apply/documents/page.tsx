"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle2, ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";

const DOCS = [
  {
    id: "id_proof",
    label: "Identity proof",
    hint: "Any government-issued photo ID — Aadhaar card, PAN card, passport, voter ID",
    required: true,
  },
  {
    id: "income_proof",
    label: "Income proof",
    hint: "Last 3 months' salary slips OR bank statement showing salary credits",
    required: true,
    warning: "Salary slips may signal a loan application to your employer. Bank statement is an alternative.",
  },
  {
    id: "address_proof",
    label: "Address proof",
    hint: "Utility bill, rental agreement, or Aadhaar address",
    required: false,
  },
];

export default function DocumentsPage() {
  const router = useRouter();
  const [uploaded, setUploaded] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const handleMockUpload = (docId: string) => {
    // Simulate upload — no real file stored
    setUploaded(prev => ({ ...prev, [docId]: `mock_${docId}_${Date.now()}.pdf` }));
  };

  const handleNext = () => {
    const missing = DOCS.filter(d => d.required && !uploaded[d.id]);
    if (missing.length > 0) {
      setError(`Please upload: ${missing.map(d => d.label).join(", ")}`);
      return;
    }
    sessionStorage.setItem("documents_data", JSON.stringify(uploaded));
    router.push("/apply/review");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-10 items-start">

      {/* Left */}
      <div className="lg:sticky lg:top-20 flex flex-col gap-4">
        <div>
          <p className="text-xs font-medium text-blue-600 mb-1 uppercase tracking-wide">Step 5 of 5</p>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Document upload</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Mock upload only — no real files are stored. Click "Upload" to simulate the flow.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-amber-800 mb-1">Prototype note</p>
          <p className="text-xs text-amber-700 leading-relaxed">
            In a real application, files would be encrypted and stored securely.
            This prototype simulates the upload flow without storing any real files.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-700 mb-2">Acceptable formats (real flow)</p>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• PDF, JPG, PNG — max 5MB each</li>
            <li>• Document must be clear and readable</li>
            <li>• Both sides of ID cards where applicable</li>
          </ul>
        </div>
      </div>

      {/* Right — document upload cards */}
      <div className="flex flex-col gap-4">
        {DOCS.map(doc => (
          <div key={doc.id}
            className={`border rounded-xl p-4 transition-colors ${
              uploaded[doc.id]
                ? "border-blue-200 bg-blue-50/30"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-slate-800">{doc.label}</p>
                  {doc.required
                    ? <span className="text-xs text-red-500">Required</span>
                    : <span className="text-xs text-slate-400">Optional</span>}
                </div>
                <p className="text-xs text-slate-500 mb-2">{doc.hint}</p>
                {doc.warning && !uploaded[doc.id] && (
                  <p className="text-xs text-amber-600 mb-2">⚠ {doc.warning}</p>
                )}
                {uploaded[doc.id] && (
                  <div className="flex items-center gap-1.5 text-xs text-blue-700">
                    <CheckCircle2 size={13} aria-hidden="true"/>
                    Mock file uploaded: {uploaded[doc.id]}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleMockUpload(doc.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  uploaded[doc.id]
                    ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                    : "bg-white border-slate-300 text-slate-700 hover:border-blue-400 hover:text-blue-700"
                }`}
              >
                <Upload size={13} aria-hidden="true"/>
                {uploaded[doc.id] ? "Re-upload" : "Upload"}
              </button>
            </div>
          </div>
        ))}

        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <Button size="lg" onClick={handleNext} className="flex-1 sm:flex-none">
            Review application <ArrowRight size={16} className="ml-2"/>
          </Button>
          <Button variant="secondary" size="lg" onClick={() => router.back()}>Go back</Button>
        </div>
      </div>
    </div>
  );
}
