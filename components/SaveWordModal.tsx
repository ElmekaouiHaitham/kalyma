"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookMarked, CheckCircle2 } from "lucide-react";

interface SaveWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillWord?: string;
}

export default function SaveWordModal({ isOpen, onClose, prefillWord = "" }: SaveWordModalProps) {
  const [word, setWord] = useState(prefillWord);
  const [definition, setDefinition] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!word.trim()) return;
    // In a real app, this would persist to backend/state
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setWord("");
      setDefinition("");
      onClose();
    }, 1400);
  };

  // Reset fields when opening with a new prefill
  const handleOpen = () => {
    setWord(prefillWord);
    setDefinition("");
    setSaved(false);
  };

  return (
    <AnimatePresence onExitComplete={handleOpen}>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-5 pt-5 pb-10"
            style={{
              background: "white",
              boxShadow: "0 -8px 40px rgba(26,43,94,0.18)",
              maxHeight: "80vh",
            }}
          >
            {/* Handle */}
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "rgba(26,43,94,0.12)" }} />

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #1a2b5e, #2d4080)" }}
                >
                  <BookMarked className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: "#1a2b5e" }}>
                    Save to Word Bank
                  </div>
                  <div className="text-[11px]" style={{ color: "#9aa5b1" }}>
                    Add to your Practice Deck
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(26,43,94,0.06)" }}
              >
                <X className="w-4 h-4" style={{ color: "#9aa5b1" }} />
              </button>
            </div>

            {/* Success State */}
            <AnimatePresence>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-8 gap-3"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(34,197,94,0.12)" }}
                  >
                    <CheckCircle2 className="w-8 h-8" style={{ color: "#22c55e" }} />
                  </div>
                  <p className="font-bold text-base" style={{ color: "#1a2b5e" }}>
                    &ldquo;{word}&rdquo; saved!
                  </p>
                  <p className="text-sm" style={{ color: "#9aa5b1" }}>
                    Added to your Practice Deck
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            {!saved && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: "#4a5568" }}>
                    Word or Phrase
                  </label>
                  <input
                    type="text"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder="e.g. Ephemeral"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{
                      background: "#f5f8ff",
                      border: "1.5px solid rgba(26,43,94,0.12)",
                      color: "#1a2b5e",
                    }}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: "#4a5568" }}>
                    Definition{" "}
                    <span className="font-normal" style={{ color: "#9aa5b1" }}>
                      (optional)
                    </span>
                  </label>
                  <textarea
                    value={definition}
                    onChange={(e) => setDefinition(e.target.value)}
                    placeholder="Brief meaning in English..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                    style={{
                      background: "#f5f8ff",
                      border: "1.5px solid rgba(26,43,94,0.12)",
                      color: "#1a2b5e",
                    }}
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={!word.trim()}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg, #1a2b5e, #0f1d4e)",
                    boxShadow: "0 6px 20px rgba(26,43,94,0.3)",
                  }}
                >
                  <BookMarked className="w-4 h-4" />
                  Add to Practice Deck
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
