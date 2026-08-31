# Personal Space — System Architecture & AI Reference Guide

> **Important**: This file contains the complete architectural rules, directory map, design tokens, Supabase database schema, and file-by-file responsibilities for the **Personal Space** application. Any AI agent or developer working on this codebase should read this file to understand the system instantly without needing to scan every single file.

---

## 1. Core Principles & Coding Standards

1. **Strict File Size Limit**: **No single file may exceed 500 lines of code (LOC)**.
2. **Multi-Device Supabase Sync Engine (`supabaseSyncService` & `supabaseSyncMiddleware`)**:
   - **Bidirectional Cloud Hydration on Login**: When a user logs in on a new device, Incognito window, mobile browser, or office PC:
     - `App.tsx` immediately invokes `syncUserData(userId, email)`.
     - Automatically fetches cloud profile, tasks, subtasks, notes, mood entries, and custom music tracks.
     - Seeds/migrates any existing local tasks & custom music tracks to the newly authenticated Supabase account seamlessly so zero data is lost.
   - **Real-Time Reactive Middleware (`supabaseSyncMiddleware.ts`)**:
     - Transparently listens to all Redux actions (`tasks/*`, `music/*`, `auth/*`).
     - Optimistically updates local Redux & storage with 0ms UI latency.
     - Triggers background PostgreSQL mutations (`upsertTask`, `deleteTask`, `upsertMusicTrack`, `deleteMusicTrack`, `updateProfile`) to Supabase.
   - **Offline-First Resilience**: If offline or Supabase keys are missing, the app gracefully falls back to browser **IndexedDB** (`PersonalSpaceDB` v1) and **LocalStorage** without errors.

