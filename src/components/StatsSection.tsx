"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Code, BarChart3, Target } from "lucide-react";

export const StatsSection: React.FC = () => {
  const stats = [
    {
      value: "20+",
      label: "Target Roles",
      desc: "Popular career paths to choose from",
      icon: <Briefcase className="w-6 h-6 text-purple-600" />,
      bg: "bg-purple-100/70",
    },
    {
      value: "150+",
      label: "In-Demand Skills",
      desc: "Curated skills across multiple domains",
      icon: <Code className="w-6 h-6 text-emerald-600" />,
      bg: "bg-emerald-100/70",
    },
    {
      value: "6",
      label: "Skill Categories",
      desc: "Well-organized skill classifications",
      icon: <BarChart3 className="w-6 h-6 text-amber-600" />,
      bg: "bg-amber-100/70",
    },
    {
      value: "1",
      label: "Clear Goal",
      desc: "Understand your gap and take action",
      icon: <Target className="w-6 h-6 text-indigo-600" />,
      bg: "bg-indigo-100/70",
    },
  ];

  return (
    <section className="py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 4 Light Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
            >
              <div className={`p-3.5 rounded-xl ${stat.bg} shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-slate-800 mt-0.5">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">
                  {stat.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trusted By Logos */}
        <div className="text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-8">
            Trusted by learners from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            <span className="font-extrabold text-2xl tracking-tighter text-slate-800">Google</span>
            <span className="font-bold text-2xl tracking-tight text-slate-800">Microsoft</span>
            <span className="font-bold text-2xl tracking-tighter text-slate-800">amazon</span>
            <span className="font-black text-2xl tracking-widest text-slate-800">NETFLIX</span>
            <span className="font-extrabold text-2xl tracking-tight text-slate-800">Spotify</span>
            <span className="font-extrabold text-2xl tracking-tight text-slate-800">airbnb</span>
          </div>
        </div>
      </div>
    </section>
  );
};
