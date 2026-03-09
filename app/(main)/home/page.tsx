"use client";
import { motion } from "framer-motion";
import { ChevronRight, BookOpen, Newspaper, Sparkles, Radio } from "lucide-react";
import { useRouter } from "next/navigation";

const WEEKLY_PERCENT = 78;

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height: 8, background: "rgba(26,43,94,0.1)" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        className="h-full rounded-full"
        style={{ background: "linear-gradient(90deg, #1a2b5e, #2d4080)" }}
      />
    </div>
  );
}

const FEATURES = [
  {
    icon: BookOpen,
    color: "#c9a84c",
    colorBg: "rgba(201,168,76,0.12)",
    title: "Reading",
    subtitle: "Expand your vocabulary with English books",
    href: "/library",
  },
  {
    icon: Newspaper,
    color: "#1a2b5e",
    colorBg: "rgba(26,43,94,0.08)",
    title: "Articles",
    subtitle: "Discover interesting scientific articles",
    href: "/library",
  },
  {
    icon: Sparkles,
    color: "#c9a84c",
    colorBg: "rgba(201,168,76,0.12)",
    title: "Atlas AI",
    subtitle: "Practice English conversation with chat AI",
    href: "/chat",
  },
  {
    icon: Radio,
    color: "#ef4444",
    colorBg: "rgba(239,68,68,0.08)",
    title: "Live Session",
    subtitle: "Join interactive live English classes",
    href: "/live",
  },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5" style={{ colorScheme: "light", background: "#f0f4ff" }}>
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-2"
      >
        <h1
          className="text-3xl font-bold mb-1"
          style={{ fontFamily: "'Outfit', sans-serif", color: "#1a2b5e" }}
        >
          Hello Samir 🔥
        </h1>
        <p className="text-sm" style={{ color: "#4a5568" }}>
          Ready to speak English with confidence?
        </p>
      </motion.div>

      {/* Weekly Engagement Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-4 card-hover cursor-pointer"
        style={{
          background: "white",
          border: "1px solid var(--border-subtle)",
          boxShadow: "0 2px 12px rgba(26,43,94,0.07)",
        }}
        onClick={() => {}}
      >
        <div className="flex items-center gap-4 mb-3">
          {/* Circular indicator */}
          <div className="relative shrink-0" style={{ width: 60, height: 60 }}>
            <svg width="60" height="60" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(26,43,94,0.1)" strokeWidth="5" />
              <motion.circle
                cx="30"
                cy="30"
                r="24"
                fill="none"
                stroke="#1a2b5e"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 24}
                initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 24 * (1 - WEEKLY_PERCENT / 100) }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              />
            </svg>
            <div
              className="absolute inset-0 flex items-center justify-center text-sm font-bold"
              style={{ color: "#1a2b5e" }}
            >
              {WEEKLY_PERCENT}%
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold mb-0.5" style={{ color: "var(--navy)" }}>
              Weekly Engagement
            </div>
            <ProgressBar percent={WEEKLY_PERCENT} />
            <div className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
              You're doing great this week!
            </div>
          </div>
          <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
        </div>
      </motion.div>

      {/* Continue Learning Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        onClick={() => router.push("/library")}
        className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all"
        style={{
          background: "linear-gradient(135deg, #1a2b5e, #0f1d4e)",
          boxShadow: "0 6px 20px rgba(26,43,94,0.3)",
          letterSpacing: "0.01em",
        }}
      >
        Continue Learning &nbsp;›
      </motion.button>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="space-y-3"
      >
        {FEATURES.map(({ icon: Icon, color, colorBg, title, subtitle, href }, i) => (
          <motion.button
            key={title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 + i * 0.06 }}
            onClick={() => router.push(href)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all card-hover"
            style={{
              background: "white",
              border: "1px solid var(--border-subtle)",
              boxShadow: "0 2px 8px rgba(26,43,94,0.05)",
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: colorBg }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm mb-0.5" style={{ color: "var(--navy)" }}>
                {title}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {subtitle}
              </div>
            </div>
            <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
          </motion.button>
        ))}
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-sm pb-2"
        style={{ color: "#9aa5b1" }}
      >
        <em>Speak. Make mistakes. </em>
        <em style={{ color: "#c9a84c", fontStyle: "italic", fontWeight: 700 }}>Grow.</em>
      </motion.p>
    </div>
  );
}
