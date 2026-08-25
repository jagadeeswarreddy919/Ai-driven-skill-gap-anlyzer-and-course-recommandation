import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getUserSubscription, checkRoleAnalysisLimit } from "@/lib/subscription/access";
import Link from "next/link";
import {
  Sparkles, Target, CheckCircle2, XCircle, ArrowRight, TrendingUp, BookOpen,
  FileText, MessageSquare, Map, Zap, ExternalLink, ShieldCheck, Award
} from "lucide-react";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const sub = await getUserSubscription(user.id);
  const plan = (sub.status === "ACTIVE" || sub.status === "TRIALING") ? sub.plan as "FREE" | "STANDARD" | "PRO" : "FREE";
  const usageCheck = await checkRoleAnalysisLimit(user.id, plan);

  const [latestAssessment, totalAssessments] = await Promise.all([
    prisma.assessment.findFirst({
      where: { userId: user.id },
      include: {
        role: true,
        assessmentSkills: { where: { matched: true }, take: 6, include: { skill: true } },
        skillGaps: { take: 5, orderBy: { priority: "asc" }, include: { skill: { include: { learningResources: { take: 1 } } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.assessment.count({ where: { userId: user.id } }),
  ]);

  const quickTools = [
    { label: "Step-by-Step Analyzer", desc: "Benchmark skills against 20+ roles", href: "/analyzer", icon: Sparkles, color: "indigo" },
    { label: "Browse Target Roles", desc: "Explore technical career paths", href: "/roles", icon: Target, color: "purple" },
    { label: "My Skill Library", desc: "Manage your skill profile", href: "/skills", icon: Zap, color: "emerald" },
    { label: "Recommended Courses", desc: "Curated learning websites & links", href: "/courses", icon: BookOpen, color: "sky" },
    { label: "Resume Analyzer", desc: "Extract skills from PDF resume", href: "/resume", icon: FileText, color: "amber", tag: "PRO" },
    { label: "AI Career Coach", desc: "Context-aware AI career advice", href: "/career-coach", icon: MessageSquare, color: "rose", tag: "PRO" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12 font-sans">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white p-8 sm:p-10 shadow-xl shadow-indigo-500/10">
        {/* Decorative Background Mesh Glow */}
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-20 w-60 h-60 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold tracking-wider text-indigo-100 uppercase">
              <ShieldCheck className="w-3.5 h-3.5" /> Career Intelligence Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Welcome back, {user.name?.split(" ")[0] ?? "Developer"}! 👋
            </h1>
            <p className="text-sm sm:text-base text-indigo-100 font-medium leading-relaxed">
              {latestAssessment
                ? `Latest Target: ${latestAssessment.role.title} • Score: ${latestAssessment.score}% (${latestAssessment.label})`
                : "Run your first 4-step skill gap analysis to benchmark your career readiness score."}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/analyzer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-extrabold text-sm shadow-md transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" /> Start Step-by-Step Analysis
              </Link>
              <Link
                href="/roles"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/20 transition-all cursor-pointer"
              >
                <Target className="w-4 h-4" /> Browse Roles
              </Link>
              {latestAssessment && (
                <Link
                  href={"/roadmap/" + latestAssessment.id}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-500/30 hover:bg-purple-500/40 text-white font-bold text-sm border border-purple-300/30 transition-all cursor-pointer"
                >
                  <Map className="w-4 h-4" /> View Roadmap
                </Link>
              )}
            </div>
          </div>

          {/* Mini Score Widget on Banner */}
          {latestAssessment && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex items-center gap-5 shrink-0">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="10" strokeDasharray={(latestAssessment.score / 100) * 251.2 + " 251.2"} strokeLinecap="round" />
                </svg>
                <span className="absolute text-xl font-black text-white">{latestAssessment.score}%</span>
              </div>
              <div>
                <div className="text-[11px] font-bold text-indigo-200 uppercase">Match Score</div>
                <div className="text-base font-extrabold text-white">{latestAssessment.role.title}</div>
                <div className="text-xs font-semibold text-emerald-300 mt-0.5">{latestAssessment.label}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Latest Score */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Latest Score</span>
            <Award className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{latestAssessment ? `${latestAssessment.score}%` : "--"}</div>
          <div className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
            {latestAssessment ? <><span className="text-indigo-600 font-bold">{latestAssessment.label}</span> match</> : "No assessments run yet"}
          </div>
        </div>

        {/* Metric 2: Assessments */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Assessments</span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{totalAssessments}</div>
          <div className="text-xs font-semibold text-slate-500 mt-1">Total benchmark runs</div>
        </div>

        {/* Metric 3: Plan */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Current Plan</span>
            <Zap className="w-5 h-5 text-purple-500" />
          </div>
          <div className="flex items-center gap-2">
            <span className={["text-2xl font-black", plan === "PRO" ? "text-purple-600" : plan === "STANDARD" ? "text-indigo-600" : "text-slate-800"].join(" ")}>{plan}</span>
          </div>
          <Link href="/settings/billing" className="text-xs font-bold text-indigo-600 hover:underline mt-1 inline-block">
            {plan === "FREE" ? "Upgrade Plan →" : "Manage Billing"}
          </Link>
        </div>

        {/* Metric 4: Analyses Remaining */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Analyses Left</span>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {usageCheck.limit ? usageCheck.limit - usageCheck.used : "∞"}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-1">
            {usageCheck.limit ? `Resets monthly (${usageCheck.used}/${usageCheck.limit} used)` : "Unlimited Plan"}
          </div>
        </div>
      </div>

      {/* Latest Analysis Results Split Grid */}
      {latestAssessment ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: Skills You Have */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Skills You Have
                </h3>
                <p className="text-xs text-slate-400 font-medium">Matched for {latestAssessment.role.title}</p>
              </div>
              <Link href={"/assessments/" + latestAssessment.id} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                Full Report <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {latestAssessment.assessmentSkills.map(s => (
                <div key={s.id} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{s.skill.name}</span>
                </div>
              ))}
              {latestAssessment.assessmentSkills.length === 0 && (
                <div className="text-xs text-slate-400 py-4 text-center">No matched skills.</div>
              )}
            </div>
          </div>

          {/* Column 2: Priority Gaps & Recommended Courses */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-500" /> Priority Skill Gaps
                </h3>
                <p className="text-xs text-slate-400 font-medium">Action items & direct course links</p>
              </div>
              <Link href="/courses" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                All Courses <BookOpen className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
              {latestAssessment.skillGaps.map(g => {
                const resource = g.skill.learningResources[0];
                return (
                  <div key={g.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs font-semibold">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="font-extrabold text-slate-900 truncate">{g.skill.name}</span>
                        <span className={["text-[9px] font-black uppercase px-1.5 py-0.5 rounded", g.priority === "Critical" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"].join(" ")}>{g.priority}</span>
                      </div>
                      {resource && (
                        <div className="text-[11px] text-slate-500 font-medium mt-1 truncate">
                          Course: <span className="text-indigo-700 font-bold">{resource.title}</span> ({resource.provider})
                        </div>
                      )}
                    </div>
                    {resource && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-50 transition-all text-xs flex items-center gap-1 shrink-0 shadow-2xs"
                      >
                        <span>Learn</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
            <Link
              href={"/assessments/" + latestAssessment.id}
              className="block w-full text-center py-3 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold text-xs hover:bg-indigo-100 transition-colors shadow-2xs"
            >
              View Complete Assessment & Course Report →
            </Link>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
            <TrendingUp className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Start Your Skill Gap Analysis</h3>
          <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
            Select your target career role and check off your current skills to calculate your readiness score and missing skill roadmap.
          </p>
          <Link
            href="/analyzer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" /> Run Step-by-Step Analysis
          </Link>
        </div>
      )}

      {/* Quick Navigation Tools Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-900">Career Intelligence Platform Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickTools.map(tool => (
            <Link
              key={tool.label}
              href={tool.href}
              className="p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400 hover:shadow-md transition-all group flex items-start gap-4 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <tool.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">{tool.label}</span>
                  {tool.tag && (
                    <span className="text-[9px] font-black bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded uppercase">
                      {tool.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1 truncate">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
