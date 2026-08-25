"use client";
import { useState } from "react";
import { CreditCard, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const PLANS = [
  { id: "FREE", label: "Free", price: "₹0", period: "forever", color: "slate", features: ["3 analyses/month", "Basic readiness score", "Top 5 skill gaps"] },
  { id: "STANDARD", label: "Standard", price: "₹499", period: "per month", color: "indigo", features: ["Unlimited analyses", "Full gap breakdown", "Learning roadmaps", "Priority matrix"] },
  { id: "PRO", label: "Pro", price: "₹1,499", period: "per month", color: "purple", features: ["Everything in Standard", "Resume analysis", "AI Career Coach", "Advanced analytics"] },
];

interface Payment { id: string; amount: number; status: string; createdAt: string; }

export default function BillingClient({ plan, status, payments }: { plan: string; status: string; payments: Payment[] }) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const upgrade = async (targetPlan: string) => {
    setLoading(targetPlan);
    const res = await fetch("/api/billing/create-checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan: targetPlan }) });
    const data = await res.json();
    setLoading(null);
    if (data.demo) { alert("Demo mode: Plan upgraded to " + targetPlan + ". Page will reload."); router.refresh(); }
  };

  const cancel = async () => {
    if (!confirm("Cancel your subscription? You will be downgraded to Free.")) return;
    await fetch("/api/billing/cancel", { method: "POST" });
    router.refresh();
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div><h2 className="text-2xl font-extrabold text-slate-900">Billing & Plan</h2><p className="text-sm text-slate-500 font-medium mt-1">Manage your subscription and payment history.</p></div>
      <div className="bg-white rounded-3xl border border-slate-200 p-6">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Plan</div>
        <div className="flex items-center justify-between">
          <div><div className="text-2xl font-extrabold text-slate-900">{plan}</div><div className={["text-xs font-bold mt-1", status === "ACTIVE" ? "text-emerald-600" : "text-amber-600"].join(" ")}>{status}</div></div>
          {plan !== "FREE" && <button onClick={cancel} className="text-xs font-bold text-rose-600 hover:underline">Cancel Subscription</button>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PLANS.map(p => {
          const current = p.id === plan;
          return (
            <div key={p.id} className={["p-5 rounded-2xl border", current ? "border-indigo-300 bg-indigo-50/30 ring-2 ring-indigo-500/20" : "border-slate-200 bg-white"].join(" ")}>
              <div className="text-sm font-extrabold text-slate-900">{p.label}</div>
              <div className="text-2xl font-black text-indigo-600 mt-1">{p.price}<span className="text-xs text-slate-400 font-semibold"> /{p.period}</span></div>
              <ul className="mt-3 space-y-1.5">
                {p.features.map(f => <li key={f} className="flex items-center gap-1.5 text-xs font-semibold text-slate-700"><CheckCircle2 className="w-3 h-3 text-indigo-500" /> {f}</li>)}
              </ul>
              {!current && p.id !== "FREE" ? (
                <button onClick={() => upgrade(p.id)} disabled={loading === p.id} className="mt-4 w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all flex items-center justify-center gap-1 disabled:opacity-50">
                  {loading === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>Upgrade <ArrowRight className="w-3.5 h-3.5" /></>}
                </button>
              ) : current ? <div className="mt-4 text-center text-xs font-black text-indigo-600">Current Plan</div> : null}
            </div>
          );
        })}
      </div>
      {payments.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2"><CreditCard className="w-4 h-4 text-slate-400" /> Payment History</h3>
          <div className="space-y-2">
            {payments.map(p => (
              <div key={p.id} className="flex items-center justify-between text-xs font-semibold text-slate-700 py-2 border-b border-slate-100 last:border-0">
                <span>₹{(p.amount / 100).toFixed(0)}</span>
                <span className={p.status === "COMPLETED" ? "text-emerald-600" : "text-amber-600"}>{p.status}</span>
                <span className="text-slate-400">{new Date(p.createdAt).toLocaleDateString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}