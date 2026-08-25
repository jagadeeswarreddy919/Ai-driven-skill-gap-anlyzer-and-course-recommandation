"use client";

import React from "react";
import { motion } from "framer-motion";
import { XCircle, CheckCircle2, HelpCircle } from "lucide-react";

export const BeforeAfterSection: React.FC = () => {
  return (
    <section className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700 mb-4"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            The SkillGap Transformation
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            Replace guessing with clarity.
          </motion.h2>
        </div>

        {/* Side-by-Side Comparison Container */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Left Card: Before SkillGap AI */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-2xl border border-rose-200 bg-rose-50/40 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider bg-rose-100 px-3 py-1 rounded-md">
                  Before SkillGap AI
                </span>
                <XCircle className="w-6 h-6 text-rose-500" />
              </div>

              <div className="p-6 rounded-xl bg-white border border-rose-100 text-slate-700 italic text-base sm:text-lg leading-relaxed shadow-xs">
                "I want to become a Full Stack Developer, but I don't know what I'm missing."
              </div>

              <ul className="mt-6 space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
                <li className="flex items-center gap-2 text-rose-700">
                  <XCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  Overwhelmed by endless technology requirements
                </li>
                <li className="flex items-center gap-2 text-rose-700">
                  <XCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  Wasting time taking random courses without focus
                </li>
                <li className="flex items-center gap-2 text-rose-700">
                  <XCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  Zero quantifiable measurement of career readiness
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Right Card: After SkillGap AI */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-md">
                  After SkillGap AI
                </span>
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>

              <div className="p-6 rounded-xl bg-white border border-emerald-100 text-slate-900 space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">Target: Full Stack Dev</span>
                  <span className="text-xl font-extrabold text-emerald-600 font-sans">72% Ready</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                  <div>
                    <div className="text-emerald-700 mb-1">Verified Skills</div>
                    <div className="space-y-1 text-slate-600">
                      <div>✓ JavaScript</div>
                      <div>✓ React</div>
                      <div>✓ Git</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-rose-700 mb-1">Missing Gaps</div>
                    <div className="space-y-1 text-slate-600">
                      <div className="text-rose-600">→ Node.js</div>
                      <div className="text-rose-600">→ PostgreSQL</div>
                      <div className="text-rose-600">→ Docker</div>
                    </div>
                  </div>
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
                <li className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  Exact list of technologies to learn next
                </li>
                <li className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  Transparent 0-100% career readiness metric
                </li>
                <li className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  Laser-focused learning path saves months of effort
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
