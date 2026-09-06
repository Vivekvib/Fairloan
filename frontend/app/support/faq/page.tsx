const FAQS = [
  {
    q: "Is FairLoan a real lending company?",
    a: "No. FairLoan is an educational prototype built as a product management portfolio project. No real loans are created, no real money is moved, and no real personal data is collected.",
  },
  {
    q: "Does the eligibility check affect my CIBIL score?",
    a: "No — and this is a prototype, so no real credit bureau is involved at all. In a real lending flow, a pre-check (soft enquiry) typically does not affect your CIBIL score, but a full application (hard enquiry) may. A real lender must tell you which type of check they are running.",
  },
  {
    q: "Why does the app ask for salary information?",
    a: "Income information is used to calculate affordability — whether the monthly repayment is manageable given your income. In a real lending flow, this would be verified against documents. In this prototype, all inputs are synthetic.",
  },
  {
    q: "What is a Key Facts Statement (KFS)?",
    a: "A KFS is a standardised summary of a loan offer's key terms — interest rate, APR, processing fee, EMI, total repayable, and first due date. RBI guidelines require lenders to provide a KFS before a borrower accepts a loan. FairLoan demonstrates what a KFS should look like.",
  },
  {
    q: "What is APR and how is it different from the interest rate?",
    a: "The interest rate is the annual cost of the loan principal only. APR (Annual Percentage Rate) includes the interest rate plus all mandatory fees — like a processing fee — expressed as a single annualised percentage. APR gives a more complete picture of the total cost of borrowing.",
  },
  {
    q: "What happens if I miss an EMI payment?",
    a: "In this prototype, late fees and consequences are labelled as assumptions — they are shown to demonstrate what a transparent disclosure should look like, not to reflect a real lender's policy. A real lender must disclose all late payment consequences in the loan agreement.",
  },
  {
    q: "Can I cancel my loan after accepting?",
    a: "The cooling-off flow in this prototype shows what a responsible cancellation experience should look like. RBI guidelines reference a cooling-off period for digital loans. All timing and fee assumptions in the prototype are clearly labelled.",
  },
  {
    q: "Who built this?",
    a: "FairLoan was built by Vivek Nishad, a Computer Science student at Delhi University, as a product management portfolio project demonstrating fintech domain knowledge, responsible design, and technical implementation.",
  },
];

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Frequently asked questions
        </h1>
        <p className="text-slate-600">
          Everything you need to know about this prototype.
        </p>
      </header>

      <dl className="flex flex-col gap-4">
        {FAQS.map(({ q, a }) => (
          <div
            key={q}
            className="bg-white border border-slate-200 rounded-xl p-5"
          >
            <dt className="font-semibold text-slate-900 mb-2 text-sm">{q}</dt>
            <dd className="text-sm text-slate-600 leading-relaxed">{a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
