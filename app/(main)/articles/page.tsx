"use client";
import { motion } from "framer-motion";
import { ChevronRight, Star, Bookmark, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ARTICLES } from "@/lib/data";

const MORE_ARTICLES = [
  {
    id: "sleep",
    title: "The Science of Sleep",
    subtitle: "Understanding the importance of rest",
    category: "SCIENTIFIC",
    readingTime: "4 min read",
    image: "🌙",
  },
  {
    id: "climate",
    title: "Climate Change and Our Future",
    subtitle: "",
    category: "SCIENTIFIC",
    readingTime: "8 min read",
    image: "🌍",
  },
];

export default function ArticlesPage() {
  const router = useRouter();
  const featured = ARTICLES.find((a) => a.isFeatured) || ARTICLES[0];

  return (
    <div
      className="max-w-lg mx-auto px-4 py-6 space-y-5 lg:max-w-5xl"
      style={{ background: "#f0f4ff", colorScheme: "light", minHeight: "100%" }}
    >
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1
          className="text-2xl font-bold mb-0.5"
          style={{ fontFamily: "'Outfit', sans-serif", color: "#1a2b5e" }}
        >
          Articles
        </h1>
        <p className="text-sm" style={{ color: "#4a5568" }}>
          Hi Samir! Here&apos;s your article for today:
        </p>
      </motion.div>

      {/* Reading Books Banner */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        onClick={() => router.push("/library/books")}
        className="w-full flex items-center gap-4 p-4 rounded-2xl text-left card-hover"
        style={{
          background: "linear-gradient(135deg, #1a2b5e 0%, #2d4080 100%)",
          boxShadow: "0 4px 16px rgba(26,43,94,0.25)",
        }}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-xl"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          📚
        </div>
        <div className="flex-1">
          <div className="font-bold text-sm text-white mb-0.5">Reading Books</div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
            Improve reading comprehension with curated books
          </div>
        </div>
        <ChevronRight size={16} style={{ color: "rgba(255,255,255,0.7)" }} />
      </motion.button>

      {/* Featured Article Card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl overflow-hidden card-hover cursor-pointer"
        style={{
          background: "white",
          border: "1px solid rgba(26,43,94,0.1)",
          boxShadow: "0 4px 20px rgba(26,43,94,0.1)",
        }}
        onClick={() => router.push(`/library/${featured.id}`)}
      >
        {/* Article Meta */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(26,43,94,0.08)", color: "#1a2b5e" }}
            >
              <Star size={10} />
              SCIENTIFIC
            </span>
            <span className="text-xs" style={{ color: "#9aa5b1" }}>
              5 min read
            </span>
            <Bookmark size={14} className="ml-auto" style={{ color: "#9aa5b1" }} />
          </div>
          <h2 className="text-lg font-bold leading-snug mb-1" style={{ color: "#1a2b5e" }}>
            The Human Brain: An Amazing Processor
          </h2>
          <p className="text-sm" style={{ color: "#4a5568" }}>
            Discover the mysteries of how our brain processes information.
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative w-full" style={{ height: 180 }}>
          <Image
            src="/brain_hero.png"
            alt="The Human Brain"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* CTA */}
        <div className="px-5 py-4">
          <button
            className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #1a2b5e, #0f1d4e)",
              boxShadow: "0 4px 14px rgba(26,43,94,0.25)",
            }}
          >
            Start Reading &nbsp;›
          </button>
        </div>
      </motion.div>

      {/* More Articles Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-bold text-base mb-0.5" style={{ color: "#1a2b5e" }}>
          More Articles
        </h3>
        <p className="text-xs" style={{ color: "#9aa5b1" }}>
          Expand your knowledge with new scientific articles every day.
        </p>
      </motion.div>

      {/* Article list */}
      <div className="space-y-3">
        {MORE_ARTICLES.map((article, i) => (
          <motion.button
            key={article.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.07 }}
            onClick={() => {}}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-left card-hover"
            style={{
              background: "white",
              border: "1px solid rgba(26,43,94,0.08)",
              boxShadow: "0 2px 8px rgba(26,43,94,0.05)",
            }}
          >
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: "rgba(26,43,94,0.06)" }}
            >
              {article.image}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm mb-0.5 leading-snug" style={{ color: "#1a2b5e" }}>
                {article.title}
              </div>
              {article.subtitle && (
                <div className="text-xs mb-1" style={{ color: "#4a5568" }}>
                  {article.subtitle}
                </div>
              )}
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(26,43,94,0.08)", color: "#1a2b5e" }}
                >
                  <Star size={8} />
                  {article.category}
                </span>
                <span className="text-xs" style={{ color: "#9aa5b1" }}>
                  · {article.readingTime}
                </span>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: "#9aa5b1" }} />
          </motion.button>
        ))}

        {ARTICLES.filter((a) => !a.isFeatured && !a.locked).map((article, i) => (
          <motion.button
            key={article.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.06 }}
            onClick={() => router.push(`/library/${article.id}`)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-left card-hover relative"
            style={{
              background: "white",
              border: `1px solid ${
                article.read === false
                  ? "rgba(34,197,94,0.3)"
                  : "rgba(26,43,94,0.08)"
              }`,
              boxShadow: "0 2px 8px rgba(26,43,94,0.05)",
            }}
          >
            {article.read === false && (
              <span
                className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(34,197,94,0.15)",
                  color: "#16a34a",
                  border: "1px solid rgba(34,197,94,0.3)",
                }}
              >
                New
              </span>
            )}
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: "rgba(26,43,94,0.06)" }}
            >
              📖
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm mb-0.5 leading-snug line-clamp-2" style={{ color: "#1a2b5e" }}>
                {article.title}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(26,43,94,0.08)", color: "#1a2b5e" }}
                >
                  <Star size={8} />
                  {article.category.toUpperCase()}
                </span>
                <span className="text-xs" style={{ color: "#9aa5b1" }}>
                  · {article.readingTime} min
                </span>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: "#9aa5b1" }} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
