"use client";

import React from "react";

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  if (!password) return null;

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const labels = ["Too Short", "Weak", "Fair", "Good", "Strong"];
  const colors = [
    "bg-slate-200 text-slate-500",
    "bg-rose-500 text-rose-700",
    "bg-amber-500 text-amber-700",
    "bg-sky-500 text-sky-700",
    "bg-emerald-500 text-emerald-700",
  ];

  const labelText = labels[score] || "Weak";
  const textColor = colors[score].split(" ")[1];

  return (
    <div className="mt-2 space-y-1.5" aria-live="polite">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className="text-slate-500">Password Strength:</span>
        <span className={`font-bold ${textColor}`}>{labelText}</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full rounded-full transition-all duration-300 ${
              score >= step
                ? step === 1
                  ? "bg-rose-500"
                  : step === 2
                  ? "bg-amber-500"
                  : step === 3
                  ? "bg-sky-500"
                  : "bg-emerald-500"
                : "bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
