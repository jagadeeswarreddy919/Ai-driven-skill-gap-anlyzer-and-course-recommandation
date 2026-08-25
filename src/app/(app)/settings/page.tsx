import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserSubscription } from "@/lib/subscription/access";
import { CreditCard, Bell, Lock, Trash2, User, Shield } from "lucide-react";

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const sub = await getUserSubscription(user.id);
  const plan = (sub.status === "ACTIVE" || sub.status === "TRIALING") ? sub.plan : "FREE";
  const sections = [
    { icon: User, label: "Account", desc: "Name, email, experience level", href: "/profile" },
    { icon: CreditCard, label: "Billing & Plan", desc: `Current plan: ${plan}. Upgrade or manage subscription.`, href: "/settings/billing" },
    { icon: Bell, label: "Notifications", desc: "Email and in-app notification preferences", href: "#" },
    { icon: Lock, label: "Security", desc: "Password and session management", href: "#" },
    { icon: Shield, label: "Privacy", desc: "Data and privacy settings", href: "#" },
  ];
  return (
    <div className="max-w-2xl space-y-6">
      <div><h2 className="text-2xl font-extrabold text-slate-900">Settings</h2><p className="text-sm text-slate-500 font-medium mt-1">Manage your account and preferences.</p></div>
      <div className="space-y-3">
        {sections.map(s => (
          <Link key={s.label} href={s.href} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center"><s.icon className="w-5 h-5 text-slate-500" /></div>
            <div><div className="text-sm font-extrabold text-slate-900">{s.label}</div><div className="text-xs text-slate-500 font-medium mt-0.5">{s.desc}</div></div>
          </Link>
        ))}
      </div>
      <div className="bg-rose-50 rounded-2xl border border-rose-100 p-5">
        <h3 className="text-sm font-extrabold text-rose-800 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Danger Zone</h3>
        <p className="text-xs text-rose-600 font-medium mt-1">Deleting your account is irreversible.</p>
        <button className="mt-3 px-4 py-2 rounded-xl border border-rose-300 text-rose-700 font-bold text-xs hover:bg-rose-100 transition-all">Delete Account</button>
      </div>
    </div>
  );
}