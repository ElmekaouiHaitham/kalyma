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
      className="min-h-screen flex flex-col items-center justify-center bg-[#f0f4ff]"
    >
      {/* Background glow */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[500px] h-[500px] rounded-full opacity-30 animate-pulse blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 text-center px-8 max-w-sm">
        {/* Animated logo */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-[32px] mb-8 bg-white shadow-2xl shadow-[#1a2b5e]/10 p-5"
        >
          <img src="/logo.png" alt="kalyma.ma" className="w-full h-full object-contain" />
        </motion.div>

        <h1 className="text-3xl font-bold mb-3 font-outfit text-[#1a2b5e]">Building Your Experience</h1>

        {/* Animated message */}
        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="text-sm mb-10 font-medium text-[#4a5568] h-5"
        >
          {MESSAGES[msgIndex]}
        </motion.p>

        {/* Progress bar */}
        <div
          className="w-full rounded-full h-2 mb-4 overflow-hidden bg-[#1a2b5e]/5"
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#1a2b5e] to-[#c9a84c]"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <p className="text-xs font-black text-[#1a2b5e] tracking-widest uppercase">
          {progress}% Complete
        </p>

        {/* Dots loader */}
        <div className="flex justify-center gap-2 mt-8 pb-40">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
              className="w-2.5 h-2.5 rounded-full bg-[#c9a84c]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
