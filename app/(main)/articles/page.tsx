"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Star, Bookmark, BookOpen, CheckCircle } from "lucide-react";
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

interface StartedArticle {
  article_id: string;
  completion_pct: number;
  completed_at: string | null;
  article: Article;
}

export default function ArticlesPage() {
  const router = useRouter();
  const { user, session } = useAuth();
  
  const [recommended, setRecommended] = useState<Article[]>([]);
  const [started, setStarted] = useState<StartedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.access_token) return;

    const fetchArticles = async () => {
      try {
        const headers = { Authorization: `Bearer ${session.access_token}` };
        const [recRes, startRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/recommended`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/me/started`, { headers })
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

  const featured = recommended[0];
  const moreRecommended = recommended.slice(1);
  const firstName = user?.full_name?.split(" ")[0] || "There";

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading articles...</div>;
  }

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
          Hi {firstName}! Here&apos;s your article for today:
        </p>
      </motion.div>

      {/* Featured Article Card */}
      {featured && (
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
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full uppercase"
                style={{ background: "rgba(26,43,94,0.08)", color: "#1a2b5e" }}
              >
                <Star size={10} />
                {featured.topic}
              </span>
              <span className="text-xs" style={{ color: "#9aa5b1" }}>
                {featured.reading_time_mins} min read
              </span>
              <Bookmark size={14} className="ml-auto" style={{ color: "#9aa5b1" }} />
            </div>
            <h2 className="text-lg font-bold leading-snug mb-1" style={{ color: "#1a2b5e" }}>
              {featured.title}
            </h2>
            <p className="text-sm line-clamp-2" style={{ color: "#4a5568" }}>
              {featured.summary || "Read more about this topic..."}
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative w-full bg-slate-200" style={{ height: 180 }}>
            {featured.thumbnail_url ? (
               <Image
                 src={featured.thumbnail_url}
                 alt={featured.title}
                 fill
                 className="object-cover"
                 priority
               />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-4xl">📖</div>
            )}
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
      )}

      {/* Recommended Header */}
      {moreRecommended.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-end justify-between"
        >
          <div>
            <h3 className="font-bold text-base mb-0.5" style={{ color: "#1a2b5e" }}>
              Recommended for you
            </h3>
            <p className="text-xs" style={{ color: "#9aa5b1" }}>
              Articles aligned with your preferences.
            </p>
          </div>
          <button 
             onClick={() => router.push('/library/all-articles')}
             className="text-xs font-bold px-3 py-1.5 rounded-lg"
             style={{ background: "rgba(26,43,94,0.08)", color: "#1a2b5e" }}
          >
             Discover All
          </button>
        </motion.div>
      )}

      {/* Recommended Article list */}
      <div className="space-y-3">
        {moreRecommended.map((article, i) => (
          <motion.button
            key={article.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.07 }}
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
                <span className="text-xs ml-auto capitalize" style={{ color: "#c9a84c" }}>
                  {article.difficulty}
                </span>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: "#9aa5b1" }} />
          </motion.button>
        ))}
      </div>

      {/* Started Articles */}
      {started.length > 0 && (
         <motion.div
           initial={{ opacity: 0, y: 12 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="mt-8"
         >
           <h3 className="font-bold text-base mb-0.5" style={{ color: "#1a2b5e" }}>
             Continue Reading
           </h3>
           <p className="text-xs mb-3" style={{ color: "#9aa5b1" }}>
             Pick up where you left off.
           </p>
           
           <div className="space-y-3">
             {started.map((sa, i) => {
               const isCompleted = sa.completion_pct === 100;
               return (
                 <motion.button
                   key={sa.article_id}
                   initial={{ opacity: 0, y: 8 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.45 + i * 0.05 }}
                   onClick={() => router.push(`/library/${sa.article_id}`)}
                   className="w-full flex flex-col gap-2 p-4 rounded-2xl text-left card-hover relative"
                   style={{
                     background: "white",
                     border: `1px solid ${isCompleted ? "rgba(34,197,94,0.4)" : "rgba(26,43,94,0.08)"}`,
                     boxShadow: "0 2px 8px rgba(26,43,94,0.05)",
                   }}
                 >
                   {isCompleted && (
                       <span className="absolute top-4 right-4 text-green-500">
                          <CheckCircle size={18} />
                       </span>
                   )}
                   <div className="flex gap-4 w-full items-center pr-6">
                     <div
                       className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 overflow-hidden relative bg-slate-50"
                     >
                       {sa.article.thumbnail_url ? (
                           <Image src={sa.article.thumbnail_url} alt="" fill className="object-cover" />
                       ) : "📖"}
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="font-bold text-sm mb-0.5 leading-snug truncate" style={{ color: "#1a2b5e" }}>
                         {sa.article.title}
                       </div>
                       <div className="text-xs" style={{ color: "#9aa5b1" }}>
                         {sa.article.topic.toUpperCase()} · {sa.article.reading_time_mins} min
                       </div>
                     </div>
                   </div>
                   
                   {!isCompleted && (
                     <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                       <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${sa.completion_pct}%` }} 
                       />
                     </div>
                   )}
                 </motion.button>
               )
             })}
           </div>
         </motion.div>
      )}

      {/* Fallback button if no recommendations */}
      {recommended.length === 0 && (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-4">
             <button
              onClick={() => router.push('/library/all-articles')}
              className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              style={{
                background: "white",
                border: "1px solid rgba(26,43,94,0.1)",
                color: "#1a2b5e"
              }}
            >
              <BookOpen size={16} /> Discover All Articles
            </button>
         </motion.div>
      )}
    </div>
  );
}

