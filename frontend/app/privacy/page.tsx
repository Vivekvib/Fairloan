import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
      <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-xs text-amber-700 mb-6">
        Prototype document — not a real legal agreement
      </div>

      <div className="flex flex-col gap-4 text-sm text-slate-600">
        {[
          { title: "Data we collect", body: "In this prototype, all data entered is synthetic and used only to demonstrate the application flow. No real personal, financial, or identity information is collected, stored, or processed." },
          { title: "Data we do not collect", body: "Real PAN, Aadhaar, or government ID numbers · Real bank account details · Contacts, call logs, or messages · Exact location data · Social media information" },
          { title: "Analytics", body: "Prototype analytics events are session-scoped and not linked to any user identity. Used only to understand how the prototype is navigated, for product research." },
          { title: "Consent", body: "The consent flow demonstrates what responsible data-collection consent should look like — separating necessary from optional consents, explaining each purpose, and providing a clear withdrawal path." },
        ].map(({ title, body }) => (
          <div key={title} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="font-semibold text-slate-800 mb-1 text-sm">{title}</p>
            <p className="text-xs leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
