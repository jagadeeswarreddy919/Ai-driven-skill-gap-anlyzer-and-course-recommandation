"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Compass, Sparkles, Award, ShieldCheck, Cpu } from "lucide-react";

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 relative z-10">
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
            About SkillGap AI
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            Bridging the gap between your skills and your <span className="text-indigo-600">dream career.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium"
          >
            SkillGap AI was built to eliminate guesswork from technical career development. We convert complex job requirements into transparent, actionable skill roadmaps.
          </motion.p>
        </div>

        {/* Story & Core Values Card Container */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          
          {/* Left Text Block */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Modern technical job descriptions list dozens of frameworks, cloud tools, and methodologies. Candidates are often left wondering: <em>"Am I qualified? What am I missing? What should I study tonight?"</em>
              </p>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                SkillGap AI replaces anxiety with algorithmic clarity. By comparing your current proficiencies against real-world engineering benchmarks, we calculate your exact career readiness score and give you a prioritized checklist of missing skills.
              </p>
            </div>
          </motion.div>

          {/* Right Highlights Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-4"
          >
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">AI-Powered Benchmarks</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Continuously updated against market job listings and engineering team specs.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Laser-Focused Roadmap</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Stop collecting random certificates. Focus purely on skills that boost your match score.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">For Every Career Stage</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Empowering students, developers, professionals, and career switchers worldwide.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
