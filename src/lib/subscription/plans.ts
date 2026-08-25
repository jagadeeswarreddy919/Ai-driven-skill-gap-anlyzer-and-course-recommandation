
export const PLANS = {
  FREE: "FREE",
  STANDARD: "STANDARD",
  PRO: "PRO",
} as const;

export type Plan = typeof PLANS[keyof typeof PLANS];

export const PLAN_META: Record<Plan, { label: string; priceINR: number; color: string; badge: string }> = {
  FREE: { label: "Free", priceINR: 0, color: "slate", badge: "FREE" },
  STANDARD: { label: "Standard", priceINR: 499, color: "indigo", badge: "STANDARD" },
  PRO: { label: "Pro", priceINR: 1499, color: "purple", badge: "PRO" },
};
