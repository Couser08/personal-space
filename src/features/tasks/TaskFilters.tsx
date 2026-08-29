import React from 'react';
import { CheckCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  setFilterTab,
  setSelectedCategory,
  clearCompletedTasks,
} from '../../store/slices/tasksSlice';
import type { TaskFilterTab } from '../../types/task.types';
import { sound } from '../../lib/sound';

export const TaskFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  const filterTab = useAppSelector((state) => state.tasks.filterTab);
  const selectedCategory = useAppSelector((state) => state.tasks.selectedCategory);
  const tasks = useAppSelector((state) => state.tasks.items);

  const categories = ['All', 'Work', 'Study', 'Health', 'Personal'];

  const filterTabs: { id: TaskFilterTab; label: string }[] = [
    { id: 'all', label: 'All Tasks' },
    { id: 'today', label: 'Today' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'high_priority', label: 'High Priority' },
    { id: 'completed', label: 'Completed' },
  ];

  const hasCompleted = tasks.some((t) => t.isCompleted);

  const handleTabChange = (tab: TaskFilterTab) => {
    sound.playClick();
    dispatch(setFilterTab(tab));
  };

  const handleCategoryChange = (cat: string) => {
    sound.playClick();
    dispatch(setSelectedCategory(cat));
  };

  return (
    <div className="space-y-4 select-none">
      {/* Main Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF0EC] dark:border-[#273033] pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {filterTabs.map((tab) => {
            const isActive = filterTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#6BAA7A] text-white shadow-xs'
                    : 'text-[#4F5D75] dark:text-[#9CA3AF] hover:bg-[#EAF2EC]/60 dark:hover:bg-[#1E2E23]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {hasCompleted && (
          <button
            onClick={() => {
              sound.playClick();
              dispatch(clearCompletedTasks());
            }}
            className="flex items-center gap-1 text-xs text-[#9CA3AF] hover:text-[#E05656] transition-colors cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Clear Completed</span>
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-medium text-[#9CA3AF] mr-1 shrink-0">Category:</span>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[#C7C9F5] dark:bg-[#7B7FD4] text-[#2D3169] dark:text-white font-semibold'
                  : 'bg-white dark:bg-[#1A1F21] border border-[#EEF0EC] dark:border-[#273033] text-[#4F5D75] dark:text-[#9CA3AF] hover:border-[#C7C9F5]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
