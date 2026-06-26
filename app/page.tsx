"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import type { Transition } from "framer-motion";
import {
  ArrowRight,
  AudioLines,
  BookOpen,
  BookmarkCheck,
  Brain,
  CircleDot,
  ExternalLink,
  FileText,
  Highlighter,
  Instagram,
  Library,
  Linkedin,
  Mail,
  MessageSquareText,
  Radio,
  Repeat2,
  ShieldCheck,
  Sparkles,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, {
  useState,
  useEffect,
  type ComponentType,
  type ReactNode,
} from "react";

import AddToHomeButton from "@/components/AddToHomeButton";
import Floating, { FloatingElement } from "@/components/ui/parallax-floating";

type IconComponent = ComponentType<{ size?: number; className?: string }>;

const heroScreens = [
  {
    type: "laptop" as const,
    src: "/landing/news-desktop.png",
    alt: "Kalyma reader showing a level-matched article with Atlas guidance",
    className:
      "left-[2%] top-[31%] hidden w-[220px] -rotate-[7deg] lg:block xl:w-[270px]",
    depth: 1.2,
    delay: 0.2,
  },
  {
    type: "laptop" as const,
    src: "/landing/atlas-desktop.png",
    alt: "Kalyma dashboard with daily progress and learning tasks",
    className:
      "right-[2%] top-[31%] hidden w-[240px] rotate-[5deg] lg:block xl:w-[290px]",
    depth: 2.1,
    delay: 0.35,
  },
  {
    type: "phone" as const,
    src: "/landing/reader-mobile.png",
    alt: "Mobile article reader with vocabulary explanation support",
    className:
      "bottom-[9%] right-[12%] hidden w-[104px] -rotate-[8deg] lg:block xl:w-[124px]",
    depth: 2.6,
    delay: 0.5,
  },
  {
    type: "laptop" as const,
    src: "/landing/atlas-chat-desktop.png",
    alt: "Atlas AI chat screen for asking language questions",
    className:
      "bottom-[10%] left-[13%] hidden w-[190px] rotate-[4deg] xl:block",
    depth: 3.1,
    delay: 0.62,
  },
];

const loopSteps = [
  {
    icon: Library,
    title: "Content enters at the right weight",
    text: "Topic, level, and reading goal shape what appears first.",
  },
  {
    icon: Highlighter,
    title: "The learner selects the exact friction",
    text: "A phrase, grammar pattern, or idea becomes the object to solve.",
  },
  {
    icon: MessageSquareText,
    title: "Atlas answers inside the passage",
    text: "The explanation stays tied to meaning, tone, and language level.",
  },
  {
    icon: BookmarkCheck,
    title: "The useful bit becomes memory",
    text: "Vocabulary, notes, and examples move into review without a second app.",
  },
  {
    icon: AudioLines,
    title: "The same domain becomes speech",
    text: "Live practice reuses what the learner has been reading and saving.",
  },
];

const featureCards = [
  {
    icon: BookOpen,
    title: "Reader pane",
    text: "A calm article surface with level badges, selected text, and enough density to feel serious.",
    accent: "Read",
    chips: ["80/20 difficulty", "Interest feed", "Focused layout"],
  },
  {
    icon: Brain,
    title: "Atlas sidecar",
    text: "The tutor is contextual. It explains the highlighted passage instead of sending learners to a blank chat.",
    accent: "Tutor",
    chips: ["Grammar", "Meaning", "Ask follow-up"],
  },
  {
    icon: Repeat2,
    title: "Memory queue",
    text: "Saved language turns into review, examples, and speaking prep with almost no manual organization.",
    accent: "Review",
    chips: ["Vocabulary", "Notes", "Spaced recall"],
  },
  {
    icon: Radio,
    title: "Live studio",
    text: "Teachers extend the same domains into discussion, pronunciation, and confidence.",
    accent: "Speak",
    chips: ["Domains", "Teachers", "Practice"],
  },
];

const footerSocials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/kalyma.academy",
    icon: Instagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/kalyma-academy",
    icon: Linkedin,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@kalymaacademy",
    icon: Youtube,
  },
];

