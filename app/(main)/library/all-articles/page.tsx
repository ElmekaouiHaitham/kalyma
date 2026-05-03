"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Star, Bookmark, ArrowLeft } from "lucide-react";
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
}

export default function AllArticlesPage() {
  const router = useRouter();
  const { session } = useAuth();
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [topic, setTopic] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");

  useEffect(() => {
    if (!session?.access_token) return;

    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (topic) params.append("topic", topic);
        if (difficulty) params.append("difficulty", difficulty);
        
        const headers = { Authorization: `Bearer ${session.access_token}` };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles?${params.toString()}`, { headers });

        if (res.ok) {
          const data = await res.json();
          setArticles(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch articles", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [session, topic, difficulty]);

  return (
    <div
      className="max-w-lg mx-auto px-4 py-6 space-y-5 lg:max-w-5xl"
      style={{ background: "#f0f4ff", colorScheme: "light", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#1a2b5e" }}>All Articles</h1>
          <p className="text-xs text-gray-500">Discover new topics</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        <select 
          className="px-3 py-2 text-sm rounded-xl border-none shadow-sm focus:ring-0 outline-none" 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
           <option value="">All Topics</option>
           <option value="business">Business</option>
           <option value="technology">Technology</option>
           <option value="culture">Culture</option>
           <option value="health">Health</option>
        </select>
        <select 
          className="px-3 py-2 text-sm rounded-xl border-none shadow-sm focus:ring-0 outline-none"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
           <option value="">All Levels</option>
           <option value="beginner">Beginner</option>
           <option value="intermediate">Intermediate</option>
           <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No articles found matching your criteria.</div>
      ) : (
        <div className="space-y-3">
          {articles.map((article, i) => (
            <motion.button
              key={article.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => router.push(`/library/${article.id}`)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl text-left card-hover"
              style={{
                background: "white",
                border: "1px solid rgba(26,43,94,0.08)",
                boxShadow: "0 2px 8px rgba(26,43,94,0.05)",
              }}
            >
              <div
                className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center text-2xl shrink-0 relative"
              >
                {article.thumbnail_url ? (
                    <Image src={article.thumbnail_url} alt={article.title} fill className="object-cover" />
                ) : "📚"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm mb-0.5 leading-snug truncate" style={{ color: "#1a2b5e" }}>
                  {article.title}
                </div>
                {article.summary && (
                  <div className="text-xs mb-1 truncate" style={{ color: "#4a5568" }}>
                    {article.summary}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase"
                    style={{ background: "rgba(26,43,94,0.08)", color: "#1a2b5e" }}
                  >
                    <Star size={8} />
                    {article.topic}
                  </span>
                  <span className="text-xs" style={{ color: "#9aa5b1" }}>
                    · {article.reading_time_mins} min
                  </span>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: "#9aa5b1" }} />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
