"use client";

import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Bot,
  ChevronRight,
  CheckCircle2,
  CircleUserRound,
  MessageSquare,
  Newspaper,
  Radio,
  Repeat2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { useEffect, useState } from "react";

type XpHistoryEntry = {
  reason: string;
  created_at: string;
};

type HomeCardProps = {
  title: string;
  subtitle: string;
  href: string;
  icon: React.ElementType;
  tone: "atlas" | "purple" | "orange" | "green" | "blue";
  active?: boolean;
};

const toneMap = {
  atlas: {
    bg: "#ffffff",
    iconBg: "#ffffff",
    icon: "#111111",
    border: "#1f1b17",
  },
  purple: {
    bg: "#f3edff",
    iconBg: "#f6f0ff",
    icon: "#7c3cff",
    border: "#1f1b17",
  },
  orange: {
    bg: "#fff2eb",
    iconBg: "#fff3ed",
    icon: "#df4b14",
    border: "#1f1b17",
  },
  green: {
    bg: "#ebfff3",
    iconBg: "#effff7",
    icon: "#119a53",
    border: "#1f1b17",
  },
  blue: {
    bg: "#eefaff",
    iconBg: "#effbff",
    icon: "#0b7bb2",
    border: "#1f1b17",
  },
};

function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between px-1">
      <h2
        className="text-[18px] font-semibold leading-tight text-[#162056] sm:text-[24px]"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {title}
      </h2>
      {action}
    </div>
  );
}

