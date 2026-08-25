"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AuthHeader, AuthFooter } from "@/components/auth/AuthHeaderFooter";
import { ProductPanel } from "@/components/auth/ProductPanel";
import { ArrowLeft, Mail, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      await res.json();
      setLoading(false);
      setSubmitted(true);
    } catch (err) {
      setLoading(false);
      setErrorMsg("We couldn't connect to the server. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9FF] text-slate-900 flex flex-col justify-between font-sans">
      <AuthHeader type="forgot" />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-center">
        <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
          
          {/* Left Product Panel */}
          <div className="hidden lg:block lg:col-span-5">
            <ProductPanel mode="forgot" />
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-5 max-w-md mx-auto"
              >
                <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">Check your inbox</h3>
                  <p className="text-sm text-slate-600 font-medium mt-2 leading-relaxed">
                    If an account exists for <span className="font-bold text-slate-900">{email}</span>, you'll receive instructions to reset your password shortly.
                  </p>
                </div>

                <div className="pt-4">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 max-w-md mx-auto w-full"
              >
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Forgot your password?
                  </h1>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    Enter your email and we'll help you reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending reset link...</span>
                      </>
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </button>
                </form>

                <div className="pt-2 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Login
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <AuthFooter />
    </div>
  );
}
