"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CheckSquare,
  SearchCheck,
  Gauge,
  Briefcase,
  Network,
  Sparkles,
  ChevronRight,
  UserCheck,
  BookOpen,
} from "lucide-react";

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      id: "target-analysis",
      title: "Target Role Analysis",
      description: "Choose from 20+ in-demand roles across technology and business domains.",
      icon: <Briefcase className="w-5 h-5 text-purple-600" />,
      iconBg: "bg-purple-100/70",
    },
    {
      id: "gap-detection",
      title: "Skill Gap Detection",
      description: "AI-powered analysis to identify exactly which skills you're missing for your target role.",
      icon: <SearchCheck className="w-5 h-5 text-emerald-600" />,
      iconBg: "bg-emerald-100/70",
    },
    {
      id: "readiness-score",
      title: "Readiness Score",
      description: "Get a clear percentage score showing how ready you are for your target role.",
      icon: <Gauge className="w-5 h-5 text-amber-600" />,
      iconBg: "bg-amber-100/70",
    },
    {
      id: "skill-profile",
      title: "Skill Profile Management",
      description: "Build and manage your skill profile with proficiency levels and experience.",
      icon: <UserCheck className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-100/70",
    },
    {
      id: "skill-map",
      title: "Visual Skill Map",
      description: "Interactive visualization of your strengths, weaknesses, and skill distribution.",
      icon: <Network className="w-5 h-5 text-pink-600" />,
      iconBg: "bg-pink-100/70",
    },
    {
      id: "learning-recommendations",
      title: "Learning Recommendations",
      description: "Get personalized learning paths and resources to fill your skill gaps effectively.",
      icon: <BookOpen className="w-5 h-5 text-cyan-600" />,
      iconBg: "bg-cyan-100/70",
    },
  ];

  return (
    <section id="features" className="py-20 relative z-10">
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
            Features
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            Everything you need to{" "}
            <span className="text-indigo-600">close your skill gap</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium"
          >
            Powerful features designed to accelerate your career growth
          </motion.p>
        </div>

        {/* 6 Clean Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-start justify-between group cursor-pointer"
            >
              <div className="flex gap-4">
                <div className={`p-3 rounded-xl ${feature.iconBg} shrink-0`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
