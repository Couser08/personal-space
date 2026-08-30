import React from 'react';
import { Plus, CheckSquare, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { Badge } from '../../components/ui/Badge';
import type { Task } from '../../types/task.types';
import { useAppDispatch } from '../../store';
import { toggleTaskCompleted } from '../../store/slices/tasksSlice';
import { sound } from '../../lib/sound';

interface CalendarDayViewProps {
  selectedDate: Date;
  tasks: Task[];
  onAddTask: (dateStr: string) => void;
}

export const CalendarDayView: React.FC<CalendarDayViewProps> = ({
  selectedDate,
  tasks,
  onAddTask,
}) => {
  const dispatch = useAppDispatch();
  const dateKey = selectedDate.toISOString().split('T')[0];
  const dayTasks = tasks.filter((t) => t.dueDate && t.dueDate.startsWith(dateKey));

  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

  return (
    <div className="space-y-4 select-none">
      {/* Day Overview Header */}
      <div className="flex items-center justify-between p-4 rounded-3xl bg-white dark:bg-[#1A1F21] border border-[#EEF0EC] dark:border-[#273033] shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EAF2EC] dark:bg-[#1E2E23] text-[#6BAA7A] flex items-center justify-center font-bold">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1F2937] dark:text-[#F3F4F6]">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              {dayTasks.filter((t) => t.isCompleted).length}/{dayTasks.length} tasks completed today
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            sound.playClick();
            onAddTask(dateKey);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Task
        </Button>
      </div>

      {/* Vertical Timeline Schedule */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#1A1F21] border border-[#EEF0EC] dark:border-[#273033] shadow-card space-y-3">
        {dayTasks.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-2">
            <CheckSquare className="w-10 h-10 text-[#9CA3AF] mx-auto opacity-50" />
            <h4 className="text-sm font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
              No tasks scheduled for today
            </h4>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] max-w-sm mx-auto">
              Plan your day with mindful milestones or enjoy focused deep work.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
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
                      className={`text-sm font-semibold truncate ${
                        task.isCompleted
                          ? 'line-through text-[#9CA3AF] dark:text-[#6B7280]'
                          : 'text-[#1F2937] dark:text-[#F3F4F6]'
                      }`}
                    >
                      {task.title}
                    </h5>
                    {task.dueTime && (
                      <span className="text-xs text-[#6BAA7A] flex items-center gap-1 mt-0.5 font-medium">
                        <Clock className="w-3.5 h-3.5" />
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
            ))}
          </div>
        )}

        {/* Hourly Guide */}
        <div className="pt-4 border-t border-[#EEF0EC] dark:border-[#273033] space-y-2">
          <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider block">
            Day Schedule Slots
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {hours.slice(0, 8).map((hr) => (
              <div
                key={hr}
                className="px-3 py-2 rounded-xl bg-[#FAFBF9] dark:bg-[#121516] border border-[#EEF0EC] dark:border-[#273033] text-xs text-[#6B7280] dark:text-[#9CA3AF] flex items-center justify-between"
              >
                <span>{hr > 12 ? `${hr - 12}:00 PM` : `${hr}:00 AM`}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#6BAA7A]/30" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
