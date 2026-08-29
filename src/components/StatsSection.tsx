"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Code, BarChart3, Target } from "lucide-react";

export const StatsSection: React.FC = () => {
  const stats = [
    {
      value: "20+",
      label: "Target Technical Roles",
      desc: "Benchmark career paths in tech",
      icon: <Briefcase className="w-6 h-6 text-purple-600" />,
      bg: "bg-purple-100/70",
    },
    {
      value: "110+",
      label: "In-Demand Skills",
      desc: "Curated skills across technical domains",
      icon: <Code className="w-6 h-6 text-emerald-600" />,
      bg: "bg-emerald-100/70",
    },
    {
      value: "6",
      label: "Skill Categories",
      desc: "Frontend, Backend, DevOps, AI & Data",
      icon: <BarChart3 className="w-6 h-6 text-amber-600" />,
      bg: "bg-amber-100/70",
    },
    {
      value: "100%",
      label: "Free Readiness Analysis",
      desc: "Instant score, gap map & course links",
      icon: <Target className="w-6 h-6 text-indigo-600" />,
      bg: "bg-indigo-100/70",
    },
  ];

  return (
    <section className="py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4 Light Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-start gap-4"
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
      </div>
    </section>
  );
};
