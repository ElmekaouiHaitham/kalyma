"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  Lock,
  MoreVertical,
  Newspaper,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  topic: string;
  source_name?: string;
  thumbnail_url?: string;
  published_at: string;
  is_locked?: boolean;
}

interface ReadNews {
  news_id: string;
  read_at: string;
  news_article: NewsItem;
}

const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  sports: { bg: "#ef4444", text: "#ffffff", border: "#2f80ff" },
  health: { bg: "#22c55e", text: "#ffffff", border: "#2f80ff" },
  science: { bg: "#2f80ff", text: "#ffffff", border: "#2f80ff" },
  business: { bg: "#f59e0b", text: "#1f1300", border: "#2f80ff" },
  technology: { bg: "#8b5cf6", text: "#ffffff", border: "#2f80ff" },
  entertainment: { bg: "#ec4899", text: "#ffffff", border: "#2f80ff" },
  world: { bg: "#0ea5e9", text: "#ffffff", border: "#2f80ff" },
};

const catStyle = (category: string) =>
  CAT_COLORS[category?.toLowerCase()] ?? {
    bg: "#2f80ff",
    text: "#ffffff",
    border: "#2f80ff",
  };

export default function NewsPage() {
  const router = useRouter();
  const { session } = useAuth();

  const [recommended, setRecommended] = useState<NewsItem[]>([]);
  const [readNews, setReadNews] = useState<ReadNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchNews = useCallback(
    async (refresh = false) => {
      if (!session?.access_token) {
        setIsLoading(false);
        return;
      }

      if (refresh) setIsRefreshing(true);
      try {
        const headers = { Authorization: `Bearer ${session.access_token}` };
        const [recRes, readRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/recommended`, {
            headers,
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/me/read`, { headers }),
        ]);

        if (recRes.ok) setRecommended(await recRes.json());
        if (readRes.ok) setReadNews(await readRes.json());
      } catch (err) {
        console.error("Failed to fetch news", err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [session],
  );

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const latestDate = useMemo(() => {
    const first = recommended[0]?.published_at;
    return first ? new Date(first) : new Date();
  }, [recommended]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f2ea] pb-12">
        <NewsHeader
          isRefreshing={false}
          menuOpen={false}
          onAllNews={() => router.push("/news/all-news")}
          onMenuOpenChange={() => undefined}
          onRefresh={() => undefined}
        />
        <main className="mx-auto w-full max-w-[1464px] px-6 py-8 lg:px-8 xl:px-10">
          <div
            className="grid grid-cols-1 gap-7 md:grid-cols-2"
            aria-busy="true"
            aria-label="Loading your news"
          >
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[380px] animate-pulse overflow-hidden rounded-[22px] bg-[#171717]"
                style={{ borderLeft: "4px solid #2f80ff" }}
              >
                <div className="h-[190px] bg-[#242424]" />
                <div className="space-y-4 p-6">
                  <div className="h-4 w-28 rounded-full bg-[#2d2d2d]" />
                  <div className="h-5 w-5/6 rounded-full bg-[#2d2d2d]" />
                  <div className="h-5 w-3/4 rounded-full bg-[#2d2d2d]" />
                  <div className="h-4 w-2/3 rounded-full bg-[#2d2d2d]" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f2ea] pb-12">
      <NewsHeader
        isRefreshing={isRefreshing}
        menuOpen={menuOpen}
        onAllNews={() => router.push("/news/all-news")}
        onMenuOpenChange={setMenuOpen}
        onRefresh={() => fetchNews(true)}
      />

      <main className="mx-auto w-full max-w-[1464px] px-6 py-8 lg:px-8 xl:px-10">
        <section className="space-y-7">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#6f6b66]">
              {latestDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {recommended.length > 0 ? (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {recommended.map((item, idx) => {
                  const cs = catStyle(item.topic);

                  return (
                    <motion.article
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group flex min-h-[390px] cursor-pointer flex-col overflow-hidden rounded-[22px] bg-[#171717] transition-all duration-300 hover:-translate-y-0.5"
                      style={{ borderLeft: `4px solid ${cs.border}` }}
                      onClick={() => router.push(`/news/${item.id}`)}
                    >
                      <div className="relative h-[190px] w-full shrink-0 overflow-hidden bg-[#232323] sm:h-[270px]">
                        {item.thumbnail_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.thumbnail_url}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div
                            className="flex h-full w-full items-center justify-center"
                            style={{ backgroundColor: cs.bg }}
                          >
                            <Newspaper
                              className="h-12 w-12"
                              style={{ color: cs.text }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-6 sm:p-8">
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                          <span
                            className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide"
                            style={{ backgroundColor: cs.bg, color: cs.text }}
                          >
                            {item.topic}
                          </span>
                          {item.source_name && (
                            <span className="text-[13px] font-bold text-[#19b8ff]">
                              {item.source_name}
                            </span>
                          )}
                          <span className="ml-auto text-[13px] font-medium tabular-nums text-[#6f7680]">
                            {new Date(item.published_at).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                        <h3
                          className="mb-3 line-clamp-2 text-[22px] font-semibold leading-[1.22] tracking-[-0.01em] text-white sm:text-[28px]"
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                          }}
                        >
                          {item.title}
                        </h3>
                        <p className="line-clamp-3 text-[17px] leading-[1.52] text-[#b8bdc5] sm:text-[20px]">
                          {item.summary}
                        </p>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="rounded-[22px] border border-[#e6d9c9] bg-white/70 p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[18px] bg-white shadow-sm">
                <Newspaper size={24} className="text-[#667084]" />
              </div>
              <h3 className="font-bold text-[#1a2b5e]">No news found</h3>
              <p className="text-sm text-[#64748b]">
                Fresh stories will appear here when they are available.
              </p>
            </div>
          )}
        </section>

        <section className="mt-12 space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-[#2f80ff]" />
            <h2
              className="text-[26px] font-semibold text-[#1a2b5e]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Previously Read
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {readNews.map((item) => {
              const cs = catStyle(item.news_article.topic);

              return (
                <article
                  key={item.news_id}
                  onClick={() => router.push(`/news/${item.news_id}`)}
                  className="group flex cursor-pointer overflow-hidden rounded-[20px] bg-[#171717] transition-transform duration-300 hover:-translate-y-0.5"
                  style={{ borderLeft: `4px solid ${cs.border}` }}
                >
                  <div className="h-auto w-28 shrink-0 overflow-hidden bg-[#232323] sm:w-40">
                    {item.news_article.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.news_article.thumbnail_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full min-h-32 w-full items-center justify-center">
                        <Newspaper className="h-7 w-7 text-[#b8bdc5]" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 p-4 sm:p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide"
                        style={{ backgroundColor: cs.bg, color: cs.text }}
                      >
                        {item.news_article.topic}
                      </span>
                      <span className="text-[11px] font-medium text-[#6f7680]">
                        {new Date(
                          item.news_article.published_at,
                        ).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <h4
                      className="line-clamp-2 text-[17px] font-semibold leading-snug text-white sm:text-[20px]"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                      }}
                    >
                      {item.news_article.title}
                    </h4>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#b8bdc5]">
                      {item.news_article.summary}
                    </p>
                  </div>
                </article>
              );
            })}
            {readNews.length === 0 && (
              <div className="col-span-full rounded-[22px] border border-[#e6d9c9] bg-white/70 p-12 text-center text-[#667084]">
                <p className="text-sm">News you read will appear here.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function NewsHeader({
  isRefreshing,
  menuOpen,
  onAllNews,
  onMenuOpenChange,
  onRefresh,
}: {
  isRefreshing: boolean;
  menuOpen: boolean;
  onAllNews: () => void;
  onMenuOpenChange: (open: boolean) => void;
  onRefresh: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e6d9c9] bg-[#f7f2ea]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-[1464px] items-center px-6 lg:h-28 lg:px-8 xl:px-10">
        <h1
          className="text-[31px] font-semibold leading-none text-[#16265c] sm:text-[34px]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Breaking News
        </h1>
        <div className="ml-auto flex items-center gap-4 text-[#667084]">
          <button
            type="button"
            onClick={onRefresh}
            aria-label="Refresh news"
            className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-white/70 hover:text-[#16265c]"
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-[22px] w-[22px] animate-spin" />
            ) : (
              <RefreshCw className="h-[22px] w-[22px]" />
            )}
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => onMenuOpenChange(!menuOpen)}
              aria-label="News menu"
              aria-expanded={menuOpen}
              className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-white/70 hover:text-[#16265c]"
            >
              <MoreVertical className="h-[22px] w-[22px]" />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-12 w-40 overflow-hidden rounded-2xl bg-white py-2 shadow-[0_18px_45px_rgba(31,27,23,0.15)]"
                style={{ border: "1px solid #e6d9c9" }}
              >
                <button
                  type="button"
                  onClick={() => {
                    onMenuOpenChange(false);
                    onAllNews();
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm font-semibold text-[#1f1b17] transition-colors hover:bg-[#f7f2ea]"
                >
                  All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
