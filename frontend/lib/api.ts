/**
 * Typed API client — all fetch calls go through here.
 * Base URL from env — never hardcoded.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

// ── Eligibility ───────────────────────────────────────────────────────────────

export interface EligibilityRequest {
  monthly_income: number;
  employment_tenure_months: number;
  requested_amount: number;
  existing_monthly_emi: number;
  loan_tenure_months: number;
}

export interface RuleExplanation {
  result: "pass" | "review" | "fail";
  plain: string;
}

export interface EligibilityResponse {
  check_id: string;
  save_token: string;
  result: "likely_eligible" | "needs_review" | "not_progressed";
  primary_reason: string;
  estimated_emi: number;
  dti_ratio: number;
  rule_explanation: Record<string, RuleExplanation>;
  prototype_disclaimer: string;
  checked_at: string;
}

export function checkEligibility(
  data: EligibilityRequest
): Promise<EligibilityResponse> {
  return request("/api/v1/eligibility/check", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ── Analytics (fire-and-forget) ───────────────────────────────────────────────

export function trackEvent(
  sessionId: string,
  eventName: string,
  properties?: Record<string, unknown>
): void {
  // Fire-and-forget — never block the user on analytics
  fetch(`${BASE}/api/v1/analytics/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      event_name: eventName,
      properties,
    }),
  }).catch(() => {
    // Intentionally silent — analytics failure must never affect the user
  });
}
