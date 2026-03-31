"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  MessageSquare,
  X,
  Bot,
  Send,
  ChevronRight,
  Tag,
  BookMarked,
  Sparkles,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { ARTICLES } from "@/lib/data";
import SaveWordModal from "@/components/SaveWordModal";

const TRANSLATIONS: Record<string, string> = {
  "inteligencia artificial": "artificial intelligence",
  "panorama tecnológico": "technological landscape",
  "aprendizaje automático": "machine learning",
  "impacto medioambiental": "environmental impact",
  "mercado laboral": "labour market",
};

const HIGHLIGHT_WORDS = [
  "inteligencia artificial",
  "panorama tecnológico",
  "aprendizaje automático",
  "impacto medioambiental",
  "mercado laboral",
  "reconversión laboral",
];

function highlightText(text: string) {
  const parts: Array<{ text: string; isHighlight: boolean }> = [];
  let remaining = text;
  while (remaining.length > 0) {
    let earliestIdx = remaining.length;
    let matchedWord = "";
    for (const word of HIGHLIGHT_WORDS) {
      const idx = remaining.toLowerCase().indexOf(word.toLowerCase());
      if (idx !== -1 && idx < earliestIdx) {
        earliestIdx = idx;
        matchedWord = word;
      }
    }
    if (matchedWord && earliestIdx < remaining.length) {
      if (earliestIdx > 0)
        parts.push({
          text: remaining.slice(0, earliestIdx),
          isHighlight: false,
        });
      parts.push({
        text: remaining.slice(earliestIdx, earliestIdx + matchedWord.length),
        isHighlight: true,
      });
      remaining = remaining.slice(earliestIdx + matchedWord.length);
    } else {
      parts.push({ text: remaining, isHighlight: false });
      break;
    }
  }
  return parts;
}

