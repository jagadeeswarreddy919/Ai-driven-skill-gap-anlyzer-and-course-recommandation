"use client";

import React from "react";
import { motion } from "framer-motion";
import { AUDIENCE_DATA } from "@/data/landingData";
import { GraduationCap, Code2, ArrowLeftRight, TrendingUp, Users } from "lucide-react";

const getAudienceIcon = (iconName: string) => {
  const props = { className: "w-6 h-6 text-purple-600" };
  switch (iconName) {
    case "GraduationCap":
      return <GraduationCap {...props} />;
    case "Code2":
      return <Code2 {...props} />;
    case "ArrowLeftRight":
      return <ArrowLeftRight {...props} />;
    case "TrendingUp":
      return <TrendingUp {...props} />;
    default:
      return <Users {...props} />;
  }
};

export const AudienceSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50/60 border-y border-slate-200/60 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-700 mb-4"
          >
            <Users className="w-3.5 h-3.5 text-purple-600" />
            Tailored For You
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            Built for every stage of your career.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium"
          >
            Whether you are writing your first line of code or stepping up to technical architecture.
          </motion.p>
        </div>

        {/* 4 Audience Cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AUDIENCE_DATA.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              whileHover={{ y: -6 }}
              className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 group-hover:scale-110 transition-transform">
                    {getAudienceIcon(card.iconName)}
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                    {card.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {card.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
