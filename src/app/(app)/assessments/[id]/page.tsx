import { getSessionUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getUserSubscription } from "@/lib/subscription/access";
import { canSeeFullSkillGap, canGenerateRoadmap } from "@/lib/subscription/permissions";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, Map, Lock, BookOpen, ExternalLink } from "lucide-react";

export default async function AssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const assessment = await prisma.assessment.findUnique({
    where: { id },
    include: {
      role: true,
      assessmentSkills: { include: { skill: true } },
      skillGaps: { include: { skill: { include: { learningResources: true } } }, orderBy: { priority: "asc" } },
    },
  });
  if (!assessment || assessment.userId !== user.id) notFound();

  const sub = await getUserSubscription(user.id);
  const plan = (sub.status === "ACTIVE" || sub.status === "TRIALING") ? sub.plan as "FREE" | "STANDARD" | "PRO" : "FREE";

  const matchedSkills = assessment.assessmentSkills.filter(s => s.matched);
  const fullGapAccess = canSeeFullSkillGap(plan);
  const showRoadmap = canGenerateRoadmap(plan);

  const visibleGaps = fullGapAccess ? assessment.skillGaps : assessment.skillGaps.slice(0, 5);
  const hiddenCount = assessment.skillGaps.length - visibleGaps.length;

  const recommendedResources = visibleGaps.flatMap(g => g.skill.learningResources.map(r => ({ ...r, skillName: g.skill.name })));

  const scoreColor = assessment.score >= 80 ? "emerald" : assessment.score >= 60 ? "indigo" : assessment.score >= 40 ? "amber" : "rose";
  const date = new Date(assessment.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">{assessment.role.category}</div>
        <h2 className="text-2xl font-extrabold text-slate-900">{assessment.role.title} Report</h2>
        <div className="text-xs text-slate-400 font-medium mt-0.5">{date}</div>

        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Radial Score */}
          <div className="relative w-28 h-28 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke={assessment.score >= 80 ? "#10b981" : assessment.score >= 60 ? "#6366f1" : assessment.score >= 40 ? "#f59e0b" : "#f43f5e"}
                strokeWidth="10"
                strokeDasharray={(assessment.score / 100) * 251.2 + " 251.2"}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={["text-2xl font-black", assessment.score >= 80 ? "text-emerald-600" : assessment.score >= 60 ? "text-indigo-600" : "text-amber-600"].join(" ")}>{assessment.score}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xl font-extrabold text-slate-900">{assessment.label} Match</div>
            <div className="grid grid-cols-3 gap-4 text-center mt-2">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                <div className="text-xl font-black text-emerald-700">{matchedSkills.length}</div>
                <div className="text-[10px] font-bold text-emerald-600 uppercase">Matched</div>
              </div>
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100">
                <div className="text-xl font-black text-rose-700">{assessment.skillGaps.length}</div>
                <div className="text-[10px] font-bold text-rose-600 uppercase">Missing</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-xl font-black text-slate-700">{assessment.assessmentSkills.length}</div>
                <div className="text-[10px] font-bold text-slate-600 uppercase">Total</div>
              </div>
            </div>
          </div>
        </div>

        {showRoadmap && (
          <div className="mt-6">
            <Link
              href={"/roadmap/" + assessment.id}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/25"
            >
              <Map className="w-4 h-4" /> View Learning Roadmap
            </Link>
          </div>
        )}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Matched Skills ({matchedSkills.length})
          </h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {matchedSkills.map(s => (
              <div key={s.id} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                {s.skill.name}
              </div>
            ))}
            {matchedSkills.length === 0 && <div className="text-xs text-slate-400">No matched skills found.</div>}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-500" /> Missing Skills ({assessment.skillGaps.length})
          </h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {visibleGaps.map(g => (
              <div key={g.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800">
                <div className="flex items-center gap-2">
                  <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  {g.skill.name}
                </div>
                <span className={["text-[10px] font-black uppercase px-2 py-0.5 rounded-md",
                  g.priority === "Critical" ? "bg-rose-100 text-rose-700" : g.priority === "High" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"
                ].join(" ")}>{g.priority}</span>
              </div>
            ))}
            {hiddenCount > 0 && (
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-center space-y-2">
                <Lock className="w-4 h-4 text-indigo-400 mx-auto" />
                <div className="text-xs font-bold text-indigo-700">{hiddenCount} more skills are hidden.</div>
                <div className="text-xs text-indigo-600">Upgrade to Standard to unlock your complete skill gap analysis.</div>
                <Link href="/settings/billing" className="inline-flex items-center gap-1 text-xs font-black text-indigo-700 hover:underline">
                  Upgrade to Standard <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Course Links & Websites */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" /> Recommended Courses & Learning Websites
        </h3>
        <p className="text-xs text-slate-500 font-medium">Direct website links and tutorials curated specifically for your missing skills.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recommendedResources.map(res => (
            <a
              key={res.id}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all group flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-indigo-600 uppercase tracking-wider mb-0.5">
                  <span>{res.skillName}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0" />
                </div>
                <div className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">{res.title}</div>
                <div className="text-xs text-slate-500 font-medium mt-1">Website: <span className="font-bold text-slate-700">{res.provider}</span></div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">{res.level}</span>
                <span className="text-[10px] text-slate-400 font-medium">{res.durationHours} hours</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}