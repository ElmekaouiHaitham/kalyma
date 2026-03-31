"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  X,
  Bot,
  Send,
  BookMarked,
  Sparkles,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { BOOKS } from "@/lib/data";
import SaveWordModal from "@/components/SaveWordModal";

// Local extended book data (matching the books page)
const BOOKS_EXTENDED = [
  {
    id: "sherlock",
    title: "The Adventure of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    level: "Intermediate",
    readingTime: "15 min read",
    language: "English",
    image: "/book_sherlock.png",
    cover: "🔍",
    description: "Follow the world's greatest detective through mystery and crime in Victorian London.",
    content: `To Sherlock Holmes she is always the woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex. It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind.

He was, I take it, the most perfect reasoning and observing machine that the world has seen, but as a lover he would have placed himself in a false position. He never spoke of the softer passions, save with a gibe and a sneer. They were admirable things for the observer — excellent for drawing the veil from men's motives and actions. But for the trained reasoner to admit such intrusions into his own delicate and finely adjusted temperament was to introduce a distracting factor which might throw a doubt upon all his mental results.

It was in the year '87 that Sherlock Holmes's studies first brought him into contact with the strange case which is here set forth. During the entire winter of that year we saw very little of each other. It was only when Holmes received a wire from Inspector G. Lestrade that the full nature of the matter was made clear.

"Come at once if convenient — if inconvenient come all the same." Such was the peremptory summons that arrived at Baker Street one morning. I found Holmes pacing about his room in a restless, eager manner, the fingers tapping on the table, and the feet shuffling on the floor.

"Something of importance," said I.

"It proves to be of considerable importance," he answered. "Would you be kind enough to accompany me this morning? You know that peculiar instinct that tells me when a case will be of interest. I feel it now."

"Of course," I answered. "I shall be delighted." And it was that simple reply that launched us into one of the most singular adventures of our collaborative career.`,
  },
  {
    id: "british",
    title: "Great British Facts",
    author: "British Culture Study",
    level: "Intermediate",
    readingTime: "10 min read",
    language: "English",
    image: "/book_british.png",
    cover: "🇬🇧",
    description: "Discover fascinating facts about British culture, history, and traditions.",
    content: `The United Kingdom is a country full of fascinating contradictions. It is a nation that invented parliamentary democracy yet has an unelected monarch as its head of state. It built the largest empire in world history and yet its heartlands are characterized by understatement, reserve, and a deep suspicion of bombast.

The British have given the world Shakespeare, Newton, Darwin, and the Beatles. They invented football, cricket, and lawn tennis — and subsequently complained for centuries about foreigners becoming better at them. They built railways, industrialised the world, and then developed a complicated relationship with the very technology they created.

Tea is the national drink, consumed at a rate of approximately 100 million cups per day. The British relationship with tea is not merely practical — it is a ritual. You have tea when you wake up, tea at elevenses, tea after lunch, afternoon tea, and tea before bed. In moments of crisis, the British response is invariably to put the kettle on.

The weather is another defining characteristic. In a country where the climate is temperate but famously unpredictable, discussing the weather has become an art form and a social lubricant. A comment about the unseasonable warmth of a Tuesday in March can open doors that a direct question about personal circumstances never could.

London itself is a city of extraordinary contrasts, where a thousand years of history exists side by side with cutting-edge architecture and one of the world's most diverse populations. From the Crown Jewels in the Tower of London to the Tate Modern's turbine hall, the city contains multitudes.`,
  },
  {
    id: "stories",
    title: "Learn English Through Stories",
    author: "Kalyma Editorial",
    level: "Beginner",
    readingTime: "8 min read",
    language: "English",
    image: "/book_stories.png",
    cover: "📖",
    description: "Improve your English through simple, engaging short stories.",
    content: `Once there was a young woman named Emma who wanted to learn English. She lived in a small town and did not have many opportunities to practice.

Every morning, Emma woke up early and read simple English books. She kept a notebook beside her. Whenever she found a new word, she wrote it down. She also wrote the meaning and an example sentence.

"Learning is like building a house," her teacher told her. "You need one brick at a time."

Emma liked this idea. She practiced one new word every day. At first, it was slow. But after three months, she knew ninety new words. After six months, she could have simple conversations.

One day, a tourist came to her town. The tourist was lost and needed help. He spoke only English. Emma's heart beat fast. "I can help," she said quietly.

The tourist looked surprised. Emma gave simple directions. She spoke slowly and clearly. The tourist understood and said, "Thank you so much! Your English is wonderful."

Emma smiled. It was the best compliment she had ever received. She realized that every small step matters. Every word learned, every sentence practiced — they all add up. The path to fluency begins with a single word.

That night, she opened her notebook and wrote: "Today I helped someone. I am improving."`,
  },
  {
    id: "vocabulary",
    title: "Improve Your Vocabulary",
    author: "Kalyma Editorial",
    level: "Beginner",
    readingTime: "12 min read",
    language: "English",
    image: "/book_vocabulary.png",
    cover: "📝",
    description: "Learn new words and expand your English vocabulary day by day.",
    content: `Words are the building blocks of communication. The more words you know, the more precisely you can express your thoughts, understand others, and engage with the world around you. Building a strong vocabulary is not a matter of memorizing long lists — it is about encountering words in context and making them your own.

The most effective vocabulary learners are voracious readers. They read widely: newspapers, novels, essays, and online articles. When they encounter an unfamiliar word, they pause at it. They try to guess its meaning from context first, and then they confirm their guess with a dictionary.

Consider the word "ephemeral." It comes from the Greek "ephemeros," meaning lasting only one day. Today it is used to describe anything brief or fleeting. "The ephemeral nature of fame" — a famous person's glory that fades quickly. Once you have encountered this word in several contexts, it becomes genuinely yours.

Another powerful technique is to learn words in families. Learn not just "happy" but also "happiness," "happily," "unhappy," and "unhappiness." Understanding how words transform — through prefixes and suffixes — allows you to decode words you have never seen before.

Spaced repetition, the practice of reviewing words at gradually increasing intervals, is scientifically proven to transfer vocabulary from short-term to long-term memory. Use flashcard apps or physical cards, and revisit words just as you are on the verge of forgetting them. This is precisely where lasting learning happens.`,
  },
];

