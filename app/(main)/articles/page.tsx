"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Clock, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/providers";

interface Article {
  id: string;
  title: string;
  summary?: string;
  topic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  reading_time_mins: number;
  thumbnail_url?: string;
  is_locked?: boolean;
}

interface StartedArticle {
  article_id: string;
  completion_pct: number;
  completed_at: string | null;
  article: Article;
}

const surface = "#f7f2ea";
const ink = "#1f1b17";
const muted = "#6f6b66";
const border = "#e6d9c9";
const accent = "#c9842f";

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2
          className="text-[30px] font-semibold leading-tight"
          style={{ color: ink, fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {title}
        </h2>
        <p className="mt-1 text-[17px]" style={{ color: muted }}>
          {subtitle}
        </p>
      </div>
      {action}
    </div>
  );
}

function ArticleCard({
  article,
  progress,
  onClick,
  index,
}: {
  article: Article;
  progress?: number;
  onClick: () => void;
  index: number;
}) {
  const pct = Math.max(0, Math.min(progress ?? 0, 100));

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.05 }}
      onClick={onClick}
      className={`group flex w-full flex-col overflow-hidden rounded-[22px] border bg-white text-left transition-all ${article.is_locked ? 'opacity-80 hover:shadow-none' : 'hover:-translate-y-0.5 hover:shadow-md'}`}
      style={{
        borderColor: border,
        boxShadow: "0 1px 4px rgba(31,27,23,0.06)",
      }}
    >
      {/* Cover image */}
      <div className="relative h-[160px] w-full shrink-0 overflow-hidden bg-[#f0ebe4]">
        {article.thumbnail_url ? (
          <Image
            src={article.thumbnail_url}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-[13px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: accent, background: "#fdf6ed" }}
          >
            {article.topic || "Article"}
          </div>
        )}
        {/* Reading time pill */}
        <span
          className="absolute bottom-2.5 right-3 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"
        >
          <Clock size={10} />
          {article.reading_time_mins} min
        </span>
        {/* Lock Overlay */}
        {article.is_locked && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-2 rounded-xl bg-white/90 px-4 py-3 text-center shadow-lg backdrop-blur-md">
              <Lock size={24} className="text-[#c9842f]" />
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#1a2b5e]">Pro Only</span>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <span
          className="mb-2 text-[12px] font-semibold uppercase tracking-[0.08em]"
          style={{ color: accent }}
        >
          {article.topic || "Article"}
        </span>

        <h3
          className="line-clamp-2 text-[20px] font-medium leading-[1.25]"
          style={{ color: ink, fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {article.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-[14px] leading-[1.45]" style={{ color: muted }}>
          {article.summary || "Continue exploring this article."}
        </p>

        <div className="mt-auto pt-4">
          {progress !== undefined ? (
            <div>
              <div className="mb-2 flex items-center justify-between text-[12px]" style={{ color: muted }}>
                <span>Reading progress</span>
                <span>{pct}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full" style={{ background: surface }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: accent }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-[13px] font-medium" style={{ color: ink }}>
              <span className="capitalize"></span>
              <ChevronRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
                style={{ color: accent }}
              />
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}

export default function ArticlesPage() {
  const router = useRouter();
  const { session } = useAuth();

  const [recommended, setRecommended] = useState<Article[]>([]);
  const [started, setStarted] = useState<StartedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.access_token) {
      setIsLoading(false);
      return;
    }

    const fetchArticles = async () => {
      try {
        const headers = { Authorization: `Bearer ${session.access_token}` };
        const [recRes, startRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/recommended`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/me/started`, { headers }),
        ]);

        if (recRes.ok) setRecommended(await recRes.json());
        if (startRes.ok) setStarted(await startRes.json());
      } catch (err) {
        console.error("Failed to fetch articles", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [session]);

  if (isLoading) {
    return (
      <div className="min-h-full px-6 py-10 lg:px-8" style={{ background: surface }} aria-busy="true">
        <div className="mx-auto max-w-[1464px]">
          <div className="mb-10 border-b pb-9" style={{ borderColor: border }}>
            <div className="h-11 w-64 animate-pulse rounded-full bg-[#f0ebe4]" />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="min-h-[232px] animate-pulse rounded-[22px] bg-white p-6"
                style={{ border: "1px solid #e6d9c9" }}
              >
                <div className="mb-5 h-16 w-16 rounded-2xl bg-[#f0ebe4]" />
                <div className="space-y-3">
                  <div className="h-5 w-4/5 rounded-full bg-[#f0ebe4]" />
                  <div className="h-5 w-2/3 rounded-full bg-[#f0ebe4]" />
                  <div className="h-4 w-full rounded-full bg-[#f0ebe4]" />
                  <div className="h-4 w-3/4 rounded-full bg-[#f0ebe4]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full px-6 py-10 lg:px-8" style={{ background: surface }}>
      <div className="mx-auto max-w-[1464px]">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 border-b pb-9"
          style={{ borderColor: border }}
        >
          <h1
            className="text-[42px] font-semibold leading-tight"
            style={{ color: ink, fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Daily Article
          </h1>
        </motion.header>

        <section className="mb-14">
          <SectionHeader
            title="Recommended for you"
            subtitle="Articles aligned with your preferences"
            action={
              <button
                onClick={() => router.push("/library/all-articles")}
                className="hidden rounded-full border px-5 py-2.5 text-[15px] font-medium transition-colors hover:border-black hover:bg-[#fbf7f1] hover:text-black sm:inline-flex"
                style={{ borderColor: border, color: ink }}
              >
                Discover All
              </button>
            }
          />

          {recommended.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {recommended.slice(0, 6).map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  index={index}
                  onClick={() => {
                    if (article.is_locked) {
                      router.push("/profile");
                    } else {
                      router.push(`/library/${article.id}`);
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              className="rounded-[22px] border bg-white p-7 text-[17px]"
              style={{ borderColor: border, color: muted }}
            >
              No recommendations yet.
            </div>
          )}

          <button
            onClick={() => router.push("/library/all-articles")}
            className="mt-6 inline-flex rounded-full border px-5 py-2.5 text-[15px] font-medium transition-colors hover:border-black hover:bg-[#fbf7f1] hover:text-black sm:hidden"
            style={{ borderColor: border, color: ink }}
          >
            Discover All
          </button>
        </section>

        <section>
          <SectionHeader title="Continue Reading" subtitle="Pick up where you left off." />

          {started.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {started.slice(0, 6).map((item, index) => (
                <ArticleCard
                  key={item.article_id}
                  article={item.article}
                  progress={item.completion_pct}
                  index={index}
                  onClick={() => router.push(`/library/${item.article_id}`)}
                />
              ))}
            </div>
          ) : (
            <div
              className="flex items-center gap-3 rounded-[22px] border bg-white p-7 text-[17px]"
              style={{ borderColor: border, color: muted }}
            >
              <BookOpen size={20} style={{ color: accent }} />
              Start an article and it will appear here.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
