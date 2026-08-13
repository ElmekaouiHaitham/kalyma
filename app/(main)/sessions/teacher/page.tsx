"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { 
  Loader2,
  Calendar, 
  Clock, 
  Video, 
  Users
} from "lucide-react";

export default function TeacherSessionsPage() {
  const router = useRouter();
  const { session: authSession, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teacherData, setTeacherData] = useState<any>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!authSession) {
      router.push("/auth");
      return;
    }

    const fetchTeacherData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/teacher/me`, {
          headers: {
            Authorization: `Bearer ${authSession.access_token}`
          }
        });
        
        if (res.status === 403) {
          setError("UNAUTHORIZED");
          return;
        }
        
        if (!res.ok) throw new Error("Failed to load teacher dashboard");
        
        const data = await res.json();
        setTeacherData(data);
      } catch (err) {
        console.error(err);
        setError("ERROR");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeacherData();
  }, [authSession, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3 mt-20">
        <Loader2 className="w-10 h-10 text-[#021541] animate-spin" />
        <p className="font-medium text-[#45464f] animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  if (error === "UNAUTHORIZED") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(26,43,94,0.12)] text-center border border-[#1a2b5e]/5">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-3xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1a2b5e] mb-3">Unauthorized</h2>
          <p className="text-[#4a5568] leading-relaxed mb-8">
            You do not have a teacher profile associated with this account.
          </p>
          <button
            onClick={() => router.push("/sessions")}
            className="w-full py-4 bg-[#1a2b5e] text-white rounded-xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Return to Sessions
          </button>
        </div>
      </div>
    );
  }

  if (error || !teacherData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-red-500 font-bold">An error occurred while loading your dashboard.</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-5 md:px-10 pt-20 pb-8 md:py-12 flex flex-col gap-8 md:gap-10 text-[#1a1c1a]">
      <header>
        <h1 className="text-[28px] md:text-[32px] leading-[34px] md:leading-[40px] font-extrabold text-[#1a2b56] tracking-tight">
          Teacher Dashboard
        </h1>
        <p className="text-[16px] leading-[24px] text-[#45464f] mt-2">
          Welcome, {teacherData.teacher.display_name}. Manage your assigned sessions and host live rooms here.
        </p>
      </header>

      <section className="flex flex-col gap-4 md:gap-5">
        <h2 className="font-bold text-[24px] leading-[32px] text-[#1a2b56] tracking-tight items-center gap-2 flex">
          <Calendar className="w-6 h-6 text-[#1a2b56]" />
          My Sessions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {teacherData.sessions.length === 0 ? (
            <p className="text-[#45464f] col-span-full">You have no assigned sessions.</p>
          ) : (
            teacherData.sessions.map((session: any) => (
              <article key={session.id} className="bg-[#ffffff] rounded-xl p-4 md:p-5 shadow-[0_4px_12px_rgba(26,43,86,0.05)] border-[1.5px] border-[#1a2b5e]/20 transition-all duration-300 flex flex-col gap-4 relative group">
                <div className="flex justify-between items-start">
                  <div className={`font-semibold text-[12px] leading-[16px] px-3 py-1 rounded-full w-fit flex items-center gap-2 ${
                    session.status === 'live' ? 'bg-red-500/20 text-red-600' :
                    session.status === 'completed' ? 'bg-green-500/20 text-green-700' :
                    'bg-[#dae1ff] text-[#1a2b56]'
                  }`}>
                    <Clock className="w-4 h-4" />
                    {new Date(session.scheduled_at).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{session.status}</span>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                  <div>
                    <h3 className="font-bold text-[16px] leading-[24px] text-[#1a2b56] leading-tight">
                      {session.title}
                    </h3>
                    <p className="font-semibold text-[13px] leading-[18px] text-[#45464f] mt-0.5 capitalize">
                      {session.topic || 'General'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 mt-2 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                     <Clock size={16} /> {session.duration_mins} mins
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                     <Users size={16} /> Max {session.max_attendees || '∞'} attendees
                  </div>
                </div>

                <button 
                  onClick={() => router.push(`/sessions/${session.id}`)}
                  disabled={session.status === 'completed'}
                  className={`mt-auto w-full rounded-lg py-2.5 font-bold text-[14px] leading-[20px] flex items-center justify-center gap-2 transition-all ${
                    session.status === 'completed' 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#c9a84c] text-white hover:bg-[#b0913f] hover:shadow-lg shadow-[#c9a84c]/20'
                  }`}>
                  <Video className="w-[18px] h-[18px]" />
                  {session.status === 'completed' ? 'Session Completed' : 'Enter Session as Host'}
                </button>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
