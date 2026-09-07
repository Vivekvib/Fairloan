"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/what-you-need", label: "What You'll Need" },
  { href: "/eligibility/check", label: "Check Eligibility" },
  { href: "/support/faq", label: "FAQ" },
];

export default function Navbar() {
  const pathname = usePathname();
  // Use dark navbar on home page to blend with hero
  const isDark = pathname === "/";

  return (
    <header className={clsx(
      "sticky top-0 z-40 border-b transition-colors",
      isDark
        ? "bg-[#0f1f3d] border-white/10"
        : "bg-white border-slate-200"
    )}>
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className={clsx(
          "text-xl font-bold tracking-tight",
          isDark ? "text-white" : "text-slate-900"
        )}>
          Fair<span className={isDark ? "text-blue-400" : "text-blue-600"}>Loan</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden md:flex gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "text-sm font-medium transition-colors",
                isDark
                  ? pathname === href
                    ? "text-white"
                    : "text-blue-200 hover:text-white"
                  : pathname === href
                    ? "text-blue-700 border-b-2 border-blue-600 pb-0.5"
                    : "text-slate-600 hover:text-blue-700"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
