import React from 'react';
import { motion } from 'framer-motion';

export interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  color?: 'sage' | 'lavender' | 'sand';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'sage',
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100))) || 0;

  const colorStyles: Record<string, string> = {
    sage: 'bg-[#6BAA7A]',
    lavender: 'bg-[#C7C9F5] dark:bg-[#7B7FD4]',
    sand: 'bg-[#C4A97D]',
  };

  const heightStyles: Record<string, string> = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-[#4F5D75] dark:text-[#9CA3AF] mb-1.5">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-[#E5E7EB] dark:bg-[#2A3134] rounded-full overflow-hidden ${heightStyles[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full ${colorStyles[color]}`}
        />
      </div>
    </div>
  );
};
