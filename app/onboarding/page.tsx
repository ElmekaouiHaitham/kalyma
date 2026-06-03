"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Heart,
  HeartPulse,
  Landmark,
  Laptop,
  Loader2,
  LucideIcon,
  Map,
  Microscope,
  Newspaper,
  Palette,
  Play,
  Target,
  Timer,
  Trophy,
  Utensils,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/providers";
import { DAILY_GOALS } from "@/lib/data";

const STEPS = ["Name", "Pace", "Frequency", "Interests", "Reading", "Quiz", "Result"];

const TOPIC_ICONS: Record<string, LucideIcon> = {
  laptop: Laptop,
  trophy: Trophy,
  briefcase: GraduationCap,
  "graduation-cap": GraduationCap,
  landmark: Landmark,
  newspaper: Newspaper,
  microscope: Microscope,
  "heart-pulse": HeartPulse,
  map: Map,
  utensils: Utensils,
  play: Play,
  palette: Palette,
};

type Subtopic = {
  id: string;
  topic_id: string;
  label: string;
  display_order: number;
};

type Topic = {
  id: string;
  label: string;
  icon?: string;
  display_order: number;
  subtopics: Subtopic[];
};

type PlacementChoice = {
  id: string;
  text: string;
};

type PlacementQuestion = {
  id: string;
  question: string;
  choices: PlacementChoice[];
};

type PlacementPassage = {
  id: string;
  topic_id: string;
  title: string;
  body: string;
  questions: PlacementQuestion[];
};

type PlacementResult = {
  attempt_id: string;
  estimated_level: number;
  label: string;
  cefr_hint: string;
  confidence: number;
  quiz_score: number;
  unknown_weight_sum: number;
  final_score: number;
};

const normalizeToken = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9'-]+/g, "");

const getPlacementMotivation = (level: number) => {
  if (level <= 5) {
    return "You already have enough English to start learning through real articles. Kalyma will keep the content understandable while introducing the words and expressions that move you forward.";
  }
  if (level <= 10) {
    return "This is a strong starting point. You can handle serious topics now, and Kalyma will help you turn that ability into sharper vocabulary, clearer arguments, and more confident expression.";
  }
  return "You are ready for demanding English. Kalyma will challenge you with richer articles, precise expressions, and ideas that help you sound more natural, informed, and confident.";
};

function TopicIcon({ icon, label, className }: { icon?: string; label: string; className?: string }) {
  const Icon = icon ? TOPIC_ICONS[icon] : undefined;
  if (Icon) return <Icon className={className} strokeWidth={2.2} />;
  return <span className="text-sm font-black uppercase">{label.slice(0, 2)}</span>;
}

function StepIntro({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="mb-8 text-center">
      <div className="mb-4 inline-flex rounded-2xl bg-[#1a2b5e]/5 p-3 text-[#1a2b5e]">
        <Icon size={24} />
      </div>
      <h1 className="mb-2 text-3xl font-bold text-[#1a2b5e]">{title}</h1>
      <p className="mx-auto max-w-md text-[#4a5568]">{text}</p>
    </div>
  );
}

