"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Newspaper,
  MessageCircle,
  Radio,
  Settings,
  ChevronRight,
  LogOut,
  Bell,
  Globe,
  Star,
  Award,
  Flame,
  BarChart2,
} from "lucide-react";

const STATS = [
  { icon: Flame, label: "Day Streak", value: "12", color: "#f97316" },
  { icon: BookOpen, label: "Books Read", value: "4", color: "#1a2b5e" },
  { icon: Star, label: "Sessions", value: "9", color: "#c9a84c" },
  { icon: BarChart2, label: "Level", value: "B1", color: "#8b5cf6" },
];

const MENU_SECTIONS = [
  {
    title: "Learning",
    items: [
      { icon: BookOpen, label: "Reading Books", href: "/library/books", color: "#1a2b5e" },
      { icon: Newspaper, label: "Articles", href: "/library", color: "#1a2b5e" },
      { icon: MessageCircle, label: "Atlas AI Chat", href: "/chat", color: "#c9a84c" },
      { icon: Radio, label: "Live Sessions", href: "/live", color: "#ef4444" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Globe, label: "Language & Level", href: null, color: "#1a2b5e" },
      { icon: Bell, label: "Notifications", href: null, color: "#1a2b5e" },
      { icon: Settings, label: "Settings", href: null, color: "#1a2b5e" },
    ],
  },
];

const BADGES = [
  { emoji: "🔥", label: "12-Day Streak" },
  { emoji: "📚", label: "Bookworm" },
  { emoji: "⭐", label: "First Session" },
  { emoji: "🎙️", label: "Pronunciation Pro" },
];

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div
      className="max-w-lg mx-auto px-4 py-6 space-y-5"
      style={{ background: "#f0f4ff", colorScheme: "light", minHeight: "100%" }}
    >
      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a2b5e 0%, #2d4080 100%)",
          boxShadow: "0 6px 24px rgba(26,43,94,0.25)",
        }}
      >
        <div className="px-5 pt-6 pb-5">
          {/* Avatar + name row */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0"
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              S
            </div>
            <div className="flex-1">
              <div
                className="text-xl font-bold text-white mb-0.5"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Samir
              </div>
              <div className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                samir@kalyma.ma
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(201,168,76,0.3)", color: "#d4b86a" }}
                >
                  B1 — Intermediate
                </span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}
                >
                  🇬🇧 English
                </span>
              </div>
            </div>
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
              style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
            >
              <Settings size={16} />
            </button>
          </div>

          {/* Stats row */}
          <div
            className="grid grid-cols-4 gap-2 pt-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
          >
            {STATS.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.12)" }}
                >
                  <Icon size={16} style={{ color: "white" }} />
                </div>
                <div className="text-sm font-bold text-white">{value}</div>
                <div className="text-[9px] text-center leading-tight" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Weekly Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="rounded-2xl p-4"
        style={{
          background: "white",
          border: "1px solid rgba(26,43,94,0.08)",
          boxShadow: "0 2px 10px rgba(26,43,94,0.06)",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold" style={{ color: "#1a2b5e" }}>
            Weekly Progress
          </span>
          <span className="text-xs font-semibold" style={{ color: "#c9a84c" }}>
            78%
          </span>
        </div>
        <div className="w-full rounded-full overflow-hidden" style={{ height: 7, background: "rgba(26,43,94,0.08)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "78%" }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #1a2b5e, #2d4080)" }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{
                  background: i < 5 ? "#1a2b5e" : "rgba(26,43,94,0.08)",
                  color: i < 5 ? "white" : "#9aa5b1",
                }}
              >
                {d}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        className="rounded-2xl p-4"
        style={{
          background: "white",
          border: "1px solid rgba(26,43,94,0.08)",
          boxShadow: "0 2px 10px rgba(26,43,94,0.06)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold" style={{ color: "#1a2b5e" }}>
            Badges
          </span>
          <Award size={16} style={{ color: "#c9a84c" }} />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {BADGES.map(({ emoji, label }, i) => (
            <div key={i} className="flex flex-col items-center gap-1 text-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: "rgba(26,43,94,0.05)", border: "1px solid rgba(26,43,94,0.08)" }}
              >
                {emoji}
              </div>
              <span className="text-[9px] leading-tight" style={{ color: "#9aa5b1" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Menu Sections */}
      {MENU_SECTIONS.map((section, si) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + si * 0.07 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: "white",
            border: "1px solid rgba(26,43,94,0.08)",
            boxShadow: "0 2px 10px rgba(26,43,94,0.06)",
          }}
        >
          <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(26,43,94,0.06)" }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#9aa5b1" }}>
              {section.title}
            </span>
          </div>
          <div>
            {section.items.map(({ icon: Icon, label, href, color }, i) => (
              <button
                key={label}
                onClick={() => href && router.push(href)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all hover:bg-gray-50"
                style={{
                  borderBottom:
                    i < section.items.length - 1
                      ? "1px solid rgba(26,43,94,0.05)"
                      : "none",
                }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${color}12` }}
                >
                  <Icon size={15} style={{ color }} />
                </div>
                <span className="flex-1 text-sm font-medium" style={{ color: "#1a2b5e" }}>
                  {label}
                </span>
                <ChevronRight size={15} style={{ color: "#9aa5b1" }} />
              </button>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Sign Out */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        onClick={() => router.push("/auth")}
        className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
        style={{
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.2)",
          color: "#ef4444",
        }}
      >
        <LogOut size={15} />
        Sign Out
      </motion.button>

      {/* Version */}
      <p className="text-center text-xs pb-2" style={{ color: "#9aa5b1" }}>
        kalyma.ma · v1.0.0
      </p>
    </div>
  );
}
