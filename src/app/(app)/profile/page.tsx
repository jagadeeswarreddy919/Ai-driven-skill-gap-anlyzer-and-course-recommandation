"use client";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const [form, setForm] = useState({ name: "", email: "", goal: "", experience: "Junior" });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(data => {
      if (data.user) setForm(prev => ({ ...prev, name: data.user.name ?? "", email: data.user.email ?? "" }));
    });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div><h2 className="text-2xl font-extrabold text-slate-900">Profile</h2><p className="text-sm text-slate-500 font-medium mt-1">Manage your career profile information.</p></div>
      <form onSubmit={save} className="bg-white rounded-3xl border border-slate-200 p-8 space-y-5">
        {[{ label: "Full Name", key: "name", type: "text", placeholder: "Your full name" }, { label: "Email", key: "email", type: "email", placeholder: "you@example.com" }, { label: "Career Goal", key: "goal", type: "text", placeholder: "e.g. Get a Full Stack Developer role" }].map(field => (
          <div key={field.key}>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{field.label}</label>
            <input type={field.type} placeholder={field.placeholder} value={(form as Record<string,string>)[field.key]} onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600" />
          </div>
        ))}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Experience Level</label>
          <select value={form.experience} onChange={e => setForm(prev => ({ ...prev, experience: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600">
            {["Student","Junior","Mid-Level","Senior","Career Switcher"].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : "Save Changes"}
        </button>
      </form>
    </div>
  );
}