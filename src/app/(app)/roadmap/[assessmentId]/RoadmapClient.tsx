"use client";
import { useState } from "react";
import { CheckCircle2, Circle, ExternalLink } from "lucide-react";

interface RoadmapItem { id: string; week: number; skillName: string; objective: string; estimatedHours: number; resourceTitle?: string | null; resourceUrl?: string | null; completed: boolean; }

export default function RoadmapClient({ assessment, items: initialItems }: { assessment: { id: string; roleTitle: string; score: number }; items: RoadmapItem[] }) {
  const [items, setItems] = useState(initialItems);

  const toggle = async (itemId: string) => {
    setItems(prev => prev.map(it => it.id === itemId ? { ...it, completed: !it.completed } : it));
    await fetch("/api/roadmap/toggle", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ itemId }) });
  };

  const completed = items.filter(i => i.completed).length;
  const pct = items.length === 0 ? 0 : Math.round((completed / items.length) * 100);

  return (
    <div className="max-w-2xl space-y-6">
      <div><h2 className="text-2xl font-extrabold text-slate-900">Learning Roadmap</h2><p className="text-sm text-slate-500 font-medium mt-1">Target: {assessment.roleTitle}</p></div>
      <div className="bg-white p-5 rounded-2xl border border-slate-200">
        <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2"><span>Progress</span><span className="text-indigo-600">{completed}/{items.length} complete ({pct}%)</span></div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: pct + "%" }} /></div>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className={["p-5 bg-white rounded-2xl border transition-all", item.completed ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200"].join(" ")}>
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-black text-indigo-700">W{item.week}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-extrabold text-slate-900">{item.skillName}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{item.objective}</div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] font-bold text-slate-400">{item.estimatedHours}h estimated</span>
                  {item.resourceUrl && <a href={item.resourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:underline"><ExternalLink className="w-3 h-3" />{item.resourceTitle ?? "Resource"}</a>}
                </div>
              </div>
              <button onClick={() => toggle(item.id)} className="shrink-0 mt-0.5">
                {item.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-400 transition-colors" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}