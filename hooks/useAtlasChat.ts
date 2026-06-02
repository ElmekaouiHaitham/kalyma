"use client";
import { useState } from "react";
import { useAuth } from "@/app/providers";

export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  content: string;
  ts: Date;
};

export type AutoSaveResult = {
  ok: boolean;
  error?: string;
};

interface UseAtlasChatProps {
  context_type: "general" | "news" | "article" | "session";
  context_id?: string | null;
  context_content: string;
}

export function useAtlasChat({ context_type, context_id, context_content }: UseAtlasChatProps) {
  const { session } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = (role: "user" | "ai", content: string) => {
    const id = `${role}-${Date.now()}`;
    setMessages((prev) => [...prev, { id, role, content, ts: new Date() }]);
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !session?.access_token) return;

    // Add user message
    const userMsgId = `user-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user", content: text, ts: new Date() },
    ]);
    
    setIsTyping(true);
    setError(null);

    // Create placeholder for AI message
    const aiMsgId = `ai-${Date.now() + 1}`;
    setMessages((prev) => [
      ...prev,
      { id: aiMsgId, role: "ai", content: "", ts: new Date() },
    ]);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          context_type,
          context_id,
          context_content,
          message: text,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("You've reached the message limit. Please try again in a minute.");
        }
        throw new Error("Failed to connect to Atlas AI. Please try again.");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      
      setIsTyping(false);

      if (reader) {
        let assistantMessage = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.substring(6).trim();
              if (dataStr === "[DONE]") {
                break;
              }
              if (dataStr) {
                try {
                  const data = JSON.parse(dataStr);
                  if (data.error) {
                     throw new Error(data.error);
                  }
                  if (data.text) {
                    assistantMessage += data.text;
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === aiMsgId
                          ? { ...msg, content: assistantMessage }
                          : msg
                      )
                    );
                  }
                } catch (e) {
                  console.error("Error parsing SSE data:", e);
                }
              }
            }
          }
        }
      }
    } catch (err: unknown) {
      console.error("Chat error:", err);
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setIsTyping(false);
      setError(message);
      // Append error message as AI response for context if it fails mid-stream or before stream
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId && !msg.content
            ? { ...msg, content: `Warning: ${message || "Connection failed."}` }
            : msg
        )
      );
    }
  };

  const autoSaveToDeck = async (question: string, answer: string): Promise<AutoSaveResult> => {
    if (!session?.access_token) {
      return { ok: false, error: "You need to be signed in to save this." };
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/items/auto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          question,
          answer,
          context: context_content,
          source_type: context_type === "general" ? null : context_type,
          source_id: context_id || null,
        }),
      });

      if (!res.ok) {
        let error = "Could not save this to practice.";
        try {
          const body = await res.json();
          if (typeof body?.detail === "string") error = body.detail;
        } catch {
          // Keep the default message when the backend does not return JSON.
        }
        return { ok: false, error };
      }

      return { ok: true };
    } catch (err: unknown) {
      console.error("Auto save failed:", err);
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Could not connect to the practice service.",
      };
    }
  };

  return {
    messages,
    setMessages,
    isTyping,
    error,
    sendMessage,
    addMessage,
    clearMessages,
    autoSaveToDeck,
  };
}
