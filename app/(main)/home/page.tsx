"use client";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const RECENT_BOOKS = [
  { id: "sherlock", image: "/book_sherlock.png", title: "Sherlock Holmes" },
  { id: "british", image: "/book_british.png", title: "Great British Facts" },
  { id: "stories", image: "/book_stories.png", title: "English Stories" },
];

const RECENT_ARTICLES = [
  {
    id: "a1",
    emoji: "🔬",
    title: "Recently reads and Scientific Topics",
    preview:
      "Discover real exciting articles and science chronology with andlor in scientific…",
    tag: "Science",
  },
  {
    id: "a2",
    emoji: "🌍",
    title: "Recommend a new one",
    preview:
      "The new tale many illusions that determines just drive use a mosiah and endlor homolog…",
    tag: "Culture",
  },
];

const CHAT_PREVIEW = [
  { role: "ai", text: "Hey ! There was your past conversation!" },
  { role: "user", text: "Hey, How do you wins?" },
];

const UPCOMING_SESSIONS = [
  { title: "Business English", time: "3 PM", isLive: false },
  { title: "Business English", time: "3 PM", isLive: true },
];

function CardShell({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: "easeOut" }}
      className={`rounded-2xl flex flex-col overflow-hidden ${className}`}
      style={{
        background: "white",
        border: "1px solid rgba(26,43,94,0.08)",
        boxShadow: "0 4px 16px rgba(26,43,94,0.07)",
      }}
    >
      {children}
    </motion.div>
  );
}

function CardHeader({
  emoji,
  title,
  subtitle,
}: {
  emoji?: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      {emoji && (
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: "rgba(26,43,94,0.06)" }}
        >
          {emoji}
        </div>
      )}
      <div>
        <div
          className="font-bold text-sm leading-snug"
          style={{ color: "#1a2b5e" }}
        >
          {title}
        </div>
        <div className="text-[11px] mt-0.5" style={{ color: "#9aa5b1" }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();

  return (
    <div
      className="w-full max-w-6xl mx-auto px-4 md:px-8 py-6"
      style={{ colorScheme: "light", background: "#f0f4ff", minHeight: "100%" }}
    >
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
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

      {/* 2x2 Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">

        {/* ── READING CARD ──────────────────────────── */}
        <CardShell delay={0.08}>
          <div className="p-5 flex flex-col h-full">
            <CardHeader
              emoji="📚"
              title="Reading"
              subtitle="Expand your vocabulary with English books"
            />

            {/* Book covers row */}
            <div className="flex gap-2 mb-4">
              {RECENT_BOOKS.map((book) => (
                <div
                  key={book.id}
                  className="relative rounded-lg overflow-hidden flex-1"
                  style={{ height: 100 }}
                >
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/library/books")}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white mt-auto transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #1a2b5e, #0f1d4e)",
                boxShadow: "0 4px 12px rgba(26,43,94,0.25)",
              }}
            >
              Explore more books &nbsp;›
            </button>
          </div>
        </CardShell>

        {/* ── ARTICLES CARD ─────────────────────────── */}
        <CardShell delay={0.14}>
          <div className="p-5 flex flex-col h-full">
            <CardHeader
              emoji="📰"
              title="Articles"
              subtitle="Recently read scientific topics"
            />

            <div className="space-y-3 flex-1">
              {RECENT_ARTICLES.map((article) => (
                <button
                  key={article.id}
                  onClick={() => router.push("/library")}
                  className="w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all hover:bg-gray-50"
                  style={{
                    border: "1px solid rgba(26,43,94,0.07)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: "rgba(26,43,94,0.05)" }}
                  >
                    {article.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-xs font-bold mb-0.5 leading-snug"
                      style={{ color: "#1a2b5e" }}
                    >
                      {article.title}
                    </div>
                    <div
                      className="text-[10px] leading-relaxed line-clamp-2"
                      style={{ color: "#9aa5b1" }}
                    >
                      {article.preview}
                    </div>
                  </div>
                  <ChevronRight size={14} className="shrink-0 mt-1" style={{ color: "#9aa5b1" }} />
                </button>
              ))}
            </div>
          </div>
        </CardShell>

        {/* ── ATLAS AI CARD ─────────────────────────── */}
        <CardShell delay={0.2}>
          <div className="p-5 flex flex-col h-full">
            <CardHeader
              emoji="⭐"
              title="Atlas AI"
              subtitle="Practice English conversation with chat AI"
            />

            {/* Chat preview */}
            <div className="flex-1 space-y-2 mb-4">
              {CHAT_PREVIEW.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
                    style={{
                      background:
                        msg.role === "ai"
                          ? "linear-gradient(135deg, #1a2b5e, #2d4080)"
                          : "linear-gradient(135deg, #c9a84c, #e6c86a)",
                    }}
                  >
                    {msg.role === "ai" ? "⭐" : "S"}
                  </div>
                  <div
                    className="px-3 py-2 text-xs leading-relaxed max-w-[75%]"
                    style={
                      msg.role === "user"
                        ? {
                            background: "linear-gradient(135deg, #1a2b5e, #0f1d4e)",
                            color: "white",
                            borderRadius: "16px 16px 4px 16px",
                          }
                        : {
                            background: "#f5f8ff",
                            border: "1px solid rgba(26,43,94,0.08)",
                            borderRadius: "16px 16px 16px 4px",
                            color: "#1a2b5e",
                          }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/chat")}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #1a2b5e, #0f1d4e)",
                boxShadow: "0 4px 12px rgba(26,43,94,0.25)",
              }}
            >
              Practice Now &nbsp;›
            </button>
          </div>
        </CardShell>

        {/* ── LIVE SESSION CARD ─────────────────────── */}
        <CardShell delay={0.26}>
          <div className="p-5 flex flex-col h-full">
            <CardHeader
              emoji="🔴"
              title="Live Session"
              subtitle="Join interactive live English classes"
            />

            <div className="space-y-2 flex-1 mb-4">
              {UPCOMING_SESSIONS.map((session, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                  style={{
                    background: "rgba(26,43,94,0.04)",
                    border: "1px solid rgba(26,43,94,0.07)",
                  }}
                >
                  <div>
                    <div
                      className="text-xs font-bold"
                      style={{ color: "#1a2b5e" }}
                    >
                      {session.title}
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: "#9aa5b1" }}>
                      {session.time}
                      {session.isLive && (
                        <span
                          className="ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white"
                          style={{ background: "#ef4444" }}
                        >
                          LIVE
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => router.push("/live")}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-80"
                    style={{
                      background: "linear-gradient(135deg, #1a2b5e, #0f1d4e)",
                      color: "white",
                      boxShadow: "0 2px 8px rgba(26,43,94,0.2)",
                    }}
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/live")}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Join
            </button>
          </div>
        </CardShell>

      </div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm pt-5 pb-2"
        style={{ color: "#9aa5b1" }}
      >
        <em>Speak. Make mistakes. </em>
        <em style={{ color: "#c9a84c", fontStyle: "italic", fontWeight: 700 }}>Grow.</em>
      </motion.p>
    </div>
  );
}
