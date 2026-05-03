"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowLeft, Filter, Calendar, Users, Star, PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";

interface SessionData {
  id: string;
  title: string;
  description?: string;
  topic?: string;
  scheduled_at: string;
  duration_mins: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  max_attendees?: number;
}

export default function AllSessionsPage() {
  const router = useRouter();
  const { session } = useAuth();
  
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [status, setStatus] = useState<string>("");
  const [topic, setTopic] = useState<string>("");

  useEffect(() => {
    if (!session?.access_token) return;

    const fetchSessions = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (status) params.append("status", status);
        if (topic) params.append("topic", topic);
        
        const headers = { Authorization: `Bearer ${session.access_token}` };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions?${params.toString()}`, { headers });

        if (res.ok) {
          const data = await res.json();
          setSessions(data);
        }
      } catch (err) {
        console.error("Failed to fetch sessions", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [session, status, topic]);

  return (
    <div
      className="w-full max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6"
      style={{ background: "#f0f4ff", colorScheme: "light", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all text-[#1a2b5e]"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Outfit', sans-serif", color: "#1a2b5e" }}>
            Discovery sessions
          </h1>
          <p className="text-sm text-[#4a5568]">Browse all upcoming and past live events</p>
        </div>
      </div>

      {/* Filters Container */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-[#1a2b5e]/5">
           <Filter size={16} className="text-[#c9a84c]" />
           <span className="text-xs font-bold text-[#1a2b5e] uppercase tracking-wider">Filters</span>
        </div>
        
        <select 
          className="px-4 py-2.5 text-sm rounded-xl border-none shadow-sm focus:ring-2 focus:ring-[#1a2b5e]/10 outline-none bg-white font-medium text-[#1a2b5e]" 
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
           <option value="">All Statuses</option>
           <option value="live">Live Now</option>
           <option value="scheduled">Upcoming</option>
           <option value="completed">Completed</option>
        </select>

        <select 
          className="px-4 py-2.5 text-sm rounded-xl border-none shadow-sm focus:ring-2 focus:ring-[#1a2b5e]/10 outline-none bg-white font-medium text-[#1a2b5e]" 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
           <option value="">All Topics</option>
           <option value="business">Business</option>
           <option value="technology">Technology</option>
           <option value="culture">Culture</option>
           <option value="health">Health</option>
           <option value="general">General</option>
        </select>
      </div>

      {/* Sessions Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-48 bg-white/50 animate-pulse rounded-2xl" />
           ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
           <div className="w-16 h-16 bg-[#1a2b5e]/5 rounded-full flex items-center justify-center">
              <Calendar size={32} className="text-[#9aa5b1]" />
           </div>
           <p className="text-sm text-[#9aa5b1] max-w-xs">
              No sessions found matching your current filters. Try adjusting your search!
           </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {sessions.map((sess, i) => (
              <motion.button
                key={sess.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => router.push(`/live/${sess.id}`)}
                className="group relative flex flex-col items-start p-5 rounded-3xl bg-white border border-[#1a2b5e]/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between w-full mb-4">
                   <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      sess.status === 'live' ? 'bg-red-50 text-red-500' : 
                      sess.status === 'scheduled' ? 'bg-blue-50 text-blue-500' : 
                      'bg-slate-50 text-slate-500'
                   }`}>
                      {sess.status === 'live' && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
                      {sess.status}
                   </div>
                   <div className="text-[10px] font-bold text-[#c9a84c] uppercase flex items-center gap-1">
                      <Star size={10} fill="currentColor" /> {sess.topic}
                   </div>
                </div>

                <h3 className="text-base font-bold text-[#1a2b5e] mb-2 line-clamp-2 leading-tight group-hover:text-[#c9a84c] transition-colors">
                  {sess.title}
                </h3>
                
                <p className="text-xs text-[#4a5568] line-clamp-2 mb-4 flex-1">
                  {sess.description || "Interactive live session with expert tutors."}
                </p>

                <div className="w-full pt-4 border-t border-[#1a2b5e]/5 flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-[#9aa5b1] font-bold uppercase mb-0.5">Scheduled</span>
                      <span className="text-xs font-bold text-[#1a2b5e]">
                         {new Date(sess.scheduled_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                   </div>
                   <div className="flex items-center gap-1 px-3 py-1.5 bg-[#f8fafc] rounded-xl group-hover:bg-[#1a2b5e] group-hover:text-white transition-all text-[#1a2b5e]">
                      <span className="text-xs font-bold">Join</span>
                      <ChevronRight size={14} />
                   </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