function ProgressRing({ percent }: { percent: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex h-[68px] w-[68px] shrink-0 items-center justify-center sm:h-20 sm:w-20">
      <svg className="h-full w-full -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke="#f0ebe4"
          strokeWidth="5"
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke="#c9842f"
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-[#162056] sm:text-xs">
        {percent}%
      </span>
    </div>
  );
}

function HomeCard({
  title,
  subtitle,
  href,
  icon: Icon,
  tone,
  active,
}: HomeCardProps) {
  const router = useRouter();
  const colors = toneMap[tone];

  return (
    <motion.button
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(href)}
      className="flex min-h-[134px] flex-col items-start rounded-[14px] bg-white p-4 text-left shadow-sm transition-all sm:min-h-[170px] sm:rounded-[18px] sm:p-6"
      style={{
        border: active
          ? "1.5px solid #9fa8bf"
          : "1px solid rgba(230,217,201,0.7)",
        boxShadow: active
          ? "0 2px 0 rgba(22,32,86,0.16)"
          : "0 1px 0 rgba(22,32,86,0.02)",
      }}
    >
      <div
        className="mb-auto flex h-12 w-12 items-center justify-center rounded-full border-2 sm:h-16 sm:w-16"
        style={{
          background: colors.iconBg,
          borderColor: colors.border,
          color: colors.icon,
        }}
      >
        {tone === "atlas" ? (
          <Image
            src="/atlas-logo.png"
            alt=""
            width={42}
            height={42}
            className="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12"
          />
        ) : (
          <Icon size={22} strokeWidth={2.1} />
        )}
      </div>
      <h3
        className="mt-7 text-[13px] font-semibold leading-tight text-[#171225] sm:text-[18px]"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {title}
      </h3>
      <p className="mt-1 text-[11px] font-medium leading-snug text-[#667084] sm:text-[15px]">
        {subtitle}
      </p>
    </motion.button>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { user, session } = useAuth();
  const [xpHistory, setXpHistory] = useState<XpHistoryEntry[]>([]);

  useEffect(() => {
    if (!session) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/gamification/me/xp-history`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setXpHistory(data);
      })
      .catch((err) => console.error(err));
  }, [session]);

  const firstName = user?.full_name ? user.full_name.split(" ")[0] : "Learner";

  const isToday = (dateString: string) => {
    if (!dateString) return false;
    const d = new Date(dateString);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const isThisWeek = (dateString: string) => {
    if (!dateString) return false;
    const d = new Date(dateString);
    const now = new Date();
    return now.getTime() - d.getTime() <= 7 * 24 * 60 * 60 * 1000;
  };

  const articleReadsThisWeek = xpHistory.filter(
    (h) => h.reason === "article_completed" && isThisWeek(h.created_at),
  ).length;
  const targetFreq = user?.preferences?.article_frequency || 2;
  const progressPercent = Math.min(
    100,
    Math.round((articleReadsThisWeek / Math.max(targetFreq, 1)) * 100),
  );

  const hasArticleToday = xpHistory.some(
    (h) => h.reason === "article_completed" && isToday(h.created_at),
  );
  const hasReviewToday = xpHistory.some(
    (h) => h.reason === "review_session" && isToday(h.created_at),
  );
  const hasNewsToday = xpHistory.some(
    (h) => h.reason === "news_read" && isToday(h.created_at),
  );

  const feedItems = [
    {
      icon: BookOpen,
      label: "Read an Article",
      xp: 10,
      done: hasArticleToday,
      href: "/articles",
    },
    {
      icon: MessageSquare,
      label: "Review Session",
      xp: 10,
      done: hasReviewToday,
      href: "/practice",
    },
    {
      icon: Newspaper,
      label: "Read News",
      xp: 10,
      done: hasNewsToday,
      href: "/news",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4fb] pb-[112px] text-[#162056] md:pb-14">
      <div className="mx-auto w-full max-w-[1080px] px-6 pt-5 sm:px-8 md:pt-10">
        <header className="relative mb-6 flex min-h-[84px] items-center justify-center md:mb-8 md:hidden">
          <button
            onClick={() => router.push("/profile")}
            aria-label="Open profile settings"
            className="absolute right-0 top-3 flex h-9 w-9 items-center justify-center rounded-full border bg-white text-[#667084] shadow-sm transition-colors hover:border-black hover:text-black sm:h-11 sm:w-11"
            style={{ borderColor: "#e6d9c9" }}
          >
            <CircleUserRound size={20} />
          </button>
        </header>

        <section className="mb-7 text-center md:mb-9">
          <h1
            className="text-[26px] font-semibold leading-tight sm:text-[38px]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Hello, {firstName}
          </h1>
          <p className="mt-3 text-[14px] font-medium text-[#667084] sm:text-[18px]">
            Ready to speak with confidence?
          </p>
        </section>

        <section className="mb-8 rounded-[14px] bg-white p-4 shadow-sm sm:mb-10 sm:rounded-[22px] sm:p-7">
          <div className="grid gap-5 md:grid-cols-[1fr_2fr] md:items-center">
            <div className="flex items-center gap-4">
              <ProgressRing percent={progressPercent} />
              <div>
                <h2 className="text-[14px] font-extrabold text-[#162056] sm:text-xl">
                  Today&apos;s progress
                </h2>
                <p className="mt-1 text-[12px] font-semibold text-[#667084] sm:text-base">
                  {feedItems.filter((item) => item.done).length} of{" "}
                  {feedItems.length} tasks -{" "}
                  <span className="text-[#c9842f]">30 XP</span>
                </p>
              </div>
            </div>

            <div className="rounded-[16px] bg-white sm:px-2">
              <div className="mb-3 flex items-center gap-2">
                <Award size={16} className="text-[#c9842f]" />
                <h2 className="text-[13px] font-extrabold text-[#162056] sm:text-base">
                  Today&apos;s Feed
                </h2>
              </div>

              <div className="space-y-3">
                {feedItems.map(({ icon: Icon, label, xp, done, href }) => (
                  <button
                    key={label}
                    onClick={() => router.push(href)}
                    className="flex w-full items-center gap-3 rounded-2xl text-left transition-colors hover:bg-[#f3f4fb]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] bg-[#eefaff] text-[#162056]">
                      <Icon size={18} strokeWidth={2} />
                    </span>
                    <span className="flex-1 text-[12px] font-semibold text-[#162056] sm:text-[14px]">
                      {label}
                    </span>
                    {done ? (
                      <CheckCircle2 size={18} className="text-[#10b981]" />
                    ) : (
                      <span className="rounded-full bg-[#f7f8fb] px-3 py-1.5 text-[10px] font-extrabold text-[#8b94a7]">
                        + {xp} XP
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push("/practice")}
            className="mt-5 w-full rounded-full bg-[#202b67] py-3 text-[13px] font-extrabold text-white transition-all hover:bg-[#121a46] sm:mt-7 sm:py-4 sm:text-base"
          >
            Start quiz
          </button>
        </section>

        <section className="mb-8 sm:mb-12">
          <SectionHeader title="Practice" />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            <HomeCard
              title="Atlas AI"
              subtitle="Chat with your AI coach"
              href="/chat"
              icon={Bot}
              tone="atlas"
            />
            <HomeCard
              title="Review Session"
              subtitle="Practice saved words"
              href="/practice"
              icon={Repeat2}
              tone="purple"
            />
          </div>
        </section>

        <section>
          <SectionHeader
            title="Learn"
            action={
              <button
                onClick={() => router.push("/profile/notifications")}
                className="flex items-center gap-1 text-[12px] font-semibold text-[#667084] transition-colors hover:text-black sm:text-sm"
              >
                My notes <ChevronRight size={15} />
              </button>
            }
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            <HomeCard
              title="Articles"
              subtitle="Read level-matched articles"
              href="/articles"
              icon={BookOpen}
              tone="green"
            />
            <HomeCard
              title="News"
              subtitle="Learn from current events"
              href="/news"
              icon={Newspaper}
              tone="blue"
              active
            />
            <HomeCard
              title="Live Session"
              subtitle="Practice with real speakers"
              href="/live"
              icon={Radio}
              tone="orange"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
