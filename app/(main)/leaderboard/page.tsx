"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Medal,
  RefreshCcw,
  Trophy,
  Users,
} from "lucide-react";
import { useAuth } from "@/app/providers";
import PageShell from "@/components/PageShell";
import { cn } from "@/lib/utils";

type LeaderboardPeriod = "all_time" | "weekly" | "monthly";

type LeaderboardUser = {
  rank: number;
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  xp: number;
  streak_count: number;
};

type LeaderboardResponse = {
  data: LeaderboardUser[];
  page: number;
  limit: number;
  total_pages: number;
  total_count: number;
  has_next: boolean;
  has_prev: boolean;
  period: LeaderboardPeriod;
};

const PERIODS: { value: LeaderboardPeriod; label: string }[] = [
  { value: "all_time", label: "All time" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const LIMIT = 10;

function displayName(player: LeaderboardUser) {
  return player.full_name?.trim() || "Kalyma learner";
}

function initialsFor(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "KL";
}

function rankStyles(rank: number) {
  if (rank === 1) return "border-[#c9a84c] bg-[#c9a84c]/10 text-[#8a6a18]";
  if (rank === 2) return "border-[#aeb5c9] bg-[#eef2fc] text-[#526078]";
  if (rank === 3) return "border-[#c9842f] bg-[#c9842f]/10 text-[#9a5c1f]";
  return "border-[#1a2b5e]/10 bg-white text-[#667084]";
}

function RankBadge({ rank }: { rank: number }) {
  const Icon = rank === 1 ? Crown : rank <= 3 ? Medal : Trophy;

  return (
    <div
      className={cn(
        "grid h-12 w-12 shrink-0 place-items-center rounded-2xl border text-sm font-extrabold",
        rankStyles(rank),
      )}
      aria-label={`Rank ${rank}`}
    >
      {rank <= 3 ? <Icon className="h-5 w-5" /> : rank}
    </div>
  );
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<LeaderboardPeriod>("all_time");
  const [page, setPage] = useState(1);
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(LIMIT),
          period,
        });
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gamification/leaderboard?${params.toString()}`);

        if (!res.ok) {
          throw new Error("Could not load leaderboard.");
        }

        const data = await res.json();
        if (isActive) setLeaderboard(data);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
        if (isActive) setError("Could not load leaderboard.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchLeaderboard();

    return () => {
      isActive = false;
    };
  }, [page, period]);

  const topThree = useMemo(() => leaderboard?.data.filter((player) => player.rank <= 3) ?? [], [leaderboard]);

  const changePeriod = (nextPeriod: LeaderboardPeriod) => {
    setPeriod(nextPeriod);
    setPage(1);
  };

  return (
    <PageShell
      title="Leaderboard"
      subtitle="See how learners rank by XP."
      maxWidth="max-w-6xl"
      action={
        <button
          onClick={() => setPage(1)}
          className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-semibold transition-all hover:border-[#1a2b5e] hover:bg-[#fbf7f1] active:scale-[0.98]"
          style={{ borderColor: "#e6d9c9", color: "#1f1b17" }}
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      }
    >
      <div className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="rounded-[28px] border bg-white p-4 sm:p-5" style={{ borderColor: "#e6d9c9" }}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1a2b5e] text-white">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#1a2b5e]">Rankings</h2>
                  <p className="text-sm text-[#667084]">
                    {leaderboard ? `${leaderboard.total_count} learners` : "Loading learners"}
                  </p>
                </div>
              </div>

              <div className="inline-flex rounded-full border bg-[#fbf7f1] p-1" style={{ borderColor: "#e6d9c9" }}>
                {PERIODS.map((item) => {
                  const isActive = period === item.value;
                  return (
                    <button
                      key={item.value}
                      onClick={() => changePeriod(item.value)}
                      className={cn(
                        "h-9 rounded-full px-4 text-sm font-semibold transition-all active:scale-[0.98]",
                        isActive ? "bg-[#1a2b5e] text-white shadow-sm" : "text-[#667084] hover:text-[#1a2b5e]",
                      )}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-[#ef4444]/20 bg-[#ef4444]/5 p-6 text-center text-sm font-medium text-[#991b1b]">
                {error}
              </div>
            ) : isLoading ? (
              <div className="mt-6 space-y-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-[82px] animate-pulse rounded-3xl bg-[#f7f2ea]" />
                ))}
              </div>
            ) : leaderboard?.data.length ? (
              <div className="mt-6 overflow-hidden rounded-[24px] border" style={{ borderColor: "#e6d9c9" }}>
                <div className="divide-y divide-[#e6d9c9]">
                  {leaderboard.data.map((player) => {
                    const name = displayName(player);
                    const isCurrentUser = player.id === user?.id;

                    return (
                      <div
                        key={player.id}
                        className={cn(
                          "grid grid-cols-[auto_1fr_auto] items-center gap-4 bg-white p-4 transition-colors sm:p-5",
                          isCurrentUser ? "bg-[#eef2fc]" : "hover:bg-[#fbf7f1]",
                        )}
                      >
                        <RankBadge rank={player.rank} />

                        <div className="flex min-w-0 items-center gap-3">
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border bg-[#f7f2ea]" style={{ borderColor: "#e6d9c9" }}>
                            {player.avatar_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={player.avatar_url} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-sm font-extrabold text-[#1a2b5e]">
                                {initialsFor(name)}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="truncate text-[15px] font-bold text-[#1a2b5e] sm:text-base">{name}</h3>
                              {isCurrentUser && (
                                <span className="rounded-full bg-[#1a2b5e] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-medium text-[#667084]">
                              {player.streak_count} day streak
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-extrabold tabular-nums text-[#1a2b5e]">{player.xp.toLocaleString()}</p>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#c9a84c]">XP</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-[24px] border bg-[#fbf7f1] p-10 text-center" style={{ borderColor: "#e6d9c9" }}>
                <Users className="mx-auto h-8 w-8 text-[#9aa5b1]" />
                <p className="mt-3 text-sm font-semibold text-[#1a2b5e]">No rankings yet.</p>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#667084]">
                Page {leaderboard?.page ?? page} of {leaderboard?.total_pages || 1}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={isLoading || !leaderboard?.has_prev}
                  className="inline-flex h-10 items-center gap-2 rounded-full border bg-white px-4 text-sm font-semibold text-[#1a2b5e] transition-all enabled:hover:bg-[#fbf7f1] disabled:cursor-not-allowed disabled:opacity-45"
                  style={{ borderColor: "#e6d9c9" }}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <button
                  onClick={() => setPage((current) => current + 1)}
                  disabled={isLoading || !leaderboard?.has_next}
                  className="inline-flex h-10 items-center gap-2 rounded-full border bg-white px-4 text-sm font-semibold text-[#1a2b5e] transition-all enabled:hover:bg-[#fbf7f1] disabled:cursor-not-allowed disabled:opacity-45"
                  style={{ borderColor: "#e6d9c9" }}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <aside className="rounded-[28px] border bg-white p-5" style={{ borderColor: "#e6d9c9" }}>
            <h2 className="text-lg font-bold text-[#1a2b5e]">Top learners</h2>
            <div className="mt-4 space-y-3">
              {topThree.length ? (
                topThree.map((player) => {
                  const name = displayName(player);
                  return (
                    <div key={player.id} className="flex items-center gap-3 rounded-2xl bg-[#fbf7f1] p-3">
                      <RankBadge rank={player.rank} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#1a2b5e]">{name}</p>
                        <p className="text-xs font-semibold text-[#c9a84c]">{player.xp.toLocaleString()} XP</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-[#667084]">Top learners will appear after rankings load.</p>
              )}
            </div>
          </aside>
        </section>
      </div>
    </PageShell>
  );
}
