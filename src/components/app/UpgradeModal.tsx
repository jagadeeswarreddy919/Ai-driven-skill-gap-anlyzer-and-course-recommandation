"use client";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  feature: string;
  requiredPlan: "STANDARD" | "PRO";
  features: string[];
}

export function UpgradeModal({ open, onClose, feature, requiredPlan, features }: UpgradeModalProps) {
  const router = useRouter();
  const price = requiredPlan === "STANDARD" ? "₹499" : "₹1,499";
  const color = requiredPlan === "STANDARD" ? "indigo" : "purple";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-md w-full z-10"
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100 text-slate-400">
              <X className="w-4 h-4" />
            </button>

            <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center mb-4`}>
              <Sparkles className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 mb-1">Unlock {feature}</h2>
            <p className="text-sm text-slate-500 font-medium mb-6">
              You're on the Free plan. Upgrade to {requiredPlan} to access this feature.
            </p>

            <div className="space-y-2 mb-6">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span className={`w-4 h-4 rounded-full bg-${color}-100 text-${color}-700 flex items-center justify-center text-[10px] font-black`}>✓</span>
                  {f}
                </div>
              ))}
            </div>

            <div className="text-2xl font-black text-slate-900 mb-4">
              {price}<span className="text-sm font-semibold text-slate-500"> / month</span>
            </div>

            <button
              onClick={() => { onClose(); router.push("/settings/billing"); }}
              className={`w-full py-3.5 rounded-xl bg-${color}-600 hover:bg-${color}-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg`}
            >
              Upgrade to {requiredPlan === "STANDARD" ? "Standard" : "Pro"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
