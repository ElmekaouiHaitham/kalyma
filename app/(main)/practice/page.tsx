"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  RotateCcw,
  Check,
  X,
  ChevronRight,
  Trophy,
  History,
  Info,
  BrainCircuit,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/providers";
import SaveWordModal from "@/components/SaveWordModal";

export default function PracticePage() {
  const { session } = useAuth();
  const [deck, setDeck] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_saved: 0, due_today: 0 });
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [scores, setScores] = useState({ again: 0, hard: 0, good: 0, easy: 0 });
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  const fetchDueCards = async () => {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${session.access_token}` };
      const [dueRes, statsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/due`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/stats`, { headers }),
      ]);

      if (dueRes.ok) setDeck(await dueRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (e) {
      console.error("Failed to load cards", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDueCards();
  }, [session]);

  const currentCard = deck[currentIndex];
  const progress = deck.length > 0 ? (currentIndex / deck.length) * 100 : 0;

  const handleResponse = async (type: keyof typeof scores, rating: number) => {
    setScores((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    setIsFlipped(false);

    // Submit rating to backend
    if (session?.access_token && currentCard) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/answer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ card_id: currentCard.card.id, rating }),
        });
      } catch (e) {
        console.error("Failed to submit rating", e);
      }
    }

    if (currentIndex < deck.length - 1) {
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 150);
    } else {
      setSessionComplete(true);
      fetchDueCards(); // Refresh stats for the completion screen
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading your deck...
      </div>
    );
  }

  if (deck.length === 0 && !sessionComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-6 text-center space-y-8 max-w-lg mx-auto">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
          <Check className="w-12 h-12 text-green-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#1a2b5e] font-outfit">
            You're all caught up!
          </h1>
          <p className="text-[#64748b]">
            There are no cards due for review right now. Add more vocabulary
            from articles or check back later.
          </p>
        </div>
        <div className="flex gap-4 items-center mt-4">
          <div className="text-center px-6 py-4 bg-white rounded-2xl shadow-sm border border-[#1a2b5e]/5">
            <div className="text-2xl font-bold text-[#1a2b5e]">
              {stats.total_saved}
            </div>
            <div className="text-xs font-bold text-[#9aa5b1] uppercase">
              Total Saved
            </div>
          </div>
        </div>
        <button
          onClick={() => setSaveModalOpen(true)}
          className="mt-8 px-8 py-3.5 rounded-2xl bg-[#1a2b5e] text-white font-bold flex items-center gap-2 shadow-xl shadow-[#1a2b5e]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={18} />
          Add New Card
        </button>
        <SaveWordModal
          isOpen={saveModalOpen}
          onClose={() => setSaveModalOpen(false)}
        />
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-6 text-center space-y-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-[#c9a84c]/20 rounded-full flex items-center justify-center text-5xl mb-4"
        >
          🏆
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#1a2b5e] font-outfit">
            Session Complete!
          </h1>
          <p className="text-[#64748b]">
            You've mastered {deck.length} cards today. Your memory is
            getting stronger!
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
          {[
            {
              label: "Total Saved",
              val: stats.total_saved.toString(),
              icon: "📚",
              color: "text-[#1a2b5e]",
            },
            {
              label: "Accuracy",
              val:
                deck.length > 0
                  ? `${Math.round(((scores.good + scores.easy) / deck.length) * 100)}%`
                  : "0%",
              icon: "🎯",
              color: "text-green-500",
            },
            {
              label: "Good/Easy",
              val: (scores.good + scores.easy).toString(),
              icon: "✅",
              color: "text-blue-500",
            },
            {
              label: "Again/Hard",
              val: (scores.again + scores.hard).toString(),
              icon: "🔥",
              color: "text-orange-500",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-2xl border border-[#1a2b5e]/5 shadow-sm"
            >
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className={`text-lg font-bold ${stat.color}`}>
                {stat.val}
              </div>
              <div className="text-[10px] font-bold text-[#9aa5b1] uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setCurrentIndex(0);
            setSessionComplete(false);
            setScores({ again: 0, hard: 0, good: 0, easy: 0 });
            fetchDueCards(); // Refetch incase new ones matured
          }}
          className="w-full py-4 rounded-2xl bg-[#1a2b5e] text-white font-bold shadow-xl shadow-[#1a2b5e]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto px-4 py-8 h-full space-y-8">
      {/* Header & Progress */}
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a2b5e]/5 flex items-center justify-center text-[#1a2b5e]">
              <BrainCircuit size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1a2b5e] font-outfit">
                Practice Mode
              </h1>
              <p className="text-[10px] font-bold text-[#9aa5b1] uppercase tracking-widest">
                Spaced Repetition
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold text-[#1a2b5e]">
                {currentIndex + 1} / {deck.length}
              </div>
              <div className="text-[10px] text-[#9aa5b1] font-medium">
                Session Progress
              </div>
            </div>
            <button
              onClick={() => setSaveModalOpen(true)}
              className="w-10 h-10 rounded-xl bg-[#f0f4ff] flex items-center justify-center text-[#1a2b5e] hover:bg-[#e0e7ff] transition-colors"
              title="Add New Card"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="h-2 w-full bg-[#1a2b5e]/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#1a2b5e] to-[#c9a84c]"
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card Section */}
      <div className="flex-1 w-full flex items-center justify-center p-2 sm:p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentIndex}-${isFlipped}`}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-md aspect-[4/5] sm:aspect-square bg-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 shadow-xl shadow-[#1a2b5e]/5 border border-[#1a2b5e]/10 relative overflow-hidden cursor-pointer group hover:border-[#1a2b5e]/20 transition-all"
            onClick={() => !isFlipped && setIsFlipped(true)}
          >
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1a2b5e] to-[#c9a84c] opacity-80" />

            {!isFlipped ? (
              <>
                <div className="space-y-4">
                  <span className="inline-block px-3 py-1 bg-[#1a2b5e]/5 rounded-full text-[10px] sm:text-xs font-bold text-[#1a2b5e] uppercase tracking-widest border border-[#1a2b5e]/10">
                    {currentCard.item.type} • Card
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-black text-[#1a2b5e] font-outfit leading-tight break-words">
                    {currentCard.item.content}
                  </h2>
                </div>
                <div className="mt-4 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#f0f4ff] flex items-center justify-center text-[#1a2b5e] animate-bounce">
                    <ChevronRight size={20} className="rotate-90" />
                  </div>
                  <p className="text-xs font-bold text-[#9aa5b1] uppercase tracking-widest">
                    Tap to reveal answer
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-6 sm:space-y-8 w-full">
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-[#9aa5b1] uppercase tracking-widest">
                    Meaning
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#1a2b5e] leading-snug">
                    {currentCard.item.translation || "No definition provided."}
                  </h3>
                </div>

                {currentCard.item.context && (
                  <div className="bg-[#f8faff] p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-[#1a2b5e]/5 relative">
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-white border border-[#1a2b5e]/5 rounded-lg text-[10px] font-bold text-[#1a2b5e] uppercase tracking-wider">
                      Context
                    </div>
                    <p className="italic text-[#4a5568] text-sm sm:text-base leading-relaxed">
                      "{currentCard.item.context}"
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-[#9aa5b1] uppercase tracking-widest pt-2">
                  <Info size={14} className="text-[#c9a84c]" />
                  Source: {currentCard.item.source_type}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="w-full shrink-0 min-h-[120px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isFlipped ? (
            <motion.button
              key="reveal-btn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={() => setIsFlipped(true)}
              className="px-10 py-4 rounded-2xl bg-[#1a2b5e] text-white font-extrabold text-sm uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-[#1a2b5e]/30 transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
              Reveal Answer
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <RotateCcw size={12} className="text-white" />
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="srs-controls"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-4 gap-2 sm:gap-4 w-full max-w-lg"
            >
              {[
                {
                  label: "Again",
                  type: "again",
                  rating: 0,
                  color: "from-[#ff6b6b] to-[#ee5253]",
                  time: " ",
                },
                {
                  label: "Hard",
                  type: "hard",
                  rating: 1,
                  color: "from-[#feca57] to-[#ff9f43]",
                  time: " ",
                },
                {
                  label: "Good",
                  type: "good",
                  rating: 3,
                  color: "from-[#48dbfb] to-[#0abde3]",
                  time: " ",
                },
                {
                  label: "Easy",
                  type: "easy",
                  rating: 5,
                  color: "from-[#1dd1a1] to-[#10ac84]",
                  time: " ",
                },
              ].map((btn) => (
                <button
                  key={btn.type}
                  onClick={() => handleResponse(btn.type as any, btn.rating)}
                  className="flex flex-col items-center gap-2 group/btn"
                >
                  <div
                    className={cn(
                      "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white mb-1 shadow-lg transition-all group-hover/btn:scale-110 bg-gradient-to-br",
                      btn.color,
                    )}
                  >
                    {btn.type === "again" ? (
                      <RotateCcw size={20} />
                    ) : (
                      <Check size={20} />
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-extrabold text-[#1a2b5e] uppercase tracking-tighter">
                      {btn.label}
                    </span>
                    <span className="text-[9px] font-bold text-[#9aa5b1]">
                      {btn.time}
                    </span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SaveWordModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
      />
    </div>
  );
}
