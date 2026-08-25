import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await prisma.subscription.update({ where: { userId: user.id }, data: { status: "CANCELLED", plan: "FREE" } });
  return NextResponse.json({ ok: true });
}