"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Send } from "lucide-react";

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-20 relative z-10 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Light Gradient Container Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-50/90 via-purple-50/80 to-sky-50/90 border border-indigo-100 p-10 sm:p-16 text-center shadow-lg overflow-hidden">
          
          {/* Soft Decorative Floating Spheres & Paper Plane */}
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-indigo-200/40 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-purple-200/40 blur-2xl pointer-events-none" />

          {/* Floating Paper Plane Icon on Right */}
          <div className="hidden sm:block absolute right-12 bottom-8 text-indigo-400/80 transform rotate-12 animate-pulse">
            <Send className="w-16 h-16" />
          </div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-2xl mx-auto"
          >
            Ready to discover your skill gap?
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl mx-auto font-medium leading-relaxed"
          >
            Join thousands of learners who are already building their dream careers.
          </motion.p>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex justify-center relative z-10"
          >
            <Link
              href="/signup"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Your Skill Analysis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
