"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Loader2,
  ArrowLeft, 
  Star,
  CheckCircle2,
  TrendingUp,
  Lightbulb,
  FileText,
  Sparkles,
  Award,
  Gavel
} from "lucide-react";

export default function DebateFeedbackPage() {
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
      
      {/* Header Section */}
      <div className="flex flex-col gap-4 border-b-[1.5px] border-[#c5c6d0] pb-8">
        <div className="flex items-center gap-3 md:gap-4 mb-2">
          <Link href="/debate" className="flex items-center justify-center w-10 h-10 rounded-full border border-[#c5c6d0] bg-[#ffffff] hover:bg-[#f4f3f1] transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#021541]" />
          </Link>
          <h1 className="text-[28px] md:text-[32px] leading-[34px] md:leading-[40px] font-extrabold text-[#021541] tracking-tight">
            Match Feedback
          </h1>
        </div>

        <div className="flex flex-col gap-3 md:pl-14">
          <div className="flex flex-wrap items-center justify-start gap-3">
            <span className="text-[14px] font-bold text-[#757680] tracking-wider uppercase">OCT 05, 2026</span>
            <div className="flex bg-[#e3e2e0] text-[#1a1c1a] rounded-full px-3 py-1 items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f87171]"></span>
              <span className="font-semibold text-[12px]">Loss</span>
            </div>
            <div className="flex bg-[#fed65b] text-[#745c00] rounded-full px-3 py-1 items-center gap-1.5 ml-auto md:ml-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-[12px]">7.2 / 10 Score</span>
            </div>
          </div>
          <h2 className="font-extrabold text-[32px] md:text-[40px] leading-[40px] md:leading-[48px] text-[#021541]">
            AI Regulation Ethics
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:pl-14">
        
        {/* Left Column: Feedback Details */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          <section className="flex flex-col gap-4">
            <h3 className="font-bold text-[18px] text-[#1a1c1a] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#4ade80]" />
              Strong Points
            </h3>
            <div className="bg-[#ffffff] border-[1.5px] border-[#c5c6d0] rounded-xl p-5 shadow-sm">
              <p className="text-[15px] leading-[24px] text-[#1a1c1a]">
                You had a very strong opening statement that clearly defined the boundaries of AI sentience. Your ability to articulate the ethical dilemmas in a digestible way set a great tone for the debate.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="font-bold text-[18px] text-[#1a1c1a] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#f87171]" />
              Areas for Improvement
            </h3>
            <div className="bg-[#ffffff] border-[1.5px] border-[#c5c6d0] rounded-xl p-5 shadow-sm">
              <p className="text-[15px] leading-[24px] text-[#1a1c1a]">
                The rebuttal needed significantly more factual grounding. When your opponent brought up the economic impact of global policies, you relied too heavily on emotional arguments rather than citing historical precedents or economic data.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="font-bold text-[18px] text-[#1a1c1a] flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#fed65b]" />
              Tips for Next Time
            </h3>
            <div className="bg-[#fefce8] border-[1.5px] border-[#fef08a] rounded-xl p-5 shadow-sm">
              <ul className="list-disc pl-5 text-[15px] leading-[26px] text-[#745c00] flex flex-col gap-1 font-medium">
                <li>Prepare at least 3 concrete statistics for your rebuttals.</li>
                <li>Anticipate counter-arguments regarding the enforcement of international laws.</li>
                <li>Pace your delivery; you rushed through your closing remarks.</li>
              </ul>
            </div>
          </section>

        </div>

        {/* Right Column: Score Breakdown & Jury */}
        <div className="md:col-span-1 flex flex-col gap-6">
          
          <section className="flex flex-col gap-3">
            <h3 className="font-bold text-[18px] text-[#1a1c1a] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#45464f]" />
              Score Breakdown
            </h3>
            <div className="bg-[#ffffff] border-[1.5px] border-[#c5c6d0] rounded-xl p-5 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#45464f]">Logic & Reasoning</span>
                <span className="text-[14px] font-bold text-[#021541]">8/10</span>
              </div>
              <div className="w-full bg-[#f4f3f1] rounded-full h-2">
                <div className="bg-[#021541] h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-[14px] font-semibold text-[#45464f]">Rebuttal Quality</span>
                <span className="text-[14px] font-bold text-[#021541]">5/10</span>
              </div>
              <div className="w-full bg-[#f4f3f1] rounded-full h-2">
                <div className="bg-[#f87171] h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-[14px] font-semibold text-[#45464f]">Delivery & Pace</span>
                <span className="text-[14px] font-bold text-[#021541]">8.5/10</span>
              </div>
              <div className="w-full bg-[#f4f3f1] rounded-full h-2">
                <div className="bg-[#021541] h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3 mt-2">
            <h3 className="font-bold text-[18px] text-[#1a1c1a] flex items-center gap-2">
              <Gavel className="w-5 h-5 text-[#45464f]" />
              Graded By
            </h3>
            <div className="flex items-center gap-4 bg-[#f4f3f1] border-[1.5px] border-[#c5c6d0] p-4 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-[#e3e2e0] border border-[#c5c6d0] flex items-center justify-center shrink-0 overflow-hidden">
                <img src="/profile_zhiri.jpg" alt="Mentor" className="w-full h-full object-cover grayscale opacity-80" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[16px] text-[#021541]">Prof. A. Thorne</span>
                <span className="text-[12px] font-semibold text-[#757680] mt-0.5 uppercase tracking-wider">Jury Mentor</span>
              </div>
            </div>
          </section>

        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-10 md:pl-14 border-t-[1.5px] border-[#c5c6d0] pt-8">
        <button className="cursor-pointer w-full bg-[#021541] text-[#ffffff] font-semibold text-[16px] py-4 rounded-xl shadow-[0_4px_12px_rgba(2,21,65,0.12)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 hover:bg-[#0f1d4e]">
          <FileText className="w-5 h-5" />
          Review Full Transcript
        </button>
        
        <button className="cursor-pointer w-full bg-[#ffffff] border-[1.5px] border-[#021541] text-[#021541] font-semibold text-[16px] py-4 rounded-xl active:translate-y-1 active:shadow-none hover:bg-[#021541]/5 transition-all flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" />
          Practice topics with Atlas Chat
        </button>
      </div>

    </main>
  );
}
