import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ExternalLink, BookOpen } from "lucide-react";

const levelColors: Record<string, string> = { Beginner: "emerald", Intermediate: "amber", Advanced: "rose" };

export default async function CoursesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const recentAssessment = await prisma.assessment.findFirst({
    where: { userId: user.id },
    include: { skillGaps: { include: { skill: { include: { learningResources: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  const allResources = await prisma.learningResource.findMany({ include: { skill: true }, take: 50 });
  const gapResources = recentAssessment?.skillGaps.flatMap(g => g.skill.learningResources.map(r => ({ ...r, skillName: g.skill.name }))) ?? [];
  const resources = gapResources.length > 0 ? gapResources : allResources.map(r => ({ ...r, skillName: r.skill.name }));

  return (
    <div className="max-w-4xl space-y-6">
      <div><h2 className="text-2xl font-extrabold text-slate-900">Courses & Resources</h2><p className="text-sm text-slate-500 font-medium mt-1">{gapResources.length > 0 ? "Curated resources based on your latest assessment gaps." : "Explore curated learning resources."}</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {resources.map(r => {
          const color = levelColors[r.level] ?? "slate";
          return (
            <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" className="flex flex-col p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-3"><BookOpen className="w-5 h-5 text-indigo-500" /><ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-400 transition-colors" /></div>
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">{r.skillName}</div>
              <div className="text-sm font-extrabold text-slate-900 mb-1 line-clamp-2">{r.title}</div>
              <div className="text-xs text-slate-500 font-medium mb-3">{r.provider}</div>
              <div className="flex items-center gap-2 mt-auto"><span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase">{r.level}</span><span className="text-[10px] text-slate-400 font-medium">{r.durationHours}h</span></div>
            </a>
          );
        })}
      </div>
    </div>
  );
}