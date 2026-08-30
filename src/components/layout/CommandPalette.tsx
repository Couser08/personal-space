import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  CheckCircle2,
  BookOpen,
  Calendar,
  Settings,
  Plus,
  Quote,
  Moon,
  Sun,
  X,
  Flag,
  Smile,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  closeSearchPalette,
  setActiveTab,
  openTaskModal,
  openNoteModal,
  openQuoteModal,
  toggleTheme,
} from '../../store/slices/uiSlice';
import { sound } from '../../lib/sound';

export const CommandPalette: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isSearchPaletteOpen);
  const theme = useAppSelector((state) => state.ui.theme);
  const tasks = useAppSelector((state) => state.tasks.items);

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K key listener with e.preventDefault()
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        e.stopPropagation();
        sound.playClick();
        if (isOpen) {
          dispatch(closeSearchPalette());
        } else {
          dispatch({ type: 'ui/openSearchPalette' });
        }
      } else if (e.key === 'Escape' && isOpen) {
        dispatch(closeSearchPalette());
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const quickActions = [
    {
      id: 'new-task',
      label: 'Create New Task',
      icon: <Plus className="w-4 h-4 text-[#6BAA7A]" />,
      action: () => {
        dispatch(closeSearchPalette());
        dispatch(openTaskModal());
      },
    },
    {
      id: 'new-note',
      label: 'Create New Note',
      icon: <BookOpen className="w-4 h-4 text-[#7B7FD4]" />,
      action: () => {
        dispatch(closeSearchPalette());
        dispatch(openNoteModal());
      },
    },
    {
      id: 'daily-quote',
      label: 'Daily Quote & Hinglish Reflection',
      icon: <Quote className="w-4 h-4 text-[#C4A97D]" />,
      action: () => {
        dispatch(closeSearchPalette());
        dispatch(openQuoteModal());
      },
    },
    {
      id: 'toggle-theme',
      label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      icon: theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />,
      action: () => {
        dispatch(toggleTheme());
        dispatch(closeSearchPalette());
      },
    },
  ];

  const navigationItems = [
    { id: 'home', label: 'Go to Home Dashboard', icon: <CheckCircle2 className="w-4 h-4 text-[#6BAA7A]" />, tab: 'home' as const },
    { id: 'todo', label: 'Go to To-Do Tasks', icon: <CheckCircle2 className="w-4 h-4 text-[#6BAA7A]" />, tab: 'todo' as const },
    { id: 'notes', label: 'Go to Notes Garden', icon: <BookOpen className="w-4 h-4 text-[#7B7FD4]" />, tab: 'notes' as const },
    { id: 'calendar', label: 'Go to Calendar', icon: <Calendar className="w-4 h-4 text-[#C4A97D]" />, tab: 'calendar' as const },
    { id: 'goals', label: 'Go to Goals', icon: <Flag className="w-4 h-4 text-rose-500" />, tab: 'goals' as const },
    { id: 'mood', label: 'Go to Mood Tracker', icon: <Smile className="w-4 h-4 text-amber-500" />, tab: 'mood' as const },
    { id: 'settings', label: 'Go to Workspace Settings', icon: <Settings className="w-4 h-4 text-[#9CA3AF]" />, tab: 'settings' as const },
  ];

  const matchingTasks = query.trim()
    ? tasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase())).slice(0, 4)
    : [];

  const filteredNavigation = query.trim()
    ? navigationItems.filter((n) => n.label.toLowerCase().includes(query.toLowerCase()))
    : navigationItems;

  const handleSelectNav = (tab: (typeof navigationItems)[number]['tab']) => {
    sound.playClick();
    dispatch(setActiveTab(tab));
    dispatch(closeSearchPalette());
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-24 select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dispatch(closeSearchPalette())}
          className="fixed inset-0 bg-black/45 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -15 }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          className="relative w-full max-w-xl bg-white dark:bg-[#1A1F21] rounded-3xl shadow-float border border-[#EEF0EC] dark:border-[#273033] overflow-hidden z-10 flex flex-col max-h-[80vh]"
        >
          {/* Top Search Input */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#EEF0EC] dark:border-[#273033]">
            <Search className="w-5 h-5 text-[#6BAA7A] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a command or search tasks, notes, pages... (ESC to exit)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#1F2937] dark:text-[#F3F4F6] placeholder-[#9CA3AF] outline-none font-medium"
            />
            <button
              onClick={() => dispatch(closeSearchPalette())}
              className="p-1 rounded-lg text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="p-3 overflow-y-auto space-y-4 max-h-[60vh]">
            {/* Matching Tasks */}
            {matchingTasks.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#6BAA7A] uppercase tracking-wider px-2 block">
                  Tasks ({matchingTasks.length})
                </span>
                {matchingTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      dispatch(setActiveTab('todo'));
                      dispatch(closeSearchPalette());
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAFBF9] dark:hover:bg-[#121516] text-xs text-[#1F2937] dark:text-[#F3F4F6] transition-colors cursor-pointer text-left"
                  >
                    <span className="truncate font-medium">{task.title}</span>
                    <span className="text-[10px] text-[#9CA3AF] shrink-0 ml-2">{task.category}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Quick Actions */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider px-2 block">
                Quick Actions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#FAFBF9] dark:bg-[#121516] hover:bg-[#EAF2EC]/60 dark:hover:bg-[#1E2E23] text-xs font-semibold text-[#1F2937] dark:text-[#F3F4F6] border border-[#EEF0EC] dark:border-[#273033] transition-colors cursor-pointer"
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Pages */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider px-2 block">
                Navigation
              </span>
              {filteredNavigation.map((nav) => (
                <button
                  key={nav.id}
                  onClick={() => handleSelectNav(nav.tab)}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#FAFBF9] dark:hover:bg-[#121516] text-xs font-medium text-[#4F5D75] dark:text-[#CBD2DC] transition-colors cursor-pointer text-left"
                >
                  {nav.icon}
                  <span>{nav.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
