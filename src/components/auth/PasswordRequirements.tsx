"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";

interface PasswordRequirementsProps {
  password: string;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {
  const reqs = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One number", valid: /[0-9]/.test(password) },
    { label: "One special character", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs space-y-2 mt-2"
    >
      <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
        Password Requirements:
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-medium">
        {reqs.map((r) => (
          <div
            key={r.label}
            className={`flex items-center gap-1.5 transition-colors ${
              r.valid ? "text-emerald-600 font-semibold" : "text-slate-500"
            }`}
          >
            {r.valid ? (
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
            ) : (
              <Circle className="w-3 h-3 text-slate-300 shrink-0" />
            )}
            <span>{r.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
