"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

/**
 * SaveTokenDisplay — shows the user their resume token after eligibility check.
 * No account required. The token is their key to resume later.
 */
export default function SaveTokenDisplay({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
      <p className="text-sm font-medium text-brand-900 mb-1">
        Your application reference number
      </p>
      <p className="text-xs text-brand-700 mb-3">
        Save this — you can use it to resume your application without creating
        an account.
      </p>
      <div className="flex items-center gap-2">
        <code className="flex-1 bg-white border border-brand-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-800 truncate">
          {token}
        </code>
        <button
          onClick={handleCopy}
          aria-label="Copy reference number"
          className="shrink-0 p-2 rounded-lg bg-white border border-brand-200 hover:bg-brand-50 text-brand-700 transition-colors"
        >
          {copied ? (
            <Check size={16} aria-hidden="true" />
          ) : (
            <Copy size={16} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
