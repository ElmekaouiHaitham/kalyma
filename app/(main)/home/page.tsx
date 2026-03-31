"use client";
import { motion } from "framer-motion";
import { 
  ChevronRight, 
  CheckCircle2, 
  Search, 
  Mic, 
  Award, 
  BookOpen, 
  Newspaper,
  MessageSquare,
  Sparkles,
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ── Components ──────────────────────────────────────────────────────────────

function SectionHeader({ title, href }: { title: string; href: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between mb-4 px-1">
      <h2 className="text-lg font-bold text-[#1a2b5e]">{title}</h2>
      <button 
        onClick={() => router.push(href)}
        className="text-xs font-semibold text-[#9aa5b1] flex items-center gap-0.5 hover:text-[#1a2b5e] transition-colors"
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
      className={`bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[rgba(26,43,94,0.05)] ${className}`}
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
      className="relative w-full aspect-[1.6/1] rounded-3xl overflow-hidden text-left p-4 flex flex-col justify-between"
      style={{ background: gradient }}
    >
      <div className="flex justify-between items-start">
        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
          {badge}
        </div>
      </div>
      
      <div className="z-10">
        <h3 className="text-white font-bold text-lg leading-tight mb-1">{title}</h3>
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

function LearnCard({ 
  icon: Icon, 
  title, 
  subtitle, 
  xp, 
  href 
}: { 
  icon: any; 
  title: string; 
  subtitle: string; 
  xp: number; 
  href: string;
}) {
  const router = useRouter();
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(href)}
      className="w-full bg-white rounded-3xl p-4 border border-[rgba(26,43,94,0.05)] shadow-sm text-left flex flex-col justify-between"
    >
      <div className="flex gap-3 items-start mb-2">
        <div className="w-10 h-10 rounded-2xl bg-[#f0f4ff] flex items-center justify-center text-[#1a2b5e] shrink-0">
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[#1a2b5e] font-bold text-[13px] leading-tight mb-0.5">{title}</h3>
          <p className="text-[#9aa5b1] text-[10px] leading-relaxed line-clamp-2">{subtitle}</p>
        </div>
        <ChevronRight size={16} className="text-[#9aa5b1] shrink-0 mt-1" />
      </div>

      <div className="flex items-center justify-between mt-1">
        <span className="text-[#c9a84c] text-[11px] font-bold">+{xp} XP</span>
        <div className="flex gap-1">
          {[1,2,3,4].map((i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 1 ? "bg-[#1a2b5e]" : "bg-[rgba(26,43,94,0.1)]"}`} />
          ))}
        </div>
      </div>
    </motion.button>
  );
}

// ── Main Content ────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-full w-full bg-[#f8faff] pb-12 overflow-x-hidden">
      <div className="max-w-xl mx-auto px-5 pt-8">
        
        {/* ── HEADER ────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Image src="/logo.png" alt="kalyma.ma" width={42} height={42} className="object-contain" />
            <div className="text-left">
              <div className="text-2xl font-black text-[#1a2b5e] leading-none" style={{ fontFamily: "'Outfit', sans-serif" }}>
                kalyma<span className="text-[#c9a84c]">.ma</span>
              </div>
              <div className="text-[10px] text-[#9aa5b1] font-medium tracking-wide">Speak with confidence</div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-[#1a2b5e] mt-4 mb-1">
            Hello <span className="font-black">Samir!</span> 👋🏼
          </h1>
          <p className="text-[#4a5568] text-sm">
            Ready to speak English with confidence?
          </p>
        </div>

        {/* ── DASHBOARD ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          
          {/* Progress Card */}
          <DashboardCard className="flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-[#1a2b5e] font-bold text-sm mb-4">Progress</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#c9a84c] text-sm italic">★</span>
                    <span className="text-[#1a2b5e] text-sm font-bold">+12</span>
                    <div className="w-8 h-[1px] bg-[rgba(26,43,94,0.1)] mx-1" />
                  </div>
                  <div className="text-[11px] text-[#9aa5b1] font-bold">+ 480 XP</div>
                </div>
              </div>
              <ProgressCircle percent={78} />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/chat")}
              className="w-full bg-[#1a2b5e] py-3.5 rounded-2xl text-white text-sm font-bold shadow-[0_8px_20px_rgba(26,43,94,0.25)] mt-auto"
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
              {[
                { icon: CheckCircle2, text: "Learn 5 words", xp: 10, done: true, color: "#10b981" },
                { icon: Search, text: "Read 1 article", xp: 20, done: false, color: "#3b82f6" },
                { icon: Mic, text: "Speak 2 min", xp: 10, done: false, color: "#8b5cf6" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${item.done ? "bg-[#f0fdf4]" : "bg-[#f0fafb]"}`}>
                    <item.icon size={18} className={item.done ? "text-[#10b981]" : "text-[#1a2b5e]"} />
                  </div>
                  <span className={`text-[13px] flex-1 ${item.done ? "text-[#9aa5b1]" : "text-[#1a2b5e] font-medium"}`}>
                    {item.text}
                  </span>
                  <div className="bg-[rgba(26,43,94,0.04)] px-3 py-1.5 rounded-full text-[10px] font-bold text-[#9aa5b1]">
                     + {item.xp} XP
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

        </div>

        {/* ── NEWS NOTIFICATION BANNER ─────────────────────── */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/news")}
          className="w-full flex items-center gap-4 mb-10 rounded-2xl p-4 text-left"
          style={{
            background: "linear-gradient(135deg, #fff7e0, #fff3cd)",
            border: "1.5px solid rgba(201,168,76,0.35)",
            boxShadow: "0 4px 16px rgba(201,168,76,0.12)",
          }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-xl"
            style={{ background: "rgba(201,168,76,0.2)" }}
          >
            📰
          </div>
          <div className="flex-1">
            <div className="font-bold text-sm mb-0.5" style={{ color: "#92611a" }}>
              3 new articles matching your interests
            </div>
            <div className="text-xs" style={{ color: "#b07d2a" }}>
              Technology · Culture · Science — tailored for you
            </div>
          </div>
          <ChevronRight size={16} style={{ color: "#c9a84c", flexShrink: 0 }} />
        </motion.button>
        <div className="mb-10">
          <SectionHeader title="Practice" href="/chat" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <PracticeCard 
               title="Atlas AI"
               subtitle="Practice English conversation with AI Coach"
               xp={20}
               badge="AI"
               gradient="linear-gradient(135deg, #1a2b5e, #33599e)"
               imageUrl="/ai_badge.png" // We'll assume these assets exist or use generic ones
               href="/chat"
             />
             <PracticeCard 
               title="Live Session"
               subtitle="Join interactive live English classes"
               xp={30}
               badge="LIVE"
               gradient="linear-gradient(135deg, #a78bfa, #c4b5fd)"
               imageUrl="/live_teacher.png"
               href="/live"
             />
          </div>
        </div>

        {/* ── LEARN SECTION ─────────────────────────────────── */}
        <div className="mb-10">
          <SectionHeader title="Learn" href="/library/books" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <LearnCard 
                icon={BookOpen}
                title="Book of the Month"
                subtitle="Expand your vocabulary with English books"
                xp={10}
                href="/library/books"
             />
             <LearnCard 
                icon={Newspaper}
                title="Daily Article"
                subtitle="Discover interesting scientific articles"
                xp={15}
                href="/library"
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
