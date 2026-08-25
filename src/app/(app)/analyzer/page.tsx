import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getUserSubscription, checkRoleAnalysisLimit } from "@/lib/subscription/access";
import AnalyzerClient from "./AnalyzerClient";

export default async function AnalyzerPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const roleSlug = params.role;

  const [roles, skills, sub] = await Promise.all([
    prisma.role.findMany({
      include: { roleSkills: { select: { skillId: true } } },
      orderBy: { category: "asc" },
    }),
    prisma.skill.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
    getUserSubscription(user.id),
  ]);

  const plan = (sub.status === "ACTIVE" || sub.status === "TRIALING") ? sub.plan : "FREE";
  const usageCheck = await checkRoleAnalysisLimit(user.id, plan as "FREE" | "STANDARD" | "PRO");

  const userSkills = await prisma.userSkill.findMany({
    where: { userId: user.id },
    select: { skillId: true },
  });
  const savedSkillIds = userSkills.map(us => us.skillId);

  return (
    <AnalyzerClient
      roles={roles.map(r => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        category: r.category,
        description: r.description,
        roleSkillIds: r.roleSkills.map(rs => rs.skillId),
      }))}
      skills={skills.map(s => ({ id: s.id, name: s.name, category: s.category, slug: s.slug }))}
      plan={plan}
      usageCheck={usageCheck}
      defaultRoleSlug={roleSlug}
      savedSkillIds={savedSkillIds}
    />
  );
}