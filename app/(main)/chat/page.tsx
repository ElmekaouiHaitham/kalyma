"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BookMarked,
  CheckCircle2,
  Copy,
  Loader2,
  Menu,
  Mic,
  MoreVertical,
  Plus,
  Send,
  Share2,
  SquarePen,
  ThumbsDown,
  ThumbsUp,
  Volume2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useAtlasChat } from "@/hooks/useAtlasChat";

export default function ChatPage() {
  const { messages, isTyping, sendMessage, clearMessages, addMessage, autoSaveToDeck } = useAtlasChat({
    context_type: "general",
    context_content: "General English learning conversation. Be helpful, encouraging, and friendly.",
  });

  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [hoveredMsg, setHoveredMsg] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    const success = await autoSaveToDeck(question, aiText);
    setSavingId(null);

    if (success) {
      setSavedId(aiMsgId);
      setTimeout(() => setSavedId(null), 2000);
    }
  };

  useEffect(() => {
    if (started && messages.length === 0 && !isTyping) {
      addMessage("ai", "Hello! I'm Atlas. How can I help you practice your English today?");
    }
  }, [started, messages.length, isTyping, addMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const resetTextareaHeight = () => {
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    setInput("");
    resetTextareaHeight();
    setStarted(true);
    sendMessage(text);
  };

  const handleNewConversation = () => {
    clearMessages();
    setStarted(false);
    setInput("");
    resetTextareaHeight();
  };

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
          font-family: Arial, Helvetica, sans-serif;
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
          padding: 24px 24px 12px;
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
          width: 54px;
          height: 54px;
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

        .atlas-messages {
          flex: 1;
          overflow-y: auto;
          padding: 96px 24px 132px;
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
          gap: 8px;
          margin: 0 auto 24px;
          border-radius: 999px;
          background: #eeeeee;
          padding: 9px 16px;
          color: #7c7c7c;
          font-size: 15px;
          font-weight: 600;
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
          font-size: 18px;
          line-height: 1.45;
          white-space: pre-wrap;
        }

        .atlas-bubble-ai {
          max-width: 760px;
          color: #111111;
          font-size: 19px;
          line-height: 1.62;
        }

        .atlas-bubble-ai p {
          margin: 0 0 18px;
        }

        .atlas-bubble-ai ul,
        .atlas-bubble-ai ol {
          margin: 0 0 18px 24px;
          padding: 0;
        }

        .atlas-bubble-ai li {
          margin: 8px 0;
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

        @media (min-width: 768px) {
          .atlas-chat-topbar {
            padding: 26px 34px 12px;
          }

          .atlas-messages {
            padding-top: 108px;
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
          .atlas-chat-topbar {
            padding: 18px 22px 10px;
          }

          .atlas-messages {
            padding: 104px 31px calc(170px + env(safe-area-inset-bottom));
          }

          .atlas-memory-pill {
            margin-bottom: 28px;
            font-size: 14px;
          }

          .atlas-bubble-user {
            max-width: 86%;
            border-radius: 26px;
            padding: 14px 18px;
            font-size: 18px;
          }

          .atlas-bubble-ai {
            font-size: 18px;
            line-height: 1.58;
          }

          .atlas-msg-actions {
            opacity: 1;
            gap: 17px;
          }

          .atlas-empty {
            min-height: calc(100vh - 280px);
          }

          .atlas-empty-icon {
            width: 84px;
            height: 84px;
          }

          .atlas-empty h1 {
            font-size: 31px;
          }

          .atlas-empty p {
            font-size: 15px;
          }

          .atlas-input-area {
            padding: 12px 30px calc(88px + env(safe-area-inset-bottom));
          }

          .atlas-input-wrap {
            border-radius: 999px;
            padding: 7px 7px 7px 10px;
          }

          .atlas-textarea {
            font-size: 17px;
          }
        }
      `}</style>

      <div className="atlas-chat-topbar">
        <button className="atlas-icon-button" type="button" aria-label="Open chat menu">
          <Menu size={30} strokeWidth={2.5} />
        </button>
        <div className="atlas-top-group">
          <button
            className="atlas-icon-button"
            type="button"
            aria-label="New conversation"
            onClick={handleNewConversation}
          >
            <SquarePen size={27} strokeWidth={2.4} />
          </button>
          <button className="atlas-icon-button" type="button" aria-label="More options">
            <MoreVertical size={28} strokeWidth={2.6} />
          </button>
        </div>
      </div>

      <div className="atlas-messages">
        <div className="atlas-thread">
          {started && (
            <div className="atlas-memory-pill">
              <Image src="/atlas-logo.png" alt="" width={24} height={24} className="h-6 w-6 object-contain" />
              Atlas AI
            </div>
          )}

          {!started && (
            <div className="atlas-empty">
              <div>
                <div className="atlas-empty-icon mx-auto">
                  <Image
                    src="/atlas-logo.png"
                    alt="Atlas AI"
                    width={92}
                    height={92}
                    className="h-full w-full object-contain"
                    priority
                  />
                </div>
                <h1>Atlas AI</h1>
                <p>Speak. Make mistakes. Grow.</p>
              </div>
            </div>
          )}

          {started && (
            <>
              {messages.map((message) => (
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
                    <div className="atlas-bubble-user">{message.content}</div>
                  ) : (
                    <>
                      <div className="atlas-bubble-ai overflow-hidden">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                      <div className={`atlas-msg-actions ${hoveredMsg === message.id ? "visible" : ""}`}>
                        <button className="atlas-action-icon" type="button" aria-label="Copy response">
                          <Copy size={22} strokeWidth={2} />
                        </button>
                        <button className="atlas-action-icon" type="button" aria-label="Good response">
                          <ThumbsUp size={22} strokeWidth={2} />
                        </button>
                        <button className="atlas-action-icon" type="button" aria-label="Bad response">
                          <ThumbsDown size={22} strokeWidth={2} />
                        </button>
                        <button className="atlas-action-icon" type="button" aria-label="Read aloud">
                          <Volume2 size={23} strokeWidth={2} />
                        </button>
                        <button className="atlas-action-icon" type="button" aria-label="Share response">
                          <Share2 size={21} strokeWidth={2} />
                        </button>
                        <button
                          className="atlas-action-icon disabled:cursor-wait disabled:opacity-50"
                          type="button"
                          aria-label="Save to practice deck"
                          title="Save to Practice Deck"
                          onClick={() => handleAutoSave(message.id, message.content)}
                          disabled={savingId === message.id || savedId === message.id}
                        >
                          {savingId === message.id ? (
                            <Loader2 size={22} className="animate-spin" />
                          ) : savedId === message.id ? (
                            <CheckCircle2 size={22} />
                          ) : (
                            <BookMarked size={22} strokeWidth={2} />
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}

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
          {input.trim() ? (
            <button className="atlas-send-btn" type="button" onClick={handleSend} aria-label="Send message">
              <Send size={21} strokeWidth={2.4} />
            </button>
          ) : (
            <button className="atlas-voice-button" type="button" aria-label="Voice input">
              <Mic size={24} strokeWidth={2.4} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
