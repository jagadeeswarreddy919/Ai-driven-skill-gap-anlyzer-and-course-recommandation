"use client";

import React from "react";
import { motion } from "framer-motion";
import { SOLUTION_STEPS } from "@/data/landingData";
import { Sparkles, ChevronRight } from "lucide-react";

export const SolutionFlow: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50/60 border-y border-slate-200/60 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-700 mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Intelligence Engine
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            Turn uncertainty into a{" "}
            <span className="text-indigo-600">clear learning direction</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium"
          >
            SkillGap AI transforms complex job requirements into a transparent, step-by-step skill comparison workflow.
          </motion.p>
        </div>

        {/* 5 Light Pipeline Cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 relative">
          {SOLUTION_STEPS.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                    STEP {item.step}
                  </span>
                  {idx < SOLUTION_STEPS.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
