import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { DatePicker } from '../../components/ui/DatePicker';
import { TimePicker } from '../../components/ui/TimePicker';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeTaskModal, showToast } from '../../store/slices/uiSlice';
import { addTask, updateTask } from '../../store/slices/tasksSlice';
import type { PriorityLevel, Subtask } from '../../types/task.types';

export const TaskFormModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isTaskModalOpen);
  const editingTaskId = useAppSelector((state) => state.ui.editingTaskId);
  const editingTask = useAppSelector((state) =>
    state.ui.editingTaskId ? state.tasks.items.find((t) => t.id === state.ui.editingTaskId) : null
  );

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  // Re-populate only when modal opens or editing task changes
  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        setTitle(editingTask.title);
        setDescription(editingTask.description || '');
        setPriority(editingTask.priority);
        setCategory(editingTask.category);
        setDueDate(editingTask.dueDate || '');
        setDueTime(editingTask.dueTime || '');
        setSubtasks(editingTask.subtasks.map((s) => s.title));
      } else {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setCategory('Personal');
        setDueDate(new Date().toISOString().split('T')[0]);
        setDueTime('');
        setSubtasks([]);
      }
    }
  }, [isOpen, editingTask]);

  const handleAddSubtask = () => {
    if (newSubtaskInput.trim()) {
      setSubtasks([...subtasks, newSubtaskInput.trim()]);
      setNewSubtaskInput('');
    }
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTaskId) {
      dispatch(
        updateTask({
          id: editingTaskId,
          changes: {
            title: title.trim(),
            description: description.trim(),
            priority,
            category,
            dueDate: dueDate || undefined,
            dueTime: dueTime || undefined,
          },
        })
      );
      dispatch(showToast({ message: 'Task updated successfully', type: 'success' }));
    } else {
      const initialSubtasks: Subtask[] = subtasks.map((stTitle, idx) => ({
        id: crypto.randomUUID ? crypto.randomUUID() : `sub-${Date.now()}-${idx}`,
        taskId: '',
        title: stTitle,
        isCompleted: false,
        position: idx,
        createdAt: new Date().toISOString(),
      }));

      dispatch(
        addTask({
          userId: 'local-user',
          title: title.trim(),
          description: description.trim(),
          priority,
          category,
          dueDate: dueDate || undefined,
          dueTime: dueTime || undefined,
          isCompleted: false,
          subtasks: initialSubtasks,
        })
      );
      dispatch(showToast({ message: 'New task created', type: 'success' }));
    }

    dispatch(closeTaskModal());
  };

  const categories = [
    { value: 'Personal', label: 'Personal' },
    { value: 'Work', label: 'Work' },
    { value: 'Study', label: 'Study' },
    { value: 'Health', label: 'Health' },
    { value: 'Project', label: 'Project' },
  ];

  const priorities: { value: PriorityLevel; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeTaskModal())}
      title={editingTaskId ? 'Edit Task' : 'Create New Task'}
      subtitle="Organize your tasks with custom priority, date, and subtasks."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          placeholder="What do you want to accomplish?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        <div>
          <label className="block text-xs font-medium text-[#4F5D75] dark:text-[#9CA3AF] mb-1.5">
            Description (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Add context, notes, or links..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white dark:bg-[#1A1F21] text-[#1F2937] dark:text-[#F3F4F6] placeholder-[#9CA3AF] text-sm rounded-xl border border-[#E5E7EB] dark:border-[#2E373A] focus:border-[#6BAA7A] focus:ring-2 focus:ring-[#6BAA7A]/20 p-3 outline-none transition-all resize-none shadow-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Category"
            options={categories}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <div>
            <label className="block text-xs font-medium text-[#4F5D75] dark:text-[#9CA3AF] mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#FAFBF9] dark:bg-[#121516] p-1 rounded-xl border border-[#E5E7EB] dark:border-[#2E373A]">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    priority === p.value
                      ? p.value === 'high'
                        ? 'bg-[#E05656] text-white shadow-xs'
                        : p.value === 'medium'
                        ? 'bg-[#C4A97D] text-white shadow-xs'
                        : 'bg-[#6BAA7A] text-white shadow-xs'
                      : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Portal DatePicker & TimePicker */}
        <div className="grid grid-cols-2 gap-3">
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={(val) => setDueDate(val)}
          />
          <TimePicker
            label="Due Time (Optional)"
            value={dueTime}
            onChange={(val) => setDueTime(val)}
          />
        </div>

        {/* Subtasks Section */}
        <div>
          <label className="block text-xs font-medium text-[#4F5D75] dark:text-[#9CA3AF] mb-1.5">
            Subtasks Checklist
          </label>
          <div className="space-y-2 mb-2">
            {subtasks.map((st, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-[#F7F8F6] dark:bg-[#121516] px-3 py-1.5 rounded-lg text-xs"
              >
                <span>{st}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSubtask(idx)}
                  className="text-[#9CA3AF] hover:text-[#E05656] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a step..."
              value={newSubtaskInput}
              onChange={(e) => setNewSubtaskInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
              className="flex-1 bg-white dark:bg-[#1A1F21] text-xs text-[#1F2937] dark:text-[#F3F4F6] placeholder-[#9CA3AF] rounded-xl px-3 py-2 border border-[#E5E7EB] dark:border-[#2E373A] focus:border-[#6BAA7A] outline-none"
            />
            <Button type="button" variant="outline" size="sm" onClick={handleAddSubtask}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-[#EEF0EC] dark:border-[#273033]">
          <Button
            type="button"
            variant="outline"
            onClick={() => dispatch(closeTaskModal())}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {editingTaskId ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
