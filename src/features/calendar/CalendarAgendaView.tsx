import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, Clock, Tag } from 'lucide-react';
import type { Task } from '../../types/task.types';
import { Checkbox } from '../../components/ui/Checkbox';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAppDispatch } from '../../store';
import { toggleTaskCompleted } from '../../store/slices/tasksSlice';
import { openTaskModal } from '../../store/slices/uiSlice';
import { sound } from '../../lib/sound';

interface CalendarAgendaViewProps {
  selectedDate: Date;
  tasks: Task[];
  onAddTaskForDate: (dateStr: string) => void;
}

export const CalendarAgendaView: React.FC<CalendarAgendaViewProps> = ({
  selectedDate,
  tasks,
  onAddTaskForDate,
}) => {
  const dispatch = useAppDispatch();

  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

  const dayTasks = tasks.filter((t) => t.dueDate?.startsWith(dateKey));
  const completedCount = dayTasks.filter((t) => t.isCompleted).length;

  const handleToggle = (taskId: string) => {
    sound.playComplete();
    dispatch(toggleTaskCompleted(taskId));
  };

  const handleEdit = (taskId: string) => {
    sound.playClick();
    dispatch(openTaskModal(taskId));
  };

  return (
    <div className="bg-white dark:bg-[#1A1F21] rounded-3xl border border-[#EEF0EC] dark:border-[#273033] p-5 shadow-card flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Day Header */}
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#EEF0EC] dark:border-[#273033]">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1F2937] dark:text-[#F3F4F6]">
              Daily Schedule
            </h3>
            <p className="text-xs text-[#6BAA7A] font-semibold mt-0.5">
              {formattedDate}
            </p>
          </div>

          <span className="text-xs px-2.5 py-1 rounded-full bg-[#EAF2EC] dark:bg-[#1E2E23] text-[#24422B] dark:text-[#D1EBD6] font-bold">
            {completedCount}/{dayTasks.length} Done
          </span>
        </div>

        {/* Tasks List */}
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          <AnimatePresence mode="popLayout">
            {dayTasks.length > 0 ? (
              dayTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => handleEdit(task.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    task.isCompleted
                      ? 'bg-[#FAFBF9]/60 dark:bg-[#14181A] border-[#E5E7EB] dark:border-[#273033] opacity-75'
                      : 'bg-[#FAFBF9] dark:bg-[#161D19]/40 border-[#EEF0EC] dark:border-[#273033] hover:border-[#6BAA7A]/40 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className="pt-0.5"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Checkbox
                        checked={task.isCompleted}
                        onChange={() => handleToggle(task.id)}
                        variant="circle"
                        color="lavender"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-xs font-semibold truncate ${
                          task.isCompleted
                            ? 'line-through text-[#9CA3AF]'
                            : 'text-[#1F2937] dark:text-[#F3F4F6]'
                        }`}
                      >
                        {task.title}
                      </h4>

                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {task.dueTime && (
                          <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {task.dueTime}
                          </span>
                        )}

                        {task.category && (
                          <Badge variant="slate" size="sm" icon={<Tag className="w-2.5 h-2.5" />}>
                            {task.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-[#EAF2EC] dark:bg-[#1E2E23] text-[#6BAA7A] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF]">
                  No tasks scheduled for this day.
                </p>
                <p className="text-[11px] text-[#9CA3AF]">
                  Enjoy your day or plan a new milestone.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quick Add Button */}
      <div className="pt-4 border-t border-[#EEF0EC] dark:border-[#273033] mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            sound.playClick();
            onAddTaskForDate(dateKey);
          }}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          className="w-full"
        >
          Add Task on this Day
        </Button>
      </div>
    </div>
  );
};
