"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ChevronRight, Play, ChevronDown, ChevronUp } from "lucide-react";
import { PAST_SESSIONS } from "@/lib/data";

function LiveDot() {
  return (
    <span className="relative inline-flex items-center">
      <span className="w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
      <span
        className="absolute inset-0 rounded-full animate-ping"
        style={{ background: "#ef4444", opacity: 0.5 }}
      />
    </span>
  );
}

function Countdown({ seconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) return;
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  return (
    <span>
      Starts in: {m}:{s.toString().padStart(2, "0")} min
    </span>
  );
}

const SESSIONS = [
  {
    id: "s1",
    emoji: "🎤",
    emojiColor: "#1a2b5e",
    title: "Improve Your Pronunciation",
    category: "SCIENTIFIC",
    readingTime: "45:20",
    endedDays: 2,
    summary:
      "In this session, we focused on common English pronunciation mistakes and how to fix them. We practiced phonemes like /θ/ (think) and /ð/ (this), worked on stress patterns in multi-syllable words, and did real-time feedback exercises to help you sound more natural.",
    vocabulary: ["phoneme", "stress", "intonation", "articulation", "fluency"],
  },
  {
    id: "s2",
    emoji: "📚",
    emojiColor: "#22c55e",
    title: "Boost Your Vocabulary",
    category: "SCIENTIFIC",
    readingTime: "8 min read",
    endedDays: 3,
    summary:
      "This vocabulary session covered 50 high-frequency English words used in everyday conversations. We explored word families (noun, verb, adjective forms), collocations, and used context-based exercises to help you naturally remember new words.",
    vocabulary: ["collocation", "context", "synonym", "antonym", "frequency"],
  },
  ...PAST_SESSIONS.map((s) => ({
    id: s.id,
    emoji: s.thumbnail,
    emojiColor: "#c9a84c",
    title: s.title,
    category: "SCIENTIFIC",
    readingTime: `${s.duration}:00`,
    endedDays: Math.floor(
      (Date.now() - new Date(s.date).getTime()) / 86400000
    ),
    summary: s.summary,
    vocabulary: s.vocabulary,
  })),
];

