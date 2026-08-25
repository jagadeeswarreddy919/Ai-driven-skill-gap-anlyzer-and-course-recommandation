"use client";

import React from "react";
import { motion } from "framer-motion";
import { WHY_PRINCIPLES } from "@/data/landingData";
import { Sparkles } from "lucide-react";

export const WhySkillGap: React.FC = () => {
  return (
    <section className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Large Typography Header */}
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-700 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Core Philosophy
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]"
          >
            Your career deserves a{" "}
            <span className="text-indigo-600">clearer roadmap.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-medium"
          >
            Instead of randomly collecting courses and technologies, understand the skills that actually matter for the role you're targeting.
          </motion.p>
        </div>

        {/* 3 Principles Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {WHY_PRINCIPLES.map((principle, idx) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -4 }}
              className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="text-4xl font-extrabold font-sans text-indigo-200 group-hover:text-indigo-600 transition-colors mb-4">
                0{idx + 1}
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                {principle.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {principle.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
