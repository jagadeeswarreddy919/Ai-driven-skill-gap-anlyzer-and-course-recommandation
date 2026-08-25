import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getUserSubscription } from "@/lib/subscription/access";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const sub = await getUserSubscription(user.id);
  return NextResponse.json({ plan: sub.plan, status: sub.status });
}