"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Globe, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { LANGUAGES, PROFICIENCY_LEVELS, TOPICS, DAILY_GOALS } from "@/lib/data";

const STEPS = ["Language", "Proficiency", "Topics", "Goal"];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const router = useRouter();

  const canProceed = [
    !!selectedLang,
    !!selectedLevel,
    selectedTopics.length >= 1,
    !!selectedGoal,
  ][step];

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else router.push("/onboarding/loading");
  };
  const back = () => setStep(step - 1);

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center gap-2 mb-6">
          <Globe
            className="w-5 h-5"
            style={{ color: "var(--green-primary)" }}
          />
          <span
            className="font-bold text-lg"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Atlas<span className="gradient-text">Bridge</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-1">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className="flex-1 h-1 rounded-full transition-all duration-500"
              style={{
                background:
                  i <= step
                    ? "linear-gradient(90deg, #22c55e, #4ade80)"
                    : "var(--border-subtle)",
              }}
            />
          ))}
        </div>
        <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-32 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="pt-4"
              >
                <h1 className="text-2xl font-bold mb-1">
                  Which language do you want to learn?
                </h1>
                <p
                  className="text-sm mb-6"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Choose your target language to get personalized content.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLang(lang.code)}
                      className="p-4 rounded-xl text-left transition-all duration-200 card-hover"
                      style={{
                        background:
                          selectedLang === lang.code
                            ? "rgba(34,197,94,0.1)"
                            : "var(--bg-card)",
                        border:
                          selectedLang === lang.code
                            ? "1px solid var(--green-primary)"
                            : "1px solid var(--border-subtle)",
                        boxShadow:
                          selectedLang === lang.code
                            ? "0 0 16px var(--green-glow)"
                            : "none",
                      }}
                    >
                      <div className="text-2xl mb-2">{lang.flag}</div>
                      <div className="font-semibold text-sm">{lang.name}</div>
                      <div
                        className="text-xs mt-0.5"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {lang.speakers} speakers
                      </div>
                      {selectedLang === lang.code && (
                        <div
                          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: "var(--green-primary)" }}
                        >
                          <Check className="w-3 h-3 text-white" />
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
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="pt-4"
              >
                <h1 className="text-2xl font-bold mb-1">
                  What's your current level?
                </h1>
                <p
                  className="text-sm mb-6"
                  style={{ color: "var(--text-secondary)" }}
                >
                  We'll tailor your content to match your proficiency.
                </p>
                <div className="space-y-3">
                  {PROFICIENCY_LEVELS.map((level) => (
                    <button
                      key={level.code}
                      onClick={() => setSelectedLevel(level.code)}
                      className="w-full p-4 rounded-xl text-left flex items-center gap-4 transition-all duration-200"
                      style={{
                        background:
                          selectedLevel === level.code
                            ? "rgba(34,197,94,0.1)"
                            : "var(--bg-card)",
                        border:
                          selectedLevel === level.code
                            ? "1px solid var(--green-primary)"
                            : "1px solid var(--border-subtle)",
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                        style={{
                          background:
                            selectedLevel === level.code
                              ? "linear-gradient(135deg, #22c55e, #16a34a)"
                              : "var(--bg-surface)",
                          color:
                            selectedLevel === level.code
                              ? "white"
                              : "var(--text-muted)",
                        }}
                      >
                        {level.code}
                      </div>
                      <div>
                        <div className="font-semibold">{level.label}</div>
                        <div
                          className="text-sm"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {level.desc}
                        </div>
                      </div>
                      {selectedLevel === level.code && (
                        <div
                          className="ml-auto w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: "var(--green-primary)" }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="pt-4"
              >
                <h1 className="text-2xl font-bold mb-1">
                  What topics interest you?
                </h1>
                <p
                  className="text-sm mb-6"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Select at least one. We'll use these to personalize your daily
                  articles.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TOPICS.map((topic) => {
                    const selected = selectedTopics.includes(topic.id);
                    return (
                      <button
                        key={topic.id}
                        onClick={() => toggleTopic(topic.id)}
                        className="p-4 rounded-xl text-left transition-all duration-200 card-hover relative"
                        style={{
                          background: selected
                            ? "rgba(34,197,94,0.1)"
                            : "var(--bg-card)",
                          border: selected
                            ? "1px solid var(--green-primary)"
                            : "1px solid var(--border-subtle)",
                        }}
                      >
                        <div className="text-xl mb-2">{topic.icon}</div>
                        <div className="text-sm font-medium">{topic.label}</div>
                        {selected && (
                          <div
                            className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                            style={{ background: "var(--green-primary)" }}
                          >
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {selectedTopics.length > 0 && (
                  <p
                    className="mt-3 text-xs text-center"
                    style={{ color: "var(--green-primary)" }}
                  >
                    {selectedTopics.length} topic
                    {selectedTopics.length > 1 ? "s" : ""} selected
                  </p>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="pt-4"
              >
                <h1 className="text-2xl font-bold mb-1">Set your daily goal</h1>
                <p
                  className="text-sm mb-6"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Consistency is key. Choose a realistic daily commitment.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {DAILY_GOALS.map((goal) => (
                    <button
                      key={goal.minutes}
                      onClick={() => setSelectedGoal(goal.minutes)}
                      className="p-6 rounded-2xl text-center transition-all duration-200 card-hover"
                      style={{
                        background:
                          selectedGoal === goal.minutes
                            ? "rgba(34,197,94,0.1)"
                            : "var(--bg-card)",
                        border:
                          selectedGoal === goal.minutes
                            ? "2px solid var(--green-primary)"
                            : "1px solid var(--border-subtle)",
                        boxShadow:
                          selectedGoal === goal.minutes
                            ? "0 0 20px var(--green-glow)"
                            : "none",
                      }}
                    >
                      <div className="text-3xl mb-2">{goal.icon}</div>
                      <div className="font-bold text-lg">{goal.label}</div>
                      <div
                        className="text-sm mt-1"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {goal.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom navigation */}
      <div
        className="fixed bottom-0 left-0 right-0 glass-strong border-t p-4 px-6 flex gap-3"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        {step > 0 && (
          <button
            onClick={back}
            className="px-5 py-3 btn-ghost flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}
        <button
          onClick={next}
          disabled={!canProceed}
          className="flex-1 py-3 btn-primary flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {step === STEPS.length - 1 ? "Start Learning" : "Continue"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
