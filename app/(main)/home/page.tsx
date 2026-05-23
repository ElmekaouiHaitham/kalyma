"use client";
import { motion } from "framer-motion";
import { 
  ChevronRight, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  Newspaper,
  MessageSquare,
  Flame,
  Zap,
  CircleUserRound
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/providers";
import { useState, useEffect } from "react";

// ── Components ──────────────────────────────────────────────────────────────

function SectionHeader({ title, href }: { title: string; href: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between mb-4 px-1">
      <h2
        className="text-[24px] font-semibold text-[#1a2b5e]"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {title}
      </h2>
      <button 
        onClick={() => router.push(href)}
        className="flex items-center gap-0.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#8b94a7] transition-colors hover:bg-[#f7f2ea] hover:text-black"
      >
        View All <ChevronRight size={14} />
      </button>
    </div>
  );
}

function ProgressCircle({ percent }: { percent: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      {/* Background circle */}
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="transparent"
          stroke="rgba(26,43,94,0.06)"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          cx="48"
          cy="48"
          r={radius}
          fill="transparent"
          stroke="url(#progressGradient)"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a2b5e" />
            <stop offset="100%" stopColor="#c9a84c" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-[#1a2b5e]">{percent}%</span>
      </div>
    </div>
  );
}

function DashboardCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div 
      className={`bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.035)] border border-[rgba(26,43,94,0.05)] ${className}`}
    >
      {children}
    </div>
  );
}

