"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TARGET_ROLES_DATA } from "@/data/landingData";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  ChevronRight,
  Home,
  BarChart2,
  Target,
  Bookmark,
  Settings,
  Grid,
} from "lucide-react";

export const ProductPreview: React.FC = () => {
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const activeRole = TARGET_ROLES_DATA[activeRoleIndex];

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 relative group">
      {/* Soft Light Purple Glow behind Card */}
      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-indigo-300/30 via-purple-300/20 to-sky-300/30 blur-2xl opacity-80" />

      {/* Main Light Floating Dashboard Container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl bg-white border border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(79,70,229,0.12)] overflow-hidden text-slate-800"
      >
        {/* Role Selector Bar at Top */}
        <div className="p-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2 px-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Target className="w-3.5 h-3.5 text-indigo-600" />
            Switch Target Role:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TARGET_ROLES_DATA.map((role, idx) => (
              <button
                key={role.id}
                onClick={() => setActiveRoleIndex(idx)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  activeRoleIndex === idx
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
              >
                {role.roleTitle}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Body with Left Icon Sidebar & Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
          {/* Left Mini Sidebar */}
          <div className="hidden md:flex md:col-span-1 border-r border-slate-100 bg-slate-50/50 flex-col items-center py-6 justify-between">
            <div className="space-y-6 flex flex-col items-center">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                S
              </div>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Home className="w-4 h-4" />
              </div>
              <div className="p-2 text-slate-400 hover:text-slate-600">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div className="p-2 text-slate-400 hover:text-slate-600">
                <Target className="w-4 h-4" />
              </div>
              <div className="p-2 text-slate-400 hover:text-slate-600">
                <Bookmark className="w-4 h-4" />
              </div>
              <div className="p-2 text-slate-400 hover:text-slate-600">
                <Settings className="w-4 h-4" />
              </div>
            </div>
            <div className="p-2 text-slate-400">
              <Grid className="w-4 h-4" />
            </div>
          </div>

          {/* Center & Right Content Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="col-span-1 md:col-span-11 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Center Dashboard View: Circular Readiness Meter */}
              <div className="lg:col-span-7 flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-b from-slate-50/80 to-white border border-slate-100">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {activeRole.roleTitle}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5 mb-6">
                  Career Readiness Analysis
                </p>

                {/* SVG Radial Circular Meter */}
                <div className="relative w-44 h-44 flex items-center justify-center my-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#E2E8F0"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#gradient-ring)"
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{
                        strokeDashoffset: 251.2 - (251.2 * activeRole.readinessScore) / 100,
                      }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                    <defs>
                      <linearGradient id="gradient-ring" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#4F46E5" />
                        <stop offset="100%" stopColor="#9333EA" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
                      {activeRole.readinessScore}%
                    </span>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mt-0.5">
                      Ready
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 max-w-xs mt-4 leading-relaxed font-medium">
                  You are {activeRole.readinessScore}% ready for this role. Focus on improving the missing skills to become job-ready.
                </p>

                <button className="mt-6 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-xl shadow-sm inline-flex items-center gap-1.5 transition-all">
                  View Full Analysis <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {/* Right Side Cards: Skills You Have & Skills Missing */}
              <div className="lg:col-span-5 space-y-4">
                {/* Skills You Have Card */}
                <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Skills You Have
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {activeRole.skillsHave.length}
                      </span>
                      <span className="text-[11px] text-indigo-600 font-semibold cursor-pointer">
                        View all
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {activeRole.skillsHave.slice(0, 5).map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-700"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills Missing Card */}
                <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Skills Missing
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                        {activeRole.skillsMissing.length}
                      </span>
                      <span className="text-[11px] text-indigo-600 font-semibold cursor-pointer">
                        View all
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {activeRole.skillsMissing.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-700"
                      >
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
