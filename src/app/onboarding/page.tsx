import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getUserSubscription, checkRoleAnalysisLimit } from "@/lib/subscription/access";
import OnboardingWizard from "./OnboardingWizard";

export default async function OnboardingPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const [roles, skills, sub] = await Promise.all([
    prisma.role.findMany({
      include: {
        _count: { select: { roleSkills: true } },
        roleSkills: { select: { skillId: true } },
      },
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
    <OnboardingWizard
      roles={roles.map(r => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        category: r.category,
        description: r.description,
        skillCount: r._count.roleSkills,
        roleSkillIds: r.roleSkills.map(rs => rs.skillId),
      }))}
      skills={skills.map(s => ({ id: s.id, name: s.name, category: s.category, slug: s.slug }))}
      plan={plan}
      usageAllowed={usageCheck.allowed}
      savedSkillIds={savedSkillIds}
      userName={user.name ?? "Developer"}
    />
  );
}