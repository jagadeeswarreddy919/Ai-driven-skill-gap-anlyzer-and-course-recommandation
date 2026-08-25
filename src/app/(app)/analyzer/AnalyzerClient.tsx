"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Target, BookMarked, CheckCircle2, XCircle, Sparkles, ArrowRight, ArrowLeft,
  Search, ExternalLink, BookOpen, Check, Loader2, AlertCircle, LayoutDashboard, Map, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Role { id: string; slug: string; title: string; category: string; description?: string; roleSkillIds: string[]; }
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

export default function AnalyzerClient({
  roles, skills, plan, usageCheck, defaultRoleSlug, savedSkillIds
}: {
  roles: Role[];
  skills: Skill[];
  plan: string;
  usageCheck: { allowed: boolean; used: number; limit: number | null };
  defaultRoleSlug?: string;
  savedSkillIds: string[];
}) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(
    defaultRoleSlug ? roles.find(r => r.slug === defaultRoleSlug) ?? roles[0] ?? null : roles[0] ?? null
  );
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
    if (selectedSkillIds.size === 0) { setError("Please select at least one skill."); return; }
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
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Skill Gap Analyzer</h2>
        <p className="text-sm text-slate-500 font-medium mt-1">Interactive step-by-step skill gap assessment and course recommendations.</p>
      </div>

      {!usageCheck.allowed && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          You have used {usageCheck.used}/{usageCheck.limit} analyses this month.{" "}
          <button onClick={() => router.push("/settings/billing")} className="underline font-bold">Upgrade to Standard for unlimited analyses.</button>
        </div>
      )}

      {/* Stepper Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          {stepsList.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={["w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all border-2",
                step === s.num ? "bg-indigo-600 border-indigo-600 text-white" :
                step > s.num ? "bg-emerald-500 border-emerald-500 text-white" :
                "bg-white border-slate-200 text-slate-400"
              ].join(" ")}>
                {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className={["text-xs font-bold hidden sm:inline", step === s.num ? "text-slate-900" : "text-slate-400"].join(" ")}>
                {s.title}
              </span>
              {i < stepsList.length - 1 && <div className="w-4 sm:w-8 h-0.5 bg-slate-200 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Step Content */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <AnimatePresence mode="wait">
          {/* STEP 1: TARGET ROLE */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600" /> Step 1: Select Your Target Career Role
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Choose from 20+ benchmarked technical roles.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search target roles..."
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto pr-1">
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
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  disabled={!selectedRole}
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm disabled:opacity-50 transition-all shadow-md shadow-indigo-500/25 cursor-pointer"
                >
                  <span>Next: Select Relevant Skills ({roleRelevantSkills.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
          {/* STEP 2: SELECT MY SKILLS (ROLE RELEVANT ONLY) */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <BookMarked className="w-5 h-5 text-indigo-600" /> Step 2: Select Your Current Skills
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Targeting <span className="font-bold text-indigo-600">{selectedRole?.title}</span>.</p>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">{selectedSkillIds.size} checked</span>
              </div>
              {/* Relevance Toggle Filter */}
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold">
                <div className="flex items-center gap-2 text-indigo-900">
                  <Filter className="w-4 h-4 text-indigo-600" />
                  <span>Showing: <strong className="font-extrabold">{showOnlyRoleSkills ? `Relevant to ${selectedRole?.title} (${roleRelevantSkills.length} Skills)` : `All Skills (${skills.length})`}</strong></span>
                </div>
                <button
                  onClick={() => setShowOnlyRoleSkills(!showOnlyRoleSkills)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-100 transition-all text-xs cursor-pointer"
                >
                  {showOnlyRoleSkills ? "Show All Skills" : `Only ${selectedRole?.title} Skills`}
                </button>
              </div>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
                {filteredSkills.map(skill => {
                  const isSelected = selectedSkillIds.has(skill.id);
                  return (
                    <button
                      key={skill.id}
                      onClick={() => toggleSkill(skill.id)}
                      className={["p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer",
                        isSelected ? "border-emerald-400 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      ].join(" ")}
                    >
                      {isSelected ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />}
                      <span className="truncate">{skill.name}</span>
                    </button>
                  );
                })}
                {filteredSkills.length === 0 && (
                  <div className="col-span-4 text-center py-8 text-xs text-slate-400 font-medium">
                    No skills match filter. Click "Show All Skills" to browse global database.
                  </div>
                )}
              </div>
              {error && <div className="text-xs text-rose-600 font-semibold">{error}</div>}
              <div className="flex items-center justify-between pt-2">
                <button onClick={() => setStep(1)} className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer">Back</button>
                <button
                  onClick={runAnalysis}
                  disabled={loading || selectedSkillIds.size === 0 || !usageCheck.allowed}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm disabled:opacity-50 transition-all shadow-md shadow-indigo-500/25 cursor-pointer"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Sparkles className="w-4 h-4" /> Analyze Skill Gap</>}
                </button>
              </div>
            </motion.div>
          )}
          {/* STEP 3: MISSING SKILLS & READINESS OUTPUT */}
          {step === 3 && result && (
            <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-3xl flex flex-col sm:flex-row items-center gap-6 justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-indigo-300 uppercase tracking-widest">{result.roleCategory}</div>
                  <div className="text-2xl font-extrabold text-white">{result.roleTitle}</div>
                  <div className="text-xs text-slate-300 font-semibold">Readiness Level: <span className="text-emerald-400 font-bold">{result.label}</span></div>
                </div>
                <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={result.score >= 70 ? "#10b981" : result.score >= 40 ? "#6366f1" : "#f43f5e"} strokeWidth="10" strokeDasharray={(result.score / 100) * 263.8 + " 263.8"} strokeLinecap="round" />
                  </svg>
                  <div className="absolute text-center">
                    <div className="text-2xl font-black text-white">{result.score}%</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Matched Skills ({result.matchedSkills.length})
                  </h4>
                  <div className="space-y-1 max-h-[200px] overflow-y-auto">
                    {result.matchedSkills.map(s => (
                      <div key={s.id} className="text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {s.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-extrabold text-rose-900 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" /> Missing Skills ({result.missingSkills.length})
                  </h4>
                  <div className="space-y-1 max-h-[200px] overflow-y-auto">
                    {result.missingSkills.map(s => (
                      <div key={s.id} className="text-xs font-bold text-rose-900 bg-white px-3 py-1.5 rounded-lg border border-rose-200 flex items-center justify-between">
                        <span className="flex items-center gap-1.5"><XCircle className="w-3 h-3 text-rose-500" /> {s.name}</span>
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">{s.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <button onClick={() => setStep(2)} className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer">Back</button>
                <button onClick={() => setStep(4)} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-500/25 cursor-pointer">
                  <span>Next: Course Links & Report</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
          {/* STEP 4: REPORT & RECOMMENDED COURSE LINKS */}
          {step === 4 && result && (
            <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" /> Recommended Courses & Learning Websites
                </h3>
                <p className="text-xs text-slate-500 font-medium">Direct resources to fill your identified skill gaps for {result.roleTitle}.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
                {result.recommendedResources.map(res => (
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
              <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-indigo-900 font-bold">Analysis saved to your account!</div>
                <div className="flex items-center gap-3">
                  <button onClick={() => router.push("/roadmap/" + result.assessmentId)} className="px-4 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition-all flex items-center gap-1 cursor-pointer">
                    <Map className="w-3.5 h-3.5" /> View Roadmap
                  </button>
                  <button onClick={() => router.push("/dashboard")} className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer">
                    <LayoutDashboard className="w-3.5 h-3.5" /> Go to Dashboard <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}