import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import RolesClient from "./RolesClient";

export default async function RolesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const roles = await prisma.role.findMany({
    include: { _count: { select: { roleSkills: true } } },
    orderBy: { category: "asc" },
  });

  return <RolesClient roles={roles.map(r => ({ id: r.id, slug: r.slug, title: r.title, category: r.category, description: r.description, skillCount: r._count.roleSkills }))} />;
}
