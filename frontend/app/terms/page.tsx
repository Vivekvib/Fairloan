export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Terms of Use</h1>
      <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-xs text-amber-700 mb-6">
        Prototype document — not a real legal agreement
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-600 leading-relaxed space-y-3">
        <p>By using FairLoan, you acknowledge this is an educational portfolio prototype. No real financial transaction will occur. No real credit decision will be made. No real data will be collected.</p>
        <p>All loan calculations, eligibility results, and offers shown are for demonstration purposes only and should not be relied upon for any real financial decision.</p>
      </div>
    </div>
  );
}
