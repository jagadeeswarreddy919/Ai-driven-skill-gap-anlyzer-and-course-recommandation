"use client";
import { useState } from "react";
import { Search, CheckCircle2, Plus } from "lucide-react";

interface Skill { id: string; name: string; category: string; }
const CATEGORIES = ["All","Programming","Frontend","Backend","Database","Cloud","DevOps","AI/ML","Testing","Security","Tools","System Design","Soft Skills"];

export default function SkillsClient({ skills, selectedIds }: { skills: Skill[]; selectedIds: string[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedIds));
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const filtered = skills.filter(s =>
    (cat === "All" || s.category === cat) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    await fetch("/api/skills/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ skillIds: Array.from(selected) }) });
    setSaving(false); setSaved(true);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">My Skills</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">{selected.size} skills in your profile</p>
        </div>
        <button onClick={save} disabled={saving} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all disabled:opacity-50">
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
      <div className="relative"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search skills..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600" /></div>
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(c => <button key={c} onClick={() => setCat(c)} className={["px-3 py-1.5 rounded-lg text-xs font-bold border transition-all", cat === c ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"].join(" ")}>{c}</button>)}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {filtered.map(skill => {
          const on = selected.has(skill.id);
          return <button key={skill.id} onClick={() => toggle(skill.id)} className={["p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center gap-2", on ? "border-emerald-400 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"].join(" ")}>
            {on ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" /> : <Plus className="w-3.5 h-3.5 shrink-0 text-slate-400" />}
            <span className="truncate">{skill.name}</span>
          </button>;
        })}
      </div>
    </div>
  );
}