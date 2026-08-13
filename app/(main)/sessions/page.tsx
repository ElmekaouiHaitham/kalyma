"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Loader2,
  Calendar, 
  Clock, 
  Video, 
  CalendarDays, 
  History, 
  Star,
  Inbox,
  PlayCircle
} from "lucide-react";

export default function SessionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [completedSessions, setCompletedSessions] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [recordingLoading, setRecordingLoading] = useState<string | null>(null);

  const handleWatchRecording = async (sessionId: string) => {
    setRecordingLoading(sessionId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}/recording-link`);
      if (res.status === 409) {
         alert("The recording is still processing. Please check back in a few minutes.");
         return;
      }
      if (!res.ok) throw new Error("Could not fetch recording");
      const data = await res.json();
      window.open(data.url, '_blank');
    } catch (e) {
      alert("Recording not available for this session.");
    } finally {
      setRecordingLoading(null);
    }
  };

  useEffect(() => {
    const fetchUpcomingSessions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions`);
        if (res.ok) {
          const data = await res.json();
          const upcomingAndLive = data.filter((s: any) => s.status === 'scheduled' || s.status === 'live');
          const completed = data.filter((s: any) => s.status === 'completed');
          setUpcomingSessions(upcomingAndLive);
          setCompletedSessions(completed);
        }
      } catch (err) {
        console.error("Failed to fetch upcoming sessions", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUpcomingSessions();

    // Update current time every minute for the countdown
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3 mt-20">
        <Loader2 className="w-10 h-10 text-[#021541] animate-spin" />
        <p className="font-medium text-[#45464f] animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-5 md:px-10 pt-20 pb-8 md:py-12 flex flex-col gap-8 md:gap-10 text-[#1a1c1a]">
      {/* Page Title */}
      <header>
        <h1 className="text-[28px] md:text-[32px] leading-[34px] md:leading-[40px] font-extrabold text-[#1a2b56] tracking-tight">
          My Sessions
        </h1>
        <p className="text-[16px] leading-[24px] text-[#45464f] mt-2 block md:hidden">
          Manage your upcoming check-ins and review past learnings.
        </p>
      </header>

      {/* Upcoming Sessions */}
      <section className="flex flex-col gap-4 md:gap-5">
        <h2 className="text-[14px] leading-[20px] font-semibold text-[#45464f] uppercase tracking-wider mb-2 md:hidden">
          Upcoming
        </h2>
        <h2 className="hidden md:flex font-bold text-[24px] leading-[32px] text-[#1a2b56] tracking-tight items-center gap-2">
          <Calendar className="w-6 h-6 text-[#1a2b56]" />
          Upcoming Sessions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {upcomingSessions.length === 0 ? (
            <p className="text-[#45464f] col-span-full">No upcoming sessions found.</p>
          ) : (
            upcomingSessions.map((session) => {
              const sessionTime = new Date(session.scheduled_at).getTime();
              const timeDiff = sessionTime - currentTime;
              const isJoinable = timeDiff <= 45 * 60 * 1000;
              
              let timeStr = "";
              if (!isJoinable) {
                if (timeDiff > 24 * 60 * 60 * 1000) {
                  const days = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
                  const hours = Math.floor((timeDiff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
                  timeStr = `${days}d ${hours}h`;
                } else {
                  const hours = Math.floor(timeDiff / (60 * 60 * 1000));
                  const mins = Math.floor((timeDiff % (60 * 60 * 1000)) / (60 * 1000));
                  timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
                }
              }

              return (
                <article key={session.id} className="bg-[#ffffff] rounded-xl p-4 md:p-5 shadow-[0_4px_12px_rgba(26,43,86,0.05)] border-[1.5px] border-[#1a2b56] md:border-transparent md:hover:border-[#1a2b56] transition-all duration-300 flex flex-col gap-4 relative group">
                  <div className="hidden md:inline-flex items-center gap-2 bg-[#dae1ff] text-[#1a2b56] font-semibold text-[12px] leading-[16px] px-3 py-1.5 rounded-full w-fit">
                    <Clock className="w-4 h-4" />
                    {new Date(session.scheduled_at).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex justify-between items-start md:hidden">
                    <div className="flex items-center gap-2 text-[#1a2b56] font-semibold text-[12px] leading-[16px] bg-[#fed65b]/30 px-3 py-1 rounded-full">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(session.scheduled_at).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:gap-4">
                    <div>
                      <h3 className="font-bold text-[16px] leading-[24px] text-[#1a2b56] leading-tight">
                        {session.title}
                      </h3>
                      <p className="font-semibold text-[13px] leading-[18px] text-[#45464f] mt-0.5 capitalize">
                        {session.topic || 'General Practice'}
                      </p>
                    </div>
                  </div>
                  <p className="text-[14px] leading-[20px] text-[#45464f] line-clamp-2">
                    {session.description || 'Join us for a live practice session!'}
                  </p>
                  <button 
                    disabled={!isJoinable}
                    onClick={() => router.push(`/sessions/${session.id}`)}
                    className={`mt-auto w-full hidden md:flex rounded-lg py-2.5 font-semibold text-[14px] leading-[20px] items-center justify-center gap-2 transition-all ${
                      isJoinable 
                        ? "cursor-pointer bg-[#1a2b56] text-[#ffffff] hover:bg-[#021541] hover:shadow-[0_4px_12px_rgba(26,43,86,0.15)] group-hover:-translate-y-0.5" 
                        : "bg-[#e3e2e0] text-[#9aa5b1] cursor-not-allowed"
                    }`}>
                    <Video className="w-[18px] h-[18px]" />
                    {isJoinable ? "Join Session" : `${timeStr} until session`}
                  </button>
                  <button 
                    disabled={!isJoinable}
                    onClick={() => router.push(`/sessions/${session.id}`)}
                    className={`mt-auto w-full md:hidden rounded-lg py-2 px-4 font-semibold text-[14px] leading-[20px] flex items-center justify-center gap-2 transition-all ${
                      isJoinable
                        ? "cursor-pointer bg-[#1a2b56] text-[#ffffff] hover:opacity-90 active:scale-95 shadow-md"
                        : "bg-[#e3e2e0] text-[#9aa5b1] cursor-not-allowed"
                    }`}>
                    <Video className="w-[18px] h-[18px]" />
                    {isJoinable ? "Join Call" : `${timeStr} until session`}
                  </button>
                </article>
              );
            })
          )}
        </div>
      </section>

      {/* Previous Sessions */}
      <section className="flex flex-col gap-4 md:gap-5 mt-2">
        <h2 className="text-[14px] leading-[20px] font-semibold text-[#45464f] uppercase tracking-wider mb-2 md:hidden">
          Previous
        </h2>
        <h2 className="hidden md:flex font-bold text-[24px] leading-[32px] text-[#1a2b56] tracking-tight items-center gap-2 opacity-90">
          <History className="w-6 h-6 text-[#1a2b56]" />
          Previous Sessions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {completedSessions.length === 0 ? (
            <p className="text-[#45464f] col-span-full">No previous sessions found.</p>
          ) : (
            completedSessions.map((session) => (
              <article key={session.id} className="bg-[#f4f3f1] md:bg-[#efeeeb] rounded-xl p-4 md:p-5 border-none md:border-[1.5px] border-[#e3e2e0] flex flex-col gap-4">
                <div className="flex justify-between items-start md:opacity-100 opacity-75">
                  <div className="inline-flex items-center gap-2 text-[#45464f] font-semibold text-[12px] leading-[16px] w-fit">
                    <History className="w-4 h-4 md:hidden" />
                    <Calendar className="w-4 h-4 hidden md:block" />
                    {new Date(session.scheduled_at).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </div>
                  <div className="flex md:hidden text-[#735c00] items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 md:gap-4 opacity-75 md:opacity-100">
                  <div className="flex-1">
                    <h3 className="font-bold text-[16px] leading-[24px] text-[#1a2b56] leading-tight">
                      {session.title}
                    </h3>
                    <p className="md:hidden font-semibold text-[13px] leading-[18px] text-[#45464f] capitalize">{session.topic || 'General Practice'}</p>
                    <div className="hidden md:flex items-center gap-1 text-[#735c00] mt-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-[14px] h-[14px] fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[14px] leading-[20px] text-[#1a1c1a] md:text-[#45464f] opacity-75 md:opacity-80 line-clamp-2">
                  {session.ai_summary || session.description || "No summary available."}
                </p>
                <button 
                  onClick={() => handleWatchRecording(session.id)}
                  disabled={recordingLoading === session.id}
                  className="cursor-pointer hidden md:flex mt-auto w-full border-[1.5px] border-[#1a2b56] text-[#1a2b56] rounded-lg py-2.5 font-semibold text-[14px] leading-[20px] items-center justify-center gap-2 hover:bg-[#e9e8e5] transition-colors disabled:opacity-70 disabled:cursor-wait"
                >
                  {recordingLoading === session.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                  Watch Recording
                </button>
                <div className="md:hidden mt-2 border-t border-[#c5c6d0]/30 pt-3 flex justify-between items-center">
                  <span className="font-semibold text-[14px] leading-[20px] text-[#1a2b56]">Recording</span>
                  <button onClick={() => handleWatchRecording(session.id)} disabled={recordingLoading === session.id} className="cursor-pointer text-[#1a2b56] font-semibold text-[14px] leading-[20px] hover:underline disabled:opacity-50">
                    {recordingLoading === session.id ? "Loading..." : "Watch Recording"}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
