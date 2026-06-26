"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { UserAvatar } from "@/components/UserAvatar";
import Image from "next/image";
import {
  BookOpen,
  ChevronRight,
  Flame,
  Radio,
  Newspaper,
  Repeat2,
  Trophy,
} from "lucide-react";

type XpHistoryEntry = {
  reason: string;
  amount: number;
  created_at: string;
};

const SectionHeader = ({
  title,
  onView,
  viewLabel = "View all",
}: {
  title: string;
  onView?: () => void;
  viewLabel?: string;
}) => (
  <div className="flex items-center justify-between px-1">
    <h2
      className="text-[18px] font-semibold text-[#1a2b5e] tracking-tight"
      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
    >
      {title}
    </h2>
    {onView && (
      <button
        onClick={onView}
        className="cursor-pointer text-[13px] text-[#667084] hover:text-[#1a2b5e] inline-flex items-center gap-0.5 transition-colors active:scale-[0.98]"
      >
        {viewLabel} <ChevronRight className="h-3.5 w-3.5" />
      </button>
    )}
  </div>
);

const FeedRow = ({
  done = false,
  icon,
  label,
  xp,
  onClick,
}: {
  done?: boolean;
  icon: React.ReactNode;
  label: string;
  xp: number;
  onClick?: () => void;
}) => (
  <li>
    <button
      onClick={onClick}
      className="cursor-pointer w-full flex items-center justify-between py-1.5 px-1 hover:bg-[#eef2fc]/40 rounded-lg transition-colors active:scale-[0.98]"
    >
      <span className="flex items-center gap-2.5 min-w-0">
        <span
          className={`h-5 w-5 rounded-full grid place-items-center shrink-0 ${
            done
              ? "bg-[#10b981]/15 text-[#10b981]"
              : "bg-[#eef2fc] text-[#667084]"
          }`}
        >
          {icon}
        </span>
        <span
          className={`text-[12px] truncate ${done ? "text-[#667084] line-through" : "text-[#1a2b5e]"}`}
        >
          {label}
        </span>
      </span>
      <span className="text-[11px] font-semibold text-[#c9842f] shrink-0">
        +{xp} XP
      </span>
    </button>
  </li>
);

const SimpleCard = ({
  icon,
  title,
  subtitle,
  onClick,
  iconColor,
  isAtlas,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick?: () => void;
  iconColor?: string;
  isAtlas?: boolean;
}) => (
  <button
    onClick={onClick}
    className="text-left cursor-pointer rounded-[20px] bg-white border-2 border-[rgba(26,43,94,0.08)] p-4 min-h-[140px] flex flex-col justify-between hover:border-[#aeb5c9] active:scale-[0.98] transition-all duration-200"
    style={{ boxShadow: "0 2px 12px rgba(26, 43, 94, 0.02)" }}
  >
    <div
      className="h-11 w-11 rounded-full grid place-items-center overflow-hidden shrink-0"
      style={{
        border: isAtlas ? "none" : `1.5px solid #111827`,
        backgroundColor: iconColor ? `${iconColor}1A` : "transparent",
      }}
    >
      {icon}
    </div>
    <div className="mt-2">
      <h3 className="font-bold text-[14px] leading-tight text-[#1a2b5e]">
        {title}
      </h3>
      <p className="mt-1 text-[12px] text-[#667084] leading-snug">{subtitle}</p>
    </div>
  </button>
);

