import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAppDispatch } from '../../store';
import { setActiveTab } from '../../store/slices/uiSlice';
import type { NavTab } from '../../types/common.types';

interface PlaceholderViewProps {
  tabName: string;
  icon?: React.ReactNode;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({ tabName, icon }) => {
  const dispatch = useAppDispatch();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto py-16 px-6 text-center bg-white dark:bg-[#1A1F21] rounded-3xl border border-[#EEF0EC] dark:border-[#273033] shadow-card space-y-5 select-none"
    >
      <div className="w-16 h-16 rounded-3xl bg-[#EAF2EC] dark:bg-[#1E2E23] text-[#6BAA7A] flex items-center justify-center mx-auto shadow-xs">
        {icon || <Sparkles className="w-8 h-8" />}
      </div>

      <div className="space-y-1.5">
        <span className="text-xs uppercase tracking-wider text-[#6BAA7A] font-semibold">
          Coming in Next Phase
        </span>
        <h2 className="font-serif text-3xl font-bold text-[#1F2937] dark:text-[#F3F4F6]">
          {tabName} Space
        </h2>
        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] max-w-md mx-auto leading-relaxed">
          The dedicated {tabName.toLowerCase()} workspace is planned for the next expansion. You can continue managing your daily productivity in <strong>Home</strong> and <strong>To Do</strong>.
        </p>
      </div>

      <div className="pt-2 flex justify-center gap-3">
        <Button
          variant="primary"
          onClick={() => dispatch(setActiveTab('home'))}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Dashboard
        </Button>
        <Button
          variant="secondary"
          onClick={() => dispatch(setActiveTab('todo'))}
        >
          Open To-Do Page
        </Button>
      </div>
    </motion.div>
  );
};
