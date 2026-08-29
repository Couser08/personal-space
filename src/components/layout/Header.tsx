import React from 'react';
import { Search, Bell, Moon, Sun, User as UserIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleTheme, openAuthModal } from '../../store/slices/uiSlice';
import { setSearchQuery } from '../../store/slices/tasksSlice';
import { getGreetingTime } from '../../utils/dateUtils';
import { sound } from '../../lib/sound';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);
  const user = useAppSelector((state) => state.auth.user);
  const tasksSearch = useAppSelector((state) => state.tasks.searchQuery);

  const greeting = getGreetingTime();
  const userName = user?.fullName || 'Rahul';

  const handleThemeToggle = () => {
    sound.playClick();
    dispatch(toggleTheme());
  };

  const handleAvatarClick = () => {
    sound.playClick();
    dispatch(openAuthModal());
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 px-8 select-none">
      {/* Greeting Title */}
      <div>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#1F2937] dark:text-[#F3F4F6] flex items-center gap-2">
          <span>{greeting}, {userName}</span>
          <span className="text-2xl">🌿</span>
        </h2>
        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-0.5 font-normal">
          Here's your space for today.
        </p>
      </div>

      {/* Action Controls (Search, Theme, Notif, Avatar) */}
      <div className="flex items-center gap-3.5 self-end md:self-auto">
        {/* Search Bar */}
        <div className="relative flex items-center w-48 sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 text-[#9CA3AF] pointer-events-none" />
          <input
            type="text"
            placeholder="Search anything... ⌘K"
            value={tasksSearch}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full bg-white dark:bg-[#1A1F21] text-xs text-[#1F2937] dark:text-[#F3F4F6] placeholder-[#9CA3AF] rounded-xl pl-9 pr-3.5 py-2 border border-[#EEF0EC] dark:border-[#273033] shadow-2xs focus:border-[#6BAA7A] focus:ring-2 focus:ring-[#6BAA7A]/20 outline-none transition-all"
          />
        </div>

        {/* Theme Mode Toggle Button */}
        <button
          onClick={handleThemeToggle}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="w-9 h-9 rounded-xl bg-white dark:bg-[#1A1F21] border border-[#EEF0EC] dark:border-[#273033] text-[#4F5D75] dark:text-[#CBD2DC] hover:text-[#1F2937] dark:hover:text-white flex items-center justify-center shadow-2xs cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <button
          title="Notifications"
          className="relative w-9 h-9 rounded-xl bg-white dark:bg-[#1A1F21] border border-[#EEF0EC] dark:border-[#273033] text-[#4F5D75] dark:text-[#CBD2DC] hover:text-[#1F2937] dark:hover:text-white flex items-center justify-center shadow-2xs cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#7B7FD4] ring-2 ring-white dark:ring-[#1A1F21]" />
        </button>

        {/* Profile Avatar */}
        <button
          onClick={handleAvatarClick}
          title="Account Settings"
          className="flex items-center gap-2 pl-1 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-[#EAF2EC] dark:bg-[#1E2E23] border-2 border-white dark:border-[#273033] overflow-hidden flex items-center justify-center text-[#6BAA7A] shadow-xs group-hover:scale-105 transition-transform">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-4 h-4" />
            )}
          </div>
        </button>
      </div>
    </header>
  );
};
