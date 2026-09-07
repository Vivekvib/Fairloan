import { Info } from "lucide-react";

/**
 * TipCallout — Item 3: blue-tinted, for helpful/contextual guidance.
 * Use for: salary-slip note, save-token explanation, helpful hints.
 */
export default function TipCallout({ children }: { children: React.ReactNode }) {
  return (
    <div role="note" className="flex gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
      <Info size={16} className="text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="text-sm text-blue-800 leading-relaxed">{children}</div>
    </div>
  );
}
