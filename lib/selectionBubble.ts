export type SelectionBubblePlacement = "above" | "below";

export interface SelectionBubblePosition {
  x: number;
  y: number;
  placement: SelectionBubblePlacement;
}

const VIEWPORT_PADDING = 12;
const STICKY_HEADER_SAFE_TOP = 72;
const BUBBLE_GAP = 8;
const ESTIMATED_BUBBLE_WIDTH = 250;
const ESTIMATED_BUBBLE_HEIGHT = 44;

function clamp(value: number, min: number, max: number) {
  if (max < min) return (min + max) / 2;
  return Math.min(Math.max(value, min), max);
}

function getAnchorRect(range: Range) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const rects = Array.from(range.getClientRects()).filter(
    (rect) =>
      rect.width > 0 &&
      rect.height > 0 &&
      rect.bottom >= 0 &&
      rect.top <= viewportHeight &&
      rect.right >= 0 &&
      rect.left <= viewportWidth,
  );

  return rects[0] ?? range.getBoundingClientRect();
}

export function getSelectionBubblePosition(range: Range): SelectionBubblePosition | null {
  const rect = getAnchorRect(range);
  if (!rect || rect.width === 0 || rect.height === 0) return null;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const halfBubbleWidth = Math.min(
    ESTIMATED_BUBBLE_WIDTH / 2,
    Math.max(0, viewportWidth / 2 - VIEWPORT_PADDING),
  );

  const x = clamp(
    rect.left + rect.width / 2,
    VIEWPORT_PADDING + halfBubbleWidth,
    viewportWidth - VIEWPORT_PADDING - halfBubbleWidth,
  );

  const canFitAbove =
    rect.top - BUBBLE_GAP - ESTIMATED_BUBBLE_HEIGHT >= STICKY_HEADER_SAFE_TOP;
  const y = canFitAbove
    ? rect.top - BUBBLE_GAP
    : clamp(
        rect.bottom + BUBBLE_GAP,
        STICKY_HEADER_SAFE_TOP,
        viewportHeight - ESTIMATED_BUBBLE_HEIGHT - VIEWPORT_PADDING,
      );

  return {
    x,
    y,
    placement: canFitAbove ? "above" : "below",
  };
}
