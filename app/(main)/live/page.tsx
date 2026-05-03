"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ChevronRight, Play, ChevronDown, ChevronUp, BookMarked, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import SaveWordModal from "@/components/SaveWordModal";

interface SessionData {
  id: string;
  title: string;
  description?: string;
  topic?: string;
  scheduled_at: string;
  duration_mins: number;

  status: string;
  daily_room_url?: string;
  max_attendees?: number;
  // Summary/Vocab might come from specific history objects if available, 
  // but let's assume standard shape for now.
  summary?: string;
  vocabulary?: string[];
}

function LiveDot() {
  return (
    <span className="relative inline-flex items-center">
      <span className="w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
      <span
        className="absolute inset-0 rounded-full animate-ping"
        style={{ background: "#ef4444", opacity: 0.5 }}
      />
    </span>
  );
}

function Countdown({ scheduledAt }: { scheduledAt: string }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const target = new Date(scheduledAt).getTime();
    const update = () => {
      const now = Date.now();
      setRemaining(Math.max(0, Math.floor((target - now) / 1000)));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [scheduledAt]);

  if (remaining <= 0) return <span>Starting now...</span>;

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;

  return (
    <span>
      Starts in: {h > 0 ? `${h}h ` : ""}{m}:{s.toString().padStart(2, "0")}
    </span>
  );
}

