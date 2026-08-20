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
  const [availability, setAvailability] = useState<Record<Day, string[]>>({ saturday: [], sunday: [] });
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
        }
      } catch (err) {
        console.error("Failed to fetch debate status", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [session, authLoading]);

  const handleRegister = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/debate/register`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ availability })
      });
      
      if (!res.ok) {
        if (res.status === 403) {
          alert("Debate league is only available for Pro users.");
        } else {
          alert("Failed to register for the debate league.");
        }
        return;
      }
      
      setStatus("processing");
    } catch (err) {
      console.error("Registration error", err);
      alert("An error occurred during registration.");
    } finally {
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

  const HOURS = [
    "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", 
    "17:00", "18:00", "19:00", "20:00"
  ];
  const DAYS = ["Saturday", "Sunday"];

  const toggleHour = (day: string, hour: string) => {
    const d = day.toLowerCase() as "saturday" | "sunday";
    setAvailability(prev => {
      const current = prev[d] || [];
      if (current.includes(hour)) {
        return { ...prev, [d]: current.filter(h => h !== hour) };
      } else {
        return { ...prev, [d]: [...current, hour].sort() };
      }
    });
  };

  if (status === "needs_onboarding") {
    return (
      <main className="max-w-4xl mx-auto px-5 md:px-10 pt-20 pb-8 md:py-12 flex flex-col gap-6 text-[#1a1c1a] min-h-[80vh] justify-center">
        <div className="bg-[#ffffff] border-[1.5px] border-[#021541] rounded-2xl p-6 md:p-10 shadow-[0_4px_12px_rgba(2,21,65,0.08)] flex flex-col items-center text-center">
          <div className="bg-[#fed65b] text-[#745c00] p-4 rounded-full mb-4 border-2 border-[#735c00]">
            <Gavel className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-[26px] md:text-[32px] font-extrabold text-[#021541] tracking-tight mb-3">
            Join the Debate League
          </h1>
          <p className="text-[15px] md:text-[16px] text-[#45464f] mb-8 max-w-xl">
            Compete with top students, refine your arguments, and climb the leaderboard. Select all the hours you are available on the weekend (Morocco Time).
          </p>
          
          <div className="w-full text-left bg-[#f4f3f1] p-4 md:p-6 rounded-xl border border-[#c5c6d0] mb-8 overflow-x-auto">
            <h3 className="font-bold text-[#021541] mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#c9842f]" /> 
              Weekend Availability
            </h3>
            
            <div className="min-w-[400px]">
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div></div>
                {DAYS.map(day => (
                  <div key={day} className="text-center font-bold text-[#1a2b5e] bg-white border border-[#cbd5e1] rounded-lg py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col gap-2">
                {HOURS.map(hour => (
                  <div key={hour} className="grid grid-cols-3 gap-2 items-center">
                    <div className="text-right pr-4 font-semibold text-[#4a5568] text-sm">
                      {hour}
                    </div>
                    {DAYS.map(day => {
                      const d = day.toLowerCase() as "saturday" | "sunday";
                      const isSelected = (availability[d] || []).includes(hour);
                      return (
                        <button
                          key={`${day}-${hour}`}
                          onClick={() => toggleHour(day, hour)}
                          className={`
                            py-2 rounded-lg border text-sm font-medium transition-all
                            ${isSelected 
                              ? "bg-[#1a2b5e] border-[#1a2b5e] text-white shadow-inner" 
                              : "bg-white border-[#cbd5e1] text-[#4a5568] hover:border-[#1a2b5e] hover:bg-[#f0f4ff]"
                            }
                          `}
                        >
                          {isSelected ? "Available" : "-"}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleRegister}
            className="w-full md:w-auto px-10 bg-[#021541] text-[#ffffff] font-semibold text-[16px] py-3 md:py-4 rounded-xl shadow-[0_4px_12px_rgba(2,21,65,0.08)] hover:bg-[#1a2b56] transition-colors disabled:opacity-50"
            disabled={loading || (availability.saturday.length === 0 && availability.sunday.length === 0)}
          >
            {loading ? "Registering..." : "Register for Next League"}
          </button>
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
    <main className="max-w-7xl mx-auto px-5 md:px-10 pt-20 pb-8 md:py-12 flex flex-col gap-8 md:gap-10 text-[#1a1c1a]">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between bg-[#f4f3f1] p-6 md:p-8 rounded-2xl border-[1.5px] border-[#021541] shadow-[0_4px_12px_rgba(2,21,65,0.08)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center md:items-start w-full">
          {/* Mobile Badge */}
          <div className="md:hidden relative w-24 h-24 mb-4">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAR_Zn7015lSkXchb5kQS0In5OpXfSCU-riqSBISts-KBfXvLAXCoIdEDeFBQlse1_P5Lxf57N5xy22ft-oeoaYX0MCXPU7YU8TrNC5ymm7GHbGNkeequYsTrE0Xp34zMOFckwtb2KUhR78cc71c_jPz080ZN4OEV-JCGxa5PDmxoEVFCoZNfeIvuEAoKhDePrYaskk3AiznecTYIHJGVVlWYW1O3CWd1aREmIbbDYbNEJ0V1g9k8o7"
              alt="Badge"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-1 md:mb-2 text-center md:text-left">
            {/* Desktop Trophy Icon */}
            <div className="hidden md:flex bg-[#fed65b] text-[#745c00] p-3 rounded-full items-center justify-center border-2 border-[#735c00]">
              <Trophy className="w-8 h-8 fill-current" />
            </div>
            <h1 className="text-[28px] md:text-[32px] leading-[34px] md:leading-[40px] font-extrabold text-[#021541] tracking-tight">
              Debate League
            </h1>
          </div>
          <p className="text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] text-[#45464f] md:ml-[72px]">
            • 12 Days Remaining
          </p>
        </div>
        {/* Decorative element (Desktop) */}
        <div className="hidden md:block absolute right-0 top-0 opacity-10 pointer-events-none translate-x-4 -translate-y-4">
          <Trophy className="w-48 h-48 fill-current text-[#021541]" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column: Leaderboard */}
        <div className="lg:col-span-2 flex flex-col gap-5 md:gap-6">
          <section className="md:bg-[#ffffff] md:rounded-2xl md:border-[1.5px] md:border-[#021541] md:overflow-hidden md:shadow-[0_4px_12px_rgba(2,21,65,0.08)]">
            
            {/* Desktop Header */}
            <div className="hidden md:flex bg-[#021541] text-[#ffffff] p-5 border-b-[1.5px] border-[#021541] justify-between items-center">
              <h2 className="font-bold text-[24px] leading-[32px]">Rankings</h2>
            </div>
            
            {/* Mobile Header */}
            <h2 className="md:hidden font-bold text-[24px] leading-[32px] text-[#021541] flex items-center gap-2 mb-2">
              <Trophy className="w-6 h-6" /> Top Debaters
            </h2>

            <div className="overflow-x-auto bg-[#ffffff] p-4 md:p-0 rounded-xl md:rounded-none border-[1.5px] border-[#021541] md:border-none shadow-[2px_4px_0px_rgba(2,21,65,0.1)] md:shadow-none">
              <table className="w-full text-left border-collapse">
                <thead className="hidden md:table-header-group">
                  <tr className="bg-[#f4f3f1] border-b-[1.5px] border-[#c5c6d0] font-semibold text-[14px] text-[#45464f]">
                    <th className="p-4 text-center w-16">Rank</th>
                    <th className="p-4">Debater</th>
                    <th className="p-4 text-center">Points</th>
                    <th className="p-4 text-center">Form</th>
                  </tr>
                </thead>
                <tbody className="font-normal text-[16px] text-[#1a1c1a] flex flex-col md:table-row-group gap-2 md:gap-0">
                  
                  {/* Row 1 */}
                  <tr className="flex md:table-row justify-between items-center bg-[#fed65b]/20 md:border-b-[1.5px] md:border-[#c5c6d0]/50 hover:bg-[#f4f3f1] transition-colors p-2 md:p-0 rounded-lg md:rounded-none">
                    <td className="p-2 md:p-4 text-center font-bold text-[#735c00] md:w-16 flex items-center md:table-cell">
                      <span className="w-4 text-center inline-block">1</span>
                    </td>
                    <td className="p-2 md:p-4 flex items-center gap-3 flex-1 md:flex-none">
                      <img 
                        src="/profile_haitham.jpg" 
                        alt="Haitham Elmekaoui" 
                        className="w-10 h-10 md:w-8 md:h-8 rounded-full border border-[#021541] object-cover" 
                      />
                      <div className="flex flex-col md:block">
                        <span className="font-bold text-[#021541] md:text-[#1a1c1a] text-[14px] md:text-[16px]">Haitham Elmekaoui</span>
                        <span className="md:hidden text-[12px] text-[#45464f]">1240 pts</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell p-4 text-center font-bold">1,240</td>
                    <td className="p-2 md:p-4 md:table-cell flex items-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#735c00] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#735c00] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#735c00] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#c5c6d0] md:bg-[#f87171] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">L</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#735c00] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                      </div>
                    </td>
                  </tr>

                  {/* Row 2 (Current User in Desktop is 3, Mobile is 2. Let's make it 2 for both) */}
                  <tr className="flex md:table-row justify-between items-center bg-[#1a2b56]/10 md:bg-[#021541]/5 md:border-b-[1.5px] md:border-[#c5c6d0]/50 hover:bg-[#021541]/10 transition-colors md:border-l-4 md:border-l-[#021541] border border-[#021541] md:border-t-0 md:border-r-0 md:border-y-0 p-2 md:p-0 rounded-lg md:rounded-none">
                    <td className="p-2 md:p-4 text-center font-bold text-[#021541] md:w-16 flex items-center md:table-cell">
                      <span className="w-4 text-center inline-block">2</span>
                    </td>
                    <td className="p-2 md:p-4 flex items-center gap-3 flex-1 md:flex-none">
                      <img 
                        src="/profile_zhiri.jpg"      
                        alt="Zhiri Mohamed" 
                        className="w-10 h-10 md:w-8 md:h-8 rounded-full border-2 border-[#021541] object-cover" 
                      />
                      <div className="flex flex-col md:block">
                        <span className="font-bold text-[#021541] text-[14px] md:text-[16px]">Zhiri Mohamed</span>
                        <span className="md:hidden text-[12px] text-[#45464f]">1180 pts</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell p-4 text-center font-bold">1,180</td>
                    <td className="p-2 md:p-4 md:table-cell flex items-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#735c00] md:bg-[#f87171] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">L</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#735c00] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#c5c6d0] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#c5c6d0] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#735c00] md:bg-[#f87171] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">L</span></div>
                      </div>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  {/* <tr className="flex md:table-row justify-between items-center bg-transparent hover:bg-[#f4f3f1] transition-colors p-2 md:p-0 rounded-lg md:rounded-none">
                    <td className="p-2 md:p-4 text-center font-bold text-[#45464f] md:w-16 flex items-center md:table-cell md:font-normal">
                      <span className="w-4 text-center inline-block">3</span>
                    </td>
                    <td className="p-2 md:p-4 flex items-center gap-3 flex-1 md:flex-none">
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-FyY1t_uvUsDx8haH_FHtLzGkmKktDAWLEiaGulPBUV-j1MylLEYKoblNVoTCyMwKoJlwVU4nucvg5tTU7ql8RdK1UuahEAQiEBdOQctFo7X-CKrZC9WKLEa9JWc9uooNvwqI6e3Y3EJKAIlJI3YC_dKKkLZqTWyc60IigvzYZM0yMTwAzfL0CwfxAVCzmQ_0blDmOWNmVsRv1Bem8r76AoGsUkwurMH7Bl2kkUenNIr22XxWzv-Q" 
                        alt="Sam Taylor" 
                        className="w-10 h-10 md:w-8 md:h-8 rounded-full border border-[#c5c6d0] object-cover" 
                      />
                      <div className="flex flex-col md:block">
                        <span className="font-bold text-[#45464f] md:text-[#1a1c1a] md:font-semibold text-[14px] md:text-[16px]">Sam Taylor</span>
                        <span className="md:hidden text-[12px] text-[#757680]">1050 pts</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell p-4 text-center">1,050</td>
                    <td className="p-2 md:p-4 md:table-cell flex items-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#735c00] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#c5c6d0] md:bg-[#f87171] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">L</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#735c00] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#735c00] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#c5c6d0] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                      </div>
                    </td>
                  </tr> */}

                  {/* Row 4 (Desktop only essentially) */}
                  {/* <tr className="hidden md:table-row hover:bg-[#f4f3f1] transition-colors text-[#757680]">
                    <td className="p-4 text-center w-16">4</td>
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#e9e8e5] border border-[#c5c6d0] flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <span>Alex Rivera</span>
                    </td>
                    <td className="p-4 text-center">980</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-70">
                        <div className="w-6 h-6 rounded-full bg-[#f87171] flex items-center justify-center text-white text-xs font-bold">L</div>
                        <div className="w-6 h-6 rounded-full bg-[#f87171] flex items-center justify-center text-white text-xs font-bold">L</div>
                        <div className="w-6 h-6 rounded-full bg-[#4ade80] flex items-center justify-center text-white text-xs font-bold">W</div>
                        <div className="w-6 h-6 rounded-full bg-[#f87171] flex items-center justify-center text-white text-xs font-bold">L</div>
                        <div className="w-6 h-6 rounded-full bg-[#f87171] flex items-center justify-center text-white text-xs font-bold">L</div>
                      </div>
                    </td>
                  </tr> */}

                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column: Matches & History */}
        <div className="lg:col-span-1 flex flex-col gap-5 md:gap-6">
          
          {/* Upcoming Matches */}
          <section className="flex flex-col gap-4">
            <h2 className="md:hidden font-bold text-[24px] leading-[32px] text-[#021541] flex items-center gap-2">
              <CalendarDays className="w-6 h-6" /> Upcoming Match
            </h2>
            <h3 className="hidden md:flex font-bold text-[24px] leading-[32px] mb-2 items-center gap-2">
              <CalendarDays className="w-6 h-6 text-[#735c00]" />
              Upcoming
            </h3>

            {matches.length > 0 ? (
              <div className="bg-[#ffffff] border-[1.5px] border-[#021541] rounded-2xl p-5 md:p-6 shadow-[0_4px_12px_rgba(2,21,65,0.08)] flex flex-col gap-4 relative overflow-hidden">
                <div className="md:hidden absolute -right-4 -top-4 w-24 h-24 bg-[#b5c5f9] rounded-full opacity-20 blur-xl"></div>
                <div className="flex justify-between items-start z-10">
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-[#735c00] tracking-wider uppercase mb-1">
                      {matches[0].scheduled_time 
                        ? new Date(matches[0].scheduled_time).toLocaleString()
                        : "TBD"}
                    </span>
                    <h4 className="font-bold text-[18px] leading-tight text-[#021541] md:text-[#1a1c1a]">Assigned Topic</h4>
                  </div>
                  {/* Mobile Gavel Icon */}
                  <span className="md:hidden bg-[#efeeeb] text-[#1a2b56] p-2 rounded-full">
                    <Gavel className="w-5 h-5" />
                  </span>
                  {/* Desktop Ranked Badge */}
                  <div className="hidden md:flex bg-[#f4f3f1] border border-[#c5c6d0] rounded-full px-3 py-1 items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4ade80]"></span>
                    <span className="font-semibold text-[12px] capitalize">{matches[0].status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 z-10 mt-1 md:mt-0 bg-transparent md:bg-[#f4f3f1] p-0 md:p-3 rounded-xl">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#021541] bg-[#e2e8f0] flex items-center justify-center">
                    <User className="w-4 h-4 text-[#4a5568]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[12px] text-[#757680]">Opponent</p>
                    <p className="font-bold text-[14px] text-[#021541] md:text-[#1a1c1a]">{matches[0].opponent?.full_name}</p>
                  </div>
                </div>
                
                <Link href={matches[0].room_url || "#"} className="block w-full mt-1 md:mt-2">
                  <button className="cursor-pointer w-full bg-[#021541] text-[#ffffff] font-semibold text-[14px] py-2.5 md:py-3 rounded-xl shadow-[0_4px_12px_rgba(2,21,65,0.08)] hover:bg-[#1a2b56] active:translate-y-1 active:shadow-none transition-all" disabled={!matches[0].room_url}>
                    {matches[0].room_url ? "Join Room" : "Pending Room"}
                  </button>
                </Link>
              </div>
            ) : (
              <div className="bg-[#f4f3f1] border-[1.5px] border-[#c5c6d0] rounded-2xl p-6 text-center text-[#757680]">
                No upcoming matches.
              </div>
            )}
          </section>

          {/* Previous Debates */}
          <section className="flex flex-col gap-4 mt-2 md:mt-0">
            <h2 className="md:hidden font-bold text-[24px] leading-[32px] text-[#021541] flex items-center gap-2">
              <History className="w-6 h-6" /> Recent Debates
            </h2>
            <h3 className="hidden md:flex font-bold text-[24px] leading-[32px] mb-2 mt-4 items-center gap-2">
              <History className="w-6 h-6 text-[#757680]" />
              History
            </h3>

            <div className="flex flex-col gap-3 md:gap-4">
              
              {/* History Card 1 */}
              {/* <div className="bg-[#ffffff] border-[1.5px] border-[#c5c6d0] rounded-2xl p-4 md:p-5 hover:border-[#021541] transition-colors cursor-pointer group flex flex-col gap-2 md:gap-0">
                <div className="flex justify-between items-center md:items-start mb-1 md:mb-2">
                  <h4 className="font-semibold text-[16px] md:font-bold md:text-[18px] text-[#021541] md:text-[#1a1c1a] group-hover:text-[#021541] transition-colors">Universal Basic Income</h4>
                  <span className="hidden md:inline font-semibold text-[12px] text-[#757680]">OCT 12</span>
                  <div className="md:hidden flex items-center gap-1 bg-[#fed65b] px-2 py-1 rounded-md">
                    <Star className="w-3 h-3 text-[#745c00] fill-current" />
                    <span className="font-semibold text-[12px] text-[#745c00]">8.5/10</span>
                  </div>
                </div>
                
                <p className="md:hidden text-[14px] text-[#45464f] line-clamp-2">Strong opening statement, but rebuttal needed more factual grounding.</p>

                <div className="flex items-center justify-between mt-1 md:mt-4">
                  <div className="hidden md:flex text-[#fed65b]">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 text-[#c5c6d0]" />
                  </div>
                  <button className="text-[#021541] font-semibold text-[14px] flex items-center gap-1 hover:text-[#735c00] md:hover:underline transition-colors mt-2 md:mt-0 p-0 md:p-0">
                    View Feedback <ArrowRight className="w-4 h-4 md:hidden" />
                  </button>
                </div>
              </div> */}

              {/* History Card 2 */}
              <div className="bg-[#ffffff] border-[1.5px] border-[#c5c6d0] rounded-2xl p-4 md:p-5 hover:border-[#021541] transition-colors cursor-pointer group flex flex-col gap-2 md:gap-0 opacity-100 md:opacity-100">
                <div className="flex justify-between items-center md:items-start mb-1 md:mb-2">
                  <h4 className="font-semibold text-[16px] md:font-bold md:text-[18px] text-[#021541] md:text-[#1a1c1a] group-hover:text-[#021541] transition-colors line-clamp-2 md:line-clamp-none pr-4 md:pr-0">
                    <span className="md:hidden">Space Exploration vs. Ocean Exploration</span>
                    <span className="hidden md:inline">AI Regulation Ethics</span>
                  </h4>
                  {/* Desktop Date */}
                  <span className="hidden md:inline font-semibold text-[12px] text-[#757680]">OCT 05</span>
                  {/* Mobile Badge */}
                  <div className="md:hidden flex items-center gap-1 bg-[#e3e2e0] px-2 py-1 rounded-md shrink-0">
                    <Star className="w-3 h-3 text-[#45464f] fill-current" />
                    <span className="font-semibold text-[12px] text-[#45464f]">7.2/10</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1 md:mt-4">
                  {/* Desktop Stars */}
                  <div className="hidden md:flex text-[#fed65b]">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 text-[#c5c6d0]" />
                    <Star className="w-5 h-5 text-[#c5c6d0]" />
                  </div>
                  <Link href="/debate/feedback">
                    <button className="text-[#021541] font-semibold text-[14px] flex items-center gap-1 hover:text-[#735c00] md:hover:underline transition-colors mt-2 md:mt-0 p-0 md:p-0">
                      View Feedback <ArrowRight className="w-4 h-4 md:hidden" />
                    </button>
                  </Link>
                </div>
              </div>

            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
