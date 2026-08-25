"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Star } from "lucide-react";
import { ProductPreview } from "./ProductPreview";

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Top AI Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/80 text-xs text-purple-700 font-semibold mb-6 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>AI-Powered Career Intelligence</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]"
        >
          Know Exactly <br className="hidden sm:inline" />
          What You’re{" "}
          <span className="text-indigo-600 inline-block">
            Missing.
          </span>
        </motion.h1>

        {/* Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed"
        >
          Compare your current skills with the requirements of your target role and discover exactly what you need to learn next.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Analyze My Skills
            <ArrowRight className="w-5 h-5" />
          </Link>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all duration-200"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Play className="w-3.5 h-3.5 fill-indigo-600" />
            </div>
            See How It Works
          </a>
        </motion.div>

        {/* User Avatars & Trust Rating */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex items-center justify-center gap-4 flex-wrap"
        >
          {/* Avatar Stack */}
          <div className="flex -space-x-2 overflow-hidden">
            <img
              className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Learner"
            />
            <img
              className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              alt="Learner"
            />
            <img
              className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
              alt="Learner"
            />
            <img
              className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
              alt="Learner"
            />
          </div>

          {/* Stars & Text */}
          <div className="text-left text-xs">
            <div className="flex items-center gap-0.5 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <p className="text-slate-600 font-medium mt-0.5">
              Trusted by <span className="font-bold text-slate-900">10,000+</span> learners to accelerate their careers
            </p>
          </div>
        </motion.div>

        {/* Hero Interactive Product Visualization */}
        <ProductPreview />
      </div>
    </section>
  );
};
