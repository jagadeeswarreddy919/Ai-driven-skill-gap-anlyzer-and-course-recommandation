import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ user: { name: user.name, email: user.email } });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { name } = await req.json();
  await prisma.user.update({ where: { id: user.id }, data: { name: name ?? user.name } });
  return NextResponse.json({ ok: true });
}