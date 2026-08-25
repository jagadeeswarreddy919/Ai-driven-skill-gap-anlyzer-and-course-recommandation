import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUserSubscription, checkRoleAnalysisLimit, incrementRoleAnalysis } from "@/lib/subscription/access";

function scoreLabel(score: number): string {
  if (score < 25) return "Beginner";
  if (score < 50) return "Developing";
  if (score < 70) return "Good Foundation";
  if (score < 85) return "Strong Match";
  return "Ready";
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const { roleId, skillIds } = await req.json();
  if (!roleId || !Array.isArray(skillIds) || skillIds.length === 0) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const sub = await getUserSubscription(user.id);
  const plan = (sub.status === "ACTIVE" || sub.status === "TRIALING") ? sub.plan as "FREE" | "STANDARD" | "PRO" : "FREE";

  const usageCheck = await checkRoleAnalysisLimit(user.id, plan);
  if (!usageCheck.allowed) {
    return NextResponse.json({ message: "Monthly analysis limit reached. Upgrade to continue." }, { status: 403 });
  }

  const role = await prisma.role.findUnique({ where: { id: roleId }, include: { roleSkills: { include: { skill: { include: { learningResources: true } } } } } });
  if (!role) return NextResponse.json({ message: "Role not found" }, { status: 404 });

  const userSkillSet = new Set(skillIds);
  const roleSkills = role.roleSkills;

  let totalWeight = 0;
  let matchedWeight = 0;
  for (const rs of roleSkills) {
    totalWeight += rs.weight;
    if (userSkillSet.has(rs.skillId)) matchedWeight += rs.weight;
  }
  const score = totalWeight === 0 ? 0 : Math.round((matchedWeight / totalWeight) * 100);

  for (const skillId of skillIds) {
    await prisma.userSkill.upsert({
      where: { userId_skillId: { userId: user.id, skillId } },
      update: {},
      create: { userId: user.id, skillId },
    });
  }

  const assessment = await prisma.assessment.create({
    data: {
      userId: user.id,
      roleId,
      score,
      label: scoreLabel(score),
    },
  });

  const matchedSkills = [];
  const missingSkills = [];
  const recommendedResources = [];

  for (const rs of roleSkills) {
    const isMatched = userSkillSet.has(rs.skillId);
    await prisma.assessmentSkill.create({
      data: { assessmentId: assessment.id, skillId: rs.skillId, matched: isMatched },
    });
    if (isMatched) {
      matchedSkills.push({ id: rs.skill.id, name: rs.skill.name, category: rs.skill.category });
    } else {
      const priority = rs.weight === 3 ? "Critical" : rs.weight === 2 ? "High" : "Medium";
      const impact = rs.isRequired ? (rs.weight === 3 ? "Critical" : "High") : "Medium";
      await prisma.skillGap.create({
        data: { assessmentId: assessment.id, skillId: rs.skillId, priority, impact },
      });
      missingSkills.push({ id: rs.skill.id, name: rs.skill.name, category: rs.skill.category, priority, impact });
      for (const res of rs.skill.learningResources) {
        recommendedResources.push({ id: res.id, title: res.title, url: res.url, level: res.level, provider: res.provider, durationHours: res.durationHours, skillName: rs.skill.name });
      }
    }
  }

  await incrementRoleAnalysis(user.id);

  return NextResponse.json({
    assessmentId: assessment.id,
    score,
    label: scoreLabel(score),
    roleTitle: role.title,
    roleCategory: role.category,
    matchedSkills,
    missingSkills,
    recommendedResources,
  }, { status: 201 });
}