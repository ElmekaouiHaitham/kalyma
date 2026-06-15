"use client";

import { createElement, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { BookMarked, CheckCircle2, Loader2, MessageCircle, X } from "lucide-react";

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
  onSave?: (note: ReaderVocabularyNote) => Promise<void> | void;
}

interface ActiveNote {
  note: ReaderVocabularyNote;
}

interface ParsedTextNode {
  kind: "text";
  start: number;
  end: number;
}

interface ParsedElementNode {
  kind: "element";
  tag: string;
  attrs: string;
  children: ParsedHtmlNode[];
}

type ParsedHtmlNode = ParsedTextNode | ParsedElementNode;

const ALLOWED_HTML_TAGS = new Set([
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "dd",
  "div",
  "dl",
  "dt",
  "em",
  "figcaption",
  "figure",
  "h2",
  "h3",
  "h4",
  "hr",
  "i",
  "li",
  "ol",
  "p",
  "pre",
  "section",
  "span",
  "strong",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
]);

const DANGEROUS_HTML_TAGS = new Set([
  "embed",
  "iframe",
  "math",
  "object",
  "script",
  "style",
  "svg",
]);

const VOID_HTML_TAGS = new Set(["br", "hr"]);
const TABLE_STRUCTURE_TAGS = new Set(["table", "thead", "tbody", "tfoot", "tr"]);

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

export function stripReaderMarkup(value: string) {
  return value.replace(/\*\*/g, "");
}

