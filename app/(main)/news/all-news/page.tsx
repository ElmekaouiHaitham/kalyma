"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, Clock, ArrowLeft, Bookmark } from "lucide-react";
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
}

export default function AllNewsPage() {
  const router = useRouter();
  const { session } = useAuth();
  
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [topic, setTopic] = useState<string>("");

  useEffect(() => {
    if (!session?.access_token) return;

    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (topic) params.append("topic", topic);
        
        const headers = { Authorization: `Bearer ${session.access_token}` };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news?${params.toString()}`, { headers });

        if (res.ok) {
          const data = await res.json();
          setNews(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch news", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [session, topic]);

  return (
    <div
      className="max-w-5xl mx-auto px-4 py-8 space-y-10 min-h-screen"
      style={{ background: "#f8fafc", colorScheme: "light" }}
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-[#1a2b5e]/10"
        >
          <ArrowLeft size={20} className="text-[#1a2b5e]" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#1a2b5e]" style={{ fontFamily: "'Outfit', sans-serif" }}>Today's Latest News</h1>
          <p className="text-sm text-[#64748b]">All news from the last 30 hours</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
        <select 
          className="px-4 py-2.5 rounded-xl bg-white border border-[#1a2b5e]/10 text-sm font-semibold text-[#1a2b5e] focus:outline-none focus:ring-2 focus:ring-[#1a2b5e]/20 transition-all shadow-sm"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
           <option value="">All Topics</option>
           <option value="business">Business</option>
           <option value="technology">Technology</option>
           <option value="culture">Culture</option>
           <option value="health">Health</option>
           <option value="politics">Politics</option>
           <option value="sports">Sports</option>
        </select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-center py-20 text-[#9aa5b1]">Loading news feed...</div>
      ) : news.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-20 text-center border border-[#1a2b5e]/10">
          <p className="text-[#64748b]">No news found in the last 30 hours.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => router.push(`/news/${item.id}`)}
              className="group bg-white rounded-[2rem] overflow-hidden border border-[#1a2b5e]/10 hover:border-[#1a2b5e]/30 transition-all hover:shadow-lg flex items-center p-4 gap-4 cursor-pointer"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-[#f1f5f9] flex items-center justify-center text-4xl shrink-0 overflow-hidden relative">
                {item.thumbnail_url ? (
                  <img src={item.thumbnail_url} alt="" className="w-full h-full object-cover" />
                ) : "🗞️"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-extrabold text-[#c9a84c] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#c9a84c]/10 border border-[#c9a84c]/20">
                    {item.topic}
                  </span>
                  <span className="text-[10px] text-[#9aa5b1] font-bold">
                    {new Date(item.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h3 className="font-bold text-[#1a2b5e] text-sm sm:text-base leading-tight mb-1.5 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-[#64748b] text-xs sm:text-sm line-clamp-2">
                  {item.summary}
                </p>
              </div>
              <div className="shrink-0 p-2">
                 <ChevronRight size={18} className="text-[#9aa5b1]" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
