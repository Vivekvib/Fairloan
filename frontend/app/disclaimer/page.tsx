import Link from "next/link";

export default function DisclaimerPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Prototype Disclaimer</h1>
      <p className="text-sm text-slate-500 mb-6">
        FairLoan is an educational PM portfolio project by Vivek Nishad. Not a real lending product.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-800 mb-2 uppercase tracking-wide">What this is</p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>✓ Responsible lending UX demonstration</li>
            <li>✓ Synthetic data only</li>
            <li>✓ PM portfolio project</li>
            <li>✓ Reference for transparent lending design</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-red-800 mb-2 uppercase tracking-wide">What this is NOT</p>
          <ul className="text-xs text-red-700 space-y-1">
            <li>✗ A real lender or lending platform</li>
            <li>✗ RBI-compliant or legally regulated</li>
            <li>✗ Suitable for real financial decisions</li>
            <li>✗ Collecting real personal data</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
        <p className="font-semibold text-slate-700 mb-1">Regulatory reference</p>
        <p>
          References to RBI Master Directions on Digital Lending (2022) are for design inspiration only.
          All references are labelled as Regulatory Requirement, Recommended Practice, or Prototype Assumption.{" "}
          <a href="https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12957"
            target="_blank" rel="noopener noreferrer"
            className="text-blue-600 underline">Official source →</a>
        </p>
      </div>
    </div>
  );
}
