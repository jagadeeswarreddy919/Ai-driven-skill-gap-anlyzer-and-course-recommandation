"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserCheck, Target, CheckSquare, BarChart3, Sparkles } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description: "Sign up and tell us about your background and current experience.",
      icon: <UserCheck className="w-6 h-6 text-purple-600" />,
    },
    {
      number: "02",
      title: "Choose Your Target",
      description: "Select the role you want to pursue from our curated career paths.",
      icon: <Target className="w-6 h-6 text-indigo-600" />,
    },
    {
      number: "03",
      title: "Select Your Skills",
      description: "Pick the skills you already know and rate your proficiency level.",
      icon: <CheckSquare className="w-6 h-6 text-sky-600" />,
    },
    {
      number: "04",
      title: "Analyze Your Gap",
      description: "Get your readiness score, missing skills, and learning recommendations.",
      icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 relative z-10">
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
            How It Works
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            From skills to clarity in{" "}
            <span className="text-indigo-600">4 easy steps</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium"
          >
            Our simple process helps you understand your skill gap and get a clear roadmap to success.
          </motion.p>
        </div>

        {/* 4 Cards with Connector Arrows */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              whileHover={{ y: -6 }}
              className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-extrabold text-indigo-600 border border-indigo-100 bg-indigo-50/60 px-3 py-1 rounded-xl font-mono">
                    {step.number}
                  </span>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
