"use client";

import { useMemo, useState } from "react";
import { BookMarked, MessageCircle, X } from "lucide-react";

export interface ReaderVocabularyNote {
  id: string;
  rewrite_id: string;
  start_offset: number;
  end_offset: number;
  text: string;
  item_type: "word" | "phrase" | "sentence" | "concept";
  explanation: string;
  example_sentence?: string | null;
  difficulty_reason?: string | null;
}

interface ReaderVocabularyTextProps {
  body: string;
  notes?: ReaderVocabularyNote[];
  onAsk?: (text: string) => void;
  onSave?: (note: ReaderVocabularyNote) => void;
}

interface ActiveNote {
  note: ReaderVocabularyNote;
  x: number;
  y: number;
}

function paragraphRanges(body: string) {
  const paragraphs = body.split(/\n{2,}/).filter(Boolean);
  let cursor = 0;

  return paragraphs.map((text) => {
    const start = body.indexOf(text, cursor);
    const safeStart = start === -1 ? cursor : start;
    cursor = safeStart + text.length;
    return { text, start: safeStart, end: safeStart + text.length };
  });
}

function clampBubbleX(x: number) {
  if (typeof window === "undefined") return x;
  return Math.max(16, Math.min(x, window.innerWidth - 16));
}

export default function ReaderVocabularyText({
  body,
  notes = [],
  onAsk,
  onSave,
}: ReaderVocabularyTextProps) {
  const [activeNote, setActiveNote] = useState<ActiveNote | null>(null);

  const safeNotes = useMemo(
    () =>
      [...notes]
        .filter(
          (note) =>
            note.start_offset >= 0 &&
            note.end_offset > note.start_offset &&
            note.end_offset <= body.length,
        )
        .sort((a, b) => a.start_offset - b.start_offset),
    [body.length, notes],
  );

  const ranges = useMemo(() => paragraphRanges(body), [body]);

  return (
    <>
      {ranges.map((paragraph, paragraphIndex) => {
        const paragraphNotes = safeNotes.filter(
          (note) =>
            note.start_offset >= paragraph.start && note.end_offset <= paragraph.end,
        );
        const chunks: Array<string | ReaderVocabularyNote> = [];
        let cursor = paragraph.start;

        paragraphNotes.forEach((note) => {
          if (note.start_offset > cursor) {
            chunks.push(body.slice(cursor, note.start_offset));
          }
          chunks.push(note);
          cursor = note.end_offset;
        });

        if (cursor < paragraph.end) {
          chunks.push(body.slice(cursor, paragraph.end));
        }

        return (
          <p key={`${paragraph.start}-${paragraphIndex}`}>
            {chunks.map((chunk, chunkIndex) => {
              if (typeof chunk === "string") {
                return <span key={chunkIndex}>{chunk}</span>;
              }

              return (
                <button
                  key={chunk.id}
                  type="button"
                  className="inline rounded-[4px] border-b border-dotted border-[#b56b25] bg-[#fff4df] px-0.5 font-semibold text-[#9a551b] transition-colors hover:bg-[#ffe7bd] focus:outline-none focus:ring-2 focus:ring-[#c9842f]/35"
                  onClick={(event) => {
                    event.stopPropagation();
                    const rect = event.currentTarget.getBoundingClientRect();
                    setActiveNote({
                      note: chunk,
                      x: clampBubbleX(rect.left + rect.width / 2),
                      y: Math.max(72, rect.top - 10),
                    });
                  }}
                >
                  {body.slice(chunk.start_offset, chunk.end_offset)}
                </button>
              );
            })}
          </p>
        );
      })}

      {activeNote && (
        <div
          className="fixed z-50 w-[min(320px,calc(100vw-32px))] rounded-2xl bg-white p-4 text-left shadow-2xl"
          style={{
            left: activeNote.x,
            top: activeNote.y,
            transform: "translate(-50%, -100%)",
            border: "1px solid rgba(26,43,94,0.1)",
            boxShadow: "0 18px 50px rgba(26,43,94,0.18)",
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#c9842f]">
                {activeNote.note.item_type}
              </div>
              <div className="text-base font-extrabold text-[#17265d]">
                {activeNote.note.text}
              </div>
            </div>
            <button
              type="button"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f7f2ea] text-[#64748b]"
              onClick={() => setActiveNote(null)}
              aria-label="Close explanation"
            >
              <X size={14} />
            </button>
          </div>

          <p className="mb-3 text-sm leading-6 text-[#394260]">
            {activeNote.note.explanation}
          </p>

          {activeNote.note.example_sentence && (
            <p className="mb-3 rounded-xl bg-[#f7f2ea] px-3 py-2 text-xs font-medium leading-5 text-[#667084]">
              {activeNote.note.example_sentence}
            </p>
          )}

          {activeNote.note.difficulty_reason && (
            <p className="mb-3 text-xs leading-5 text-[#7b8191]">
              {activeNote.note.difficulty_reason}
            </p>
          )}

          <div className="flex items-center gap-2">
            {onAsk && (
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full bg-[#202b67] px-3 py-2 text-xs font-bold text-white"
                onClick={() => {
                  onAsk(activeNote.note.text);
                  setActiveNote(null);
                }}
              >
                <MessageCircle size={13} />
                Ask Atlas
              </button>
            )}
            {onSave && (
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full bg-[#fff4df] px-3 py-2 text-xs font-bold text-[#9a551b]"
                onClick={() => {
                  onSave(activeNote.note);
                  setActiveNote(null);
                }}
              >
                <BookMarked size={13} />
                Save
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
