"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, ExternalLink, ShieldCheck, Key, Server, Sparkles } from "lucide-react";

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleOAuthModal: React.FC<GoogleOAuthModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"vercel" | "local">("vercel");

  if (!isOpen) return null;

  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "https://your-domain.vercel.app";
  const callbackUrl = `${currentOrigin}/api/auth/google/callback`;

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-8"
        >
          {/* Top Banner Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <Key className="w-6 h-6 text-indigo-200" />
              </div>
              <span className="px-3 py-1 bg-indigo-500/30 border border-indigo-300/30 rounded-full text-xs font-semibold tracking-wide text-indigo-100 uppercase">
                Setup Required
              </span>
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight">
              Configure Google OAuth Sign-In
            </h2>
            <p className="text-sm text-indigo-100 font-medium mt-1">
              Follow these simple steps to enable Google Sign-In on your environment.
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Step 1: Create OAuth Credentials */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm uppercase tracking-wider">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-extrabold flex items-center justify-center">
                  1
                </span>
                <span>Google Cloud Console Setup</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium pl-8">
                Create a OAuth 2.0 Client ID in your{" "}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-1"
                >
                  Google Cloud Console <ExternalLink className="w-3 h-3" />
                </a>
              </p>

              {/* Redirect URI snippet */}
              <div className="pl-8">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Authorized Redirect URI to paste in Google Cloud:
                </label>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
                  <span className="truncate flex-1">{callbackUrl}</span>
                  <button
                    onClick={() => copyToClipboard(callbackUrl, "callback")}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-all shrink-0 cursor-pointer flex items-center gap-1 text-[11px] font-sans font-medium"
                  >
                    {copiedKey === "callback" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Environment Variables Tab Selector */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm uppercase tracking-wider">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-extrabold flex items-center justify-center">
                    2
                  </span>
                  <span>Add Environment Variables</span>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setActiveTab("vercel")}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      activeTab === "vercel"
                        ? "bg-white text-indigo-600 shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Vercel Deployment
                  </button>
                  <button
                    onClick={() => setActiveTab("local")}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      activeTab === "local"
                        ? "bg-white text-indigo-600 shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Local (.env)
                  </button>
                </div>
              </div>

              {activeTab === "vercel" ? (
                <div className="pl-8 space-y-3">
                  <p className="text-xs text-slate-600 font-medium">
                    Go to your <strong>Vercel Dashboard</strong> &rarr; <strong>Project Settings</strong> &rarr;{" "}
                    <strong>Environment Variables</strong> and add:
                  </p>
                  
                  <div className="space-y-2 bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs relative overflow-hidden shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-400">GOOGLE_CLIENT_ID</span>
                      <button
                        onClick={() => copyToClipboard("GOOGLE_CLIENT_ID", "key1")}
                        className="text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                      >
                        {copiedKey === "key1" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        Copy Key
                      </button>
                    </div>
                    <p className="text-slate-400 text-[11px] font-sans">
                      Value: Your OAuth Client ID from Google Cloud
                    </p>

                    <div className="border-t border-slate-800 my-2 pt-2 flex items-center justify-between">
                      <span className="text-indigo-400">GOOGLE_CLIENT_SECRET</span>
                      <button
                        onClick={() => copyToClipboard("GOOGLE_CLIENT_SECRET", "key2")}
                        className="text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                      >
                        {copiedKey === "key2" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        Copy Key
                      </button>
                    </div>
                    <p className="text-slate-400 text-[11px] font-sans">
                      Value: Your OAuth Client Secret from Google Cloud
                    </p>
                  </div>
                </div>
              ) : (
                <div className="pl-8 space-y-3">
                  <p className="text-xs text-slate-600 font-medium">
                    Create or update your local <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">.env</code> file in the project root:
                  </p>

                  <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs relative shadow-inner">
                    <div className="flex justify-end mb-2">
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"\nGOOGLE_CLIENT_SECRET="your-client-secret"`,
                            "envblock"
                          )
                        }
                        className="text-[11px] text-indigo-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                      >
                        {copiedKey === "envblock" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied .env block</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy .env snippet</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-slate-300 text-[11px] leading-relaxed">
{`GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"`}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Note alert */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-medium flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-900">Vercel Deployment Note:</strong> After saving environment variables on Vercel, trigger a quick <strong>Redeploy</strong> in Vercel to activate Google OAuth.
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>SkillGap AI OAuth 2.0 Integration</span>
            </div>
            <button
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              Got it, Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