function PracticeCard({ 
  title, 
  subtitle, 
  xp, 
  badge, 
  gradient, 
  imageUrl,
  href 
}: { 
  title: string; 
  subtitle: string; 
  xp: number; 
  badge: string; 
  gradient: string;
  imageUrl?: string;
  href: string;
}) {
  const router = useRouter();
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(href)}
      className="relative w-full aspect-[1.85/1] rounded-[24px] overflow-hidden text-left p-4 flex flex-col justify-between"
      style={{ background: gradient }}
    >
      <div className="flex justify-between items-start">
        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
          {badge}
        </div>
      </div>
      
      <div className="z-10">
        <h3 className="text-white font-bold text-base leading-tight mb-1">{title}</h3>
        <p className="text-white/80 text-[11px] leading-tight max-w-[140px]">{subtitle}</p>
      </div>

      <div className="flex items-center justify-between mt-2 z-10">
        <span className="text-white/90 text-xs font-bold">+{xp} XP</span>
        <div className="flex gap-1">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 1 ? "bg-white" : "bg-white/30"}`} />
          ))}
        </div>
      </div>

      {imageUrl && (
        <div className="absolute right-0 bottom-0 w-1/2 h-full pointer-events-none">
           <Image src={imageUrl} alt="" fill className="object-contain object-right-bottom opacity-90" />
        </div>
      )}
    </motion.button>
  );
}

type XpHistoryEntry = {
  reason: string;
  created_at: string;
};

// ── Main Content ────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();
  const { user, session } = useAuth();
  const [xpHistory, setXpHistory] = useState<XpHistoryEntry[]>([]);

  useEffect(() => {
    if (session) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/gamification/me/xp-history`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      })
      .then(res => res.json())
      .then(data => {
         if(Array.isArray(data)) setXpHistory(data);
      })
      .catch(err => console.error(err));
    }
  }, [session]);

  const firstName = user?.full_name ? user.full_name.split(' ')[0] : 'Learner';

  const isToday = (dateString: string) => {
    if (!dateString) return false;
    const d = new Date(dateString);
    const today = new Date();
    return d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
  };

  const isThisWeek = (dateString: string) => {
    if (!dateString) return false;
    const d = new Date(dateString);
    const now = new Date();
    return (now.getTime() - d.getTime()) <= 7 * 24 * 60 * 60 * 1000;
  };

  const articleReadsThisWeek = xpHistory.filter(h => h.reason === 'article_completed' && isThisWeek(h.created_at)).length;
  const targetFreq = user?.preferences?.article_frequency || 2;
  const progressPercent = Math.min(100, Math.round((articleReadsThisWeek / Math.max(targetFreq, 1)) * 100));

  const hasArticleToday = xpHistory.some(h => h.reason === 'article_completed' && isToday(h.created_at));
  const hasReviewToday = xpHistory.some(h => h.reason === 'review_session' && isToday(h.created_at));
  const hasNewsToday = xpHistory.some(h => h.reason === 'news_read' && isToday(h.created_at));

  const todaysFeed = [
    { icon: BookOpen, text: "Read an Article", xp: 10, done: hasArticleToday, href: "/articles" },
    { icon: MessageSquare, text: "Review Session", xp: 10, done: hasReviewToday, href: "/chat" },
    { icon: Newspaper, text: "Read News", xp: 10, done: hasNewsToday, href: "/news" },
  ];

  return (
    <div className="relative min-h-full w-full overflow-x-hidden bg-[#f7f2ea] pb-12">
      <button
        onClick={() => router.push("/profile")}
        aria-label="Open profile settings"
        className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border bg-white text-sm font-semibold shadow-sm md:hidden"
        style={{ borderColor: "#eee6dd", color: "#1a2b5e" }}
      >
        <CircleUserRound size={22} />
      </button>

      <div className="mx-auto max-w-[1040px] px-6 pt-16 md:pt-12 lg:px-8">
        
        {/* ── HEADER ────────────────────────────────────────── */}
        <div className="mb-9 flex flex-col items-center text-center">
          <h1 className="text-[34px] font-semibold text-[#1a2b5e] mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Hello <span className="font-black">{firstName}!</span> 👋🏼
          </h1>
          <p className="text-[#667084] text-[22px] opacity-95">
            Ready to speak English with confidence?
          </p>
        </div>

        {/* ── DASHBOARD ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          
          {/* Progress Card */}
          <DashboardCard className="flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-[#1a2b5e] font-bold text-sm mb-3">Progress</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Flame size={16} className="text-[#c9a84c]" />
                    <span className="text-[#1a2b5e] text-sm font-bold">{user?.streak_count || 0}</span>
                    <div className="w-8 h-[1px] bg-[rgba(26,43,94,0.1)] mx-1" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap size={14} className="text-[#9aa5b1]" />
                    <span className="text-[11px] text-[#9aa5b1] font-bold">{user?.xp || 0} XP</span>
                  </div>
                </div>
              </div>
              <div className="scale-90 origin-top-right">
                <ProgressCircle percent={progressPercent} />
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/chat")}
              className="w-full bg-[#1a2b5e] py-3 rounded-2xl text-white text-sm font-bold shadow-[0_8px_20px_rgba(26,43,94,0.2)] mt-auto"
              style={{ background: "linear-gradient(135deg, #1a2b5e, #2d4080)" }}
            >
              Continue Learning
            </motion.button>
          </DashboardCard>

          {/* Today's Feed Card */}
          <DashboardCard>
            <div className="flex items-center gap-2 mb-5">
              <Award size={18} className="text-[#c9a84c]" />
              <h3 className="text-[#1a2b5e] font-bold text-sm">Today&apos;s Feed</h3>
            </div>
            
            <div className="space-y-3">
              {todaysFeed.map((item, i) => (
                <button
                  key={i}
                  onClick={() => router.push(item.href)}
                  className="w-full flex items-center gap-3 rounded-2xl text-left transition-colors hover:bg-[#f7f2ea] active:scale-[0.99]"
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${item.done ? "bg-[#f0fdf4]" : "bg-[#f0fafb]"}`}>
                    <item.icon size={18} className={item.done ? "text-[#10b981]" : "text-[#1a2b5e]"} />
                  </div>
                  <span className={`text-[13px] flex-1 ${item.done ? "text-[#9aa5b1] line-through decoration-[#9aa5b1]/30" : "text-[#1a2b5e] font-medium"}`}>
                    {item.text}
                  </span>
                  {item.done ? (
                     <CheckCircle2 size={16} className="text-[#10b981]" />
                  ) : (
                     <div className="bg-[rgba(26,43,94,0.04)] px-3 py-1.5 rounded-full text-[10px] font-bold text-[#9aa5b1]">
                       + {item.xp} XP
                     </div>
                  )}
                </button>
              ))}
            </div>
          </DashboardCard>

        </div>

        <div className="mb-10">
          <SectionHeader title="Practice" href="/chat" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <PracticeCard 
               title="Atlas AI"
               subtitle="Practice English conversation with AI Coach"
               xp={20}
               badge="AI"
               gradient="linear-gradient(135deg, #1a2b5e, #33599e)"
               imageUrl="/atlas-ai-card.svg"
               href="/chat"
             />
             <PracticeCard 
               title="Live Session"
               subtitle="Join interactive live English classes"
               xp={30}
               badge="LIVE"
               gradient="linear-gradient(135deg, #a78bfa, #c4b5fd)"
               imageUrl="/live-session-card.svg"
               href="/live"
             />
          </div>
        </div>

        {/* ── FOOTER TAGLINE ────────────────────────────────── */}
        <p className="text-center text-sm font-medium text-[#9aa5b1] pt-4 pb-8">
           Speak. Make mistakes. <span className="text-[#c9a84c] italic underline decoration-[#c9a84c]/30 underline-offset-4">Grow.</span>
        </p>

      </div>
    </div>
  );
}
