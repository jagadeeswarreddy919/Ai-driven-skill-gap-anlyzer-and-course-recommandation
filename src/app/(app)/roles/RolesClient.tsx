"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Target, ArrowRight } from "lucide-react";

interface Role { id: string; slug: string; title: string; category: string; description: string; skillCount: number; }

export default function RolesClient({ roles }: { roles: Role[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(roles.map(r => r.category)))];
  const filtered = roles.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = filter === "All" || r.category === filter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Browse Target Roles</h2>
        <p className="text-sm text-slate-500 font-medium mt-1">Select a role to analyze your skill gap.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search roles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${filter === cat ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(role => (
          <Link
            key={role.id}
            href={`/analyzer?role=${role.slug}`}
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">{role.category}</div>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">{role.title}</h3>
                <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2">{role.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 shrink-0 mt-1 transition-colors" />
            </div>
            <div className="mt-4 text-xs font-semibold text-slate-500">{role.skillCount} skills indexed</div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-12 text-slate-400 text-sm font-medium">No roles match your search.</div>
        )}
      </div>
    </div>
  );
}
