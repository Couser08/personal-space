import React from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';
import { EmptyState } from '../ui/EmptyState';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleTaskCompleted } from '../../store/slices/tasksSlice';
import { setActiveTab, openTaskModal } from '../../store/slices/uiSlice';
import { sound } from '../../lib/sound';

export const TasksPreviewCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items);

  // Today's or active tasks
  const todayTasks = tasks.slice(0, 6);

  const handleToggle = (id: string) => {
    dispatch(toggleTaskCompleted(id));
  };

  const handleAddTask = () => {
    sound.playClick();
    dispatch(openTaskModal());
  };

  const handleViewAll = () => {
    sound.playClick();
    dispatch(setActiveTab('todo'));
  };

  return (
    <Card variant="simple" className="p-6 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
            Today's Tasks
          </h3>
          <button
            onClick={handleViewAll}
            className="text-xs text-[#6BAA7A] hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Tasks List */}
        {todayTasks.length === 0 ? (
          <EmptyState
            title="All clear for today"
            description="Add your first task to start organizing your space."
            actionLabel="Add Task"
            onAction={handleAddTask}
            className="py-6 my-2"
          />
        ) : (
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between group py-1 transition-colors"
              >
                <Checkbox
                  checked={task.isCompleted}
                  onChange={() => handleToggle(task.id)}
                  variant="circle"
                  color="lavender"
                  label={
                    <span
                      className={`text-sm transition-all select-none ${
                        task.isCompleted
                          ? 'line-through text-[#9CA3AF] dark:text-[#6B7280]'
                          : 'text-[#1F2937] dark:text-[#E5E7EB]'
                      }`}
                    >
                      {task.title}
                    </span>
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Task Button */}
      <button
        onClick={handleAddTask}
        className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#EAF2EC] dark:bg-[#1E2E23] hover:bg-[#D4E7D8] dark:hover:bg-[#253B2D] text-[#3D6B47] dark:text-[#A7CFAF] text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.99]"
      >
        <Plus className="w-4 h-4" />
        <span>Add Task</span>
      </button>
    </Card>
  );
};
