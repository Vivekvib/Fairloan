export const metadata = {
  title: "Privacy Policy — FairLoan",
};

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. About this document",
      body: `This privacy policy applies to FairLoan, an educational product-management portfolio prototype built by Vivek Nishad. FairLoan is not a real lending product and is not operated by a licensed lender. This document is provided for demonstration purposes to show what a responsible privacy policy for a digital lending product should contain. It is not a legally binding commitment.`,
    },
    {
      title: "2. Data we collect",
      body: `FairLoan collects only the information you enter into the application forms. All data entered is synthetic — you are explicitly instructed not to enter real personal, financial, or identity information at any point in the flow. The prototype stores form inputs in your browser's session storage and, where a backend call is made, in a SQLite database on a free-tier server. No data is shared with third parties. No data is sold or used for advertising.`,
    },
    {
      title: "3. Data we do not collect",
      body: `FairLoan does not collect, request, or store: real PAN or Aadhaar numbers, real bank account details, real salary slips or financial documents, contact lists or call logs, device location, messages or photos, social media account information, or any biometric data. The prototype explicitly tells users not to enter real personal data before asking for any input.`,
    },
    {
      title: "4. Cookies and analytics",
      body: `FairLoan does not use advertising cookies or third-party tracking. Session storage is used to pass data between pages within a single browser session. This data is cleared when the browser tab is closed. Anonymous session-scoped analytics events may be logged to understand prototype usage patterns. These events are not linked to any user identity.`,
    },
    {
      title: "5. Data retention",
      body: `Any data submitted through the prototype may be stored on a free-tier cloud database for up to 30 days and then deleted. Because all data is synthetic, no personally identifiable information is retained. If you believe real personal data was accidentally submitted, contact the project maintainer at the address below to request deletion.`,
    },
    {
      title: "6. Your rights",
      body: `Under applicable data protection laws, individuals have the right to access, correct, or delete personal data held about them. Because FairLoan instructs users not to submit real personal data and operates only with synthetic data, there is typically no personal data to access, correct, or delete. If you have a concern, contact the project maintainer.`,
    },
    {
      title: "7. RBI reference",
      body: `This prototype references the Reserve Bank of India Master Directions on Digital Lending (2022) for design inspiration. The privacy and consent flows are designed to demonstrate the spirit of those guidelines. This prototype is not RBI-regulated, not RBI-compliant, and not operated by a Regulated Entity as defined in those directions.`,
    },
    {
      title: "8. Contact",
      body: `For questions about this privacy policy or to request data deletion, contact: Vivek Nishad via LinkedIn or the GitHub repository at github.com/Vivekvib/Fairloan.`,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <header className="mb-8 pb-6 border-b border-slate-200">
        <div className="inline-block border border-amber-300 bg-amber-50 rounded-sm px-3 py-1 text-xs text-amber-700 font-medium mb-4">
          Prototype document — not a real legal agreement
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
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
