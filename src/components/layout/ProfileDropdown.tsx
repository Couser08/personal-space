import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, ShieldCheck, Mail } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { setActiveTab, showToast } from '../../store/slices/uiSlice';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { sound } from '../../lib/sound';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    sound.playClick();
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    dispatch(logout());
    dispatch(showToast({ message: 'Logged out successfully', type: 'info' }));
    onClose();
  };

  const handleGoToSettings = () => {
    sound.playClick();
    dispatch(setActiveTab('settings'));
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-12 w-64 rounded-2xl bg-white dark:bg-[#1A1F21] border border-[#EEF0EC] dark:border-[#273033] shadow-xl p-3 z-50 select-none"
        >
          {/* User Info Header */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-[#FAFBF9] dark:bg-[#121516] border border-[#EEF0EC] dark:border-[#273033] mb-2">
            <div className="w-10 h-10 rounded-full bg-[#EAF2EC] dark:bg-[#1E2E23] flex items-center justify-center text-[#6BAA7A] shrink-0 border border-[#D4E4D8] dark:border-[#2E4735]">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-[#1F2937] dark:text-[#F3F4F6] truncate">
                {user?.fullName || 'Personal User'}
              </h4>
              <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] truncate flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3 shrink-0" />
                <span className="truncate">{user?.email || 'offline@personal.space'}</span>
              </p>
            </div>
          </div>

          {/* Cloud Sync Status */}
          <div className="px-2.5 py-1.5 rounded-lg bg-black/2 dark:bg-white/5 flex items-center justify-between text-[11px] mb-2">
            <span className="text-[#6B7280] dark:text-[#9CA3AF] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6BAA7A]" />
              Account
            </span>
            <span className="font-semibold text-[#6BAA7A]">Active</span>
          </div>

          {/* Quick Actions */}
          <div className="space-y-1 pt-1 border-t border-[#EEF0EC] dark:border-[#273033]">
            <button
              onClick={handleGoToSettings}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#4F5D75] dark:text-[#CBD2DC] hover:text-[#1F2937] dark:hover:text-white hover:bg-[#F7F8F6] dark:hover:bg-[#22282A] rounded-xl transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-[#7B7FD4]" />
              <span>Workspace Settings</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
