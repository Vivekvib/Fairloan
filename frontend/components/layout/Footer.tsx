import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between gap-4 text-sm text-slate-500">
        <div>
          <p className="font-semibold text-slate-700 mb-1">FairLoan</p>
          <p>An educational PM portfolio project by Vivek Nishad.</p>
          <p className="mt-1 text-xs">
            Synthetic data only. Not a real lending product. Not RBI-compliant.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-col gap-1">
          <Link href="/disclaimer" className="hover:text-slate-800">
            Prototype Disclaimer
          </Link>
          <Link href="/privacy" className="hover:text-slate-800">
            Privacy Policy (Prototype)
          </Link>
          <Link href="/terms" className="hover:text-slate-800">
            Terms (Prototype)
          </Link>
          <Link href="/support/faq" className="hover:text-slate-800">
            FAQ
          </Link>
        </nav>
      </div>
    </footer>
  );
}
