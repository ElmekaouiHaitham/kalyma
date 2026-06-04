"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  Check,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Dumbbell,
  Footprints,
  GraduationCap,
  HeartPulse,
  Landmark,
  Laptop,
  Loader2,
  LucideIcon,
  Map,
  Microscope,
  Minus,
  Newspaper,
  Palette,
  Play,
  Plus,
  Rocket,
  Target,
  Trophy,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/providers";
import { DAILY_GOALS } from "@/lib/data";

const STEPS = ["Name", "Pace", "Frequency", "Interests", "Reading", "Quiz", "Result"];
const PACE_ICONS: Record<string, LucideIcon> = {
  Casual: Coffee,
  Regular: Footprints,
  Serious: Dumbbell,
  Intensive: Rocket,
};

const TOPIC_ICONS: Record<string, LucideIcon> = {
  laptop: Laptop,
  trophy: Trophy,
  briefcase: Briefcase,
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

type OnboardingActionProps = {
  step: number;
  canProceed: boolean;
  isSubmitting: boolean;
  showBack: boolean;
  onBack: () => void;
  onNext: () => void;
};

const normalizeToken = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9'-]+/g, "");

const getPlacementMotivation = (level: number) => {
  const messages: Record<number, string> = {
    1: "You are entering the intermediate path. Kalyma will keep articles clear enough to follow while turning the words that slow you down into focused review.",
    2: "You can already work with real English when the support is right. Kalyma will give you readable articles and build the missing vocabulary step by step.",
    3: "You have a useful base for real content. Kalyma will help you close the gap between understanding the main idea and catching the precise expressions.",
    4: "You are close to stronger independent reading. Kalyma will show you articles you can mostly understand while steadily stretching your vocabulary.",
    5: "You are ready to learn through serious topics, not isolated exercises. Kalyma will help you turn difficult words into long-term memory.",
    6: "You have enough control to read meaningful articles with support. Kalyma will push you toward clearer comprehension and more natural expression.",
    7: "This is a solid intermediate-plus starting point. Kalyma will help you handle richer articles and collect the vocabulary that makes your English sharper.",
    8: "You can follow complex ideas when the text is well matched. Kalyma will keep challenging you with useful content while protecting you from overload.",
    9: "You are moving into strong upper-intermediate reading. Kalyma will help you notice tone, argument, and precise expressions, not only basic meaning.",
    10: "You are ready for demanding articles across your interests. Kalyma will help you convert that ability into better vocabulary, confidence, and speaking ideas.",
    11: "You can work with advanced English. Kalyma will focus on nuance: how writers frame arguments, soften claims, and choose words with intention.",
    12: "You are close to high-level fluency in reading. Kalyma will keep giving you content that expands your vocabulary without wasting time on material that is too easy.",
    13: "You are ready for C1-style content. Kalyma will challenge you with dense ideas, subtle wording, and expressions that make your English sound more mature.",
    14: "Your reading level is strong. Kalyma will help you polish precision, argument structure, and the kind of vocabulary that improves public speaking.",
    15: "You are ready for the hardest material Kalyma offers. The goal now is refinement: sharper nuance, stronger arguments, and more confident English in real conversations.",
  };

  const safeLevel = Math.min(15, Math.max(1, Math.round(level)));
  return messages[safeLevel];
};

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      {!compact && (
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
          <Image src="/logo.png" alt="" width={32} height={32} className="h-full w-full object-contain" />
        </div>
      )}
      <span className="text-[23px] font-extrabold leading-none tracking-[-0.01em] text-[#17265d] md:text-[26px]">
        kalyma
      </span>
    </div>
  );
}

