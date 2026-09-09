export const metadata = {
  title: "Terms of Use — FairLoan",
};

export default function TermsPage() {
  const sections = [
    {
      title: "1. Nature of this service",
      body: `FairLoan is an educational product-management portfolio prototype. It is not a licensed lender, not a financial services provider, and not regulated by the Reserve Bank of India or any other authority. No real loan will be created, approved, disbursed, or collected through this prototype. All loan decisions, offers, eligibility results, and repayment schedules shown in this prototype are generated using synthetic data and prototype rules. They do not constitute real financial advice, real credit assessments, or real lending decisions.`,
    },
    {
      title: "2. Permitted use",
      body: `You may use FairLoan to explore its user interface, understand how a transparent digital lending experience might work, review the product design and engineering portfolio, and provide feedback to the project maintainer. You may not use FairLoan to submit real personal or financial information, attempt to obtain a real loan, circumvent any prototype safety measures, or misrepresent the prototype as a real lending product.`,
    },
    {
      title: "3. No financial advice",
      body: `Nothing in this prototype constitutes financial advice. The loan calculations, eligibility assessments, and offer screens are illustrative only. The 18% per annum interest rate, 2% processing fee, and all other financial parameters are prototype assumptions chosen for demonstration purposes. They do not reflect the rates or terms of any real lender. Do not make any real financial decision based on content shown in this prototype.`,
    },
    {
      title: "4. No real data",
      body: `You are explicitly instructed not to enter real personal data into this prototype at any point. This includes real name, phone number, PAN, Aadhaar, bank account details, salary information, or employer name. The prototype includes on-screen instructions to use synthetic values only. The project maintainer accepts no responsibility for real personal data accidentally submitted.`,
    },
    {
      title: "5. Accuracy of calculations",
      body: `The loan calculations in this prototype use the standard reducing-balance EMI formula. They are implemented in Python using the Decimal type to avoid floating-point errors. The calculations are believed to be arithmetically correct but are provided for demonstration only. They have not been audited or certified by any financial authority.`,
    },
    {
      title: "6. Regulatory references",
      body: `References to RBI Master Directions on Digital Lending (2022) throughout this prototype are for design-inspiration and educational purposes only. These references do not imply that this prototype is RBI-compliant, regulated, or endorsed by the RBI in any way. The regulatory labels used ("Regulatory requirement," "Recommended practice," "Prototype assumption") are the project maintainer's own categorisation and do not constitute legal advice.`,
    },
    {
      title: "7. Intellectual property",
      body: `The FairLoan prototype, including its source code, product design, written content, and data models, is the work of Vivek Nishad and is published openly on GitHub for portfolio review. The prototype may be referenced, linked to, or discussed for educational and professional evaluation purposes. It may not be reproduced, resold, or deployed as a real lending product.`,
    },
    {
      title: "8. Limitation of liability",
      body: `The FairLoan prototype is provided as-is for educational and portfolio purposes. The project maintainer makes no warranties regarding the accuracy, completeness, or fitness for any purpose of the content shown. The project maintainer accepts no liability for any loss or damage arising from use of or reliance on this prototype.`,
    },
    {
      title: "9. Changes to these terms",
      body: `These terms may be updated at any time. The date at the top of this page reflects the most recent version. Continued use of the prototype following any update constitutes acceptance of the revised terms.`,
    },
    {
      title: "10. Contact",
      body: `For questions about these terms, contact: Vivek Nishad via LinkedIn or the GitHub repository at github.com/Vivekvib/Fairloan.`,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <header className="mb-8 pb-6 border-b border-slate-200">
        <div className="inline-block border border-amber-300 bg-amber-50 rounded-sm px-3 py-1 text-xs text-amber-700 font-medium mb-4">
          Prototype document — not a real legal agreement
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Terms of Use</h1>
        <p className="text-sm text-slate-500">
          Last updated: September 2026. Applies to the FairLoan educational prototype only.
        </p>
      </header>

      <div className="flex flex-col gap-7">
        {sections.map(({ title, body }) => (
          <div key={title}>
            <h2 className="text-sm font-bold text-slate-900 mb-2">{title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
