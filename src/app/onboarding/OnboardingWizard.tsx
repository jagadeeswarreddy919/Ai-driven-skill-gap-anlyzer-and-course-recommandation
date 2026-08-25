"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import {
  Target, BookMarked, CheckCircle2, XCircle, Sparkles, ArrowRight, ArrowLeft,
  Search, ExternalLink, BookOpen, Check, Loader2, AlertCircle, LayoutDashboard, Map, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Role { id: string; slug: string; title: string; category: string; description: string; skillCount: number; roleSkillIds: string[]; }
interface Skill { id: string; name: string; category: string; slug: string; }
interface Resource { id: string; title: string; url: string; level: string; provider: string; durationHours: number; skillName: string; }
interface MissingSkill { id: string; name: string; category: string; priority: string; impact: string; }
interface MatchedSkill { id: string; name: string; category: string; }

interface AnalysisResult {
  assessmentId: string;
  score: number;
  label: string;
  roleTitle: string;
  roleCategory: string;
  matchedSkills: MatchedSkill[];
  missingSkills: MissingSkill[];
  recommendedResources: Resource[];
}

const CATEGORIES = ["All","Programming","Frontend","Backend","Database","Cloud","DevOps","AI/ML","Testing","Security","Tools","System Design","Soft Skills"];

