import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getUserSubscription } from "@/lib/subscription/access";
import { canViewAdvancedAnalytics } from "@/lib/subscription/permissions";

export default async function ProgressPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const sub = await getUserSubscription(user.id);
  const plan = (sub.status === "ACTIVE" || sub.status === "TRIALING") ? sub.plan as "FREE" | "STANDARD" | "PRO" : "FREE";
  const advanced = canViewAdvancedAnalytics(plan);
  const assessments = await prisma.assessment.findMany({ where: { userId: user.id }, include: { role: true }, orderBy: { createdAt: "asc" }, take: 20 });
  const maxScore = Math.max(...assessments.map(a => a.score), 0);
  const latestScore = assessments[assessments.length - 1]?.score ?? 0;
  const firstScore = assessments[0]?.score ?? 0;
  const improvement = latestScore - firstScore;

  return (
    <div className="max-w-4xl space-y-6">
      <div><h2 className="text-2xl font-extrabold text-slate-900">Progress Analytics</h2><p className="text-sm text-slate-500 font-medium mt-1">Track your career readiness growth over time.</p></div>
      {assessments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-sm font-medium">Run your first analysis to start tracking progress.</div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center"><div className="text-3xl font-black text-indigo-600">{latestScore}%</div><div className="text-xs font-bold text-slate-500 mt-1">Current Score</div></div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center"><div className={["text-3xl font-black", improvement >= 0 ? "text-emerald-600" : "text-rose-600"].join(" ")}>{improvement >= 0 ? "+" : ""}{improvement}%</div><div className="text-xs font-bold text-slate-500 mt-1">Total Improvement</div></div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center"><div className="text-3xl font-black text-purple-600">{assessments.length}</div><div className="text-xs font-bold text-slate-500 mt-1">Assessments</div></div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 mb-4">Readiness Score History</h3>
            <div className="flex items-end gap-3 h-40">
              {assessments.map((a) => {
                const h = maxScore > 0 ? (a.score / maxScore) * 100 : 10;
                return (
                  <div key={a.id} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[9px] font-black text-slate-500">{a.score}%</div>
                    <div className="w-full bg-indigo-100 hover:bg-indigo-400 rounded-t-lg transition-all" style={{ height: h + "%" }} />
                    <div className="text-[8px] text-slate-400 font-medium">{new Date(a.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</div>
                  </div>
                );
              })}
            </div>
          </div>
          {!advanced && <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 text-xs font-semibold text-purple-700 text-center">Upgrade to Pro for detailed skill-by-skill analytics and AI-powered growth insights.</div>}
        </>
      )}
    </div>
  );
}