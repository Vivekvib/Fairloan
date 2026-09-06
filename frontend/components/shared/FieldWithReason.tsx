"use client";

import { InputHTMLAttributes, useState } from "react";
import { clsx } from "clsx";
import { HelpCircle, X } from "lucide-react";

interface FieldWithReasonProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  reason: string;       // Why we ask for this field — shown on demand
  error?: string;
  helpText?: string;
}

/**
 * FieldWithReason — every form input in FairLoan shows a "why we ask this"
 * explanation. Product principle P2: earn data, don't extract it.
 *
 * The reason is hidden by default to keep the form uncluttered, but
 * accessible via a clearly labelled toggle. It is never buried.
 */
export default function FieldWithReason({
  label,
  reason,
  error,
  helpText,
  id,
  className,
  ...props
}: FieldWithReasonProps) {
  const [showReason, setShowReason] = useState(false);
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label row */}
      <div className="flex items-center gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-800"
        >
          {label}
          {props.required && (
            <span className="text-danger-600 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>

        {/* Why-we-ask toggle — keyboard accessible */}
        <button
          type="button"
          onClick={() => setShowReason((v) => !v)}
          aria-expanded={showReason}
          aria-label={`Why we ask for ${label}`}
          className="text-slate-400 hover:text-brand-700 transition-colors"
        >
          {showReason ? (
            <X size={15} aria-hidden="true" />
          ) : (
            <HelpCircle size={15} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Why-we-ask panel — announced via aria-live */}
      {showReason && (
        <div
          role="note"
          aria-live="polite"
          className="text-xs text-slate-600 bg-brand-50 border border-brand-100 rounded-lg px-3 py-2"
        >
          {reason}
        </div>
      )}

      {/* Input */}
      <input
        id={inputId}
        className={clsx(
          "w-full rounded-xl border px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400",
          "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
          "transition-shadow",
          error
            ? "border-danger-600 bg-danger-50"
            : "border-slate-300 bg-white hover:border-slate-400",
          className
        )}
        aria-describedby={
          error
            ? `${inputId}-error`
            : helpText
            ? `${inputId}-help`
            : undefined
        }
        aria-invalid={!!error}
        {...props}
      />

      {/* Help text */}
      {helpText && !error && (
        <p id={`${inputId}-help`} className="text-xs text-slate-500">
          {helpText}
        </p>
      )}

      {/* Error — aria-live so screen readers announce it */}
      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          aria-live="assertive"
          className="text-xs text-danger-600 font-medium"
        >
          {error}
        </p>
      )}
    </div>
  );
}