const floatingTransition: Transition = {
  type: "spring",
  damping: 28,
  stiffness: 280,
};

function LaptopMockup({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="rounded-[24px] border border-[#1a2b5e]/18 bg-[#101844] p-2 shadow-[0_28px_70px_rgba(26,43,94,0.22)]">
        <div className="flex h-7 items-center gap-1.5 rounded-t-[17px] bg-[#e9edf8] px-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#c9842f]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#8da0d5]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#1a2b5e]" />
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-b-[17px] bg-[#f7f2ea]">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 90vw, 42vw"
            className="object-cover"
          />
        </div>
      </div>
      <div className="mx-auto h-2 w-[78%] rounded-b-[999px] bg-[#101844]/24" />
    </div>
  );
}

function PhoneMockup({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="rounded-[22px] border border-[#1a2b5e]/18 bg-[#101844] p-1.5 shadow-[0_28px_70px_rgba(26,43,94,0.24)]">
        <div className="relative aspect-[390/844] overflow-hidden rounded-[16px] bg-[#f7f2ea]">
          <div className="absolute left-1/2 top-2 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-[#101844]" />
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 45vw, 16vw"
            className="object-cover"
          />
        </div>
      </div>
      <span className="absolute -right-1 top-24 h-12 w-1 rounded-full bg-[#101844]/45" />
    </div>
  );
}

function FloatingMockup({ screen }: { screen: (typeof heroScreens)[number] }) {
  const shouldReduceMotion = useReducedMotion();
  const Mockup = screen.type === "phone" ? PhoneMockup : LaptopMockup;

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: screen.delay, ease: "easeOut" }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              scale: 1.025,
              rotate: 0,
              transition: floatingTransition,
            }
      }
    >
      <Mockup src={screen.src} alt={screen.alt} className={screen.className} />
    </motion.div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#c9842f]">
      {children}
    </p>
  );
}

