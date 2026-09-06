"use client";

/**
 * PrototypeBanner — persistent top strip on every page.
 *
 * Product principle P5 (Prototype honesty): this banner must never be
 * removed or made dismissible. It is the primary signal that this is an
 * educational prototype, not a real lending product.
 */
export default function PrototypeBanner() {
  return (
    <div
      role="banner"
      aria-label="Prototype disclaimer"
      className="w-full bg-amber-50 border-b border-amber-200 px-4 py-2 text-center"
    >
      <p className="text-xs text-amber-800 font-medium">
        🎓 <strong>Educational Prototype</strong> — This is a portfolio project
        using synthetic data only. No real loans, no real credit decisions, no
        personal data collected.{" "}
        <a
          href="/disclaimer"
          className="underline underline-offset-2 hover:text-amber-900"
        >
          Learn more
        </a>
      </p>
    </div>
  );
}
