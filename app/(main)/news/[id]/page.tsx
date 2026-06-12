"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  X,
  Send,
  BookMarked,
  Tag,
  Bookmark,
  Share2,
  CheckCircle,
  Loader2,
  CheckCircle2,
  Newspaper,
  Volume2,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/providers";
import SaveWordModal from "@/components/SaveWordModal";
import ReactMarkdown from "react-markdown";
import { useAtlasChat } from "@/hooks/useAtlasChat";
import { getSelectionBubblePosition, type SelectionBubblePlacement } from "@/lib/selectionBubble";
import { speakSelectedText } from "@/lib/speech";

interface NewsDetail {
  id: string;
  title: string;
  summary: string;
  body?: string;
  topic: string;
  source_name?: string;
  thumbnail_url?: string;
  published_at: string;
}

export default function NewsDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { session, refreshUser } = useAuth();

  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionXp, setCompletionXp] = useState(10);
  const [isCompleting, setIsCompleting] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<{
    id: string;
    status: "saved" | "error";
    message: string;
  } | null>(null);

  const {
    messages: chatMessages,
    isTyping,
    error,
    sendMessage,
    addMessage,
    autoSaveToDeck,
  } = useAtlasChat({
    context_type: "news",
    context_id: id,
    context_content: news?.body || news?.summary || "No content loaded yet.",
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping, panelOpen]);

  // Text selection bubble
  const [selectionBubble, setSelectionBubble] = useState<{
    text: string;
    x: number;
    y: number;
    placement: SelectionBubblePlacement;
  } | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveWord, setSaveWord] = useState("");
  const [saveContext, setSaveContext] = useState("");
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!session?.access_token || !id) return;

    const fetchNewsDetail = async () => {
      try {
        const headers = { Authorization: `Bearer ${session.access_token}` };
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/news/${id}`,
          { headers },
        );

        if (res.ok) {
          const data = await res.json();
          setNews(data);
          if (chatMessages.length === 0) {
            addMessage(
              "ai",
              `I'm here to help you dive into this news article: "${data.title}". Highlight any passage to ask me about it!`,
            );
          }
        }
      } catch (err) {
        console.error("Error loading news detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id, session]);

  const handleMarkCompleted = async () => {
    if (!session?.access_token || !id || isCompleting) return;
    setIsCompleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/news/${id}/read`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${session.access_token}` },
        },
      );
      if (res.ok) {
        const result = await res.json();
        if (typeof result?.xp_awarded === "number") {
          setCompletionXp(result.xp_awarded);
        }
        setIsCompleted(true);
        await refreshUser();
      }
    } catch (err) {
      console.error("Error completing news article", err);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setSelectionBubble(null);
      return;
    }
    const text = selection.toString().trim();
    const range = selection.getRangeAt(0);
    const position = getSelectionBubblePosition(range);
    if (!position) {
      setSelectionBubble(null);
      return;
    }

    setSelectionBubble({
      text,
      ...position,
    });
  }, []);

  const askAIAboutSelection = (text: string) => {
    setSelectionBubble(null);
    window.getSelection()?.removeAllRanges();
    setPanelOpen(true);
    sendMessage(`What does this mean: "${text}"?`);
  };

  const handleAutoSave = async (aiMsgId: string, aiText: string) => {
    const msgIndex = chatMessages.findIndex((m) => m.id === aiMsgId);
    let question = "Contextual question";
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (chatMessages[i].role === "user") {
        question = chatMessages[i].content;
        break;
      }
    }
    setSavingId(aiMsgId);
    setSaveFeedback(null);
    const result = await autoSaveToDeck(question, aiText);
    setSavingId(null);
    if (result.ok) {
      setSavedId(aiMsgId);
      setSaveFeedback({ id: aiMsgId, status: "saved", message: "Saved to Practice Deck" });
      setTimeout(() => setSavedId(null), 2000);
      setTimeout(() => {
        setSaveFeedback((current) => (current?.id === aiMsgId ? null : current));
      }, 3200);
    } else {
      setSaveFeedback({
        id: aiMsgId,
        status: "error",
        message: result.error || "Could not save this to practice.",
      });
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
      <div className="min-h-screen flex items-center justify-center text-gray-400 bg-[#f7f2ea]">
        Loading news article...
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 bg-[#f7f2ea]">
        News article not found.
      </div>
    );
  }

  const paragraphs = news.body?.split("\n\n").filter(Boolean) ?? [news.summary];
  const readingTime = Math.ceil(paragraphs.join(" ").split(" ").length / 200);

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f7f2ea]"
      style={{ colorScheme: "light" }}
    >
      {/* Premium Header */}
      <header className="sticky top-0 z-30 border-b border-[#e6d9c9] bg-[#f7f2ea]/92 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-[760px] items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#667084] transition-colors hover:bg-[#f4efe7] hover:text-[#17172f]"
              style={{ border: "1px solid #e6d9c9" }}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#c9a84c] uppercase tracking-widest">
                {news.topic}
              </span>
              <span className="text-xs text-[#64748b] flex items-center gap-1">
                <Clock size={10} /> {readingTime} min read
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${bookmarked ? "bg-[#fbf5e8] text-[#c9842f]" : "bg-white text-[#9aa5b1] hover:bg-[#f4efe7] hover:text-[#17172f]"}`}
              style={{ border: "1px solid #e6d9c9" }}
            >
              <Bookmark
                className="w-4 h-4"
                fill={bookmarked ? "currentColor" : "none"}
              />
            </button>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#9aa5b1] transition-colors hover:bg-[#f4efe7] hover:text-[#17172f]"
              style={{ border: "1px solid #e6d9c9" }}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[760px] flex-1 px-5 py-8 pb-32 sm:px-8 sm:py-12">
        {/* Article Intro */}
        <div className="mb-8 space-y-5 text-left">
          <div
            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5"
            style={{ border: "1px solid #e6d9c9" }}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold text-[#17172f] uppercase tracking-widest">
              Live News
            </span>
            <span className="text-[10px] text-[#64748b]">-</span>
            <span className="text-[10px] text-[#64748b] font-medium">
              {new Date(news.published_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <h1
            className="text-[32px] font-semibold leading-[1.12] text-[#17172f] sm:text-[44px]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {news.title}
          </h1>

          <p className="max-w-[64ch] border-l-4 border-[#c9842f] pl-4 text-[17px] font-medium leading-[1.65] text-[#667084] sm:text-[19px]">
            {news.summary}
          </p>
        </div>

        {/* Hero Image Section */}
        <div
          className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-[24px] bg-white shadow-[0_12px_34px_rgba(31,27,23,0.08)]"
          style={{ border: "1px solid #e6d9c9" }}
        >
          {news.thumbnail_url ? (
            <img
              src={news.thumbnail_url}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#f4efe7]">
              <Newspaper className="h-20 w-20 text-[#c9842f]/35" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Article content */}
        <article
          className="readable-reader select-text"
          onMouseUp={handleTextSelection}
          onTouchEnd={handleTextSelection}
        >
          {paragraphs.map((para: string, i: number) => (
            <p key={i}>{para}</p>
          ))}
        </article>

        {/* Completion Area */}
        <div className="mt-12 flex flex-col items-center border-t border-[#e6d9c9] pt-8 text-center">
          {isCompleted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#22c55e] text-white shadow-xl shadow-green-200">
                <CheckCircle size={32} />
              </div>
              <div>
                <p className="font-bold text-xl text-[#1a2b5e]">
                  Article Read!
                </p>
                <p className="text-sm font-semibold text-[#22c55e] mt-1">
                  +{completionXp} XP Awarded
                </p>
              </div>
            </motion.div>
          ) : (
            <button
              onClick={handleMarkCompleted}
              disabled={isCompleting}
              className="group flex items-center gap-2 rounded-full px-8 py-3.5 font-extrabold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#121a46]"
              style={{ background: "#202b67" }}
            >
              {isCompleting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving progress...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Mark as Completed
                </>
              )}
            </button>
          )}
        </div>

        {/* Footer Meta */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#e6d9c9] py-8 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9aa5b1] sm:flex-row sm:text-xs">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span>{news.topic} - World News</span>
          </div>
          <span>© 2026 kalyma Press</span>
        </div>
      </main>

      {/* Floating UI Elements */}
      <AnimatePresence>
        {selectionBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-50 flex items-center gap-1 rounded-full px-2 py-1.5 shadow-2xl"
            style={{
              left: selectionBubble.x,
              top: selectionBubble.y,
              transform:
                selectionBubble.placement === "above"
                  ? "translate(-50%, -100%)"
                  : "translate(-50%, 0)",
              background: "#ffffff",
              border: "1px solid rgba(26,43,94,0.1)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              maxWidth: "calc(100vw - 24px)",
            }}
          >
            <button
              onClick={() => askAIAboutSelection(selectionBubble.text)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#1a2b5e] hover:bg-[#f7f2ea] transition-colors"
            >
              <Image
                src="/atlas-logo.png"
                alt="Atlas AI"
                width={16}
                height={16}
                className="object-cover rounded-full"
              />
              Ask Atlas
            </button>
            <div
              className="w-px h-5"
              style={{ background: "rgba(26,43,94,0.1)" }}
            />
            <button
              type="button"
              onClick={() => speakSelectedText(selectionBubble.text)}
              aria-label="Listen to selected text"
              title="Listen"
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#1a2b5e] transition-colors hover:bg-[#f7f2ea]"
            >
              <Volume2 size={14} />
            </button>
            <div
              className="w-px h-5"
              style={{ background: "rgba(26,43,94,0.1)" }}
            />
            <button
              onClick={() => {
                setSaveWord(selectionBubble.text);
                setSaveContext(selectionBubble.text);
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

      {/* Atlas FAB */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setPanelOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-shadow"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(26,43,94,0.08)",
          boxShadow: "0 15px 35px rgba(26,43,94,0.12)",
        }}
      >
        <Image
          src="/atlas-logo.png"
          alt="Atlas AI"
          width={32}
          height={32}
          className="object-cover rounded-full"
        />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-[#f7f2ea]" />
      </motion.button>

      {/* AI Assistant Sheet */}
      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-[#1a2b5e]/20 backdrop-blur-sm"
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

              <div
                className="flex items-center justify-between px-6 py-4 border-b shrink-0"
                style={{ borderColor: "rgba(26,43,94,0.05)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[1rem] bg-[#f7f2ea] flex items-center justify-center shadow-inner">
                    <Image
                      src="/atlas-logo.png"
                      alt="Atlas AI"
                      width={20}
                      height={20}
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a2b5e]">
                      Atlas Assistant
                    </h3>
                    <p className="text-[10px] font-bold text-[#c9a84c] uppercase tracking-widest">
                      News Specialist
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPanelOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f7f2ea] transition-colors"
                >
                  <X className="w-5 h-5 text-[#9aa5b1]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map((msg) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id}
                    className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {msg.role === "ai" && (
                      <div className="w-6 h-6 rounded-lg bg-[#f7f2ea] flex items-center justify-center shrink-0 mb-1">
                        <Image
                          src="/atlas-logo.png"
                          alt="Atlas AI"
                          width={14}
                          height={14}
                          className="object-cover rounded-full"
                        />
                      </div>
                    )}
                    <div
                      className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} max-w-[85%]`}
                    >
                      <div
                        className={`px-4 py-3 rounded-[1.5rem] text-sm leading-relaxed overflow-hidden ${
                          msg.role === "user"
                            ? "bg-[#f7f2ea] text-[#1a2b5e] rounded-br-none"
                            : "bg-[#ffffff] text-[#1a2b5e] border border-[#1a2b5e]/5 rounded-bl-none shadow-sm"
                        }`}
                      >
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                      {msg.role === "ai" && (
                        <div className="mt-2 ml-2 space-y-1">
                          <button
                            onClick={() => handleAutoSave(msg.id, msg.content)}
                            disabled={savingId === msg.id || savedId === msg.id}
                            className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50 ${
                              saveFeedback?.id === msg.id && saveFeedback.status === "error"
                                ? "text-red-600"
                                : "text-[#9aa5b1] hover:text-[#1a2b5e]"
                            }`}
                          >
                            {savingId === msg.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : savedId === msg.id ? (
                              <CheckCircle2
                                size={12}
                                className="text-green-500"
                              />
                            ) : saveFeedback?.id === msg.id && saveFeedback.status === "error" ? (
                              <AlertCircle size={12} />
                            ) : (
                              <BookMarked size={12} />
                            )}
                            {savingId === msg.id
                              ? "Saving..."
                              : savedId === msg.id
                                ? "Saved to Deck"
                                : saveFeedback?.id === msg.id && saveFeedback.status === "error"
                                  ? "Save failed"
                                  : "Save to Deck"}
                          </button>
                          {saveFeedback?.id === msg.id && (
                            <p
                              className={`max-w-xs text-[11px] font-medium leading-4 ${
                                saveFeedback.status === "error" ? "text-red-600" : "text-emerald-600"
                              }`}
                              role="status"
                              aria-live="polite"
                            >
                              {saveFeedback.message}
                            </p>
                          )}
                        </div>
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
                    <div className="w-6 h-6 rounded-lg bg-[#f7f2ea] flex items-center justify-center shrink-0 mb-1">
                      <Image
                        src="/atlas-logo.png"
                        alt="Atlas AI"
                        width={14}
                        height={14}
                        className="object-cover rounded-full"
                      />
                    </div>
                    <div className="px-4 py-3 rounded-[1.5rem] bg-[#ffffff] border border-[#1a2b5e]/5 rounded-bl-none shadow-sm flex items-center gap-1">
                      <div
                        className="w-1.5 h-1.5 bg-[#9aa5b1] rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-1.5 h-1.5 bg-[#9aa5b1] rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-1.5 h-1.5 bg-[#9aa5b1] rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
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

              <div
                className="p-6 shrink-0 bg-[#ffffff] border-t"
                style={{ borderColor: "rgba(26,43,94,0.05)" }}
              >
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-5 py-3.5 text-sm rounded-2xl outline-none transition-all shadow-sm"
                    style={{
                      background: "#f7f2ea",
                      border: "1px solid rgba(26,43,94,0.1)",
                      color: "#1a2b5e",
                    }}
                    placeholder="Ask Atlas about this article…"
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
        context={saveContext}
        sourceType="news"
        sourceId={id}
      />
    </div>
  );
}
