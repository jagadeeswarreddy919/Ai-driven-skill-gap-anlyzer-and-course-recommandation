import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserSubscription } from "@/lib/subscription/access";
import { prisma } from "@/lib/db";
import BillingClient from "./BillingClient";

export default async function BillingPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const sub = await getUserSubscription(user.id);
  const plan = (sub.status === "ACTIVE" || sub.status === "TRIALING") ? sub.plan : "FREE";
  const payments = await prisma.payment.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 10 });
  return <BillingClient plan={plan} status={sub.status} payments={payments.map(p => ({ id: p.id, amount: p.amount, status: p.status, createdAt: p.createdAt.toISOString() }))} />;
}