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
  Inbox
} from "lucide-react";

export default function SessionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const fetchUpcomingSessions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions`);
        if (res.ok) {
          const data = await res.json();
          const upcomingAndLive = data.filter((s: any) => s.status === 'scheduled' || s.status === 'live');
          setUpcomingSessions(upcomingAndLive);
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
          <article className="bg-[#f4f3f1] md:bg-[#efeeeb] rounded-xl p-4 md:p-5 border-none md:border-[1.5px] border-[#e3e2e0] flex flex-col gap-4">
            <div className="flex justify-between items-start md:opacity-100 opacity-75">
              <div className="inline-flex items-center gap-2 text-[#45464f] font-semibold text-[12px] leading-[16px] w-fit">
                <History className="w-4 h-4 md:hidden" />
                <Calendar className="w-4 h-4 hidden md:block" />
                Oct 12, {`10:00 AM`}
              </div>
              <div className="flex md:hidden text-[#735c00] items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4 opacity-75 md:opacity-100">
              <div className="w-10 h-10 md:w-12 h-12 rounded-full overflow-hidden grayscale-[20%] opacity-90 shrink-0 border border-[#c5c6d0] md:border-none">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvmzmRCREmh5UpJwIQmKVjqmxXlmLa-Hm7mxb7MN3Z6oUQIkJ4usxNsMsMDi-3xVxjGYxjjiM1L0M58hXIPl5AU9ZOBH4RzVO9tlROkvU15XjsmQQyjd7-Zd0rOHEhn1DZHkB5rKRX63FWQoJFQ9o1OaLcErjSNM08gENdd3820i2j8AOXaNFnbwGPS-1ZYBGZK6wSv2ic2s988UOIHfjq5oc-2k-InKdUTrKmn4M2cyZ2DIQ6kZt7" alt="Marc Dubois" className="w-full h-full object-cover hidden md:block" />
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWCtezPNhVfm7Eh8USH1jAjZAciT8hfJ7ApnsAlx-vJf_szOX3W1IaAc8PhCp7Gi8RerD0zMOEEyG8T0_Ab1dQdYebf02tDNoUMVf83yE56gWLibh7eL-aMWUZTJ2zvuUDZsXPLPAesieRO-lGAUWols-J-U5CbEIJpOI4hXSVUSNB5lYeKtNmfnGvapQrb4oH123W-tWuHdTaSO4TefvBMN08cmiMC1fJqIMYULQ6yghiPJmhz_H-" alt="Dr. Elena Rostova" className="w-full h-full object-cover block md:hidden" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[16px] leading-[24px] text-[#1a2b56] leading-tight">
                  <span className="hidden md:inline">Marc Dubois</span>
                  <span className="md:hidden">Dr. Elena Rostova</span>
                </h3>
                <p className="md:hidden font-semibold text-[13px] leading-[18px] text-[#45464f]">User Interviews Prep</p>
                <div className="hidden md:flex items-center gap-1 text-[#735c00] mt-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-[14px] h-[14px] fill-current" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-[14px] leading-[20px] text-[#1a1c1a] md:text-[#45464f] opacity-75 md:opacity-80 line-clamp-2">
              <span className="hidden md:inline">Focused on mastering subjunctive conjugations and conversational flow in professional settings...</span>
              <span className="md:hidden">Discussed the script for the upcoming user interviews. Great progress on identifying unbiased questions...</span>
            </p>
            <button className="cursor-pointer hidden md:flex mt-auto w-full border-[1.5px] border-[#1a2b56] text-[#1a2b56] rounded-lg py-2.5 font-semibold text-[14px] leading-[20px] items-center justify-center gap-2 hover:bg-[#e9e8e5] transition-colors">
              View Details
            </button>
            <div className="md:hidden mt-2 border-t border-[#c5c6d0]/30 pt-3 flex justify-between items-center">
              <span className="font-semibold text-[14px] leading-[20px] text-[#1a2b56]">Notes available</span>
              <button className="cursor-pointer text-[#1a2b56] font-semibold text-[14px] leading-[20px] hover:underline">View Summary</button>
            </div>
          </article>

          <article className="hidden md:flex bg-[#efeeeb] rounded-xl p-5 border-[1.5px] border-[#e3e2e0] flex-col gap-4">
            <div className="inline-flex items-center gap-2 text-[#45464f] font-semibold text-[12px] leading-[16px] w-fit">
              <Calendar className="w-4 h-4" />
              Oct 05, 2:15 PM
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 h-12 rounded-full overflow-hidden grayscale-[20%] opacity-90 shrink-0">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIUn11YROkMr7Y0t9_zG8Sbbag67gGI-pRg3bEiLwmh5iKfqDAhCk2FNT8gUOQk7mi95UUC3Xm4tFTjaYDAYCKlRXtoRddOwb7IUKpeUwoW7BQ8PBbE091walN1MIvax-rrjmcHWyXEaJ028MMI34vOD-lLjJw8vMPMet9mFugXOC0ShQ_XQrelLu5Xk0QKfvNlbXNtj100mswqdHpEjOT-chEWlQFTBfXRk_IizDFmWLuMVQf8FRZ" alt="Yuki Tanaka" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[16px] leading-[24px] text-[#1a2b56] leading-tight">
                  Yuki Tanaka
                </h3>
                <div className="flex items-center gap-1 text-[#735c00] mt-0.5">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-[14px] h-[14px] fill-current" />
                  ))}
                  <Star className="w-[14px] h-[14px] text-[#c5c6d0]" />
                </div>
              </div>
            </div>
            <p className="text-[14px] leading-[20px] text-[#45464f] opacity-80 line-clamp-2">
              Reviewed Katakana fundamentals and practiced ordering food in simulated restaurant scenarios...
            </p>
            <button className="cursor-pointer mt-auto w-full border-[1.5px] border-[#1a2b56] text-[#1a2b56] rounded-lg py-2.5 font-semibold text-[14px] leading-[20px] flex items-center justify-center gap-2 hover:bg-[#e9e8e5] transition-colors">
              View Details
            </button>
          </article>
        </div>
      </section>
    </main>
  );
}
