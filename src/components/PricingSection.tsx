"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PRICING_PLANS } from "@/data/landingData";
import { Check, Sparkles, Zap } from "lucide-react";

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-20 bg-slate-50/60 border-y border-slate-200/60 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-700 mb-4"
          >
            <Zap className="w-3.5 h-3.5 text-purple-600" />
            Simple & Transparent Pricing
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            Invest in your <span className="text-indigo-600">career growth</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium"
          >
            Choose the plan that fits your stage. Upgrade or cancel anytime. All prices in Indian Rupee (INR).
          </motion.p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {PRICING_PLANS.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -6 }}
              className={`p-8 rounded-3xl bg-white border transition-all flex flex-col justify-between relative ${
                plan.isPopular
                  ? "border-indigo-500 shadow-xl shadow-indigo-500/15 ring-2 ring-indigo-500/20"
                  : "border-slate-200/90 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-extrabold px-4 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> MOST POPULAR
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                </div>

                <p className="text-xs text-slate-500 font-medium mb-6 min-h-[36px]">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-slate-100">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-sans">
                    {plan.priceINR}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    / {plan.period}
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-3.5 mb-8">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    What's included:
                  </div>
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-xs font-medium text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={plan.ctaHref}
                className={`w-full text-center py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                  plan.isPopular
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25"
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                }`}
              >
                {plan.ctaText}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