function PlacementReader({
  passage,
  selectedWords,
  onToggleWord,
}: {
  passage: PlacementPassage;
  selectedWords: string[];
  onToggleWord: (word: string) => void;
}) {
  const tokens = useMemo(
    () => passage.body.match(/[A-Za-z]+(?:[-'][A-Za-z]+)?|[0-9]+|[^A-Za-z0-9\s]+|\s+/g) ?? [],
    [passage.body],
  );
  const selectedSet = new Set(selectedWords);

  return (
    <div className="rounded-[28px] border-2 border-[#1a2b5e]/5 bg-white p-5 shadow-xl shadow-[#1a2b5e]/5 sm:p-7">
      <div className="mb-5 flex items-start gap-3 border-b border-[#1a2b5e]/8 pb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1a2b5e] text-white">
          <BookOpen size={20} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c9842f]">
            Placement reading
          </p>
          <h2 className="mt-1 text-2xl font-bold leading-tight text-[#1a2b5e]">
            {passage.title}
          </h2>
        </div>
      </div>

      <p className="mb-5 rounded-2xl bg-[#f7f2ea] px-4 py-3 text-sm font-medium leading-6 text-[#4a5568]">
        Click every word you do not understand. There is no penalty for honesty.
      </p>

      <div className="select-none text-[20px] font-medium leading-[2.05] text-[#1f2937]">
        {tokens.map((token, index) => {
          if (/^\s+$/.test(token)) return <span key={`${token}-${index}`}>{token}</span>;
          const normalized = normalizeToken(token);
          if (!normalized || /^[^A-Za-z0-9]+$/.test(token)) {
            return <span key={`${token}-${index}`}>{token}</span>;
          }
          const selected = selectedSet.has(normalized);
          return (
            <button
              key={`${token}-${index}`}
              type="button"
              onClick={() => onToggleWord(normalized)}
              className={`mx-0.5 rounded-lg px-1.5 py-0.5 align-baseline transition ${
                selected
                  ? "bg-[#c9842f] text-white shadow-sm"
                  : "text-[#1f2937] hover:bg-[#fbf5e8] hover:text-[#1a2b5e]"
              }`}
            >
              {token}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#9aa5b1]">
          Selected
        </span>
        {selectedWords.length === 0 ? (
          <span className="text-sm font-semibold text-[#4a5568]">No unknown words selected yet</span>
        ) : (
          selectedWords.map((word) => (
            <button
              key={word}
              type="button"
              onClick={() => onToggleWord(word)}
              className="rounded-full bg-[#fbf5e8] px-3 py-1 text-sm font-bold text-[#8b5c18]"
            >
              {word}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState("");
  const [selectedPace, setSelectedPace] = useState<string | null>(null);
  const [articleFrequency, setArticleFrequency] = useState<number | null>(2);
  const [selectedSubTopics, setSelectedSubTopics] = useState<string[]>([]);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [passage, setPassage] = useState<PlacementPassage | null>(null);
  const [selectedUnknownWords, setSelectedUnknownWords] = useState<string[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [placementResult, setPlacementResult] = useState<PlacementResult | null>(null);

  const router = useRouter();
  const { session, refreshUser } = useAuth();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/topics`);
        if (res.ok) {
          setTopics(await res.json());
        } else {
          console.error("Failed to fetch topics", await res.text());
        }
      } catch (fetchError) {
        console.error("Error fetching topics:", fetchError);
      } finally {
        setIsLoadingTopics(false);
      }
    };

    fetchTopics();
  }, []);

  const activeTopic = topics.find((topic) => topic.id === activeTopicId);

  const canProceed = [
    fullName.trim().length > 0,
    !!selectedPace,
    !!articleFrequency,
    !isLoadingTopics && selectedSubTopics.length >= 3,
    !!passage && !isSubmitting,
    !!passage && Object.keys(quizAnswers).length === passage.questions.length && !isSubmitting,
    !!placementResult,
  ][step];

  const toggleSubTopic = (subtopicId: string) => {
    setSelectedSubTopics((prev) =>
      prev.includes(subtopicId)
        ? prev.filter((item) => item !== subtopicId)
        : [...prev, subtopicId],
    );
  };

  const toggleUnknownWord = (word: string) => {
    setSelectedUnknownWords((prev) =>
      prev.includes(word) ? prev.filter((item) => item !== word) : [...prev, word],
    );
  };

  const savePreferencesAndLoadPlacement = async () => {
    if (!session) {
      router.push("/auth");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const payload = {
        full_name: fullName.trim(),
        reading_pace: selectedPace
          ? DAILY_GOALS.find((goal) => goal.label === selectedPace)?.minutes || 10
          : 10,
        article_frequency: articleFrequency || 2,
        selected_subtopic_ids: selectedSubTopics,
      };

      const prefRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!prefRes.ok) throw new Error(await prefRes.text());

      const placementRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/placement/passage`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!placementRes.ok) throw new Error(await placementRes.text());
      const data = await placementRes.json();
      setPassage(data.passage);
      setSelectedUnknownWords([]);
      setQuizAnswers({});
      setStep(4);
    } catch (submitError) {
      console.error("Could not start placement:", submitError);
      setError("Could not prepare your placement reading. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitPlacement = async () => {
    if (!session || !passage) return;
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/placement/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          passage_id: passage.id,
          selected_unknown_words: selectedUnknownWords,
          quiz_answers: Object.entries(quizAnswers).map(([question_id, choice_id]) => ({
            question_id,
            choice_id,
          })),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();
      setPlacementResult(result);
      await refreshUser();
      setStep(6);
    } catch (submitError) {
      console.error("Could not submit placement:", submitError);
      setError("Could not calculate your level. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const next = async () => {
    if (step === 3) {
      await savePreferencesAndLoadPlacement();
      return;
    }
    if (step === 5) {
      await submitPlacement();
      return;
    }
    if (step === 6) {
      router.push("/home");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const back = () => {
    setError("");
    if (step === 3 && activeTopicId) {
      setActiveTopicId(null);
      return;
    }
    setStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f2ea]">
      <div className="sticky top-0 z-50 border-b border-[#1a2b5e]/5 bg-white/50 px-6 pb-4 pt-8 backdrop-blur-sm">
        <div className="mx-auto mb-6 flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl">
              <img src="/logo.png" alt="kalyma" className="h-full w-full object-contain" />
            </div>
            <span className="text-lg font-bold text-[#1a2b5e]">kalyma</span>
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#9aa5b1]">
            Step {step + 1} of {STEPS.length}
          </div>
        </div>

        <div className="mx-auto flex max-w-2xl gap-2">
          {STEPS.map((item, index) => (
            <div
              key={item}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#1a2b5e]/5 transition-all duration-700"
            >
              <motion.div
                initial={false}
                animate={{ width: index <= step ? "100%" : "0%" }}
                className="h-full bg-gradient-to-r from-[#1a2b5e] to-[#c9a84c]"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-44 pt-12">
        <div className="mx-auto max-w-2xl">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step-name"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <StepIntro
                  icon={Heart}
                  title="What should we call you?"
                  text="We use your name to make the learning space feel personal."
                />
                <div className="rounded-3xl border-2 border-[#1a2b5e]/5 bg-white p-6 shadow-xl shadow-[#1a2b5e]/5">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full bg-transparent text-center text-2xl font-bold text-[#1a2b5e] outline-none placeholder:text-[#9aa5b1]"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step-pace"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <StepIntro
                  icon={Zap}
                  title="Choose your learning pace"
                  text="This shapes your daily reading and review load."
                />
                <div className="grid grid-cols-2 gap-4">
                  {DAILY_GOALS.map((goal) => (
                    <button
                      key={goal.label}
                      onClick={() => setSelectedPace(goal.label)}
                      className={`relative flex flex-col items-center gap-3 rounded-3xl border-2 p-6 text-center transition-all duration-300 ${
                        selectedPace === goal.label
                          ? "scale-[1.02] border-[#1a2b5e] bg-[#1a2b5e]/5 shadow-xl shadow-[#1a2b5e]/5"
                          : "border-[#1a2b5e]/5 bg-white hover:border-[#1a2b5e]/20"
                      }`}
                    >
                      <Timer className="h-8 w-8 text-[#c9842f]" />
                      <div>
                        <div className="text-lg font-bold text-[#1a2b5e]">{goal.label}</div>
                        <div className="text-sm text-[#4a5568] opacity-80">{goal.desc}</div>
                      </div>
                      {selectedPace === goal.label && (
                        <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-[#1a2b5e] text-white">
                          <Check size={16} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-frequency"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <StepIntro
                  icon={Timer}
                  title="Article frequency"
                  text="Pick a weekly target that you can actually keep."
                />
                <div className="flex flex-col items-center rounded-[40px] border-2 border-[#1a2b5e]/5 bg-white p-10 text-center shadow-2xl shadow-[#1a2b5e]/5">
                  <div className="relative mb-10">
                    <motion.div
                      key={articleFrequency}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-8xl font-black tabular-nums text-[#1a2b5e]"
                    >
                      {articleFrequency}
                    </motion.div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-bold uppercase tracking-widest text-[#9aa5b1]">
                      Articles / Week
                    </div>
                  </div>
                  <div className="w-full space-y-8 px-4">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={articleFrequency || 2}
                      onChange={(event) => setArticleFrequency(parseInt(event.target.value))}
                      className="h-3 w-full cursor-pointer appearance-none rounded-full bg-[#f7f2ea] accent-[#1a2b5e]"
                    />
                    <div className="flex justify-between text-xs font-bold text-[#9aa5b1]">
                      <span>1</span>
                      <span>3</span>
                      <span>5</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-interests"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <AnimatePresence mode="wait">
                  {!activeTopicId ? (
                    <motion.div
                      key="topics-grid"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="space-y-8"
                    >
                      <StepIntro
                        icon={Target}
                        title="Select your interests"
                        text="Pick at least 3 subtopics. We use them to choose your placement reading."
                      />
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {topics.map((topic) => {
                          const selectedCount =
                            topic.subtopics?.filter((subtopic) => selectedSubTopics.includes(subtopic.id)).length || 0;
                          return (
                            <button
                              key={topic.id}
                              onClick={() => setActiveTopicId(topic.id)}
                              className={`relative flex h-32 flex-col justify-between rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                                selectedCount > 0
                                  ? "border-[#1a2b5e] bg-[#1a2b5e]/5"
                                  : "border-[#1a2b5e]/5 bg-white hover:border-[#1a2b5e]/20"
                              }`}
                            >
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a2b5e]/5 text-[#1a2b5e]">
                                <TopicIcon icon={topic.icon} label={topic.label} className="h-6 w-6" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-[#1a2b5e]">{topic.label}</div>
                                {selectedCount > 0 && (
                                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#c9a84c]">
                                    {selectedCount} selected
                                  </div>
                                )}
                              </div>
                              {selectedCount > 0 && (
                                <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1a2b5e] text-white">
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
                        className="flex items-center gap-2 text-sm font-bold text-[#1a2b5e] transition-transform hover:translate-x-[-4px]"
                      >
                        <ArrowLeft size={16} />
                        Back to themes
                      </button>
                      <div className="flex items-center gap-4 rounded-3xl border-2 border-[#1a2b5e]/5 bg-white p-6 shadow-xl shadow-black/5">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#1a2b5e]/5 text-[#1a2b5e]">
                          <TopicIcon icon={activeTopic?.icon} label={activeTopic?.label || ""} className="h-9 w-9" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-[#1a2b5e]">{activeTopic?.label}</h2>
                          <p className="text-sm text-[#4a5568]">Select specific areas of interest</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {activeTopic?.subtopics?.map((subtopic) => {
                          const selected = selectedSubTopics.includes(subtopic.id);
                          return (
                            <button
                              key={subtopic.id}
                              onClick={() => toggleSubTopic(subtopic.id)}
                              className={`flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-all ${
                                selected
                                  ? "border-[#1a2b5e] bg-[#1a2b5e] text-white"
                                  : "border-[#1a2b5e]/5 bg-white text-[#1a2b5e] hover:border-[#1a2b5e]/20"
                              }`}
                            >
                              <span className="font-semibold">{subtopic.label}</span>
                              {selected ? <Check size={18} strokeWidth={3} /> : <div className="h-5 w-5 rounded-full border-2 border-current opacity-20" />}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {step === 4 && passage && (
              <motion.div
                key="step-reading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <StepIntro
                  icon={BookOpen}
                  title="Read and mark unknown words"
                  text="This takes about 3 minutes. Your selected words help Kalyma estimate your starting English reading level."
                />
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#c9842f]/15 bg-[#fff8eb] px-4 py-3 text-left shadow-sm shadow-[#1a2b5e]/5">
                  <Timer className="mt-0.5 h-5 w-5 shrink-0 text-[#c9842f]" />
                  <p className="text-sm font-semibold leading-6 text-[#4a5568]">
                    Quick calibration: read naturally, mark only the words you do not understand, then answer two simple questions.
                  </p>
                </div>
                <PlacementReader
                  passage={passage}
                  selectedWords={selectedUnknownWords}
                  onToggleWord={toggleUnknownWord}
                />
              </motion.div>
            )}

            {step === 5 && passage && (
              <motion.div
                key="step-quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <StepIntro
                  icon={GraduationCap}
                  title="Two quick questions"
                  text="Answer from the passage. These questions check comprehension, not memory."
                />
                <div className="space-y-5">
                  {passage.questions.map((question, questionIndex) => (
                    <div
                      key={question.id}
                      className="rounded-[28px] border-2 border-[#1a2b5e]/5 bg-white p-5 shadow-xl shadow-[#1a2b5e]/5"
                    >
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#c9842f]">
                        Question {questionIndex + 1}
                      </p>
                      <h2 className="mb-4 text-xl font-bold leading-snug text-[#1a2b5e]">{question.question}</h2>
                      <div className="grid gap-3">
                        {question.choices.map((choice) => {
                          const selected = quizAnswers[question.id] === choice.id;
                          return (
                            <button
                              key={choice.id}
                              type="button"
                              onClick={() =>
                                setQuizAnswers((prev) => ({
                                  ...prev,
                                  [question.id]: choice.id,
                                }))
                              }
                              className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${
                                selected
                                  ? "border-[#1a2b5e] bg-[#1a2b5e]/5"
                                  : "border-[#1a2b5e]/5 bg-[#f7f2ea]/45 hover:border-[#1a2b5e]/20"
                              }`}
                            >
                              <span
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                  selected ? "bg-[#1a2b5e] text-white" : "bg-white text-[#1a2b5e]"
                                }`}
                              >
                                {choice.id.toUpperCase()}
                              </span>
                              <span className="text-sm font-semibold leading-6 text-[#334155]">{choice.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 6 && placementResult && (
              <motion.div
                key="step-result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="rounded-[36px] border-2 border-[#1a2b5e]/5 bg-white p-7 text-center shadow-2xl shadow-[#1a2b5e]/10">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#1a2b5e] text-white">
                    <GraduationCap size={30} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c9842f]">
                    Reading level calibrated
                  </p>
                  <h1 className="mt-3 text-4xl font-black text-[#1a2b5e]">
                    Level {placementResult.estimated_level}/15
                  </h1>
                  <p className="mt-2 text-xl font-bold text-[#1a2b5e]">{placementResult.label}</p>
                  <p className="mt-1 text-sm font-semibold text-[#667084]">
                    CEFR hint: {placementResult.cefr_hint} | Confidence {Math.round(placementResult.confidence * 100)}%
                  </p>
                  <p className="mx-auto mt-5 max-w-md rounded-2xl bg-[#f7f2ea] px-5 py-4 text-sm font-semibold leading-6 text-[#4a5568]">
                    {getPlacementMotivation(placementResult.estimated_level)}
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-[#f7f2ea] p-4">
                      <p className="text-2xl font-black text-[#1a2b5e]">{placementResult.final_score}</p>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#667084]">Score</p>
                    </div>
                    <div className="rounded-2xl bg-[#f7f2ea] p-4">
                      <p className="text-2xl font-black text-[#1a2b5e]">{placementResult.quiz_score}/2</p>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#667084]">Quiz</p>
                    </div>
                    <div className="rounded-2xl bg-[#f7f2ea] p-4">
                      <p className="text-2xl font-black text-[#1a2b5e]">{placementResult.unknown_weight_sum}</p>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#667084]">Word weight</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center border-t border-[#1a2b5e]/10 bg-white/80 p-6 backdrop-blur-md">
        <div className="flex w-full max-w-xl gap-4">
          {(step > 0 || (step === 3 && activeTopicId)) && step !== 6 && (
            <button
              onClick={back}
              className="flex items-center gap-2 rounded-2xl border-2 border-[#1a2b5e] px-8 py-4 font-bold text-[#1a2b5e] transition-colors hover:bg-[#1a2b5e]/5"
            >
              <ChevronLeft size={20} />
              Back
            </button>
          )}
          <button
            onClick={next}
            disabled={!canProceed || isSubmitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#1a2b5e] py-4 font-bold text-white shadow-xl shadow-[#1a2b5e]/20 transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-30"
          >
            {isSubmitting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                {step === 3
                  ? "Start placement"
                  : step === 4
                    ? "Continue to questions"
                    : step === 5
                      ? "See my level"
                      : step === 6
                        ? "Start learning"
                        : "Continue"}
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
