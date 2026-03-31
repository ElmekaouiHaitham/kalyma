"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  X,
  Bot,
  Send,
  BookMarked,
  Sparkles,
  Tag,
  Bookmark,
  Share2,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { NEWS_ITEMS } from "@/lib/data";
import SaveWordModal from "@/components/SaveWordModal";

export default function NewsDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const article = NEWS_ITEMS.find((n) => n.id === id) ?? NEWS_ITEMS[0];

  const [panelOpen, setPanelOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "ai",
      text: `I'm ready to help you understand this news article: "${article.title}". Select any text to ask me about it, or type your question below!`,
    },
  ]);

  // Text selection bubble
  const [selectionBubble, setSelectionBubble] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveWord, setSaveWord] = useState("");
  const [bookmarked, setBookmarked] = useState(false);

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setSelectionBubble(null);
      return;
    }
    const text = selection.toString().trim().slice(0, 80);
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setSelectionBubble({
      text,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  }, []);

  const askAIAboutSelection = (text: string) => {
    setSelectionBubble(null);
    window.getSelection()?.removeAllRanges();
    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: `What does this mean: "${text}"?` },
      {
        role: "ai",
        text: `Great question! "${text}" — in this news context, this phrase relates to ${article.category.toLowerCase()} developments. Let me break it down: this is a commonly used expression in journalism that signals ${text.split(" ").length > 3 ? "a complex idea worth unpacking" : "a key concept"}. Would you like me to explain the vocabulary or the broader context?`,
      },
    ]);
    setPanelOpen(true);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: userMsg },
      {
        role: "ai",
        text: `Great question about this ${article.category} article! "${userMsg}" — this relates to the key themes discussed: ${article.summary} Would you like me to explain any specific terms or provide more context?`,
      },
    ]);
  };

  const paragraphs = (article as any).content?.split("\n\n").filter(Boolean) ?? [
    article.summary,
  ];

  const readingTime = Math.ceil(paragraphs.join(" ").split(" ").length / 200);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base, #0d1117)" }}>
      {/* Header */}
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3"
        style={{
          background: "rgba(13,17,23,0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: "rgba(255,255,255,0.8)" }} />
        </button>
        <div className="flex-1 min-w-0" />
        <button
          onClick={() => setBookmarked(!bookmarked)}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <Bookmark
            className="w-4 h-4"
            style={{ color: bookmarked ? "#c9a84c" : "rgba(255,255,255,0.6)" }}
            fill={bookmarked ? "#c9a84c" : "none"}
          />
        </button>
        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <Share2 className="w-4 h-4" style={{ color: "rgba(255,255,255,0.6)" }} />
        </button>
      </div>

      {/* Hero banner */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          height: 200,
          background: "linear-gradient(135deg, #1a2b5e 0%, #0f1d4e 60%, #1a1a2e 100%)",
        }}
      >
        {/* Decorative stars */}
        {[
          { top: "15%", left: "10%", s: 2 }, { top: "30%", left: "60%", s: 1.5 },
          { top: "8%", left: "75%", s: 3 }, { top: "65%", left: "20%", s: 2 },
          { top: "50%", left: "85%", s: 1.5 }, { top: "80%", left: "45%", s: 1 },
        ].map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{ top: star.top, left: star.left, width: star.s, height: star.s, background: "rgba(255,255,255,0.5)" }}
          />
        ))}
        <div className="text-7xl drop-shadow-lg select-none">{article.image}</div>
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{ background: "linear-gradient(to bottom, transparent, var(--bg-base, #0d1117))" }}
        />
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-5 pb-32">
        {/* Meta tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4 mt-2">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(201,168,76,0.15)",
              color: "#c9a84c",
              border: "1px solid rgba(201,168,76,0.3)",
            }}
          >
            {article.category}
          </span>
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <Clock className="w-3 h-3" />
            {readingTime} min read
          </span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            {article.date.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-2xl font-bold leading-tight mb-3"
          style={{ fontFamily: "'Outfit', sans-serif", color: "rgba(255,255,255,0.95)" }}
        >
          {article.title}
        </h1>

        {/* Summary */}
        <p
          className="text-sm italic mb-6 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          {article.summary}
        </p>

        {/* Tip banner */}
        <div
          className="flex items-start gap-2 p-3 rounded-xl mb-6 text-sm"
          style={{
            background: "rgba(26,43,94,0.4)",
            border: "1px solid rgba(26,43,94,0.6)",
          }}
        >
          <span className="text-base">💡</span>
          <p style={{ color: "rgba(255,255,255,0.55)" }}>
            <strong className="font-semibold" style={{ color: "#c9a84c" }}>Tip:</strong>{" "}
            Select any text to ask Atlas AI about it or save it to your Word Bank.
          </p>
        </div>

        {/* Article body with text-selection */}
        <div
          className="space-y-5 text-base leading-relaxed select-text"
          onMouseUp={handleTextSelection}
          onTouchEnd={handleTextSelection}
          style={{ color: "rgba(255,255,255,0.82)", fontSize: "1rem", lineHeight: 1.8 }}
        >
          {paragraphs.map((para: string, i: number) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Bottom tags */}
        <div className="flex items-center gap-2 mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <Tag className="w-3 h-3" style={{ color: "rgba(255,255,255,0.3)" }} />
          <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
            {article.category} · kalyma.ma News
          </span>
        </div>
      </div>

      {/* Text-selection bubble */}
      <AnimatePresence>
        {selectionBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-50 flex items-center gap-1 rounded-2xl px-2 py-1.5 shadow-xl"
            style={{
              left: Math.min(selectionBubble.x, window.innerWidth - 210),
              top: selectionBubble.y,
              transform: "translate(-50%, -100%)",
              background: "#1a2b5e",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <button
              onClick={() => askAIAboutSelection(selectionBubble.text)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold text-white"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <Sparkles size={11} />
              Ask AI
            </button>
            <div className="w-px h-4" style={{ background: "rgba(255,255,255,0.2)" }} />
            <button
              onClick={() => {
                setSaveWord(selectionBubble.text);
                setSaveModalOpen(true);
                setSelectionBubble(null);
                window.getSelection()?.removeAllRanges();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-semibold"
              style={{ color: "#c9a84c" }}
            >
              <BookMarked size={11} />
              Save
            </button>
            <button
              onClick={() => setSelectionBubble(null)}
              className="px-1"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB – Atlas AI */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setPanelOpen(true)}
        className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl"
        style={{ background: "linear-gradient(135deg, #1a2b5e, #2d4080)", boxShadow: "0 8px 30px rgba(26,43,94,0.5)" }}
      >
        <Bot className="w-6 h-6 text-white" />
      </motion.button>

      {/* Atlas AI Bottom Sheet */}
      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setPanelOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl flex flex-col"
              style={{
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.1)",
                height: "62vh",
                maxHeight: 500,
              }}
            >
              {/* Handle */}
              <div className="w-10 h-1 rounded-full mx-auto mt-3 mb-1" style={{ background: "rgba(255,255,255,0.15)" }} />

              {/* Header */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b shrink-0"
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
                      News assistant
                    </div>
                  </div>
                </div>
                <button onClick={() => setPanelOpen(false)} style={{ color: "rgba(255,255,255,0.4)" }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg, i) => (
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
                              background: "rgba(255,255,255,0.07)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              borderRadius: "20px 20px 20px 4px",
                              color: "rgba(255,255,255,0.88)",
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
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "white",
                    }}
                    placeholder="Ask about this article…"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  />
                  <button
                    onClick={sendChat}
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

      <SaveWordModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        prefillWord={saveWord}
      />
    </div>
  );
}
