"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  X,
  Bot,
  Send,
  Tag,
  BookMarked,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/providers";
import SaveWordModal from "@/components/SaveWordModal";
import { useAtlasChat } from "@/hooks/useAtlasChat";
import ReactMarkdown from "react-markdown";

interface ArticleDetail {
  id: string;
  title: string;
  body: string;
  summary?: string;
  topic: string;
  difficulty: string;
  reading_time_mins: number;
}

export default function ReaderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { session } = useAuth();

  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Chat & Selection
  const [panelOpen, setPanelOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  
  const { messages: chatMessages, isTyping, error, sendMessage, addMessage, autoSaveToDeck } = useAtlasChat({
    context_type: "article",
    context_id: id,
    context_content: article?.body || article?.summary || "No content loaded yet.",
  });
  
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping, panelOpen]);

  const [selectionBubble, setSelectionBubble] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveWord, setSaveWord] = useState("");

  useEffect(() => {
    if (!session?.access_token || !id) return;

    const fetchArticleAndStart = async () => {
      try {
        const headers = { Authorization: `Bearer ${session.access_token}` };

        // 1. Fetch Article Detail
        const detailRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`,
          { headers },
        );
        if (detailRes.ok) {
          const data = await detailRes.json();
          setArticle(data);
          if (chatMessages.length === 0) {
            addMessage("ai", `I'm ready to help you understand this article about "${data.title}". Tap and select any phrase, or ask me anything!`);
          }
        }

        // 2. Mark as Started
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}/start`, {
          method: "POST",
          headers,
        });
      } catch (err) {
        console.error("Error loading article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleAndStart();
  }, [id, session]);

  const handleMarkCompleted = async () => {
    if (!session?.access_token || !id) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/articles/${id}/complete`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${session.access_token}` },
        },
      );
      if (res.ok) {
        setIsCompleted(true);
      }
    } catch (err) {
      console.error("Error completing article", err);
    }
  };

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setSelectionBubble(null);
      return;
    }
    const text = selection.toString().trim();
    if (!text) return;

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
    setPanelOpen(true);
    sendMessage(`What does this mean in the context of the text: "${text}"?`);
  };

  const handleAutoSave = async (aiMsgId: string, aiText: string) => {
    const msgIndex = chatMessages.findIndex(m => m.id === aiMsgId);
    let question = "Contextual question";
    for(let i = msgIndex - 1; i >= 0; i--){
      if(chatMessages[i].role === "user"){
        question = chatMessages[i].content;
        break;
      }
    }
    setSavingId(aiMsgId);
    const success = await autoSaveToDeck(question, aiText);
    setSavingId(null);
    if(success) {
       setSavedId(aiMsgId);
       setTimeout(() => setSavedId(null), 2000);
    }
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const txt = chatInput;
    setChatInput("");
    sendMessage(txt);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading article...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Article not found.
      </div>
    );
  }

  const paragraphs = article.body?.split("\n\n").filter(Boolean) ?? [];

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
          <div className="text-sm font-medium truncate uppercase">
            {article.topic}
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <Clock className="w-3 h-3" />
          {article.reading_time_mins} min
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-5 py-6 pb-32">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
            style={{
              background: "rgba(34,197,94,0.15)",
              color: "var(--green-primary)",
              border: "1px solid rgba(34,197,94,0.3)",
            }}
          >
            {article.difficulty}
          </span>
          <span
            className="text-xs px-2 py-1 rounded-full flex items-center gap-1 uppercase"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "var(--text-muted)",
            }}
          >
            <Tag className="w-3 h-3" />
            {article.topic}
          </span>
        </div>

        <h1
          className="text-2xl font-bold leading-tight mb-4"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {article.title}
        </h1>
        {article.summary && (
          <p
            className="text-sm mb-6 italic"
            style={{ color: "var(--text-secondary)" }}
          >
            {article.summary}
          </p>
        )}

        {/* Tip */}
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
            Highlight any text to ask Atlas for explanations or save vocabulary!
          </p>
        </div>

        {/* Article text */}
        <div
          className="prose-reader relative"
          onMouseUp={handleTextSelection}
          onTouchEnd={handleTextSelection}
        >
          {paragraphs.map((para, pIdx) => (
            <p key={pIdx} className="mb-6">
              {para}
            </p>
          ))}
        </div>

        {/* Completion Area */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center flex flex-col items-center">
          {isCompleted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-2 text-green-500"
            >
              <CheckCircle size={40} />
              <p className="font-bold text-lg">Article Completed!</p>
              <p className="text-sm opacity-80">+30 XP Earned</p>
            </motion.div>
          ) : (
            <button
              onClick={handleMarkCompleted}
              className="px-8 py-3 rounded-2xl font-bold text-white shadow-lg card-hover"
              style={{
                background: "linear-gradient(135deg, #1a2b5e, #2d4080)",
              }}
            >
              Mark as Completed
            </button>
          )}
        </div>

        {/* Selection bubble */}
        <AnimatePresence>
          {selectionBubble && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed z-50 flex items-center gap-1 rounded-full px-2 py-1.5 shadow-2xl"
              style={{
                left: Math.min(selectionBubble.x, typeof window !== 'undefined' ? window.innerWidth - 210 : 0),
                top: selectionBubble.y,
                transform: "translate(-50%, -100%)",
                background: "#ffffff",
                border: "1px solid rgba(26,43,94,0.1)",
                boxShadow: "0 8px 30px rgba(26,43,94,0.12)",
              }}
            >
              <button
                onClick={() => askAIAboutSelection(selectionBubble.text)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#1a2b5e] hover:bg-[#f5f8ff] transition-colors"
              >
                <Image src="/atlas-logo.png" alt="Atlas AI" width={16} height={16} className="object-cover rounded-full" />
                Ask Atlas
              </button>
              <div
                className="w-px h-5"
                style={{ background: "rgba(26,43,94,0.1)" }}
              />
              <button
                onClick={() => {
                  setSaveWord(selectionBubble.text);
                  setSaveModalOpen(true);
                  setSelectionBubble(null);
                  window.getSelection()?.removeAllRanges();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#c9a84c] hover:bg-[#fff9e6] transition-colors"
              >
                <BookMarked size={14} />
                Save
              </button>
              <button
                onClick={() => setSelectionBubble(null)}
                className="px-2 text-[#9aa5b1] hover:text-[#1a2b5e] transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setPanelOpen(true)}
        className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(26,43,94,0.08)",
          boxShadow: "0 8px 30px rgba(26,43,94,0.12)",
        }}
      >
        <Image src="/atlas-logo.png" alt="Atlas AI" width={28} height={28} className="object-cover rounded-full" />
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
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[3rem] flex flex-col shadow-2xl overflow-hidden"
              style={{
                background: "#ffffff",
                borderTop: "1px solid rgba(26,43,94,0.08)",
                height: "65vh",
                maxHeight: 600,
              }}
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2 shrink-0" />

              {/* Panel header */}
              <div
                className="flex items-center justify-between px-6 py-4 border-b shrink-0"
                style={{ borderColor: "rgba(26,43,94,0.05)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[1rem] bg-[#f0f4ff] flex items-center justify-center shadow-inner">
                    <Image src="/atlas-logo.png" alt="Atlas AI" width={20} height={20} className="object-cover rounded-full" />
                  </div>
                  <div>
                    <div className="font-bold text-[#1a2b5e]">Atlas Assistant</div>
                    <div className="text-[10px] font-bold text-[#c9a84c] uppercase tracking-widest">
                      Aware of: {article.title.substring(0, 20)}…
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setPanelOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f5f8ff] transition-colors"
                >
                  <X className="w-5 h-5 text-[#9aa5b1]" />
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map((msg) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id}
                    className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {msg.role === "ai" && (
                      <div className="w-6 h-6 rounded-lg bg-[#f0f4ff] flex items-center justify-center shrink-0 mb-1">
                        <Image src="/atlas-logo.png" alt="Atlas AI" width={14} height={14} className="object-cover rounded-full" />
                      </div>
                    )}
                    <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} max-w-[85%]`}>
                      <div
                        className={`px-4 py-3 rounded-[1.5rem] text-sm leading-relaxed overflow-hidden ${
                          msg.role === "user"
                            ? "bg-[#f5f8ff] text-[#1a2b5e] rounded-br-none"
                            : "bg-[#ffffff] text-[#1a2b5e] border border-[#1a2b5e]/5 rounded-bl-none shadow-sm"
                        }`}
                      >
                        <ReactMarkdown>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                      {msg.role === "ai" && (
                        <button
                          onClick={() => handleAutoSave(msg.id, msg.content)}
                          disabled={savingId === msg.id || savedId === msg.id}
                          className="flex items-center gap-1.5 mt-2 ml-2 text-[11px] font-bold uppercase tracking-wider text-[#9aa5b1] hover:text-[#1a2b5e] transition-colors disabled:opacity-50"
                        >
                          {savingId === msg.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : savedId === msg.id ? (
                            <CheckCircle2 size={12} className="text-green-500" />
                          ) : (
                            <BookMarked size={12} />
                          )}
                          {savingId === msg.id ? "Saving..." : savedId === msg.id ? "Saved to Deck" : "Save to Deck"}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-2 flex-row"
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#f0f4ff] flex items-center justify-center shrink-0 mb-1">
                      <Image src="/atlas-logo.png" alt="Atlas AI" width={14} height={14} className="object-cover rounded-full" />
                    </div>
                    <div className="px-4 py-3 rounded-[1.5rem] bg-[#ffffff] border border-[#1a2b5e]/5 rounded-bl-none shadow-sm flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-[#9aa5b1] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-[#9aa5b1] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-[#9aa5b1] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </motion.div>
                )}
                {error && (
                  <div className="text-xs text-red-500 text-center my-2 p-2 bg-red-50 rounded-xl">
                    {error}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div
                className="p-6 shrink-0 bg-[#ffffff] border-t"
                style={{ borderColor: "rgba(26,43,94,0.05)" }}
              >
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-5 py-3.5 text-sm rounded-2xl outline-none transition-all shadow-sm"
                    style={{
                      background: "#f8fafc",
                      border: "1px solid rgba(26,43,94,0.1)",
                      color: "#1a2b5e"
                    }}
                    placeholder="Ask about this article…"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChat()}
                    disabled={isTyping}
                  />
                  <button
                    onClick={sendChat}
                    disabled={isTyping || !chatInput.trim()}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                    style={{
                      background: "linear-gradient(135deg, #1a2b5e, #2d4080)",
                    }}
                  >
                    <Send className="w-5 h-5 text-white" />
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
        context={selectionBubble?.text || ""}
        sourceType="article"
        sourceId={id}
      />
    </div>
  );
}