export default function OnboardingWizard({
  roles, skills, plan, usageAllowed, savedSkillIds, userName
}: {
  roles: Role[];
  skills: Skill[];
  plan: string;
  usageAllowed: boolean;
  savedSkillIds: string[];
  userName: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0] ?? null);
  const [selectedSkillIds, setSelectedSkillIds] = useState<Set<string>>(new Set(savedSkillIds));
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [roleSearch, setRoleSearch] = useState("");
  const [roleCatFilter, setRoleCatFilter] = useState("All");
  const [showOnlyRoleSkills, setShowOnlyRoleSkills] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const roleCategories = ["All", ...Array.from(new Set(roles.map(r => r.category)))];
  const filteredRoles = roles.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(roleSearch.toLowerCase()) || r.category.toLowerCase().includes(roleSearch.toLowerCase());
    const matchCat = roleCatFilter === "All" || r.category === roleCatFilter;
    return matchSearch && matchCat;
  });

  // Filter skills relevant to selected role
  const roleSkillSet = new Set(selectedRole?.roleSkillIds ?? []);
  const roleRelevantSkills = skills.filter(s => roleSkillSet.has(s.id));
  const baseSkillsList = (showOnlyRoleSkills && roleRelevantSkills.length > 0) ? roleRelevantSkills : skills;

  const filteredSkills = baseSkillsList.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || s.category === catFilter;
    return matchSearch && matchCat;
  });

  const toggleSkill = (id: string) => {
    setSelectedSkillIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const runAnalysis = async () => {
    if (!selectedRole) return;
    if (selectedSkillIds.size === 0) { setError("Please select at least one skill to analyze."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/assessment/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId: selectedRole.id, skillIds: Array.from(selectedSkillIds) }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) { setError(data.message ?? "Analysis failed."); return; }
      setResult(data);
      setStep(3);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, title: "Target Role" },
    { num: 2, title: "My Skills" },
    { num: 3, title: "Missing Skills & Output" },
    { num: 4, title: "Report & Course Links" },
  ];

  return (
    <main className="min-h-screen bg-[#FAF9FF] text-slate-900 flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-4 border-b border-slate-200/80 mb-6">
        <Link href="/"><Logo /></Link>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Step {step} of 4: {stepsList[step - 1].title}
          </span>
          <button onClick={() => router.push("/dashboard")} className="text-xs font-semibold text-slate-500 hover:text-slate-900 underline">
            Skip to Dashboard
          </button>
        </div>
      </header>

      {/* Stepper Progress Bar */}
      <div className="max-w-3xl w-full mx-auto mb-8">
        <div className="flex items-center justify-between">
          {stepsList.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={["w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all border-2",
                step === s.num ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/25" :
                step > s.num ? "bg-emerald-500 border-emerald-500 text-white" :
                "bg-white border-slate-200 text-slate-400"
              ].join(" ")}>
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={["text-xs font-bold hidden sm:inline", step === s.num ? "text-slate-900" : "text-slate-400"].join(" ")}>
                {s.title}
              </span>
              {i < stepsList.length - 1 && <div className="w-6 sm:w-12 h-0.5 bg-slate-200 mx-1 sm:mx-2" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto flex items-center justify-center mb-8">
        <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-6">
          <AnimatePresence mode="wait">
            {/* STEP 1: TARGET ROLE */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
                    <Target className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Step 1: Select Your Target Career Role
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Which career path are you aiming for? SkillGap AI will benchmark your skills against this role.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search roles (e.g. Full Stack, AI Engineer, DevOps)..."
                      value={roleSearch}
                      onChange={e => setRoleSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {roleCategories.map(c => (
                    <button
                      key={c}
                      onClick={() => setRoleCatFilter(c)}
                      className={["px-3 py-1.5 rounded-lg text-xs font-bold border transition-all", roleCatFilter === c ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"].join(" ")}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[360px] overflow-y-auto pr-1">
                  {filteredRoles.map(role => {
                    const isSelected = selectedRole?.id === role.id;
                    return (
                      <div
                        key={role.id}
                        onClick={() => setSelectedRole(role)}
                        className={["p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between text-left",
                          isSelected ? "border-indigo-600 bg-indigo-50/60 shadow-md ring-2 ring-indigo-500/20" : "border-slate-200 bg-white hover:border-slate-300"
                        ].join(" ")}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{role.category}</span>
                            <div className={["w-4 h-4 rounded-full border flex items-center justify-center shrink-0", isSelected ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 bg-white"].join(" ")}>
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                          </div>
                          <div className="text-sm font-extrabold text-slate-900 mt-1">{role.title}</div>
                          <div className="text-xs text-slate-500 font-medium mt-1 line-clamp-2">{role.description}</div>
                        </div>
                        <div className="mt-3 text-[11px] font-semibold text-slate-400">{role.skillCount} Relevant Skills Mapped</div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    disabled={!selectedRole}
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/25 cursor-pointer"
                  >
                    <span>Next Step: Select Relevant Skills ({selectedRole?.skillCount ?? 0})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
            {/* STEP 2: SELECT CURRENT SKILLS (ROLE RELEVANT ONLY) */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
                    <BookMarked className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Step 2: Select Your Current Skills
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Showing <span className="font-extrabold text-indigo-600">skills relevant to {selectedRole?.title}</span>. Select which ones you currently possess.
                  </p>
                </div>
                {/* Relevance Filter Toggle Banner */}
                <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold">
                  <div className="flex items-center gap-2 text-indigo-900">
                    <Filter className="w-4 h-4 text-indigo-600" />
                    <span>Filter Mode: <strong className="font-extrabold">{showOnlyRoleSkills ? `Relevant to ${selectedRole?.title} (${roleRelevantSkills.length} Skills)` : `All Skills (${skills.length})`}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowOnlyRoleSkills(!showOnlyRoleSkills)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-100 transition-all text-xs cursor-pointer"
                    >
                      {showOnlyRoleSkills ? "Show All Skills" : `Only ${selectedRole?.title} Skills`}
                    </button>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-xl">
                      {selectedSkillIds.size} Checked
                    </span>
                  </div>
                </div>
                {/* Search & Category Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder={`Search ${selectedRole?.title} skills...`}
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => setCatFilter(c)}
                      className={["px-3 py-1.5 rounded-lg text-xs font-bold border transition-all", catFilter === c ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"].join(" ")}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                {/* Skills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {filteredSkills.map(skill => {
                    const isSelected = selectedSkillIds.has(skill.id);
                    return (
                      <button
                        key={skill.id}
                        onClick={() => toggleSkill(skill.id)}
                        className={["p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer",
                          isSelected ? "border-emerald-400 bg-emerald-50 text-emerald-800 shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        ].join(" ")}
                      >
                        {isSelected ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />}
                        <span className="truncate">{skill.name}</span>
                      </button>
                    );
                  })}
                  {filteredSkills.length === 0 && (
                    <div className="col-span-4 text-center py-8 text-xs text-slate-400 font-medium">
                      No relevant skills match your filter search. Try clicking "Show All Skills".
                    </div>
                  )}
                </div>
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Role
                  </button>
                  <button
                    onClick={runAnalysis}
                    disabled={loading || selectedSkillIds.size === 0}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/25 cursor-pointer"
                  >
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Skill Gap...</> : <><Sparkles className="w-4 h-4" /> Analyze Skill Gap</>}
                  </button>
                </div>
              </motion.div>
            )}
            {/* STEP 3: MISSING SKILLS & READINESS OUTPUT */}
            {step === 3 && result && (
              <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Step 3: Readiness Score & Missing Skills Output
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Here is your benchmark output for <span className="font-extrabold text-slate-900">{result.roleTitle}</span>.
                  </p>
                </div>
                {/* Readiness Score Card */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center gap-6 justify-between">
                  <div className="space-y-2 text-center sm:text-left">
                    <div className="text-xs font-bold text-indigo-300 uppercase tracking-widest">{result.roleCategory}</div>
                    <div className="text-2xl font-extrabold text-white">{result.roleTitle}</div>
                    <div className="text-sm font-semibold text-slate-300">Readiness Level: <span className="text-emerald-400 font-extrabold">{result.label}</span></div>
                  </div>
                  <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke={result.score >= 70 ? "#10b981" : result.score >= 40 ? "#6366f1" : "#f43f5e"} strokeWidth="10" strokeDasharray={(result.score / 100) * 263.8 + " 263.8"} strokeLinecap="round" />
                    </svg>
                    <div className="absolute text-center">
                      <div className="text-3xl font-black text-white">{result.score}%</div>
                      <div className="text-[9px] font-bold text-indigo-200 uppercase tracking-wider">Match Score</div>
                    </div>
                  </div>
                </div>
                {/* Matched vs Missing Skills Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Matched Skills */}
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-emerald-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Matched Skills ({result.matchedSkills.length})
                      </h3>
                    </div>
                    <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                      {result.matchedSkills.map(s => (
                        <div key={s.id} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-emerald-200/60 text-xs font-bold text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{s.name}</span>
                        </div>
                      ))}
                      {result.matchedSkills.length === 0 && <div className="text-xs text-slate-400 italic">No skills matched yet.</div>}
                    </div>
                  </div>
                  {/* Missing Skills */}
                  <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-rose-900 flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-600" /> Missing Skills ({result.missingSkills.length})
                      </h3>
                    </div>
                    <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                      {result.missingSkills.map(s => (
                        <div key={s.id} className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-rose-200/60 text-xs font-bold text-rose-900">
                          <div className="flex items-center gap-2">
                            <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{s.name}</span>
                          </div>
                          <span className={["text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase",
                            s.priority === "Critical" ? "bg-rose-100 text-rose-700" : s.priority === "High" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"
                          ].join(" ")}>{s.priority}</span>
                        </div>
                      ))}
                      {result.missingSkills.length === 0 && <div className="text-xs text-emerald-600 font-bold">🎉 No missing skills! You are 100% ready.</div>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <button onClick={() => setStep(2)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all cursor-pointer">
                    <ArrowLeft className="w-4 h-4" /> Back to Skills
                  </button>
                  <button onClick={() => setStep(4)} className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/25 cursor-pointer">
                    <span>Next: Detailed Report & Courses</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
            {/* STEP 4: DETAILED REPORT & RECOMMENDED COURSE LINKS */}
            {step === 4 && result && (
              <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Step 4: Report & Recommended Courses
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Here are direct course links, tutorials, and documentation websites to close your skill gaps for <span className="font-extrabold text-slate-900">{result.roleTitle}</span>.
                  </p>
                </div>
                {/* Recommended Courses & Websites Grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-600" /> Curated Learning Resources & Website Links
                    </h3>
                    <span className="text-xs font-semibold text-slate-500">{result.recommendedResources.length} Courses Found</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[360px] overflow-y-auto pr-1">
                    {result.recommendedResources.map(res => (
                      <a
                        key={res.id}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                            <span>{res.skillName}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0" />
                          </div>
                          <div className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">{res.title}</div>
                          <div className="text-xs text-slate-500 font-medium mt-1">Website / Provider: <span className="font-bold text-slate-700">{res.provider}</span></div>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase">{res.level}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{res.durationHours} hours est.</span>
                        </div>
                      </a>
                    ))}
                    {result.recommendedResources.length === 0 && (
                      <div className="col-span-2 text-center py-8 text-xs text-slate-400 font-medium">
                        No missing skill resources needed! Explore all platform courses in your Dashboard.
                      </div>
                    )}
                  </div>
                </div>
                {/* Action Footer */}
                <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-extrabold text-indigo-950">Ready to start learning?</div>
                    <div className="text-xs text-indigo-700 font-medium mt-0.5">Your skill analysis and roadmap are saved to your dashboard.</div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => router.push("/roadmap/" + result.assessmentId)}
                      className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-white border border-indigo-200 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Map className="w-4 h-4" /> View Roadmap
                    </button>
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Proceed to Dashboard <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <footer className="text-center text-xs text-slate-400 font-medium py-4">
        © 2026 SkillGap AI • Career Intelligence System
      </footer>
    </main>
  );
}