"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

const MESSAGES = [
  "Analyzing your preferences...",
  "Curating personalized articles...",
  "Tuning your AI companion...",
  "Setting up live sessions...",
  "Almost ready!",
];

function LoadingBrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Image
      src="/logo%20with%20word.webp"
      alt="Kalyma"
      width={compact ? 132 : 150}
      height={compact ? 42 : 48}
      priority
      className={compact ? "h-auto w-[142px] object-contain" : "h-auto w-[166px] object-contain"}
    />
  );
}

function LoadingIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src="/onboarding/planning-illustration.png"
        alt=""
        width={670}
        height={555}
        priority
        unoptimized
        className="h-full w-full object-contain"
      />
    </div>
  );
}

function LoadingFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fffdf7]">
      <div className="hidden min-h-screen grid-cols-[37%_63%] md:grid">
        <aside className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f3dda9]">
          <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(#c99d48_0.7px,transparent_0.7px)] [background-size:6px_6px]" />
          <LoadingIllustration className="relative z-10 h-[40vh] max-h-[360px] w-[68%] max-w-[360px]" />
        </aside>

        <main className="flex min-h-screen flex-col bg-[#fffdf7] px-[6%] py-7 text-[#17265d]">
          <header className="flex items-center justify-between">
            <LoadingBrandMark compact />
            <p className="text-xs font-medium uppercase tracking-[0.04em] text-[#1d2130]">
              Setup
            </p>
          </header>
          <div className="flex flex-1 items-center justify-center py-6">
            <div className="w-full max-w-[440px]">{children}</div>
          </div>
        </main>
      </div>

      <div className="flex min-h-screen flex-col bg-[#fffdf7] md:hidden">
        <div className="bg-[#fffdf7] px-6 py-6">
          <header className="flex items-center justify-between">
            <LoadingBrandMark />
            <p className="text-xs font-medium uppercase tracking-[0.04em] text-[#1d2130]">
              Setup
            </p>
          </header>
        </div>

        <main className="flex-1 bg-[#fffdf7] px-5 pb-7 pt-6 text-[#17265d]">
          {children}
        </main>
      </div>
    </div>
  );
}

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
    <LoadingFrame>
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[16px] border-2 border-[#17265d] bg-[#fff8df] p-4 text-center"
      >
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8b6d2e]">
          Building your experience
        </p>
        <h1 className="mt-2 text-[clamp(1.5rem,6vw,1.9rem)] font-black leading-tight tracking-[-0.03em] text-[#17265d] md:text-[30px]">
          Preparing Kalyma
        </h1>

        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mt-2 min-h-5 text-[13px] font-medium leading-[1.45] text-[#394260] md:text-[14px]"
        >
          {MESSAGES[msgIndex]}
        </motion.p>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/70 shadow-[inset_0_0_0_1px_rgba(25,42,98,0.02)]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#17265d] to-[#b79646]"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8b6d2e]">
          {progress}% complete
        </p>

        <div className="mt-5 flex justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.4, 1], opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-[#17265d]"
            />
          ))}
        </div>
      </motion.section>
    </LoadingFrame>
  );
}
