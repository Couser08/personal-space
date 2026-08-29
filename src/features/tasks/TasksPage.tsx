import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckSquare, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { TaskStatsSummary } from './TaskStatsSummary';
import { TaskFilters } from './TaskFilters';
import { TaskItem } from './TaskItem';
import { TaskFormModal } from './TaskFormModal';
import { useAppDispatch, useAppSelector } from '../../store';
import { openTaskModal } from '../../store/slices/uiSlice';
import { setSearchQuery } from '../../store/slices/tasksSlice';
import { sound } from '../../lib/sound';

export const TasksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: tasks, filterTab, selectedCategory, searchQuery } = useAppSelector(
    (state) => state.tasks
  );

  const handleOpenNewTask = () => {
    sound.playClick();
    dispatch(openTaskModal());
  };

  // Filter tasks based on tab, category, and search query
  const filteredTasks = tasks.filter((task) => {
    // Search query filter
    if (searchQuery.trim()) {
      const matchTitle = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDesc = task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = task.category.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    // Category filter
    if (selectedCategory !== 'All' && task.category !== selectedCategory) {
      return false;
    }

    // Status / Tab filter
    const todayStr = new Date().toISOString().split('T')[0];
    switch (filterTab) {
      case 'today':
        return !task.isCompleted && (!task.dueDate || task.dueDate === todayStr);
      case 'upcoming':
        return !task.isCompleted && Boolean(task.dueDate && task.dueDate > todayStr);
      case 'high_priority':
        return !task.isCompleted && task.priority === 'high';
      case 'completed':
        return task.isCompleted;
      case 'all':
      default:
        return true;
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-5xl mx-auto"
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
            To-Do & Productivity
          </h2>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
            Break big goals into daily mindful steps.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenNewTask}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-md"
        >
          Add New Task
        </Button>
      </div>

      {/* Stats Summary Banner */}
      <TaskStatsSummary />

      {/* Filter and Category Bar */}
      <div className="bg-white dark:bg-[#1A1F21] p-5 rounded-2xl border border-[#EEF0EC] dark:border-[#273033] shadow-card space-y-4">
        {/* Search within Tasks */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search by title, description or category..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full bg-[#FAFBF9] dark:bg-[#121516] text-xs text-[#1F2937] dark:text-[#F3F4F6] placeholder-[#9CA3AF] rounded-xl pl-9 pr-4 py-2 border border-[#E5E7EB] dark:border-[#2E373A] focus:border-[#6BAA7A] outline-none"
          />
        </div>

        <TaskFilters />
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="w-6 h-6" />}
          title={
            searchQuery
              ? 'No matching tasks found'
              : filterTab === 'completed'
              ? 'No completed tasks yet'
              : 'Your space is clear and tranquil'
          }
          description={
            searchQuery
              ? 'Try adjusting your search terms or filter criteria.'
              : 'Add your first task to start organizing your day effortlessly.'
          }
          actionLabel={filterTab !== 'completed' ? 'Create a Task' : undefined}
          onAction={filterTab !== 'completed' ? handleOpenNewTask : undefined}
          className="py-12"
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
