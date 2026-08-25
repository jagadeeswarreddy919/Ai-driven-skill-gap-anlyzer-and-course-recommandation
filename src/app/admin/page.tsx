import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Users, ClipboardList, TrendingUp, CreditCard } from "lucide-react";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.isAdmin) redirect("/dashboard");

  const [totalUsers, totalAssessments, subscriptions] = await Promise.all([
    prisma.user.count(),
    prisma.assessment.count(),
    prisma.subscription.groupBy({ by: ["plan"], _count: { _all: true } }),
  ]);
  const planMap: Record<string, number> = {};
  for (const s of subscriptions) planMap[s.plan] = s._count._all;

  const popularRoles = await prisma.assessment.groupBy({ by: ["roleId"], _count: { _all: true }, orderBy: { _count: { roleId: "desc" } }, take: 5 });
  const roleIds = popularRoles.map(r => r.roleId);
  const roles = await prisma.role.findMany({ where: { id: { in: roleIds } } });
  const roleMap = Object.fromEntries(roles.map(r => [r.id, r.title]));

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users },
    { label: "Total Assessments", value: totalAssessments, icon: ClipboardList },
    { label: "Standard Users", value: planMap["STANDARD"] ?? 0, icon: TrendingUp },
    { label: "Pro Users", value: planMap["PRO"] ?? 0, icon: CreditCard },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      <div><h2 className="text-2xl font-extrabold text-slate-900">Admin Dashboard</h2><p className="text-sm text-slate-500 font-medium mt-1">Platform overview and analytics.</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
            <s.icon className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
            <div className="text-3xl font-black text-slate-900">{s.value}</div>
            <div className="text-xs font-bold text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 p-6">
        <h3 className="text-sm font-extrabold text-slate-900 mb-4">Most Analyzed Roles</h3>
        <div className="space-y-2">
          {popularRoles.map((r, i) => (
            <div key={r.roleId} className="flex items-center justify-between text-sm font-semibold text-slate-700 py-2 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-2"><span className="text-xs font-black text-slate-300">#{i + 1}</span>{roleMap[r.roleId] ?? "Unknown"}</div>
              <span className="text-xs text-indigo-600 font-bold">{r._count._all} analyses</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 p-6">
        <h3 className="text-sm font-extrabold text-slate-900 mb-4">Subscription Distribution</h3>
        <div className="flex gap-4">
          {["FREE","STANDARD","PRO"].map(p => {
            const count = planMap[p] ?? 0;
            const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
            return (
              <div key={p} className="flex-1 text-center">
                <div className="text-2xl font-black text-indigo-600">{count}</div>
                <div className="text-xs font-bold text-slate-500 mt-1">{p}</div>
                <div className="text-[10px] font-bold text-slate-400">{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}