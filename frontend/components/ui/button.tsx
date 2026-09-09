import { clsx } from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

/**
 * Button — rectangular, no pill shapes, no gradients.
 * radius: rounded-md (6px) — professional, not vibe-coded.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center font-medium rounded-md transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900":
              variant === "primary",
            "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:border-slate-400":
              variant === "secondary",
            "text-blue-700 hover:bg-blue-50":
              variant === "ghost",
          },
          {
            "text-xs px-3 py-1.5 min-h-[32px]": size === "sm",
            "text-sm px-4 py-2.5 min-h-[40px]":  size === "md",
            "text-sm px-5 py-3 min-h-[44px]":    size === "lg",
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
