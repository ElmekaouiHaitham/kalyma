"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, Search, ChevronRight, Clock, CheckCircle2, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
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

interface ReadNews {
  news_id: string;
  read_at: string;
  news_article: NewsItem;
}

export default function NewsPage() {
  const router = useRouter();
  const { session } = useAuth();
  
  const [recommended, setRecommended] = useState<NewsItem[]>([]);
  const [readNews, setReadNews] = useState<ReadNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!session?.access_token) return;

    const fetchNews = async () => {
      try {
        const headers = { Authorization: `Bearer ${session.access_token}` };
        const [recRes, readRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/recommended`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/me/read`, { headers })
        ]);

        if (recRes.ok) setRecommended(await recRes.json());
        if (readRes.ok) setReadNews(await readRes.json());
      } catch (err) {
        console.error("Failed to fetch news", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [session]);

  const filteredRecommended = recommended.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="p-8 text-center text-gray-400">Loading your news...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10 min-h-full">
      {/* Header & Search */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1a2b5e] font-outfit">News Feed</h1>
          <p className="text-[#64748b]">Stay updated with the latest happenings around the world.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa5b1]" size={18} />
            <input
              type="text"
              placeholder="Search news..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#1a2b5e]/10 focus:outline-none focus:ring-2 focus:ring-[#1a2b5e]/20 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Recommended News */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1a2b5e] flex items-center gap-2">
            <Clock size={20} className="text-[#c9a84c]" />
            Your news for today
          </h2>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs font-bold text-[#9aa5b1] uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-[#1a2b5e]/5">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </span>
            <button 
              onClick={() => router.push('/news/all-news')}
              className="text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap"
              style={{ background: "rgba(26,43,94,0.08)", color: "#1a2b5e" }}
            >
              Browse All
            </button>
          </div>
        </div>

        {filteredRecommended.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredRecommended.map((item, idx) => {
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white rounded-2xl sm:rounded-[2rem] overflow-hidden border border-[#1a2b5e]/10 hover:border-[#1a2b5e]/30 transition-all hover:shadow-xl hover:shadow-[#1a2b5e]/5 flex flex-col cursor-pointer"
                    onClick={() => router.push(`/news/${item.id}`)}
                  >
                    <div className="bg-[#f8fafc] flex items-center justify-center text-4xl sm:text-6xl h-32 sm:h-48 w-full group-hover:scale-105 transition-transform duration-700 shrink-0 relative">
                      {item.thumbnail_url ? (
                        <img src={item.thumbnail_url} alt="" className="w-full h-full object-cover" />
                      ) : "🗞️"}
                    </div>
                    <div className="p-3 sm:p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-1.5 mb-2 sm:mb-3">
                        <span className="text-[8px] sm:text-[10px] font-extrabold text-[#c9a84c] uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded bg-[#c9a84c]/10 border border-[#c9a84c]/20 truncate">
                          {item.topic}
                        </span>
                        <span className="hidden xs:block text-[8px] sm:text-[10px] text-[#9aa5b1] font-bold uppercase tracking-widest ml-auto">
                          Today
                        </span>
                      </div>
                      <h3 className="font-bold text-[#1a2b5e] text-xs sm:text-base leading-tight group-hover:text-[#2d4080] transition-colors mb-1.5 sm:mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="hidden sm:block text-[#64748b] text-xs sm:text-sm mb-4 line-clamp-2">
                        {item.summary}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-2 sm:pt-4 border-t border-[#1a2b5e]/5">
                        <button
                          onClick={() => router.push(`/news/${item.id}`)}
                          className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm font-bold text-[#1a2b5e] hover:gap-1.5 sm:hover:gap-2.5 transition-all"
                        >
                          Read <span className="hidden xs:inline">More</span>
                          <ChevronRight size={14} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                        <button className="p-1 sm:p-2 rounded-full hover:bg-[#1a2b5e]/5 text-[#9aa5b1] hover:text-[#1a2b5e] transition-colors">
                          <Bookmark size={14} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white/50 border-2 border-dashed border-[#1a2b5e]/10 rounded-[2rem] p-12 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Newspaper size={24} className="text-[#9aa5b1]" />
            </div>
            <h3 className="text-[#1a2b5e] font-bold">No news found</h3>
            <p className="text-[#64748b] text-sm">Try adjusting your filters or search query.</p>
          </div>
        )}
      </section>

      {/* Previously Read News */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={20} className="text-green-500" />
          <h2 className="text-xl font-bold text-[#1a2b5e]">Previously Read</h2>
        </div>

        <div className="bg-white rounded-[2rem] border border-[#1a2b5e]/10 overflow-hidden shadow-sm">
          <div className="divide-y divide-[#1a2b5e]/5">
            {readNews.map((item) => (
              <div
                key={item.news_id}
                onClick={() => router.push(`/news/${item.news_id}`)}
                className="p-4 sm:p-6 hover:bg-[#f8fafc] transition-colors flex items-center gap-4 sm:gap-6 group cursor-pointer"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#f1f5f9] flex items-center justify-center text-2xl sm:text-3xl shrink-0 overflow-hidden relative">
                  {item.news_article.thumbnail_url ? (
                    <img src={item.news_article.thumbnail_url} alt="" className="w-full h-full object-cover" />
                  ) : "🗞️"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-tighter">
                      {item.news_article.topic}
                    </span>
                    <span className="text-[10px] text-[#9aa5b1]">
                      • {new Date(item.news_article.published_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-[#1a2b5e] truncate group-hover:text-[#2d4080]">
                    {item.news_article.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#64748b] truncate">
                    {item.news_article.summary}
                  </p>
                </div>
                <button className="p-2 sm:p-3 rounded-xl bg-[#1a2b5e]/5 text-[#1a2b5e] hover:bg-[#1a2b5e] hover:text-white transition-all shrink-0">
                   <Bookmark size={18} />
                </button>
              </div>
            ))}
          </div>
          {readNews.length === 0 && (
            <div className="p-12 text-center text-[#9aa5b1]">
              <p className="text-sm">News you read will appear here.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

