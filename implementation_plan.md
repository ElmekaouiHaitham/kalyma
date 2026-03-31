# Implementation Plan — User Flow Completion

## Status: What Already Exists ✅

| Flow | Status | Notes |
|---|---|---|
| Landing → Auth → Onboarding (Pace, Time, Preferences) → Loading → Home | ✅ Done | Fully implemented |
| Home → News Page (today + previously read) | ✅ Done | Implemented with categories & search |
| Home → Articles Page | ✅ Done | Lists articles, featured card |
| Home → Books Page | ✅ Done | Shows books list |
| Home → Atlas AI Chat | ✅ Done | Basic conversational chat |
| Home → Live Sessions (past & upcoming) | ✅ Done | Past sessions with summary expansion |
| Home → Practice (Spaced Repetition) | ✅ Done | SRS flashcards with SRS controls |
| Profile → Settings Menu | ✅ Partial | Settings items have no `href`, just `null` |

---

## Missing or Incomplete Pieces 🔴

### 1. Home Page — News Notification Banner
- The home page has no mention of news or a notification about new articles tailored to user preferences.

### 2. News Page — Preference-based Filtering
- News is currently filtered by category, but there is no connection to the preferences selected in onboarding.

### 3. Atlas AI — Save Word to Word Bank (Spaced Repetition)
- No "Save to Word Bank" button exists in the Chat (`/chat`), Articles (`/library/[id]`), Books, or Live sessions pages.
- We need a **floating / contextual "Save Word" button** that adds a term to the `PRACTICE_DECK`.

### 4. Articles — "Not Read Yet" Highlight
- Articles list doesn't mark unread items. We need a `read` field in the data and a visual badge ("New").

### 5. Articles & Books — In-Content Atlas AI Integration
- No text-selection + "Ask AI" ability exists in the article reader (`/library/[id]`). This is a key differentiator. Needs a floating "Ask AI" tooltip on text selection.

### 6. Live Sessions — Current Session Video View
- The live session page has a "Join" button that goes nowhere. No video placeholder page exists.

### 7. Profile — Settings Links Need Destinations
- All `Preferences`, `Notifications`, and `Settings` items in the profile menu have `href: null`. They need working destinations (even if simple stub pages with real content).

### 8. News Page → Atlas AI Integration
- No way to open Atlas AI from within a news article.

---

## Proposed Changes

> [!IMPORTANT]
> To keep scope manageable and impactful, we will focus on the highest-value missing pieces. The goal is UI completeness — all core flows should be navigable and represented visually.

### Priority 1 — Save to Word Bank (Universal Feature)
A reusable `<SaveWordModal>` component that can be triggered from any page.

#### [NEW] components/SaveWordModal.tsx
- A slide-up modal with a word input, definition input, and "Add to Practice Deck" button.
- On save, it stores to a client-side list (mock state, can be wired to backend later).

#### [MODIFY] chat/page.tsx
- Add a "💾 Save Word" quick-action button to AI responses.

#### [MODIFY] library/[id]/page.tsx
- Add text-selection listener → floating "Ask AI" + "Save Word" tooltip bubble.

#### [MODIFY] live/page.tsx
- Add "Save to Word Bank" button next to each vocabulary word in the session summary.

---

### Priority 2 — Home Page News Notification
#### [MODIFY] home/page.tsx
- Add a small "📰 News" notification banner/card near the top with "3 new articles matching your interests" linking to `/news`.

---

### Priority 3 — Unread Badges on Articles
#### [MODIFY] lib/data.ts
- Add `read: boolean` field to `ARTICLES` entries.

#### [MODIFY] articles/page.tsx
- Show a green "New" dot/badge for unread articles.

---

### Priority 4 — Live Session Video Page
#### [NEW] live/[id]/page.tsx
- A simple full-screen video placeholder with a live countdown, participant list stub, and Atlas AI chat bar at the bottom.

---

### Priority 5 — Profile Settings Targets
#### [MODIFY] profile/page.tsx
- Wire "Language & Level" → `/onboarding` (re-take onboarding).
- Wire "Notifications" → a stub notifications settings page.
- Wire "Settings" → same page scrolled to a subscription section.

---

## Verification Plan

### Automated Tests
- Navigate each flow start-to-finish using the browser tool.
- Verify the "Save Word" modal opens and closes on Chat, Articles, and Live pages.
- Verify unread badges appear on Articles list.
- Verify News notification appears on Home page.
- Verify Live session "Join" navigates to the video page.

### Manual Verification
- Review on mobile viewport that Save Word modal is tappable.
- Confirm the "Ask AI" floating tooltip appears on text selection in the article reader.
