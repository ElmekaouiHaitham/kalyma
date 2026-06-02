"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BookMarked,
  CheckCircle2,
  Loader2,
  Plus,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/providers";
import SaveWordModal from "@/components/SaveWordModal";

type QuizChoice = {
  text: string;
  is_correct: boolean;
  rating: number;
};

type ReviewDeckItem = {
  card: {
    id: string;
    interval_days?: number;
    repetitions?: number;
    last_rating?: number | null;
  };
  item: {
    id: string;
    type: string;
    review_mode?: "flashcard" | "quiz";
    content: string;
    translation?: string | null;
    context?: string | null;
    intent?: string | null;
    quiz_question?: string | null;
    quiz_choices?: QuizChoice[] | null;
    quiz_explanation?: string | null;
    source_type?: string | null;
  };
};

type ReviewStats = {
  total_saved: number;
  due_today: number;
};

type ScoreKey = "again" | "hard" | "good" | "easy";
type GlyphName = "archive" | "due" | "quiz" | "flashcard" | "progress" | "score";

const surfaceFont = { fontFamily: "'Space Grotesk', 'Outfit', system-ui, sans-serif" };
const numberFont = { fontFamily: "'Oxanium', 'Space Grotesk', system-ui, sans-serif" };

const ratingToScoreKey = (rating: number): ScoreKey => {
  if (rating <= 0) return "again";
  if (rating <= 2) return "hard";
  if (rating <= 4) return "good";
  return "easy";
};

const sourceLabel = (source?: string | null) => {
  if (!source) return "Saved item";
  return source.charAt(0).toUpperCase() + source.slice(1);
};

const ratingTone = (rating: number) => {
  if (rating <= 0) return "border-red-200 bg-red-50 text-red-700";
  if (rating <= 2) return "border-amber-200 bg-amber-50 text-amber-700";
  if (rating <= 4) return "border-sky-200 bg-sky-50 text-sky-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
};

const responseOptions = [
  {
    label: "Again",
    helper: "Missed it",
    rating: 0,
    icon: RotateCcw,
    className: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  },
  {
    label: "Hard",
    helper: "Shaky",
    rating: 1,
    icon: AlertCircle,
    className: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
  },
  {
    label: "Good",
    helper: "Got it",
    rating: 3,
    icon: CheckCircle2,
    className: "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100",
  },
  {
    label: "Easy",
    helper: "Locked in",
    rating: 5,
    icon: Trophy,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  },
];

