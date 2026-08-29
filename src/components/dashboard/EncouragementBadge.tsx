import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { useAppSelector } from '../../store';

export const EncouragementBadge: React.FC = () => {
  const tasks = useAppSelector((state) => state.tasks.items);
  const completedCount = tasks.filter((t) => t.isCompleted).length;

  const getEncouragement = () => {
    if (completedCount >= 5) return 'Crushing your goals!';
    if (completedCount >= 3) return "You're doing great!";
    if (completedCount >= 1) return 'Great momentum!';
    return 'Ready to bloom!';
  };

  return (
    <Card variant="info" className="p-5 flex flex-col items-center justify-center text-center h-full min-w-[150px]">
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-2xl bg-[#4F5D75] dark:bg-[#394457] text-white flex items-center justify-center shadow-sm mb-2"
      >
        <div className="w-6 h-6 rounded-full border-2 border-white/80 flex items-center justify-center">
          <Check className="w-3.5 h-3.5 stroke-[3] text-white" />
        </div>
      </motion.div>
      <span className="font-serif text-sm font-semibold text-[#2D3169] dark:text-[#E0E2FD]">
        {getEncouragement()}
      </span>
    </Card>
  );
};
