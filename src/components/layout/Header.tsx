import React, { useState } from 'react';
import { Search, Moon, Sun, User as UserIcon, Quote } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleTheme, openAuthModal, openQuoteModal, openSearchPalette } from '../../store/slices/uiSlice';
import { getGreetingTime } from '../../utils/dateUtils';
import { sound } from '../../lib/sound';
import { ProfileDropdown } from './ProfileDropdown';
import { MusicHeaderButton } from './MusicHeaderButton';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const greeting = getGreetingTime();
  const userName = user?.fullName || 'Guest';

  const handleThemeToggle = () => {
    sound.playClick();
    dispatch(toggleTheme());
  };

  const handleAvatarClick = () => {
    sound.playClick();
    if (isAuthenticated && user) {
      setIsProfileOpen((prev) => !prev);
    } else {
      dispatch(openAuthModal());
    }
  };

  const handleOpenSearch = () => {
    sound.playClick();
    dispatch(openSearchPalette());
  };

  const handleOpenQuote = () => {
    sound.playClick();
    dispatch(openQuoteModal());
  };

  return (
    <header className="flex items-center justify-between gap-3 py-3 px-4 sm:px-6 md:px-8 select-none relative">
      {/* Title & Greeting */}
      <div className="min-w-0 flex-1">
        <h2 className="font-serif text-lg sm:text-2xl md:text-3xl font-semibold text-[#1F2937] dark:text-[#F3F4F6] truncate flex items-center gap-1.5">
          <span className="hidden sm:inline">{greeting}, {userName}</span>
          <span className="sm:hidden font-bold">Personal Space</span>
          <span className="text-base sm:text-2xl">🌿</span>
        </h2>
        <p className="text-[11px] sm:text-xs text-[#6B7280] dark:text-[#9CA3AF] truncate mt-0.5">
          Here's your mindful space for today.
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Desktop Quick Search Pill with Ctrl+K / Mobile Search Icon */}
        <button
          onClick={handleOpenSearch}
          title="Search & Commands (Ctrl+K)"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A1F21] border border-[#EEF0EC] dark:border-[#273033] text-xs text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white shadow-2xs cursor-pointer transition-all hover:scale-102"
        >
          <Search className="w-3.5 h-3.5 text-[#6BAA7A]" />
          <span className="font-medium">Search anything...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#FAFBF9] dark:bg-[#121516] border border-[#E5E7EB] dark:border-[#2E373A] rounded-md text-[#6B7280] dark:text-[#9CA3AF]">
            ⌘K
          </kbd>
        </button>

        {/* Mobile Search Icon Button */}
        <button
          onClick={handleOpenSearch}
          title="Search anything (Ctrl+K)"
          className="sm:hidden w-10 h-10 rounded-xl bg-white dark:bg-[#1A1F21] border border-[#EEF0EC] dark:border-[#273033] text-[#4F5D75] dark:text-[#CBD2DC] hover:text-[#1F2937] flex items-center justify-center shadow-2xs cursor-pointer active:scale-95"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Daily Quote Button (Popup trigger) */}
        <button
          onClick={handleOpenQuote}
          title="Daily Quote & Hinglish Inspiration"
          className="w-10 h-10 rounded-xl bg-white dark:bg-[#1A1F21] border border-[#EEF0EC] dark:border-[#273033] text-[#C4A97D] hover:text-[#A38250] flex items-center justify-center shadow-2xs cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          <Quote className="w-4 h-4" />
        </button>

        {/* Ambient Music Wave Indicator Button */}
        <MusicHeaderButton />

        {/* Desktop Theme Mode Toggle (Moved to More sheet on mobile) */}
        <button
          onClick={handleThemeToggle}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="hidden sm:flex w-9 h-9 rounded-xl bg-white dark:bg-[#1A1F21] border border-[#EEF0EC] dark:border-[#273033] text-[#4F5D75] dark:text-[#CBD2DC] hover:text-[#1F2937] dark:hover:text-white items-center justify-center shadow-2xs cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Desktop Profile Avatar (Moved to More sheet on mobile) */}
        <div className="hidden sm:block relative shrink-0">
          <button
            onClick={handleAvatarClick}
            title="Profile Menu"
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-[#EAF2EC] dark:bg-[#1E2E23] border-2 border-white dark:border-[#273033] overflow-hidden flex items-center justify-center text-[#6BAA7A] shadow-xs group-hover:scale-105 transition-transform">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-4 h-4" />
              )}
            </div>
          </button>

          <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
      </div>
    </header>
  );
};