function HorizontalProgress({ step }: { step: number }) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {STEPS.map((item, index) => (
        <div
          key={item}
          className="h-1.5 overflow-hidden rounded-full bg-white/70 shadow-[inset_0_0_0_1px_rgba(25,42,98,0.02)]"
        >
          <motion.div
            initial={false}
            animate={{ width: index <= step ? "100%" : "0%" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-[#17265d] to-[#b79646]"
          />
        </div>
      ))}
    </div>
  );
}

function DesktopRail({ step }: { step: number }) {
  return (
    <div className="absolute left-11 top-1/2 hidden -translate-y-1/2 items-center gap-5 xl:flex">
      <div className="flex h-[300px] w-2 flex-col overflow-hidden rounded-full border-2 border-[#17265d] bg-white">
        {STEPS.map((item, index) => (
          <div
            key={item}
            className={`flex-1 border-b border-[#17265d] last:border-b-0 ${
              index === step ? "bg-[#17265d]" : ""
            }`}
          />
        ))}
      </div>
      <div className="text-[14px] font-medium uppercase leading-[1.2] tracking-[0.01em] text-[#17265d]">
        <p>
          Step {step + 1}
          <br />
          of 7
        </p>
      </div>
    </div>
  );
}

function WelcomeIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src="/onboarding/welcome-illustration.png"
        alt=""
        width={670}
        height={555}
        priority
        unoptimized
        className="h-full w-full object-contain"
      />
    </div>
  );
}
function PlanningIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src="/onboarding/planning-illustration.png"
        alt=""
        width={526}
        height={498}
        priority
        unoptimized
        className="h-full w-full object-contain"
      />
    </div>
  );
}
function TopicIcon({ icon, label, className }: { icon?: string; label: string; className?: string }) {
  const Icon = icon ? TOPIC_ICONS[icon] : undefined;
  if (Icon) return <Icon className={className} strokeWidth={2.2} />;
  return <span className="text-sm font-black uppercase">{label.slice(0, 2)}</span>;
}

function DesktopFrame({
  step,
  children,
}: {
  step: number;
  children: React.ReactNode;
}) {
  return (
    <div className="hidden min-h-screen grid-cols-[50.4%_49.6%] md:grid">
      <aside className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f3dda9]">
        <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(#c99d48_0.7px,transparent_0.7px)] [background-size:6px_6px]" />
        <DesktopRail step={step} />
        {step === 0 ? (
          <WelcomeIllustration className="relative z-10 h-[46vh] max-h-[430px] w-[58%] max-w-[500px]" />
        ) : (
          <PlanningIllustration className="relative z-10 h-[47vh] max-h-[430px] w-[58%] max-w-[500px]" />
        )}
      </aside>

      <main className="flex min-h-screen flex-col bg-[#fffdf7] px-[6.5%] py-9 text-[#17265d]">
        <header className="flex items-center justify-between">
          <BrandMark compact />
          <p className="text-[14px] font-medium uppercase tracking-[0.04em] text-[#1d2130]">
            Step {step + 1} of {STEPS.length}
          </p>
        </header>
        <div className="flex flex-1 items-center justify-center py-6">
          <div className="w-full max-w-[520px]">{children}</div>
        </div>
      </main>
    </div>
  );
}

function MobileFrame({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f3dda9] md:hidden">
      <div className="px-[8.7vw] pt-6">
        <header className="mb-5 flex items-center justify-between">
          <BrandMark />
          <p className="text-[14px] font-medium uppercase tracking-[0.04em] text-[#1d2130]">
            Step {step + 1} of {STEPS.length}
          </p>
        </header>
        <HorizontalProgress step={step} />
      </div>

      <div className="flex h-[24vh] min-h-[170px] max-h-[220px] items-end justify-center px-5 pt-3">
        {step === 0 ? (
          <WelcomeIllustration className="h-full w-full max-w-[350px]" />
        ) : (
          <PlanningIllustration className="h-full w-full max-w-[340px]" />
        )}
      </div>

      <main className="flex-1 bg-[#fffdf7] px-[8.7vw] pb-8 pt-8 text-[#17265d]">
        {children}
      </main>
    </div>
  );
}

