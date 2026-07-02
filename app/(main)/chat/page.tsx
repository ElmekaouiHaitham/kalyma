"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BookMarked,
  CheckCircle2,
  Copy,
  Loader2,
  Menu,
  MessageSquareText,
  Mic,
  Plus,
  Send,
  Square,
  SquarePen,
  ThumbsDown,
  ThumbsUp,
  Volume2,
  X,
} from "lucide-react";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/app/providers";
import { useBrowserSpeech } from "@/hooks/useBrowserSpeech";
import {
  useAtlasChat,
  type AtlasCorrection,
  type ChatMessage,
  type CorrectionIssue,
} from "@/hooks/useAtlasChat";
import {
  createBrowserSpeechRecognition,
  type BrowserSpeechRecognition,
} from "@/lib/speechRecognition";

type ApiConversation = {
  id: string;
  user_id: string;
  context_type: "article" | "book_chapter" | "news" | "session" | "general";
  context_id: string | null;
  created_at: string;
  updated_at: string;
  title?: string | null;
  last_message_preview?: string | null;
  message_count?: number | null;
};

type ApiMessage = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  correction?: AtlasCorrection | null;
  tokens_used?: number | null;
  created_at: string;
};

type ConversationListItem = ApiConversation & {
  title: string;
  messageCount: number;
};

const GENERAL_CONTEXT =
  "General English learning conversation. Be helpful, encouraging, and friendly.";

