import EligibilityForm from "@/components/eligibility/EligibilityForm";

export const metadata = {
  title: "Check Eligibility — FairLoan",
  description:
    "Find out if you might be eligible for a loan — no account needed, no credit bureau check.",
};

export default function EligibilityCheckPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <header className="mb-8">
        <p className="text-sm font-medium text-brand-700 mb-2">Step 1 of 5</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Eligibility pre-check
        </h1>
        <p className="text-slate-600 leading-relaxed">
          Answer a few questions to see if you might be eligible. This takes
          about two minutes and <strong>does not affect your credit score</strong>.
        </p>
      </header>

      <EligibilityForm />
    </div>
  );
}
