"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  User,
  Globe,
  CreditCard,
  Shield,
  Trash2,
  ChevronRight,
  Check,
} from "lucide-react";

const PLAN_FEATURES = [
  "Unlimited AI conversations",
  "Access to all articles & books",
  "Live session replays",
  "Advanced vocabulary tracking",
  "Priority support",
];

const ACCOUNT_FIELDS = [
  { label: "Full Name", value: "Samir El Amine" },
  { label: "Email", value: "samir@kalyma.ma" },
  { label: "Learning Language", value: "English 🇬🇧" },
  { label: "Current Level", value: "B1 — Intermediate" },
];

export default function SettingsPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      className="max-w-lg mx-auto px-4 py-6 space-y-5"
      style={{ background: "#f0f4ff", colorScheme: "light", minHeight: "100%" }}
    >
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1
          className="text-2xl font-bold mb-0.5"
          style={{ fontFamily: "'Outfit', sans-serif", color: "#1a2b5e" }}
        >
          Settings
        </h1>
        <p className="text-sm" style={{ color: "#4a5568" }}>
          Manage your account and subscription.
        </p>
      </motion.div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: "white",
          border: "1px solid rgba(26,43,94,0.08)",
          boxShadow: "0 2px 10px rgba(26,43,94,0.06)",
        }}
      >
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderBottom: "1px solid rgba(26,43,94,0.06)" }}
        >
          <User size={14} style={{ color: "#9aa5b1" }} />
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#9aa5b1" }}>
            Account
          </span>
        </div>
        <div className="divide-y" style={{ borderColor: "rgba(26,43,94,0.05)" }}>
          {ACCOUNT_FIELDS.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-4 py-3.5">
              <span className="text-xs font-semibold" style={{ color: "#9aa5b1" }}>
                {label}
              </span>
              <span className="text-sm font-medium" style={{ color: "#1a2b5e" }}>
                {value}
              </span>
            </div>
          ))}
        </div>
        <div className="px-4 pb-4 pt-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all"
            style={{
              background: saved
                ? "linear-gradient(135deg, #22c55e, #16a34a)"
                : "linear-gradient(135deg, #1a2b5e, #0f1d4e)",
              boxShadow: "0 4px 14px rgba(26,43,94,0.2)",
            }}
          >
            {saved ? (
              <>
                <Check size={16} /> Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Subscription */}
      <motion.div
        id="subscription"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a2b5e 0%, #2d4080 100%)",
          boxShadow: "0 6px 24px rgba(26,43,94,0.3)",
        }}
      >
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CreditCard size={16} style={{ color: "#c9a84c" }} />
              <span className="text-sm font-bold text-white">Your Plan</span>
            </div>
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(201,168,76,0.3)", color: "#d4b86a" }}
            >
              FREE
            </span>
          </div>

          <div className="space-y-2 mb-4">
            {PLAN_FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(201,168,76,0.3)" }}
                >
                  <Check size={10} style={{ color: "#c9a84c" }} />
                </div>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>
                  {f}
                </span>
              </div>
            ))}
          </div>

          <button
            className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #c9a84c, #b8932e)",
              color: "white",
              boxShadow: "0 4px 14px rgba(201,168,76,0.4)",
            }}
          >
            Upgrade to Premium ✦
          </button>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: "white",
          border: "1px solid rgba(26,43,94,0.08)",
          boxShadow: "0 2px 10px rgba(26,43,94,0.06)",
        }}
      >
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderBottom: "1px solid rgba(26,43,94,0.06)" }}
        >
          <Shield size={14} style={{ color: "#9aa5b1" }} />
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#9aa5b1" }}>
            Security
          </span>
        </div>
        {[
          { label: "Change Password", icon: Shield },
          { label: "Privacy Policy", icon: Globe },
          { label: "Terms of Service", icon: Globe },
        ].map(({ label, icon: Icon }, i, arr) => (
          <div
            key={label}
            className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors"
            style={{
              borderBottom: i < arr.length - 1 ? "1px solid rgba(26,43,94,0.05)" : "none",
            }}
          >
            <div className="flex items-center gap-3">
              <Icon size={15} style={{ color: "#9aa5b1" }} />
              <span className="text-sm font-medium" style={{ color: "#1a2b5e" }}>
                {label}
              </span>
            </div>
            <ChevronRight size={15} style={{ color: "#9aa5b1" }} />
          </div>
        ))}
      </motion.div>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: "white",
          border: "1px solid rgba(239,68,68,0.15)",
          boxShadow: "0 2px 10px rgba(239,68,68,0.06)",
        }}
      >
        <button className="w-full flex items-center gap-3 px-4 py-4">
          <Trash2 size={16} style={{ color: "#ef4444" }} />
          <span className="text-sm font-medium" style={{ color: "#ef4444" }}>
            Delete Account
          </span>
        </button>
      </motion.div>

      <p className="text-center text-xs pb-4" style={{ color: "#9aa5b1" }}>
        kalyma.ma · v1.0.0
      </p>
    </div>
  );
}
