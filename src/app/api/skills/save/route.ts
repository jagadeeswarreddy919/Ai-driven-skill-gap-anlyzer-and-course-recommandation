import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { skillIds } = await req.json();
  await prisma.userSkill.deleteMany({ where: { userId: user.id } });
  for (const skillId of skillIds) {
    await prisma.userSkill.create({ data: { userId: user.id, skillId } });
  }
  return NextResponse.json({ ok: true });
}