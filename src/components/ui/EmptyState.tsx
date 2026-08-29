import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-[#CBD2DC] dark:border-[#374151] bg-[#FAFBF9] dark:bg-[#1A1F21]/40 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#EAF2EC] dark:bg-[#1E2E23] text-[#6BAA7A] flex items-center justify-center mb-3.5 shadow-xs">
        {icon || <Sparkles className="w-6 h-6" />}
      </div>
      <h4 className="font-serif text-lg font-medium text-[#1F2937] dark:text-[#F3F4F6] mb-1">
        {title}
      </h4>
      <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] max-w-sm mb-4">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};