3. **Features Implemented**:
   - **Home Page (Dashboard)**: All 9 widgets (Date & Progress, Encouragement Badge, Focus Timer, Today's Tasks preview, Quick Notes preview synced live with TanStack Query / IndexedDB, Weekly Productivity Chart, Upcoming Events, Goals preview, Mood Today).
   - **To-Do Page (Full Task Manager)**: Full-featured task management with:
     - 2 Clean Dropdown Selectors (`Filter Status ▾` & `Category ▾`) eliminating horizontal pill wrapping.
     - Visible Subtasks Checklist directly interactive on task cards with completion toggles and `+ Add Subtask`.
     - High-contrast Dark Mode contrast tokens (`#1A1F21`, `#F3F4F6`, `#CBD2DC`, `#2E373A`).
     - Minimum 44px touch targets on checkboxes and actions.
   - **Adaptive Multi-View Calendar**:
     - View Switcher: `Month` | `Week` | `Day`.
     - **Month View**: Clean 7x6 month grid with 48px touch targets, date numbers + colored priority dots (`🔴 High`, `🟡 Medium`, `🟢 Normal`) without squeezed text. Tapping any date opens a slide-up **Day Detail Bottom Sheet** (`CalendarDayDetailSheet`).
     - **Week View**: 7-Day touch pill strip + smooth horizontal swipeable **Day Card Carousel** (`CalendarWeekCarousel`).
     - **Day View**: 8 AM - 9 PM vertical timeline schedule for focused day planning.
   - **World-Class Focus Audio & YouTube Engine (5 Award-Winning Presets)**:
     - Permanently mounted audio & YouTube IFrame API playback engine with real-time scrubber and duration tracking.
     - Auto-fetch song title, artist, and circular album art from YouTube URLs.
     - **5 Design Presets**:
       1. **Classic Botanical Vinyl (`classic_vinyl`)** (Default) — Authentic turntable platter with concentric grooves, tonearm, brass center spindle, and warm turntable aura.
       2. **Aurora Fluid Glass (`aurora_glass`)** (Apple Music & Arc Vision) — Multi-layered mesh aurora glow, frosted curved acrylic glass, 20-bar animated dynamic sound wave, floating squircle album artwork with specular reflection.
       3. **OB-4 Industrial HiFi (`industrial_hifi`)** (Teenage Engineering & Braun Design) — Matte anodized slate chassis with industrial screws, amber phosphor retro OLED matrix panel, live segment meters, and tactile mechanical push keys.
       4. **Cyberpunk Cassette (`cyber_cassette`)** (Neo-Tokyo Cyberdeck Studio) — Transparent smoked acrylic cassette casing, dual spinning magnetic tape spools, cyan neon VU glow, and futuristic Japanese typography.
       5. **Zen Wabi-Sabi Island (`zen_wabi_sabi`)** (Japanese Minimalist) — Circular SVG progress orbit ring around rotating disc & clean serif layout.
     - Themed progress scrubber lines & Volume Popover Slider on all presets (zero raw black lines).
     - Theme-following minimized floating pill bar.
   - **Zero-Clutter Mobile Navigation**:
     - Bottom Navigation Bar with primary tabs (`Home`, `To Do`, `Notes`, `Calendar`) and `... More` button.
     - `More` Slide-Up Sheet integrating User Profile card, Login/Logout, Theme Switcher, Daily Quote, Goals, Mood, and Database Settings.
   - **Command Palette (`Ctrl + K` / `Cmd + K`)**:
     - Global keyboard listener with `e.preventDefault()` to prevent browser quick panel collision.
     - Instant spotlight search for tasks, notes, pages, and quick actions.
   - **Notes Workspace (Knowledge Garden)**: High-performance Markdown Notes system backed by browser **IndexedDB** (`PersonalSpaceDB` v1) and **TanStack Query** (`staleTime: 5 mins`) with 0ms input latency, concurrent low-priority rendering, and touch-scrollable markdown toolbar.

---

## 2. Directory Map & File Responsibilities

```
Personal Space/
├── personalSpace.md                        # Master Architecture & AI Reference Guide (This file)
├── supabase_schema.sql                     # Supabase SQL Schema (Tables, RLS, Triggers, Music Tracks)
├── .env                                    # VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
├── package.json                            # Project dependencies and scripts
├── tsconfig.json                           # TypeScript configuration
├── vite.config.ts                          # Vite configuration
├── index.html                              # Root HTML entry with YouTube API & Google Fonts
└── src/
    ├── main.tsx                            # App mounting with Redux & TanStack QueryClientProvider
    ├── App.tsx                             # Master layout router, session watcher & cloud hydration (< 150 LOC)
    ├── index.css                           # Tailwind CSS v4 directives (@custom-variant dark)
    ├── vite-env.d.ts                       # YouTube IFrame API & Window type extensions
    │
    ├── types/                              # Strict TypeScript Interfaces (< 250 LOC each)
    │   ├── common.types.ts                 # Shared UI types, themes, navigation tabs
    │   ├── task.types.ts                   # Task, priority, category, subtask types
    │   ├── note.types.ts                   # Note, color themes, category tags, filter tabs
    │   ├── goal.types.ts                   # Goal and milestone types
    │   ├── mood.types.ts                   # Mood entries and reflection types
    │   ├── focus.types.ts                  # Focus session and timer types
    │   └── supabase.types.ts               # Database generated types (profiles, tasks, subtasks, notes, user_music_tracks, etc.)
    │
    ├── lib/                                # Core Library Integrations
    │   ├── indexedDb.ts                    # Pure async IndexedDB engine (PersonalSpaceDB v1)
    │   ├── supabase.ts                     # Supabase client initializer
    │   └── sound.ts                        # Web Audio API chime synthesis
    │
    ├── services/                           # Cloud Sync & API Services
    │   └── supabaseSyncService.ts          # Bidirectional multi-device sync for tasks, subtasks, music & profile (< 260 LOC)
    │
    ├── store/                              # Redux Toolkit Slices, Middleware & Store
    │   ├── index.ts                        # Store configuration & typed hooks (< 40 LOC)
    │   ├── middleware/
    │   │   └── supabaseSyncMiddleware.ts   # Reactive background cloud sync middleware (< 110 LOC)
    │   └── slices/
    │       ├── authSlice.ts                # Supabase user session & profile state
    │       ├── tasksSlice.ts               # Task CRUD, filters, subtasks, sync, default seeds (< 175 LOC)
    │       ├── notesSlice.ts               # Local note slice fallback
    │       ├── moodSlice.ts                # Mood logging & streak calculation
    │       ├── focusSlice.ts               # Pomodoro countdown state & history
    │       ├── musicSlice.ts               # Audio playback, YouTube tracks, volume, setTracks, and 5 presets (< 190 LOC)
    │       ├── uiSlice.ts                  # Tabs, More sheet, Quote modal, Command palette, Modals, Toasts
    │       └── settingsSlice.ts            # Sound and notification preferences
    │
    ├── components/
    │   ├── ui/                             # Fully Custom UI Elements (< 330 LOC each)
    │   ├── layout/                         # Structural App Shell Components (Header, BottomNav, AuthModal, etc.)
    │   ├── music/                          # Music Player Engine & 5 Themed Presets
    │   └── dashboard/                      # Main Dashboard Widgets (< 250 LOC each)
    │
    ├── features/                           # Dedicated Full Feature Views (Tasks, Calendar, Notes, Settings)
    └── utils/                              # Helper Functions (uuid, youtubeUtils, quoteData, markdownUtils, dateUtils, storage)
```
