"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AuthHeader, AuthFooter } from "@/components/auth/AuthHeaderFooter";
import { ProductPanel } from "@/components/auth/ProductPanel";
import { Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setFieldErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        if (data.errors) {
          setFieldErrors(data.errors);
        } else {
          setErrorMsg(data.message || "Incorrect email or password. Please try again.");
        }
        return;
      }

      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      setLoading(false);
      setErrorMsg("We couldn't connect to the server. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9FF] text-slate-900 flex flex-col justify-between font-sans">
      <AuthHeader type="login" />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-center">
        <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* Left Product Panel */}
          <div className="hidden lg:block lg:col-span-5">
            <ProductPanel mode="login" />
          </div>

          {/* Right Login Form */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Welcome back</h3>
                  <p className="text-sm text-slate-500 font-medium">
                    Preparing your career dashboard...
                  </p>
                  <Loader2 className="w-6 h-6 text-indigo-600 animate-spin mx-auto mt-4" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 max-w-md mx-auto w-full"
                >
                  <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      Welcome back
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      Continue your journey toward your next career goal.
                    </p>
                  </div>

                  {/* Social Google Login Button */}
                  <div>
                    <button
                      type="button"
                      onClick={() => alert("Google OAuth provider can be configured in Auth.js environment.")}
                      className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center justify-center gap-3 transition-all shadow-xs"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      Continue with Google
                    </button>

                    <div className="relative my-6 text-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200" />
                      </div>
                      <span className="relative bg-white px-3 text-xs text-slate-400 font-medium uppercase tracking-wider">
                        or continue with email
                      </span>
                    </div>
                  </div>

                  {/* Main Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Error Banner */}
                    {errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </motion.div>
                    )}

                    {/* Email Field */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
                          fieldErrors.email
                            ? "border-rose-300 bg-rose-50/30 text-rose-900"
                            : "border-slate-200 bg-white text-slate-900 focus:border-indigo-600"
                        }`}
                      />
                      {fieldErrors.email && (
                        <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.email}</p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Password
                        </label>
                        <Link
                          href="/forgot-password"
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 pr-10 ${
                            fieldErrors.password
                              ? "border-rose-300 bg-rose-50/30 text-rose-900"
                              : "border-slate-200 bg-white text-slate-900 focus:border-indigo-600"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {fieldErrors.password && (
                        <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.password}</p>
                      )}
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="rememberMe" className="ml-2 text-xs font-semibold text-slate-600 cursor-pointer">
                        Remember me on this device
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Log In</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Bottom Redirect */}
                  <div className="pt-2 text-center text-xs font-medium text-slate-600">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-indigo-600 font-bold hover:underline">
                      Create an account
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AuthFooter />
    </div>
  );
}
