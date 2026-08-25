"use client";

import React from "react";
import { motion } from "framer-motion";
import { PROBLEM_CARDS } from "@/data/landingData";
import { FileSpreadsheet, Target, Compass, AlertCircle } from "lucide-react";

const getIcon = (name: string) => {
  switch (name) {
    case "FileSpreadsheet":
      return <FileSpreadsheet className="w-6 h-6 text-rose-600" />;
    case "Target":
      return <Target className="w-6 h-6 text-amber-600" />;
    case "Compass":
      return <Compass className="w-6 h-6 text-purple-600" />;
    default:
      return <AlertCircle className="w-6 h-6 text-purple-600" />;
  }
};

export const ProblemSection: React.FC = () => {
  return (
    <section className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 mb-4"
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            The Career Dilemma
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            Knowing what to learn is harder than learning it.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium"
          >
            Job descriptions are filled with technologies, frameworks, tools, and requirements. It can be difficult to know which ones you already understand, which ones you're missing, and which skills actually matter most.
          </motion.p>
        </div>

        {/* 3 Light Problem Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROBLEM_CARDS.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {getIcon(card.iconName)}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                {card.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
