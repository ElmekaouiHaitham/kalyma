"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";

interface Article {
  id: string;
  title: string;
  summary?: string;
  topic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  reading_time_mins: number;
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
      className="group flex min-h-[190px] w-full flex-col rounded-[22px] border bg-white p-7 text-left transition-all hover:-translate-y-0.5 hover:bg-[#fbf7f1]"
      style={{
        borderColor: border,
        boxShadow: "0 1px 0 rgba(31,27,23,0.02)",
      }}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <span
          className="text-[14px] font-semibold uppercase tracking-[0.08em]"
          style={{ color: accent }}
        >
          {article.topic || "Article"}
        </span>
        <span className="flex items-center gap-1.5 text-[13px]" style={{ color: muted }}>
          <Clock size={14} />
          {article.reading_time_mins} min
        </span>
      </div>

      <h3
        className="line-clamp-2 text-[25px] font-medium leading-[1.25]"
        style={{ color: ink, fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {article.title}
      </h3>

      <p className="mt-3 line-clamp-2 text-[18px] leading-[1.35]" style={{ color: muted }}>
        {article.summary || "Continue exploring this article."}
      </p>

      <div className="mt-auto pt-5">
        {progress !== undefined ? (
          <div>
            <div className="mb-2 flex items-center justify-between text-[13px]" style={{ color: muted }}>
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
          <div className="flex items-center justify-between text-[15px] font-medium" style={{ color: ink }}>
            <span className="capitalize">{article.difficulty}</span>
            <ChevronRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
              style={{ color: accent }}
            />
          </div>
        )}
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
                  onClick={() => router.push(`/library/${article.id}`)}
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
