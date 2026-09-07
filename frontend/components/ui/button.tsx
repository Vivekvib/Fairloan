import { clsx } from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center font-medium rounded-xl transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800":
              variant === "primary",
            "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50":
              variant === "secondary",
            "text-blue-600 hover:bg-blue-50": variant === "ghost",
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
