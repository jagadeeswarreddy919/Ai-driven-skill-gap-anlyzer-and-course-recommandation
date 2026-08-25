import React from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ArrowLeft } from "lucide-react";

interface AuthHeaderProps {
  type: "login" | "signup" | "forgot" | "reset";
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ type }) => {
  return (
    <header className="w-full py-5 px-6 sm:px-10 flex items-center justify-between z-20">
      <div className="flex items-center gap-4">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs hover:bg-slate-50 transition-all">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <Link href="/" aria-label="SkillGap AI Home" className="hidden sm:block">
          <Logo />
        </Link>
      </div>

      <div className="text-sm font-semibold text-slate-600">
        {type === "login" ? (
          <span className="flex items-center gap-2">
            <span className="hidden sm:inline">Don't have an account?</span>
            <Link
              href="/signup"
              className="text-indigo-600 hover:text-indigo-700 bg-indigo-50 border border-indigo-200 px-3.5 py-1.5 rounded-xl transition-all font-bold text-xs sm:text-sm"
            >
              Sign Up
            </Link>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span className="hidden sm:inline">Already have an account?</span>
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-700 bg-indigo-50 border border-indigo-200 px-3.5 py-1.5 rounded-xl transition-all font-bold text-xs sm:text-sm"
            >
              Log In
            </Link>
          </span>
        )}
      </div>
    </header>
  );
};

export const AuthFooter: React.FC = () => {
  return (
    <footer className="py-6 px-6 text-center text-xs text-slate-500 font-medium z-20">
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <span>© 2026 SkillGap AI</span>
        <span className="text-slate-300">•</span>
        <a href="#privacy" className="hover:text-slate-800 transition-colors">
          Privacy Policy
        </a>
        <span className="text-slate-300">•</span>
        <a href="#terms" className="hover:text-slate-800 transition-colors">
          Terms of Service
        </a>
        <span className="text-slate-300">•</span>
        <a href="mailto:support@skillgap.ai" className="hover:text-slate-800 transition-colors">
          Help & Support
        </a>
      </div>
    </footer>
  );
};