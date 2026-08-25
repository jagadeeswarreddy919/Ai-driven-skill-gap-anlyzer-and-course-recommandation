import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { plan } = await req.json();
  const amountMap: Record<string, number> = { STANDARD: 49900, PRO: 149900 };
  const amount = amountMap[plan];
  if (!amount) return NextResponse.json({ message: "Invalid plan" }, { status: 400 });
  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: { plan, status: "ACTIVE", startedAt: new Date() },
    create: { userId: user.id, plan, status: "ACTIVE" },
  });
  await prisma.payment.create({ data: { userId: user.id, amount, currency: "INR", status: "COMPLETED" } });
  return NextResponse.json({ demo: true, plan });
}