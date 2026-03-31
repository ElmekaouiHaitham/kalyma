"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Clock, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Level = "All Levels" | "Beginner" | "Intermediate" | "Advanced";
type SortBy = "Reading Time" | "A-Z" | "Newest";

const BOOKS = [
  {
    id: "sherlock",
    title: "The Adventure of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    level: "Intermediate",
    levelColor: "#1a2b5e",
    readingTime: "15 min read",
    image: "/book_sherlock.png",
    description: "Follow the world's greatest detective through mystery and crime in Victorian London.",
  },
  {
    id: "british",
    title: "Great British Facts",
    author: "British Culture Study",
    level: "Intermediate",
    levelColor: "#1a2b5e",
    readingTime: "10 min read",
    image: "/book_british.png",
    description: "Discover fascinating facts about British culture, history, and traditions.",
  },
  {
    id: "stories",
    title: "Learn English Through Stories",
    author: "Kalyma Editorial",
    level: "Beginner",
    levelColor: "#22c55e",
    readingTime: "8 min read",
    image: "/book_stories.png",
    description: "Improve your English through simple, engaging short stories.",
  },
  {
    id: "vocabulary",
    title: "Improve Your Vocabulary",
    author: "Kalyma Editorial",
    level: "Beginner",
    levelColor: "#22c55e",
    readingTime: "12 min read",
    image: "/book_vocabulary.png",
    description: "Learn new words and expand your English vocabulary day by day.",
  },
];

const LEVELS: Level[] = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const SORT_OPTIONS: SortBy[] = ["Reading Time", "A-Z", "Newest"];

export default function ReadingBooksPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<Level>("All Levels");
  const [sortBy, setSortBy] = useState<SortBy>("Reading Time");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = BOOKS.filter((b) => {
    const matchSearch =
      search === "" ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchLevel = level === "All Levels" || b.level === level;
    return matchSearch && matchLevel;
  });

  return (
    <div
      className="w-full max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-5"
      style={{ background: "#f0f4ff", colorScheme: "light", minHeight: "100%" }}
    >
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs mb-1" style={{ color: "#9aa5b1" }}>
          Home / Reading Books
        </p>
        <h1
          className="text-2xl font-bold mb-0.5"
          style={{ fontFamily: "'Outfit', sans-serif", color: "#1a2b5e" }}
        >
          Reading Books
        </h1>
        <p className="text-sm" style={{ color: "#4a5568" }}>
          Expand your vocabulary and improve your reading comprehension
        </p>
      </motion.div>

      {/* Search bar + Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2 max-w-xl"
      >
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{
            background: "white",
            border: "1.5px solid rgba(26,43,94,0.12)",
          }}
        >
          <Search size={16} style={{ color: "#9aa5b1" }} />
          <input
            type="text"
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: "#1a2b5e" }}
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter pills row */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1"
              style={{
                background: level === l ? "#1a2b5e" : "white",
                color: level === l ? "white" : "#4a5568",
                border: `1px solid ${level === l ? "#1a2b5e" : "rgba(26,43,94,0.12)"}`,
              }}
            >
              {l}
            </button>
          ))}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all"
            style={{
              background: showFilters ? "#c9a84c" : "white",
              color: showFilters ? "white" : "#4a5568",
              border: `1px solid ${showFilters ? "#c9a84c" : "rgba(26,43,94,0.12)"}`,
            }}
          >
            <SlidersHorizontal size={11} />
            Reading Time
          </button>
        </div>
      </motion.div>

      {/* Books Grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
      >
        <h2 className="font-bold text-base mb-3" style={{ color: "#1a2b5e" }}>
          Recommended Books
        </h2>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((book, i) => (
            <motion.button
              key={book.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 + i * 0.07 }}
              onClick={() => router.push(`/library/books/${book.id}`)}
              className="flex flex-col text-left rounded-2xl overflow-hidden transition-all card-hover"
              style={{
                background: "white",
                border: "1px solid rgba(26,43,94,0.08)",
                boxShadow: "0 3px 12px rgba(26,43,94,0.08)",
              }}
            >
              {/* Cover Image */}
              <div className="relative w-full" style={{ height: 140, background: "#e8efff" }}>
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
                {/* Level badge */}
                <div className="absolute top-2 left-2">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: book.level === "Beginner"
                        ? "#22c55e"
                        : book.level === "Intermediate"
                        ? "#1a2b5e"
                        : "#c9a84c",
                      color: "white",
                    }}
                  >
                    {book.level.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col gap-1.5 flex-1">
                <div
                  className="text-xs font-bold leading-snug line-clamp-2"
                  style={{ color: "#1a2b5e" }}
                >
                  {book.title}
                </div>
                {book.description && (
                  <div
                    className="text-[10px] leading-relaxed line-clamp-2"
                    style={{ color: "#9aa5b1" }}
                  >
                    {book.description}
                  </div>
                )}
                <div className="flex items-center gap-1 mt-auto">
                  <Clock size={10} style={{ color: "#9aa5b1" }} />
                  <span className="text-[10px]" style={{ color: "#9aa5b1" }}>
                    {book.readingTime}
                  </span>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); router.push(`/library/books/${book.id}`); }}
                  className="w-full py-2 rounded-lg text-xs font-bold text-white mt-1 transition-all"
                  style={{
                    background: "linear-gradient(135deg, #1a2b5e, #0f1d4e)",
                    boxShadow: "0 3px 10px rgba(26,43,94,0.25)",
                  }}
                >
                  Start Reading &nbsp;›
                </button>
              </div>
            </motion.button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div
            className="text-center py-12 rounded-2xl"
            style={{ background: "white", border: "1px solid rgba(26,43,94,0.08)" }}
          >
            <div className="text-4xl mb-3">📚</div>
            <p className="font-bold text-sm" style={{ color: "#1a2b5e" }}>
              No books found
            </p>
            <p className="text-xs mt-1" style={{ color: "#9aa5b1" }}>
              Try changing your search or filters
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
