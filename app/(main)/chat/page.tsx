"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, BookMarked, Plus, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
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
    const msgIndex = messages.findIndex(m => m.id === aiMsgId);
    let question = "General chat";
    for(let i = msgIndex - 1; i >= 0; i--){
      if(messages[i].role === "user"){
        question = messages[i].content;
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

  // Initial welcome message when started
  useEffect(() => {
    if (started && messages.length === 0 && !isTyping) {
      addMessage("ai", "Hello! I'm Atlas. How can I help you practice your English today?");
    }
  }, [started, messages.length, isTyping, addMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 180) + "px";
    }
  };

  const handleSend = () => {
    const txt = input.trim();
    if (!txt) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setStarted(true);
    sendMessage(txt);
  };


  return (
    <div className="atlas-chat-root">
      <style>{`
        .atlas-chat-root {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #ffffff;
          color: #1a2b5e;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .atlas-messages {
          flex: 1;
          overflow-y: auto;
          padding: 0;
          scrollbar-width: thin;
          scrollbar-color: rgba(26,43,94,0.1) transparent;
          display: flex;
          flex-direction: column;
        }
        .atlas-messages::-webkit-scrollbar { width: 6px; }
        .atlas-messages::-webkit-scrollbar-thumb {
          background: rgba(26,43,94,0.15);
          border-radius: 3px;
        }

        .atlas-msg-row {
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
        }
        .atlas-msg-row.ai-row {
          background: transparent;
        }
        .atlas-msg-row.user-row {
          background: transparent;
          align-items: flex-end;
        }

        .atlas-msg-inner {
          max-width: 720px;
          width: 100%;
          margin: 0 auto;
        }

        .atlas-ai-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .atlas-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .atlas-sender-name {
          font-size: 14px;
          font-weight: 700;
          color: #1a2b5e;
        }

        .atlas-bubble-ai {
          font-size: 15px;
          line-height: 1.75;
          color: #1a2b5e;
          padding: 0;
          white-space: pre-wrap;
        }

        .atlas-bubble-user {
          background: #f7f2ea;
          color: #1a2b5e;
          border-radius: 20px 20px 4px 20px;
          padding: 14px 20px;
          font-size: 15px;
          line-height: 1.65;
          max-width: 600px;
          white-space: pre-wrap;
          border: 1px solid rgba(26,43,94,0.08);
        }

        .atlas-msg-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 12px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .atlas-msg-row:hover .atlas-msg-actions,
        .atlas-msg-actions.visible {
          opacity: 1;
        }

        .atlas-action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 10px;
          background: transparent;
          border: 1px solid rgba(26,43,94,0.12);
          color: #4a5568;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .atlas-action-btn:hover {
          background: rgba(26,43,94,0.04);
          color: #1a2b5e;
          border-color: rgba(26,43,94,0.2);
        }

        .atlas-welcome-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 24px;
          width: 100%;
        }

        .atlas-welcome-logo {
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(26,43,94,0.06);
        }

        .atlas-welcome-title {
          font-weight: 800;
          color: #1a2b5e;
          letter-spacing: -0.5px;
        }

        .atlas-welcome-sub {
          color: #4a5568;
          text-align: center;
          font-weight: 500;
        }

        .atlas-typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #9aa5b1;
          display: inline-block;
        }

        .atlas-input-area {
          flex-shrink: 0;
          padding: 12px 20px 24px;
          background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, #ffffff 20%);
        }

        .atlas-input-wrap {
          max-width: 760px;
          margin: 0 auto;
          background: #ffffff;
          border: 1.5px solid rgba(26,43,94,0.15);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 12px rgba(26,43,94,0.04);
        }
        .atlas-input-wrap:focus-within {
          border-color: #1a2b5e;
          box-shadow: 0 4px 20px rgba(26,43,94,0.08);
        }

        .atlas-textarea {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 18px 20px 8px;
          font-size: 15px;
          color: #1a2b5e;
          resize: none;
          font-family: inherit;
          line-height: 1.6;
          min-height: 52px;
          max-height: 200px;
        }
        .atlas-textarea::placeholder { color: #9aa5b1; }

        .atlas-input-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px 12px;
        }

        .atlas-toolbar-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .atlas-tool-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          transition: all 0.15s;
        }
        .atlas-tool-btn:hover {
          background: #f7f2ea;
          color: #1a2b5e;
        }

        .atlas-send-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #1a2b5e;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .atlas-send-btn:hover:not(:disabled) {
          transform: scale(1.05);
          background: #2d4080;
        }
        .atlas-send-btn:disabled {
          background: #f0e7db;
          color: #94a3b8;
          cursor: default;
        }

        .atlas-hint {
          text-align: center;
          font-size: 11px;
          color: #9aa5b1;
          margin-top: 12px;
        }

        @media (max-width: 767px) {
          .atlas-input-area {
            padding: 12px 14px calc(104px + env(safe-area-inset-bottom));
          }

          .atlas-input-wrap {
            border-radius: 18px;
          }

          .atlas-hint {
            display: none;
          }
        }
      `}</style>

      {/* ── Messages Area ── */}
      <div className="atlas-messages">
        {/* Animated Welcome / Header Area */}
        <motion.div
          layout
          initial={false}
          animate={{
            flex: started ? 0 : 1,
            paddingTop: started ? 32 : 0,
            paddingBottom: started ? 16 : 0,
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            borderBottom: started ? "1px solid rgba(26,43,94,0.08)" : "none",
          }}
        >
          <motion.div
            layout
            className="atlas-welcome-wrapper"
            animate={{
              flexDirection: started ? "row" : "column",
              gap: started ? 16 : 0,
            }}
          >
            <motion.div
              layout
              className="atlas-welcome-logo"
              animate={{
                width: started ? 42 : 80,
                height: started ? 42 : 80,
                marginBottom: started ? 0 : 24,
              }}
            >
              <Image
                src="/atlas-logo.png"
                alt="Atlas AI"
                width={80}
                height={80}
                className="object-cover"
                style={{ width: "100%", height: "100%" }}
              />
            </motion.div>
            
            <motion.div layout style={{ textAlign: started ? "left" : "center" }}>
              <motion.h1
                layout
                className="atlas-welcome-title"
                animate={{
                  fontSize: started ? 20 : 32,
                  marginBottom: started ? 2 : 8,
                }}
              >
                Atlas AI
              </motion.h1>
              <motion.p
                layout
                className="atlas-welcome-sub"
                animate={{
                  fontSize: started ? 13 : 15,
                  opacity: started ? 0.7 : 1,
                  marginBottom: started ? 0 : 0,
                }}
                style={{ textAlign: started ? "left" : "center" }}
              >
                Speak. Make mistakes. Grow.
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Message List */}
        {started && (
          <div style={{ flex: 1, paddingBottom: 20, paddingTop: 10 }}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`atlas-msg-row ${msg.role === "ai" ? "ai-row" : "user-row"}`}
                onMouseEnter={() => setHoveredMsg(msg.id)}
                onMouseLeave={() => setHoveredMsg(null)}
              >
                <div className="atlas-msg-inner">
                  {msg.role === "ai" && (
                    <>
                      <div className="atlas-ai-header">
                        <div className="atlas-avatar">
                          <Image
                            src="/atlas-logo.png"
                            alt="Atlas AI"
                            width={36}
                            height={36}
                            className="object-cover"
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                        <span className="atlas-sender-name">Atlas</span>
                      </div>
                      <div className="atlas-bubble-ai overflow-hidden">
                        <ReactMarkdown>
                          {msg.content}
                        </ReactMarkdown>
                      </div>

                      <div className={`atlas-msg-actions ${hoveredMsg === msg.id ? "visible" : ""}`}>
                        <button
                          className="atlas-action-btn disabled:opacity-50"
                          onClick={() => handleAutoSave(msg.id, msg.content)}
                          disabled={savingId === msg.id || savedId === msg.id}
                          title="Save this explanation to your Practice Deck"
                        >
                          {savingId === msg.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : savedId === msg.id ? (
                            <CheckCircle2 size={14} className="text-green-500" />
                          ) : (
                            <BookMarked size={14} />
                          )}
                          {savingId === msg.id ? "Saving..." : savedId === msg.id ? "Saved to Deck" : "Save to Deck"}
                        </button>
                      </div>
                    </>
                  )}

                  {msg.role === "user" && (
                    <div className="atlas-bubble-user">{msg.content}</div>
                  )}
                </div>
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
                  <div className="atlas-msg-inner">
                    <div className="atlas-ai-header">
                      <div className="atlas-avatar">
                        <Image
                          src="/atlas-logo.png"
                          alt="Atlas AI"
                          width={36}
                          height={36}
                          className="object-cover"
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                      <span className="atlas-sender-name">Atlas</span>
                    </div>
                    <div style={{ display: "flex", gap: 5, alignItems: "center", paddingTop: 4 }}>
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="atlas-typing-dot"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} style={{ height: 8 }} />
          </div>
        )}
      </div>

      {/* ── Input Area ── */}
      <div className="atlas-input-area">
        <div className="atlas-input-wrap">
          <textarea
            ref={textareaRef}
            className="atlas-textarea"
            placeholder="Message Atlas..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}

            rows={1}
          />
          <div className="atlas-input-toolbar">
            <div className="atlas-toolbar-left">
              <button className="atlas-tool-btn" title="New conversation" onClick={() => { clearMessages(); setStarted(false); setInput(""); }}>
                <Plus size={18} />
              </button>
              <button className="atlas-tool-btn" title="Voice input">
                <Mic size={18} />
              </button>
            </div>
            <button
              className="atlas-send-btn"
              onClick={handleSend}
              disabled={!input.trim()}
              title="Send message"
            >
              <Send size={16} style={{ marginLeft: -2 }} />
            </button>
          </div>
        </div>
        <p className="atlas-hint">Atlas AI can make mistakes. Practice for learning purposes.</p>
      </div>

    </div>
  );
}