export default function ReaderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const article = ARTICLES.find((a) => a.id === id) ?? ARTICLES[2];

  const [panelOpen, setPanelOpen] = useState(false);
  const [tooltip, setTooltip] = useState<{
    word: string;
    x: number;
    y: number;
  } | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "ai",
      text: `I'm ready to help you understand this article about "${article.title}". Tap any highlighted phrase, or ask me anything!`,
    },
  ]);

  // Text-selection bubble state
  const [selectionBubble, setSelectionBubble] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveWord, setSaveWord] = useState("");

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setSelectionBubble(null);
      return;
    }
    const text = selection.toString().trim().slice(0, 60);
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
      { role: "user", text: `What does "${text}" mean?` },
      {
        role: "ai",
        text: `Great question! "${text}" — this is a key phrase in the article. In context, it refers to the broader topic being discussed. Would you like me to break down the grammar or the vocabulary further?`,
      },
    ]);
    setPanelOpen(true);
  };

  const handleWordClick = (word: string, e: React.MouseEvent) => {
    const translation = TRANSLATIONS[word.toLowerCase()];
    if (translation) {
      setTooltip({
        word,
        x: (e.target as HTMLElement).offsetLeft,
        y: (e.target as HTMLElement).offsetTop,
      });
      setTimeout(() => setTooltip(null), 3000);
    }
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
        text: `Great question about the article! "${userMsg}" — In Spanish, this relates to the concept of "aprendizaje automático" (machine learning), which the article uses to describe how companies like Clarity AI analyze investment impact. Would you like me to break down the grammar or vocabulary?`,
      },
    ]);
  };

  const paragraphs = article.content?.split("\n\n").filter(Boolean) ?? [];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      {/* Header */}
      <div className="sticky top-0 z-30 glass-strong px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{article.category}</div>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <Clock className="w-3 h-3" />
          {article.readingTime} min
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-5 py-6 pb-32">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(34,197,94,0.15)",
              color: "var(--green-primary)",
              border: "1px solid rgba(34,197,94,0.3)",
            }}
          >
            {article.level}
          </span>
          <span
            className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "var(--text-muted)",
            }}
          >
            <Tag className="w-3 h-3" />
            {article.category}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {article.language}
          </span>
        </div>

        <h1
          className="text-2xl font-bold leading-tight mb-4"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {article.title}
        </h1>
        <p
          className="text-sm mb-6 italic"
          style={{ color: "var(--text-secondary)" }}
        >
          {article.summary}
        </p>

        {/* Translation tip */}
        <div
          className="flex items-start gap-2 p-3 rounded-xl mb-6 text-sm"
          style={{
            background: "rgba(34,197,94,0.07)",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          <span className="text-base">💡</span>
          <p style={{ color: "var(--text-secondary)" }}>
            <strong
              className="font-semibold"
              style={{ color: "var(--green-primary)" }}
            >
              Tip:
            </strong>{" "}
            Highlighted phrases can be tapped for instant translations. Ask
            Atlas about any sentence!
          </p>
        </div>

        {/* Article text */}
        <div className="prose-reader relative" onMouseUp={handleTextSelection} onTouchEnd={handleTextSelection}>
          {paragraphs.map((para, pIdx) => {
            const parts = highlightText(para);
            return (
              <p key={pIdx} className="mb-6 relative">
                {parts.map((part, i) =>
                  part.isHighlight ? (
                    <span
                      key={i}
                      className="word-highlight"
                      onClick={(e) => handleWordClick(part.text, e)}
                      title={TRANSLATIONS[part.text.toLowerCase()] || ""}
                    >
                      {part.text}
                    </span>
                  ) : (
                    <span key={i}>{part.text}</span>
                  ),
                )}
              </p>
            );
          })}

          {/* Translation tooltip */}
          <AnimatePresence>
            {tooltip && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-sm font-medium shadow-xl"
                style={{
                  background: "var(--green-primary)",
                  color: "white",
                  maxWidth: 280,
                }}
              >
                <span style={{ opacity: 0.8 }}>"{tooltip.word}" =</span>{" "}
                <strong>{TRANSLATIONS[tooltip.word.toLowerCase()]}</strong>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Selection bubble */}
        <AnimatePresence>
          {selectionBubble && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed z-50 flex items-center gap-1 rounded-2xl px-2 py-1.5 shadow-xl"
              style={{
                left: Math.min(selectionBubble.x, window.innerWidth - 200),
                top: selectionBubble.y,
                transform: "translate(-50%, -100%)",
                background: "#1a2b5e",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <button
                onClick={() => askAIAboutSelection(selectionBubble.text)}
                className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-semibold text-white"
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
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FAB – AI Assistant */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setPanelOpen(true)}
        className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl glow-green"
        style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
      >
        <Bot className="w-6 h-6 text-white" />
      </motion.button>

      {/* AI Assistant Bottom Panel */}
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
                background: "var(--bg-surface)",
                border: "1px solid var(--border-medium)",
                height: "60vh",
                maxHeight: 480,
              }}
            >
              {/* Panel header */}
              <div
                className="flex items-center justify-between p-4 border-b shrink-0"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    }}
                  >
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Atlas Assistant</div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Aware of: {article.title.substring(0, 30)}…
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setPanelOpen(false)}
                  style={{ color: "var(--text-muted)" }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "ai" && (
                      <div
                        className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #22c55e, #16a34a)",
                          marginTop: 2,
                        }}
                      >
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div
                      className="px-4 py-2.5 rounded-2xl max-w-xs text-sm leading-relaxed"
                      style={
                        msg.role === "user"
                          ? {
                              background:
                                "linear-gradient(135deg, #22c55e, #16a34a)",
                              color: "white",
                              borderRadius: "20px 20px 4px 20px",
                            }
                          : {
                              background: "var(--bg-card)",
                              border: "1px solid var(--border-subtle)",
                              borderRadius: "20px 20px 20px 4px",
                              color: "var(--text-primary)",
                            }
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div
                className="p-4 border-t shrink-0"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2 text-sm input-dark"
                    placeholder="Ask about this article…"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  />
                  <button
                    onClick={sendChat}
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    }}
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
