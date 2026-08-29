"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Loader2,
  Trophy, 
  User, 
  CalendarDays, 
  Gavel, 
  History, 
  Star, 
  ArrowRight,
  Clock,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "@/app/providers";

export default function DebatePage() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"needs_onboarding" | "processing" | "active">("needs_onboarding");
  type Day = "saturday" | "sunday";
  const [slots, setSlots] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const { session, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/debate/status`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStatus(data.status);
          
          if (data.status === "active") {
            const matchesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/debate/my-matches`, {
              headers: { Authorization: `Bearer ${session.access_token}` }
            });
            if (matchesRes.ok) {
              setMatches(await matchesRes.json());
            }
          }
          
          if (data.status === "needs_onboarding") {
            const slotsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/debate/slots`, {
              headers: { Authorization: `Bearer ${session.access_token}` }
            });
            if (slotsRes.ok) {
              setSlots(await slotsRes.json());
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch debate status", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [session, authLoading]);

  const handleBookSlot = async (slotId: string) => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/debate/slots/${slotId}/book`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`
        }
      });
      
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.detail || "Failed to book slot");
        setLoading(false);
        return;
      }
      
      window.location.reload();
    } catch (err) {
      console.error("Booking error", err);
      alert("An error occurred during booking.");
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3 mt-20">
        <Loader2 className="w-10 h-10 text-[#021541] animate-spin" />
        <p className="font-medium text-[#45464f] animate-pulse">Loading...</p>
      </div>
    );
  }

  if (status === "needs_onboarding") {
    return (
      <main className="max-w-4xl mx-auto px-5 md:px-10 pt-20 pb-8 md:py-12 flex flex-col gap-6 text-[#1a1c1a] min-h-[80vh] justify-center">
        <div className="bg-[#ffffff] border-[1.5px] border-[#021541] rounded-2xl p-6 md:p-10 shadow-[0_4px_12px_rgba(2,21,65,0.08)] flex flex-col items-center text-center">
          <div className="bg-[#fed65b] text-[#745c00] p-4 rounded-full mb-4 border-2 border-[#735c00]">
            <Gavel className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-[26px] md:text-[32px] font-extrabold text-[#021541] tracking-tight mb-3">
            Book a Debate Session
          </h1>
          <p className="text-[15px] md:text-[16px] text-[#45464f] mb-8 max-w-xl">
            Select an available time slot below to lock in your next debate. Slots take two students and close automatically when full.
          </p>
          
          <div className="w-full text-left bg-[#f4f3f1] p-4 md:p-6 rounded-xl border border-[#c5c6d0] mb-8 overflow-y-auto max-h-[400px]">
            <h3 className="font-bold text-[#021541] mb-4 flex items-center gap-2 sticky top-0 bg-[#f4f3f1] pb-2 z-10">
              <CalendarDays className="w-5 h-5 text-[#c9842f]" /> 
              Upcoming Available Slots
            </h3>
            
            <div className="flex flex-col gap-3">
              {slots.filter(s => !s.is_booked).map(slot => {
                const startTime = new Date(slot.start_time);
                const isHalfBooked = slot.user1_id || slot.user2_id;
                return (
                  <div key={slot.id} className="flex justify-between items-center bg-white border border-[#cbd5e1] p-4 rounded-xl shadow-sm hover:border-[#1a2b5e] transition-all">
                    <div>
                      <p className="font-bold text-[#1a2b5e] text-lg">{startTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                      <p className="text-[#4a5568]">{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {isHalfBooked && (
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                          1 spot left
                        </span>
                      )}
                      <button 
                        onClick={() => handleBookSlot(slot.id)}
                        className="px-6 py-2 bg-[#021541] text-white rounded-lg font-semibold hover:bg-[#1a2b56] transition-colors"
                      >
                        Book Slot
                      </button>
                    </div>
                  </div>
                );
              })}
              {slots.filter(s => !s.is_booked).length === 0 && (
                <p className="text-center text-[#718096] py-4">No available slots at the moment.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (status === "processing") {
    return (
      <main className="max-w-3xl mx-auto px-5 md:px-10 pt-20 pb-8 md:py-12 flex flex-col gap-6 text-[#1a1c1a] min-h-[80vh] justify-center">
        <div className="bg-[#ffffff] border-[1.5px] border-[#021541] rounded-2xl p-8 md:p-12 shadow-[0_4px_12px_rgba(2,21,65,0.08)] flex flex-col items-center text-center">
          <div className="bg-[#e3e2e0] text-[#021541] p-4 rounded-full mb-6 border-[1.5px] border-[#021541] relative">
            <Clock className="w-10 h-10" />
            <div className="absolute top-0 right-0 w-4 h-4 bg-[#fed65b] rounded-full animate-ping border border-[#735c00]"></div>
          </div>
          <h1 className="text-[28px] md:text-[32px] font-extrabold text-[#021541] tracking-tight mb-4">
            You're in the Pool!
          </h1>
          <p className="text-[16px] text-[#45464f] mb-8 max-w-lg">
            We are currently matching you with opponents based on your availability and shared interests. You'll be assigned to a league shortly!
          </p>
          <div className="bg-[#f4f3f1] px-6 py-4 rounded-xl border border-[#c5c6d0] flex items-center gap-3 w-full md:w-auto">
            <Loader2 className="w-5 h-5 text-[#021541] animate-spin" />
            <span className="font-semibold text-[#021541]">Waiting for Admin to launch matches...</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-5 md:px-10 pt-20 pb-8 md:py-12 flex flex-col gap-6 text-[#1a1c1a] min-h-[80vh] justify-center">
      <div className="bg-[#ffffff] border-[1.5px] border-[#021541] rounded-2xl p-8 md:p-12 shadow-[0_4px_12px_rgba(2,21,65,0.08)] flex flex-col items-center text-center">
        <div className="bg-[#e3e2e0] text-[#021541] p-4 rounded-full mb-6 border-[1.5px] border-[#021541]">
          <CheckCircle2 className="w-12 h-12 text-[#4ade80]" />
        </div>
        <h1 className="text-[28px] md:text-[32px] font-extrabold text-[#021541] tracking-tight mb-4">
          Booking Confirmed!
        </h1>
        <p className="text-[16px] text-[#45464f] mb-8 max-w-lg">
          Your debate session is locked in. Get ready to debate!
        </p>
        
        {matches.length > 0 && (
          <div className="bg-[#f4f3f1] border border-[#c5c6d0] rounded-xl p-5 w-full max-w-md text-left">
            <h3 className="font-bold text-[#021541] text-lg mb-3 border-b border-[#c5c6d0] pb-2">Upcoming Session</h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-[#757680] font-medium">Time:</span>
                <span className="font-semibold text-[#1a1c1a]">
                  {new Date(matches[0].start_time).toLocaleString([], {
                    weekday: 'short', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[#757680] font-medium">Opponent:</span>
                <span className="font-semibold text-[#1a1c1a]">
                  {matches[0].opponent?.full_name || "Waiting for opponent..."}
                </span>
              </div>
            </div>
            
            <Link href={matches[0].room_url || "#"} className="block w-full mt-6">
              <button className="cursor-pointer w-full bg-[#021541] text-[#ffffff] font-semibold text-[14px] py-2.5 md:py-3 rounded-xl shadow-[0_4px_12px_rgba(2,21,65,0.08)] hover:bg-[#1a2b56] transition-all disabled:opacity-70 disabled:hover:bg-[#021541]" disabled={!matches[0].room_url}>
                {matches[0].room_url ? "Join Room" : "Link will be available soon"}
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
