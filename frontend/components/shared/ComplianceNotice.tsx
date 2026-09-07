import { FileText } from "lucide-react";

/**
 * ComplianceNotice — Item 3: neutral gray, for legal/prototype disclaimers.
 * Smaller text, outlined style. Used sparingly — max 2 pages full text,
 * others link to /disclaimer.
 */
export default function ComplianceNotice({ children }: { children: React.ReactNode }) {
  return (
    <div role="note"
      className="flex gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
      <FileText size={14} className="text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="text-xs text-slate-500 leading-relaxed">{children}</div>
    </div>
  );
}
