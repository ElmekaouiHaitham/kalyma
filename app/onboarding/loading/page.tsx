"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";

const MESSAGES = [
  "Analyzing your preferences…",
  "Curating personalized articles…",
  "Tuning your AI companion…",
  "Setting up live sessions…",
  "Almost ready!",
];

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + 2;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => router.push("/home"), 400);
        }
        return Math.min(next, 100);
      });
    }, 60);

    const msgInterval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 1200);

    return () => {
      clearInterval(interval);
      clearInterval(msgInterval);
    };
  }, [router]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[400px] h-[400px] rounded-full opacity-20 animate-pulse"
          style={{
            background: "radial-gradient(circle, #22c55e 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 text-center px-8 max-w-sm">
        {/* Animated logo */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl glow-green mb-6"
          style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
        >
          <Globe className="w-9 h-9 text-white" />
        </motion.div>

        <h1 className="text-2xl font-bold mb-2">Building your experience</h1>

        {/* Animated message */}
        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="text-sm mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          {MESSAGES[msgIndex]}
        </motion.p>

        {/* Progress bar */}
        <div
          className="w-full rounded-full h-1.5 mb-3 overflow-hidden"
          style={{ background: "var(--border-subtle)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #22c55e, #4ade80)",
              width: `${progress}%`,
            }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {progress}%
        </p>

        {/* Dots loader */}
        <div className="flex justify-center gap-1.5 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--green-primary)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
