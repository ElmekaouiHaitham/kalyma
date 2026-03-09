"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic } from "lucide-react";

type Msg = { id: string; role: "user" | "ai"; content: string; ts: Date };

const INIT_MSGS: Msg[] = [
  {
    id: "ai0",
    role: "ai",
    content: "Hello Samir! 👋\nHow can I help you today?",
    ts: new Date(),
  },
];

const TOPICS = [
  { icon: "📖", title: "Daily Practice", sub: "Real-life conversations" },
  { icon: "💼", title: "Business English", sub: "Work & Professional" },
  { icon: "🌍", title: "Travel & Culture", sub: "Explore Morocco & World" },
  { icon: "🎙️", title: "Pronunciation", sub: "Improve your accent" },
];

type Mode = "text" | "voice" | "scenario";

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>(INIT_MSGS);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("text");
  const [isTyping, setIsTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text?: string) => {
    const txt = text ?? input.trim();
    if (!txt) return;
    setInput("");
    setStarted(true);

    const newMsg: Msg = { id: `u${Date.now()}`, role: "user", content: txt, ts: new Date() };
    setMessages((p) => [...p, newMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((p) => [
        ...p,
        {
          id: `ai${Date.now()}`,
          role: "ai",
          content: `Great point! "${txt}" — Let me help you build on that. Would you like to practice using more complex sentence structures?`,
          ts: new Date(),
        },
      ]);
    }, 1600);
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#f0f4ff", maxHeight: "100vh", colorScheme: "light" }}
    >
      {/* Atlas AI Header */}
      <div
        className="shrink-0 px-5 py-5 text-center relative overflow-hidden"
        style={{
          background: "white",
          borderBottom: "1px solid rgba(26,43,94,0.08)",
        }}
      >
        <div className="absolute top-3 right-4 text-xl" style={{ color: "#c9a84c", opacity: 0.7 }}>
          ✦
        </div>
        <div className="absolute bottom-3 left-5 text-sm" style={{ color: "rgba(201,168,76,0.5)" }}>
          ✶
        </div>

        <div className="flex justify-center mb-2">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-md"
            style={{
              background: "linear-gradient(135deg, #1a2b5e 0%, #2d4080 100%)",
              boxShadow: "0 4px 20px rgba(26,43,94,0.25)",
            }}
          >
            ⭐
          </div>
        </div>

        <h1
          className="text-xl font-bold mb-0.5"
          style={{ fontFamily: "'Outfit', sans-serif", color: "#1a2b5e" }}
        >
          Atlas AI
        </h1>
        <p className="text-xs mb-1" style={{ color: "#4a5568" }}>
          Your Personal English Coach
        </p>
        <div className="flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
          <span className="text-xs font-medium" style={{ color: "#4a5568" }}>
            Online • Ready to chat
          </span>
        </div>
      </div>

      {/* Mode Tabs + Topics */}
      {!started && (
        <div className="shrink-0 px-4 py-4 space-y-4" style={{ background: "#f0f4ff" }}>
          <p className="text-xs font-bold text-center uppercase tracking-wider" style={{ color: "#9aa5b1" }}>
            Start a conversation
          </p>
          <div
            className="flex rounded-xl p-1 gap-1"
            style={{ background: "white", border: "1px solid rgba(26,43,94,0.08)" }}
          >
            {(["voice", "text", "scenario"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                style={{
                  background: mode === m ? "#1a2b5e" : "transparent",
                  color: mode === m ? "white" : "#9aa5b1",
                }}
              >
                {m === "voice" ? "🎤" : m === "text" ? "💬" : "👤"}
                {m === "voice" ? "Voice Mode" : m === "text" ? "Text Chat" : "Scenario"}
              </button>
            ))}
          </div>

          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#9aa5b1" }}>
            Choose a topic
          </p>
          <div className="grid grid-cols-2 gap-3">
            {TOPICS.map(({ icon, title, sub }) => (
              <button
                key={title}
                onClick={() => sendMessage(`I want to practice ${title}`)}
                className="p-3 rounded-xl text-left transition-all card-hover"
                style={{
                  background: "white",
                  border: "1px solid rgba(26,43,94,0.08)",
                  boxShadow: "0 2px 8px rgba(26,43,94,0.05)",
                }}
              >
                <div className="text-xl mb-1">{icon}</div>
                <div className="text-xs font-bold mb-0.5" style={{ color: "#1a2b5e" }}>
                  {title}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-[10px]" style={{ color: "#9aa5b1" }}>
                    {sub}
                  </div>
                  <span className="text-[10px]" style={{ color: "#9aa5b1" }}>›</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        <div className="max-w-lg mx-auto space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.role === "ai" && (
                <div
                  className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm"
                  style={{ background: "linear-gradient(135deg, #1a2b5e, #2d4080)", marginTop: 4 }}
                >
                  ⭐
                </div>
              )}
              {msg.role === "user" && (
                <div
                  className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-sm text-white"
                  style={{ background: "linear-gradient(135deg, #1a2b5e, #2d4080)", marginTop: 4 }}
                >
                  S
                </div>
              )}

              <div
                className={`flex flex-col gap-1 max-w-xs sm:max-w-sm ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className="px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
                  style={
                    msg.role === "user"
                      ? {
                          background: "linear-gradient(135deg, #1a2b5e, #0f1d4e)",
                          color: "white",
                          borderRadius: "20px 20px 4px 20px",
                        }
                      : {
                          background: "white",
                          border: "1px solid rgba(26,43,94,0.08)",
                          borderRadius: "20px 20px 20px 4px",
                          color: "#1a2b5e",
                          boxShadow: "0 2px 8px rgba(26,43,94,0.05)",
                        }
                  }
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <span className="text-xs px-1" style={{ color: "#9aa5b1" }}>
                    {msg.ts.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} ✓
                  </span>
                )}
              </div>
            </motion.div>
          ))}

          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-2.5"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                  style={{ background: "linear-gradient(135deg, #1a2b5e, #2d4080)", marginTop: 4 }}
                >
                  ⭐
                </div>
                <div
                  className="px-4 py-3 flex items-center gap-1"
                  style={{
                    background: "white",
                    border: "1px solid rgba(26,43,94,0.08)",
                    borderRadius: "20px 20px 20px 4px",
                    boxShadow: "0 2px 8px rgba(26,43,94,0.05)",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                      className="w-2 h-2 rounded-full"
                      style={{ background: "#1a2b5e" }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div
        className="shrink-0 px-4 py-3"
        style={{
          background: "white",
          borderTop: "1px solid rgba(26,43,94,0.08)",
        }}
      >
        <div className="max-w-lg mx-auto flex gap-2 items-end">
          <textarea
            className="flex-1 px-4 py-3 text-sm resize-none"
            style={{
              background: "#f5f8ff",
              border: "1.5px solid rgba(26,43,94,0.15)",
              borderRadius: "1rem",
              color: "#1a2b5e",
              lineHeight: 1.5,
              minHeight: 44,
              maxHeight: 100,
            }}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            rows={1}
          />
          <button
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all"
            style={{
              background: "rgba(26,43,94,0.07)",
              border: "1.5px solid rgba(26,43,94,0.15)",
              color: "#1a2b5e",
            }}
          >
            <Mic size={18} />
          </button>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim()}
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #1a2b5e, #0f1d4e)" }}
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
