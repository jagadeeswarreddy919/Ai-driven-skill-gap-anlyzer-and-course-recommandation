import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { itemId } = await req.json();
  const item = await prisma.roadmapItem.findUnique({ where: { id: itemId }, include: { roadmap: true } });
  if (!item || item.roadmap.userId !== user.id) return NextResponse.json({ message: "Not found" }, { status: 404 });
  await prisma.roadmapItem.update({ where: { id: itemId }, data: { completed: !item.completed } });
  return NextResponse.json({ ok: true });
}