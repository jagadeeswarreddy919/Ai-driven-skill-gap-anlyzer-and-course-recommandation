import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getUserSubscription } from "@/lib/subscription/access";
import { getMaxHistoryCount } from "@/lib/subscription/permissions";
import Link from "next/link";
import { ClipboardList, ArrowRight, Sparkles } from "lucide-react";

export default async function AssessmentsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const sub = await getUserSubscription(user.id);
  const plan = (sub.status === "ACTIVE" || sub.status === "TRIALING") ? sub.plan as "FREE" | "STANDARD" | "PRO" : "FREE";
  const maxCount = getMaxHistoryCount(plan);

  const assessments = await prisma.assessment.findMany({
    where: { userId: user.id },
    include: { role: true },
    orderBy: { createdAt: "desc" },
    take: maxCount,
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Assessments</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Your skill gap analysis history.</p>
        </div>
        <Link href="/analyzer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/25">
          <Sparkles className="w-3.5 h-3.5" /> New Analysis
        </Link>
      </div>

      {assessments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <ClipboardList className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-slate-500 font-medium">No assessments yet.</p>
          <Link href="/analyzer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all">
            Run Your First Analysis <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {assessments.map(a => {
            const date = new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
            const color = a.score >= 80 ? "emerald" : a.score >= 60 ? "indigo" : a.score >= 40 ? "amber" : "rose";
            return (
              <Link
                key={a.id}
                href={`/assessments/${a.id}`}
                className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div>
                  <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">{a.role.category}</div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">{a.role.title}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">{date} • {a.label}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`text-2xl font-black text-${color}-600`}>{a.score}%</div>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </div>
              </Link>
            );
          })}
          {plan === "FREE" && assessments.length >= 3 && (
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700 text-center">
              Upgrade to Standard to see your full assessment history.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
