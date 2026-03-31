w"use client";
import { useState } from "react";
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
  BrainCircuit
} from "lucide-react";
import { PRACTICE_DECK } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function PracticePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [scores, setScores] = useState({ again: 0, hard: 0, good: 0, easy: 0 });

  const currentCard = PRACTICE_DECK[currentIndex];
  const progress = ((currentIndex) / PRACTICE_DECK.length) * 100;

  const handleResponse = (type: keyof typeof scores) => {
    setScores(prev => ({ ...prev, [type]: prev[type] + 1 }));
    setIsFlipped(false);
    
    if (currentIndex < PRACTICE_DECK.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    } else {
      setSessionComplete(true);
    }
  };

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
          <h1 className="text-3xl font-bold text-[#1a2b5e] font-outfit">Session Complete!</h1>
          <p className="text-[#64748b]">You've mastered {PRACTICE_DECK.length} cards today. Your memory is getting stronger!</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
          {[
            { label: "XP Gained", val: "+150", icon: "✨", color: "text-[#c9a84c]" },
            { label: "Accuracy", val: "94%", icon: "🎯", color: "text-green-500" },
            { label: "Time", val: "4:20", icon: "⏱️", color: "text-blue-500" },
            { label: "Streak", val: "12 Days", icon: "🔥", color: "text-orange-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-[#1a2b5e]/5 shadow-sm">
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className={`text-lg font-bold ${stat.color}`}>{stat.val}</div>
              <div className="text-[10px] font-bold text-[#9aa5b1] uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => {
            setCurrentIndex(0);
            setSessionComplete(false);
            setScores({ again: 0, hard: 0, good: 0, easy: 0 });
          }}
          className="w-full py-4 rounded-2xl bg-[#1a2b5e] text-white font-bold shadow-xl shadow-[#1a2b5e]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Start New Session
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
                <h1 className="text-xl font-bold text-[#1a2b5e] font-outfit">Practice Mode</h1>
                <p className="text-[10px] font-bold text-[#9aa5b1] uppercase tracking-widest">Spaced Repetition</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <div className="text-sm font-bold text-[#1a2b5e]">{currentIndex + 1} / {PRACTICE_DECK.length}</div>
                <div className="text-[10px] text-[#9aa5b1] font-medium">Session Progress</div>
             </div>
             <History className="text-[#9aa5b1]" size={20} />
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
                    {currentCard.type} • {currentCard.level}
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-black text-[#1a2b5e] font-outfit leading-tight break-words">
                    {currentCard.front}
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
                   <p className="text-[10px] font-bold text-[#9aa5b1] uppercase tracking-widest">Meaning</p>
                   <h3 className="text-2xl sm:text-3xl font-bold text-[#1a2b5e] leading-snug">
                     {currentCard.back}
                   </h3>
                </div>
                
                <div className="bg-[#f8faff] p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-[#1a2b5e]/5 relative">
                   <div className="absolute -top-3 left-6 px-3 py-1 bg-white border border-[#1a2b5e]/5 rounded-lg text-[10px] font-bold text-[#1a2b5e] uppercase tracking-wider">Example</div>
                   <p className="italic text-[#4a5568] text-sm sm:text-base leading-relaxed">
                     "{currentCard.example}"
                   </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-[#9aa5b1] uppercase tracking-widest pt-2">
                  <Info size={14} className="text-[#c9a84c]" />
                  Category: {currentCard.category}
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
                { label: "Again", type: "again", color: "from-[#ff6b6b] to-[#ee5253]", time: "1m" },
                { label: "Hard", type: "hard", color: "from-[#feca57] to-[#ff9f43]", time: "2d" },
                { label: "Good", type: "good", color: "from-[#48dbfb] to-[#0abde3]", time: "4d" },
                { label: "Easy", type: "easy", color: "from-[#1dd1a1] to-[#10ac84]", time: "7d" },
              ].map((btn) => (
                <button
                  key={btn.type}
                  onClick={() => handleResponse(btn.type as any)}
                  className="flex flex-col items-center gap-2 group/btn"
                >
                  <div className={cn(
                    "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white mb-1 shadow-lg transition-all group-hover/btn:scale-110 bg-gradient-to-br",
                    btn.color
                  )}>
                    {btn.type === 'again' ? <RotateCcw size={20} /> : <Check size={20} />}
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
    </div>
  );
}
