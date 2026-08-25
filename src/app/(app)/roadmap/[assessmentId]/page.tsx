import { getSessionUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getUserSubscription } from "@/lib/subscription/access";
import { canGenerateRoadmap } from "@/lib/subscription/permissions";
import RoadmapClient from "./RoadmapClient";
import Link from "next/link";
import { Lock } from "lucide-react";

export default async function RoadmapPage({ params }: { params: Promise<{ assessmentId: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const { assessmentId } = await params;
  const sub = await getUserSubscription(user.id);
  const plan = (sub.status === "ACTIVE" || sub.status === "TRIALING") ? sub.plan as "FREE" | "STANDARD" | "PRO" : "FREE";

  if (!canGenerateRoadmap(plan)) {
    return (
      <div className="max-w-2xl"><div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
        <Lock className="w-10 h-10 text-indigo-300 mx-auto" />
        <h2 className="text-xl font-extrabold text-slate-900">Personalized Roadmaps</h2>
        <p className="text-sm text-slate-500 font-medium">Upgrade to Standard to generate your personalized learning roadmap.</p>
        <Link href="/settings/billing" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all">Upgrade to Standard</Link>
      </div></div>
    );
  }

  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    include: { role: true, skillGaps: { include: { skill: { include: { learningResources: { take: 1 } } } }, orderBy: { priority: "asc" } } },
  });
  if (!assessment || assessment.userId !== user.id) notFound();

  let roadmap = await prisma.roadmap.findFirst({
    where: { assessmentId, userId: user.id },
    include: { items: { orderBy: { week: "asc" } } },
  });

  if (!roadmap) {
    roadmap = await prisma.roadmap.create({ data: { userId: user.id, assessmentId }, include: { items: true } });
    let week = 1;
    for (const gap of assessment.skillGaps.slice(0, 12)) {
      const resource = gap.skill.learningResources[0];
      await prisma.roadmapItem.create({
        data: { roadmapId: roadmap.id, week, skillName: gap.skill.name, objective: "Learn and apply " + gap.skill.name + " fundamentals", estimatedHours: resource?.durationHours ?? 8, resourceTitle: resource?.title, resourceUrl: resource?.url },
      });
      week++;
    }
    roadmap = await prisma.roadmap.findFirst({ where: { id: roadmap.id }, include: { items: { orderBy: { week: "asc" } } } });
  }

  return <RoadmapClient assessment={{ id: assessment.id, roleTitle: assessment.role.title, score: assessment.score }} items={roadmap!.items} />;
}