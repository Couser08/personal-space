import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, ChevronUp, Plus, Edit2, Trash2, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Checkbox } from '../../components/ui/Checkbox';
import { Badge } from '../../components/ui/Badge';
import { TaskSubtaskItem } from './TaskSubtaskItem';
import type { Task, PriorityLevel } from '../../types/task.types';
import { useAppDispatch } from '../../store';
import {
  toggleTaskCompleted,
  deleteTask,
  addSubtask,
} from '../../store/slices/tasksSlice';
import { openTaskModal } from '../../store/slices/uiSlice';
import { formatDueCountdown } from '../../utils/dateUtils';
import { sound } from '../../lib/sound';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const dispatch = useAppDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const completedSubtasks = task.subtasks.filter((s) => s.isCompleted).length;
  const totalSubtasks = task.subtasks.length;
  const countdown = formatDueCountdown(task.dueDate);

  const handleToggle = () => {
    if (!task.isCompleted) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6BAA7A', '#C7C9F5', '#F2E8D5'],
      });
    }
    dispatch(toggleTaskCompleted(task.id));
  };

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      dispatch(addSubtask({ taskId: task.id, title: newSubtaskTitle.trim() }));
      setNewSubtaskTitle('');
      setIsAddingSubtask(false);
    }
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'high':
        return <Badge variant="rose" size="sm">High</Badge>;
      case 'medium':
        return <Badge variant="sand" size="sm">Medium</Badge>;
      case 'low':
        return <Badge variant="sage" size="sm">Low</Badge>;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`p-4 rounded-2xl border transition-all ${
        task.isCompleted
          ? 'bg-[#FAFBF9]/80 dark:bg-[#1A1F21]/40 border-[#E5E7EB] dark:border-[#273033] opacity-75'
          : 'bg-white dark:bg-[#1A1F21] border-[#EEF0EC] dark:border-[#273033] shadow-card hover:shadow-card-hover'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Custom Checkbox */}
          <div className="pt-0.5">
            <Checkbox
              checked={task.isCompleted}
              onChange={handleToggle}
              variant="circle"
              color="lavender"
            />
          </div>

          {/* Task Info */}
          <div className="flex-1 min-w-0">
            <h4
              className={`text-sm font-semibold transition-all ${
                task.isCompleted
                  ? 'line-through text-[#9CA3AF] dark:text-[#6B7280]'
                  : 'text-[#1F2937] dark:text-[#F3F4F6]'
              }`}
            >
              {task.title}
            </h4>

            {task.description && (
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Badges and Metadata */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              {getPriorityBadge(task.priority)}

              {task.category && (
                <Badge variant="slate" size="sm" icon={<Tag className="w-3 h-3" />}>
                  {task.category}
                </Badge>
              )}

              {task.dueDate && (
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${countdown.colorClass}`}>
                  <Calendar className="w-3 h-3" />
                  <span>{task.dueDate} {task.dueTime ? `• ${task.dueTime}` : ''} ({countdown.text})</span>
                </span>
              )}

              {totalSubtasks > 0 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-[#ECEEFB] dark:bg-[#20233B] text-[#4A4E9E] dark:text-[#C7C9F5] font-medium flex items-center gap-1 cursor-pointer hover:opacity-80"
                >
                  <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              dispatch(openTaskModal(task.id));
            }}
            className="p-1.5 text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Edit Task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              sound.playClick();
              dispatch(deleteTask(task.id));
            }}
            className="p-1.5 text-[#9CA3AF] hover:text-[#E05656] rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable Subtasks Checklist */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-[#EEF0EC] dark:border-[#273033] space-y-1"
          >
            {task.subtasks.map((sub) => (
              <TaskSubtaskItem key={sub.id} subtask={sub} taskId={task.id} />
            ))}

            {/* Add subtask input */}
            {isAddingSubtask ? (
              <form onSubmit={handleAddSubtaskSubmit} className="flex items-center gap-2 pt-1 px-3">
                <input
                  type="text"
                  placeholder="Subtask title..."
                  autoFocus
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className="flex-1 text-xs bg-white dark:bg-[#121516] border border-[#CBD2DC] dark:border-[#374151] rounded-lg px-2.5 py-1.5 outline-none focus:border-[#6BAA7A]"
                />
                <button
                  type="submit"
                  className="text-xs px-3 py-1.5 bg-[#6BAA7A] text-white rounded-lg font-medium cursor-pointer"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingSubtask(false)}
                  className="text-xs text-[#9CA3AF] hover:text-[#1F2937] p-1 cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingSubtask(true)}
                className="flex items-center gap-1.5 text-xs text-[#6BAA7A] hover:underline px-3 py-1 font-medium cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add subtask</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