function compactText(text: string, maxLength = 52) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trim()}...`;
}

function formatConversationDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function sortedIssues(issues: CorrectionIssue[]) {
  return [...issues].sort((first, second) => first.start - second.start);
}

function correctionModeLabel(correction: AtlasCorrection) {
  const labels: Record<AtlasCorrection["mode"], string> = {
    light: "Light check",
    detailed: "Detailed check",
    native: "Native refinement",
  };

  return `${labels[correction.mode]} - Level ${correction.level}`;
}

export default function ChatPage() {
  const { user, session } = useAuth();
  const { isSpeaking, speak } = useBrowserSpeech();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const {
    messages,
    setMessages,
    isTyping,
    sendMessage,
    clearMessages,
    autoSaveToDeck,
  } = useAtlasChat({
    conversation_id: activeConversationId,
    context_type: "general",
    context_id: null,
    context_content: GENERAL_CONTEXT,
    enableCorrections: true,
    onConversationId: setActiveConversationId,
  });

  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceInputError, setVoiceInputError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [loadingConversationId, setLoadingConversationId] = useState<string | null>(null);
  const [hoveredMsg, setHoveredMsg] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [messageFeedback, setMessageFeedback] = useState<
    Record<string, "liked" | "disliked">
  >({});
  const [saveFeedback, setSaveFeedback] = useState<{
    id: string;
    status: "saved" | "error";
    message: string;
  } | null>(null);
  const [activeCorrectionIssue, setActiveCorrectionIssue] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const dictationBaseRef = useRef("");
  const firstName = user?.full_name?.trim().split(/\s+/)[0] || "there";
  const hasConversation = messages.length > 0 || isTyping;

  const fetchConversationMessages = useCallback(
    async (conversationId: string) => {
      if (!session?.access_token) throw new Error("Missing session");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ai/conversations/${conversationId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Could not load chat messages");
      return (await response.json()) as ApiMessage[];
    },
    [session?.access_token],
  );

  const refreshConversations = useCallback(
    async (quiet = false) => {
      if (!session?.access_token) return;

      if (!quiet) setHistoryLoading(true);
      setHistoryError(null);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/conversations`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) throw new Error("Could not load chats");

        const rows = ((await response.json()) as ApiConversation[]).filter(
          (conversation) => conversation.context_type === "general",
        );

        const enriched = rows.map((conversation) => ({
          ...conversation,
          title: compactText(
            conversation.title || conversation.last_message_preview || "New chat",
          ),
          messageCount: conversation.message_count || 0,
        }));

        setConversations(enriched);
      } catch {
        setHistoryError("Could not load chats.");
      } finally {
        if (!quiet) setHistoryLoading(false);
      }
    },
    [session?.access_token],
  );

  const handleAutoSave = async (aiMsgId: string, aiText: string) => {
    const msgIndex = messages.findIndex((message) => message.id === aiMsgId);
    let question = "General chat";
    for (let index = msgIndex - 1; index >= 0; index--) {
      if (messages[index].role === "user") {
        question = messages[index].content;
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

  const handleCopyResponse = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      window.setTimeout(() => {
        setCopiedMessageId((currentId) => (currentId === messageId ? null : currentId));
      }, 1800);
    } catch {
      setCopiedMessageId(null);
    }
  };

  const handleMessageFeedback = (messageId: string, feedback: "liked" | "disliked") => {
    setMessageFeedback((current) => {
      const next = { ...current };
      if (next[messageId] === feedback) {
        delete next[messageId];
      } else {
        next[messageId] = feedback;
      }
      return next;
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    void refreshConversations(true);
  }, [refreshConversations]);

  const resetTextareaHeight = () => {
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const fitTextareaToContent = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    fitTextareaToContent();
  };

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = createBrowserSpeechRecognition();
    if (!recognition) {
      setVoiceInputError("Voice input is not supported in this browser.");
      return;
    }

    dictationBaseRef.current = input.trim();
    setVoiceInputError(null);
    setIsListening(true);

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      let transcript = "";

      for (let index = 0; index < event.results.length; index++) {
        transcript += event.results[index][0]?.transcript ?? "";
      }

      const spokenText = transcript.trim();
      const baseText = dictationBaseRef.current;
      const nextInput = [baseText, spokenText].filter(Boolean).join(" ");

      setInput(nextInput);
      window.requestAnimationFrame(fitTextareaToContent);
    };
    recognition.onerror = (event) => {
      setVoiceInputError(
        event.error === "not-allowed"
          ? "Microphone access was blocked."
          : "Could not capture voice input.",
      );
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      textareaRef.current?.focus();
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setVoiceInputError("Voice input could not start.");
      setIsListening(false);
      recognitionRef.current = null;
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    recognitionRef.current?.abort();
    setIsListening(false);
    setInput("");
    resetTextareaHeight();
    void sendMessage(text).then(() => refreshConversations(true));
  };

  const handleNewConversation = () => {
    setActiveConversationId(null);
    setHistoryOpen(false);
    setSaveFeedback(null);
    setCopiedMessageId(null);
    setMessageFeedback({});
    setActiveCorrectionIssue(null);
    clearMessages();
    setInput("");
    setVoiceInputError(null);
    recognitionRef.current?.abort();
    setIsListening(false);
    resetTextareaHeight();
  };

  const handleOpenHistory = () => {
    setHistoryOpen(true);
    void refreshConversations(conversations.length > 0);
  };

  const handleLoadConversation = async (conversation: ConversationListItem) => {
    setLoadingConversationId(conversation.id);
    setHistoryError(null);

    try {
      const conversationMessages = await fetchConversationMessages(conversation.id);
      const mappedMessages: ChatMessage[] = conversationMessages.map((message) => ({
        id: message.id,
        serverId: message.id,
        role: message.role === "assistant" ? "ai" : "user",
        content: message.content,
        correction: message.correction ?? null,
        correctionStatus: message.correction ? "complete" : undefined,
        ts: new Date(message.created_at),
      }));

      setMessages(mappedMessages);
      setActiveConversationId(conversation.id);
      setHistoryOpen(false);
      setInput("");
      setSaveFeedback(null);
      setActiveCorrectionIssue(null);
      setVoiceInputError(null);
      recognitionRef.current?.abort();
      setIsListening(false);
      resetTextareaHeight();
    } catch {
      setHistoryError("Could not load this chat.");
    } finally {
      setLoadingConversationId(null);
    }
  };

  const renderOriginalWithIssues = (messageId: string, correction: AtlasCorrection) => {
    const parts: ReactNode[] = [];
    let cursor = 0;

    sortedIssues(correction.issues).forEach((issue) => {
      const activeKey = `${messageId}:${issue.id}`;
      const isActive = activeCorrectionIssue === activeKey;

      if (issue.start > cursor) {
        parts.push(
          <span key={`${issue.id}-before`}>
            {correction.original_text.slice(cursor, issue.start)}
          </span>,
        );
      }

      parts.push(
        <span className="atlas-correction-issue-wrap" key={issue.id}>
          <button
            className="atlas-correction-issue"
            type="button"
            onClick={() => setActiveCorrectionIssue(isActive ? null : activeKey)}
          >
            {correction.original_text.slice(issue.start, issue.end)}
          </button>
          {isActive && (
            <span className="atlas-correction-popover" role="status">
              <span className="atlas-correction-popover-title">
                {issue.category}
              </span>
              <span>{issue.explanation}</span>
              <span className="atlas-correction-replacement">
                Use: {issue.corrected_text}
              </span>
            </span>
          )}
        </span>,
      );

      cursor = issue.end;
    });

    if (cursor < correction.original_text.length) {
      parts.push(
        <span key="after-last">
          {correction.original_text.slice(cursor)}
        </span>,
      );
    }

    return parts;
  };

  const renderCorrectedWithIssues = (correction: AtlasCorrection) => {
    const parts: ReactNode[] = [];
    let cursor = 0;

    sortedIssues(correction.issues).forEach((issue) => {
      if (issue.start > cursor) {
        parts.push(
          <span key={`${issue.id}-correct-before`}>
            {correction.original_text.slice(cursor, issue.start)}
          </span>,
        );
      }

      parts.push(
        <span className="atlas-correction-fixed" key={`${issue.id}-correct`}>
          {issue.corrected_text}
        </span>,
      );

      cursor = issue.end;
    });

    if (cursor < correction.original_text.length) {
      parts.push(
        <span key="correct-after-last">
          {correction.original_text.slice(cursor)}
        </span>,
      );
    }

    return parts;
  };

  const renderCorrectionPanel = (message: ChatMessage) => {
    if (message.role !== "user") return null;

    if (message.correctionStatus === "pending") {
      return (
        <div className="atlas-correction-card atlas-correction-status" role="status">
          <Loader2 size={13} className="animate-spin" />
          Checking language...
        </div>
      );
    }

    if (message.correctionStatus === "error") {
      return (
        <div className="atlas-correction-card atlas-correction-error" role="status">
          <AlertCircle size={13} />
          Could not check language.
        </div>
      );
    }

    if (message.correctionStatus !== "complete" || !message.correction) return null;

    if (!message.correction.has_corrections) {
      return (
        <div className="atlas-correction-card atlas-correction-clean" role="status">
          <CheckCircle2 size={13} />
          Looks good.
        </div>
      );
    }

    return (
      <div className="atlas-correction-card">
        <div className="atlas-correction-line">
          {renderOriginalWithIssues(message.id, message.correction)}
        </div>
        <div className="atlas-correction-line corrected">
          {renderCorrectedWithIssues(message.correction)}
        </div>
      </div>
    );
  };

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  return (
    <div className="atlas-chat-root">
      <style>{`
        .atlas-chat-root {
          position: relative;
          display: flex;
          height: 100%;
          flex-direction: column;
          overflow: hidden;
          background: #ffffff;
          color: #111111;
          font-family: "Inter", "Outfit", system-ui, sans-serif;
        }

        .atlas-mobile-statusbar {
          display: none;
        }

        .atlas-chat-topbar {
          pointer-events: none;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 24px 0;
        }

        .atlas-brand-lockup {
          pointer-events: none;
          position: absolute;
          left: 50%;
          top: 50%;
          display: flex;
          transform: translate(-50%, -50%);
          align-items: center;
          gap: 8px;
        }

        .atlas-brand-logo {
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          overflow: hidden;
          border-radius: 999px;
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .atlas-brand-title {
          color: #111111;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0;
        }

        .atlas-top-group {
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(16px);
        }

        .atlas-icon-button {
          display: grid;
          width: 40px;
          height: 40px;
          place-items: center;
          border: 0;
          border-radius: 999px;
          background: #ffffff;
          color: #111111;
          cursor: pointer;
          transition: background 160ms ease, transform 160ms ease;
        }

        .atlas-icon-button:hover {
          background: #f2f2f2;
          transform: translateY(-1px);
        }

        .atlas-mobile-group-menu {
          display: none;
        }

        .atlas-left-menu {
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
        }

        .atlas-history-backdrop {
          position: absolute;
          inset: 0;
          z-index: 70;
          border: 0;
          background: rgba(17, 17, 17, 0.14);
          cursor: default;
        }

        .atlas-history-panel {
          position: absolute;
          inset: 0 auto 0 0;
          z-index: 80;
          display: flex;
          width: min(360px, calc(100vw - 28px));
          flex-direction: column;
          border-right: 1px solid rgba(0, 0, 0, 0.08);
          background: #ffffff;
          padding: 20px 14px;
          box-shadow: 20px 0 60px rgba(0, 0, 0, 0.14);
        }

        .atlas-history-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 0 4px 14px;
        }

        .atlas-history-title {
          margin: 0;
          color: #111111;
          font-size: 20px;
          font-weight: 760;
          line-height: 1.2;
          letter-spacing: 0;
        }

        .atlas-history-close {
          display: grid;
          width: 38px;
          height: 38px;
          place-items: center;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: #111111;
          cursor: pointer;
          transition: background 160ms ease;
        }

        .atlas-history-close:hover {
          background: #f2f2f2;
        }

        .atlas-history-new {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 16px;
          background: #ffffff;
          padding: 12px 14px;
          color: #111111;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 160ms ease, border-color 160ms ease;
        }

        .atlas-history-new:hover {
          border-color: rgba(0, 0, 0, 0.14);
          background: #f7f7f7;
        }

        .atlas-history-list {
          display: flex;
          min-height: 0;
          flex: 1;
          flex-direction: column;
          gap: 6px;
          overflow-y: auto;
          padding: 14px 0 4px;
        }

        .atlas-history-item {
          display: grid;
          grid-template-columns: 30px minmax(0, 1fr) auto;
          width: 100%;
          align-items: center;
          gap: 10px;
          border: 0;
          border-radius: 14px;
          background: transparent;
          padding: 10px;
          color: #111111;
          text-align: left;
          cursor: pointer;
          transition: background 160ms ease;
        }

        .atlas-history-item:hover,
        .atlas-history-item.active {
          background: #f4f4f4;
        }

        .atlas-history-item:disabled {
          cursor: wait;
          opacity: 0.72;
        }

        .atlas-history-icon {
          display: grid;
          width: 30px;
          height: 30px;
          place-items: center;
          border-radius: 999px;
          background: #ffffff;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
          color: #111111;
        }

        .atlas-history-copy {
          min-width: 0;
        }

        .atlas-history-name {
          display: block;
          overflow: hidden;
          color: #111111;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.25;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .atlas-history-meta {
          display: block;
          margin-top: 3px;
          color: #757575;
          font-size: 11px;
          font-weight: 600;
          line-height: 1.2;
        }

        .atlas-history-date {
          color: #8a8a8a;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .atlas-history-state {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 22px 10px;
          color: #707070;
          font-size: 13px;
          font-weight: 650;
          text-align: center;
        }

        .atlas-messages {
          flex: 1;
          overflow-y: auto;
          padding: 30px 24px 132px;
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.16) transparent;
        }

        .atlas-messages::-webkit-scrollbar { width: 7px; }
        .atlas-messages::-webkit-scrollbar-thumb {
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.16);
        }

        .atlas-thread {
          width: min(100%, 780px);
          margin: 0 auto;
        }

        .atlas-memory-pill {
          display: flex;
          width: max-content;
          max-width: 100%;
          align-items: center;
          gap: 10px;
          margin: 0 auto 24px;
          border-radius: 999px;
          background: transparent;
          padding: 0;
          color: #111111;
          font-size: 16px;
          font-weight: 700;
        }

        .atlas-memory-logo {
          display: grid;
          width: 34px;
          height: 34px;
          place-items: center;
          overflow: hidden;
          border-radius: 999px;
          background: #ffffff;
          box-shadow: 0 5px 16px rgba(0, 0, 0, 0.08);
        }

        .atlas-empty {
          display: grid;
          min-height: calc(100vh - 260px);
          place-items: center;
          text-align: center;
        }

        .atlas-empty-icon {
          display: grid;
          width: 92px;
          height: 92px;
          place-items: center;
          overflow: hidden;
          border-radius: 999px;
          background: #ffffff;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
        }

        .atlas-empty h1 {
          margin: 22px 0 8px;
          font-size: 34px;
          font-weight: 760;
          letter-spacing: -0.02em;
          color: #111111;
        }

        .atlas-empty p {
          margin: 0;
          font-size: 17px;
          color: #666666;
        }

        .atlas-empty-question {
          margin-top: 18px;
          color: #111111;
          font-family: "Playfair Display", Georgia, serif;
          font-size: 30px;
          font-weight: 600;
          line-height: 1.18;
          letter-spacing: 0;
        }

        .atlas-empty-mobile {
          display: none;
        }

        .atlas-msg-row {
          display: flex;
          flex-direction: column;
          margin: 0 0 34px;
        }

        .atlas-msg-row.user-row {
          align-items: flex-end;
        }

        .atlas-bubble-user {
          max-width: min(72%, 520px);
          border-radius: 28px;
          background: #f1f1f1;
          padding: 15px 22px;
          color: #111111;
          font-size: 14.4px;
          line-height: 1.45;
          white-space: pre-wrap;
        }

        .atlas-user-message-stack {
          display: flex;
          max-width: min(92%, 620px);
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .atlas-user-message-stack .atlas-bubble-user {
          max-width: 100%;
        }

        .atlas-correction-card {
          width: min(100%, 520px);
          border-left: 3px solid #d9dee8;
          background: #fbfbfb;
          padding: 10px 12px;
          color: #303030;
          font-size: 12px;
          line-height: 1.45;
          text-align: left;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
        }

        .atlas-correction-status,
        .atlas-correction-clean,
        .atlas-correction-error {
          display: inline-flex;
          width: auto;
          align-items: center;
          gap: 7px;
          font-weight: 700;
        }

        .atlas-correction-clean {
          border-left-color: #2e7d4f;
          color: #147a3a;
        }

        .atlas-correction-error {
          border-left-color: #c1121f;
          color: #b4232b;
        }

        .atlas-correction-header {
          margin-bottom: 7px;
          color: #606060;
          font-size: 11px;
          font-weight: 800;
        }

        .atlas-correction-line {
          white-space: pre-wrap;
        }

        .atlas-correction-line.corrected {
          margin-top: 7px;
          padding-top: 7px;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }

        .atlas-correction-issue-wrap {
          position: relative;
          display: inline-block;
        }

        .atlas-correction-issue {
          border: 0;
          border-radius: 4px;
          background: rgba(193, 18, 31, 0.08);
          color: #b4232b;
          padding: 0 2px;
          font: inherit;
          text-decoration: underline;
          text-decoration-color: rgba(180, 35, 43, 0.55);
          text-decoration-thickness: 2px;
          text-underline-offset: 3px;
          cursor: pointer;
        }

        .atlas-correction-fixed {
          border-radius: 4px;
          background: rgba(20, 122, 58, 0.1);
          color: #147a3a;
          padding: 0 2px;
          font-weight: 800;
        }

        .atlas-correction-popover {
          position: absolute;
          right: 0;
          bottom: calc(100% + 8px);
          z-index: 90;
          display: grid;
          width: min(270px, calc(100vw - 48px));
          gap: 5px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          background: #ffffff;
          padding: 10px;
          color: #202020;
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.14);
        }

        .atlas-correction-popover-title {
          color: #6a6a6a;
          font-size: 11px;
          font-weight: 800;
          text-transform: capitalize;
        }

        .atlas-correction-replacement {
          color: #147a3a;
          font-weight: 800;
        }

        .atlas-bubble-ai {
          max-width: 760px;
          color: #111111;
          font-size: 14.4px;
          line-height: 1.58;
        }

        .atlas-bubble-ai p {
          margin: 0 0 14px;
        }

        .atlas-bubble-ai ul,
        .atlas-bubble-ai ol {
          margin: 0 0 14px 20px;
          padding: 0;
        }

        .atlas-bubble-ai li {
          margin: 6px 0;
        }

        .atlas-msg-actions {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-top: 16px;
          color: #5f5f5f;
          opacity: 0;
          transition: opacity 160ms ease;
        }

        .atlas-msg-row:hover .atlas-msg-actions,
        .atlas-msg-actions.visible {
          opacity: 1;
        }

        .atlas-action-icon {
          display: grid;
          width: 28px;
          height: 28px;
          place-items: center;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          transition: color 160ms ease, transform 160ms ease;
        }

        .atlas-action-icon:hover {
          color: #111111;
          transform: translateY(-1px);
        }

        .atlas-action-icon.copied {
          color: #16835d;
        }

        .atlas-action-icon.liked {
          color: #2563eb;
        }

        .atlas-action-icon.disliked {
          color: #dc3545;
        }

        .atlas-typing {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #666666;
          font-size: 16px;
        }

        .atlas-typing-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #777777;
        }

        .atlas-input-area {
          pointer-events: none;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 25;
          padding: 18px 24px 28px;
          background: linear-gradient(to top, #ffffff 72%, rgba(255, 255, 255, 0));
        }

        .atlas-input-wrap {
          pointer-events: auto;
          display: flex;
          width: min(100%, 760px);
          align-items: flex-end;
          gap: 10px;
          margin: 0 auto;
          border-radius: 999px;
          background: #ffffff;
          padding: 8px 8px 8px 14px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.14);
        }

        .atlas-composer-button {
          display: grid;
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          place-items: center;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: #111111;
          cursor: pointer;
          transition: background 160ms ease;
        }

        .atlas-composer-button:hover {
          background: #f1f1f1;
        }

        .atlas-textarea {
          min-height: 42px;
          max-height: 180px;
          flex: 1;
          resize: none;
          border: 0;
          background: transparent;
          padding: 10px 2px 9px;
          color: #111111;
          font: inherit;
          font-size: 18px;
          line-height: 1.35;
          outline: none;
        }

        .atlas-textarea::placeholder {
          color: #8a8a8a;
        }

        .atlas-voice-button,
        .atlas-send-btn {
          display: grid;
          width: 48px;
          height: 48px;
          flex: 0 0 48px;
          place-items: center;
          border: 0;
          border-radius: 999px;
          cursor: pointer;
          transition: transform 160ms ease, background 160ms ease, opacity 160ms ease;
        }

        .atlas-voice-button {
          background: #111111;
          color: #ffffff;
        }

        .atlas-voice-button.listening {
          background: #1a2b5e;
          box-shadow: 0 0 0 4px rgba(26, 43, 94, 0.14);
        }

        .atlas-send-btn {
          background: #111111;
          color: #ffffff;
        }

        .atlas-voice-button:hover,
        .atlas-send-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          background: #000000;
        }

        .atlas-send-btn:disabled {
          cursor: default;
          opacity: 0.35;
        }

        .atlas-voice-error {
          width: min(100%, 720px);
          margin: 8px auto 0;
          color: #b42318;
          font-size: 12px;
          font-weight: 700;
          text-align: center;
        }

        @media (min-width: 768px) {
          .atlas-chat-topbar {
            padding: 22px 34px 0;
          }

          .atlas-messages {
            padding-top: 30px;
            padding-bottom: 150px;
          }

          .atlas-icon-button {
            width: 50px;
            height: 50px;
          }

          .atlas-input-wrap {
            border-radius: 28px;
            padding: 12px;
          }
        }

        @media (max-width: 767px) {
          .atlas-chat-root {
            height: 100%;
          }

          .atlas-history-panel {
            width: min(330px, calc(100vw - 24px));
            padding-top: calc(18px + env(safe-area-inset-top));
          }

          .atlas-mobile-statusbar {
            display: block;
            flex: 0 0 calc(44px + env(safe-area-inset-top));
            background: #1a2b5e;
          }

          .atlas-chat-topbar {
            justify-content: flex-end;
            padding: 18px 30px 0 86px;
          }

          .atlas-left-menu {
            display: none;
          }

          .atlas-brand-lockup {
            display: none;
          }

          .atlas-top-group {
            display: inline-flex;
            gap: 12px;
            padding: 0 8px;
            border-radius: 28px;
          }

          .atlas-mobile-group-menu {
            display: grid;
          }

          .atlas-chat-topbar .atlas-icon-button {
            width: 48px;
            height: 48px;
          }

          .atlas-messages {
            padding: 30px 31px calc(116px + env(safe-area-inset-bottom));
          }

          .atlas-memory-pill {
            margin-bottom: 28px;
            font-size: 14px;
          }

          .atlas-memory-logo {
            width: 32px;
            height: 32px;
          }

          .atlas-bubble-user {
            max-width: 86%;
            border-radius: 26px;
            padding: 14px 18px;
            font-size: 15.3px;
          }

          .atlas-user-message-stack {
            max-width: 100%;
          }

          .atlas-correction-card {
            max-width: min(100%, 340px);
            font-size: 12px;
          }

          .atlas-correction-popover {
            right: auto;
            left: 0;
          }

          .atlas-bubble-ai {
            font-size: 15.3px;
            line-height: 1.56;
          }

          .atlas-msg-actions {
            opacity: 1;
            gap: 17px;
          }

          .atlas-empty {
            min-height: calc(100dvh - 232px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
          }

          .atlas-empty-desktop {
            display: none;
          }

          .atlas-empty-mobile {
            display: block;
          }

          .atlas-empty-mobile h1 {
            margin: 0;
            color: #111111;
            font-family: "Playfair Display", Georgia, serif;
            font-size: 34px;
            font-weight: 600;
            line-height: 1.15;
            letter-spacing: 0;
          }

          .atlas-input-area {
            position: fixed;
            bottom: calc(12px + env(safe-area-inset-bottom));
            z-index: 60;
            padding: 8px 30px 10px;
          }

          .atlas-input-wrap {
            border-radius: 999px;
            gap: 6px;
            padding: 5px 6px 5px 8px;
          }

          .atlas-composer-button {
            width: 36px;
            height: 36px;
            flex-basis: 36px;
          }

          .atlas-textarea {
            min-height: 36px;
            padding: 8px 2px 7px;
            font-size: 16px;
            line-height: 1.3;
          }

          .atlas-voice-button,
          .atlas-send-btn {
            width: 48px;
            height: 48px;
            flex-basis: 48px;
          }
        }
      `}</style>


      <div className="atlas-chat-topbar" style={{ position: 'relative' }}>
        {/* Left: hamburger */}
        <div className="atlas-left-menu">
          <button className="atlas-icon-button" type="button" aria-label="Open chat menu" onClick={handleOpenHistory}>
            <Menu size={30} strokeWidth={2.5} />
          </button>
        </div>


        {/* Right: new chat + mobile menu */}
        <div className="atlas-top-group">
          <button
            className="atlas-icon-button"
            type="button"
            aria-label="New conversation"
            onClick={handleNewConversation}
          >
            <SquarePen size={27} strokeWidth={2.4} />
          </button>
          <button
            className="atlas-icon-button atlas-mobile-group-menu"
            type="button"
            aria-label="Open chat menu"
            onClick={handleOpenHistory}
          >
            <Menu size={27} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {historyOpen && (
          <>
            <motion.button
              className="atlas-history-backdrop"
              type="button"
              aria-label="Close chat history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              onClick={() => setHistoryOpen(false)}
            />
            <motion.aside
              className="atlas-history-panel"
              aria-label="Chat history"
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div className="atlas-history-header">
                <h2 className="atlas-history-title">Chats</h2>
                <button
                  className="atlas-history-close"
                  type="button"
                  aria-label="Close chat history"
                  onClick={() => setHistoryOpen(false)}
                >
                  <X size={21} strokeWidth={2.2} />
                </button>
              </div>

              <button className="atlas-history-new" type="button" onClick={handleNewConversation}>
                <SquarePen size={19} strokeWidth={2.2} />
                New chat
              </button>

              <div className="atlas-history-list">
                {historyLoading ? (
                  <div className="atlas-history-state" role="status">
                    <Loader2 size={16} className="animate-spin" />
                    Loading chats...
                  </div>
                ) : historyError ? (
                  <div className="atlas-history-state" role="status">
                    {historyError}
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="atlas-history-state">No saved chats yet.</div>
                ) : (
                  conversations.map((conversation) => {
                    const isActive =
                      conversation.id === activeConversationId;

                    return (
                      <button
                        key={conversation.id}
                        className={`atlas-history-item ${isActive ? "active" : ""}`}
                        type="button"
                        aria-current={isActive ? "true" : undefined}
                        title={conversation.title}
                        disabled={loadingConversationId === conversation.id}
                        onClick={() => handleLoadConversation(conversation)}
                      >
                        <span className="atlas-history-icon" aria-hidden="true">
                          {loadingConversationId === conversation.id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <MessageSquareText size={15} strokeWidth={2.2} />
                          )}
                        </span>
                        <span className="atlas-history-copy">
                          <span className="atlas-history-name">{conversation.title}</span>
                          <span className="atlas-history-meta">
                            {conversation.messageCount} {conversation.messageCount === 1 ? "message" : "messages"}
                          </span>
                        </span>
                        <span className="atlas-history-date">
                          {formatConversationDate(conversation.updated_at)}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="atlas-messages">
        <div className="atlas-thread">
          {!hasConversation && (
            <div className="atlas-empty">
              <div className="atlas-empty-desktop">
                <div className="atlas-empty-question">What do you want to discuss today?</div>
              </div>
              <div className="atlas-empty-mobile">
                <h1>Hello, {firstName}</h1>
              </div>
            </div>
          )}

          {hasConversation && (
            <>
              {messages.map((message) => {
                  const isLatestMessage = messages[messages.length - 1]?.id === message.id;
                  const isPendingAiResponse = message.role === "ai" && isTyping && isLatestMessage;
                  const canShowActions =
                    message.role === "ai" && message.content.trim().length > 0 && !isPendingAiResponse;
                  const speechId = `chat-message-${message.id}`;

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22 }}
                      className={`atlas-msg-row ${message.role === "ai" ? "ai-row" : "user-row"}`}
                      onMouseEnter={() => setHoveredMsg(message.id)}
                      onMouseLeave={() => setHoveredMsg(null)}
                    >
                      {message.role === "user" ? (
                        <div className="atlas-user-message-stack">
                          <div className="atlas-bubble-user">{message.content}</div>
                          {renderCorrectionPanel(message)}
                        </div>
                      ) : (
                        <>
                          <div className="atlas-bubble-ai overflow-hidden">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                          {canShowActions && (
                            <>
                              <div className={`atlas-msg-actions ${hoveredMsg === message.id ? "visible" : ""}`}>
                                <button
                                  className={`atlas-action-icon ${copiedMessageId === message.id ? "copied" : ""}`}
                                  type="button"
                                  aria-label={copiedMessageId === message.id ? "Response copied" : "Copy response"}
                                  title={copiedMessageId === message.id ? "Copied" : "Copy response"}
                                  onClick={() => void handleCopyResponse(message.id, message.content)}
                                >
                                  {copiedMessageId === message.id ? (
                                    <CheckCircle2 size={22} strokeWidth={2} />
                                  ) : (
                                    <Copy size={22} strokeWidth={2} />
                                  )}
                                </button>
                                <button
                                  className={`atlas-action-icon ${messageFeedback[message.id] === "liked" ? "liked" : ""}`}
                                  type="button"
                                  aria-label="Good response"
                                  aria-pressed={messageFeedback[message.id] === "liked"}
                                  onClick={() => handleMessageFeedback(message.id, "liked")}
                                >
                                  <ThumbsUp
                                    size={22}
                                    strokeWidth={2}
                                    fill={messageFeedback[message.id] === "liked" ? "currentColor" : "none"}
                                  />
                                </button>
                                <button
                                  className={`atlas-action-icon ${messageFeedback[message.id] === "disliked" ? "disliked" : ""}`}
                                  type="button"
                                  aria-label="Bad response"
                                  aria-pressed={messageFeedback[message.id] === "disliked"}
                                  onClick={() => handleMessageFeedback(message.id, "disliked")}
                                >
                                  <ThumbsDown
                                    size={22}
                                    strokeWidth={2}
                                    fill={messageFeedback[message.id] === "disliked" ? "currentColor" : "none"}
                                  />
                                </button>
                                <button
                                  className="atlas-action-icon"
                                  type="button"
                                  aria-label={
                                    isSpeaking(speechId)
                                      ? "Stop reading response"
                                      : "Read response aloud"
                                  }
                                  title={isSpeaking(speechId) ? "Stop" : "Read aloud"}
                                  onClick={() => speak(speechId, message.content)}
                                >
                                  {isSpeaking(speechId) ? (
                                    <Square size={18} fill="currentColor" />
                                  ) : (
                                    <Volume2 size={23} strokeWidth={2} />
                                  )}
                                </button>
                                <button
                                  className="atlas-action-icon disabled:cursor-wait disabled:opacity-50"
                                  type="button"
                                  aria-label="Save to practice deck"
                                  title={
                                    saveFeedback?.id === message.id
                                      ? saveFeedback.message
                                      : "Save to Practice Deck"
                                  }
                                  onClick={() => handleAutoSave(message.id, message.content)}
                                  disabled={savingId === message.id || savedId === message.id}
                                >
                                  {savingId === message.id ? (
                                    <Loader2 size={22} className="animate-spin" />
                                  ) : savedId === message.id ? (
                                    <CheckCircle2 size={22} />
                                  ) : saveFeedback?.id === message.id && saveFeedback.status === "error" ? (
                                    <AlertCircle size={22} />
                                  ) : (
                                    <BookMarked size={22} strokeWidth={2} />
                                  )}
                                </button>
                              </div>
                              {(savingId === message.id || saveFeedback?.id === message.id) && (
                                <div
                                  className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${
                                    saveFeedback?.status === "error"
                                      ? "bg-red-50 text-red-600"
                                      : "bg-emerald-50 text-emerald-700"
                                  }`}
                                  role="status"
                                  aria-live="polite"
                                >
                                  {savingId === message.id ? (
                                    <>
                                      <Loader2 size={12} className="animate-spin" />
                                      Saving to practice...
                                    </>
                                  ) : saveFeedback?.status === "error" ? (
                                    <>
                                      <AlertCircle size={12} />
                                      {saveFeedback.message}
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 size={12} />
                                      {saveFeedback?.message}
                                    </>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </motion.div>
                  );
                })}

              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="atlas-msg-row ai-row"
                  >
                    <div className="atlas-typing">
                      {[0, 1, 2].map((index) => (
                        <motion.span
                          key={index}
                          className="atlas-typing-dot"
                          animate={{ opacity: [0.25, 1, 0.25] }}
                          transition={{ duration: 1.1, delay: index * 0.18, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} style={{ height: 8 }} />
            </>
          )}
        </div>
      </div>

      <div className="atlas-input-area">
        <div className="atlas-input-wrap">
          <button className="atlas-composer-button" type="button" aria-label="New conversation" onClick={handleNewConversation}>
            <Plus size={31} strokeWidth={2.3} />
          </button>
          <textarea
            ref={textareaRef}
            className="atlas-textarea"
            placeholder="Message Atlas..."
            value={input}
            rows={1}
            onChange={handleInputChange}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            className={`atlas-voice-button ${isListening ? "listening" : ""}`}
            type="button"
            aria-label={isListening ? "Stop voice input" : "Voice input"}
            aria-pressed={isListening}
            title={isListening ? "Stop voice input" : "Voice input"}
            onClick={handleVoiceInput}
          >
            <Mic size={24} strokeWidth={2.4} />
          </button>
          <button
            className="atlas-send-btn"
            type="button"
            onClick={handleSend}
            aria-label="Send message"
            disabled={!input.trim() || isTyping}
          >
            <Send size={21} strokeWidth={2.4} />
          </button>
        </div>
        {voiceInputError && (
          <div className="atlas-voice-error" role="status" aria-live="polite">
            {voiceInputError}
          </div>
        )}
      </div>
    </div>
  );
}
