"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Loader2,
  ArrowLeft, 
  CalendarDays, 
  User, 
  Trophy, 
  Swords, 
  Sparkles,
  Gavel,
  BarChart2,
  HelpCircle,
  Lightbulb
} from "lucide-react";

export default function DebateDetailsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
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
    <main className="max-w-4xl mx-auto px-5 md:px-10 pt-20 pb-12 md:py-12 flex flex-col gap-8 md:gap-10 text-[#1a1c1a]">
      
      {/* Header Section (Not in a card) */}
      <div className="flex flex-col gap-4 border-b-[1.5px] border-[#c5c6d0] pb-8">
        <div className="flex items-center gap-3 md:gap-4 mb-2">
          <Link href="/debate" className="flex items-center justify-center w-10 h-10 rounded-full border border-[#c5c6d0] bg-[#ffffff] hover:bg-[#f4f3f1] transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#021541]" />
          </Link>
          <h1 className="text-[28px] md:text-[32px] leading-[34px] md:leading-[40px] font-extrabold text-[#021541] tracking-tight">
            Match Details
          </h1>
        </div>

        <div className="flex flex-col gap-3 md:pl-14">
          <div className="flex items-center justify-start gap-4">
            <span className="text-[14px] font-bold text-[#735c00] tracking-wider uppercase">Tomorrow, 2:00 PM</span>
            <div className="flex bg-[#e3e2e0] text-[#1a1c1a] rounded-full px-3 py-1 items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4ade80]"></span>
              <span className="font-semibold text-[12px]">Ranked Match</span>
            </div>
          </div>
          <h2 className="font-extrabold text-[32px] md:text-[40px] leading-[40px] md:leading-[48px] text-[#021541]">
            AI in Healthcare: Boon or Bane?
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-8 md:pl-14">
        
        {/* Description Section */}
        <section className="flex flex-col gap-3">
          <h3 className="font-bold text-[18px] text-[#1a1c1a] flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#45464f]" />
            About this Debate
          </h3>
          <p className="text-[16px] leading-[26px] text-[#45464f]">
            Join this ranked debate match to explore the ethical, practical, and economic impacts of Artificial Intelligence in modern healthcare systems. You will be expected to present well-researched arguments on whether AI will revolutionize patient care or introduce dangerous biases into medical decision-making. Prepare your opening statements and rebuttals carefully.
          </p>
        </section>

        {/* Participants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          
          {/* Opponent Detailed Section */}
          <section className="flex flex-col gap-3">
            <h3 className="font-bold text-[18px] text-[#1a1c1a] flex items-center gap-2">
              <User className="w-5 h-5 text-[#45464f]" />
              Your Opponent
            </h3>
            
            <div className="bg-[#ffffff] border-[1.5px] border-[#c5c6d0] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-4 border-b-[1.5px] border-[#e3e2e0] pb-4">
                <img 
                  src="/profile_haitham.jpg" 
                  alt="Haitham Elmekaoui" 
                  className="w-16 h-16 rounded-full border-[1.5px] border-[#021541] object-cover shrink-0" 
                />
                <div className="flex flex-col">
                  <span className="font-bold text-[18px] text-[#021541]">Haitham Elmekaoui</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Trophy className="w-4 h-4 text-[#735c00]" />
                    <span className="font-semibold text-[14px] text-[#45464f]">Rank 1 • 1,240 pts</span>
                  </div>
                </div>
              </div>

              {/* More Details */}
              <div className="grid grid-cols-2 gap-4 mt-1">
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-semibold text-[#757680] uppercase tracking-wider flex items-center gap-1">
                    <BarChart2 className="w-3.5 h-3.5" /> Win Rate
                  </span>
                  <span className="font-bold text-[16px] text-[#1a1c1a]">82% (42 Matches)</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-semibold text-[#757680] uppercase tracking-wider">Recent Form</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="w-5 h-5 rounded-full bg-[#4ade80] flex items-center justify-center text-white text-[10px] font-bold">W</div>
                    <div className="w-5 h-5 rounded-full bg-[#4ade80] flex items-center justify-center text-white text-[10px] font-bold">W</div>
                    <div className="w-5 h-5 rounded-full bg-[#4ade80] flex items-center justify-center text-white text-[10px] font-bold">W</div>
                    <div className="w-5 h-5 rounded-full bg-[#f87171] flex items-center justify-center text-white text-[10px] font-bold">L</div>
                    <div className="w-5 h-5 rounded-full bg-[#4ade80] flex items-center justify-center text-white text-[10px] font-bold">W</div>
                  </div>
                </div>
                <div className="col-span-2 flex flex-col gap-1 mt-1">
                  <span className="text-[12px] font-semibold text-[#757680] uppercase tracking-wider flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5" /> Strongest Topics
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="bg-[#e3e2e0] text-[#1a1c1a] px-2 py-1 rounded-md text-[12px] font-semibold">Technology</span>
                    <span className="bg-[#e3e2e0] text-[#1a1c1a] px-2 py-1 rounded-md text-[12px] font-semibold">Ethics</span>
                    <span className="bg-[#e3e2e0] text-[#1a1c1a] px-2 py-1 rounded-md text-[12px] font-semibold">Economics</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Jury Section */}
          <section className="flex flex-col gap-3">
            <h3 className="font-bold text-[18px] text-[#1a1c1a] flex items-center gap-2">
              <Gavel className="w-5 h-5 text-[#45464f]" />
              Jury
            </h3>
            
            <div className="bg-[#ffffff] border-[1.5px] border-dashed border-[#c5c6d0] rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center gap-4 h-full min-h-[220px]">
              <div className="w-16 h-16 rounded-full bg-[#f4f3f1] border border-[#c5c6d0] flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-[#757680]" />
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="font-bold text-[18px] text-[#45464f]">To Be Determined</span>
                <span className="text-[14px] text-[#757680] mt-1 px-4">
                  A certified jury mentor will be assigned to moderate and score this debate match.
                </span>
              </div>
            </div>
          </section>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-10">
          <button className="cursor-pointer w-full bg-[#021541] text-[#ffffff] font-semibold text-[16px] py-4 rounded-xl shadow-[0_4px_12px_rgba(2,21,65,0.12)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 hover:bg-[#0f1d4e]">
            <Swords className="w-5 h-5" />
            Prepare Arguments
          </button>
          
          <button className="cursor-pointer w-full bg-[#ffffff] border-[1.5px] border-[#021541] text-[#021541] font-semibold text-[16px] py-4 rounded-xl active:translate-y-1 active:shadow-none hover:bg-[#021541]/5 transition-all flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Practice the debate with Atlas Chat
          </button>
        </div>
      </div>
    </main>
  );
}
