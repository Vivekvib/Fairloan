"use client";

import { useState } from "react";
import { X } from "lucide-react";

/**
 * PrototypeBanner — Item 3: single-line, session-dismissible.
 * Uses React state only — no localStorage — so it reappears on
 * every new session. The prototype disclaimer page carries the full text.
 */
export default function PrototypeBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      role="banner"
      aria-label="Prototype disclaimer"
      className="w-full bg-blue-950 border-b border-blue-800 px-4 py-2 flex items-center justify-between gap-4"
    >
      <p className="text-xs text-blue-300 flex-1 text-center">
        🎓 <strong className="text-white">Educational prototype</strong> — synthetic data only, no real loans.{" "}
        <a href="/disclaimer" className="underline underline-offset-2 hover:text-white transition-colors">
          Full disclaimer
        </a>
      </p>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss prototype notice"
        className="text-blue-400 hover:text-white transition-colors shrink-0"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
