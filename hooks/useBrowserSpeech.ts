"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { speakSelectedText, stopSpeaking } from "@/lib/speech";

export function useBrowserSpeech() {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const tokenRef = useRef(0);

  const stop = useCallback(() => {
    tokenRef.current += 1;
    stopSpeaking();
    setSpeakingId(null);
  }, []);

  const speak = useCallback(
    (id: string, text: string) => {
      if (speakingId === id) {
        stop();
        return;
      }

      const token = tokenRef.current + 1;
      tokenRef.current = token;
      setSpeakingId(id);

      const started = speakSelectedText(text, {
        onEnd: () => {
          if (tokenRef.current === token) setSpeakingId(null);
        },
        onError: () => {
          if (tokenRef.current === token) setSpeakingId(null);
        },
      });

      if (!started) setSpeakingId(null);
    },
    [speakingId, stop],
  );

  useEffect(() => stop, [stop]);

  return {
    isSpeaking: (id: string) => speakingId === id,
    speak,
    speakingId,
    stop,
  };
}
