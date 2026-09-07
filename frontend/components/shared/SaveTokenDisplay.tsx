"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

/**
 * SaveTokenDisplay — Item 7: displays human-readable FL-YYYY-XXXXXX code.
 * The raw UUID is never shown to the user. The friendly code is derived
 * client-side from the UUID for display only; the UUID is preserved in
 * sessionStorage for API calls.
 */
function toFriendlyCode(uuid: string): string {
  const year = new Date().getFullYear();
  // Take 6 chars from the UUID (strip hyphens), uppercase them
  const chars = uuid.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `FL-${year}-${chars}`;
}

export default function SaveTokenDisplay({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  const friendlyCode = toFriendlyCode(token);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(friendlyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <p className="text-sm font-medium text-blue-900 mb-1">
        Your application reference
      </p>
      <p className="text-xs text-blue-700 mb-3">
        Save this to resume your application later — no account needed.
      </p>
      <div className="flex items-center gap-2">
        <code className="flex-1 bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-800 tracking-widest">
          {friendlyCode}
        </code>
        <button
          onClick={handleCopy}
          aria-label="Copy reference number"
          className="shrink-0 p-2 rounded-lg bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 transition-colors"
        >
          {copied
            ? <Check size={16} aria-hidden="true" />
            : <Copy size={16} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
