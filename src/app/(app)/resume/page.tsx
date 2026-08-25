"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Upload, CheckCircle2, AlertCircle, Loader2, Lock } from "lucide-react";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string[] | null>(null);
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);
  const router = useRouter();

  const upload = async () => {
    if (!file) return;
    setLoading(true); setError("");
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/resume/analyze", { method: "POST", body: formData });
    const data = await res.json();
    setLoading(false);
    if (res.status === 403) { setLocked(true); return; }
    if (!res.ok) { setError(data.message ?? "Failed."); return; }
    setResult(data.skills);
  };

  if (locked) return (
    <div className="max-w-2xl"><div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
      <Lock className="w-10 h-10 text-purple-300 mx-auto" />
      <h2 className="text-xl font-extrabold text-slate-900">Resume Analyzer</h2>
      <p className="text-sm text-slate-500">This feature requires a Pro subscription.</p>
      <button onClick={() => router.push("/settings/billing")} className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition-all">Upgrade to Pro</button>
    </div></div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <div><h2 className="text-2xl font-extrabold text-slate-900">Resume Analyzer</h2><p className="text-sm text-slate-500 font-medium mt-1">Upload your resume to auto-detect your skills.</p></div>
      <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-5">
        <label className="block border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-10 text-center cursor-pointer transition-colors">
          <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <div className="text-sm font-bold text-slate-700">{file ? file.name : "Click to upload PDF or TXT (max 5MB)"}</div>
          <input type="file" accept=".pdf,.txt" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
        </label>
        {error && <div className="flex items-center gap-2 text-xs text-rose-600 font-semibold"><AlertCircle className="w-4 h-4" /> {error}</div>}
        <button onClick={upload} disabled={!file || loading} className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><FileText className="w-4 h-4" /> Analyze Resume</>}
        </button>
      </div>
      {result && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Detected Skills ({result.length})</h3>
          <div className="flex flex-wrap gap-2">
            {result.map(s => <span key={s} className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {s}</span>)}
          </div>
          <button onClick={() => router.push("/analyzer")} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all">Analyze Skill Gap</button>
        </div>
      )}
    </div>
  );
}