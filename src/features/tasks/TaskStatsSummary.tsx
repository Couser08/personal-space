import React from 'react';
import { CheckCircle2, ListTodo, Flame } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useAppSelector } from '../../store';

export const TaskStatsSummary: React.FC = () => {
  const tasks = useAppSelector((state) => state.tasks.items);

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const pendingCount = totalCount - completedCount;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 select-none">
      {/* Metric 1: Total & Progress */}
      <Card variant="simple" className="p-4 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#EAF2EC] dark:bg-[#1E2E23] text-[#6BAA7A] flex items-center justify-center shrink-0">
          <ListTodo className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Total Tasks</span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-xl font-bold text-[#1F2937] dark:text-[#F3F4F6]">
              {totalCount}
            </span>
            <span className="text-[11px] text-[#6BAA7A] font-medium">({percentage}% done)</span>
          </div>
        </div>
      </Card>

      {/* Metric 2: Completed */}
      <Card variant="simple" className="p-4 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#ECEEFB] dark:bg-[#20233B] text-[#7B7FD4] flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Completed</span>
          <span className="block font-serif text-xl font-bold text-[#1F2937] dark:text-[#F3F4F6]">
            {completedCount}
          </span>
        </div>
      </Card>

      {/* Metric 3: Pending */}
      <Card variant="simple" className="p-4 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#FAF5EB] dark:bg-[#2C271E] text-[#C4A97D] flex items-center justify-center shrink-0">
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Pending Focus</span>
          <span className="block font-serif text-xl font-bold text-[#1F2937] dark:text-[#F3F4F6]">
            {pendingCount}
          </span>
        </div>
      </Card>
    </div>
  );
};
