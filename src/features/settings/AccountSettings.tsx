import React from 'react';
import { ShieldCheck, CloudOff, Cloud, LogOut, KeyRound } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAppDispatch, useAppSelector } from '../../store';
import { openAuthModal, showToast } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { sound } from '../../lib/sound';

export const AccountSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleSignOut = async () => {
    sound.playClick();
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    dispatch(logout());
    dispatch(showToast({ message: 'Signed out successfully', type: 'info' }));
  };

  const handleOpenAuth = () => {
    sound.playClick();
    dispatch(openAuthModal());
  };

  return (
    <Card variant="simple" className="p-6">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#EEF0EC] dark:border-[#273033]">
        <div className="w-10 h-10 rounded-xl bg-[#EAF2EC] dark:bg-[#1E2E23] text-[#6BAA7A] flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
            Database & Cloud Sync
          </h3>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            Status of your Supabase backend and active user authentication.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Connection Status Badge Box */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFBF9] dark:bg-[#1A1F21] border border-[#EEF0EC] dark:border-[#273033]">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isSupabaseConfigured
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
              }`}
            >
              {isSupabaseConfigured ? <Cloud className="w-4 h-4" /> : <CloudOff className="w-4 h-4" />}
            </div>
            <div>
              <span className="block text-xs font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
                {isSupabaseConfigured ? 'Supabase Connected' : 'Local-First Offline Mode'}
              </span>
              <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                {isSupabaseConfigured
                  ? 'Your data syncs in real-time to your Supabase PostgreSQL tables.'
                  : 'Running locally on this device. Paste Supabase keys in .env to enable cloud sync.'}
              </span>
            </div>
          </div>

          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
              isSupabaseConfigured
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
            }`}
          >
            {isSupabaseConfigured ? 'Cloud Live' : 'Local Only'}
          </span>
        </div>

        {/* User Session Info & Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-[#4F5D75] dark:text-[#9CA3AF]">
            Active account: <strong className="text-[#1F2937] dark:text-white">{user?.fullName || 'Rahul'}</strong> ({user?.email || 'Offline'})
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenAuth}
              leftIcon={<KeyRound className="w-3.5 h-3.5" />}
            >
              {isAuthenticated ? 'Switch Account' : 'Sign In / Connect'}
            </Button>

            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                leftIcon={<LogOut className="w-3.5 h-3.5" />}
                className="text-[#E05656]"
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
