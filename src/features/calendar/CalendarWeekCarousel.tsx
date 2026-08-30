import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, CheckSquare, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { Badge } from '../../components/ui/Badge';
import type { Task } from '../../types/task.types';
import { useAppDispatch } from '../../store';
import { toggleTaskCompleted } from '../../store/slices/tasksSlice';
import { sound } from '../../lib/sound';

interface CalendarWeekCarouselProps {
  selectedDate: Date;
  tasks: Task[];
  onSelectDate: (date: Date) => void;
  onAddTask: (dateStr: string) => void;
}

export const CalendarWeekCarousel: React.FC<CalendarWeekCarouselProps> = ({
  selectedDate,
  tasks,
  onSelectDate,
  onAddTask,
}) => {
  const dispatch = useAppDispatch();

  // Compute the 7 days of the current week around selectedDate
  const currentDayOfWeek = selectedDate.getDay(); // 0 is Sunday
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - currentDayOfWeek);

  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    weekDays.push(d);
  }

  const selectedDateKey = selectedDate.toISOString().split('T')[0];
  const dayTasks = tasks.filter((t) => t.dueDate && t.dueDate.startsWith(selectedDateKey));

  const handlePrevDay = () => {
    sound.playClick();
    const prev = new Date(selectedDate);
    prev.setDate(selectedDate.getDate() - 1);
    onSelectDate(prev);
  };

  const handleNextDay = () => {
    sound.playClick();
    const next = new Date(selectedDate);
    next.setDate(selectedDate.getDate() + 1);
    onSelectDate(next);
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayKey = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4 select-none">
      {/* 7-Day Pill Strip (Scrollable & Touch Optimized with 44px min touch target) */}
      <div className="flex items-center justify-between gap-1.5 p-2 rounded-2xl bg-white dark:bg-[#1A1F21] border border-[#EEF0EC] dark:border-[#273033] shadow-card">
        {weekDays.map((d) => {
          const dateKey = d.toISOString().split('T')[0];
          const isSelected = dateKey === selectedDateKey;
          const isToday = dateKey === todayKey;
          const count = tasks.filter((t) => t.dueDate && t.dueDate.startsWith(dateKey)).length;

          return (
            <button
              key={dateKey}
              onClick={() => {
                sound.playClick();
                onSelectDate(d);
              }}
              className={`flex-1 min-h-[48px] py-1.5 px-1 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#6BAA7A] text-white shadow-xs scale-105'
                  : 'bg-[#FAFBF9] dark:bg-[#121516] text-[#4F5D75] dark:text-[#CBD2DC] border border-[#EEF0EC] dark:border-[#273033] hover:border-[#6BAA7A]'
              }`}
            >
              <span className={`text-[10px] uppercase font-semibold ${isSelected ? 'text-white' : 'text-[#9CA3AF]'}`}>
                {dayNames[d.getDay()]}
              </span>
              <span className={`text-xs font-bold ${isSelected ? 'text-white' : isToday ? 'text-[#6BAA7A]' : ''}`}>
                {d.getDate()}
              </span>
              {count > 0 && (
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                    isSelected ? 'bg-white' : 'bg-[#6BAA7A]'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Swipeable Single-Day Card Container */}
      <motion.div
        key={selectedDateKey}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1A1F21] border border-[#EEF0EC] dark:border-[#273033] shadow-card space-y-4"
      >
        {/* Day Card Header with Swipe Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EEF0EC] dark:border-[#273033]">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1F2937] dark:text-[#F3F4F6]">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              {dayTasks.length} {dayTasks.length === 1 ? 'task scheduled' : 'tasks scheduled'}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevDay}
              title="Previous Day"
              className="w-9 h-9 rounded-xl bg-[#FAFBF9] dark:bg-[#121516] border border-[#EEF0EC] dark:border-[#273033] flex items-center justify-center text-[#4F5D75] dark:text-[#CBD2DC] hover:text-[#1F2937] cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextDay}
              title="Next Day"
              className="w-9 h-9 rounded-xl bg-[#FAFBF9] dark:bg-[#121516] border border-[#EEF0EC] dark:border-[#273033] flex items-center justify-center text-[#4F5D75] dark:text-[#CBD2DC] hover:text-[#1F2937] cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-2.5 min-h-[160px]">
          {dayTasks.length === 0 ? (
            <div className="text-center py-10 px-4 bg-[#FAFBF9] dark:bg-[#121516] rounded-2xl border border-dashed border-[#EEF0EC] dark:border-[#273033] space-y-2">
              <CheckSquare className="w-8 h-8 text-[#9CA3AF] mx-auto opacity-50" />
              <p className="text-xs font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
                No tasks for this day
              </p>
              <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                Swipe left/right or tap a day above to navigate.
              </p>
            </div>
          ) : (
            dayTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  task.isCompleted
                    ? 'bg-[#FAFBF9]/80 dark:bg-[#14181A] border-[#E5E7EB] dark:border-[#273033] opacity-75'
                    : 'bg-white dark:bg-[#1A1F21] border-[#EEF0EC] dark:border-[#2E373A] shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Checkbox
                    checked={task.isCompleted}
                    onChange={() => {
                      sound.playClick();
                      dispatch(toggleTaskCompleted(task.id));
                    }}
                    variant="circle"
                    color="sage"
                  />
                  <div className="min-w-0">
                    <h5
                      className={`text-xs font-semibold truncate ${
                        task.isCompleted
                          ? 'line-through text-[#9CA3AF] dark:text-[#6B7280]'
                          : 'text-[#1F2937] dark:text-[#F3F4F6]'
                      }`}
                    >
                      {task.title}
                    </h5>
                    {task.dueTime && (
                      <span className="text-[10px] text-[#6BAA7A] flex items-center gap-1 mt-0.5 font-medium">
                        <Clock className="w-3 h-3" />
                        {task.dueTime}
                      </span>
                    )}
                  </div>
                </div>

                <Badge
                  variant={
                    task.priority === 'high'
                      ? 'rose'
                      : task.priority === 'medium'
                      ? 'sand'
                      : 'sage'
                  }
                  size="sm"
                >
                  {task.priority}
                </Badge>
              </div>
            ))
          )}
        </div>

        {/* Add Task Button */}
        <Button
          variant="primary"
          className="w-full shadow-xs"
          onClick={() => {
            sound.playClick();
            onAddTask(selectedDateKey);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Task for {selectedDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
        </Button>
      </motion.div>
    </div>
  );
};
