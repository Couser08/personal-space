# 🌿 Personal Space — Mindful Daily Workspace

A serene, botanical-themed personal productivity and knowledge garden built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, **TanStack Query**, **Redux Toolkit**, **IndexedDB**, and **Supabase**.

[![Deploy with Vercel](https://vercel.com/button)](https://personal-space-one-weld.vercel.app)

---

## ✨ Features

- **🌸 Serene Botanical Aesthetic**: Designed with calming botanical tones (Sage Green `#6BAA7A`, Soft Lavender `#C7C9F5`, Warm Sand `#F2E8D5`, Cool Slate `#4F5D75`, and Charcoal `#1F2937`).
- **☀️ Light Botanical (Default) & 🌙 Dark Slate**: Smooth class-based theme toggle powered by Tailwind CSS v4 custom variants.
- **📊 Master Home Dashboard (9 Widgets)**:
  - Date & Daily Progress Bar
  - Affirmation & Encouragement Card
  - Pomodoro Focus Timer with Web Audio harmonic chimes
  - Today's Tasks checklist with inline addition
  - Quick Notes snippet previews synced live
  - Weekly Productivity Analytics bar chart
  - Upcoming Exams & Milestones countdown
  - Top Goals progress tracker
  - Expressive Mood Check-in
- **✅ Full-Featured To-Do Management**:
  - Priority Badges (`High`, `Medium`, `Low`) & Category tags (`Personal`, `Work`, `Study`, `Health`, `Project`).
  - Custom React Portal `DatePicker` (Calendar grid with Today/Tomorrow shortcuts) & `TimePicker` (12h stepper + presets) with zero overflow clipping.
  - Subtask checklists, search, and smart filter tabs (`Today`, `Upcoming`, `High Priority`, `Completed`).
- **📝 High-Performance Notes Workspace**:
  - **0ms Input Latency**: Isolated high-speed Markdown editor with keyboard shortcuts (`Ctrl+B`, `Ctrl+I`, `Ctrl+S`, `Tab` indentation).
  - **React 19 Concurrent Low-Priority Rendering**: `useDeferredValue` ensures live preview rendering never delays typing commits.
  - **O(1) Block-Level Diffing**: Discrete memoized blocks for lag-free performance on long documents.
  - **Interactive Checklists**: Check/uncheck boxes directly inside the live rendered view.
  - **Offline-First IndexedDB Engine**: `PersonalSpaceDB` v1 provides instant 0ms offline startup.
  - **TanStack Query Caching**: Cached queries (`staleTime: 5 mins`) eliminate repeated network fetches.
  - **500ms Non-blocking Debounced Auto-Save**: Silent background synchronization with live status pill (`Saving...` / `Saved 🌿`).
  - **Pastel Color Themes & Tagging**: Lavender, Sand, Sage, Rose, Slate with category filters and pinning.
- **🔒 Supabase Cloud Sync & Authentication**:
  - Email/Password sign-in, sign-up, passwordless Magic Links, and offline guest mode.
  - Row-Level Security (RLS), GIN trigram full-text search, and multi-device Realtime websocket sync.
- **🔊 Pure Web Audio Synthesizer**: Wooden clicks, task complete chimes, and meditation bells without external asset dependencies.
- **📱 Responsive & Collapsible Sidebar**: Smooth spring transition between full rail and slim icon-only mode (`w-20` / 80px).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling & Tokens**: Tailwind CSS v4, Framer Motion
- **Icons**: Lucide React
- **State Management**: Redux Toolkit, TanStack Query
- **Local Database**: Browser IndexedDB (`PersonalSpaceDB`)
- **Cloud Backend**: Supabase (PostgreSQL, Auth, RLS, Realtime)
- **Deployment**: Vercel

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Couser08/personal-space.git
cd personal-space
npm install
```

### 2. Configure Supabase (Optional for Cloud Sync)
Create a `.env` file from `.env.example`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
*(If left empty, the app runs in resilient Local-First Mode with IndexedDB and localStorage).*

### 3. Run Database Schema
Execute the SQL script in [`supabase_schema.sql`](./supabase_schema.sql) in your [Supabase SQL Editor](https://supabase.com/dashboard).

### 4. Start Development Server
```bash
npm run dev
```

---

## 📄 Architecture & Rules

For detailed architectural guidelines, token definitions, and module boundaries, see [`personalSpace.md`](./personalSpace.md). All files strictly maintain a **< 500 lines of code** modularity limit.
