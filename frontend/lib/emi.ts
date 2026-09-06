/**
 * Client-side EMI calculator — mirrors the backend Python formula exactly.
 * Used for live preview in the eligibility form and loan configurator.
 * The backend is always the source of truth for persisted calculations.
 */

export interface EmiPreview {
  emi: number;
  totalRepayable: number;
  totalInterest: number;
  processingFee: number;
  totalCostWithFee: number;
}

/**
 * Calculate EMI using the standard reducing-balance formula.
 * Returns null if any input is invalid (used to show/hide live preview).
 */
export function calculateEmi(
  principal: number,
  annualRatePct: number,
  tenureMonths: number
): EmiPreview | null {
  if (principal <= 0 || annualRatePct <= 0 || tenureMonths <= 0) return null;

  const r = annualRatePct / 1200; // monthly rate
  const compound = Math.pow(1 + r, tenureMonths);
  const emi = (principal * r * compound) / (compound - 1);

  const totalRepayable = emi * tenureMonths;
  const totalInterest = totalRepayable - principal;
  const processingFee = principal * 0.02; // 2% prototype assumption
  const totalCostWithFee = totalRepayable + processingFee;

  return {
    emi: round2(emi),
    totalRepayable: round2(totalRepayable),
    totalInterest: round2(totalInterest),
    processingFee: round2(processingFee),
    totalCostWithFee: round2(totalCostWithFee),
  };
}

/** Format a rupee amount for display — e.g. 33004.80 → "₹33,004.80" */
export function formatRupee(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
