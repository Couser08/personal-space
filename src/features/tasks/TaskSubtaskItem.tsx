import React from 'react';
import { Trash2 } from 'lucide-react';
import { Checkbox } from '../../components/ui/Checkbox';
import type { Subtask } from '../../types/task.types';
import { useAppDispatch } from '../../store';
import { toggleSubtask, deleteSubtask } from '../../store/slices/tasksSlice';
import { sound } from '../../lib/sound';

interface TaskSubtaskItemProps {
  subtask: Subtask;
  taskId: string;
}

export const TaskSubtaskItem: React.FC<TaskSubtaskItemProps> = ({ subtask, taskId }) => {
  const dispatch = useAppDispatch();

  const handleToggle = () => {
    sound.playClick();
    dispatch(toggleSubtask({ taskId, subtaskId: subtask.id }));
  };

  const handleDelete = () => {
    sound.playClick();
    dispatch(deleteSubtask({ taskId, subtaskId: subtask.id }));
  };

  return (
    <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Checkbox
          checked={subtask.isCompleted}
          onChange={handleToggle}
          variant="square"
          color="sage"
        />
        <span
          onClick={handleToggle}
          className={`text-xs font-medium cursor-pointer truncate select-none ${
            subtask.isCompleted
              ? 'line-through text-[#9CA3AF] dark:text-[#7A8699]'
              : 'text-[#1F2937] dark:text-[#F3F4F6]'
          }`}
        >
          {subtask.title}
        </span>
      </div>

      <button
        onClick={handleDelete}
        className="w-7 h-7 flex items-center justify-center text-[#9CA3AF] hover:text-[#E05656] dark:hover:text-[#F87171] rounded-lg transition-all cursor-pointer opacity-70 group-hover:opacity-100"
        title="Delete Subtask"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
