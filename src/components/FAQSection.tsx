"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQ_DATA } from "@/data/landingData";
import { ChevronDown, HelpCircle } from "lucide-react";

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700 mb-4"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            Frequently Asked Questions
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            Got Questions? We have answers.
          </motion.h2>
        </div>

        {/* Light Accordion */}
        <div className="space-y-4">
          {FAQ_DATA.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  id={`faq-btn-${idx}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${idx}`}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 text-base sm:text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <div
                    className={`p-1.5 rounded-lg border shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${idx}`}
                      role="region"
                      aria-labelledby={`faq-btn-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 font-medium">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
