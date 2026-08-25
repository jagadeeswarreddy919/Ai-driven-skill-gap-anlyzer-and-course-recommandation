
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import type { Plan } from "./plans";

export async function getUserSubscription(userId: string) {
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  return sub ?? { plan: "FREE" as Plan, status: "ACTIVE" };
}

export async function getCurrentPlan(): Promise<Plan> {
  const user = await getSessionUser();
  if (!user) return "FREE";
  const sub = await getUserSubscription(user.id);
  if (sub.status !== "ACTIVE" && sub.status !== "TRIALING") return "FREE";
  return sub.plan as Plan;
}

export async function getOrCreateUsage(userId: string) {
  const month = new Date().toISOString().slice(0, 7); // "2026-08"
  return prisma.usage.upsert({
    where: { userId_month: { userId, month } },
    update: {},
    create: { userId, month },
  });
}

export async function checkRoleAnalysisLimit(userId: string, plan: Plan): Promise<{ allowed: boolean; used: number; limit: number | null }> {
  const { getMonthlyAnalysisLimit } = await import("./permissions");
  const limit = getMonthlyAnalysisLimit(plan);
  if (limit === null) return { allowed: true, used: 0, limit: null };
  const usage = await getOrCreateUsage(userId);
  return { allowed: usage.roleAnalyses < limit, used: usage.roleAnalyses, limit };
}

export async function incrementRoleAnalysis(userId: string) {
  const month = new Date().toISOString().slice(0, 7);
  await prisma.usage.upsert({
    where: { userId_month: { userId, month } },
    update: { roleAnalyses: { increment: 1 } },
    create: { userId, month, roleAnalyses: 1 },
  });
}

export async function ensureSubscription(userId: string): Promise<void> {
  const existing = await prisma.subscription.findUnique({ where: { userId } });
  if (!existing) {
    await prisma.subscription.create({ data: { userId, plan: "FREE", status: "ACTIVE" } });
  }
}
