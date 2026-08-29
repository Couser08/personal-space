# Personal Space — System Architecture & AI Reference Guide

> **Important**: This file contains the complete architectural rules, directory map, design tokens, Supabase database schema, and file-by-file responsibilities for the **Personal Space** application. Any AI agent or developer working on this codebase should read this file to understand the system instantly without needing to scan every single file.

---

## 1. Core Principles & Coding Standards

1. **Strict File Size Limit**: **No single file may exceed 500 lines of code (LOC)**.
2. **Features Implemented**:
   - **Home Page (Dashboard)**: All 9 widgets (Date & Progress, Encouragement Badge, Focus Timer, Today's Tasks preview, Quick Notes preview synced live with TanStack Query / IndexedDB, Weekly Productivity Chart, Upcoming Events, Goals preview, Mood Today).
   - **To-Do Page (Full Task Manager)**: Full-featured task management with Priority Badges, Category Tags, Due Dates, Subtasks checklist, smart filters (Today, Upcoming, High Priority, Completed), and search.
   - **Notes Workspace (Knowledge Garden)**: High-performance Markdown Notes system backed by browser **IndexedDB** (`PersonalSpaceDB` v1) and **TanStack Query** (`staleTime: 5 mins`). Features:
     - **0ms Input Latency**: Isolated high-performance `NoteTextarea` with hotkeys (`Ctrl+B`, `Ctrl+I`, `Ctrl+S`, `Tab` 2-space indentation).
     - **React 19 Concurrent Low-Priority Rendering**: `useDeferredValue` ensures live preview rendering never delays typing commits.
     - **O(1) Block-Level Diffing**: `MarkdownBlock` parses and renders individual lines/blocks independently with `React.memo`.
     - **Non-blocking 500ms Debounced Auto-Save**: Silent background write to IndexedDB & Supabase with live status pill ("Saving..." / "Saved 🌿").
     - **Markdown Toolbar & Interactive Checklists**: Checkboxes inside the rendered view can be toggled interactively.
   - **Settings Page**: Profile settings, Theme switcher (Light Botanical default / Dark Slate), Audio feedback toggle, 1-Click JSON Export/Import backup, and Supabase connection management.
   - **Custom UI System**: Fully custom botanical popups, React Portal `DatePicker` & `TimePicker` (immune to z-index clipping and container overflow), Animated `Toast` notification system, and `ConfirmDialog`.
   - **Collapsible Sidebar**: Icon-only slim mode (`w-20` / 80px) with centered botanical icons, tooltips, smooth spring physics, and persistent state.
   - **Supabase Backend & Proper Auth**: Direct Supabase integration with ready SQL schema (`supabase_schema.sql`), `.env` configuration, Supabase Auth (Sign In, Sign Up, Magic Link, and Offline profile mode), and Row-Level Security (RLS).
   - **Theme Engine**: Light Botanical default with smooth Dark Mode toggle via Tailwind CSS v4 `@custom-variant dark`.
3. **Tech Stack**:
   - **Framework**: React 19 + TypeScript + Vite
   - **Styling**: Tailwind CSS v4 + Custom Design Tokens
   - **Icons**: Lucide React (`lucide-react`)
   - **Motion**: Framer Motion (`framer-motion`)
   - **State & Caching**: Redux Toolkit + TanStack Query (`@tanstack/react-query`)
   - **Offline Persistence**: Browser IndexedDB (`PersonalSpaceDB` v1)
   - **Backend**: Supabase JS Client (`@supabase/supabase-js`)

---

## 2. Design System & Global Tokens

### 2.1 Color Palette
- **Sage Green (Primary Brand)**: `#6BAA7A` (Light background: `#EAF2EC`, Dark accent: `#42714D`)
- **Soft Lavender (Secondary Brand)**: `#C7C9F5` (Light background: `#ECEEFB`, Accent: `#7B7FD4`)
- **Warm Sand (Warm Highlights)**: `#F2E8D5` (Light background: `#FAF5EB`, Accent: `#C4A97D`)
- **Cool Slate (Subtle Secondary)**: `#4F5D75` (Text/Borders: `#97A4BA`, Background: `#F1F3F6`)
- **Charcoal (Primary Text / High Contrast)**: `#1F2937`
- **Canvas Background**: `#F7F8F6` (Light) / `#121516` (Dark)
- **Card Background**: `#FFFFFF` (Light) / `#1B2024` (Dark)

---

## 3. Directory Map & File Responsibilities

```
Personal Space/
├── personalSpace.md                        # Master Architecture & AI Reference Guide (This file)
├── supabase_schema.sql                     # Supabase SQL Schema (Tables, RLS, Triggers)
├── .env.example                            # VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY template
├── package.json                            # Project dependencies and scripts
├── tsconfig.json                           # TypeScript configuration
├── vite.config.ts                          # Vite configuration
├── index.html                              # Root HTML entry with Google Fonts
└── src/
    ├── main.tsx                            # App mounting with Redux & TanStack QueryClientProvider
    ├── App.tsx                             # Master layout router & active view switcher
    ├── index.css                           # Tailwind CSS v4 directives (@custom-variant dark)
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
    │       ├── tasksSlice.ts               # Task CRUD, filters, subtasks, sync
    │       ├── notesSlice.ts               # Local note slice fallback
    │       ├── moodSlice.ts                # Mood logging & streak calculation
    │       ├── focusSlice.ts               # Pomodoro countdown state & history
    │       ├── uiSlice.ts                  # Navigation tabs, modals, toasts, sidebar collapse
    │       └── settingsSlice.ts            # Sound and notification preferences
    │
    ├── components/
    │   ├── ui/                             # Fully Custom UI Elements (< 330 LOC each)
    │   │   ├── Button.tsx                  # Primary, secondary, outline, text buttons
    │   │   ├── Input.tsx                   # Text input with icons and error states
    │   │   ├── Select.tsx                  # Styled dropdown select
    │   │   ├── Checkbox.tsx                # Custom animated circular & square checkboxes
    │   │   ├── DatePicker.tsx              # React Portal Calendar popover (z-[9999], zero clipping)
    │   │   ├── TimePicker.tsx              # React Portal Time Stepper popover (z-[9999])
    │   │   ├── Card.tsx                    # SimpleCard, HighlightCard, and InfoCard variants
    │   │   ├── Modal.tsx                   # Accessible modal container with backdrop blur & spring motion
    │   │   ├── ConfirmDialog.tsx           # Custom confirmation dialog for sensitive actions
    │   │   ├── Toast.tsx                   # Custom animated Toast notification alerts
    │   │   ├── ProgressBar.tsx             # Animated progress bar with smooth fill
    │   │   ├── Badge.tsx                   # Category and priority tag pills
    │   │   └── EmptyState.tsx              # Serene botanical empty state component
    │   │
    │   ├── layout/                         # Structural App Shell Components
    │   │   ├── AppLayout.tsx               # Responsive layout grid (Sidebar + Header + Content)
    │   │   ├── Sidebar.tsx                 # Collapsible sidebar (Icon-only slim mode & full mode)
    │   │   ├── Header.tsx                  # Greeting header, search bar, theme toggle, auth button
    │   │   ├── AuthModal.tsx               # Proper Sign In, Sign Up, Magic Link & Guest Auth
    │   │   └── PlantVaseWidget.tsx         # Sidebar botanical card with daily inspirational quote
    │   │
    │   └── dashboard/                      # Main Dashboard Widgets (< 250 LOC each)
    │       ├── DashboardView.tsx           # Master grid composing all 9 dashboard widgets
    │       ├── DateProgressCard.tsx        # Large date display + daily progress bar
    │       ├── EncouragementBadge.tsx      # "You're doing great!" encouragement card
    │       ├── FocusTimerCard.tsx          # Dashboard mini Pomodoro clock with quick start
    │       ├── TasksPreviewCard.tsx        # Today's tasks quick checklist with inline add
    │       ├── QuickNotesCard.tsx          # Synced live with TanStack Query / IndexedDB notes
    │       ├── AnalyticsCard.tsx           # Weekly productivity bar chart + inspirational quote
    │       ├── UpcomingCard.tsx            # Upcoming exam & event badges with countdowns
    │       ├── GoalsPreviewCard.tsx        # Top goals with animated progress meters
    │       └── MoodPreviewCard.tsx         # Emoji mood check-in selector + mood note trigger
    │
    ├── features/                           # Dedicated Full Feature Views
    │   ├── tasks/                          # Tasks & To-Do Management
    │   │   ├── TasksPage.tsx               # Comprehensive task manager view
    │   │   ├── TaskItem.tsx                # Single task row with subtasks & quick actions
    │   │   ├── TaskFormModal.tsx           # Add / Edit Task Modal with 0ms typing response
    │   │   ├── TaskFilters.tsx             # Category, priority, and completion filters
    │   │   ├── TaskSubtaskItem.tsx         # Subtask item checkbox & delete
    │   │   └── TaskStatsSummary.tsx        # Task metrics summary bar
    │   │
    │   ├── notes/                          # Rich Notes & Knowledge Garden
    │   │   ├── hooks/
    │   │   │   └── useNotesQuery.ts        # TanStack Query + IndexedDB + Supabase sync
    │   │   ├── NoteEditorModal.tsx         # 0ms input latency editor container
    │   │   ├── NoteTextarea.tsx            # Isolated high-speed textarea with hotkeys (Ctrl+B/I/S, Tab)
    │   │   ├── MarkdownPreviewPane.tsx     # Deferred low-priority preview pane
    │   │   ├── MarkdownBlock.tsx           # O(1) memoized block renderer
    │   │   ├── NoteCard.tsx                # Masonry pastel note card with preview & tags
    │   │   ├── NoteToolbar.tsx             # Memoized formatting toolbar with view mode switcher
    │   │   ├── NotesPage.tsx               # Full notes workspace with tags, pinning, and search
    │   │   └── QuickNoteModal.tsx          # Fast note creator
    │   │
    │   ├── settings/                       # App Settings
    │   │   ├── SettingsPage.tsx            # Master Settings view container
    │   │   ├── ProfileSettings.tsx         # Profile name, mantra, and workspace avatar picker
    │   │   ├── ThemeSettings.tsx           # Light Botanical / Dark Slate theme & audio preferences
    │   │   ├── AccountSettings.tsx         # Supabase connection status & session management
    │   │   └── DataBackupSettings.tsx      # 1-Click JSON Export, Import & Clear Storage tools
    │   │
    │   └── mood/                           # Daily Reflection
    │       └── MoodNoteModal.tsx           # Daily reflection note popup
    │
    └── utils/                              # Helper Functions
        ├── markdownUtils.tsx               # Safe Markdown parser, word counter & interactive checklists
        ├── dateUtils.ts                    # Date formatters ("26 May 2025", "2 hours ago")
        └── storage.ts                      # Local cache helpers
```
