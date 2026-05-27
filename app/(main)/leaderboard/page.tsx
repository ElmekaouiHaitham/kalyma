"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Crown,
  Flame,
  Medal,
  Star,
  Trophy,
} from "lucide-react";
import { useAuth } from "@/app/providers";
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

const LIMIT = 10;

function displayName(player: LeaderboardUser) {
  return player.full_name?.trim() || "Anonymous";
}

function Avatar({
  name,
  url,
  size = 40,
}: {
  name: string;
  url?: string | null;
  size?: number;
}) {
  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";

  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="grid shrink-0 place-items-center rounded-full bg-[#f4efe7] font-semibold text-[#17172f]"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}

function RewardTile({
  rank,
  reward,
  Icon,
  tone,
}: {
  rank: string;
  reward: string;
  Icon: typeof Trophy;
  tone: "gold" | "soft" | "accent";
}) {
  return (
    <div
      className={cn(
        "rounded-xl p-3 text-center",
        tone === "gold" && "bg-[#fbf5e8]",
        tone === "soft" && "bg-[#f4efe7]",
        tone === "accent" && "bg-[#c9842f]/10",
      )}
    >
      <Icon
        className={cn(
          "mx-auto h-6 w-6",
          tone === "soft" ? "text-[#667084]" : "text-[#c9842f]",
        )}
        strokeWidth={2}
      />
      <p className="mt-1 text-sm font-semibold text-[#17172f]">{rank}</p>
      <p className="mt-0.5 text-[10px] leading-tight text-[#667084]">{reward}</p>
    </div>
  );
}

function RowListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Loading leaderboard">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center gap-3 rounded-2xl border bg-white px-3 py-3"
          style={{ borderColor: "#e6d9c9" }}
        >
          <div className="h-10 w-10 rounded-full bg-[#f0ebe4]" />
          <div className="h-10 w-10 rounded-full bg-[#f0ebe4]" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-40 rounded-full bg-[#f0ebe4]" />
            <div className="h-3 w-28 rounded-full bg-[#f0ebe4]" />
          </div>
          <div className="h-7 w-14 rounded-full bg-[#f0ebe4]" />
        </div>
      ))}
    </div>
  );
}

