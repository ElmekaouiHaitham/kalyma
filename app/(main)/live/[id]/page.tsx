"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Users, 
  Star, 
  MessageSquare, 
  Info, 
  Calendar, 
  Clock, 
  AlertCircle,
  X,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { useAuth } from "@/app/providers";

interface SessionDetails {
  id: string;
  title: string;
  description?: string;
  topic?: string;
  scheduled_at: string;
  duration_mins: number;
  daily_room_url?: string;
  status: 'scheduled' | 'live' | 'completed';
  max_attendees?: number;
  ai_summary?: string;
}

export default function SessionRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, session: authSession } = useAuth();

  const [session, setSession] = useState<SessionDetails | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRated, setIsRated] = useState(false);

  useEffect(() => {
    if (!authSession?.access_token) return;

    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const headers = { Authorization: `Bearer ${authSession.access_token}` };
        
        // 1. Fetch Session Info
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/${id}`, { headers });
        if (!res.ok) throw new Error("Failed to load session details");
        const data = await res.json();
        setSession(data);

        // 2. If Live and Pro, Fetch Token
        if (data.status === 'live' || (data.status === 'scheduled' && new Date(data.scheduled_at).getTime() - Date.now() < 300000)) {
           if (user?.plan !== 'pro') {
              setError("PRO_REQUIRED");
           } else {
              const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/${id}/token/student`, { 
                method: 'POST',
                headers 
              });
              if (tokenRes.ok) {
                const tokenData = await tokenRes.json();
                setToken(tokenData.token);
              } else {
                const errData = await tokenRes.json();
                setError(errData.detail || "Unable to join session");
              }
           }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id, authSession, user?.plan]);

  const handleRate = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/${id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authSession?.access_token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });
      if (res.ok) {
        setIsRated(true);
        setTimeout(() => setShowRating(false), 2000);
      }
    } catch (err) {
      console.error("Failed to submit rating", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f7f2ea]">
        <div className="w-12 h-12 border-4 border-[#1a2b5e]/10 border-t-[#c9a84c] rounded-full animate-spin mb-4" />
        <p className="text-[#1a2b5e] font-medium">Securing your connection...</p>
      </div>
    );
  }

  if (error === "PRO_REQUIRED") {
     return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
           <div className="w-16 h-16 bg-[#c9a84c]/10 rounded-full flex items-center justify-center mb-6">
              <Star className="text-[#c9a84c]" size={32} fill="currentColor" />
           </div>
           <h2 className="text-2xl font-bold text-[#1a2b5e] mb-2">Pro Plan Required</h2>
           <p className="text-[#4a5568] max-w-md mb-8">
              Live sessions are exclusive to our Pro members. Upgrade now to participate in real-time practice and interactive lessons.
           </p>
           <button 
              onClick={() => router.push('/profile')}
              className="px-8 py-3 bg-[#1a2b5e] text-white rounded-xl font-bold shadow-lg hover:shadow-[#1a2b5e]/20 transition-all"
           >
              Upgrade to Pro
           </button>
           <button onClick={() => router.back()} className="mt-4 text-sm text-[#4a5568] hover:text-[#1a2b5e]">
              Go Back
           </button>
        </div>
     )
  }

  return (
    <div className="min-h-screen bg-[#f7f2ea] flex flex-col">
      {/* Header */}
      <header className="h-16 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-2 hover:bg-[#f7f2ea] rounded-lg transition-colors text-[#1a2b5e]"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-sm font-bold text-[#1a2b5e] truncate max-w-[200px] md:max-w-md">
              {session?.title || "Live Session"}
            </h1>
            <div className="flex items-center gap-2">
               <span className="flex items-center gap-1 text-[10px] font-bold text-[#c9a84c] uppercase">
                  <Star size={10} fill="currentColor" /> {session?.topic}
               </span>
               <span className="w-1 h-1 rounded-full bg-[#cbd5e1]" />
               <span className="text-[10px] text-[#94a3b8] font-medium">
                  ID: {id.slice(0,8)}
               </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           {session?.status === 'live' && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#ef4444]/10 rounded-full border border-[#ef4444]/20">
                 <span className="w-1.5 h-1.5 bg-[#ef4444] rounded-full animate-pulse" />
                 <span className="text-[10px] font-bold text-[#ef4444] uppercase tracking-wider">Live</span>
              </div>
           )}
           <button 
            onClick={() => setShowRating(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#f7f2ea] text-[#1a2b5e] text-xs font-bold rounded-xl border border-[#1a2b5e]/10 hover:bg-[#1a2b5e] hover:text-white transition-all"
           >
             <Star size={14} /> Rate Session
           </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
        {/* Main Content (Video Area) */}
        <div className="flex-1 bg-black relative flex flex-col">
          {token && session?.daily_room_url ? (
            <iframe
              src={`${session.daily_room_url}?t=${token}`}
              className="w-full h-full border-none"
              allow="camera; microphone; display-capture; autoplay; encrypted-media; fullscreen"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
               <div className="p-8 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10 max-w-md">
                  <div className="w-16 h-16 bg-[#c9a84c]/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <Calendar className="text-[#c9a84c]" size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {session?.status === 'scheduled' ? "Waiting for the Host" : "Connection Issue"}
                  </h2>
                  <p className="text-white/60 text-sm mb-6">
                    {session?.status === 'scheduled' 
                       ? `This session is scheduled for ${new Date(session.scheduled_at).toLocaleString()}. Please check back once it starts.`
                       : "We couldn't establish a live video connection. Please check your internet or contact support."}
                  </p>
                  <button onClick={() => router.back()} className="w-full py-3 bg-white text-black rounded-xl text-sm font-bold">
                    Back to Dashboard
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* Sidebar (Info & Summary) */}
        <aside className="w-full md:w-80 border-l bg-white flex flex-col overflow-y-auto">
          <div className="p-5 space-y-6">
             {/* Stats */}
             <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#f7f2ea] rounded-2xl border border-[#e6d9c9]">
                   <p className="text-[10px] font-bold text-[#94a3b8] uppercase mb-1">Duration</p>
                   <div className="flex items-center gap-2">
                      <Clock size={16} className="text-[#1a2b5e]" />
                      <span className="text-sm font-bold text-[#1a2b5e]">{session?.duration_mins}m</span>
                   </div>
                </div>
                <div className="p-3 bg-[#f7f2ea] rounded-2xl border border-[#e6d9c9]">
                   <p className="text-[10px] font-bold text-[#94a3b8] uppercase mb-1">Participants</p>
                   <div className="flex items-center gap-2">
                      <Users size={16} className="text-[#1a2b5e]" />
                      <span className="text-sm font-bold text-[#1a2b5e]">{session?.max_attendees || '∞'}</span>
                   </div>
                </div>
             </div>

             {/* Description */}
             <div>
                <h4 className="flex items-center gap-2 text-xs font-bold text-[#1a2b5e] mb-2 uppercase tracking-wider">
                  <Info size={14} className="text-[#c9a84c]" /> Session Description
                </h4>
                <p className="text-sm text-[#4a5568] leading-relaxed">
                  {session?.description || "In this session, you'll practice real-world conversations with an experienced tutor and other learners."}
                </p>
             </div>

             {/* AI Summary (if completed) */}
             {session?.ai_summary && (
                <div className="p-4 bg-[#f7f2ea] rounded-2xl border border-[#1a2b5e]/5">
                   <h4 className="flex items-center gap-2 text-xs font-bold text-[#1a2b5e] mb-3 uppercase">
                     <CheckCircle2 size={14} className="text-[#34d399]" /> Learning Summary
                   </h4>
                   <p className="text-xs text-[#4a5568] leading-relaxed italic">
                      "{session.ai_summary}"
                   </p>
                </div>
             )}

             {/* Tips Notice */}
             {!session?.ai_summary && (
                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                   <div className="flex gap-3">
                      <AlertCircle className="text-orange-400 shrink-0" size={16} />
                      <p className="text-[11px] text-orange-700 leading-snug">
                         Stay active! Participating in the chat and speaking out loud helps you learn 3x faster.
                      </p>
                   </div>
                </div>
             )}
          </div>
        </aside>
      </main>

      {/* Rating Modal Content Overlay */}
      <AnimatePresence>
        {showRating && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowRating(false)}
              className="absolute inset-0 bg-[#0b1535]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#1a2b5e]">Rate Session</h3>
                  <button onClick={() => setShowRating(false)} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={20} />
                  </button>
                </div>

                {isRated ? (
                   <div className="py-12 text-center">
                      <div className="w-16 h-16 bg-[#34d399]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="text-[#34d399]" size={32} />
                      </div>
                      <h4 className="text-lg font-bold text-[#1a2b5e]">Thank you!</h4>
                      <p className="text-sm text-[#64748b]">Your feedback helps our teachers improve.</p>
                   </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-2 mb-6">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          onClick={() => setRating(s)}
                          className="p-1 transition-transform active:scale-90"
                        >
                          <Star 
                            size={36} 
                            className={s <= rating ? "text-[#c9a84c]" : "text-slate-200"} 
                            fill={s <= rating ? "currentColor" : "none"} 
                          />
                        </button>
                      ))}
                    </div>

                    <textarea
                      placeholder="Any thoughts or suggestions? (Optional)"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full h-32 p-4 bg-[#f7f2ea] border border-[#e6d9c9] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2b5e]/10 resize-none mb-6"
                    />

                    <button
                      onClick={handleRate}
                      disabled={rating === 0 || isSubmitting}
                      className="w-full py-4 bg-[#1a2b5e] text-white rounded-2xl font-bold shadow-lg shadow-[#1a2b5e]/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Review"
                      )}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
