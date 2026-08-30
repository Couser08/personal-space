import React from 'react';
import { CheckCheck, Filter, Tag, ChevronDown } from 'lucide-react';
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

  const handleTabChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    sound.playClick();
    dispatch(setFilterTab(e.target.value as TaskFilterTab));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    sound.playClick();
    dispatch(setSelectedCategory(e.target.value));
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#1A1F21] border border-[#EEF0EC] dark:border-[#273033] shadow-card select-none">
      {/* 2 Clean Dropdown Selectors */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        {/* Status Dropdown */}
        <div className="relative flex-1 sm:flex-initial sm:min-w-[150px]">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAFBF9] dark:bg-[#121516] border border-[#E5E7EB] dark:border-[#2E373A] text-xs font-semibold text-[#1F2937] dark:text-[#F3F4F6] pointer-events-none">
            <Filter className="w-3.5 h-3.5 text-[#6BAA7A] shrink-0" />
            <span className="truncate flex-1">
              {filterTabs.find((t) => t.id === filterTab)?.label || 'All Tasks'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
          </div>
          <select
            value={filterTab}
            onChange={handleTabChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full text-xs"
          >
            {filterTabs.map((tab) => (
              <option key={tab.id} value={tab.id} className="bg-white dark:bg-[#1A1F21] text-[#1F2937] dark:text-[#F3F4F6]">
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Dropdown */}
        <div className="relative flex-1 sm:flex-initial sm:min-w-[150px]">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAFBF9] dark:bg-[#121516] border border-[#E5E7EB] dark:border-[#2E373A] text-xs font-semibold text-[#1F2937] dark:text-[#F3F4F6] pointer-events-none">
            <Tag className="w-3.5 h-3.5 text-[#7B7FD4] shrink-0" />
            <span className="truncate flex-1">
              {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
          </div>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full text-xs"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-white dark:bg-[#1A1F21] text-[#1F2937] dark:text-[#F3F4F6]">
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Completed Action */}
      {hasCompleted && (
        <button
          onClick={() => {
            sound.playClick();
            dispatch(clearCompletedTasks());
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors cursor-pointer shrink-0 ml-auto"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Completed</span>
        </button>
      )}
    </div>
  );
};
