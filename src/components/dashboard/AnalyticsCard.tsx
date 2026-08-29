import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { useAppSelector } from '../../store';
import { sound } from '../../lib/sound';

export const AnalyticsCard: React.FC = () => {
  const [isLiked, setIsLiked] = useState(false);
  const tasks = useAppSelector((state) => state.tasks.items);

  const completedCount = tasks.filter((t) => t.isCompleted).length;

  const days = [
    { name: 'Mon', height: 'h-16', color: 'bg-[#6BAA7A]' },
    { name: 'Tue', height: 'h-11', color: 'bg-[#C7C9F5] dark:bg-[#7B7FD4]' },
    { name: 'Wed', height: 'h-14', color: 'bg-[#C7C9F5] dark:bg-[#7B7FD4]' },
    { name: 'Thu', height: 'h-6', color: 'bg-[#F2E8D5] dark:bg-[#423A2B]' },
    { name: 'Fri', height: 'h-6', color: 'bg-[#F2E8D5] dark:bg-[#423A2B]' },
    { name: 'Sat', height: 'h-4', color: 'bg-[#F2E8D5] dark:bg-[#423A2B]' },
    { name: 'Sun', height: 'h-4', color: 'bg-[#F2E8D5] dark:bg-[#423A2B]' },
  ];

  const handleLike = () => {
    sound.playClick();
    setIsLiked(!isLiked);
  };

  return (
    <Card variant="simple" className="p-6 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
            This Week
          </h3>
          <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            {completedCount} tasks completed
          </span>
        </div>

        {/* Weekly Productivity Bar Chart */}
        <div className="flex items-end justify-between gap-2 pt-2 pb-4 px-2">
          {days.map((d, index) => (
            <div key={d.name} className="flex flex-col items-center gap-2 flex-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`w-full max-w-[18px] rounded-lg ${d.height} ${d.color} transition-all hover:opacity-80`}
              />
              <span className="text-[11px] text-[#9CA3AF] dark:text-[#6B7280]">
                {d.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Inspirational Quote Card */}
      <div className="mt-3 p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#202528] border border-[#EEF0EC] dark:border-[#2C3538] flex items-center justify-between gap-3">
        <div className="text-xs text-[#4F5D75] dark:text-[#CBD2DC]">
          <span className="text-[#6BAA7A] font-serif text-sm mr-1">“</span>
          <span>The secret of getting ahead is getting started.</span>
        </div>
        <button
          onClick={handleLike}
          className={`shrink-0 p-1.5 rounded-lg transition-colors cursor-pointer ${
            isLiked
              ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
              : 'text-[#9CA3AF] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </Card>
  );
};
