import React from 'react';
import { Trash2 } from 'lucide-react';
import { Checkbox } from '../../components/ui/Checkbox';
import type { Subtask } from '../../types/task.types';
import { useAppDispatch } from '../../store';
import { toggleSubtask, deleteSubtask } from '../../store/slices/tasksSlice';

interface TaskSubtaskItemProps {
  subtask: Subtask;
  taskId: string;
}

export const TaskSubtaskItem: React.FC<TaskSubtaskItemProps> = ({ subtask, taskId }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
      <Checkbox
        checked={subtask.isCompleted}
        onChange={() => dispatch(toggleSubtask({ taskId, subtaskId: subtask.id }))}
        variant="square"
        color="sage"
        label={
          <span
            className={`text-xs ${
              subtask.isCompleted
                ? 'line-through text-[#9CA3AF] dark:text-[#6B7280]'
                : 'text-[#1F2937] dark:text-[#E5E7EB]'
            }`}
          >
            {subtask.title}
          </span>
        }
      />
      <button
        onClick={() => dispatch(deleteSubtask({ taskId, subtaskId: subtask.id }))}
        className="opacity-0 group-hover:opacity-100 text-[#9CA3AF] hover:text-[#E05656] p-1 rounded transition-opacity cursor-pointer"
        title="Delete Subtask"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
