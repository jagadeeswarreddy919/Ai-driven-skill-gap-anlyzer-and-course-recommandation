"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import {
  LayoutDashboard, Sparkles, Target, BookMarked, ClipboardList,
  BookOpen, TrendingUp, FileText, MessageSquare, User,
  Settings, LogOut, Shield, ChevronRight
} from "lucide-react";
import { useState } from "react";

interface AppSidebarProps {
  user: { name: string; email: string; isAdmin: boolean };
  plan: string;
}

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analyzer", label: "Skill Analyzer", icon: Sparkles },
  { href: "/roles", label: "Target Roles", icon: Target },
  { href: "/skills", label: "My Skills", icon: BookMarked },
  { href: "/assessments", label: "Assessments", icon: ClipboardList },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/progress", label: "Progress", icon: TrendingUp },
];

const proLinks = [
  { href: "/resume", label: "Resume Analyzer", icon: FileText },
  { href: "/career-coach", label: "Career Coach", icon: MessageSquare },
];

const planColors: Record<string, string> = {
  FREE: "bg-slate-100 text-slate-700 border-slate-200",
  STANDARD: "bg-indigo-50 text-indigo-700 border-indigo-200",
  PRO: "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xs",
};

export default function AppSidebar({ user, plan }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      router.push("/login");
    }
  };

  const initial = user.name ? user.name[0].toUpperCase() : "U";

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200/90 h-screen sticky top-0 z-30 select-none">
      {/* Top Header Logo */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <Link href="/" className="transition-opacity hover:opacity-90">
          <Logo />
        </Link>
        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${planColors[plan] || planColors.FREE}`}>
          {plan}
        </span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3.5 py-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3 mb-1">
          Platform Navigation
        </div>

        {navLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                active
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform ${active ? "text-white" : "text-slate-400 group-hover:text-indigo-600"}`} />
              <span className="truncate">{label}</span>
              {active && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/80" />
              )}
            </Link>
          );
        })}

        {/* Pro Features Section */}
        <div className="pt-4 mt-2 border-t border-slate-100">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              AI Tools
            </span>
            <span className="text-[9px] font-black text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded uppercase">
              Pro
            </span>
          </div>

          {proLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            const isProUser = plan === "PRO";
            return (
              <Link
                key={href}
                href={href}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-purple-600"}`} />
                <span className="truncate">{label}</span>
                {!isProUser && (
                  <span className="ml-auto text-[9px] font-black bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                    LOCKED
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Admin Link if Admin */}
        {user.isAdmin && (
          <div className="pt-4 mt-2 border-t border-slate-100">
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                pathname.startsWith("/admin")
                  ? "bg-rose-600 text-white shadow-md shadow-rose-500/20"
                  : "text-slate-600 hover:bg-rose-50 hover:text-rose-700"
              }`}
            >
              <Shield className="w-4 h-4 shrink-0 text-rose-500" />
              <span>Admin Panel</span>
            </Link>
          </div>
        )}
      </nav>

      {/* User Footer Profile & Links */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 space-y-1.5">
        {/* User Card */}
        <div className="flex items-center gap-3 p-2 rounded-2xl bg-white border border-slate-200/70 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xs font-black shadow-xs shrink-0">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-extrabold text-slate-900 truncate">
              {user.name || "Career Learner"}
            </div>
            <div className="text-[10px] text-slate-500 font-medium truncate">
              {user.email}
            </div>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div className="grid grid-cols-2 gap-1 pt-1">
          <Link
            href="/profile"
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
              pathname === "/profile"
                ? "bg-indigo-100 text-indigo-800"
                : "text-slate-700 hover:bg-white hover:shadow-2xs border border-transparent hover:border-slate-200"
            }`}
          >
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span>Profile</span>
          </Link>

          <Link
            href="/settings"
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
              pathname.startsWith("/settings")
                ? "bg-indigo-100 text-indigo-800"
                : "text-slate-700 hover:bg-white hover:shadow-2xs border border-transparent hover:border-slate-200"
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-slate-600" />
            <span>Settings</span>
          </Link>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer disabled:opacity-50"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{loggingOut ? "Logging out..." : "Log Out"}</span>
        </button>
      </div>
    </aside>
  );
}
