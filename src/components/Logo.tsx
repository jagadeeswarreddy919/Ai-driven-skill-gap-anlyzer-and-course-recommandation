import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={["flex items-center gap-2", className].join(" ")}>
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-sm">
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <span className="font-black text-slate-900 text-sm tracking-tight">SkillGap <span className="text-indigo-600">AI</span></span>
    </div>
  );
}