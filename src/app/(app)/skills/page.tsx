import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import SkillsClient from "./SkillsClient";

export default async function SkillsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const [skills, userSkills] = await Promise.all([
    prisma.skill.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
    prisma.userSkill.findMany({ where: { userId: user.id }, select: { skillId: true } }),
  ]);
  return <SkillsClient skills={skills} selectedIds={userSkills.map(us => us.skillId)} />;
}