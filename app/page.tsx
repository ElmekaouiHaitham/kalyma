"use client";

import { motion } from "framer-motion";
import {
  Bot,
  BookOpen,
  BookmarkPlus,
  ChevronRight,
  MessageCircle,
  Newspaper,
  Radio,
  Repeat2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const featureCards = [
  {
    icon: BookOpen,
    title: "Learn with real content",
    text: "Read articles, books, and news matched to your level, interests, and weekly goals.",
  },
  {
    icon: Bot,
    title: "Ask Atlas AI anywhere",
    text: "Highlight confusing words or passages and get clear explanations without leaving the reader.",
  },
  {
    icon: Radio,
    title: "Turn learning into speaking",
    text: "Join live sessions to practice what you learned with real conversation and feedback.",
  },
];

const loopSteps = [
  { icon: Newspaper, label: "Read", text: "Articles, books, and current news" },
  { icon: MessageCircle, label: "Ask", text: "Atlas explains words and passages" },
  { icon: BookmarkPlus, label: "Save", text: "Keep useful vocabulary and notes" },
  { icon: Repeat2, label: "Review", text: "Practice with spaced repetition" },
];

const stats = [
  "A1-C2 personalization",
  "XP, streaks, and goals",
  "AI explanations saved to practice",
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f2ea] text-[#050a2f] selection:bg-[#c9842f] selection:text-white">
      <div className="landing-grain" />
      <div className="landing-shape landing-shape-one" />
      <div className="landing-shape landing-shape-two" />
      <div className="landing-shape landing-shape-three" />

      <nav className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:py-8">
        <Link href="/" aria-label="Kalyma home" className="block">
          <Image
            src="/logo with word.webp"
            alt="kalyma.ma"
            width={190}
            height={76}
            priority
            className="h-auto w-[150px] sm:w-[190px]"
          />
        </Link>

        <Link
          href="/auth"
          className="rounded-full border-2 border-[#050a2f] px-6 py-2.5 text-sm font-extrabold text-[#050a2f] transition-all hover:bg-[#050a2f] hover:text-white sm:px-8 sm:text-base"
        >
          Login
        </Link>
      </nav>

      <section className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pb-14 pt-8 text-center sm:pb-20 sm:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-5 rounded-full border border-[#050a2f]/15 bg-white/45 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] backdrop-blur-md"
        >
          Real content. Real progress.
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="max-w-4xl text-[42px] font-black leading-[0.98] tracking-[-0.02em] sm:text-[70px] lg:text-[78px]"
          style={{ fontFamily: "'Outfit', Inter, system-ui, sans-serif" }}
        >
          Master English Through Content You Love
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="mt-7 max-w-2xl text-[17px] font-medium leading-relaxed text-[#111735] sm:text-xl"
        >
          Kalyma turns articles, books, and news into a complete English-learning loop:
          read, ask Atlas AI, save what matters, review it, then speak with confidence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24 }}
          className="mt-8 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
        >
          <Link
            href="/auth"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#202b67] px-8 py-4 text-base font-extrabold text-white shadow-[0_18px_35px_rgba(32,43,103,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#121a46] sm:w-auto"
          >
            Get Started for Free
            <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex w-full items-center justify-center rounded-full border-2 border-[#050a2f] px-8 py-4 text-base font-extrabold text-[#050a2f] transition-all hover:bg-white/55 sm:w-auto"
          >
            How it Works
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32 }}
          className="mt-14 grid w-full grid-cols-1 gap-5 text-left md:grid-cols-3"
        >
          {featureCards.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="min-h-[210px] rounded-[24px] border border-white/60 bg-white/45 p-7 shadow-[0_20px_50px_rgba(28,36,75,0.08)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-[#050a2f] hover:bg-white/62"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[14px] border border-[#050a2f]/12 bg-white/60">
                <Icon size={25} strokeWidth={2.2} />
              </div>
              <h2 className="text-[22px] font-black leading-tight">{title}</h2>
              <p className="mt-3 text-[16px] font-medium leading-snug text-black/80">{text}</p>
            </article>
          ))}
        </motion.div>
      </section>

      <section
        id="how-it-works"
        className="relative z-10 mx-auto max-w-6xl px-6 pb-14 sm:pb-20"
      >
        <div className="rounded-[30px] border border-white/70 bg-white/48 p-6 shadow-[0_22px_55px_rgba(28,36,75,0.08)] backdrop-blur-xl sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.4fr] lg:items-center">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#c9842f]">
                The Kalyma loop
              </p>
              <h2
                className="mt-3 text-[34px] font-black leading-tight sm:text-[44px]"
                style={{ fontFamily: "'Outfit', Inter, system-ui, sans-serif" }}
              >
                Every lesson becomes something you can use.
              </h2>
              <p className="mt-4 text-[17px] font-medium leading-relaxed text-black/75">
                Instead of isolated drills, Kalyma connects reading, AI coaching, saved vocabulary,
                review, and live speaking practice into one daily flow.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {loopSteps.map(({ icon: Icon, label, text }, index) => (
                <div key={label} className="rounded-[22px] border border-[#050a2f]/10 bg-[#fbf7f1]/80 p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#050a2f] bg-white">
                      <Icon size={21} />
                    </div>
                    <span className="font-black text-[#c9842f]">0{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-black">{label}</h3>
                  <p className="mt-1 text-sm font-semibold leading-snug text-black/65">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-3 border-t border-[#050a2f]/10 pt-6 sm:grid-cols-3">
            {stats.map((item) => (
              <div key={item} className="rounded-full border border-[#050a2f]/10 bg-white/55 px-4 py-3 text-center text-sm font-extrabold">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-10">
        <div className="flex flex-col items-center justify-between gap-5 rounded-[30px] bg-[#202b67] px-7 py-7 text-center text-white shadow-[0_24px_50px_rgba(32,43,103,0.22)] sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">Start with what you already like reading.</h2>
            <p className="mt-2 max-w-2xl text-sm font-medium text-white/76 sm:text-base">
              Build vocabulary, understand real English, and turn saved insights into confident speaking.
            </p>
          </div>
          <Link
            href="/auth"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-black text-[#202b67] transition-all hover:-translate-y-0.5 hover:bg-[#fbf7f1]"
          >
            Create Account
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 px-6 pb-8 text-center text-sm font-medium text-black/70">
        &copy; 2026 kalyma.ma. All rights reserved. Speak with confidence.
      </footer>

      <style jsx>{`
        .landing-grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.28;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.22) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
          background-size: 42px 42px;
          mix-blend-mode: soft-light;
        }

        .landing-shape {
          position: fixed;
          pointer-events: none;
          filter: blur(0.2px);
          opacity: 0.9;
        }

        .landing-shape-one {
          left: -7vw;
          top: -12vh;
          width: 58vw;
          height: 54vh;
          background: #f3eadc;
          border-radius: 0 0 54% 42%;
          transform: rotate(-9deg);
        }

        .landing-shape-two {
          right: -9vw;
          top: -6vh;
          width: 38vw;
          height: 60vh;
          background: #e8ecff;
          border-radius: 38% 0 0 52%;
          transform: rotate(5deg);
        }

        .landing-shape-three {
          left: -8vw;
          bottom: -22vh;
          width: 82vw;
          height: 52vh;
          background: #e8ecff;
          border-radius: 42% 58% 0 0;
          transform: rotate(-10deg);
        }

        @media (max-width: 768px) {
          .landing-shape-one {
            width: 88vw;
            height: 32vh;
          }

          .landing-shape-two {
            width: 74vw;
            height: 44vh;
            right: -36vw;
          }

          .landing-shape-three {
            width: 120vw;
            height: 44vh;
            left: -42vw;
          }
        }
      `}</style>
    </main>
  );
}
