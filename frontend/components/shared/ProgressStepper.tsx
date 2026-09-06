"use client";

import { clsx } from "clsx";
import { Check } from "lucide-react";

interface Step {
  label: string;
  description?: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number; // 0-indexed
}

/**
 * ProgressStepper — shows the user where they are in the application flow.
 * Helps reduce anxiety by making the journey legible before they start.
 */
export default function ProgressStepper({
  steps,
  currentStep,
}: ProgressStepperProps) {
  return (
    <nav aria-label="Application progress" className="w-full">
      <ol className="flex items-center justify-between gap-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li key={step.label} className="flex-1 flex flex-col items-center gap-1">
              {/* Step circle */}
              <div
                aria-current={isCurrent ? "step" : undefined}
                className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors",
                  isCompleted
                    ? "bg-brand-600 border-brand-600 text-white"
                    : isCurrent
                    ? "bg-white border-brand-600 text-brand-700"
                    : "bg-white border-slate-300 text-slate-400"
                )}
              >
                {isCompleted ? (
                  <Check size={14} aria-hidden="true" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step label — hidden on very small screens */}
              <span
                className={clsx(
                  "hidden sm:block text-xs text-center",
                  isCurrent ? "text-brand-700 font-medium" : "text-slate-500"
                )}
              >
                {step.label}
              </span>

              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className={clsx(
                    "absolute h-0.5 w-full top-4 left-1/2",
                    isCompleted ? "bg-brand-600" : "bg-slate-200"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