function ProductIcon({
  icon: Icon,
  dark = false,
}: {
  icon: IconComponent;
  dark?: boolean;
}) {
  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-[16px] border ${
        dark
          ? "border-white/16 bg-white/10 text-[#f3d27b]"
          : "border-[#1a2b5e]/12 bg-[#fffaf2] text-[#1a2b5e]"
      }`}
    >
      <Icon size={23} />
    </div>
  );
}

export default function LandingPage() {
  const shouldReduceMotion = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const words = [
    "intermediate level",
    "Fear of speaking",
    "Pattern",
    "Existing limits",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#f7f2ea] text-[#111735] selection:bg-[#c9842f] selection:text-white"
      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
    >
      <section className="relative min-h-[760px] overflow-hidden bg-[radial-gradient(circle_at_22%_16%,rgba(201,168,76,0.26),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(26,43,94,0.16),transparent_32%),linear-gradient(135deg,#fffaf2_0%,#f7f2ea_42%,#e9efff_100%)] lg:min-h-[820px]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.46] [background-image:radial-gradient(rgba(26,43,94,0.4)_1.25px,transparent_1.35px)] [background-size:28px_28px]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f7f2ea] to-transparent" />

        <nav className="relative z-30 mx-auto flex max-w-6xl items-center justify-between px-5 pb-1 pt-5 sm:px-8 sm:pb-1 sm:pt-6">
          <Link href="/" aria-label="Kalyma home" className="block">
            <Image
              src="/logo with word.webp"
              alt="kalyma"
              width={190}
              height={76}
              priority
              className="h-auto w-[132px] sm:w-[150px]"
            />
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <AddToHomeButton className="border-[#1a2b5e]/20 bg-white/70 text-[#1a2b5e]" />
            </div>
            <Link
              href="/auth"
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#1a2b5e]/16 bg-white/70 px-4 text-[13px] font-bold text-[#1a2b5e] shadow-[0_14px_34px_rgba(26,43,94,0.12)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#c9842f] hover:bg-[#1a2b5e] hover:text-white sm:min-h-11 sm:px-7 sm:text-sm"
            >
              Login
            </Link>
          </div>
        </nav>

        <div className="relative z-20 mx-auto flex min-h-[640px] max-w-6xl flex-col items-center justify-start px-5 pb-12 pt-12 text-center sm:px-8 sm:pt-0 lg:min-h-[680px] lg:pb-14">
          {!shouldReduceMotion && (
            <Floating sensitivity={-0.36} className="hidden lg:block">
              {heroScreens.map((screen) => (
                <FloatingElement
                  key={screen.src}
                  depth={screen.depth}
                  className={screen.className}
                >
                  <FloatingMockup screen={screen} />
                </FloatingElement>
              ))}
            </Floating>
          )}

          <div className="relative z-10 flex w-full max-w-[360px] flex-col items-center sm:max-w-[940px]">
            <h1 className="flex w-full max-w-[360px] flex-col items-center text-balance text-[2.6rem] font-semibold leading-[0.91] tracking-[-0.035em] text-[#111735] sm:max-w-5xl sm:text-center sm:text-[clamp(2.65rem,5.5vw,5.35rem)] sm:leading-[0.9]">
              <span>Break the </span>
              <span className="text-[#c9842f]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 15 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -15 }
                    }
                    transition={{ duration: 0.25 }}
                    className="inline-block"
                  >
                    {words[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            <p className="mt-6 max-w-[340px] text-balance text-lg font-semibold leading-7 text-[#33406f] sm:max-w-[34rem] sm:text-[1.35rem] sm:leading-8">
              Learn English with content made specifically for you
              <br></br>
              based on your interests and level.
            </p>

            <div className="mt-7 flex w-full max-w-[340px] flex-col items-center justify-center gap-3 sm:w-auto sm:max-w-none sm:flex-row">
              <Link
                href="/auth"
                className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1a2b5e] px-7 text-base font-bold text-white shadow-[0_20px_45px_rgba(26,43,94,0.22)] transition hover:-translate-y-0.5 hover:bg-[#101844] sm:w-auto"
              >
                Start learning
                <ArrowRight
                  size={19}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <a
                href="#learning-loop"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#1a2b5e]/14 bg-white/72 px-7 text-base font-bold text-[#1a2b5e] shadow-[0_14px_34px_rgba(26,43,94,0.10)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#c9842f] sm:w-auto"
              >
                See the loop
              </a>
            </div>
          </div>

          <div className="mt-12 w-full max-w-[340px] lg:hidden">
            <div className="relative mx-auto flex h-[260px] items-end justify-center">
              <LaptopMockup
                src="/landing/news-desktop.png"
                alt="Kalyma reader preview"
                className="w-[280px]"
              />
              <PhoneMockup
                src="/landing/reader-mobile.png"
                alt="Mobile Kalyma reader preview"
                className="absolute -bottom-4 -left-2 z-10 w-[100px] rotate-[8deg] shadow-2xl"
              />
            </div>
          </div>

          <div className="mt-7 grid w-full max-w-[340px] grid-cols-1 gap-3 rounded-[26px] border border-[#1a2b5e]/10 bg-white/70 p-3 text-left shadow-[0_20px_54px_rgba(26,43,94,0.12)] backdrop-blur-xl sm:mt-10 sm:max-w-[680px] sm:grid-cols-3">
            {[
              ["80%", "familiar enough to keep reading"],
              ["20%", "new vocab explained in context"],
              ["1 flow", "read, ask, save, review, speak"],
            ].map(([value, label]) => (
              <div
                key={value}
                className="rounded-[22px] border border-[#1a2b5e]/8 bg-[#fffaf2] px-5 py-4"
              >
                <p className="text-4xl font-semibold text-[#c9842f] sm:text-3xl">
                  {value}
                </p>
                <p className="mt-1 text-base font-semibold leading-snug text-[#33406f]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-20 bg-[#f7f2ea] px-5 py-14 text-[#101844] sm:px-8 sm:py-18">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <SectionLabel>Why Kalyma exists</SectionLabel>
            <h2 className="mt-4 max-w-xl text-[clamp(2rem,3.5vw,3.25rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
              A learner should not need four apps to finish one thought.
            </h2>
            <p className="mt-5 max-w-lg text-lg font-semibold leading-7 text-[#4a5568]">
              Kalyma keeps the article, tutor, notebook, review queue, and live
              practice in the same mental space.
            </p>
          </div>

          <div className="rounded-[30px] border border-[#101844]/10 bg-white/78 p-4 shadow-[0_24px_70px_rgba(16,24,68,0.09)] backdrop-blur-xl sm:p-6">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div className="grid gap-3">
                {[
                  [BookOpen, "Article app", "Read and lose the new words"],
                  [MessageSquareText, "AI chat", "Ask with no passage context"],
                  [Repeat2, "Flashcards", "Rebuild the memory system"],
                  [Radio, "Live class", "Practice a disconnected topic"],
                ].map(([Icon, title, text]) => {
                  const AppIcon = Icon as IconComponent;

                  return (
                    <div
                      key={title as string}
                      className="grid grid-cols-[44px_1fr] items-center gap-3 rounded-[18px] border border-[#101844]/9 bg-[#fffaf2] p-3"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white text-[#1a2b5e] shadow-sm">
                        <AppIcon size={20} />
                      </span>
                      <span>
                        <span className="block text-base font-semibold">
                          {title as string}
                        </span>
                        <span className="block text-sm font-semibold leading-5 text-[#4a5568]">
                          {text as string}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="hidden h-[2px] w-10 bg-[#c9842f] md:block" />

              <div className="relative overflow-hidden rounded-[24px] bg-[#101844] p-5 text-white">
                <div className="pointer-events-none absolute inset-0 opacity-[0.24] [background-image:radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1.2px)] [background-size:22px_22px]" />
                <div className="relative">
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#f3d27b]">
                    Kalyma
                  </p>
                  <p className="mt-3 text-3xl font-semibold leading-none">
                    One reading OS
                  </p>
                  <div className="mt-5 grid gap-2">
                    {["Read", "Explain", "Save", "Review", "Discuss"].map(
                      (item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-bold"
                        >
                          <span>{item}</span>
                          <ArrowRight size={15} className="text-[#f3d27b]" />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="learning-loop"
        className="relative z-20 bg-[#f7f2ea] px-5 pb-16 text-[#101844] sm:px-8 sm:pb-20"
      >
        <div className="mx-auto max-w-6xl rounded-[30px] border border-[#101844]/10 bg-[#fffdf8] p-5 shadow-[0_24px_70px_rgba(16,24,68,0.09)] sm:p-7">
          <div className="grid gap-7 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div>
              <SectionLabel>The Kalyma loop</SectionLabel>
              <h2 className="mt-4 text-[clamp(2rem,3.45vw,3.35rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
                One selected phrase becomes a full learning route.
              </h2>
              <p className="mt-5 max-w-lg text-lg font-semibold leading-7 text-[#4a5568]">
                The loop starts where learners actually hesitate: inside the
                text. From there, Kalyma turns confusion into explanation,
                memory, and practice.
              </p>

              <div className="mt-7 overflow-hidden rounded-[26px] bg-[#101844] p-5 text-white shadow-[0_22px_58px_rgba(16,24,68,0.18)]">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#f3d27b]">
                    Selected passage
                  </p>
                  <Highlighter size={20} className="text-[#c9842f]" />
                </div>
                <p className="mt-5 text-2xl font-semibold leading-snug">
                  “The treaty reshaped the balance of power across Europe.”
                </p>
                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  {["Explain nuance", "Save phrase", "Prepare review"].map(
                    (item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/12 bg-white/8 px-3 py-2 text-center text-sm font-bold text-white/78"
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="relative grid gap-3">
              <div className="pointer-events-none absolute left-[20px] top-8 hidden h-[calc(100%-64px)] w-px bg-[#1a2b5e]/14 sm:block" />
              {loopSteps.map(({ icon: Icon, title, text }, index) => (
                <motion.article
                  key={title}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className={`relative grid gap-4 rounded-[22px] border p-4 sm:grid-cols-[42px_1fr_auto] sm:items-center ${
                    index === loopSteps.length - 1
                      ? "border-[#101844]/10 bg-[#101844] text-white shadow-[0_18px_40px_rgba(16,24,68,0.16)]"
                      : "border-[#101844]/10 bg-[#f7f2ea]"
                  }`}
                >
                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border ${
                      index === loopSteps.length - 1
                        ? "border-white/14 bg-white/10 text-[#f3d27b]"
                        : "border-[#101844]/10 bg-white text-[#1a2b5e]"
                    }`}
                  >
                    <Icon size={19} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold leading-tight">
                      {title}
                    </h3>
                    <p
                      className={`mt-1 text-[15px] font-semibold leading-6 ${
                        index === loopSteps.length - 1
                          ? "text-white/72"
                          : "text-[#4a5568]"
                      }`}
                    >
                      {text}
                    </p>
                  </div>
                  <span className="hidden text-sm font-bold text-[#c9842f] sm:block">
                    0{index + 1}
                  </span>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 overflow-hidden bg-[#101844] px-5 py-16 text-white sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-20">
          <div className="relative mx-auto flex w-full max-w-xs items-center justify-center pt-4 sm:pt-8 lg:pt-0">
            <PhoneMockup
              src="/landing/reader-mobile.png"
              alt="Mobile Kalyma reader"
              className="w-[160px] rotate-[3deg] shadow-[0_24px_60px_rgba(0,0,0,0.4)] sm:w-[200px] lg:w-[240px]"
            />
          </div>

          <div>
            <SectionLabel>Personalization</SectionLabel>
            <h2 className="mt-4 text-[clamp(2.1rem,3.5vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
              The lesson adapts in context.
            </h2>
            <p className="mt-5 max-w-xl text-lg font-semibold leading-7 text-white/72">
              The moment a learner selects a word or passage, Kalyma keeps the
              context, explains it simply, and lets them save it for later
              practice.
            </p>

            <div className="mt-8 rounded-[26px] border border-white/12 bg-white/8 p-5">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <CircleDot size={20} className="text-[#c9842f]" />
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f3d27b]">
                  Select text
                </p>
              </div>
              <div className="grid gap-4 py-5 sm:grid-cols-3">
                {["Explain", "Save", "Review"].map((item, index) => (
                  <div key={item}>
                    <p className="text-3xl font-semibold text-white">
                      0{index + 1}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white/72">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
              <p className="border-t border-white/10 pt-4 text-base font-semibold leading-6 text-white/62">
                One interaction turns a confusing passage into an explanation, a
                saved memory, and future practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 overflow-hidden bg-[linear-gradient(180deg,#fffaf2_0%,#f7f2ea_100%)] px-5 py-16 text-[#101844] sm:px-8 sm:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-[0.36] [background-image:radial-gradient(rgba(26,43,94,0.34)_1.15px,transparent_1.25px)] [background-size:28px_28px]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <SectionLabel>Core features</SectionLabel>
            <h2 className="mt-4 text-[clamp(2rem,3.6vw,3.5rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
              The product feels like one workspace, not a feature list.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featureCards.map(
              ({ icon: Icon, title, text, accent, chips }, index) => (
                <motion.article
                  key={title}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-[28px] border border-[#101844]/10 bg-white/78 p-5 shadow-[0_20px_54px_rgba(16,24,68,0.08)] backdrop-blur-xl"
                >
                  <span className="absolute -right-8 -top-8 text-[7.5rem] font-semibold leading-none text-[#1a2b5e]/[0.04] transition group-hover:text-[#c9842f]/10">
                    {accent}
                  </span>
                  <div className="relative flex items-start justify-between gap-4">
                    <ProductIcon icon={Icon} />
                    <span className="rounded-full bg-[#fbf5e8] px-3 py-1 text-sm font-bold text-[#c9842f]">
                      {accent}
                    </span>
                  </div>
                  <h3 className="relative mt-8 text-3xl font-semibold leading-tight">
                    {title}
                  </h3>
                  <p className="relative mt-3 text-base font-semibold leading-7 text-[#4a5568]">
                    {text}
                  </p>
                  <div className="relative mt-auto flex flex-wrap gap-2 pt-6">
                    {chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-[#101844]/10 bg-[#fffaf2] px-3 py-1.5 text-sm font-bold text-[#33406f]"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </motion.article>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="relative z-20 bg-[#101844] px-5 py-16 text-white sm:px-8 sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[32px] border border-white/14 bg-white/8 p-7 shadow-[0_30px_90px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-10 lg:flex-row lg:items-center">
          <div>
            <SectionLabel>Start now</SectionLabel>
            <h2 className="mt-3 max-w-3xl text-[clamp(2.1rem,4vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
              Start with something worth reading. Keep what matters. Speak with
              more confidence.
            </h2>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col">
            <Link
              href="/auth"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#c9842f] px-8 text-base font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#d8a350]"
            >
              Create account
              <ArrowRight
                size={19}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <AddToHomeButton variant="dark" className="min-h-12" />
          </div>
        </div>
      </section>

      <footer className="relative z-20 overflow-hidden bg-[#070b22] px-5 py-12 text-white sm:px-8">
        <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:radial-gradient(rgba(255,255,255,0.32)_1px,transparent_1.2px)] [background-size:30px_30px]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Image
              src="/logo with word.webp"
              alt="kalyma"
              width={190}
              height={76}
              className="h-auto w-[165px]"
            />
            <p className="mt-6 max-w-xl text-3xl font-semibold leading-tight text-white">
              Kalyma helps learners turn real reading into vocabulary, memory,
              and conversation.
            </p>
            <a
              href="mailto:contact@kalyma.academy"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/8 px-5 py-3 text-base font-bold text-white transition hover:border-[#c9842f] hover:text-[#f3d27b]"
            >
              <Mail size={18} />
              contact@kalyma.academy
            </a>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-[#c9842f]">
                Social
              </h3>
              <div className="mt-4 grid gap-3">
                {footerSocials.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 text-lg font-semibold text-white/76 transition hover:text-white"
                  >
                    <Icon size={19} />
                    {label}
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-[#c9842f]">
                Platform
              </h3>
              <div className="mt-4 grid gap-3">
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-3 text-lg font-semibold text-white/76 transition hover:text-white"
                >
                  <ShieldCheck size={19} />
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="inline-flex items-center gap-3 text-lg font-semibold text-white/76 transition hover:text-white"
                >
                  <FileText size={19} />
                  Terms and Conditions
                </Link>
                <a
                  href="mailto:contact@kalyma.academy"
                  className="inline-flex items-center gap-3 text-lg font-semibold text-white/76 transition hover:text-white"
                >
                  <Mail size={19} />
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-10 flex max-w-7xl flex-col justify-between gap-3 border-t border-white/12 pt-6 text-sm font-semibold text-white/52 sm:flex-row">
          <p>&copy; 2026 Kalyma. Speak with confidence.</p>
          <p>
            Personalized reading, Atlas AI, spaced repetition, live practice.
          </p>
        </div>
      </footer>
    </main>
  );
}
