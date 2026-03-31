"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  Send,
  X,
  Maximize2,
} from "lucide-react";

const PARTICIPANTS = [
  { id: "p1", initials: "SE", name: "Sarah E.", gradient: "linear-gradient(135deg, #ef4444, #f97316)" },
  { id: "p2", initials: "JD", name: "Jean D.", gradient: "linear-gradient(135deg, #8b5cf6, #3b82f6)" },
  { id: "p3", initials: "AM", name: "Amir M.", gradient: "linear-gradient(135deg, #22c55e, #16a34a)" },
  { id: "p4", initials: "LK", name: "Lena K.", gradient: "linear-gradient(135deg, #f59e0b, #ef4444)" },
];

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

function Countdown() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(elapsed / 60).toString().padStart(2, "0");
  const s = (elapsed % 60).toString().padStart(2, "0");
  return <span>{m}:{s}</span>;
}

type ChatMsg = { role: "user" | "ai"; text: string };

export default function LiveSessionPage() {
  const router = useRouter();
  const [micOn, setMicOn] = useState(false);
  const [vidOn, setVidOn] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "ai", text: "Welcome to the session! Feel free to ask vocabulary questions or request clarification. 🎙️" },
  ]);

  const send = () => {
    if (!chatInput.trim()) return;
    const txt = chatInput;
    setChatInput("");
    setMessages((p) => [
      ...p,
      { role: "user", text: txt },
      {
        role: "ai",
        text: `Great participation! "${txt}" — let's explore that further in our next exercise.`,
      },
    ]);
  };

  return (
    <div
      className="flex flex-col h-full relative"
      style={{ background: "#0a0f1e" }}
    >
      {/* Top bar */}
      <div
        className="shrink-0 flex items-center justify-between px-4 py-3 z-10"
        style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)" }}
      >
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>

        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ background: "rgba(239,68,68,0.25)", border: "1px solid rgba(239,68,68,0.4)" }}
          >
            <LiveDot />
            LIVE · <Countdown />
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg"
            style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}
          >
            <Users size={12} />
            {PARTICIPANTS.length + 1}
          </span>
        </div>
      </div>

      {/* Main video area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Simulated "stage" video */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{
            background: "linear-gradient(160deg, #0b1535 0%, #1a2560 50%, #0d1a3e 100%)",
          }}
        >
          {/* Stars background */}
          {[
            { top: "8%", left: "12%", size: 2 }, { top: "22%", left: "42%", size: 1.5 },
            { top: "5%", left: "68%", size: 3 }, { top: "55%", left: "78%", size: 2 },
            { top: "40%", left: "20%", size: 1.5 }, { top: "70%", left: "50%", size: 2 },
            { top: "85%", left: "35%", size: 1 }, { top: "15%", left: "85%", size: 1.5 },
          ].map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{ top: s.top, left: s.left, width: s.size, height: s.size, background: "rgba(255,255,255,0.6)" }}
            />
          ))}

          {/* Host avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="relative flex flex-col items-center gap-3"
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white relative"
              style={{
                background: "linear-gradient(135deg, #1a2b5e, #2d4080)",
                border: "3px solid rgba(201,168,76,0.6)",
                boxShadow: "0 0 40px rgba(201,168,76,0.25), 0 0 0 8px rgba(201,168,76,0.08)",
              }}
            >
              SE
              {/* Speaking indicator */}
              <span
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "#22c55e", border: "2px solid #0a0f1e" }}
              >
                <Mic size={12} className="text-white" />
              </span>
            </div>
            <div className="text-center">
              <div className="font-bold text-white text-base">Sarah Elami</div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                Host · English Coach
              </div>
            </div>

            {/* Sound waves */}
            <div className="flex items-end gap-1 h-8">
              {[3, 6, 4, 8, 5, 7, 3, 5, 6, 4].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [h * 2, h * 4, h * 2] }}
                  transition={{ duration: 0.8, delay: i * 0.08, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1 rounded-full"
                  style={{ background: "#22c55e", minHeight: 4 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Session info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-24 left-4 right-4 text-center"
          >
            <div className="text-sm font-bold text-white mb-1">
              Practice Small Talk and Introductions
            </div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              15 participants watching · Level A2–B1
            </div>
          </motion.div>
        </div>

        {/* Participant thumbnails */}
        <div className="absolute bottom-6 left-4 flex gap-2">
          {PARTICIPANTS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="relative"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-bold text-white"
                style={{
                  background: p.gradient,
                  border: "2px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                }}
              >
                {p.initials}
              </div>
              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                style={{ background: "rgba(0,0,0,0.7)", color: "rgba(255,255,255,0.9)" }}
              >
                {p.name.split(" ")[0]}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Controls bar */}
      <div
        className="shrink-0 flex items-center justify-center gap-4 py-4 px-4"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)" }}
      >
        <button
          onClick={() => setMicOn(!micOn)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
          style={{
            background: micOn ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.1)",
            border: micOn ? "1.5px solid rgba(34,197,94,0.5)" : "1.5px solid rgba(255,255,255,0.1)",
          }}
        >
          {micOn
            ? <Mic className="w-5 h-5" style={{ color: "#22c55e" }} />
            : <MicOff className="w-5 h-5" style={{ color: "rgba(255,255,255,0.6)" }} />}
        </button>

        <button
          onClick={() => setVidOn(!vidOn)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
          style={{
            background: vidOn ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.1)",
            border: vidOn ? "1.5px solid rgba(59,130,246,0.5)" : "1.5px solid rgba(255,255,255,0.1)",
          }}
        >
          {vidOn
            ? <Video className="w-5 h-5" style={{ color: "#3b82f6" }} />
            : <VideoOff className="w-5 h-5" style={{ color: "rgba(255,255,255,0.6)" }} />}
        </button>

        <button
          onClick={() => setChatOpen(true)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center relative"
          style={{ background: "rgba(201,168,76,0.2)", border: "1.5px solid rgba(201,168,76,0.4)" }}
        >
          <MessageSquare className="w-5 h-5" style={{ color: "#c9a84c" }} />
        </button>

        <button
          onClick={() => router.back()}
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(239,68,68,0.2)", border: "1.5px solid rgba(239,68,68,0.4)" }}
        >
          <X className="w-5 h-5" style={{ color: "#ef4444" }} />
        </button>
      </div>

      {/* Atlas AI Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setChatOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl flex flex-col"
              style={{
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.1)",
                height: "55vh",
                maxHeight: 440,
              }}
            >
              {/* Panel header */}
              <div
                className="flex items-center justify-between p-4 border-b shrink-0"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                    style={{ background: "linear-gradient(135deg, #1a2b5e, #2d4080)" }}
                  >
                    ⭐
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">Atlas AI</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      Session assistant
                    </div>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} style={{ color: "rgba(255,255,255,0.4)" }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className="px-4 py-2.5 rounded-2xl max-w-xs text-sm leading-relaxed"
                      style={
                        msg.role === "user"
                          ? {
                              background: "linear-gradient(135deg, #1a2b5e, #2d4080)",
                              color: "white",
                              borderRadius: "20px 20px 4px 20px",
                            }
                          : {
                              background: "rgba(255,255,255,0.08)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              borderRadius: "20px 20px 20px 4px",
                              color: "rgba(255,255,255,0.9)",
                            }
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2.5 text-sm rounded-xl outline-none"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "white",
                    }}
                    placeholder="Ask about this session…"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                  />
                  <button
                    onClick={send}
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, #1a2b5e, #2d4080)" }}
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
