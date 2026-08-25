"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import {
  LayoutDashboard, Sparkles, Target, BookMarked, ClipboardList,
  BookOpen, Map, TrendingUp, FileText, MessageSquare, User,
  Settings, LogOut, Shield
} from "lucide-react";

interface AppSidebarProps {
  user: { name: string; email: string; isAdmin: boolean };
  plan: string;
}

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

const planColors: Record<string, string> = {
  FREE: "bg-slate-100 text-slate-600",
  STANDARD: "bg-indigo-50 text-indigo-700",
  PRO: "bg-purple-50 text-purple-700",
};

export default function AppSidebar({ user, plan }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200/80 min-h-screen sticky top-0">
      <div className="p-5 border-b border-slate-100">
        <Link href="/"><Logo /></Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isLocked
                    ? "text-slate-400 hover:bg-slate-50"
                    : active
                    ? "bg-purple-50 text-purple-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
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

        {user.isAdmin && (
          <div className="pt-3">
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                pathname.startsWith("/admin") ? "bg-rose-50 text-rose-700" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              Admin
            </Link>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">
            {user.name[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
            <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block mt-0.5 ${planColors[plan] ?? planColors.FREE}`}>
              {plan}
            </div>
          </div>
        </div>

        <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
          <User className="w-3.5 h-3.5" /> Profile
        </Link>
        <Link href="/settings" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
          <Settings className="w-3.5 h-3.5" /> Settings
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
          <LogOut className="w-3.5 h-3.5" /> Log Out
        </button>
      </div>
    </aside>
  );
}
