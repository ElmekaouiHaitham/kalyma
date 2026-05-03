"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Newspaper,
  MessageCircle,
  Radio,
  Settings,
  ChevronRight,
  LogOut,
  Bell,
  Globe,
  Star,
  Award,
  Flame,
  BarChart2,
  Book,
  MessageSquare,
  Users,
  Zap,
  FileText,
  User,
  Check,
  Timer,
  Target,
  Loader2,
  CreditCard
} from "lucide-react";
import { useAuth } from "@/app/providers";
import { PROFICIENCY_LEVELS, DAILY_GOALS } from "@/lib/data";

const PLAN_FEATURES = [
  "Unlimited AI conversations",
  "Access to all articles & books",
  "Live session replays",
  "Advanced vocabulary tracking",
  "Priority support",
];

const ACHIEVEMENT_MAP: Record<number, { title: string, icon: any, color: string }> = {
  200: { title: "Bookworm", icon: Book, color: "#1a2b5e" },
  150: { title: "Consistent reviewer", icon: MessageSquare, color: "#10b981" },
  50: { title: "First read", icon: BookOpen, color: "#3b82f6" },
  100: { title: "Live learner", icon: Radio, color: "#ef4444" },
  110: { title: "7-day streak", icon: Flame, color: "#f97316" },
  60: { title: "Community voice", icon: Users, color: "#8b5cf6" },
  500: { title: "30-day streak", icon: Zap, color: "#eab308" },
  75: { title: "Word collector", icon: FileText, color: "#2d4080" },
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, session } = useAuth();
  
  const [xpHistory, setXpHistory] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Preference Form State
  const [fullName, setFullName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedPace, setSelectedPace] = useState<string | null>(null);
  const [articleFrequency, setArticleFrequency] = useState<number>(2);

  const fetchHistory = () => {
    if (session) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/gamification/me/xp-history`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setXpHistory(data); })
      .catch(console.error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [session]);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      const pref = user.preferences;
      if (pref) {
        const diffToCode: Record<string, string> = { "beginner": "A1", "intermediate": "B1", "upper_intermediate": "B2", "advanced": "C1" };
        setSelectedLevel(diffToCode[pref.difficulty_pref] || "B1");
        
        const p = DAILY_GOALS.find(g => g.minutes === pref.reading_pace);
        setSelectedPace(p ? p.label : "Regular");
        setArticleFrequency(pref.article_frequency || 2);
      }
    }
  }, [user]);

  const handleSavePreferences = async () => {
    if (!session) return;
    setIsSubmitting(true);
    try {
      const difficultyMap: Record<string, string> = {
        "A1": "beginner", "A2": "beginner",
        "B1": "intermediate", "B2": "upper_intermediate",
        "C1": "advanced", "C2": "advanced",
      };
      const payload = {
        full_name: fullName.trim(),
        difficulty_pref: selectedLevel ? difficultyMap[selectedLevel] : "intermediate",
        reading_pace: selectedPace ? DAILY_GOALS.find(g => g.label === selectedPace)?.minutes || 10 : 10,
        article_frequency: articleFrequency,
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        // Force reload or mutate context
        window.location.reload(); 
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalNews = xpHistory.filter(h => h.reason === 'news_read').length;
  const totalSessions = xpHistory.filter(h => h.reason === 'review_session').length;
  const totalArticles = xpHistory.filter(h => h.reason === 'article_completed').length;
  
  const achievements = xpHistory.filter(h => h.reason === 'achievement_earned');

  const diffLabelMap: Record<string, string> = {
    beginner: "A1/A2 — Beginner",
    intermediate: "B1 — Intermediate",
    upper_intermediate: "B2 — Upper-Int",
    advanced: "C1/C2 — Advanced"
  };

  const STATS = [
    { icon: Flame, label: "Day Streak", value: user?.streak_count || 0, color: "#f97316" },
    { icon: Newspaper, label: "Total News", value: totalNews, color: "#1a2b5e" },
    { icon: Star, label: "Total Sessions", value: totalSessions, color: "#c9a84c" },
    { icon: BookOpen, label: "Total Articles", value: totalArticles, color: "#8b5cf6" },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5 lg:max-w-5xl" style={{ background: "#f0f4ff", colorScheme: "light", minHeight: "100%" }}>
      <div className="lg:grid lg:grid-cols-[2fr_3fr] lg:gap-6 lg:items-start space-y-5 lg:space-y-0">
        
        {/* Left Column */}
        <div className="space-y-5">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, #1a2b5e 0%, #2d4080 100%)", boxShadow: "0 6px 24px rgba(26,43,94,0.25)" }}
          >
            <div className="px-5 pt-6 pb-5">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0"
                  style={{ background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.3)" }}
                >
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="flex-1">
                  <div className="text-xl font-bold text-white mb-0.5" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {user?.full_name || "Atlas Learner"}
                  </div>
                  <div className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                    {user?.email || "loading..."}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(201,168,76,0.3)", color: "#d4b86a" }}>
                      {user?.preferences?.difficulty_pref ? diffLabelMap[user.preferences.difficulty_pref] : "Intermediate"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                {STATS.map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
                      <Icon size={16} style={{ color: "white" }} />
                    </div>
                    <div className="text-sm font-bold text-white">{value}</div>
                    <div className="text-[9px] text-center leading-tight" style={{ color: "rgba(255,255,255,0.55)" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
            className="rounded-2xl p-4"
            style={{ background: "white", border: "1px solid rgba(26,43,94,0.08)", boxShadow: "0 2px 10px rgba(26,43,94,0.06)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold" style={{ color: "#1a2b5e" }}>Badges</span>
              <Award size={16} style={{ color: "#c9a84c" }} />
            </div>
            {achievements.length === 0 ? (
              <div className="text-center text-xs py-4 text-[#9aa5b1] italic">Complete activities to earn badges!</div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {achievements.map((ach, i) => {
                  const conf = ACHIEVEMENT_MAP[ach.amount] || { title: "Secret Badge", icon: Award, color: "#1a2b5e" };
                  const Icon = conf.icon;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 text-center">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                        style={{ background: `${conf.color}15`, border: `1px solid ${conf.color}30` }}>
                        <Icon size={22} style={{ color: conf.color }} />
                      </div>
                      <span className="text-[9px] leading-tight" style={{ color: "#9aa5b1" }}>{conf.title}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, #1a2b5e 0%, #2d4080 100%)", boxShadow: "0 6px 24px rgba(26,43,94,0.3)" }}
          >
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CreditCard size={16} style={{ color: "#c9a84c" }} />
                  <span className="text-sm font-bold text-white">Your Plan</span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(201,168,76,0.3)", color: "#d4b86a" }}>
                  FREE
                </span>
              </div>
              <div className="space-y-2 mb-4">
                {PLAN_FEATURES.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(201,168,76,0.3)" }}>
                      <Check size={10} style={{ color: "#c9a84c" }} />
                    </div>
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #c9a84c, #b8932e)", color: "white", boxShadow: "0 4px 14px rgba(201,168,76,0.4)" }}
              >
                Upgrade to Premium ✦
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column (Preferences & Log Out) */}
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "white", border: "1px solid rgba(26,43,94,0.08)", boxShadow: "0 2px 10px rgba(26,43,94,0.06)" }}
          >
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(26,43,94,0.06)" }}>
              <div className="flex items-center gap-2">
                 <Settings size={15} style={{ color: "#9aa5b1" }} />
                 <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#9aa5b1" }}>Preferences</span>
              </div>
            </div>

            <div className="px-4 py-5 space-y-5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1a2b5e] uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#f0f4ff] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1a2b5e] outline-none border border-transparent focus:border-[#1a2b5e]/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#1a2b5e] uppercase tracking-wider">Proficiency Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {PROFICIENCY_LEVELS.filter(l => ["A1", "B1", "B2", "C1"].includes(l.code)).map((level) => (
                     <button
                       key={level.code} onClick={() => setSelectedLevel(level.code)}
                       className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                          selectedLevel === level.code
                            ? "bg-[#1a2b5e] text-white border-[#1a2b5e]"
                            : "bg-white text-[#9aa5b1] border-[#1a2b5e]/10 hover:border-[#1a2b5e]/30"
                       }`}
                     >
                       {level.code} - {level.label.split("-")[0]}
                     </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#1a2b5e] uppercase tracking-wider">Learning Pace</label>
                <div className="grid grid-cols-2 gap-2">
                  {DAILY_GOALS.map((goal) => (
                     <button
                       key={goal.label} onClick={() => setSelectedPace(goal.label)}
                       className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1 ${
                          selectedPace === goal.label
                            ? "bg-[#c9a84c] text-white border-[#c9a84c]"
                            : "bg-white text-[#9aa5b1] border-[#1a2b5e]/10 hover:border-[#1a2b5e]/30"
                       }`}
                     >
                       <span>{goal.icon} {goal.label}</span>
                     </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <label className="text-[11px] font-bold text-[#1a2b5e] uppercase tracking-wider">Articles / Week Target</label>
                   <span className="text-sm font-bold text-[#1a2b5e]">{articleFrequency}</span>
                </div>
                <input 
                  type="range" min="1" max="5" step="1"
                  value={articleFrequency} onChange={(e) => setArticleFrequency(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#f0f4ff] rounded-full appearance-none cursor-pointer accent-[#1a2b5e]"
                />
              </div>

              <button
                onClick={handleSavePreferences}
                disabled={isSubmitting || !fullName}
                className="w-full py-3 mt-2 rounded-xl text-sm font-bold text-white bg-[#1a2b5e] disabled:opacity-50 transition-all flex justify-center items-center gap-2"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} /> Save Changes</>}
              </button>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            onClick={() => router.push("/auth")}
            className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}
          >
            <LogOut size={15} /> Sign Out
          </motion.button>
          <p className="text-center text-xs pb-2" style={{ color: "#9aa5b1" }}>kalyma.ma · v1.0.0</p>
        </div>
      </div>
    </div>
  );
}


