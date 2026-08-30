import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  CheckCircle2,
  BookOpen,
  Flag,
  Calendar,
  Smile,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setActiveTab, toggleSidebarCollapse } from '../../store/slices/uiSlice';
import type { NavTab } from '../../types/common.types';
import { PlantVaseWidget } from './PlantVaseWidget';
import { sound } from '../../lib/sound';

interface NavItemConfig {
  id: NavTab;
  label: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const isCollapsed = useAppSelector((state) => state.ui.isSidebarCollapsed);

  const navItems: NavItemConfig[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'todo', label: 'To Do', icon: <CheckCircle2 className="w-5 h-5" /> },
    { id: 'notes', label: 'Notes', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'goals', label: 'Goals', icon: <Flag className="w-5 h-5" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
    { id: 'mood', label: 'Mood', icon: <Smile className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleTabClick = (tabId: NavTab) => {
    sound.playClick();
    dispatch(setActiveTab(tabId));
  };

  const handleToggleCollapse = () => {
    sound.playClick();
    dispatch(toggleSidebarCollapse());
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className="hidden md:flex shrink-0 h-screen sticky top-0 flex-col justify-between p-4 bg-white dark:bg-[#1A1F21] border-r border-[#EEF0EC] dark:border-[#273033] select-none z-20 overflow-hidden"
    >
      <div className="space-y-6">
        {/* Brand Logo & Collapse Toggle */}
        <div className="flex items-center justify-between px-1.5 py-1">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF2EC] dark:bg-[#1E2E23] flex items-center justify-center text-[#6BAA7A] shrink-0 shadow-xs">
              🌿
            </div>
            
            <AnimatePresence mode="popLayout">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap"
                >
                  <h1 className="font-serif text-base font-bold tracking-tight text-[#1F2937] dark:text-[#F3F4F6] leading-none">
                    Personal Space
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={handleToggleCollapse}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer shrink-0"
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`relative w-full flex items-center ${
                  isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-start px-3.5 py-2.5 gap-3.5'
                } rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#EAF2EC] dark:bg-[#1E2E23] text-[#24422B] dark:text-[#D1EBD6] font-semibold'
                    : 'text-[#4F5D75] dark:text-[#9CA3AF] hover:bg-[#F7F8F6] dark:hover:bg-[#22282A] hover:text-[#1F2937] dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-[#EAF2EC] dark:bg-[#1E2E23] rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`shrink-0 ${isActive ? 'text-[#6BAA7A] dark:text-[#82C291]' : ''}`}>
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <span className="truncate whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Botanical Quote Card */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="pt-4"
          >
            <PlantVaseWidget />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};
