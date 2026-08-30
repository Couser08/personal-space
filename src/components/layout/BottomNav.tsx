import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  CheckCircle2,
  BookOpen,
  Calendar,
  MoreHorizontal,
  Flag,
  Smile,
  Settings,
  Quote,
  Moon,
  Sun,
  Plus,
  X,
  User as UserIcon,
  LogOut,
  LogIn,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  setActiveTab,
  toggleMoreMenu,
  closeMoreMenu,
  openQuoteModal,
  openTaskModal,
  openNoteModal,
  openAuthModal,
  toggleTheme,
  showToast,
} from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { NavTab } from '../../types/common.types';
import { sound } from '../../lib/sound';

export const BottomNav: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const isMoreOpen = useAppSelector((state) => state.ui.isMoreMenuOpen);
  const theme = useAppSelector((state) => state.ui.theme);
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const mainTabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'todo', label: 'To Do', icon: <CheckCircle2 className="w-5 h-5" /> },
    { id: 'notes', label: 'Notes', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
  ];

  const handleNavClick = (tabId: NavTab) => {
    sound.playClick();
    dispatch(setActiveTab(tabId));
  };

  const handleMoreClick = () => {
    sound.playClick();
    dispatch(toggleMoreMenu());
  };

  const handleLogout = async () => {
    sound.playClick();
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    dispatch(logout());
    dispatch(showToast({ message: 'Logged out successfully', type: 'info' }));
  };

  return (
    <>
      {/* Slide-Up 'More' Menu Sheet on Mobile */}
      <AnimatePresence>
        {isMoreOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch(closeMoreMenu())}
              className="fixed inset-0 bg-black/45 backdrop-blur-xs"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 420, damping: 35 }}
              className="relative w-full max-h-[85vh] overflow-y-auto bg-white dark:bg-[#1A1F21] rounded-t-3xl border-t border-[#EEF0EC] dark:border-[#273033] shadow-float p-5 pb-8 space-y-4 z-10 select-none"
            >
              {/* Drag Handle */}
              <div className="flex justify-center -mt-2 pb-1">
                <div className="w-10 h-1 rounded-full bg-black/15 dark:bg-white/20" />
              </div>

              {/* User Profile Card inside More Sheet */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAFBF9] dark:bg-[#121516] border border-[#EEF0EC] dark:border-[#273033]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#EAF2EC] dark:bg-[#1E2E23] text-[#6BAA7A] flex items-center justify-center font-bold text-sm shrink-0 border border-[#D4E4D8] dark:border-[#2E4735]">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <UserIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#1F2937] dark:text-[#F3F4F6] truncate">
                      {user?.fullName || 'Guest User'}
                    </h4>
                    <p className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] truncate">
                      {user?.email || 'Local Workspace'}
                    </p>
                  </div>
                </div>

                {isAuthenticated && user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      dispatch(closeMoreMenu());
                      dispatch(openAuthModal());
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#6BAA7A] hover:bg-[#558E63] transition-colors cursor-pointer shadow-xs"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    dispatch(closeMoreMenu());
                    dispatch(openTaskModal());
                  }}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#EAF2EC] dark:bg-[#1E2E23] text-[#24422B] dark:text-[#D1EBD6] font-semibold text-xs cursor-pointer shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-xl bg-white dark:bg-[#28382D] flex items-center justify-center text-[#6BAA7A]">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span>New Task</span>
                </button>

                <button
                  onClick={() => {
                    dispatch(closeMoreMenu());
                    dispatch(openNoteModal());
                  }}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#ECEEFB] dark:bg-[#20233B] text-[#333777] dark:text-[#D8DAF8] font-semibold text-xs cursor-pointer shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-xl bg-white dark:bg-[#292C4D] flex items-center justify-center text-[#7B7FD4]">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span>New Note</span>
                </button>
              </div>

              {/* More Pages List */}
              <div className="space-y-1.5 pt-1">
                {/* Theme Toggle (Moved from Header to More Sheet) */}
                <button
                  onClick={() => {
                    sound.playClick();
                    dispatch(toggleTheme());
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#FAFBF9] dark:hover:bg-[#14181A] text-xs font-semibold text-[#1F2937] dark:text-[#F3F4F6] transition-colors cursor-pointer border border-[#EEF0EC] dark:border-[#273033]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center">
                      {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <span>Appearance & Theme</span>
                  </div>
                  <span className="text-xs font-semibold capitalize text-[#6BAA7A] px-2 py-0.5 rounded-full bg-[#EAF2EC] dark:bg-[#1E2E23]">
                    {theme} Mode
                  </span>
                </button>

                {/* Daily Quote Button */}
                <button
                  onClick={() => {
                    dispatch(closeMoreMenu());
                    dispatch(openQuoteModal());
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#FAFBF9] dark:hover:bg-[#14181A] text-xs font-medium text-[#4F5D75] dark:text-[#CBD2DC] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#F8F5EC] dark:bg-[#2B271F] text-[#C4A97D] flex items-center justify-center">
                      <Quote className="w-4 h-4" />
                    </div>
                    <span>Daily Quote & Hinglish</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAF2EC] text-[#6BAA7A] font-bold">Read</span>
                </button>

                {/* Goals */}
                <button
                  onClick={() => handleNavClick('goals')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#FAFBF9] dark:hover:bg-[#14181A] text-xs font-medium text-[#4F5D75] dark:text-[#CBD2DC] transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
                    <Flag className="w-4 h-4" />
                  </div>
                  <span>Goals Space</span>
                </button>

                {/* Mood Tracker */}
                <button
                  onClick={() => handleNavClick('mood')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#FAFBF9] dark:hover:bg-[#14181A] text-xs font-medium text-[#4F5D75] dark:text-[#CBD2DC] transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
                    <Smile className="w-4 h-4" />
                  </div>
                  <span>Mood Tracker</span>
                </button>

                {/* Settings */}
                <button
                  onClick={() => handleNavClick('settings')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#FAFBF9] dark:hover:bg-[#14181A] text-xs font-medium text-[#4F5D75] dark:text-[#CBD2DC] transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center">
                    <Settings className="w-4 h-4" />
                  </div>
                  <span>Settings & Database Sync</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Floating Bottom Nav Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 dark:bg-[#1A1F21]/95 backdrop-blur-md border-t border-[#EEF0EC] dark:border-[#273033] px-2 py-1 shadow-float flex items-center justify-around select-none">
        {mainTabs.map((item) => {
          const isActive = activeTab === item.id && !isMoreOpen;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="relative flex flex-col items-center justify-center py-1 px-2.5 min-w-[54px] min-h-[48px] rounded-2xl cursor-pointer transition-transform active:scale-95"
            >
              {isActive && (
                <motion.div
                  layoutId="activeBottomNavPill"
                  className="absolute inset-0 bg-[#EAF2EC] dark:bg-[#1E2E23] rounded-2xl -z-10"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              <span className={isActive ? 'text-[#6BAA7A] dark:text-[#82C291]' : 'text-[#8A94A6] dark:text-[#7A8699]'}>
                {item.icon}
              </span>

              <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'text-[#24422B] dark:text-[#D1EBD6] font-bold' : 'text-[#8A94A6] dark:text-[#7A8699]'}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* ... More Button */}
        <button
          onClick={handleMoreClick}
          className="relative flex flex-col items-center justify-center py-1 px-2.5 min-w-[54px] min-h-[48px] rounded-2xl cursor-pointer transition-transform active:scale-95"
        >
          {isMoreOpen && (
            <motion.div
              layoutId="activeBottomNavPill"
              className="absolute inset-0 bg-[#EAF2EC] dark:bg-[#1E2E23] rounded-2xl -z-10"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}

          <span className={isMoreOpen ? 'text-[#6BAA7A] dark:text-[#82C291]' : 'text-[#8A94A6] dark:text-[#7A8699]'}>
            <MoreHorizontal className="w-5 h-5" />
          </span>

          <span className={`text-[10px] mt-0.5 font-medium ${isMoreOpen ? 'text-[#24422B] dark:text-[#D1EBD6] font-bold' : 'text-[#8A94A6] dark:text-[#7A8699]'}`}>
            More
          </span>
        </button>
      </nav>
    </>
  );
};
