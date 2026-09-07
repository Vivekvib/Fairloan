import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0f1f3d] border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-8">
        <div>
          <p className="text-xl font-bold text-white mb-1">
            Fair<span className="text-blue-400">Loan</span>
          </p>
          <p className="text-sm text-blue-200 mb-1">
            A PM portfolio project by Vivek Nishad.
          </p>
          <p className="text-xs text-blue-400/60">
            Synthetic data only · Not a real lending product · Not RBI-compliant
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-col gap-2">
          {[
            { href: "/disclaimer", label: "Prototype Disclaimer" },
            { href: "/privacy",    label: "Privacy Policy (Prototype)" },
            { href: "/terms",      label: "Terms (Prototype)" },
            { href: "/support/faq", label: "FAQ" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-blue-200 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