export default function LeaderboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [rows, setRows] = useState<LeaderboardUser[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Omit<LeaderboardResponse, "data"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(LIMIT),
          period: "all_time",
        });
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/gamification/leaderboard?${params.toString()}`,
        );

        if (!res.ok) throw new Error("Could not load leaderboard.");

        const data = (await res.json()) as LeaderboardResponse;
        if (isActive) {
          setRows(data.data || []);
          setPagination({
            page: data.page,
            limit: data.limit,
            total_pages: data.total_pages,
            total_count: data.total_count,
            has_next: data.has_next,
            has_prev: data.has_prev,
            period: data.period,
          });
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
        if (isActive) setError("Could not load leaderboard.");
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchLeaderboard();

    return () => {
      isActive = false;
    };
  }, [page]);

  const myRank = useMemo(() => {
    const found = rows.find((row) => row.id === user?.id);
    return found?.rank || 0;
  }, [rows, user?.id]);

  return (
    <div className="min-h-screen bg-[#f7f2ea] pb-28 text-[#17172f] md:pb-10">
      <header className="sticky top-0 z-30 border-b border-[#e6d9c9] bg-[#f7f2ea]/85 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3 md:max-w-6xl md:px-8 md:py-5">
          <button
            onClick={() => router.back()}
            aria-label="Back"
            className="grid h-9 w-9 place-items-center rounded-full text-[#667084] transition-colors hover:bg-[#f4efe7] hover:text-[#17172f] md:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1
            className="text-2xl text-[#17172f] md:text-3xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Leaderboard
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-4 px-4 pt-5 md:grid md:max-w-6xl md:grid-cols-3 md:gap-8 md:space-y-0 md:px-8 md:pt-8">
        {loading ? (
          <div className="md:col-span-3">
            <RowListSkeleton count={6} />
          </div>
        ) : error ? (
          <p className="rounded-2xl border border-[#ef4444]/20 bg-[#ef4444]/5 py-12 text-center text-sm font-medium text-[#991b1b] md:col-span-3">
            {error}
          </p>
        ) : rows.length === 0 ? (
          <p className="py-12 text-center text-sm text-[#667084] md:col-span-3">
            No learners yet.
          </p>
        ) : (
          <>
            <aside className="space-y-4 md:sticky md:top-24 md:col-span-1 md:self-start">
              <section
                className="rounded-2xl border bg-white p-4 shadow-[0_3px_14px_rgba(31,27,23,0.08)]"
                style={{ borderColor: "#e6d9c9" }}
              >
                <div className="mb-3 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-[#c9842f]" />
                  <h2
                    className="text-lg font-semibold text-[#17172f]"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Monthly Rewards
                  </h2>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <RewardTile rank="#1" reward="Next month FREE" Icon={Crown} tone="gold" />
                  <RewardTile rank="#2" reward="50% discount" Icon={Trophy} tone="soft" />
                  <RewardTile rank="#3" reward="25% discount" Icon={Medal} tone="accent" />
                </div>
              </section>

              {myRank > 0 && (
                <div
                  className="flex items-center justify-between rounded-2xl border bg-[#f4efe7]/70 px-4 py-3"
                  style={{ borderColor: "#e6d9c9" }}
                >
                  <span className="text-sm text-[#17172f]">Your rank</span>
                  <span
                    className="text-lg font-semibold text-[#202b67]"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    #{myRank}
                  </span>
                </div>
              )}
            </aside>

            <div className="space-y-4 md:col-span-2">
              <ul className="space-y-2">
                {rows.map((row, index) => {
                  const rank = row.rank || (page - 1) * LIMIT + index + 1;
                  const name = displayName(row);
                  const isMe = row.id === user?.id;
                  const level = Math.max(1, Math.floor((row.xp || 0) / 100) + 1);

                  return (
                    <li
                      key={row.id}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border px-3 py-3 transition-colors",
                        isMe ? "bg-[#f4efe7]/70" : "bg-white",
                      )}
                      style={{ borderColor: "#e6d9c9" }}
                    >
                      <span className="grid w-10 shrink-0 place-items-center">
                        {rank === 1 ? (
                          <Crown className="h-6 w-6 text-[#c9842f]" strokeWidth={2.2} />
                        ) : rank === 2 ? (
                          <Trophy className="h-6 w-6 text-[#667084]" strokeWidth={2} />
                        ) : rank === 3 ? (
                          <Medal className="h-6 w-6 text-[#c9842f]" strokeWidth={2} />
                        ) : (
                          <span className="text-xs font-semibold tabular-nums text-[#667084]">
                            #{rank}
                          </span>
                        )}
                      </span>

                      <Avatar name={name} url={row.avatar_url} size={40} />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#17172f]">
                          {name}
                          {isMe && <span className="ml-1 font-normal text-[#202b67]">(You)</span>}
                        </p>
                        <p className="mt-0.5 inline-flex items-center gap-2 text-[11px] text-[#667084]">
                          <span className="inline-flex items-center gap-0.5">
                            <Star className="h-3 w-3" strokeWidth={1.8} />
                            Lv.{level}
                          </span>
                          <span className="inline-flex items-center gap-0.5">
                            <Flame className="h-3 w-3" strokeWidth={1.8} />
                            {row.streak_count || 0}d
                          </span>
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p
                          className="text-base font-semibold leading-none tabular-nums text-[#c9842f]"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          {(row.xp || 0).toLocaleString()}
                        </p>
                        <p className="mt-0.5 text-[10px] text-[#667084]">XP</p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {pagination && pagination.total_pages > 1 && (
                <nav
                  className="flex items-center justify-between rounded-2xl border bg-white px-3 py-3 shadow-[0_3px_14px_rgba(31,27,23,0.06)]"
                  style={{ borderColor: "#e6d9c9" }}
                  aria-label="Leaderboard pagination"
                >
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={!pagination.has_prev || loading}
                    className="inline-flex h-10 items-center gap-1 rounded-full border px-3 text-sm font-semibold text-[#17172f] transition-colors hover:border-[#17172f] hover:bg-[#f4efe7] disabled:cursor-not-allowed disabled:opacity-45"
                    style={{ borderColor: "#e6d9c9" }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                  </button>

                  <div className="text-center text-xs font-semibold text-[#667084]">
                    Page <span className="text-[#17172f]">{pagination.page}</span> of{" "}
                    <span className="text-[#17172f]">{pagination.total_pages}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPage((current) => current + 1)}
                    disabled={!pagination.has_next || loading}
                    className="inline-flex h-10 items-center gap-1 rounded-full border px-3 text-sm font-semibold text-[#17172f] transition-colors hover:border-[#17172f] hover:bg-[#f4efe7] disabled:cursor-not-allowed disabled:opacity-45"
                    style={{ borderColor: "#e6d9c9" }}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
