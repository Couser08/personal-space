import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AuthModal } from './AuthModal';

export interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-[#F7F8F6] dark:bg-[#121516] text-[#1F2937] dark:text-[#F3F4F6] transition-colors duration-200">
      {/* Fixed Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header />
        <main className="flex-1 px-8 pb-12">
          {children}
        </main>
      </div>

      {/* Global Auth Modal */}
      <AuthModal />
    </div>
  );
};
