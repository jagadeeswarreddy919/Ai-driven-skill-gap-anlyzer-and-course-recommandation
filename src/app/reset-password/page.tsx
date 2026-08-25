"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AuthHeader, AuthFooter } from "@/components/auth/AuthHeaderFooter";
import { ProductPanel } from "@/components/auth/ProductPanel";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { Eye, EyeOff, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setFieldErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        if (data.errors) {
          setFieldErrors(data.errors);
        } else {
          setErrorMsg(data.message || "Failed to reset password.");
        }
        return;
      }

      setLoading(false);
      setSuccess(true);
    } catch (err) {
      setLoading(false);
      setErrorMsg("We couldn't connect to the server. Please try again.");
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 space-y-5 max-w-sm mx-auto"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900">Password updated successfully</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Your password has been changed. You can now log in with your new credentials.
          </p>
        </div>
        <Link
          href="/login"
          className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center cursor-pointer"
        >
          Log In
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-md mx-auto w-full"
    >
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Create a new password
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Enter your new password below to secure your SkillGap AI account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Password Field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Create a new password"
              value={password}
              onFocus={() => setPasswordFocused(true)}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <PasswordStrengthMeter password={password} />
          {passwordFocused && <PasswordRequirements password={password} />}

          {fieldErrors.password && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Confirm New Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
          />
          {fieldErrors.confirmPassword && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Resetting password...</span>
            </>
          ) : (
            <span>Reset Password</span>
          )}
        </button>
      </form>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#FAF9FF] text-slate-900 flex flex-col justify-between font-sans">
      <AuthHeader type="reset" />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-center">
        <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
          {/* Left Product Panel */}
          <div className="hidden lg:block lg:col-span-5">
            <ProductPanel mode="reset" />
          </div>

          {/* Right Form with Suspense Boundary */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            <Suspense fallback={<div className="text-center py-8 text-sm text-slate-400">Loading form...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>

      <AuthFooter />
    </div>
  );
}