export default function LivePage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div
      className="max-w-lg mx-auto px-4 py-6 space-y-6"
      style={{ background: "#f0f4ff", colorScheme: "light", minHeight: "100%" }}
    >
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1
          className="text-2xl font-bold mb-0.5"
          style={{ fontFamily: "'Outfit', sans-serif", color: "#1a2b5e" }}
        >
          Live Sessions
        </h1>
        <p className="text-sm" style={{ color: "#4a5568" }}>
          Hi Samir! Ready to practice English live?
        </p>
      </motion.div>

      {/* Upcoming */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-sm font-bold mb-3" style={{ color: "#4a5568" }}>
          Upcoming Live Session
        </h2>

        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #0b1535 0%, #1a2560 50%, #0d1a3e 100%)",
            boxShadow: "0 8px 32px rgba(26,43,94,0.35)",
          }}
        >
          <div className="relative p-5 pb-5">
            {/* Stars */}
            {[
              { top: "12%", left: "15%", size: 2 },
              { top: "30%", left: "45%", size: 1.5 },
              { top: "8%", left: "70%", size: 3 },
              { top: "60%", left: "80%", size: 2 },
              { top: "50%", left: "25%", size: 1.5 },
              { top: "75%", left: "55%", size: 2 },
            ].map((star, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  top: star.top,
                  left: star.left,
                  width: star.size,
                  height: star.size,
                  background: "rgba(255,255,255,0.7)",
                }}
              />
            ))}

            <div className="flex items-center justify-between mb-4">
              <span
                className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold"
                style={{ background: "rgba(255,255,255,0.12)", color: "white" }}
              >
                <LiveDot />
                Live
              </span>
              <span
                className="text-xs font-medium px-3 py-1 rounded-full"
                style={{ background: "rgba(201,168,76,0.2)", color: "#d4b86a" }}
              >
                <Countdown seconds={12 * 60} />
              </span>
            </div>

            <h3
              className="text-xl font-bold leading-snug mb-2"
              style={{ color: "white", fontFamily: "'Outfit', sans-serif" }}
            >
              Practice Small Talk and Introductions
            </h3>
            <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>
              Learn to start conversations confidently in various social settings.
            </p>

            <div className="flex items-center gap-2 mb-2">
              <div className="flex -space-x-2">
                <div
                  className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    borderColor: "rgba(255,255,255,0.2)",
                    background: "linear-gradient(135deg, #ef4444, #f97316)",
                  }}
                >
                  SE
                </div>
                <div
                  className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    borderColor: "rgba(255,255,255,0.2)",
                    background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                  }}
                >
                  JD
                </div>
              </div>
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full mr-2"
                  style={{ background: "#ef4444", color: "white" }}
                >
                  LIVE
                </span>
                Sarah Elami
              </span>
            </div>

            <div className="flex items-center gap-1 mb-5">
              <Users size={12} style={{ color: "rgba(255,255,255,0.5)" }} />
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                15 participants watching
              </span>
            </div>

            <button
              className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
              style={{
                background: "white",
                color: "#1a2b5e",
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              }}
            >
              Join Live Session &nbsp;›
            </button>
          </div>
        </div>
      </motion.div>

      {/* Previous Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-bold text-base mb-0.5" style={{ color: "#1a2b5e" }}>
          Previous Sessions
        </h2>
        <p className="text-xs mb-3" style={{ color: "#9aa5b1" }}>
          Expand your knowledge with new sessions every day
        </p>
      </motion.div>

      <div className="space-y-3">
        {SESSIONS.map((session, i) => {
          const isExpanded = expandedId === session.id;
          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "white",
                border: "1px solid rgba(26,43,94,0.08)",
                boxShadow: "0 2px 8px rgba(26,43,94,0.05)",
              }}
            >
              {/* Main row */}
              <div className="flex items-start gap-4 p-4">
                <div
                  className="w-20 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: "rgba(26,43,94,0.06)" }}
                >
                  {session.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="font-bold text-sm mb-1.5 leading-snug"
                    style={{ color: "#1a2b5e" }}
                  >
                    {session.title}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(239,68,68,0.1)",
                        color: "#ef4444",
                        border: "1px solid rgba(239,68,68,0.25)",
                      }}
                    >
                      ENDED {session.endedDays} days ago
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: "rgba(26,43,94,0.07)",
                        color: "#1a2b5e",
                        border: "1px solid rgba(26,43,94,0.15)",
                      }}
                    >
                      <Play size={10} fill="currentColor" />
                      Replay Video
                    </button>
                    {/* Summary toggle */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : session.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: isExpanded ? "#1a2b5e" : "rgba(201,168,76,0.1)",
                        color: isExpanded ? "white" : "#c9a84c",
                        border: `1px solid ${isExpanded ? "#1a2b5e" : "rgba(201,168,76,0.3)"}`,
                      }}
                    >
                      Summary
                      {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                    </button>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: "#9aa5b1" }} />
              </div>

              {/* Summary panel */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      className="px-4 pb-4 pt-0"
                      style={{
                        borderTop: "1px solid rgba(26,43,94,0.07)",
                      }}
                    >
                      <div
                        className="rounded-xl p-3 mt-3"
                        style={{ background: "#f5f8ff" }}
                      >
                        <p className="text-sm font-bold mb-2" style={{ color: "#1a2b5e" }}>
                          📝 Session Summary
                        </p>
                        <p
                          className="text-xs leading-relaxed mb-3"
                          style={{ color: "#4a5568" }}
                        >
                          {session.summary}
                        </p>
                        {session.vocabulary && session.vocabulary.length > 0 && (
                          <>
                            <p
                              className="text-xs font-bold mb-2"
                              style={{ color: "#1a2b5e" }}
                            >
                              Key Vocabulary
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {session.vocabulary.map((word) => (
                                <span
                                  key={word}
                                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                                  style={{
                                    background: "rgba(26,43,94,0.08)",
                                    color: "#1a2b5e",
                                  }}
                                >
                                  {word}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
