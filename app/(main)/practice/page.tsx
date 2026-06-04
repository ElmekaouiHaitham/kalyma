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
  Trophy,
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
        "relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#17265d]",
        isDark ? "bg-[#17265d] text-white" : "bg-[#f2dda9] text-[#17265d]",
      )}
    >
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
      className="min-h-full overflow-hidden bg-[#fffdf7] px-[8.7vw] pb-8 pt-14 text-[#17265d] md:px-[6.5%] md:py-9"
      style={{
        ...surfaceFont,
      }}
    >
      <div className="mx-auto max-w-3xl">
        <header className="mb-5">
          <div className="flex items-center justify-between gap-4">
            <h1
              className="text-[clamp(2rem,7vw,2.45rem)] font-black leading-tight tracking-[-0.03em] text-[#17265d] md:text-[40px]"
            >
              Practice
            </h1>
            <div className="inline-flex shrink-0 items-center gap-2 rounded-lg border-2 border-[#17265d] bg-[#fff8df] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#8b6d2e]">
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
  return (
    <div
      className={cn(
        "rounded-lg border-2 border-[#17265d] bg-[#fffdf7] p-2.5 text-[#17265d]",
        tone === "gold" && "bg-[#fff8df]",
      )}
    >
      <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f2dda9]">
          <Glyph name={glyph} className="h-3.5 w-3.5 text-[#17265d]" />
        </div>
        <div className="min-w-0">
          <div className="text-xl font-black leading-none text-[#17265d]">
            {value}
          </div>
          <div className="mt-0.5 text-xs font-bold uppercase text-[#394260]">{label}</div>
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
        "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-4 text-xs font-extrabold transition active:scale-[0.98]",
        dark
          ? "bg-[#17265d] text-white shadow-[0_8px_16px_rgba(23,38,93,0.14)] hover:-translate-y-0.5"
          : "border-2 border-[#17265d] bg-[#fffdf7] text-[#17265d] hover:bg-[#f7efd8]",
      )}
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
      className="inline-flex h-11 min-w-[128px] items-center justify-center gap-2 rounded-lg bg-[#17265d] px-5 text-[15px] font-extrabold text-white shadow-[0_8px_16px_rgba(23,38,93,0.14)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-wait disabled:opacity-60"
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
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="h-[340px] animate-pulse rounded-[20px] border-2 border-[#17265d] bg-[#fff8df]" />
          <div className="space-y-3">
            <div className="h-16 animate-pulse rounded-lg border-2 border-[#17265d] bg-[#fffdf7]" />
            <div className="h-16 animate-pulse rounded-lg border-2 border-[#17265d] bg-[#fffdf7]" />
          </div>
        </div>
      </PracticeShell>
    );
  }

  if (deck.length === 0 && !sessionComplete) {
    return (
      <PracticeShell>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
          <section
            className="min-h-[300px] rounded-[20px] border-2 border-[#17265d] bg-[#fff8df] p-5 text-center md:p-6"
          >
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ReviewSigil variant="light" />
              <h2 className="mt-5 text-[clamp(2rem,7vw,2.45rem)] font-black leading-tight tracking-[-0.03em] text-[#17265d] md:text-[40px]">
                You&apos;re all caught up
              </h2>
              <p className="mt-3 max-w-lg text-[16px] font-medium leading-[1.45] text-[#394260] md:text-[17px]">
                No items are due right now. Manual saves become flashcards; Atlas saves become quiz reviews.
              </p>
              <div className="mt-6">
                <AddFlashcardButton onClick={() => setSaveModalOpen(true)} />
              </div>
            </div>
          </section>

          <aside className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
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
          className="rounded-[20px] border-2 border-[#17265d] bg-[#fff8df] p-5 text-center md:p-6"
        >
          <div className="mx-auto w-fit">
            <ReviewSigil variant="light" />
          </div>
          <h2 className="mt-5 text-[clamp(2rem,7vw,2.45rem)] font-black leading-tight tracking-[-0.03em] text-[#17265d] md:text-[40px]">Session complete</h2>
          <p className="mx-auto mt-3 max-w-xl text-[16px] font-medium leading-[1.45] text-[#394260] md:text-[17px]">
            You reviewed {completedCount} items. Weak answers return sooner; strong answers move forward.
          </p>
          <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            <MetricUnit glyph="progress" label="Reviewed" value={completedCount} />
            <MetricUnit glyph="score" label="Accuracy" value={`${accuracy}%`} tone="green" />
            <MetricUnit glyph="quiz" label="Good or easy" value={scores.good + scores.easy} tone="gold" />
            <MetricUnit glyph="flashcard" label="Needs work" value={scores.again + scores.hard} />
          </div>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={fetchReviewData}
              className="inline-flex h-11 min-w-[128px] items-center justify-center rounded-lg bg-[#17265d] px-5 text-[15px] font-extrabold text-white shadow-[0_8px_16px_rgba(23,38,93,0.14)] transition hover:-translate-y-0.5"
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
          <div className="flex items-center gap-2 rounded-xl border-2 border-red-700 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
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
          <section className="rounded-[20px] border-2 border-[#17265d] bg-[#fffdf7] p-3.5 sm:p-4">
            <div className="mb-3 flex flex-col gap-2 border-b-2 border-[#17265d] pb-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2dda9] text-[#17265d]">
                  <Glyph name={isQuiz ? "quiz" : "flashcard"} className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="text-sm font-black text-[#17265d]">
                    {isQuiz ? "AI quiz review" : "Flashcard review"}
                  </div>
                  <div className="text-xs font-semibold text-[#394260]">
                    Item {currentIndex + 1} of {deck.length} from {sourceLabel(currentCard.item.source_type)}
                  </div>
                </div>
              </div>
              <AddFlashcardButton onClick={() => setSaveModalOpen(true)} variant="light" />
            </div>

            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/70 shadow-[inset_0_0_0_1px_rgba(25,42,98,0.02)]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#17265d] to-[#b79646]"
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
                  <div className="rounded-[16px] border-2 border-[#17265d] bg-[#fff8df] p-4">
                    <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#8b6d2e]">
                      Autosaved quiz
                    </p>
                    {currentCard.item.intent && (
                      <p className="mb-2 text-[13px] font-semibold leading-5 text-[#394260]">
                        {currentCard.item.intent}
                      </p>
                    )}
                    <h2 className="mb-3 text-lg font-black leading-snug text-[#17265d]">
                      {currentCard.item.quiz_question}
                    </h2>

                    <div className="grid gap-2.5">
                      {quizChoices.map((choice, index) => {
                        const isSelected = selectedChoiceIndex === index;
                        const isAnswered = selectedChoiceIndex !== null;

                        return (
                          <button
                            key={`${choice.text}-${index}`}
                            type="button"
                            disabled={isAnswered || answering}
                            onClick={() => handleChoiceSelect(choice, index)}
                            className={cn(
                              "flex items-start gap-3 rounded-lg border-2 p-3 text-left transition disabled:cursor-default",
                              isSelected
                                ? "border-[#17265d] bg-[#dfe5fb]"
                                : "border-[#17265d] bg-[#fffdf7] hover:bg-[#f7efd8]",
                              isAnswered && choice.is_correct && !isSelected && "bg-[#fffdf7]",
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black",
                                isSelected ? "bg-[#17265d] text-white" : "bg-[#f2dda9] text-[#17265d]",
                              )}
                            >
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="text-[14px] font-semibold leading-6 text-[#1d2130]">
                              {choice.text}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {selectedChoiceIndex !== null && (
                      <div className="mt-3 rounded-lg border-2 border-[#17265d] bg-[#fffdf7] p-3">
                        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8b6d2e]">
                              {quizChoices[selectedChoiceIndex]?.is_correct ? "Correct answer" : "Review this one again"}
                            </p>
                            <p className="mt-1 text-[14px] font-semibold leading-6 text-[#394260]">
                              {currentCard.item.quiz_explanation || "No explanation was saved for this quiz."}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-bold",
                              ratingTone(quizChoices[selectedChoiceIndex]?.rating ?? 0),
                            )}
                          >
                            SRS score {quizChoices[selectedChoiceIndex]?.rating ?? 0}
                          </span>
                        </div>
                        <button
                          onClick={advanceCard}
                          disabled={answering}
                          className="mt-3 h-9 w-full rounded-lg bg-[#17265d] px-4 text-xs font-black text-white transition hover:bg-[#223373] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
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
                      className="w-full rounded-[16px] border-2 border-[#17265d] bg-[#fff8df] p-4 text-center transition hover:bg-[#f7efd8] sm:p-5"
                    >
                      {!isFlipped ? (
                        <div className="space-y-2.5">
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f2dda9] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[#8b6d2e]">
                            <BookMarked className="h-3 w-3" />
                            {currentCard.item.type}
                          </div>
                          <h2 className="break-words text-[clamp(1.75rem,7vw,2.25rem)] font-black leading-tight tracking-[-0.03em] text-[#17265d]">
                            {currentCard.item.content}
                          </h2>
                          <p className="text-sm font-semibold text-[#394260]">Tap to reveal meaning</p>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          <div>
                            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8b6d2e]">Meaning</p>
                            <h3 className="mt-2 text-xl font-black leading-snug text-[#17265d]">
                              {currentCard.item.translation || "No definition provided."}
                            </h3>
                          </div>
                          {currentCard.item.context && (
                            <div className="rounded-lg border-2 border-[#17265d] bg-[#fffdf7] p-3 text-left">
                              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8b6d2e]">Context</p>
                              <p className="mt-1 text-[14px] font-semibold leading-6 text-[#394260]">
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
                            className="flex min-h-12 flex-col items-center justify-center rounded-lg border-2 border-[#17265d] bg-[#fffdf7] px-2 py-2 text-center text-[#17265d] transition hover:bg-[#f7efd8] disabled:cursor-wait disabled:opacity-60"
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
