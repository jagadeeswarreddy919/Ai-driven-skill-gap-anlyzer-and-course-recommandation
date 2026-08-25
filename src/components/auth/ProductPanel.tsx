"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Sparkles, Target } from "lucide-react";

interface ProductPanelProps {
  mode: "login" | "signup" | "forgot" | "reset";
}

export const ProductPanel: React.FC<ProductPanelProps> = ({ mode }) => {
  const isLogin = mode === "login" || mode === "forgot";

  return (
    <div className="w-full h-full flex flex-col justify-between p-8 sm:p-12 bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-sky-50/80 border-r border-indigo-100/80 relative overflow-hidden">
      
      {/* Background Decorative Soft Orbs */}
      <div className="absolute top-10 left-10 w-48 h-48 rounded-full bg-indigo-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-56 h-56 rounded-full bg-purple-200/30 blur-3xl pointer-events-none" />

      {/* Top Header & Message */}
      <div className="relative z-10 space-y-4 max-w-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-indigo-100 text-xs font-semibold text-indigo-700 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>SkillGap AI Intelligence Platform</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {isLogin
            ? "Your career analysis is waiting."
            : "Start with clarity. Build with purpose."}
        </h2>

        <p className="text-sm text-slate-600 font-medium leading-relaxed">
          {isLogin
            ? "Continue tracking your skills, assessments, and progress toward your target role."
            : "Create your profile, choose your target role, and discover exactly which skills you need next."}
        </p>
      </div>

      {/* Center Interactive Mini Dashboard Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative z-10 my-8 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xl shadow-indigo-900/5 space-y-5"
      >
        {/* Mock Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3 h-3 text-indigo-600" /> Target Role
            </span>
            <div className="text-base font-extrabold text-slate-900">Full Stack Developer</div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              72% Ready
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
            <span>Career Readiness</span>
            <span className="font-mono">72%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "72%" }}
              transition={{ duration: 1, delay: 0.4 }}
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
            />
          </div>
        </div>

        {/* Skills Mini Lists */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <div className="font-bold text-emerald-800 mb-2">Skills You Have</div>
            <div className="space-y-1.5 text-slate-700 font-semibold">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> JavaScript
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> React
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Git
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100">
            <div className="font-bold text-rose-800 mb-2">Skills Missing</div>
            <div className="space-y-1.5 text-slate-700 font-semibold">
              <div className="flex items-center gap-1.5 text-rose-700">
                <XCircle className="w-3.5 h-3.5 text-rose-500" /> Node.js
              </div>
              <div className="flex items-center gap-1.5 text-rose-700">
                <XCircle className="w-3.5 h-3.5 text-rose-500" /> PostgreSQL
              </div>
              <div className="flex items-center gap-1.5 text-rose-700">
                <XCircle className="w-3.5 h-3.5 text-rose-500" /> Docker
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Trust Note */}
      <div className="relative z-10 text-xs text-slate-500 font-medium flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Secure 256-bit encrypted session</span>
      </div>
    </div>
  );
};
