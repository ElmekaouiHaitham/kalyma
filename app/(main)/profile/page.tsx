"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  Book,
  BookMarked,
  BookOpen,
  Check,
  ChevronRight,
  CreditCard,
  Edit3,
  Flame,
  Loader2,
  LogOut,
  MessageSquare,
  Radio,
  Settings,
  Users,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/providers";
import { UserAvatar } from "@/components/UserAvatar";
import { DAILY_GOALS, PROFICIENCY_LEVELS } from "@/lib/data";

const PLAN_FEATURES = [
  "Unlimited AI conversations",
  "Access to all articles & books",
  "Live session replays",
  "Advanced vocabulary tracking",
  "Priority support",
];

const ACHIEVEMENT_MAP: Record<
  string,
  { title: string; icon: React.ElementType; color: string }
> = {
  first_article: { title: "First read", icon: BookOpen, color: "#008ed0" },
  week_streak: { title: "7-day streak", icon: Flame, color: "#f2bd35" },
  month_streak: { title: "30-day streak", icon: Zap, color: "#f2bd35" },
  word_saver: { title: "Word collector", icon: BookMarked, color: "#41329c" },
  bookworm: { title: "Bookworm", icon: Book, color: "#41329c" },
  session_goer: { title: "Live learner", icon: Radio, color: "#ef6c22" },
  reviewer: { title: "Consistent reviewer", icon: MessageSquare, color: "#10b981" },
  community_voice: { title: "Community voice", icon: Users, color: "#7c3aed" },
};

const LEGACY_ACHIEVEMENT_AMOUNT_SLUGS: Record<number, string> = {
  50: "first_article",
  60: "community_voice",
  75: "word_saver",
  100: "session_goer",
  150: "reviewer",
  200: "bookworm",
  500: "month_streak",
};

const diffLabelMap: Record<string, string> = {
  beginner: "A1/A2 - Beginner",
  intermediate: "B1 - Intermediate",
  upper_intermediate: "B2 - Upper-Int",
  advanced: "C1/C2 - Advanced",
};

type XpHistoryEntry = {
  amount?: number;
  reason?: string;
  event_metadata?: {
    achievement_slug?: string;
    achievement_name?: string;
  } | null;
};

const cardMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, session } = useAuth();

  const [xpHistory, setXpHistory] = useState<XpHistoryEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedPace, setSelectedPace] = useState<string | null>(null);
  const [articleFrequency, setArticleFrequency] = useState<number>(2);
  const [isEditingName, setIsEditingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!session) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/gamification/me/xp-history`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setXpHistory(data);
      })
      .catch(console.error);
  }, [session]);

  useEffect(() => {
    if (!user) return;

    setFullName(user.full_name || "");
    const pref = user.preferences;
    if (!pref) return;

    const diffToCode: Record<string, string> = {
      beginner: "A1",
      intermediate: "B1",
      upper_intermediate: "B2",
      advanced: "C1",
    };
    setSelectedLevel(pref.difficulty_pref ? diffToCode[pref.difficulty_pref] || "B1" : "B1");

    const pace = DAILY_GOALS.find((goal) => goal.minutes === pref.reading_pace);
    setSelectedPace(pace ? pace.label : "Regular");
    setArticleFrequency(pref.article_frequency || 2);
  }, [user]);

  const handleSavePreferences = async () => {
    if (!session) return;
    setIsSubmitting(true);

    try {
      const difficultyMap: Record<string, string> = {
        A1: "beginner",
        A2: "beginner",
        B1: "intermediate",
        B2: "upper_intermediate",
        C1: "advanced",
        C2: "advanced",
      };
      const payload = {
        full_name: fullName.trim(),
        difficulty_pref: selectedLevel ? difficultyMap[selectedLevel] : "intermediate",
        reading_pace: selectedPace
          ? DAILY_GOALS.find((goal) => goal.label === selectedPace)?.minutes || 10
          : 10,
        article_frequency: articleFrequency,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const achievements = xpHistory.filter((entry) => entry.reason === "achievement_earned");

  const totalXp = user?.xp || 0;

  const currentLevel = selectedLevel || "B1";
  const currentLevelLabel = user?.preferences?.difficulty_pref
    ? diffLabelMap[user.preferences.difficulty_pref]
    : currentLevel;
  const xpInLevel = Math.max(0, totalXp % 100);
  const xpPercent = Math.min(100, xpInLevel);
  const displayName = fullName.trim() || user?.full_name || "Atlas Learner";
  const stats = [
    { icon: Zap, label: "Total XP", value: totalXp, color: "#f2bd35" },
    { icon: Flame, label: "Day streak", value: user?.streak_count || 0, color: "#f2bd35" },
  ];

  return (
    <div className="min-h-full bg-[#f7f2ea] px-5 pb-28 pt-4 text-[#17172f] md:px-8 md:pb-12 md:pt-8">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 text-[18px] font-medium text-[#6d6d80] transition-colors hover:text-[#17172f] md:text-base"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="grid gap-5 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <div className="space-y-5">
            <motion.section
              {...cardMotion}
              className="rounded-[26px] border bg-white px-5 py-6 text-center shadow-[0_3px_14px_rgba(31,27,23,0.08)] md:px-8 md:py-7"
              style={{ borderColor: "#e6d9c9" }}
            >
              <UserAvatar
                avatarUrl={user?.avatar_url}
                name={displayName}
                className="mx-auto mb-5 h-[104px] w-[104px] shadow-[0_10px_24px_rgba(23,23,47,0.16)] ring-8 ring-white md:h-[128px] md:w-[128px]"
                textClassName="text-[38px] md:text-[46px]"
              />

              <div className="flex items-center justify-center gap-2">
                {isEditingName ? (
                  <div className="flex w-full max-w-[320px] items-center gap-2">
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") handleSavePreferences();
                        if (event.key === "Escape") setIsEditingName(false);
                      }}
                      className="min-w-0 flex-1 rounded-full border bg-[#fbf7f1] px-4 py-2 text-center text-[18px] font-semibold text-[#17172f] outline-none transition-colors focus:border-[#aeb5c9]"
                      style={{ borderColor: "#e6d9c9" }}
                    />
                    <button
                      onClick={handleSavePreferences}
                      disabled={isSubmitting || !fullName.trim()}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#202b67] text-white transition-colors hover:bg-[#121a46] disabled:cursor-wait disabled:opacity-60"
                      aria-label="Save profile name"
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    </button>
                  </div>
                ) : (
                  <>
                    <h1
                      className="max-w-[230px] text-[28px] font-bold leading-tight md:max-w-none md:text-[34px]"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {displayName}
                    </h1>
                    <button
                      onClick={() => {
                        setIsEditingName(true);
                        window.requestAnimationFrame(() => nameInputRef.current?.focus());
                      }}
                      aria-label="Edit profile name"
                      className="rounded-full p-2 text-[#6d6d80] transition-colors hover:bg-[#f4efe7] hover:text-[#17172f]"
                    >
                      <Edit3 className="h-5 w-5 md:h-6 md:w-6" />
                    </button>
                  </>
                )}
              </div>
              <p className="mt-2 text-[16px] font-medium text-[#6d6d80] md:text-[18px]">
                {user?.email || "loading..."}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                <span className="rounded-full bg-[#ece7fb] px-4 py-2 text-[14px] font-bold text-[#41329c]">
                  {currentLevelLabel}
                </span>
                <span className="rounded-full bg-[#fbf5e8] px-4 py-2 text-[14px] font-bold text-[#f2bd35]">
                  {totalXp} XP
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#fbf5e8] px-4 py-2 text-[14px] font-bold text-[#c9842f]">
                  <Flame className="h-4 w-4" /> {user?.streak_count || 0}
                </span>
              </div>

              <div className="mt-6 text-left">
                <div className="mb-2.5 flex items-center justify-between text-[15px] font-medium text-[#6d6d80] md:text-base">
                  <span>{currentLevel}</span>
                  <span>{xpInLevel} / 100 XP</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[#f0ebe4]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#41329c] via-[#c9842f] to-[#f2bd35]"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
            </motion.section>

            <section className="grid grid-cols-2 gap-4">
              {stats.map(({ icon: Icon, label, value, color }, index) => (
                <motion.article
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="min-h-[124px] rounded-[20px] border bg-white p-5 shadow-[0_3px_14px_rgba(31,27,23,0.08)] transition-all hover:border-[#aeb5c9] hover:bg-[#fbf7f1]"
                  style={{ borderColor: "#e6d9c9" }}
                >
                  <Icon size={26} color={color} strokeWidth={2.2} />
                  <div
                    className="mt-5 text-[32px] font-bold leading-none"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {value}
                  </div>
                  <p className="mt-2 text-[15px] font-medium text-[#6d6d80]">{label}</p>
                </motion.article>
              ))}
            </section>
          </div>

          <div className="space-y-5">
            <motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[24px] border bg-white p-5 shadow-[0_3px_14px_rgba(31,27,23,0.08)]"
              style={{ borderColor: "#e6d9c9" }}
            >
              <div className="mb-5 flex items-center justify-between">
                <h2
                  className="text-[22px] font-semibold"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Badges
                </h2>
                <Award className="text-[#c9842f]" size={25} />
              </div>
              {achievements.length === 0 ? (
                <p className="rounded-[18px] bg-[#f7f2ea] px-5 py-5 text-center text-sm font-semibold text-[#6d6d80]">
                  Complete activities to earn badges!
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {achievements.map((achievement, index) => {
                    const amount = Number(achievement.amount) || 0;
                    const slug =
                      achievement.event_metadata?.achievement_slug ||
                      LEGACY_ACHIEVEMENT_AMOUNT_SLUGS[amount];
                    const badge = ACHIEVEMENT_MAP[slug] || {
                      title: achievement.event_metadata?.achievement_name || "Secret Badge",
                      icon: Award,
                      color: "#41329c",
                    };
                    const Icon = badge.icon;
                    return (
                      <div
                        key={`${achievement.amount}-${index}`}
                        className="rounded-[18px] border bg-[#fbf7f1] p-4 text-center"
                        style={{ borderColor: `${badge.color}30` }}
                      >
                        <Icon className="mx-auto" size={28} color={badge.color} />
                        <p className="mt-2 text-xs font-bold text-[#6d6d80]">{badge.title}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="rounded-[24px] border bg-white p-5 shadow-[0_3px_14px_rgba(31,27,23,0.08)]"
              style={{ borderColor: "#e6d9c9" }}
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard size={22} className="text-[#c9842f]" />
                  <h2
                    className="text-[22px] font-semibold"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Your Plan
                  </h2>
                </div>
                <span className="rounded-full bg-[#fbf5e8] px-4 py-2 text-xs font-extrabold text-[#c9842f]">
                  FREE
                </span>
              </div>
              <div className="space-y-3">
                {PLAN_FEATURES.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm font-semibold text-[#6d6d80]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fbf5e8] text-[#c9842f]">
                      <Check size={14} />
                    </span>
                    {feature}
                  </div>
                ))}
              </div>
              <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#202b67] px-5 py-4 text-sm font-extrabold text-white transition-colors hover:bg-[#121a46]">
                Upgrade to Premium
                <ChevronRight size={18} />
              </button>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="rounded-[24px] border bg-white p-5 shadow-[0_3px_14px_rgba(31,27,23,0.08)]"
              style={{ borderColor: "#e6d9c9" }}
            >
              <div className="mb-6 flex items-center gap-2">
                <Settings size={22} className="text-[#6d6d80]" />
                <h2
                  className="text-[22px] font-semibold"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Preferences
                </h2>
              </div>

              <div className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-[#6d6d80]">
                    Full Name
                  </span>
                  <input
                    id="profile-name"
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full rounded-[18px] border bg-[#fbf7f1] px-4 py-3 text-sm font-semibold text-[#17172f] outline-none transition-colors focus:border-[#aeb5c9]"
                    style={{ borderColor: "#e6d9c9" }}
                  />
                </label>

                <div>
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-[#6d6d80]">
                    Proficiency Level
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PROFICIENCY_LEVELS.filter((level) =>
                      ["A1", "B1", "B2", "C1"].includes(level.code),
                    ).map((level) => {
                      const active = selectedLevel === level.code;
                      return (
                        <button
                          key={level.code}
                          onClick={() => setSelectedLevel(level.code)}
                          className="rounded-[16px] border px-3 py-3 text-xs font-extrabold transition-all hover:border-[#aeb5c9] hover:bg-[#f4efe7]"
                          style={{
                            borderColor: active ? "#aeb5c9" : "#e6d9c9",
                            background: active ? "#ece7fb" : "white",
                            color: active ? "#41329c" : "#6d6d80",
                          }}
                        >
                          {level.code} - {level.label.split("-")[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-[#6d6d80]">
                    Learning Pace
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {DAILY_GOALS.map((goal) => {
                      const active = selectedPace === goal.label;
                      return (
                        <button
                          key={goal.label}
                          onClick={() => setSelectedPace(goal.label)}
                          className="rounded-[16px] border px-3 py-3 text-xs font-extrabold transition-all hover:border-[#aeb5c9] hover:bg-[#f4efe7]"
                          style={{
                            borderColor: active ? "#aeb5c9" : "#e6d9c9",
                            background: active ? "#fbf5e8" : "white",
                            color: active ? "#c9842f" : "#6d6d80",
                          }}
                        >
                          {goal.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="block">
                  <span className="mb-2 flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.12em] text-[#6d6d80]">
                    Articles / Week Target
                    <b className="text-[#17172f]">{articleFrequency}</b>
                  </span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={articleFrequency}
                    onChange={(event) => setArticleFrequency(parseInt(event.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#f0ebe4] accent-[#c9842f]"
                  />
                </label>

                <button
                  onClick={handleSavePreferences}
                  disabled={isSubmitting || !fullName}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#202b67] px-5 py-4 text-sm font-extrabold text-white transition-colors hover:bg-[#121a46] disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={17} className="animate-spin" /> : <Check size={17} />}
                  Save Changes
                </button>
              </div>
            </motion.section>

            <motion.button
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              onClick={() => router.push("/auth")}
              className="flex w-full items-center justify-center gap-2 rounded-[22px] border bg-white px-5 py-4 text-sm font-extrabold text-[#ef4444] shadow-[0_3px_14px_rgba(31,27,23,0.08)] transition-all hover:border-[#ef4444]/40 hover:bg-[#fff4f4]"
              style={{ borderColor: "#e6d9c9" }}
            >
              <LogOut size={17} /> Sign Out
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