function OnboardingActions({
  step,
  canProceed,
  isSubmitting,
  showBack,
  onBack,
  onNext,
}: OnboardingActionProps) {
  const label =
    step === 3
      ? "Start placement"
      : step === 4
        ? "Continue to questions"
        : step === 5
          ? "See my level"
          : step === 6
            ? "Start learning"
            : "Continue";

  return (
    <div className="mt-6 flex justify-end gap-3 md:mt-7">
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-11 min-w-[92px] items-center justify-center gap-1.5 rounded-lg border-2 border-[#17265d] bg-[#fffdf7] px-4 text-[15px] font-extrabold text-[#17265d] transition hover:bg-[#f7efd8] md:h-12 md:min-w-[98px] md:text-[16px]"
        >
          <ChevronLeft size={18} strokeWidth={3} />
          Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={!canProceed || isSubmitting}
        className="inline-flex h-11 min-w-[128px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#17265d] px-5 text-[15px] font-extrabold text-white shadow-[0_8px_16px_rgba(23,38,93,0.14)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed sm:flex-none md:h-12 md:min-w-[136px] md:text-[16px]"
      >
        {isSubmitting ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <>
            {label}
            <ChevronRight size={20} strokeWidth={2.5} />
          </>
        )}
      </button>
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
    <div className="max-h-[46vh] overflow-y-auto rounded-xl border-2 border-[#17265d] bg-[#fffdf7] p-4 md:max-h-[52vh]">
      <h2 className="mb-2 text-xl font-black tracking-[-0.02em] text-[#17265d]">{passage.title}</h2>
      <p className="mb-4 text-[13px] font-semibold leading-5 text-[#394260]">
        Click every word you do not understand. There is no penalty for honesty.
      </p>

      <div className="select-none text-[16px] font-medium leading-[1.85] text-[#1d2130]">
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
              className={`mx-0.5 rounded-md px-1.5 py-0.5 align-baseline transition ${
                selected
                  ? "bg-[#17265d] text-white"
                  : "text-[#1d2130] hover:bg-[#f3dda9] hover:text-[#17265d]"
              }`}
            >
              {token}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8b7f68]">
          Selected
        </span>
        {selectedWords.length === 0 ? (
          <span className="text-sm font-semibold text-[#394260]">No unknown words selected yet</span>
        ) : (
          selectedWords.map((word) => (
            <button
              key={word}
              type="button"
              onClick={() => onToggleWord(word)}
              className="rounded-full bg-[#f2dda9] px-3 py-1 text-sm font-bold text-[#17265d]"
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
  const [selectedPace, setSelectedPace] = useState<string | null>("Casual");
  const [articleFrequency, setArticleFrequency] = useState<number | null>(3);
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
        article_frequency: articleFrequency || 3,
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

  const showBack = Boolean((step > 0 || (step === 3 && activeTopicId)) && step !== 6);

  const actions = (
    <OnboardingActions
      step={step}
      canProceed={canProceed}
      isSubmitting={isSubmitting}
      showBack={showBack}
      onBack={back}
      onNext={next}
    />
  );

  const renderContent = () => (
    <AnimatePresence mode="wait">
      {step === 0 && (
        <motion.section
          key="step-name"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
        >
          <h1 className="max-w-[440px] text-[clamp(2.25rem,9vw,3rem)] font-black leading-[1.02] tracking-[-0.03em] text-[#17265d] md:text-[44px]">
            What should we call you?
          </h1>
          <p className="mt-5 text-[16px] font-medium leading-[1.45] text-[#17265d] md:text-[18px]">
            We use your name to make the learning space feel personal.
          </p>
          <input
            type="text"
            placeholder="Enter your name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="mt-7 h-12 w-full rounded-lg border-2 border-[#17265d] bg-[#fffdf7] px-4 text-[17px] font-medium text-[#17265d] outline-none transition placeholder:text-[#7d7f86] focus:shadow-[0_0_0_4px_rgba(23,38,93,0.12)] md:mt-8 md:h-14 md:px-5 md:text-[18px]"
            autoFocus
          />
          {actions}
        </motion.section>
      )}

      {step === 1 && (
        <motion.section
          key="step-pace"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
        >
          <h1 className="text-[clamp(2rem,7vw,2.45rem)] font-black leading-tight tracking-[-0.03em] text-[#17265d] md:text-[40px]">
            Choose your learning pace
          </h1>
          <div className="mt-9 grid grid-cols-2 gap-4 md:mt-10">
            {DAILY_GOALS.map((goal) => {
              const selected = selectedPace === goal.label;
              const Icon = PACE_ICONS[goal.label] || Target;
              return (
                <button
                  key={goal.label}
                  type="button"
                  onClick={() => setSelectedPace(goal.label)}
                  className={`relative flex min-h-[108px] flex-col items-center justify-center rounded-[18px] border-2 px-3 text-center transition md:min-h-[116px] ${
                    selected
                      ? "border-[#17265d] bg-[#dfe5fb] shadow-[inset_10px_0_0_#17265d]"
                      : "border-[#17265d] bg-[#fff8df] hover:bg-[#f7efd8]"
                  }`}
                >
                  {selected && (
                    <span className="absolute -right-2.5 -top-2.5 flex h-9 w-9 items-center justify-center rounded-full border-4 border-[#fffdf7] bg-[#17265d] text-white">
                      <Check size={20} strokeWidth={3.2} />
                    </span>
                  )}
                  <Icon className="mb-2 h-7 w-7 text-[#17265d]" strokeWidth={2.2} />
                  <span className="text-[16px] font-black leading-tight text-[#17265d] md:text-[17px]">
                    {goal.label}
                  </span>
                  <span className="mt-1.5 text-[13px] font-medium text-[#3a3d4a] md:text-[14px]">{goal.desc}</span>
                </button>
              );
            })}
          </div>
          {actions}
        </motion.section>
      )}

      {step === 2 && (
        <motion.section
          key="step-frequency"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
        >
          <h1 className="text-[clamp(2rem,7vw,2.45rem)] font-black leading-tight tracking-[-0.03em] text-[#17265d] md:text-[40px]">
            How many articles per week?
          </h1>
          <div className="mt-8 flex items-center justify-between gap-4 md:mt-9">
            <button
              type="button"
              aria-label="Decrease articles per week"
              onClick={() => setArticleFrequency((value) => Math.max(1, (value || 3) - 1))}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#17265d] text-white shadow-[0_8px_18px_rgba(23,38,93,0.18)] transition hover:-translate-y-0.5 md:h-14 md:w-14"
            >
              <Minus size={34} strokeWidth={3} />
            </button>
            <div className="flex h-[138px] min-w-0 flex-1 items-center justify-center rounded-[50%] bg-[#f2dda9] md:h-[160px]">
              <motion.span
                key={articleFrequency}
                initial={{ scale: 0.86, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-[74px] font-black leading-none tabular-nums tracking-[-0.03em] text-[#17265d] md:text-[86px]"
              >
                {articleFrequency}
              </motion.span>
            </div>
            <button
              type="button"
              aria-label="Increase articles per week"
              onClick={() => setArticleFrequency((value) => Math.min(7, (value || 3) + 1))}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#17265d] text-white shadow-[0_8px_18px_rgba(23,38,93,0.18)] transition hover:-translate-y-0.5 md:h-14 md:w-14"
            >
              <Plus size={34} strokeWidth={3} />
            </button>
          </div>
          <p className="mt-6 text-center font-serif text-[30px] font-semibold leading-tight text-[#17265d] md:text-[34px]">
            articles / week
          </p>
          {actions}
        </motion.section>
      )}

      {step === 3 && (
        <motion.section
          key={activeTopicId ? "step-subtopics" : "step-interests"}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
        >
          {!activeTopicId ? (
            <>
              <h1 className="text-[clamp(2rem,7vw,2.45rem)] font-black leading-tight tracking-[-0.03em] text-[#17265d] md:text-[40px]">
                What topics interest you?
              </h1>
              <p className="mt-4 text-[16px] font-medium leading-[1.45] text-[#394260] md:text-[17px]">
                Pick at least 3 subtopics so Kalyma can choose your placement reading.
              </p>
              <div className="mt-7 grid max-h-[44vh] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 md:max-h-[46vh]">
                {isLoadingTopics ? (
                  <div className="col-span-full flex items-center justify-center py-16 text-[#17265d]">
                    <Loader2 className="mr-3 animate-spin" />
                    Loading topics
                  </div>
                ) : (
                  topics.map((topic) => {
                    const selectedCount =
                      topic.subtopics?.filter((subtopic) => selectedSubTopics.includes(subtopic.id)).length || 0;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => setActiveTopicId(topic.id)}
                        className={`relative flex min-h-[100px] flex-col justify-between rounded-[14px] border-2 p-3 text-left transition ${
                          selectedCount > 0
                            ? "border-[#17265d] bg-[#dfe5fb]"
                            : "border-[#17265d] bg-[#fff8df] hover:bg-[#f7efd8]"
                        }`}
                      >
                        <TopicIcon icon={topic.icon} label={topic.label} className="h-6 w-6 text-[#17265d]" />
                        <span className="text-[13px] font-black leading-tight text-[#17265d] md:text-[14px]">
                          {topic.label}
                        </span>
                        {selectedCount > 0 && (
                          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#17265d] text-white">
                            <Check size={14} strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveTopicId(null)}
                className="mb-6 inline-flex items-center gap-2 text-[15px] font-extrabold text-[#17265d]"
              >
                <ArrowLeft size={18} />
                Back to topics
              </button>
              <h1 className="text-[clamp(2rem,7vw,2.45rem)] font-black leading-tight tracking-[-0.03em] text-[#17265d] md:text-[40px]">
                {activeTopic?.label}
              </h1>
              <p className="mt-4 text-[16px] font-medium leading-[1.45] text-[#394260] md:text-[17px]">
                Select the areas you want to read about.
              </p>
              <div className="mt-7 grid max-h-[46vh] gap-2.5 overflow-y-auto pr-1">
                {activeTopic?.subtopics?.map((subtopic) => {
                  const selected = selectedSubTopics.includes(subtopic.id);
                  return (
                    <button
                      key={subtopic.id}
                      type="button"
                      onClick={() => toggleSubTopic(subtopic.id)}
                      className={`flex min-h-[48px] items-center justify-between rounded-lg border-2 px-4 text-left text-[15px] font-extrabold transition ${
                        selected
                          ? "border-[#17265d] bg-[#17265d] text-white"
                          : "border-[#17265d] bg-[#fff8df] text-[#17265d] hover:bg-[#f7efd8]"
                      }`}
                    >
                      {subtopic.label}
                      {selected ? <Check size={22} strokeWidth={3} /> : <span className="h-5 w-5 rounded-full border-2 border-current" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
          {actions}
        </motion.section>
      )}

      {step === 4 && passage && (
        <motion.section
          key="step-reading"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
        >
          <h1 className="text-[clamp(2rem,7vw,2.35rem)] font-black leading-tight tracking-[-0.03em] text-[#17265d] md:text-[38px]">
            Read and mark unknown words
          </h1>
          <p className="mt-4 text-[16px] font-medium leading-[1.45] text-[#394260] md:text-[17px]">
            Read naturally, mark only the words you do not understand, then answer two questions.
          </p>
          <div className="mt-6">
            <PlacementReader
              passage={passage}
              selectedWords={selectedUnknownWords}
              onToggleWord={toggleUnknownWord}
            />
          </div>
          {actions}
        </motion.section>
      )}

      {step === 5 && passage && (
        <motion.section
          key="step-quiz"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
        >
          <h1 className="text-[clamp(2rem,7vw,2.45rem)] font-black leading-tight tracking-[-0.03em] text-[#17265d] md:text-[40px]">
            Two quick questions
          </h1>
          <p className="mt-4 text-[16px] font-medium leading-[1.45] text-[#394260] md:text-[17px]">
            Answer from the passage. These questions check comprehension, not memory.
          </p>
          <div className="mt-6 max-h-[50vh] space-y-4 overflow-y-auto pr-1">
            {passage.questions.map((question, questionIndex) => (
              <div key={question.id} className="rounded-[16px] border-2 border-[#17265d] bg-[#fff8df] p-4">
                <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#8b6d2e]">
                  Question {questionIndex + 1}
                </p>
                <h2 className="mb-3 text-lg font-black leading-snug text-[#17265d]">{question.question}</h2>
                <div className="grid gap-2.5">
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
                        className={`flex items-start gap-3 rounded-lg border-2 p-3 text-left transition ${
                          selected
                            ? "border-[#17265d] bg-[#dfe5fb]"
                            : "border-[#17265d] bg-[#fffdf7] hover:bg-[#f7efd8]"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                            selected ? "bg-[#17265d] text-white" : "bg-[#f2dda9] text-[#17265d]"
                          }`}
                        >
                          {choice.id.toUpperCase()}
                        </span>
                        <span className="text-[14px] font-semibold leading-6 text-[#1d2130]">{choice.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {actions}
        </motion.section>
      )}

      {step === 6 && placementResult && (
        <motion.section
          key="step-result"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
        >
          <h1 className="text-[clamp(2rem,7vw,2.45rem)] font-black leading-tight tracking-[-0.03em] text-[#17265d] md:text-[40px]">
            Your reading level is ready
          </h1>
          <div className="mt-7 rounded-[20px] border-2 border-[#17265d] bg-[#fff8df] p-5 text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8b6d2e]">
              Reading level calibrated
            </p>
            <p className="mt-3 text-[48px] font-black leading-none text-[#17265d]">
              {placementResult.estimated_level}/15
            </p>
            <p className="mt-3 text-[20px] font-black text-[#17265d]">{placementResult.label}</p>
            <p className="mt-2 text-[13px] font-semibold text-[#394260]">
              CEFR hint: {placementResult.cefr_hint} | Confidence{" "}
              {Math.round(placementResult.confidence * 100)}%
            </p>
            <p className="mt-4 text-[14px] font-semibold leading-6 text-[#394260]">
              {getPlacementMotivation(placementResult.estimated_level)}
            </p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <div className="rounded-lg border-2 border-[#17265d] bg-[#fffdf7] p-2.5 text-center">
              <p className="text-xl font-black text-[#17265d]">{placementResult.final_score}</p>
              <p className="text-xs font-bold uppercase text-[#394260]">Score</p>
            </div>
            <div className="rounded-lg border-2 border-[#17265d] bg-[#fffdf7] p-2.5 text-center">
              <p className="text-xl font-black text-[#17265d]">{placementResult.quiz_score}/2</p>
              <p className="text-xs font-bold uppercase text-[#394260]">Quiz</p>
            </div>
            <div className="rounded-lg border-2 border-[#17265d] bg-[#fffdf7] p-2.5 text-center">
              <p className="text-xl font-black text-[#17265d]">{placementResult.unknown_weight_sum}</p>
              <p className="text-xs font-bold uppercase text-[#394260]">Words</p>
            </div>
          </div>
          {actions}
        </motion.section>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-[#fffdf7]">
      <DesktopFrame step={step}>{renderContent()}</DesktopFrame>
      <MobileFrame step={step}>{renderContent()}</MobileFrame>
      {error && (
        <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-32px)] max-w-xl -translate-x-1/2 rounded-xl border-2 border-red-700 bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-700 shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}
