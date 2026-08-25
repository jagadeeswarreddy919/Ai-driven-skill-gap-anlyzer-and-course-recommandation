"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Sparkles, BarChart2, ShieldCheck } from "lucide-react";

interface RoleSkillMatrix {
  role: string;
  readiness: number;
  skills: { name: string; status: "have" | "missing"; priority?: string }[];
}

const COMPARISON_DATA: RoleSkillMatrix[] = [
  {
    role: "Full Stack Developer",
    readiness: 63,
    skills: [
      { name: "JavaScript (ES6+)", status: "have" },
      { name: "React & Next.js", status: "have" },
      { name: "Git & GitHub Workflow", status: "have" },
      { name: "REST APIs Architecture", status: "have" },
      { name: "Node.js & Express runtime", status: "missing", priority: "High Priority" },
      { name: "PostgreSQL & Relational Data", status: "missing", priority: "High Priority" },
      { name: "Docker Containerization", status: "missing", priority: "Medium Priority" },
      { name: "OAuth 2.0 & Authentication", status: "missing", priority: "High Priority" },
    ],
  },
  {
    role: "Backend & Systems Engineer",
    readiness: 50,
    skills: [
      { name: "Node.js & Express runtime", status: "have" },
      { name: "PostgreSQL & Relational Data", status: "have" },
      { name: "REST APIs Architecture", status: "have" },
      { name: "Git & GitHub Workflow", status: "have" },
      { name: "Redis Caching Layers", status: "missing", priority: "Critical Priority" },
      { name: "Microservices & Message Queues", status: "missing", priority: "High Priority" },
      { name: "System Design Patterns", status: "missing", priority: "Critical Priority" },
      { name: "Docker & Kubernetes", status: "missing", priority: "High Priority" },
    ],
  },
  {
    role: "AI Application Developer",
    readiness: 75,
    skills: [
      { name: "JavaScript / TypeScript", status: "have" },
      { name: "React & UI Frameworks", status: "have" },
      { name: "REST & GraphQL APIs", status: "have" },
      { name: "Python Core", status: "have" },
      { name: "OpenAI & Anthropic SDKs", status: "have" },
      { name: "Git & CI/CD", status: "have" },
      { name: "Vector Database Embedding (Pinecone)", status: "missing", priority: "High Priority" },
      { name: "Agent RAG Evaluation Protocols", status: "missing", priority: "Critical Priority" },
    ],
  },
];

export const SkillComparison: React.FC = () => {
  const [selectedRoleIdx, setSelectedRoleIdx] = useState(0);
  const currentData = COMPARISON_DATA[selectedRoleIdx];

  return (
    <section id="comparison" className="py-20 bg-slate-50/60 border-y border-slate-200/60 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700 mb-4"
          >
            <BarChart2 className="w-3.5 h-3.5 text-indigo-600" />
            Live Role Matrix
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            See where you stand.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium"
          >
            SkillGap AI continuously audits target job roles and cross-evaluates your proficiency line by line.
          </motion.p>
        </div>

        {/* Role Switcher */}
        <div className="mt-10 flex justify-center flex-wrap gap-2">
          {COMPARISON_DATA.map((item, idx) => (
            <button
              key={item.role}
              onClick={() => setSelectedRoleIdx(idx)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedRoleIdx === idx
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-white text-slate-700 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {item.role}
              {selectedRoleIdx === idx && <Sparkles className="w-3.5 h-3.5 inline ml-1.5" />}
            </button>
          ))}
        </div>

        {/* Matrix Card */}
        <motion.div
          layout
          className="mt-8 max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-lg relative"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                Target Role Benchmark
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{currentData.role}</h3>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-xl border border-slate-200/80">
              <div className="text-right">
                <div className="text-[11px] font-semibold text-slate-500">Match Score</div>
                <div className="text-2xl font-black text-slate-900 font-sans">{currentData.readiness}%</div>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-indigo-600 flex items-center justify-center font-bold text-xs text-indigo-600">
                {currentData.readiness}%
              </div>
            </div>
          </div>

          {/* Skill Items */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentData.role}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {currentData.skills.map((skill) => (
                <div
                  key={skill.name}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    skill.status === "have"
                      ? "bg-emerald-50/60 border-emerald-200 text-slate-800"
                      : "bg-rose-50/60 border-rose-200 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {skill.status === "have" ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm font-semibold">{skill.name}</span>
                  </div>

                  {skill.status === "have" ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Verified ✓
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                      {skill.priority}
                    </span>
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
