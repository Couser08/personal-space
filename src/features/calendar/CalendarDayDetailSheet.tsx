import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, X, CheckSquare, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { Badge } from '../../components/ui/Badge';
import type { Task } from '../../types/task.types';
import { useAppDispatch } from '../../store';
import { toggleTaskCompleted } from '../../store/slices/tasksSlice';
import { sound } from '../../lib/sound';

interface CalendarDayDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  tasks: Task[];
  onAddTask: (dateStr: string) => void;
}

export const CalendarDayDetailSheet: React.FC<CalendarDayDetailSheetProps> = ({
  isOpen,
  onClose,
  selectedDate,
  tasks,
  onAddTask,
}) => {
  const dispatch = useAppDispatch();
  const dateKey = selectedDate.toISOString().split('T')[0];
  const dayTasks = tasks.filter((t) => t.dueDate && t.dueDate.startsWith(dateKey));

  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/45 backdrop-blur-xs"
          />

          {/* Slide-Up Day Detail Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 420, damping: 35 }}
            className="relative w-full max-h-[82vh] overflow-y-auto bg-white dark:bg-[#1A1F21] rounded-t-3xl border-t border-[#EEF0EC] dark:border-[#273033] shadow-float p-5 pb-8 space-y-4 z-10 select-none"
          >
            {/* Drag Handle */}
            <div className="flex justify-center -mt-2 pb-1">
              <div className="w-10 h-1 rounded-full bg-black/15 dark:bg-white/20" />
            </div>

            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF0EC] dark:border-[#273033]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EAF2EC] dark:bg-[#1E2E23] text-[#6BAA7A] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#1F2937] dark:text-[#F3F4F6]">
                    {formattedDate}
                  </h3>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                    {dayTasks.length} {dayTasks.length === 1 ? 'task scheduled' : 'tasks scheduled'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Task List for Selected Date */}
            <div className="space-y-2 max-h-[50vh] overflow-y-auto py-1">
              {dayTasks.length === 0 ? (
                <div className="text-center py-8 px-4 bg-[#FAFBF9] dark:bg-[#121516] rounded-2xl border border-dashed border-[#EEF0EC] dark:border-[#273033] space-y-2">
                  <CheckSquare className="w-8 h-8 text-[#9CA3AF] mx-auto opacity-50" />
                  <p className="text-xs font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
                    No tasks on this day
                  </p>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                    Take a mindful breath or schedule a milestone.
                  </p>
                </div>
              ) : (
                dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      task.isCompleted
                        ? 'bg-[#FAFBF9]/80 dark:bg-[#14181A] border-[#E5E7EB] dark:border-[#273033] opacity-75'
                        : 'bg-white dark:bg-[#1A1F21] border-[#EEF0EC] dark:border-[#2E373A] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
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

            {/* Add Task Button for this Date */}
            <div className="pt-2">
              <Button
                variant="primary"
                className="w-full shadow-xs"
                onClick={() => {
                  sound.playClick();
                  onClose();
                  onAddTask(dateKey);
                }}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Task for this Day
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
