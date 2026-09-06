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

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-brand-700 tracking-tight"
        >
          Fair<span className="text-slate-900">Loan</span>
        </Link>

        {/* Navigation links — hidden on mobile, shown on md+ */}
        <nav aria-label="Main navigation" className="hidden md:flex gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "text-sm font-medium transition-colors hover:text-brand-700",
                pathname === href
                  ? "text-brand-700 border-b-2 border-brand-600 pb-0.5"
                  : "text-slate-600"
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
