import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AuthModal } from './AuthModal';
import { BottomNav } from './BottomNav';
import { QuoteModal } from './QuoteModal';
import { CommandPalette } from './CommandPalette';

export interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-[#F7F8F6] dark:bg-[#121516] text-[#1F2937] dark:text-[#F3F4F6] transition-colors duration-200">
      {/* Desktop Navigation Sidebar (hidden on mobile) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header />
        <main className="flex-1 px-3.5 sm:px-6 md:px-8 pb-20 md:pb-10">
          {children}
        </main>
      </div>

      {/* Mobile Floating Bottom Navigation with More Sheet */}
      <BottomNav />

      {/* Daily Quote & Hinglish Inspiration Modal */}
      <QuoteModal />

      {/* Global Command Palette & Ctrl+K Search */}
      <CommandPalette />

      {/* Global Auth Modal */}
      <AuthModal />
    </div>
  );
};
