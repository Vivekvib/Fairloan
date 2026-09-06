import { clsx } from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

/**
 * Button — single component for all CTAs.
 * Variant drives visual hierarchy; size drives touch target.
 * Always meets 44px minimum touch target on mobile (size="md" and above).
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center font-medium rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            // Primary — main CTA
            "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-700":
              variant === "primary",
            // Secondary — supporting action
            "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50":
              variant === "secondary",
            // Ghost — tertiary / inline
            "text-brand-700 hover:bg-brand-50": variant === "ghost",
          },
          {
            "text-sm px-3 py-2 min-h-[36px]": size === "sm",
            "text-sm px-5 py-3 min-h-[44px]": size === "md",
            "text-base px-6 py-4 min-h-[52px]": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
