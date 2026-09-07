import EligibilityForm from "@/components/eligibility/EligibilityForm";

export const metadata = {
  title: "Check Eligibility — FairLoan",
};

export default function EligibilityCheckPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-10 items-start">

      {/* Left — context (sticky on desktop) */}
      <div className="lg:sticky lg:top-20">
        <p className="text-xs font-medium text-blue-600 mb-1 uppercase tracking-wide">Step 1 of 5</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Eligibility pre-check</h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          Two minutes. No credit bureau impact. No account needed.
        </p>

        {/* What happens next — compact */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-800 mb-2">What happens next</p>
          <ul className="flex flex-col gap-1.5 text-xs text-blue-700">
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-xs font-bold shrink-0">1</span>
              We run 5 transparent prototype rules
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-xs font-bold shrink-0">2</span>
              You see the result + plain-language explanation
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-xs font-bold shrink-0">3</span>
              You get a reference number to resume later
            </li>
          </ul>
        </div>
      </div>

      {/* Right — form */}
      <div>
        <EligibilityForm />
      </div>
    </div>
  );
}
