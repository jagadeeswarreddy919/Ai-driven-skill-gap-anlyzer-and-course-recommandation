
import type { Plan } from "./plans";

export function canAnalyzeRole(_plan: Plan): boolean { return true; }
export function canUseResumeAnalysis(plan: Plan): boolean { return plan === "PRO"; }
export function canUseCustomJobDescription(plan: Plan): boolean { return plan === "PRO"; }
export function canUseCourseRecommendations(plan: Plan): boolean { return plan === "PRO"; }
export function canUseCareerCoach(plan: Plan): boolean { return plan === "PRO"; }
export function canViewAdvancedAnalytics(plan: Plan): boolean { return plan === "PRO"; }
export function canSeeFullSkillGap(plan: Plan): boolean { return plan !== "FREE"; }
export function canGenerateRoadmap(plan: Plan): boolean { return plan !== "FREE"; }
export function canViewFullHistory(plan: Plan): boolean { return plan !== "FREE"; }
export function canViewPriorityMatrix(plan: Plan): boolean { return plan !== "FREE"; }
export function getMonthlyAnalysisLimit(plan: Plan): number | null {
  if (plan === "FREE") return 3;
  return null; // unlimited
}
export function getMaxHistoryCount(plan: Plan): number {
  if (plan === "FREE") return 3;
  return 999;
}
