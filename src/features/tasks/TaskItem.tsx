import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, ChevronUp, Plus, Edit2, Trash2, Tag, CheckSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Checkbox } from '../../components/ui/Checkbox';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { TaskSubtaskItem } from './TaskSubtaskItem';
import type { Task, PriorityLevel } from '../../types/task.types';
import { useAppDispatch } from '../../store';
import {
  toggleTaskCompleted,
  deleteTask,
  addSubtask,
} from '../../store/slices/tasksSlice';
import { openTaskModal, showToast } from '../../store/slices/uiSlice';
import { formatDueCountdown } from '../../utils/dateUtils';
import { sound } from '../../lib/sound';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const dispatch = useAppDispatch();
  // Default to expanded so subtasks are always clearly visible across mobile, tablet, and laptop
  const [isExpanded, setIsExpanded] = useState(true);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const completedSubtasks = (task.subtasks || []).filter((s) => s.isCompleted).length;
  const totalSubtasks = (task.subtasks || []).length;
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
      dispatch(showToast({ message: 'Subtask added', type: 'success' }));
    }
  };

  const handleDeleteConfirm = () => {
    sound.playClick();
    dispatch(deleteTask(task.id));
    dispatch(showToast({ message: 'Task deleted', type: 'info' }));
    setIsDeleteConfirmOpen(false);
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'high':
        return <Badge variant="rose" size="sm">High Priority</Badge>;
      case 'medium':
        return <Badge variant="sand" size="sm">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="sage" size="sm">Low Priority</Badge>;
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`p-4 rounded-2xl border transition-all ${
          task.isCompleted
            ? 'bg-[#FAFBF9]/90 dark:bg-[#151A1C] border-[#E5E7EB] dark:border-[#273033] opacity-80'
            : 'bg-white dark:bg-[#1A1F21] border-[#EEF0EC] dark:border-[#2E373A] shadow-card hover:shadow-card-hover'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* 44px touch target for checkbox */}
            <div className="min-w-[44px] min-h-[44px] -ml-2 -mt-2 flex items-center justify-center">
              <Checkbox
                checked={task.isCompleted}
                onChange={handleToggle}
                variant="circle"
                color="lavender"
              />
            </div>

            {/* Task Main Info */}
            <div className="flex-1 min-w-0">
              <h4
                className={`text-sm font-semibold leading-snug transition-all ${
                  task.isCompleted
                    ? 'line-through text-[#9CA3AF] dark:text-[#828D99]'
                    : 'text-[#1F2937] dark:text-[#F3F4F6]'
                }`}
              >
                {task.title}
              </h4>

              {task.description && (
                <p className="text-xs text-[#6B7280] dark:text-[#CBD2DC] mt-1 leading-relaxed">
                  {task.description}
                </p>
              )}

              {/* Badges & Meta Row */}
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
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#ECEEFB] dark:bg-[#232746] text-[#3B408C] dark:text-[#D4D7FB] font-semibold flex items-center gap-1 cursor-pointer transition-all hover:scale-102"
                  >
                    <CheckSquare className="w-3 h-3 text-[#7B7FD4]" />
                    <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons (with 44px min touch areas) */}
          <div className="flex items-center gap-1 shrink-0 -mr-1">
            <button
              onClick={() => {
                sound.playClick();
                dispatch(openTaskModal(task.id));
              }}
              className="w-9 h-9 flex items-center justify-center text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              title="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setIsDeleteConfirmOpen(true);
              }}
              className="w-9 h-9 flex items-center justify-center text-[#9CA3AF] hover:text-[#E05656] rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subtasks Checklist Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-[#EEF0EC] dark:border-[#273033] space-y-1.5"
            >
              {(task.subtasks || []).map((sub) => (
                <TaskSubtaskItem key={sub.id} subtask={sub} taskId={task.id} />
              ))}

              {/* Add subtask trigger & inline form */}
              {isAddingSubtask ? (
                <form onSubmit={handleAddSubtaskSubmit} className="flex items-center gap-2 pt-1.5 px-2">
                  <input
                    type="text"
                    placeholder="Enter subtask name..."
                    autoFocus
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    className="flex-1 text-xs bg-white dark:bg-[#121516] text-[#1F2937] dark:text-[#F3F4F6] border border-[#CBD2DC] dark:border-[#374151] rounded-xl px-3 py-2 outline-none focus:border-[#6BAA7A]"
                  />
                  <button
                    type="submit"
                    className="text-xs px-3.5 py-2 bg-[#6BAA7A] hover:bg-[#558E63] text-white rounded-xl font-semibold cursor-pointer shadow-2xs"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingSubtask(false)}
                    className="text-xs text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white px-2 py-2 cursor-pointer"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingSubtask(true)}
                  className="flex items-center gap-1.5 text-xs text-[#6BAA7A] dark:text-[#82C291] hover:underline px-2 py-1.5 font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Subtask</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task?"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
};
