"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Globe, Check, Timer, Zap, Target, Heart, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { PROFICIENCY_LEVELS, TOPICS, DAILY_GOALS } from "@/lib/data";

const STEPS = ["Proficiency", "Pace", "Time", "Interests"];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedPace, setSelectedPace] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedSubTopics, setSelectedSubTopics] = useState<string[]>([]);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const router = useRouter();

  const canProceed = [
    !!selectedLevel,
    !!selectedPace,
    !!selectedTime,
    selectedSubTopics.length >= 3,
  ][step];

  const next = () => {
    if (step < STEPS.length - 1) {
       if (step === 1 && selectedPace) {
         const goal = DAILY_GOALS.find(g => g.label === selectedPace);
         if (goal) setSelectedTime(goal.minutes);
       }
       setStep(step + 1);
    }
    else router.push("/onboarding/loading");
  };
  const back = () => {
    if (step === 3 && activeTopicId) {
      setActiveTopicId(null);
    } else {
      setStep(step - 1);
    }
  };

  const toggleSubTopic = (sub: string) => {
    setSelectedSubTopics((prev) =>
      prev.includes(sub) ? prev.filter((t) => t !== sub) : [...prev, sub],
    );
  };

  const activeTopic = TOPICS.find(t => t.id === activeTopicId);

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f8faff]"
    >
      {/* Header */}
      <div className="px-6 pt-8 pb-4 bg-white/50 backdrop-blur-sm sticky top-0 z-50 border-b border-[#1a2b5e]/5">
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
              <img src="/logo.png" alt="kalyma.ma" className="w-full h-full object-contain" />
            </div>
            <span
              className="font-bold text-lg text-[#1a2b5e]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              kalyma.ma
            </span>
          </div>
          <div className="text-xs font-bold text-[#9aa5b1] uppercase tracking-wider">
            Step {step + 1} of {STEPS.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-2xl mx-auto flex gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className="flex-1 h-1.5 rounded-full transition-all duration-700 overflow-hidden bg-[#1a2b5e]/5"
            >
              <motion.div 
                initial={false}
                animate={{ width: i <= step ? "100%" : "0%" }}
                className="h-full bg-gradient-to-r from-[#1a2b5e] to-[#c9a84c]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-12 pb-44 overflow-y-auto">
        <div className="max-w-xl mx-auto">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex p-3 rounded-2xl bg-[#1a2b5e]/5 text-[#1a2b5e] mb-4">
                    <Target size={24} />
                  </div>
                  <h1 className="text-3xl font-bold text-[#1a2b5e] mb-2 font-outfit">
                    What's your proficiency level?
                  </h1>
                  <p className="text-[#4a5568]">
                    We'll tailor your learning path to match your current skills.
                  </p>
                </div>

                <div className="grid gap-3">
                  {PROFICIENCY_LEVELS.map((level) => (
                    <button
                      key={level.code}
                      onClick={() => setSelectedLevel(level.code)}
                      className={`w-full p-5 rounded-2xl text-left flex items-center gap-4 transition-all duration-300 border-2 ${
                        selectedLevel === level.code
                          ? "bg-[#1a2b5e]/5 border-[#1a2b5e] shadow-lg shadow-[#1a2b5e]/5"
                          : "bg-white border-[#1a2b5e]/5 hover:border-[#1a2b5e]/20"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                          selectedLevel === level.code
                            ? "bg-[#1a2b5e] text-white"
                            : "bg-[#f0f4ff] text-[#9aa5b1]"
                        }`}
                      >
                        {level.code}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-[#1a2b5e]">{level.label}</div>
                        <div className="text-sm text-[#4a5568]">
                          {level.desc}
                        </div>
                      </div>
                      {selectedLevel === level.code && (
                        <div className="w-6 h-6 rounded-full bg-[#1a2b5e] flex items-center justify-center text-white">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex p-3 rounded-2xl bg-[#1a2b5e]/5 text-[#1a2b5e] mb-4">
                    <Zap size={24} />
                  </div>
                  <h1 className="text-3xl font-bold text-[#1a2b5e] mb-2 font-outfit">
                    Choose your learning pace
                  </h1>
                  <p className="text-[#4a5568]">
                    How much time do you want to commit to speaking English?
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {DAILY_GOALS.map((goal) => (
                    <button
                      key={goal.label}
                      onClick={() => setSelectedPace(goal.label)}
                      className={`p-6 rounded-3xl text-center transition-all duration-300 border-2 flex flex-col items-center gap-3 ${
                        selectedPace === goal.label
                          ? "bg-[#1a2b5e]/5 border-[#1a2b5e] shadow-xl shadow-[#1a2b5e]/5 scale-[1.02]"
                          : "bg-white border-[#1a2b5e]/5 hover:border-[#1a2b5e]/20"
                      }`}
                    >
                      <div className="text-4xl mb-2">
                        {goal.icon}
                      </div>
                      <div>
                        <div className="font-bold text-lg text-[#1a2b5e]">{goal.label}</div>
                        <div className="text-sm text-[#4a5568] opacity-80">
                          {goal.desc}
                        </div>
                      </div>
                      {selectedPace === goal.label && (
                        <motion.div 
                          layoutId="active-pace"
                          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#1a2b5e] border-4 border-white flex items-center justify-center text-white"
                        >
                          <Check size={16} strokeWidth={3} />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-12">
                  <div className="inline-flex p-3 rounded-2xl bg-[#1a2b5e]/5 text-[#1a2b5e] mb-4">
                    <Timer size={24} />
                  </div>
                  <h1 className="text-3xl font-bold text-[#1a2b5e] mb-2 font-outfit">
                    Set your daily time goal
                  </h1>
                  <p className="text-[#4a5568]">
                    Consistency is key. You can change this anytime later.
                  </p>
                </div>

                <div className="bg-white p-10 rounded-[40px] border-2 border-[#1a2b5e]/5 shadow-2xl shadow-[#1a2b5e]/5 flex flex-col items-center text-center">
                   <div className="relative mb-10">
                      <motion.div 
                        key={selectedTime}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-8xl font-black text-[#1a2b5e] font-outfit tabular-nums"
                      >
                        {selectedTime}
                      </motion.div>
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[#9aa5b1] font-bold uppercase tracking-widest text-sm">
                        Minutes / Day
                      </div>
                   </div>

                   <div className="w-full space-y-8 px-4">
                      <input 
                        type="range"
                        min="5"
                        max="60"
                        step="5"
                        value={selectedTime || 10}
                        onChange={(e) => setSelectedTime(parseInt(e.target.value))}
                        className="w-full h-3 bg-[#f0f4ff] rounded-full appearance-none cursor-pointer accent-[#1a2b5e]"
                      />
                      <div className="flex justify-between text-xs font-bold text-[#9aa5b1]">
                        <span>5 MIN</span>
                        <span>30 MIN</span>
                        <span>60 MIN</span>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <AnimatePresence mode="wait">
                  {!activeTopicId ? (
                    <motion.div
                      key="topics-grid"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="space-y-8"
                    >
                      <div className="text-center">
                        <div className="inline-flex p-3 rounded-2xl bg-[#1a2b5e]/5 text-[#1a2b5e] mb-4">
                          <Heart size={24} />
                        </div>
                        <h1 className="text-3xl font-bold text-[#1a2b5e] mb-2 font-outfit">
                          Select your interests
                        </h1>
                        <p className="text-[#4a5568]">
                          Pick at least 3 sub-topics across your favorite themes.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {TOPICS.map((topic) => {
                          const selectedCount = topic.subTopics?.filter(s => selectedSubTopics.includes(s)).length || 0;
                          return (
                            <button
                              key={topic.id}
                              onClick={() => setActiveTopicId(topic.id)}
                              className={`p-4 rounded-2xl text-left transition-all duration-300 border-2 relative h-32 flex flex-col justify-between ${
                                selectedCount > 0
                                  ? "bg-[#1a2b5e]/5 border-[#1a2b5e]"
                                  : "bg-white border-[#1a2b5e]/5 hover:border-[#1a2b5e]/20"
                              }`}
                            >
                              <div className="text-3xl">{topic.icon}</div>
                              <div>
                                <div className="text-sm font-bold text-[#1a2b5e]">{topic.label}</div>
                                {selectedCount > 0 && (
                                  <div className="text-[10px] font-bold text-[#c9a84c] uppercase tracking-wider">
                                    {selectedCount} selected
                                  </div>
                                )}
                              </div>
                              {selectedCount > 0 && (
                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#1a2b5e] text-white flex items-center justify-center">
                                  <Check size={12} strokeWidth={4} />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="subtopics-list"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <button 
                        onClick={() => setActiveTopicId(null)}
                        className="flex items-center gap-2 text-[#1a2b5e] font-bold text-sm hover:translate-x-[-4px] transition-transform"
                      >
                        <ArrowLeft size={16} />
                        Back to Themes
                      </button>

                      <div className="flex items-center gap-4 p-6 rounded-3xl bg-white border-2 border-[#1a2b5e]/5 shadow-xl shadow-black/5">
                        <div className="text-5xl">{activeTopic?.icon}</div>
                        <div>
                          <h2 className="text-2xl font-bold text-[#1a2b5e] font-outfit">{activeTopic?.label}</h2>
                          <p className="text-sm text-[#4a5568]">Select specific areas of interest</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {activeTopic?.subTopics?.map((sub) => {
                          const selected = selectedSubTopics.includes(sub);
                          return (
                            <button
                              key={sub}
                              onClick={() => toggleSubTopic(sub)}
                              className={`w-full p-4 rounded-xl text-left flex items-center justify-between transition-all border-2 ${
                                selected
                                  ? "bg-[#1a2b5e] border-[#1a2b5e] text-white"
                                  : "bg-white border-[#1a2b5e]/5 text-[#1a2b5e] hover:border-[#1a2b5e]/20"
                              }`}
                            >
                              <span className="font-semibold">{sub}</span>
                              {selected ? (
                                <Check size={18} strokeWidth={3} />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-current opacity-20" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom navigation */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-[#1a2b5e]/10 p-6 flex justify-center"
      >
        <div className="max-w-xl w-full flex gap-4">
          {(step > 0 || (step === 3 && activeTopicId)) && (
            <button
              onClick={back}
              className="px-8 py-4 rounded-2xl border-2 border-[#1a2b5e] text-[#1a2b5e] font-bold flex items-center gap-2 hover:bg-[#1a2b5e]/5 transition-colors"
            >
              <ChevronLeft size={20} />
              Back
            </button>
          )}
          <button
            onClick={next}
            disabled={!canProceed}
            className="flex-1 py-4 rounded-2xl bg-[#1a2b5e] text-white font-bold flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-[#1a2b5e]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {step === STEPS.length - 1 ? "Start Your Journey" : "Continue"}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