export default function LivePage() {
  const { user, session: authSession } = useAuth();
  const router = useRouter();
  
  const [recommended, setRecommended] = useState<SessionData[]>([]);
  const [history, setHistory] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveWord, setSaveWord] = useState("");

  useEffect(() => {
    if (!authSession?.access_token) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const headers = { Authorization: `Bearer ${authSession.access_token}` };
        
        const [recRes, histRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/recommended`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/me`, { headers })
        ]);

        if (recRes.ok) setRecommended(await recRes.json());
        if (histRes.ok) setHistory(await histRes.json());
      } catch (err) {
        console.error("Failed to fetch sessions", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [authSession]);

  const openSave = (word: string) => {
    setSaveWord(word);
    setSaveModalOpen(true);
  };

  const featured = recommended.find(s => s.status === 'live' || s.status === 'scheduled') || recommended[0];

  return (
    <div
      className="w-full max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6"
      style={{ background: "#f0f4ff", colorScheme: "light", minHeight: "100%" }}
    >
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1
          className="text-2xl font-bold mb-0.5"
          style={{ fontFamily: "'Outfit', sans-serif", color: "#1a2b5e" }}
        >
          Live Sessions
        </h1>
        <p className="text-sm" style={{ color: "#4a5568" }}>
          Hi {user?.full_name?.split(' ')[0] || 'there'}! Ready to practice your English live?
        </p>
      </motion.div>

      {/* 2-col on lg: Upcoming | Previous */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start space-y-6 lg:space-y-0">

        {/* Upcoming Live Session */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold" style={{ color: "#4a5568" }}>
            {featured?.status === 'live' ? "Current Live Session" : "Next Recommended Session"}
          </h2>

          {isLoading ? (
            <div className="h-64 bg-white/50 animate-pulse rounded-2xl" />
          ) : !featured ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-[#1a2b5e]/10">
               <Calendar className="mx-auto mb-2 text-[#9aa5b1]" size={32} />
               <p className="text-sm text-[#9aa5b1]">No sessions scheduled for your topics right now.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #0b1535 0%, #1a2560 50%, #0d1a3e 100%)",
                boxShadow: "0 8px 32px rgba(26,43,94,0.35)",
              }}
            >
              <div className="relative p-5">
                {[
                  { top: "12%", left: "15%", size: 2 },
                  { top: "30%", left: "45%", size: 1.5 },
                  { top: "8%", left: "70%", size: 3 },
                  { top: "60%", left: "80%", size: 2 },
                  { top: "50%", left: "25%", size: 1.5 },
                  { top: "75%", left: "55%", size: 2 },
                ].map((star, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{ top: star.top, left: star.left, width: star.size, height: star.size, background: "rgba(255,255,255,0.7)" }}
                  />
                ))}

                <div className="flex items-center justify-between mb-4">
                  <span
                    className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold"
                    style={{ background: "rgba(255,255,255,0.12)", color: "white" }}
                  >
                    {featured.status === 'live' ? <LiveDot /> : <Calendar size={14} />}
                    {featured.status === 'live' ? 'Live Now' : 'Scheduled'}
                  </span>
                  {featured.status === 'scheduled' && (
                    <span
                      className="text-xs font-medium px-3 py-1 rounded-full"
                      style={{ background: "rgba(201,168,76,0.2)", color: "#d4b86a" }}
                    >
                      <Countdown scheduledAt={featured.scheduled_at} />
                    </span>
                  )}
                </div>

                <h3
                  className="text-xl font-bold leading-snug mb-2"
                  style={{ color: "white", fontFamily: "'Outfit', sans-serif" }}
                >
                  {featured.title}
                </h3>
                <p className="text-xs mb-4 line-clamp-2" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {featured.description || "Join our community for a live practice session."}
                </p>

                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-[#c9a84c]/20 flex items-center justify-center text-[10px] font-bold text-[#c9a84c] border border-[#c9a84c]/30">
                    AT
                  </div>
                  <span className="text-xs font-medium text-white/80">
                    Topic: <span className="text-[#c9a84c] capitalize">{featured.topic}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 mb-5">
                  <Users size={12} style={{ color: "rgba(255,255,255,0.5)" }} />
                  <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {featured.max_attendees ? `Max ${featured.max_attendees} participants` : "Unlimited space"}
                  </span>
                </div>

                <button
                  onClick={() => router.push(`/live/${featured.id}`)}
                  className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "white", color: "#1a2b5e", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}
                >
                  {featured.status === 'live' ? 'Join Live Session' : 'View Session Details'} &nbsp;›
                </button>
              </div>
            </motion.div>
          )}

          {/* New Discovery Section */}
          <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             transition={{ delay: 0.4 }}
             className="pt-2"
          >
             <button
                onClick={() => router.push('/live/all-sessions')}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-[#1a2b5e]/10 flex items-center justify-center gap-3 text-sm font-bold text-[#1a2b5e] hover:bg-white hover:border-[#1a2b5e]/20 transition-all group"
             >
                <Users size={18} className="text-[#c9a84c]" />
                Discover all live sessions
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform text-[#9aa5b1]" />
             </button>
          </motion.div>
        </div>

        {/* Previous Sessions */}
        <div className="space-y-4">
          <div>
            <h2 className="font-bold text-base mb-0.5" style={{ color: "#1a2b5e" }}>
              My Attended Sessions
            </h2>
            <p className="text-xs mb-1" style={{ color: "#9aa5b1" }}>
              Continue learning from sessions you've joined
            </p>
          </div>

          <div className="space-y-3">
            {isLoading ? (
               [1,2,3].map(i => <div key={i} className="h-20 bg-white/50 animate-pulse rounded-2xl" />)
            ) : history.length === 0 ? (
               <div className="p-8 text-center bg-white/50 rounded-2xl border border-dashed border-[#1a2b5e]/10">
                 <p className="text-xs text-[#9aa5b1]">You haven't attended any sessions yet.</p>
               </div>
            ) : (
              history.map((session, i) => {
                const isExpanded = expandedId === session.id;
                const date = new Date(session.scheduled_at);
                
                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "white",
                      border: "1px solid rgba(26,43,94,0.08)",
                      boxShadow: "0 2px 8px rgba(26,43,94,0.05)",
                    }}
                  >
                    <div className="flex items-start gap-4 p-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-xl shrink-0"
                        style={{ background: "rgba(26,43,94,0.06)" }}
                      >
                        🎓
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm mb-1 leading-snug" style={{ color: "#1a2b5e" }}>
                          {session.title}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] text-[#9aa5b1] font-bold uppercase tracking-wider">
                            {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {session.duration_mins} mins
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/live/${session.id}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-[#1a2b5e]/10"
                            style={{
                              background: "rgba(26,43,94,0.04)",
                              color: "#1a2b5e",
                              border: "1px solid rgba(26,43,94,0.1)",
                            }}
                          >
                            <Play size={10} fill="currentColor" />
                            Session Info
                          </button>
                          {(session.summary || session.vocabulary) && (
                            <button
                                onClick={() => setExpandedId(isExpanded ? null : session.id)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                                style={{
                                background: isExpanded ? "#1a2b5e" : "rgba(201,168,76,0.1)",
                                color: isExpanded ? "white" : "#c9a84c",
                                border: `1px solid ${isExpanded ? "#1a2b5e" : "rgba(201,168,76,0.3)"}`,
                                }}
                            >
                                Notes
                                {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                            </button>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={16} style={{ color: "#9aa5b1" }} className="shrink-0" />
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            className="px-4 pb-4"
                            style={{ borderTop: "1px solid rgba(26,43,94,0.07)" }}
                          >
                            <div className="rounded-xl p-3 mt-3" style={{ background: "#f5f8ff" }}>
                              <p className="text-sm font-bold mb-2" style={{ color: "#1a2b5e" }}>
                                📝 Session Summary
                              </p>
                              <p className="text-xs leading-relaxed mb-3" style={{ color: "#4a5568" }}>
                                {session.summary || "No summary provided for this session."}
                              </p>
                              {session.vocabulary && session.vocabulary.length > 0 && (
                                <>
                                  <p className="text-xs font-bold mb-2" style={{ color: "#1a2b5e" }}>
                                    Key Vocabulary
                                  </p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {session.vocabulary.map((word) => (
                                      <button
                                        key={word}
                                        onClick={() => openSave(word)}
                                        className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-all group"
                                        style={{ background: "rgba(26,43,94,0.08)", color: "#1a2b5e" }}
                                      >
                                        {word}
                                        <BookMarked
                                          size={10}
                                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                                          style={{ color: "#c9a84c" }}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <SaveWordModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        prefillWord={saveWord}
      />
    </div>
  );
}
