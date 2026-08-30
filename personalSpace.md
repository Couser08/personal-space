# Personal Space — System Architecture & AI Reference Guide

> **Important**: This file contains the complete architectural rules, directory map, design tokens, Supabase database schema, and file-by-file responsibilities for the **Personal Space** application. Any AI agent or developer working on this codebase should read this file to understand the system instantly without needing to scan every single file.

---

## 1. Core Principles & Coding Standards

1. **Strict File Size Limit**: **No single file may exceed 500 lines of code (LOC)**.
2. **Features Implemented**:
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
   - **World-Class Focus Audio & YouTube Engine (3 2026 Award-Winning Presets)**:
     - Permanently mounted audio & YouTube IFrame API playback engine with real-time scrubber and duration tracking.
     - Auto-fetch song title, artist, and circular album art from YouTube URLs.
     - **3 World-Class Design Presets**:
       1. **Aurora Fluid Glass (`aurora_glass`)** (Apple Music & Arc Vision 2026) — Multi-layered mesh aurora glow, frosted curved acrylic glass, 20-bar animated dynamic sound wave, floating squircle album artwork with specular reflection.
       2. **OB-4 Industrial HiFi (`industrial_hifi`)** (Teenage Engineering & Braun Design) — Matte anodized slate chassis with industrial screws, amber phosphor retro OLED matrix panel, live segment meters, and tactile mechanical push keys.
       3. **Cyberpunk Cassette (`cyber_cassette`)** (Neo-Tokyo Cyberdeck Studio) — Transparent smoked acrylic cassette casing, dual spinning magnetic tape spools, cyan neon VU glow, and futuristic Japanese typography.
     - Docked **Floating Island Pill Bar** on mobile and desktop.
   - **Zero-Clutter Mobile Navigation**:
     - Bottom Navigation Bar with primary tabs (`Home`, `To Do`, `Notes`, `Calendar`) and `... More` button.
     - `More` Slide-Up Sheet integrating User Profile card, Login/Logout, Theme Switcher, Daily Quote, Goals, Mood, and Database Settings.
   - **Command Palette (`Ctrl + K` / `Cmd + K`)**:
     - Global keyboard listener with `e.preventDefault()` to prevent browser quick panel collision.
     - Instant spotlight search for tasks, notes, pages, and quick actions.
   - **Daily Quote & Hinglish Reflection**:
     - Dedicated Quote trigger button (`""`) in Header and More sheet opening the **Quote Modal** with English quote, Hinglish meaning, Likes counter, and Shuffle/Next button.
   - **Notes Workspace (Knowledge Garden)**: High-performance Markdown Notes system backed by browser **IndexedDB** (`PersonalSpaceDB` v1) and **TanStack Query** (`staleTime: 5 mins`) with 0ms input latency, concurrent low-priority rendering, and touch-scrollable markdown toolbar.
   - **Supabase Cloud Sync & Offline Auth**: Full PostgreSQL schema (`supabase_schema.sql`) with Row-Level Security (RLS) for users, tasks, notes, goals, mood entries, and music tracks.
   - **Theme Engine**: Light Botanical default with smooth Dark Mode toggle via Tailwind CSS v4 `@custom-variant dark`.

3. **Tech Stack**:
   - **Framework**: React 19 + TypeScript + Vite
   - **Styling**: Tailwind CSS v4 + Custom Design Tokens
   - **Icons**: Lucide React (`lucide-react`)
   - **Motion**: Framer Motion (`framer-motion`)
   - **State & Caching**: Redux Toolkit + TanStack Query (`@tanstack/react-query`)
   - **Audio & Video**: HTML5 Audio + YouTube IFrame API (`window.YT`)
   - **Offline Persistence**: Browser IndexedDB (`PersonalSpaceDB` v1)
   - **Backend**: Supabase JS Client (`@supabase/supabase-js`)

---

## 2. Directory Map & File Responsibilities

