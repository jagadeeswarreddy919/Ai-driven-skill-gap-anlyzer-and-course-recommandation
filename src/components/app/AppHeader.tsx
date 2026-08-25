"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LayoutDashboard, Sparkles, Target, BookMarked, ClipboardList, BookOpen, TrendingUp, FileText, MessageSquare, User, Settings, LogOut, Shield } from "lucide-react";
import { Logo } from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/analyzer": "Skill Analyzer",
  "/roles": "Target Roles",
  "/skills": "My Skills",
  "/assessments": "Assessments",
  "/courses": "Courses",
  "/progress": "Progress",
  "/resume": "Resume Analyzer",
  "/career-coach": "Career Coach",
  "/profile": "Profile",
  "/settings": "Settings",
  "/admin": "Admin Dashboard",
};

const planColors: Record<string, string> = {
  FREE: "bg-slate-100 text-slate-600 border-slate-200",
  STANDARD: "bg-indigo-50 text-indigo-700 border-indigo-100",
  PRO: "bg-purple-50 text-purple-700 border-purple-100",
};

interface AppHeaderProps {
  user: { name: string; email?: string; isAdmin?: boolean };
  plan: string;
}

export default function AppHeader({ user, plan }: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const title = Object.entries(pageTitles).find(([k]) => pathname === k || pathname.startsWith(k + "/"))?.[1] ?? "SkillGap AI";

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/analyzer", label: "Analyzer", icon: Sparkles },
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

  return (
    <>
      <header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Open Navigation Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-extrabold text-slate-900">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className={["text-xs font-bold px-2.5 py-1 rounded-full border", planColors[plan] ?? planColors.FREE].join(" ")}>
            {plan}
          </span>
          <Link href="/settings/billing" className="text-xs font-semibold text-indigo-600 hover:underline hidden sm:inline">
            {plan === "FREE" ? "Upgrade" : "Manage Plan"}
          </Link>
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black border border-indigo-200">
            {user.name[0].toUpperCase()}
          </div>
        </div>
      </header>

      {/* Responsive Mobile Drawer Side Nav Bar */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-72 bg-white min-h-screen flex flex-col z-10 shadow-2xl border-r border-slate-200"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <Link href="/" onClick={() => setDrawerOpen(false)}><Logo /></Link>
                <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href || pathname.startsWith(href + "/");
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setDrawerOpen(false)}
                      className={["flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                        active ? "bg-indigo-50 text-indigo-700 font-extrabold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      ].join(" ")}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {label}
                    </Link>
                  );
                })}

                <div className="pt-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Pro Features</div>
                  {proLinks.map(({ href, label, icon: Icon }) => {
                    const isLocked = plan !== "PRO";
                    const active = pathname === href;
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setDrawerOpen(false)}
                        className={["flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                          isLocked ? "text-slate-400 hover:bg-slate-50" : active ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-50"
                        ].join(" ")}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {label}
                        {isLocked && (
                          <span className="ml-auto text-[9px] font-bold bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-md">PRO</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </nav>

              <div className="p-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">
                    {user.name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
                    <div className="text-[10px] font-bold text-indigo-600">{plan} Plan</div>
                  </div>
                </div>
                <Link href="/profile" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  <User className="w-3.5 h-3.5" /> Profile
                </Link>
                <Link href="/settings" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  <Settings className="w-3.5 h-3.5" /> Settings
                </Link>
                <button onClick={() => { setDrawerOpen(false); logout(); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer">
                  <LogOut className="w-3.5 h-3.5" /> Log Out
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}