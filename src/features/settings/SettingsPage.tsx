import React from 'react';
import { motion } from 'framer-motion';
import { ProfileSettings } from './ProfileSettings';
import { ThemeSettings } from './ThemeSettings';
import { MusicSettings } from './MusicSettings';
import { DataBackupSettings } from './DataBackupSettings';
import { AccountSettings } from './AccountSettings';

export const SettingsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto pb-8"
    >
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
          Space Settings & Preferences
        </h2>
        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
          Manage your personal workspace profile, aesthetics, audio feedback, and database sync.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="space-y-6">
        <ProfileSettings />
        <ThemeSettings />
        <MusicSettings />
        <AccountSettings />
        <DataBackupSettings />
      </div>

      {/* App Info Footer */}
      <div className="text-center pt-4 pb-2 text-[11px] text-[#9CA3AF] dark:text-[#6B7280] select-none">
        <span>Personal Space v1.0.0 • Designed for mindful daily focus & calmness 🌿</span>
      </div>
    </motion.div>
  );
};
