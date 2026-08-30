import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { NavTab, ThemeMode } from '../../types/common.types';
import { loadFromStorage, saveToStorage } from '../../utils/storage';

export interface ToastNotification {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

interface UIState {
  activeTab: NavTab;
  theme: ThemeMode;
  isSidebarCollapsed: boolean;
  isMoreMenuOpen: boolean;
  isQuoteModalOpen: boolean;
  isSearchPaletteOpen: boolean;
  isAuthModalOpen: boolean;
  isTaskModalOpen: boolean;
  isNoteModalOpen: boolean;
  isMoodModalOpen: boolean;
  editingTaskId: string | null;
  editingNoteId: string | null;
  toast: ToastNotification | null;
}

const initialTheme = loadFromStorage<ThemeMode>('theme_mode', 'light');
const initialSidebarCollapsed = loadFromStorage<boolean>('sidebar_collapsed', false);

// Apply theme to document element immediately
if (typeof document !== 'undefined') {
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
  }
}

const initialState: UIState = {
  activeTab: 'home',
  theme: initialTheme,
  isSidebarCollapsed: initialSidebarCollapsed,
  isMoreMenuOpen: false,
  isQuoteModalOpen: false,
  isSearchPaletteOpen: false,
  isAuthModalOpen: false,
  isTaskModalOpen: false,
  isNoteModalOpen: false,
  isMoodModalOpen: false,
  editingTaskId: null,
  editingNoteId: null,
  toast: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<NavTab>) => {
      state.activeTab = action.payload;
      state.isMoreMenuOpen = false;
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      saveToStorage('theme_mode', action.payload);
      if (typeof document !== 'undefined') {
        if (action.payload === 'dark') {
          document.documentElement.classList.add('dark');
          document.body.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.body.classList.remove('dark');
        }
      }
    },
    toggleTheme: (state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = nextTheme;
      saveToStorage('theme_mode', nextTheme);
      if (typeof document !== 'undefined') {
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
          document.body.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.body.classList.remove('dark');
        }
      }
    },
    toggleSidebarCollapse: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
      saveToStorage('sidebar_collapsed', state.isSidebarCollapsed);
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
      saveToStorage('sidebar_collapsed', action.payload);
    },
    openMoreMenu: (state) => {
      state.isMoreMenuOpen = true;
    },
    closeMoreMenu: (state) => {
      state.isMoreMenuOpen = false;
    },
    toggleMoreMenu: (state) => {
      state.isMoreMenuOpen = !state.isMoreMenuOpen;
    },
    openQuoteModal: (state) => {
      state.isQuoteModalOpen = true;
    },
    closeQuoteModal: (state) => {
      state.isQuoteModalOpen = false;
    },
    openSearchPalette: (state) => {
      state.isSearchPaletteOpen = true;
    },
    closeSearchPalette: (state) => {
      state.isSearchPaletteOpen = false;
    },
    toggleSearchPalette: (state) => {
      state.isSearchPaletteOpen = !state.isSearchPaletteOpen;
    },
    openAuthModal: (state) => {
      state.isAuthModalOpen = true;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
    openTaskModal: (state, action: PayloadAction<string | undefined>) => {
      state.editingTaskId = action.payload || null;
      state.isTaskModalOpen = true;
    },
    closeTaskModal: (state) => {
      state.isTaskModalOpen = false;
      state.editingTaskId = null;
    },
    openNoteModal: (state, action: PayloadAction<string | undefined>) => {
      state.editingNoteId = action.payload || null;
      state.isNoteModalOpen = true;
    },
    closeNoteModal: (state) => {
      state.isNoteModalOpen = false;
      state.editingNoteId = null;
    },
    openMoodModal: (state) => {
      state.isMoodModalOpen = true;
    },
    closeMoodModal: (state) => {
      state.isMoodModalOpen = false;
    },
    showToast: (state, action: PayloadAction<{ message: string; type?: 'success' | 'error' | 'info'; duration?: number }>) => {
      state.toast = {
        id: crypto.randomUUID ? crypto.randomUUID() : `toast-${Date.now()}`,
        message: action.payload.message,
        type: action.payload.type || 'success',
        duration: action.payload.duration || 3000,
      };
    },
    hideToast: (state) => {
      state.toast = null;
    },
  },
});

export const {
  setActiveTab,
  setTheme,
  toggleTheme,
  toggleSidebarCollapse,
  setSidebarCollapsed,
  openMoreMenu,
  closeMoreMenu,
  toggleMoreMenu,
  openQuoteModal,
  closeQuoteModal,
  openSearchPalette,
  closeSearchPalette,
  toggleSearchPalette,
  openAuthModal,
  closeAuthModal,
  openTaskModal,
  closeTaskModal,
  openNoteModal,
  closeNoteModal,
  openMoodModal,
  closeMoodModal,
  showToast,
  hideToast,
} = uiSlice.actions;

export default uiSlice.reducer;
