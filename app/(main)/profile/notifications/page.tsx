"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, MessageSquare, Zap, Newspaper, BookOpen, Radio } from "lucide-react";

const NOTIF_SETTINGS = [
  {
    section: "Learning Reminders",
    items: [
      { id: "daily", icon: Zap, label: "Daily Goal Reminder", sub: "Remind me to practice every day", enabled: true },
      { id: "streak", icon: Bell, label: "Streak Alert", sub: "Notify if I'm about to lose my streak", enabled: true },
    ],
  },
  {
    section: "Content Updates",
    items: [
      { id: "news", icon: Newspaper, label: "New Articles", sub: "When articles matching my interests are added", enabled: true },
      { id: "books", icon: BookOpen, label: "Book Updates", sub: "New chapters or books available", enabled: false },
      { id: "live", icon: Radio, label: "Live Sessions", sub: "Upcoming live sessions reminder", enabled: true },
    ],
  },
  {
    section: "Engagement",
    items: [
      { id: "tips", icon: MessageSquare, label: "Language Tips", sub: "Daily vocabulary and grammar tips", enabled: false },
    ],
  },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, boolean>>(
    Object.fromEntries(
      NOTIF_SETTINGS.flatMap((s) => s.items).map((i) => [i.id, i.enabled])
    )
  );

  const toggle = (id: string) =>
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));

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
          Notifications
        </h1>
        <p className="text-sm" style={{ color: "#4a5568" }}>
          Control how and when kalyma.ma notifies you.
        </p>
      </motion.div>

      {NOTIF_SETTINGS.map((section, si) => (
        <motion.div
          key={section.section}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 + si * 0.06 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: "white",
            border: "1px solid rgba(26,43,94,0.08)",
            boxShadow: "0 2px 10px rgba(26,43,94,0.06)",
          }}
        >
          <div
            className="px-4 py-3"
            style={{ borderBottom: "1px solid rgba(26,43,94,0.06)" }}
          >
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#9aa5b1" }}>
              {section.section}
            </span>
          </div>
          <div>
            {section.items.map(({ id, icon: Icon, label, sub }, i, arr) => (
              <div
                key={id}
                className="flex items-center gap-3 px-4 py-3.5"
                style={{
                  borderBottom: i < arr.length - 1 ? "1px solid rgba(26,43,94,0.05)" : "none",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(26,43,94,0.06)" }}
                >
                  <Icon size={16} style={{ color: "#1a2b5e" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: "#1a2b5e" }}>
                    {label}
                  </div>
                  <div className="text-xs" style={{ color: "#9aa5b1" }}>
                    {sub}
                  </div>
                </div>
                {/* Toggle */}
                <button
                  onClick={() => toggle(id)}
                  className="relative shrink-0 transition-all"
                  style={{
                    width: 44,
                    height: 26,
                    borderRadius: 13,
                    background: settings[id]
                      ? "linear-gradient(135deg, #1a2b5e, #2d4080)"
                      : "rgba(26,43,94,0.12)",
                  }}
                >
                  <motion.div
                    animate={{ x: settings[id] ? 20 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 bg-white rounded-full shadow"
                    style={{ width: 18, height: 18 }}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-xs pb-4"
        style={{ color: "#9aa5b1" }}
      >
        Notification preferences are saved automatically
      </motion.p>
    </div>
  );
}
