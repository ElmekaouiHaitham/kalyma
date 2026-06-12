"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Star, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/providers";
import PageShell from "@/components/PageShell";

interface Article {
  id: string;
  title: string;
  summary?: string;
  topic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  reading_time_mins: number;
  thumbnail_url?: string;
}

interface Topic {
  id: string;
  label: string;
}

export default function AllArticlesPage() {
  const router = useRouter();
  const { session } = useAuth();
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [topic, setTopic] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/topics`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setTopics(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!session?.access_token) {
      setIsLoading(false);
      return;
    }

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
    <PageShell
      title="All Articles"
      subtitle="Discover new topics."
      maxWidth="max-w-5xl"
      action={
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm transition-all hover:border-black hover:bg-[#fbf7f1]"
          style={{ color: "#1f1b17", border: "1px solid #e6d9c9" }}
        >
          <ArrowLeft size={16} />
          Back
        </button>
      }
    >

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        <select 
          className="px-3 py-2 text-sm rounded-xl border-none shadow-sm focus:ring-0 outline-none" 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
           <option value="">All Topics</option>
           {topics.map((item) => (
             <option key={item.id} value={item.id}>
               {item.label}
             </option>
           ))}
        </select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3" aria-busy="true" aria-label="Loading articles">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex w-full animate-pulse items-center gap-4 rounded-2xl bg-white p-4"
              style={{
                border: "1px solid rgba(26,43,94,0.08)",
                boxShadow: "0 2px 8px rgba(26,43,94,0.05)",
              }}
            >
              <div className="h-16 w-16 shrink-0 rounded-xl bg-[#f0ebe4]" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-2/3 rounded-full bg-[#f0ebe4]" />
                <div className="h-3 w-full rounded-full bg-[#f0ebe4]" />
                <div className="h-3 w-28 rounded-full bg-[#f0ebe4]" />
              </div>
            </div>
          ))}
        </div>
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
    </PageShell>
  );
}
