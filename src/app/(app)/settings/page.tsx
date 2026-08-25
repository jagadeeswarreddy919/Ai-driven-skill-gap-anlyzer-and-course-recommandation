"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User, CreditCard, Bell, Lock, Shield, Trash2,
  Check, ChevronRight, Zap, ExternalLink, AlertTriangle, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "billing" | "notifications" | "security">("general");
  const [user, setUser] = useState<{ name: string; email: string; plan: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Notification states
  const [notifications, setNotifications] = useState({
    skillGapAlerts: true,
    weeklyProgress: true,
    courseRecommendations: true,
    productUpdates: false,
  });

  const [savedNotifs, setSavedNotifs] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser({
            name: data.user.name || "User",
            email: data.user.email || "",
            plan: data.user.plan || "FREE",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      setSavedNotifs(true);
      setTimeout(() => setSavedNotifs(false), 2000);
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-12">
      {/* Settings Top Title Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings & Preferences</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Manage your account preferences, subscription billing, and security options.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        {[
          { id: "general", label: "General & Account", icon: User },
          { id: "billing", label: "Billing & Subscription", icon: CreditCard },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "security", label: "Security & Privacy", icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: General & Account */}
      {activeTab === "general" && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Account Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Name</div>
                <div className="text-lg font-black text-slate-900 mt-1">{user?.name}</div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</div>
                <div className="text-lg font-black text-slate-900 mt-1">{user?.email}</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all cursor-pointer"
              >
                <span>Edit Profile Details</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 2: Billing & Subscription */}
      {activeTab === "billing" && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Current Subscription</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Your active access plan and quotas.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200 text-xs font-extrabold uppercase">
                {user?.plan} PLAN
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600" /> Upgrade for Unlimited Access
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Unlock AI Resume Analyzer, AI Career Coach, and unlimited skill gap assessments.
                </p>
              </div>
              <Link
                href="/settings/billing"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs hover:bg-indigo-700 transition-all shrink-0 cursor-pointer shadow-xs"
              >
                Manage Billing & Upgrade
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === "notifications" && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Notification Preferences</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Choose what updates you want to receive.</p>
              </div>
              {savedNotifs && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Preferences Saved
                </span>
              )}
            </div>

            <div className="space-y-4">
              {[
                { key: "skillGapAlerts", title: "Skill Gap Benchmark Reports", desc: "Receive email summaries after completing target role analyses." },
                { key: "weeklyProgress", title: "Weekly Learning Reminders", desc: "Get weekly reminders to keep your career learning goals on track." },
                { key: "courseRecommendations", title: "Recommended Course Alerts", desc: "Notified when new free or top-rated courses are matched to your missing skills." },
                { key: "productUpdates", title: "Product Features & AI Updates", desc: "Occasional updates about new AI models and tools." },
              ].map((item) => {
                const checked = notifications[item.key as keyof typeof notifications];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleNotif(item.key as keyof typeof notifications)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-all cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">{item.desc}</div>
                    </div>

                    <div
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                        checked ? "bg-indigo-600 justify-end" : "bg-slate-300 justify-start"
                      }`}
                    >
                      <motion.div layout className="w-4 h-4 rounded-full bg-white shadow-xs" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 4: Security & Privacy */}
      {activeTab === "security" && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Password & Session Security
            </h2>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <div className="text-xs font-bold text-slate-900">Account Password</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Last updated recently</div>
              </div>
              <Link
                href="/profile"
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs transition-all"
              >
                Change Password
              </Link>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-rose-50/70 rounded-3xl border border-rose-200/80 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-rose-900">Danger Zone</h3>
                <p className="text-xs text-rose-700 font-medium">Irreversible account actions.</p>
              </div>
            </div>

            <p className="text-xs text-rose-700/80 leading-relaxed font-medium">
              Deleting your account will delete your skill assessments, career roadmaps, and profile data permanently.
            </p>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer"
            >
              Delete My Account
            </button>
          </div>
        </motion.div>
      )}

      {/* Delete Account Modal Confirmation */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full z-10 shadow-2xl border border-slate-100 space-y-5"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-xl font-black text-slate-900">Are you sure?</h3>
                <p className="text-xs text-slate-500 font-medium">
                  This action cannot be undone. All your saved skill assessments and progress will be lost.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    fetch("/api/auth/logout", { method: "POST" }).then(() => (window.location.href = "/"));
                  }}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-all cursor-pointer shadow-xs"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}