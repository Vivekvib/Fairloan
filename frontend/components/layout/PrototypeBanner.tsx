"use client";

import { useState } from "react";
import { X } from "lucide-react";

/**
 * PrototypeBanner — single line, session-dismissible.
 * No emojis. No bold claims. Plain factual statement.
 */
export default function PrototypeBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      role="banner"
      aria-label="Prototype notice"
      className="w-full bg-[#0f1f3d] border-b border-white/10 px-4 py-2 flex items-center justify-between gap-4"
    >
      <p className="text-xs text-blue-300 flex-1 text-center">
        Educational prototype — synthetic data only, no real loans or credit decisions.{" "}
        <a href="/disclaimer" className="underline underline-offset-2 hover:text-white transition-colors">
          Full disclaimer
        </a>
      </p>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss notice"
        className="text-blue-400 hover:text-white transition-colors shrink-0"
      >
        <X size={13} aria-hidden="true" />
      </button>
    </div>
  );
}
