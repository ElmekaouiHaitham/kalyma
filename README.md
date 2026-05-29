# Kalyma — Frontend

> The client-side application for **kalyma**, an English learning platform that blends language acquisition with real-world knowledge — through live topic sessions, curated articles, AI conversation, and news. This repository contains the full Next.js frontend; the backend API is maintained in a private repository.

---

## 🧭 Project Overview

**kalyma** is an English learning platform built around the idea that language is best acquired through meaningful content — not drills. Users improve their English while genuinely expanding their knowledge through:

- **Live sessions** on diverse real-world topics (hosted streams users can join and follow along in English)
- **Curated articles** graded to the learner's level, with vocabulary saving built in
- **News feed** covering Business, Technology, Culture, Health, Politics, and Sports
- **Atlas AI** — an AI conversation partner for free-form English practice
- **Spaced-repetition practice deck** to consolidate vocabulary encountered across all content modules

The frontend communicates with a private REST API backend secured via Supabase authentication and exposes a gamification layer (XP, streaks, weekly engagement goals) to keep learners motivated.

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | TypeScript 5 |
| **UI Runtime** | React 19 |
| **Styling** | Tailwind CSS v4 + custom design tokens |
| **Animation** | Framer Motion 12 |
| **Icons** | Lucide React |
| **Auth** | Supabase Auth (`@supabase/supabase-js`) |
| **Markdown** | `react-markdown` |
| **Utilities** | `clsx`, `tailwind-merge` |
| **Build** | ESLint 9, PostCSS, TypeScript compiler |

---

## 🗂️ Project Structure

```
Kalyma/
├── app/
│   ├── (main)/                  # Authenticated app shell
│   │   ├── layout.tsx           # Sidebar + mobile nav + top bar
│   │   ├── home/                # Dashboard / home page
│   │   ├── articles/            # Article reader & catalogue
│   │   ├── library/books/       # Book library
│   │   ├── news/                # News feed & individual articles
│   │   ├── chat/                # Atlas AI conversation interface
│   │   ├── live/                # Live sessions
│   │   ├── practice/            # Spaced-repetition flashcard deck
│   │   └── profile/             # User profile & preferences
│   ├── auth/                    # Login / sign-up page
│   ├── onboarding/              # First-run preferences wizard
│   ├── privacy/ & terms/        # Legal pages
│   ├── providers.tsx            # Global AuthContext (Supabase + backend session)
│   └── layout.tsx               # Root HTML layout
├── components/
│   └── SaveWordModal.tsx        # Reusable vocabulary-save modal
├── hooks/
│   └── useAtlasChat.ts          # Custom hook — streaming AI chat state
├── lib/
│   ├── supabase.ts              # Supabase client singleton
│   ├── data.ts                  # Static data & seed content
│   └── utils.ts                 # cn() helper and misc utilities
├── public/                      # Static assets (logo, images)
├── next.config.ts
├── tailwind.config / postcss.config.mjs
└── tsconfig.json
```

---

## 🔑 Core Features & Architecture

### Authentication — `app/providers.tsx`
- **Supabase Auth** handles the browser-side session (`getSession`, `onAuthStateChange`).
- On every session event the client performs a **token handshake** with the private backend (`POST /auth/verify`). The backend returns a hydrated `UserProfile` object (XP, streak, plan, learning preferences).
- A React Context (`AuthContext`) exposes `{ session, user, isLoading, signOut }` to every child component via the `useAuth()` hook.
- New users are redirected to `/onboarding`; returning users land on `/home`.

### App Shell — `app/(main)/layout.tsx`
- Responsive **sidebar** (240 px, desktop) + **bottom tab bar** (mobile) built with Lucide icons.
- Navigation sections: **Study** (Articles, Books, Practice) and **Interact** (Atlas AI, Live, News).
- A **Weekly Engagement widget** in the sidebar consumes the backend XP-history endpoint and renders a live progress bar toward the user's self-set article-reading goal.
- Reader pages (articles, news, live) render their own full-screen headers — the global top bar is conditionally hidden via a route-prefix allow-list.

### Atlas AI Chat — `app/(main)/chat/`  &  `hooks/useAtlasChat.ts`
- Full-screen conversational interface powered by a **streaming REST endpoint** on the backend.
- `useAtlasChat` is a dedicated custom hook that owns message state, streaming state, and abort handling — keeping the page component presentation-only.
- Messages are rendered as Markdown via `react-markdown`.
- Animated entry/exit of messages using **Framer Motion** (`AnimatePresence`).

### Practice (Spaced Repetition) — `app/(main)/practice/`
- Fetches the user's due flashcard deck from `GET /review/due` and session statistics from `GET /review/stats`.
- Interactive **flip-card UI** — front shows an English word or phrase saved by the user, back reveals its meaning and the original in-context sentence where it was encountered.
- Each card response (Again / Hard / Good / Easy → ratings 0–5) is submitted to `POST /review/answer`, delegating the SM-2 scheduling logic to the backend.
- Session completion screen shows accuracy and per-rating breakdowns.
- Integrates the **SaveWordModal** component, allowing users to add new vocabulary directly from the practice view.

### News Feed — `app/(main)/news/`
- Fetches articles from `GET /news` with optional topic-filter query params (Business, Technology, Culture, Health, Politics, Sports).
- Animated card grid rendered with Framer Motion staggered transitions.
- Individual news items open a dedicated reader route `/news/[id]`.

### Vocabulary Save Modal — `components/SaveWordModal.tsx`
- Context-free, reusable modal component imported across the articles reader, news reader, AI chat, and practice views.
- Lets users flag a word, phrase, or fact to be added to their spaced-repetition review deck via the backend.

---

## 🔐 Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (public) |
| `NEXT_PUBLIC_API_URL` | Base URL of the private backend API |

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with the three variables above
cp .env.example .env.local   # then fill in your values

# 3. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Design Decisions

- **App Router over Pages Router** — leverages React Server Components, nested layouts, and route-group conventions (`(main)`) for clean separation of authenticated vs public surfaces.
- **No global state library** — session and user profile are owned by a single React Context; all feature data is fetched locally in each route, keeping coupling low.
- **Backend-authoritative scheduling** — the frontend never computes SRS intervals. It submits a raw rating integer and receives the next review date from the API, making the algorithm trivially swappable on the backend side.
- **Conditional layout rendering** — rather than duplicating layout code across routes, a single `(main)/layout.tsx` uses pathname inspection to suppress the global chrome on immersive reader pages.

---

## 📦 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server (hot reload) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

---

> **Note:** The backend (API, database schema, AI orchestration, gamification engine, SRS scheduling) is maintained in a private repository and is not included here.