// Also support the data.ts BOOKS (b1, b2, b3)
const ALL_BOOKS = [
  ...BOOKS_EXTENDED,
  ...BOOKS.map((b) => ({
    ...b,
    cover: b.cover,
    image: "",
    readingTime: `${b.readingTime} min`,
  })),
];

export default function BookReaderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const book = ALL_BOOKS.find((b) => b.id === id) ?? ALL_BOOKS[0];

  const [panelOpen, setPanelOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "ai",
      text: `Welcome! I'll help you understand "${book.title}" by ${book.author}. Select any text to ask me about it, or use the chat below!`,
    },
  ]);

  const [selectionBubble, setSelectionBubble] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveWord, setSaveWord] = useState("");
  const [fontSize, setFontSize] = useState(16);

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setSelectionBubble(null);
      return;
    }
    const text = selection.toString().trim().slice(0, 80);
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setSelectionBubble({
      text,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  }, []);

  const askAIAboutSelection = (text: string) => {
    setSelectionBubble(null);
    window.getSelection()?.removeAllRanges();
    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: `Explain: "${text}"` },
      {
        role: "ai",
        text: `In "${book.title}", the phrase "${text}" carries significant meaning. This is written in ${book.language || "English"} at a ${book.level} level. The word choice here reflects the author's style — ${book.author} was known for using precise, evocative language. Would you like me to explain the vocabulary, grammar, or the broader literary context?`,
      },
    ]);
    setPanelOpen(true);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: userMsg },
      {
        role: "ai",
        text: `Excellent question about "${book.title}"! In response to: "${userMsg}" — ${book.author}'s work explores themes that are deeply relevant to language learning. The vocabulary used here demonstrates patterns common in ${book.level || "intermediate"} ${book.language || "English"} texts. Would you like to discuss the grammar structure or key vocabulary?`,
      },
    ]);
  };

  const paragraphs = (book as any).content?.split("\n\n").filter(Boolean) ?? [
    book.description || "Content coming soon.",
  ];

  return (
    <div style={{ background: "#faf7f2", minHeight: "100vh" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3"
        style={{
          background: "rgba(250,247,242,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(26,43,94,0.08)",
        }}
      >
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(26,43,94,0.06)", border: "1px solid rgba(26,43,94,0.1)" }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: "#1a2b5e" }} />
        </button>

        <div className="flex-1 min-w-0 text-center">
          <div className="text-xs font-semibold truncate" style={{ color: "#9aa5b1" }}>
            {book.author}
          </div>
        </div>

        {/* Font size controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFontSize((f) => Math.max(13, f - 1))}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: "rgba(26,43,94,0.06)", color: "#1a2b5e" }}
          >
            A−
          </button>
          <button
            onClick={() => setFontSize((f) => Math.min(22, f + 1))}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: "rgba(26,43,94,0.06)", color: "#1a2b5e" }}
          >
            A+
          </button>
        </div>
      </div>

      {/* Book info strip */}
      <div
        className="px-5 py-5 flex items-center gap-4"
        style={{
          background: "linear-gradient(135deg, #1a2b5e 0%, #2d4080 100%)",
        }}
      >
        <div
          className="w-14 h-20 rounded-xl flex items-center justify-center text-3xl shrink-0 shadow-lg"
          style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}
        >
          {(book as any).cover}
        </div>
        <div className="flex-1 min-w-0">
          <h1
            className="text-lg font-bold text-white leading-tight mb-1"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {book.title}
          </h1>
          <div className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.65)" }}>
            {book.author}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(201,168,76,0.3)", color: "#d4b86a" }}
            >
              {book.level}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              <Clock size={11} />
              {typeof book.readingTime === "number" ? `${book.readingTime} min` : book.readingTime}
            </span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              {(book as any).language || "English"}
            </span>
          </div>
        </div>
      </div>

      {/* Tip */}
      <div
        className="mx-5 mt-5 mb-2 flex items-start gap-2 p-3 rounded-xl text-sm"
        style={{
          background: "rgba(26,43,94,0.06)",
          border: "1px solid rgba(26,43,94,0.1)",
        }}
      >
        <span className="text-base">💡</span>
        <p style={{ color: "#6b7280" }}>
          <strong className="font-semibold" style={{ color: "#1a2b5e" }}>Tip:</strong>{" "}
          Select any text to ask Atlas AI about it or save it as a vocabulary word.
        </p>
      </div>

      {/* Reading content */}
      <div
        className="max-w-2xl mx-auto px-5 pb-32 pt-4 space-y-5"
        onMouseUp={handleTextSelection}
        onTouchEnd={handleTextSelection}
        style={{
          color: "#2d3748",
          fontSize: fontSize,
          lineHeight: 1.85,
          fontFamily: "'Georgia', 'Times New Roman', serif",
        }}
      >
        {paragraphs.map((para: string, i: number) => (
          <p key={i}>{para}</p>
        ))}

        {/* Chapter navigation */}
        <div
          className="flex items-center justify-between pt-8 mt-8"
          style={{ borderTop: "1px solid rgba(26,43,94,0.1)" }}
        >
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "rgba(26,43,94,0.07)", color: "#1a2b5e" }}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <span className="text-xs font-medium" style={{ color: "#9aa5b1" }}>
            Chapter 1 of {(book as any).totalChapters || 12}
          </span>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #1a2b5e, #0f1d4e)" }}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Text-selection bubble */}
      <AnimatePresence>
        {selectionBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-50 flex items-center gap-1 rounded-2xl px-2 py-1.5 shadow-xl"
            style={{
              left: Math.min(selectionBubble.x, window.innerWidth - 210),
              top: selectionBubble.y,
              transform: "translate(-50%, -100%)",
              background: "#1a2b5e",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <button
              onClick={() => askAIAboutSelection(selectionBubble.text)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold text-white"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <Sparkles size={11} />
              Ask AI
            </button>
            <div className="w-px h-4" style={{ background: "rgba(255,255,255,0.2)" }} />
            <button
              onClick={() => {
                setSaveWord(selectionBubble.text);
                setSaveModalOpen(true);
                setSelectionBubble(null);
                window.getSelection()?.removeAllRanges();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-semibold"
              style={{ color: "#c9a84c" }}
            >
              <BookMarked size={11} />
              Save
            </button>
            <button
              onClick={() => setSelectionBubble(null)}
              className="px-1"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB – Atlas AI */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setPanelOpen(true)}
        className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl"
        style={{ background: "linear-gradient(135deg, #1a2b5e, #2d4080)", boxShadow: "0 8px 30px rgba(26,43,94,0.4)" }}
      >
        <Bot className="w-6 h-6 text-white" />
      </motion.button>

      {/* Atlas AI Bottom Sheet */}
      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setPanelOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl flex flex-col"
              style={{
                background: "var(--bg-surface, #1a2535)",
                border: "1px solid rgba(255,255,255,0.1)",
                height: "62vh",
                maxHeight: 500,
              }}
            >
              <div className="w-10 h-1 rounded-full mx-auto mt-3 mb-1" style={{ background: "rgba(255,255,255,0.15)" }} />

              <div
                className="flex items-center justify-between px-4 py-3 border-b shrink-0"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                    style={{ background: "linear-gradient(135deg, #1a2b5e, #2d4080)" }}
                  >
                    ⭐
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">Atlas AI</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      Reading assistant
                    </div>
                  </div>
                </div>
                <button onClick={() => setPanelOpen(false)} style={{ color: "rgba(255,255,255,0.4)" }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className="px-4 py-2.5 rounded-2xl max-w-xs text-sm leading-relaxed"
                      style={
                        msg.role === "user"
                          ? {
                              background: "linear-gradient(135deg, #1a2b5e, #2d4080)",
                              color: "white",
                              borderRadius: "20px 20px 4px 20px",
                            }
                          : {
                              background: "rgba(255,255,255,0.08)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              borderRadius: "20px 20px 20px 4px",
                              color: "rgba(255,255,255,0.88)",
                            }
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2.5 text-sm rounded-xl outline-none"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "white",
                    }}
                    placeholder="Ask about this book…"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  />
                  <button
                    onClick={sendChat}
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, #1a2b5e, #2d4080)" }}
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SaveWordModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        prefillWord={saveWord}
      />
    </div>
  );
}