const StreakIndicator = ({ count }: { count: number }) => (
  <div
    className="flex h-6 items-center gap-1 rounded-full px-1.5 text-[#c9842f]"
    aria-label={`${count} day streak`}
  >
    <Flame className="h-[15px] w-[15px] animate-bounce" fill="currentColor" />
    <span className="text-[12px] font-bold tabular-nums text-[#1a2b5e]">
      {count}
    </span>
  </div>
);

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

  const displayName = user?.full_name?.trim() || "Kalyma Learner";
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



  const hasArticleToday = xpHistory.some(
    (h) => h.reason === "article_completed" && isToday(h.created_at),
  );
  const hasReviewToday = xpHistory.some(
    (h) => h.reason === "review_session" && isToday(h.created_at),
  );
  const hasNewsToday = xpHistory.some(
    (h) => h.reason === "news_read" && isToday(h.created_at),
  );

  const TASKS = [
    {
      id: "article",
      label: "Read an Article",
      icon: <BookOpen className="h-3 w-3" />,
      xp: 30,
      route: "/articles",
      done: hasArticleToday,
    },
    {
      id: "speak",
      label: "Review Session",
      icon: <Repeat2 className="h-3 w-3" />,
      xp: 15,
      route: "/practice",
      done: hasReviewToday,
    },
    {
      id: "news",
      label: "Read News",
      icon: <Newspaper className="h-3 w-3" />,
      xp: 10,
      route: "/news",
      done: hasNewsToday,
    },
  ];

  const doneCount = TASKS.filter((t) => t.done).length;
  const progressPercent = Math.round((doneCount / TASKS.length) * 100);

  const xpEarnedToday = xpHistory
    .filter((h) => isToday(h.created_at))
    .reduce((total, h) => total + h.amount, 0);

  const streakCount = user?.streak_count || 0;

  return (
    <div className="min-h-screen bg-[#f7f2ea] pb-28 md:pb-10">
      <header className="px-5 pt-6 pb-2 flex items-center justify-between max-w-md md:max-w-5xl mx-auto">
        <button
          onClick={() => router.push("/leaderboard")}
          aria-label="Leaderboard"
          className="cursor-pointer w-10 h-10 rounded-full flex items-center justify-center text-[#667084] hover:text-[#1a2b5e] active:bg-[#eef2fc] transition-colors md:hidden"
        >
          <Trophy className="h-[18px] w-[18px]" />
        </button>
        <Image
          src="/logo with word.webp"
          alt="kalyma"
          width={426}
          height={167}
          className="h-24 w-auto md:hidden"
          priority
        />
        <button
          onClick={() => router.push("/profile")}
          aria-label="Profile settings"
          className="cursor-pointer rounded-full transition-transform active:scale-[0.98] md:hidden"
        >
          <UserAvatar
            avatarUrl={user?.avatar_url}
            name={displayName}
            size={36}
            className="ring-2 ring-white"
          />
        </button>
        <div className="hidden md:block" />
      </header>

      <main className="max-w-md md:max-w-5xl mx-auto px-5 space-y-8">
        <section className="pt-3 animate-fade-in text-center">
          <h1
            className="text-[28px] leading-tight text-[#1a2b5e] tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Hello, <span className="font-semibold">{firstName}</span>
          </h1>
          <p className="mt-1.5 text-[15px] text-[#667084]">
            Ready to speak with confidence?
          </p>
        </section>

        <section className="rounded-2xl bg-white border border-[rgba(26,43,94,0.08)] p-3.5 animate-fade-in">
          <div className="flex items-center gap-3.5">
            <div className="relative h-14 w-14 shrink-0">
              <div
                className="absolute inset-0 rounded-full transition-all duration-700"
                style={{
                  background: `conic-gradient(#c9842f 0% ${progressPercent}%, #eef2fc ${progressPercent}% 100%)`,
                }}
              />
              <div className="absolute inset-[4px] rounded-full bg-white flex items-center justify-center">
                <span
                  className="text-sm font-semibold tracking-tight text-[#1a2b5e]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {progressPercent}
                  <span className="text-[9px] text-[#667084]">%</span>
                </span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[13px] font-semibold text-[#1a2b5e]">
                  Today&apos;s progress
                </p>
                <StreakIndicator count={streakCount} />
              </div>
              <p className="mt-0.5 text-[11px] text-[#667084]">
                {doneCount} of {TASKS.length} tasks ·{" "}
                <span className="text-[#c9842f] font-semibold">{xpEarnedToday} XP earned</span>
              </p>
            </div>
          </div>

          <ul className="mt-3 space-y-0.5">
            {TASKS.map((t) => (
              <FeedRow
                key={t.id}
                done={t.done}
                icon={t.icon}
                label={t.label}
                xp={t.xp}
                onClick={() => router.push(t.route)}
              />
            ))}
          </ul>

          <button
            onClick={() => router.push("/practice")}
            className="cursor-pointer mt-3.5 w-full h-9 rounded-full bg-[#1a2b5e] text-white text-[13px] font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#2d4080] hover:shadow-md hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200"
          >
            Start quiz
          </button>
        </section>

        <section className="animate-fade-in">
          <SectionHeader title="Practice" />
          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
            <SimpleCard
              onClick={() => router.push("/chat")}
              icon={
                <Image
                  src="/atlas-logo.png"
                  alt=""
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              }
              isAtlas
              title="Atlas AI"
              subtitle="Chat with your AI coach"
            />
            <SimpleCard
              onClick={() => router.push("/practice")}
              icon={
                <Repeat2 className="h-5 w-5" style={{ color: "#7C3AED" }} />
              }
              iconColor="#7C3AED"
              title="Review Session"
              subtitle="Practice saved words and Learn My notes"
            />
            <SimpleCard
              onClick={() => router.push("/live")}
              icon={<Radio className="h-5 w-5" style={{ color: "#C2410C" }} />}
              iconColor="#C2410C"
              title="Live Session"
              subtitle="Practice with real speakers"
            />
          </div>
        </section>

        <section className="animate-fade-in">
          <SectionHeader title="Learn" />
          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
            <SimpleCard
              onClick={() => router.push("/articles")}
              icon={
                <BookOpen className="h-5 w-5" style={{ color: "#15803D" }} />
              }
              iconColor="#15803D"
              title="Articles"
              subtitle="Read level-matched articles"
            />
            <SimpleCard
              onClick={() => router.push("/news")}
              icon={
                <Newspaper className="h-5 w-5" style={{ color: "#0369A1" }} />
              }
              iconColor="#0369A1"
              title="News"
              subtitle="Learn from current events"
            />
          </div>
        </section>

        <p
          className="text-center text-[15px] text-[#667084] pt-2 pb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Speak. Make mistakes.{" "}
          <span className="italic text-[#c9842f] font-semibold">Grow.</span>
        </p>
      </main>
    </div>
  );
}