```
Personal Space/
├── personalSpace.md                        # Master Architecture & AI Reference Guide (This file)
├── supabase_schema.sql                     # Supabase SQL Schema (Tables, RLS, Triggers, Music Tracks)
├── .env.example                            # VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY template
├── package.json                            # Project dependencies and scripts
├── tsconfig.json                           # TypeScript configuration
├── vite.config.ts                          # Vite configuration
├── index.html                              # Root HTML entry with YouTube API & Google Fonts
└── src/
    ├── main.tsx                            # App mounting with Redux & TanStack QueryClientProvider
    ├── App.tsx                             # Master layout router & active view switcher
    ├── index.css                           # Tailwind CSS v4 directives (@custom-variant dark)
    ├── vite-env.d.ts                       # YouTube IFrame API & Window type extensions
    │
    ├── types/                              # Strict TypeScript Interfaces (< 200 LOC each)
    │   ├── common.types.ts                 # Shared UI types, themes, navigation tabs
    │   ├── task.types.ts                   # Task, priority, category, subtask types
    │   ├── note.types.ts                   # Note, color themes, category tags, filter tabs
    │   ├── goal.types.ts                   # Goal and milestone types
    │   ├── mood.types.ts                   # Mood entries and reflection types
    │   ├── focus.types.ts                  # Focus session and timer types
    │   └── supabase.types.ts               # Database generated types
    │
    ├── lib/                                # Core Library Integrations
    │   ├── indexedDb.ts                    # Pure async IndexedDB engine (PersonalSpaceDB v1)
    │   ├── supabase.ts                     # Supabase client initializer
    │   └── sound.ts                        # Web Audio API chime synthesis
    │
    ├── store/                              # Redux Toolkit Slices & Store
    │   ├── index.ts                        # Store configuration & typed hooks
    │   └── slices/
    │       ├── authSlice.ts                # Supabase user session & profile state
    │       ├── tasksSlice.ts               # Task CRUD, filters, subtasks, sync, default seeds
    │       ├── notesSlice.ts               # Local note slice fallback
    │       ├── moodSlice.ts                # Mood logging & streak calculation
    │       ├── focusSlice.ts               # Pomodoro countdown state & history
    │       ├── musicSlice.ts               # Audio playback, YouTube tracks, volume, and 3 2026 presets
    │       ├── uiSlice.ts                  # Tabs, More sheet, Quote modal, Command palette, Modals, Toasts
    │       └── settingsSlice.ts            # Sound and notification preferences
    │
    ├── components/
    │   ├── ui/                             # Fully Custom UI Elements (< 330 LOC each)
    │   │   ├── Button.tsx                  # Primary, secondary, outline, text buttons
    │   │   ├── Input.tsx                   # Text input with icons and error states
    │   │   ├── Select.tsx                  # Styled dropdown select
    │   │   ├── Checkbox.tsx                # Custom animated circular & square checkboxes (44px touch)
    │   │   ├── DatePicker.tsx              # React Portal Calendar popover (z-[9999], zero clipping)
    │   │   ├── TimePicker.tsx              # React Portal Time Stepper popover (z-[9999])
    │   │   ├── Card.tsx                    # SimpleCard, HighlightCard, and InfoCard variants
    │   │   ├── Modal.tsx                   # Native Slide-Up Bottom Sheet on mobile & centered on desktop
    │   │   ├── ConfirmDialog.tsx           # Custom confirmation dialog for sensitive actions
    │   │   ├── Toast.tsx                   # Custom animated Toast notification alerts
    │   │   ├── ProgressBar.tsx             # Animated progress bar with smooth fill
    │   │   ├── Badge.tsx                   # Category and priority tag pills
    │   │   └── EmptyState.tsx              # Serene botanical empty state component
    │   │
    │   ├── layout/                         # Structural App Shell Components
    │   │   ├── AppLayout.tsx               # Responsive layout grid (Sidebar + Header + BottomNav + Modals)
    │   │   ├── Sidebar.tsx                 # Desktop-only collapsible sidebar (hidden on mobile)
    │   │   ├── Header.tsx                  # Clean mobile header (Title + Search + Quote + Music)
    │   │   ├── BottomNav.tsx               # Mobile floating bottom navigation bar with ... (More) sheet
    │   │   ├── CommandPalette.tsx          # Global Ctrl+K / Cmd+K search spotlight
    │   │   ├── QuoteModal.tsx              # Botanical Quote modal with Hinglish, Likes, and Shuffle
    │   │   ├── AuthModal.tsx               # Sign In, Sign Up, Magic Link & Guest Auth modal
    │   │   ├── ProfileDropdown.tsx         # Desktop profile dropdown menu
    │   │   ├── MusicHeaderButton.tsx       # Live audio wave button in header
    │   │   └── PlantVaseWidget.tsx         # Sidebar botanical quote card
    │   │
    │   ├── music/                          # Music Player Engine
    │   │   ├── FloatingMusicPlayer.tsx     # Permanent audio engine with preset switcher (< 280 LOC)
    │   │   └── presets/                    # Modular 2026 World-Class Design Presets
    │   │       ├── AuroraGlassPreset.tsx   # Fluid Aurora Glass (Apple / Arc Vision 2026) (< 220 LOC)
    │   │       ├── IndustrialHifiPreset.tsx# Teenage Engineering OB-4 Industrial HiFi (< 200 LOC)
    │   │       └── RetroCyberCassettePreset.tsx # Cyberpunk Cassette Deck with Dual Spools (< 200 LOC)
    │   │
    │   └── dashboard/                      # Main Dashboard Widgets (< 250 LOC each)
    │       ├── DashboardView.tsx           # Master grid composing all 9 dashboard widgets
    │       ├── DateProgressCard.tsx        # Large date display + daily progress bar
    │       ├── EncouragementBadge.tsx      # Encouragement banner card
    │       ├── FocusTimerCard.tsx          # Dashboard mini Pomodoro clock with quick start
    │       ├── TasksPreviewCard.tsx        # Today's tasks quick checklist with inline add
    │       ├── QuickNotesCard.tsx          # Synced live with TanStack Query / IndexedDB notes
    │       ├── AnalyticsCard.tsx           # Weekly productivity bar chart
    │       ├── UpcomingCard.tsx            # Upcoming exam & event badges with countdowns
    │       ├── GoalsPreviewCard.tsx        # Top goals with animated progress meters
    │       └── MoodPreviewCard.tsx         # Emoji mood check-in selector + mood note trigger
    │
    ├── features/                           # Dedicated Full Feature Views
    │   ├── tasks/                          # Tasks & To-Do Management
    │   │   ├── TasksPage.tsx               # Comprehensive task manager view
    │   │   ├── TaskItem.tsx                # Single task card with visible subtasks & 44px touch targets
    │   │   ├── TaskFormModal.tsx           # Add / Edit Task Modal with subtask persistence
    │   │   ├── TaskFilters.tsx             # 2-Dropdown selectors (Status + Category)
    │   │   ├── TaskSubtaskItem.tsx         # Subtask checkbox & delete action
    │   │   └── TaskStatsSummary.tsx        # Task metrics summary bar
    │   │
    │   ├── calendar/                       # Adaptive Multi-View Calendar
    │   │   ├── CalendarPage.tsx            # Multi-view calendar container (Month, Week, Day)
    │   │   ├── CalendarHeader.tsx          # Month name, view switcher tabs, date switcher, Add Task
    │   │   ├── CalendarMonthView.tsx       # 7x6 Month grid with clean dot indicators
    │   │   ├── CalendarWeekCarousel.tsx    # 7-Day pill strip + horizontal swipeable Day Card Carousel
    │   │   ├── CalendarDayView.tsx         # 8 AM - 9 PM vertical timeline schedule
    │   │   ├── CalendarAgendaView.tsx      # Desktop right-side daily agenda
    │   │   └── CalendarDayDetailSheet.tsx  # Mobile slide-up day detail sheet
    │   │
    │   ├── notes/                          # Rich Notes & Knowledge Garden
    │   │   ├── hooks/
    │   │   │   └── useNotesQuery.ts        # TanStack Query + IndexedDB + Supabase sync
    │   │   ├── NoteEditorModal.tsx         # 0ms input latency editor container
    │   │   ├── NoteTextarea.tsx            # Isolated high-speed textarea with hotkeys
    │   │   ├── MarkdownPreviewPane.tsx     # Deferred low-priority preview pane
    │   │   ├── MarkdownBlock.tsx           # O(1) memoized block renderer
    │   │   ├── NoteCard.tsx                # Masonry pastel note card with preview & tags
    │   │   ├── NoteToolbar.tsx             # Swipeable formatting toolbar with view mode switcher
    │   │   └── NotesPage.tsx               # Full notes workspace with tags, pinning, and search
    │   │
    │   └── settings/                       # App Settings
    │       ├── SettingsPage.tsx            # Master Settings view container
    │       ├── ProfileSettings.tsx         # Profile name, mantra, and workspace avatar picker
    │       ├── MusicSettings.tsx           # YouTube audio adder & 3 2026 design presets (< 330 LOC)
    │       ├── ThemeSettings.tsx           # Light / Dark theme & audio chime preferences
    │       ├── AccountSettings.tsx         # Supabase connection status & session management
    │       └── DataBackupSettings.tsx      # 1-Click JSON Export, Import & Clear Storage tools
    │
    └── utils/                              # Helper Functions
        ├── youtubeUtils.ts                 # YouTube URL parser, oEmbed metadata fetcher & title cleaner
        ├── quoteData.ts                    # Daily inspirational quotes with Hinglish reflections
        ├── markdownUtils.tsx               # Safe Markdown parser, word counter & interactive checklists
        ├── dateUtils.ts                    # Date formatters ("26 May 2025", "2 hours ago")
        └── storage.ts                      # Local cache helpers
```
