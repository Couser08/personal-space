import React from 'react';
import { motion } from 'framer-motion';
import type { Task } from '../../types/task.types';
import { sound } from '../../lib/sound';

interface CalendarMonthViewProps {
  currentDate: Date;
  selectedDate: Date;
  tasks: Task[];
  onSelectDate: (date: Date) => void;
}

const formatLocalDateKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  currentDate,
  selectedDate,
  tasks,
  onSelectDate,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Month bounds
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun, 1 = Mon ...
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const today = new Date();
  const todayKey = formatLocalDateKey(today);
  const selectedKey = formatLocalDateKey(selectedDate);

  // Weekday headers
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate calendar day cells
  interface DayCell {
    date: Date;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    dateKey: string;
    uniqueKey: string;
  }

  const cells: DayCell[] = [];

  // Previous month trailing days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const date = new Date(year, month - 1, dayNum);
    const dateKey = formatLocalDateKey(date);
    cells.push({
      date,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: false,
      isSelected: dateKey === selectedKey,
      dateKey,
      uniqueKey: `prev-${dateKey}`,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateKey = formatLocalDateKey(date);
    cells.push({
      date,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: dateKey === todayKey,
      isSelected: dateKey === selectedKey,
      dateKey,
      uniqueKey: `curr-${dateKey}`,
    });
  }

  // Next month leading days to complete grid (multiples of 7)
  const remainingCells = (7 - (cells.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    const date = new Date(year, month + 1, d);
    const dateKey = formatLocalDateKey(date);
    cells.push({
      date,
      dayNumber: d,
      isCurrentMonth: false,
      isToday: false,
      isSelected: dateKey === selectedKey,
      dateKey,
      uniqueKey: `next-${dateKey}`,
    });
  }

  // Group tasks by date string
  const tasksByDate = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    if (task.dueDate) {
      const key = task.dueDate.split('T')[0];
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
    }
    return acc;
  }, {});

  const handleCellClick = (cell: DayCell) => {
    sound.playClick();
    onSelectDate(cell.date);
  };

  return (
    <div className="bg-white dark:bg-[#1A1F21] rounded-3xl border border-[#EEF0EC] dark:border-[#273033] p-3 sm:p-6 shadow-card">
      {/* Weekday Labels Header */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
        {weekDays.map((wd, index) => (
          <div
            key={wd}
            className={`text-[11px] sm:text-xs font-semibold uppercase tracking-wider py-1 ${
              index === 0 || index === 6
                ? 'text-[#A38250] dark:text-[#E2C799]'
                : 'text-[#6B7280] dark:text-[#9CA3AF]'
            }`}
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Month Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {cells.map((cell) => {
          const dayTasks = tasksByDate[cell.dateKey] || [];
          const completedCount = dayTasks.filter((t) => t.isCompleted).length;

          return (
            <motion.div
              key={cell.uniqueKey}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleCellClick(cell)}
              className={`min-h-[50px] sm:min-h-[82px] md:min-h-[96px] p-1 sm:p-2 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                cell.isSelected
                  ? 'bg-[#EAF2EC] dark:bg-[#1E2E23] border-[#6BAA7A] shadow-xs'
                  : cell.isCurrentMonth
                  ? 'bg-[#FAFBF9]/80 dark:bg-[#14181A] border-[#EEF0EC] dark:border-[#273033] hover:bg-white dark:hover:bg-[#1D2225]'
                  : 'bg-black/2 dark:bg-white/2 border-transparent text-[#9CA3AF] opacity-40 hover:opacity-75'
              }`}
            >
              {/* Day Number & Status */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    cell.isToday
                      ? 'bg-[#6BAA7A] text-white shadow-xs'
                      : cell.isSelected
                      ? 'text-[#24422B] dark:text-[#D1EBD6]'
                      : 'text-[#1F2937] dark:text-[#F3F4F6]'
                  }`}
                >
                  {cell.dayNumber}
                </span>

                {dayTasks.length > 0 && (
                  <span className="hidden sm:inline text-[10px] font-semibold text-[#6BAA7A] px-1.5 py-0.2 rounded-md bg-[#6BAA7A]/10">
                    {completedCount}/{dayTasks.length}
                  </span>
                )}
              </div>

              {/* Mobile Dots Indicator */}
              {dayTasks.length > 0 && (
                <div className="flex sm:hidden items-center justify-center gap-1 py-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <span
                      key={task.id}
                      className={`w-1.5 h-1.5 rounded-full ${
                        task.isCompleted
                          ? 'bg-[#9CA3AF]'
                          : task.priority === 'high'
                          ? 'bg-rose-500'
                          : task.priority === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-[#6BAA7A]'
                      }`}
                    />
                  ))}
                  {dayTasks.length > 3 && (
                    <span className="w-1 h-1 rounded-full bg-[#9CA3AF]" />
                  )}
                </div>
              )}

              {/* Desktop/Tablet Full Task Pills */}
              <div className="hidden sm:block space-y-1 mt-1 overflow-hidden">
                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className={`text-[10px] truncate px-1.5 py-0.5 rounded-md font-medium border flex items-center gap-1 ${
                      task.isCompleted
                        ? 'line-through bg-[#F3F4F6] dark:bg-[#202528] text-[#9CA3AF] border-transparent'
                        : task.priority === 'high'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-900/40'
                        : task.priority === 'medium'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900/40'
                        : 'bg-[#ECEEFB] text-[#4A4E9E] dark:bg-[#20233B] dark:text-[#C7C9F5] border-[#DBDEF8] dark:border-[#2D3254]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        task.priority === 'high'
                          ? 'bg-rose-500'
                          : task.priority === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-[#7B7FD4]'
                      }`}
                    />
                    <span className="truncate">{task.title}</span>
                  </div>
                ))}

                {dayTasks.length > 2 && (
                  <div className="text-[9px] text-[#6B7280] dark:text-[#9CA3AF] font-medium pl-1">
                    +{dayTasks.length - 2} more
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
