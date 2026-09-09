"use client";

import { InputHTMLAttributes, useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import { HelpCircle, X } from "lucide-react";

interface FieldWithReasonProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  reason: string;
  error?: string;
  helpText?: string;
  suffix?: string;          // e.g. "months", "₹"
  isNumeric?: boolean;      // strips non-numeric chars, kills scroll-jacking
}

/**
 * FieldWithReason — every financial input in FairLoan.
 *
 * CRITICAL BUG FIX (Item 0): numeric inputs use type="text" + inputMode="numeric"
 * instead of type="number". This eliminates scroll-jacking — Chrome/Edge/Safari
 * increment type="number" fields on mousewheel when focused, silently corrupting
 * financial data. type="text" + inputMode keeps the numeric mobile keyboard without
 * the scroll-capture behavior.
 *
 * Native spinner arrows are also hidden via CSS (Item 6).
 */
export default function FieldWithReason({
  label,
  reason,
  error,
  helpText,
  suffix,
  isNumeric = false,
  id,
  className,
  onChange,
  ...props
}: FieldWithReasonProps) {
  const [showReason, setShowReason] = useState(false);
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  // Strip non-numeric characters for numeric fields on every change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumeric) {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
    }
    onChange?.(e);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label row */}
      <div className="flex items-center gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-slate-800">
          {label}
          {props.required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowReason((v) => !v)}
          aria-expanded={showReason}
          aria-label={`Why we ask for ${label}`}
          className="text-slate-400 hover:text-blue-600 transition-colors"
        >
          {showReason
            ? <X size={14} aria-hidden="true" />
            : <HelpCircle size={14} aria-hidden="true" />}
        </button>
      </div>

      {/* Why-we-ask panel */}
      {showReason && (
        <div role="note" aria-live="polite"
          className="text-xs text-slate-600 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
          {reason}
        </div>
      )}

      {/* Input + optional suffix */}
      <div className="relative flex items-center">
        <input
          id={inputId}
          // Item 0 + Item 6: use text type for numerics — kills scroll-jacking
          type={isNumeric ? "text" : props.type || "text"}
          inputMode={isNumeric ? "numeric" : props.inputMode}
          pattern={isNumeric ? "[0-9]*" : props.pattern}
          onChange={handleChange}
          className={clsx(
            "w-full rounded-xl border px-4 py-3 text-sm text-slate-900",
            "placeholder:text-slate-400 transition-shadow",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            // Hide native spinners (Item 6)
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            suffix ? "pr-16" : "",
            error
              ? "border-red-400 bg-red-50"
              : "border-slate-300 bg-white hover:border-slate-400",
            className
          )}
          aria-describedby={
            error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined
          }
          aria-invalid={!!error}
          {...props}
          type={isNumeric ? "text" : (props.type || "text")}
        />
        {/* Unit suffix label inside field — Item 6 */}
        {suffix && (
          <span className="absolute right-4 text-xs text-slate-400 font-medium pointer-events-none">
            {suffix}
          </span>
        )}
      </div>

      {helpText && !error && (
        <p id={`${inputId}-help`} className="text-xs text-slate-500">{helpText}</p>
      )}
      {error && (
        <p id={`${inputId}-error`} role="alert" aria-live="assertive"
          className="text-xs text-red-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
