"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText, Upload, CheckCircle2, AlertCircle, Loader2, Lock,
  Sparkles, ArrowRight, Layers, Eye, Check, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    skills: string[];
    count: number;
    savedToProfile: number;
    textSnippet?: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/resume/analyze", { method: "POST", body: formData });
      const data = await res.json();
      setLoading(false);

      if (res.status === 403) {
        setLocked(true);
        return;
      }
      if (!res.ok) {
        setError(data.message ?? "Failed to analyze resume.");
        return;
      }

      setResult({
        skills: data.skills || [],
        count: data.count || (data.skills ? data.skills.length : 0),
        savedToProfile: data.savedToProfile ?? (data.skills ? data.skills.length : 0),
        textSnippet: data.textSnippet,
      });
    } catch {
      setLoading(false);
      setError("Network error while uploading resume. Please try again.");
    }
  };

  if (locked) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mx-auto text-purple-600">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Resume Analyzer (Pro Feature)</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Upgrade to Pro to unlock AI-powered resume text parsing, automated skill extraction, and real-time skill profile syncing.
          </p>
          <button
            onClick={() => router.push("/settings/billing")}
            className="px-6 py-3 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition-all shadow-md shadow-purple-500/25 cursor-pointer"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>AI Resume Parser & Skill Extractor</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Resume Analyzer</h2>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Upload your PDF or TXT resume to auto-detect all technical skills and benchmark against target roles.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
        <label className="block border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-indigo-50/30 group">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 flex items-center justify-center mx-auto mb-3 transition-all">
            <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
            {file ? file.name : "Click or drag & drop to upload resume"}
          </div>
          <p className="text-xs text-slate-400 font-medium mt-1">
            {file ? `${(file.size / 1024).toFixed(1)} KB • Click to change file` : "Supports PDF or TXT (Max 10MB)"}
          </p>
          <input
            type="file"
            accept=".pdf,.txt"
            className="hidden"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setResult(null);
              setError("");
            }}
          />
        </label>

        {error && (
          <div className="flex items-center gap-2 text-xs text-rose-600 font-semibold bg-rose-50 border border-rose-100 p-3 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={upload}
          disabled={!file || loading}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Parsing PDF & Extracting Skills...</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>Analyze Resume</span>
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Detected Skills ({result.skills.length})
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Successfully extracted and auto-saved to your skill profile.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Synced to Profile
                </span>
              </div>
            </div>

            {result.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {result.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3.5 py-2 rounded-xl bg-indigo-50/80 border border-indigo-100/80 text-xs font-bold text-indigo-800 flex items-center gap-1.5 hover:bg-indigo-100 transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-slate-500 font-medium">
                No matching technical skills found in resume. You can manually add skills in the Skill Library.
              </div>
            )}

            {result.textSnippet && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showPreview ? "Hide Parsed Text Preview" : "Show Parsed Text Preview"}</span>
                </button>
                {showPreview && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-mono max-h-40 overflow-y-auto whitespace-pre-wrap">
                    {result.textSnippet}...
                  </div>
                )}
              </div>
            )}

            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-100/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="text-xs font-bold text-indigo-950">Ready to benchmark your readiness score?</div>
                <div className="text-xs text-indigo-700">All {result.skills.length} detected skills will be pre-selected in the analyzer.</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => router.push("/skills")}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" /> My Skill Library
                </button>
                <button
                  onClick={() => router.push("/analyzer")}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Analyze Skill Gap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}