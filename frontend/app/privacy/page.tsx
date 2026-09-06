export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-slate">
      <h1>Privacy Policy (Prototype)</h1>
      <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 not-prose text-sm">
        This is a prototype privacy policy for an educational project. It is not
        a real legal document and does not constitute a binding privacy commitment.
      </p>
      <h2>Data we collect</h2>
      <p>
        In this prototype, all data entered is synthetic and used only to
        demonstrate the application flow. No real personal, financial, or
        identity information is collected, stored, or processed.
      </p>
      <h2>Data we do not collect</h2>
      <ul>
        <li>Real PAN, Aadhaar, or government ID numbers</li>
        <li>Real bank account details</li>
        <li>Contacts, call logs, or messages</li>
        <li>Exact location data</li>
        <li>Social media information</li>
      </ul>
      <h2>Analytics</h2>
      <p>
        Prototype analytics events are session-scoped and not linked to any
        user identity. They are used only to understand how the prototype is
        navigated, for product research purposes.
      </p>
      <h2>Consent</h2>
      <p>
        The consent flow in this prototype demonstrates what responsible
        data-collection consent should look like — separating necessary from
        optional consents, explaining the purpose of each, and providing a clear
        withdrawal path.
      </p>
    </div>
  );
}