function decodeHtmlEntities(value: string) {
  return value.replace(
    /&(#\d+|#x[\da-f]+|amp|lt|gt|quot|apos|nbsp);/gi,
    (entity, code: string) => {
      const normalized = code.toLowerCase();

      if (normalized === "amp") return "&";
      if (normalized === "lt") return "<";
      if (normalized === "gt") return ">";
      if (normalized === "quot") return "\"";
      if (normalized === "apos") return "'";
      if (normalized === "nbsp") return " ";

      if (normalized.startsWith("#x")) {
        const parsed = Number.parseInt(normalized.slice(2), 16);
        return Number.isFinite(parsed) && parsed <= 0x10ffff
          ? String.fromCodePoint(parsed)
          : entity;
      }

      if (normalized.startsWith("#")) {
        const parsed = Number.parseInt(normalized.slice(1), 10);
        return Number.isFinite(parsed) && parsed <= 0x10ffff
          ? String.fromCodePoint(parsed)
          : entity;
      }

      return entity;
    },
  );
}

function displayReaderText(value: string) {
  return decodeHtmlEntities(stripReaderMarkup(value));
}

function containsHtml(value: string) {
  return /<\/?\s*[a-zA-Z][\w:-]*(?:\s[^<>]*)?>/.test(value);
}

function parseHtmlNodes(body: string): ParsedHtmlNode[] {
  const root: ParsedElementNode = {
    kind: "element",
    tag: "root",
    attrs: "",
    children: [],
  };
  const stack: ParsedElementNode[] = [root];
  const tagPattern = /<\/?\s*([a-zA-Z][\w:-]*)([^>]*)>/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  const appendText = (start: number, end: number) => {
    if (end <= start) return;
    stack[stack.length - 1].children.push({ kind: "text", start, end });
  };

  while ((match = tagPattern.exec(body)) !== null) {
    const fullTag = match[0];
    const tag = match[1].toLowerCase();
    const attrs = match[2] ?? "";
    const tagStart = match.index;
    const tagEnd = tagPattern.lastIndex;
    const isClosing = /^<\s*\//.test(fullTag);
    const isSelfClosing = /\/\s*>$/.test(fullTag) || VOID_HTML_TAGS.has(tag);

    appendText(cursor, tagStart);

    if (DANGEROUS_HTML_TAGS.has(tag) && !isClosing) {
      const closePattern = new RegExp(`</\\s*${tag}\\s*>`, "ig");
      closePattern.lastIndex = tagEnd;
      const closeMatch = closePattern.exec(body);
      cursor = closeMatch ? closeMatch.index + closeMatch[0].length : tagEnd;
      tagPattern.lastIndex = cursor;
      continue;
    }

    cursor = tagEnd;

    if (!ALLOWED_HTML_TAGS.has(tag)) {
      continue;
    }

    if (isClosing) {
      for (let index = stack.length - 1; index > 0; index -= 1) {
        if (stack[index].tag === tag) {
          stack.length = index;
          break;
        }
      }
      continue;
    }

    const node: ParsedElementNode = {
      kind: "element",
      tag,
      attrs,
      children: [],
    };
    stack[stack.length - 1].children.push(node);

    if (!isSelfClosing) {
      stack.push(node);
    }
  }

  appendText(cursor, body.length);

  return root.children;
}

function trimRange(body: string, start: number, end: number) {
  let safeStart = start;
  let safeEnd = end;

  while (safeStart < safeEnd && /\s/.test(body[safeStart])) {
    safeStart += 1;
  }

  while (safeEnd > safeStart && /\s/.test(body[safeEnd - 1])) {
    safeEnd -= 1;
  }

  return { start: safeStart, end: safeEnd };
}

function splitTextParagraphRanges(body: string, start: number, end: number) {
  const ranges: Array<{ start: number; end: number }> = [];
  const text = body.slice(start, end);
  const separatorPattern = /\n{2,}/g;
  let cursor = start;
  let match: RegExpExecArray | null;

  while ((match = separatorPattern.exec(text)) !== null) {
    const nextEnd = start + match.index;
    const range = trimRange(body, cursor, nextEnd);
    if (range.end > range.start) {
      ranges.push(range);
    }
    cursor = start + match.index + match[0].length;
  }

  const lastRange = trimRange(body, cursor, end);
  if (lastRange.end > lastRange.start) {
    ranges.push(lastRange);
  }

  return ranges;
}

function readHtmlAttribute(attrs: string, name: string) {
  const pattern = new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`, "i");
  const match = pattern.exec(attrs);
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
}

function safeHref(attrs: string) {
  const href = readHtmlAttribute(attrs, "href")?.trim();
  if (!href) return null;

  const lowerHref = href.toLowerCase();
  if (
    lowerHref.startsWith("javascript:") ||
    lowerHref.startsWith("data:") ||
    lowerHref.startsWith("vbscript:")
  ) {
    return null;
  }

  if (
    lowerHref.startsWith("https://") ||
    lowerHref.startsWith("http://") ||
    lowerHref.startsWith("mailto:") ||
    lowerHref.startsWith("/") ||
    lowerHref.startsWith("#")
  ) {
    return href;
  }

  return null;
}

export default function ReaderVocabularyText({
  body,
  notes = [],
  onAsk,
  onSave,
}: ReaderVocabularyTextProps) {
  const [activeNote, setActiveNote] = useState<ActiveNote | null>(null);
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);
  const [savedNoteId, setSavedNoteId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

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
  const htmlNodes = useMemo(() => (containsHtml(body) ? parseHtmlNodes(body) : null), [body]);
  const activeNoteId = activeNote?.note.id ?? null;
  const isSavingActiveNote = activeNoteId !== null && savingNoteId === activeNoteId;
  const isSavedActiveNote = activeNoteId !== null && savedNoteId === activeNoteId;

  const handleSave = async () => {
    if (!activeNote || !onSave || isSavingActiveNote) return;

    const currentId = activeNote.note.id;
    setSavingNoteId(currentId);
    setSavedNoteId(null);
    setSaveError(null);

    try {
      await onSave(activeNote.note);
      setSavedNoteId(currentId);
      window.setTimeout(() => {
        setActiveNote((current) => (current?.note.id === currentId ? null : current));
        setSavedNoteId((current) => (current === currentId ? null : current));
      }, 900);
    } catch (error) {
      console.error("Failed to save vocabulary note", error);
      setSaveError("Could not save this yet.");
    } finally {
      setSavingNoteId((current) => (current === currentId ? null : current));
    }
  };

  const renderTextRange = (start: number, end: number, keyPrefix: string) => {
    const rangeNotes = safeNotes.filter(
      (note) => note.start_offset >= start && note.end_offset <= end,
    );
    const chunks: Array<string | ReaderVocabularyNote> = [];
    let cursor = start;

    rangeNotes.forEach((note) => {
      if (note.start_offset > cursor) {
        chunks.push(body.slice(cursor, note.start_offset));
      }
      chunks.push(note);
      cursor = note.end_offset;
    });

    if (cursor < end) {
      chunks.push(body.slice(cursor, end));
    }

    return chunks.map((chunk, chunkIndex) => {
      if (typeof chunk === "string") {
        return <span key={`${keyPrefix}-text-${chunkIndex}`}>{displayReaderText(chunk)}</span>;
      }

      return (
        <button
          key={`${keyPrefix}-note-${chunk.id}`}
          type="button"
          className="inline rounded-[2px] px-0.5 font-black text-[#0f7a3d] underline decoration-[#22c55e]/55 decoration-2 underline-offset-[3px] transition-colors hover:text-[#075f2c] hover:decoration-[#075f2c] focus:outline-none focus:ring-2 focus:ring-[#22c55e]/35"
          onClick={(event) => {
            event.stopPropagation();
            setSaveError(null);
            setActiveNote({ note: chunk });
          }}
        >
          {displayReaderText(body.slice(chunk.start_offset, chunk.end_offset))}
        </button>
      );
    });
  };

  const renderRootText = (node: ParsedTextNode, keyPrefix: string) =>
    splitTextParagraphRanges(body, node.start, node.end).map((range, index) => (
      <p key={`${keyPrefix}-paragraph-${index}`}>
        {renderTextRange(range.start, range.end, `${keyPrefix}-${index}`)}
      </p>
    ));

  const renderHtmlChildren = (
    children: ParsedHtmlNode[],
    parentTag: string,
    keyPrefix: string,
  ): ReactNode[] => {
    const rendered: ReactNode[] = [];

    children.forEach((child, index) => {
      const childKey = `${keyPrefix}-${index}`;

      if (child.kind === "text") {
        if (parentTag === "root") {
          rendered.push(...renderRootText(child, childKey));
          return;
        }

        if (TABLE_STRUCTURE_TAGS.has(parentTag) && !body.slice(child.start, child.end).trim()) {
          return;
        }

        rendered.push(...renderTextRange(child.start, child.end, childKey));
        return;
      }

      rendered.push(renderHtmlElement(child, childKey));
    });

    return rendered;
  };

  const renderHtmlElement = (node: ParsedElementNode, key: string): ReactNode => {
    const children = renderHtmlChildren(node.children, node.tag, key);
    const props: Record<string, unknown> = { key };

    if (node.tag === "a") {
      const href = safeHref(node.attrs);
      props.className =
        "font-bold text-[#202b67] underline decoration-[#202b67]/30 underline-offset-2 transition-colors hover:text-[#0f7a3d]";
      if (href) {
        props.href = href;
        props.target = "_blank";
        props.rel = "noreferrer";
      }
    } else if (node.tag === "table") {
      return (
        <div
          key={key}
          className="my-6 overflow-x-auto rounded-xl border border-[#e6d9c9] bg-white"
        >
          <table className="w-full min-w-[520px] border-collapse text-left text-sm leading-6">
            {children}
          </table>
        </div>
      );
    } else if (node.tag === "th") {
      props.className =
        "border-b border-r border-[#e6d9c9] bg-[#f7f2ea] px-3 py-2 align-top font-extrabold text-[#17265d] last:border-r-0";
    } else if (node.tag === "td") {
      props.className =
        "border-b border-r border-[#e6d9c9] px-3 py-2 align-top text-[#394260] last:border-r-0";
    } else if (node.tag === "tr") {
      props.className = "last:[&_td]:border-b-0 last:[&_th]:border-b-0";
    } else if (node.tag === "ul") {
      props.className = "my-5 list-disc space-y-1 pl-6";
    } else if (node.tag === "ol") {
      props.className = "my-5 list-decimal space-y-1 pl-6";
    } else if (node.tag === "li") {
      props.className = "pl-1";
    } else if (node.tag === "blockquote") {
      props.className = "my-6 border-l-4 border-[#c9842f] pl-4 text-[#667084]";
    } else if (node.tag === "pre") {
      props.className =
        "my-5 overflow-x-auto rounded-xl bg-[#17172f] px-4 py-3 text-sm leading-6 text-white";
    } else if (node.tag === "code") {
      props.className = "rounded bg-[#f4efe7] px-1.5 py-0.5 text-[0.92em] text-[#17265d]";
    } else if (node.tag === "h2" || node.tag === "h3" || node.tag === "h4") {
      props.className = "mb-3 mt-8 font-extrabold leading-tight text-[#17172f]";
    } else if (node.tag === "hr") {
      props.className = "my-8 border-[#e6d9c9]";
    } else if (node.tag === "figure") {
      props.className = "my-6";
    } else if (node.tag === "figcaption") {
      props.className = "mt-2 text-sm text-[#667084]";
    }

    return createElement(node.tag, props, children.length > 0 ? children : undefined);
  };

  const renderPlainParagraphs = () =>
    ranges.map((paragraph, paragraphIndex) => (
      <p key={`${paragraph.start}-${paragraphIndex}`}>
        {renderTextRange(paragraph.start, paragraph.end, `plain-${paragraphIndex}`)}
      </p>
    ));

  return (
    <>
      {htmlNodes ? renderHtmlChildren(htmlNodes, "root", "html") : renderPlainParagraphs()}

      {activeNote && (
        <div
          className="fixed z-50 max-h-[min(420px,calc(100vh-48px))] w-[min(340px,calc(100vw-32px))] overflow-y-auto rounded-2xl bg-white p-4 text-left shadow-2xl"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            border: "1px solid rgba(26,43,94,0.1)",
            boxShadow: "0 18px 50px rgba(26,43,94,0.18)",
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#138a45]">
                {activeNote.note.item_type}
              </div>
              <div className="text-base font-black text-[#0f7a3d]">
                {stripReaderMarkup(activeNote.note.text)}
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
            {stripReaderMarkup(activeNote.note.explanation)}
          </p>

          {activeNote.note.example_sentence && (
            <p className="mb-3 rounded-xl bg-[#f7f2ea] px-3 py-2 text-xs font-medium leading-5 text-[#667084]">
              {stripReaderMarkup(activeNote.note.example_sentence)}
            </p>
          )}

          {activeNote.note.difficulty_reason && (
            <p className="mb-3 text-xs leading-5 text-[#7b8191]">
              {stripReaderMarkup(activeNote.note.difficulty_reason)}
            </p>
          )}

          <div className="flex items-center gap-2">
            {onAsk && (
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full bg-[#202b67] px-3 py-2 text-xs font-bold text-white"
                onClick={() => {
                  onAsk(stripReaderMarkup(activeNote.note.text));
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
                className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition-colors disabled:cursor-wait ${
                  isSavedActiveNote
                    ? "bg-[#e8f8ee] text-[#137a3a]"
                    : "bg-[#0f7a3d] text-white hover:bg-[#0b642f]"
                }`}
                onClick={handleSave}
                disabled={isSavingActiveNote || isSavedActiveNote}
              >
                {isSavingActiveNote ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : isSavedActiveNote ? (
                  <CheckCircle2 size={13} />
                ) : (
                  <BookMarked size={13} />
                )}
                {isSavingActiveNote ? "Saving..." : isSavedActiveNote ? "Saved" : "Save"}
              </button>
            )}
          </div>
          {saveError && (
            <p className="mt-2 text-xs font-semibold text-red-600" role="status">
              {saveError}
            </p>
          )}
        </div>
      )}
    </>
  );
}