function Glyph({ name, className }: { name: GlyphName; className?: string }) {
  const common = "currentColor";
  const paths: Record<GlyphName, ReactNode> = {
    archive: (
      <>
        <path d="M7 6h10l2 3v10H5V9l2-3Z" />
        <path d="M5 9h14" />
        <path d="M9 13h6" />
        <path d="M9 16h4" />
      </>
    ),
    due: (
      <>
        <path d="M7 5v4M17 5v4" />
        <path d="M5 8h14v12H5z" />
        <path d="M8 14h3l2 3 3-6" />
      </>
    ),
    quiz: (
      <>
        <path d="M12 4 19 8v8l-7 4-7-4V8l7-4Z" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
        <path d="M8 10h2M14 10h2" />
      </>
    ),
    flashcard: (
      <>
        <path d="M5 7h14v12H5z" />
        <path d="M8 11h8" />
        <path d="M8 15h5" />
        <path d="m16 5 2 2M8 5 6 7" />
      </>
    ),
    progress: (
      <>
        <path d="M12 4a8 8 0 1 0 8 8" />
        <path d="M12 4v8l6 2" />
        <path d="M17 5h4v4" />
      </>
    ),
    score: (
      <>
        <path d="m12 4 2.3 4.7 5.2.8-3.8 3.7.9 5.2L12 16l-4.6 2.4.9-5.2-3.8-3.7 5.2-.8L12 4Z" />
        <path d="M12 9v4" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke={common}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

function ReviewSigil({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isDark = variant === "dark";
  return (
    <div
      className={cn(
        "relative flex h-16 w-16 items-center justify-center overflow-hidden",
        isDark ? "text-[#f8e2a1]" : "text-[#1a2b5e]",
      )}
      style={{
        clipPath: "polygon(16% 0, 84% 0, 100% 16%, 100% 84%, 84% 100%, 16% 100%, 0 84%, 0 16%)",
        background: isDark
          ? "linear-gradient(135deg, rgba(248,226,161,0.14), rgba(255,255,255,0.04))"
          : "linear-gradient(135deg, rgba(26,43,94,0.08), rgba(201,132,47,0.14))",
        border: isDark ? "1px solid rgba(248,226,161,0.28)" : "1px solid rgba(26,43,94,0.14)",
      }}
    >
      <div className="absolute inset-2 border border-current/20" style={{ clipPath: "inherit" }} />
      <svg viewBox="0 0 72 72" className="h-9 w-9" fill="none" aria-hidden="true">
        <path d="M36 8 58 21v25L36 64 14 46V21L36 8Z" stroke="currentColor" strokeWidth="3" />
        <path d="M25 38 33 46 49 27" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 21h12M40 58h10M52 21v10M14 40h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".55" />
      </svg>
    </div>
  );
}

function PracticeShell({ children }: { children: ReactNode }) {
  return (
    <main
      className="min-h-full overflow-hidden px-4 pb-20 pt-14 md:px-7 md:pb-9 md:pt-4 lg:px-9"
      style={{
        ...surfaceFont,
        background:
          "linear-gradient(90deg, rgba(26,43,94,0.045) 1px, transparent 1px), linear-gradient(0deg, rgba(26,43,94,0.035) 1px, transparent 1px), radial-gradient(circle at 18% 8%, rgba(201,132,47,0.16), transparent 34%), #f7f2ea",
        backgroundSize: "44px 44px, 44px 44px, auto",
      }}
    >
      <div className="mx-auto max-w-[56rem]">
        <header className="mb-4 border-b border-[#1a2b5e]/10 pb-3">
          <div className="flex items-center justify-between gap-4">
            <h1
              className="text-[28px] font-black leading-none text-[#17172f] sm:text-[36px]"
              style={{ fontFamily: "'Oxanium', 'Space Grotesk', system-ui, sans-serif" }}
            >
              Practice
            </h1>
            <div className="inline-flex shrink-0 items-center gap-2 border border-[#c9842f]/30 bg-[#fffaf0]/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#8b5c18]">
              <Glyph name="quiz" className="h-3.5 w-3.5" />
              Adaptive learning
            </div>
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}

function MetricUnit({
  glyph,
  label,
  value,
  tone = "navy",
}: {
  glyph: GlyphName;
  label: string;
  value: string | number;
  tone?: "navy" | "gold" | "green";
}) {
  const toneMap = {
    navy: "text-[#1a2b5e] border-[#1a2b5e]/15 bg-white/80",
    gold: "text-[#8b5c18] border-[#c9842f]/25 bg-[#fff8e8]/90",
    green: "text-[#1a2b5e] border-[#1a2b5e]/15 bg-white/90",
  };

  return (
    <div
      className={cn("relative overflow-hidden border p-2 shadow-[0_8px_20px_rgba(26,43,94,0.06)] backdrop-blur", toneMap[tone])}
      style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-current/20" />
      <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-current/20 bg-white/55">
          <Glyph name={glyph} className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0">
          <div className="text-base font-black leading-none text-[#101b45]" style={numberFont}>
            {value}
          </div>
          <div className="mt-0.5 text-[10px] font-bold text-[#667084]">{label}</div>
        </div>
      </div>
    </div>
  );
}

function AddFlashcardButton({ onClick, variant = "dark" }: { onClick: () => void; variant?: "dark" | "light" }) {
  const dark = variant === "dark";
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center justify-center gap-1.5 rounded-none px-3.5 text-[10px] font-bold transition active:scale-[0.98]",
        dark
          ? "bg-[#f8e2a1] text-[#101b45] shadow-[0_14px_36px_rgba(248,226,161,0.24)] hover:bg-[#ffe9a8]"
          : "bg-[#1a2b5e] text-white shadow-[0_14px_34px_rgba(26,43,94,0.2)] hover:bg-[#26366f]",
      )}
      style={{ clipPath: "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))" }}
    >
      <Plus className="h-3 w-3" />
      Add flashcard
    </button>
  );
}

function AngledActionButton({
  onClick,
  children,
  disabled = false,
}: {
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-8 items-center justify-center gap-1.5 bg-[#f8e2a1] px-4 text-[10px] font-bold text-[#101b45] shadow-[0_10px_24px_rgba(248,226,161,0.16)] transition hover:bg-[#ffe9a8] disabled:cursor-wait disabled:opacity-60"
      style={{ clipPath: "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))" }}
    >
      {children}
    </button>
  );
}

export default function PracticePage() {
  const { session, refreshUser } = useAuth();
  const [deck, setDeck] = useState<ReviewDeckItem[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ total_saved: 0, due_today: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
  const [answering, setAnswering] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [scores, setScores] = useState({ again: 0, hard: 0, good: 0, easy: 0 });
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!session?.access_token) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/stats`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (res.ok) setStats(await res.json());
  }, [session?.access_token]);

  const fetchReviewData = useCallback(async () => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${session.access_token}` };
      const [dueRes, statsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/due`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/stats`, { headers }),
      ]);

      if (!dueRes.ok) throw new Error("Could not load your review queue.");
      const dueDeck = await dueRes.json();
      setDeck(dueDeck);
      setCurrentIndex(0);
      setIsFlipped(false);
      setSelectedChoiceIndex(null);
      setSessionComplete(false);
      setScores({ again: 0, hard: 0, good: 0, easy: 0 });

      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error("Failed to load review data", err);
      setError("Could not load your review queue. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    fetchReviewData();
  }, [fetchReviewData]);

  const currentCard = deck[currentIndex];
  const quizChoices = currentCard?.item.quiz_choices ?? [];
  const isQuiz =
    currentCard?.item.review_mode === "quiz" &&
    Boolean(currentCard?.item.quiz_question) &&
    quizChoices.length === 4;
  const progress = deck.length > 0 ? Math.round((currentIndex / deck.length) * 100) : 0;
  const completedCount = scores.again + scores.hard + scores.good + scores.easy;

  const sessionMix = useMemo(() => {
    const quiz = deck.filter((entry) => entry.item.review_mode === "quiz").length;
    return { quiz, flashcard: deck.length - quiz };
  }, [deck]);

  const submitRating = async (rating: number) => {
    if (!session?.access_token || !currentCard || answering) return false;
    setAnswering(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ card_id: currentCard.card.id, rating }),
      });

      if (!res.ok) throw new Error("Failed to submit rating");
      const result = await res.json();
      if (result?.streak_changed || result?.unlocked_achievements?.length) {
        await refreshUser();
      }
      const scoreKey = ratingToScoreKey(rating);
      setScores((prev) => ({ ...prev, [scoreKey]: prev[scoreKey] + 1 }));
      return true;
    } catch (err) {
      console.error("Failed to submit rating", err);
      setError("Your answer could not be saved. Please try again.");
      return false;
    } finally {
      setAnswering(false);
    }
  };

  const advanceCard = async () => {
    setIsFlipped(false);
    setSelectedChoiceIndex(null);

    if (currentIndex < deck.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    setSessionComplete(true);
    await fetchStats();
  };

  const handleFlashcardRating = async (rating: number) => {
    const submitted = await submitRating(rating);
    if (submitted) await advanceCard();
  };

  const handleChoiceSelect = async (choice: QuizChoice, index: number) => {
    if (selectedChoiceIndex !== null || answering) return;
    setSelectedChoiceIndex(index);
    await submitRating(choice.rating);
  };

  if (loading) {
    return (
      <PracticeShell>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="h-[340px] animate-pulse bg-white/70" style={{ clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px))" }} />
          <div className="space-y-3">
            <div className="h-16 animate-pulse bg-white/70" />
            <div className="h-16 animate-pulse bg-white/60" />
          </div>
        </div>
      </PracticeShell>
    );
  }

  if (deck.length === 0 && !sessionComplete) {
    return (
      <PracticeShell>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section
            className="relative min-h-[300px] overflow-hidden border border-[#1a2b5e]/15 bg-white/90 p-6 text-[#101b45] shadow-[0_18px_48px_rgba(26,43,94,0.1)] backdrop-blur md:p-7"
            style={{
              clipPath: "polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 26px 100%, 0 calc(100% - 26px))",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,248,232,0.9)), linear-gradient(90deg, rgba(26,43,94,0.045) 1px, transparent 1px)",
              backgroundSize: "auto, 28px 28px",
            }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-[#c9842f]/45" />
            <div className="absolute right-6 top-6 h-14 w-14 border-r border-t border-[#c9842f]/25" />
            <div className="absolute bottom-6 left-6 h-14 w-14 border-b border-l border-[#1a2b5e]/15" />
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ReviewSigil variant="light" />
              <h2 className="mt-5 text-3xl font-black text-[#101b45]" style={numberFont}>
                You&apos;re all caught up
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-[#526071]">
                No items are due right now. Manual saves become flashcards; Atlas saves become quiz reviews.
              </p>
              <div className="mt-6">
                <AddFlashcardButton onClick={() => setSaveModalOpen(true)} />
              </div>
            </div>
          </section>

          <aside className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <MetricUnit glyph="archive" label="Total saved" value={stats.total_saved} />
            <MetricUnit glyph="due" label="Due today" value={stats.due_today} tone="green" />
          </aside>
        </div>
        <SaveWordModal isOpen={saveModalOpen} onClose={() => setSaveModalOpen(false)} />
      </PracticeShell>
    );
  }

  if (sessionComplete) {
    const accuracy =
      completedCount > 0 ? Math.round(((scores.good + scores.easy) / completedCount) * 100) : 0;

    return (
      <PracticeShell>
        <section
          className="relative overflow-hidden bg-[#101b45] p-6 text-center text-white shadow-[0_20px_58px_rgba(26,43,94,0.2)] md:p-8"
          style={{ clipPath: "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))" }}
        >
          <div className="mx-auto w-fit">
            <ReviewSigil />
          </div>
          <h2 className="mt-5 text-3xl font-black" style={numberFont}>Session complete</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#d8deee]">
            You reviewed {completedCount} items. Weak answers return sooner; strong answers move forward.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricUnit glyph="progress" label="Reviewed" value={completedCount} />
            <MetricUnit glyph="score" label="Accuracy" value={`${accuracy}%`} tone="green" />
            <MetricUnit glyph="quiz" label="Good or easy" value={scores.good + scores.easy} tone="gold" />
            <MetricUnit glyph="flashcard" label="Needs work" value={scores.again + scores.hard} />
          </div>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={fetchReviewData}
              className="h-10 bg-[#f8e2a1] px-6 text-xs font-bold text-[#101b45] transition hover:bg-[#ffe9a8]"
              style={{ clipPath: "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))" }}
            >
              Refresh queue
            </button>
            <AddFlashcardButton onClick={() => setSaveModalOpen(true)} />
          </div>
        </section>
        <SaveWordModal isOpen={saveModalOpen} onClose={() => setSaveModalOpen(false)} />
      </PracticeShell>
    );
  }

  return (
    <PracticeShell>
      <div className="space-y-3">
        {error && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <section className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
          <MetricUnit glyph="due" label="Due queue" value={deck.length} />
          <MetricUnit glyph="quiz" label="AI quizzes" value={sessionMix.quiz} tone="gold" />
          <MetricUnit glyph="flashcard" label="Flashcards" value={sessionMix.flashcard} tone="green" />
        </section>

        <div className="grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_240px]">
          <section
            className="relative overflow-hidden bg-white p-2.5 shadow-[0_14px_36px_rgba(26,43,94,0.09)] sm:p-3.5"
            style={{
              clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))",
              border: "1px solid rgba(26,43,94,0.14)",
            }}
          >
            <div className="mb-2.5 flex flex-col gap-2 border-b border-[#1a2b5e]/10 pb-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center bg-[#101b45] text-[#f8e2a1]">
                  <Glyph name={isQuiz ? "quiz" : "flashcard"} className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#1a2b5e]" style={numberFont}>
                    {isQuiz ? "AI quiz review" : "Flashcard review"}
                  </div>
                  <div className="text-[10px] font-medium text-[#667084]">
                    Item {currentIndex + 1} of {deck.length} from {sourceLabel(currentCard.item.source_type)}
                  </div>
                </div>
              </div>
              <AddFlashcardButton onClick={() => setSaveModalOpen(true)} variant="light" />
            </div>

            <div className="mb-3 h-1 overflow-hidden bg-[#dfe4ef]">
              <motion.div
                className="h-full bg-[#c9842f]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.25 }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentCard.card.id}-${isFlipped}-${selectedChoiceIndex ?? "none"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {isQuiz ? (
                  <div className="space-y-2.5">
                    <div
                      className="bg-[#101b45] p-3.5 text-white sm:p-4"
                      style={{ clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))" }}
                    >
                      <div className="mb-2 inline-flex items-center gap-1.5 border border-[#f8e2a1]/25 bg-[#f8e2a1]/10 px-2 py-0.5 text-[9px] font-bold text-[#f8e2a1]">
                        <Sparkles className="h-3 w-3" />
                        Autosaved quiz
                      </div>
                      {currentCard.item.intent && (
                        <p className="mb-1.5 text-[10px] font-medium leading-4 text-[#d8deee]">
                          Intent: {currentCard.item.intent}
                        </p>
                      )}
                      <h2 className="text-base font-black leading-tight text-white sm:text-lg" style={numberFont}>
                        {currentCard.item.quiz_question}
                      </h2>
                    </div>

                    <div className="grid gap-1.5">
                      {quizChoices.map((choice, index) => {
                        const isSelected = selectedChoiceIndex === index;
                        const isAnswered = selectedChoiceIndex !== null;
                        const ChoiceIcon = choice.is_correct ? CheckCircle2 : XCircle;

                        return (
                          <button
                            key={`${choice.text}-${index}`}
                            type="button"
                            disabled={isAnswered || answering}
                            onClick={() => handleChoiceSelect(choice, index)}
                            className={cn(
                              "flex min-h-10 w-full items-start gap-2 border bg-[#fbf7f1] p-2 text-left transition disabled:cursor-default",
                              "hover:border-[#c9842f]/55 hover:bg-white",
                              isAnswered && choice.is_correct && "border-emerald-300 bg-emerald-50",
                              isSelected && !choice.is_correct && "border-red-300 bg-red-50",
                              !isAnswered && "border-[#1a2b5e]/12",
                            )}
                            style={{ clipPath: "polygon(0 0, calc(100% - 11px) 0, 100% 11px, 100% 100%, 11px 100%, 0 calc(100% - 11px))" }}
                          >
                            <span
                              className={cn(
                                "flex h-6 w-6 shrink-0 items-center justify-center border text-[10px] font-black",
                                isAnswered && choice.is_correct
                                  ? "border-emerald-300 bg-white text-emerald-700"
                                  : isSelected
                                    ? "border-red-300 bg-white text-red-700"
                                    : "border-[#1a2b5e]/15 bg-white text-[#1a2b5e]",
                              )}
                              style={numberFont}
                            >
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="min-w-0 flex-1 text-[11px] font-semibold leading-4 text-[#1a2b5e]">
                              {choice.text}
                            </span>
                            {isAnswered && (choice.is_correct || isSelected) && (
                              <ChoiceIcon
                                className={cn(
                                  "h-3.5 w-3.5 shrink-0",
                                  choice.is_correct ? "text-emerald-600" : "text-red-600",
                                )}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {selectedChoiceIndex !== null && (
                      <div className="border border-[#1a2b5e]/15 bg-white p-2.5">
                        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-xs font-black text-[#1a2b5e]" style={numberFont}>
                              {quizChoices[selectedChoiceIndex]?.is_correct ? "Correct answer" : "Review this one again"}
                            </p>
                            <p className="mt-1 text-[11px] leading-4 text-[#667084]">
                              {currentCard.item.quiz_explanation || "No explanation was saved for this quiz."}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-bold",
                              ratingTone(quizChoices[selectedChoiceIndex]?.rating ?? 0),
                            )}
                          >
                            SRS score {quizChoices[selectedChoiceIndex]?.rating ?? 0}
                          </span>
                        </div>
                        <button
                          onClick={advanceCard}
                          disabled={answering}
                          className="mt-2.5 h-8 w-full bg-[#1a2b5e] px-3.5 text-[10px] font-bold text-white transition hover:bg-[#26366f] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
                          style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
                        >
                          {currentIndex < deck.length - 1 ? "Continue" : "Finish session"}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => setIsFlipped(true)}
                      className="w-full border border-[#1a2b5e]/15 bg-[#101b45] p-4 text-center text-white transition hover:border-[#c9842f]/50 sm:p-5"
                      style={{ clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))" }}
                    >
                      {!isFlipped ? (
                        <div className="space-y-2.5">
                          <div className="inline-flex items-center gap-1.5 border border-[#f8e2a1]/25 bg-[#f8e2a1]/10 px-2 py-0.5 text-[9px] font-bold text-[#f8e2a1]">
                            <BookMarked className="h-3 w-3" />
                            {currentCard.item.type}
                          </div>
                          <h2 className="break-words text-xl font-black leading-tight text-white sm:text-2xl" style={numberFont}>
                            {currentCard.item.content}
                          </h2>
                          <p className="text-[10px] font-bold text-[#d8deee]">Tap to reveal meaning</p>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          <div>
                            <p className="text-[10px] font-bold text-[#d8deee]">Meaning</p>
                            <h3 className="mt-1 text-base font-black leading-snug text-white" style={numberFont}>
                              {currentCard.item.translation || "No definition provided."}
                            </h3>
                          </div>
                          {currentCard.item.context && (
                            <div className="border border-[#f8e2a1]/20 bg-white/10 p-2.5 text-left">
                              <p className="text-[10px] font-bold text-[#f8e2a1]">Context</p>
                              <p className="mt-1 text-[11px] leading-4 text-[#eef2ff]">
                                {currentCard.item.context}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </button>

                    {!isFlipped ? (
                      <div className="text-center">
                        <AngledActionButton onClick={() => setIsFlipped(true)}>
                          Reveal answer
                        </AngledActionButton>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                        {responseOptions.map((option) => (
                          <button
                            key={option.label}
                            disabled={answering}
                            onClick={() => handleFlashcardRating(option.rating)}
                            className={cn(
                              "flex min-h-12 flex-col items-center justify-center border px-1.5 py-1.5 text-center transition disabled:cursor-wait disabled:opacity-60",
                              option.className,
                            )}
                          >
                            {answering ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <option.icon className="h-4 w-4" />
                            )}
                            <span className="mt-1 text-[10px] font-bold">{option.label}</span>
                            <span className="text-[10px] opacity-80">{option.helper}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </section>

          <aside className="space-y-2">
            <MetricUnit glyph="progress" label="Answers saved" value={completedCount} />
          </aside>
        </div>
      </div>

      <SaveWordModal isOpen={saveModalOpen} onClose={() => setSaveModalOpen(false)} />
    </PracticeShell>
  );
}
