import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { sound } from '../../lib/sound';

export type CalendarViewMode = 'month' | 'week' | 'day';

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onAddTask: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  viewMode,
  onViewModeChange,
  onPrevMonth,
  onNextMonth,
  onToday,
  onAddTask,
}) => {
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EEF0EC] dark:border-[#273033] select-none">
      {/* Title & View Switcher */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#EAF2EC] dark:bg-[#1E2E23] text-[#6BAA7A] flex items-center justify-center shrink-0 shadow-2xs">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F2937] dark:text-[#F3F4F6] leading-tight">
              {monthName}
            </h2>
            <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] hidden sm:block">
              Plan, schedule, and cultivate your daily milestones.
            </p>
          </div>
        </div>

        {/* View Mode Switcher Tabs (Month / Week / Day) */}
        <div className="flex items-center bg-[#F7F8F6] dark:bg-[#14181A] p-1 rounded-xl border border-[#EEF0EC] dark:border-[#273033]">
          {(['month', 'week', 'day'] as CalendarViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                sound.playClick();
                onViewModeChange(mode);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                viewMode === mode
                  ? 'bg-white dark:bg-[#202528] text-[#1F2937] dark:text-[#F3F4F6] shadow-2xs'
                  : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Controls & Add Task */}
      <div className="flex items-center justify-between sm:justify-end gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              onToday();
            }}
            className="min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#F7F8F6] dark:bg-[#202528] text-[#4F5D75] dark:text-[#CBD2DC] hover:text-[#1F2937] dark:hover:text-white border border-[#EEF0EC] dark:border-[#2E373A] cursor-pointer transition-all active:scale-95"
          >
            Today
          </button>

          <div className="flex items-center bg-[#F7F8F6] dark:bg-[#202528] rounded-xl border border-[#EEF0EC] dark:border-[#2E373A] p-0.5">
            <button
              onClick={() => {
                sound.playClick();
                onPrevMonth();
              }}
              title="Previous"
              className="w-8 h-8 rounded-lg text-[#4F5D75] dark:text-[#CBD2DC] hover:text-[#1F2937] dark:hover:text-white flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onNextMonth();
              }}
              title="Next"
              className="w-8 h-8 rounded-lg text-[#4F5D75] dark:text-[#CBD2DC] hover:text-[#1F2937] dark:hover:text-white flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            sound.playClick();
            onAddTask();
          }}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-2xs min-h-[38px]"
        >
          Add Task
        </Button>
      </div>
    </div>
  );
};
