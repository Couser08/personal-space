import React from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { formatCurrentDate } from '../../utils/dateUtils';
import { useAppSelector } from '../../store';

export const DateProgressCard: React.FC = () => {
  const { dayName, dayNumber, monthYear } = formatCurrentDate();
  const tasks = useAppSelector((state) => state.tasks.items);

  const todayTasks = tasks.filter((t) => !t.dueDate || t.dueDate === new Date().toISOString().split('T')[0]);
  const completedCount = todayTasks.filter((t) => t.isCompleted).length;
  const totalCount = todayTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Card variant="simple" className="p-6 flex flex-col md:flex-row items-center gap-6 justify-between">
      {/* Date Column */}
      <div className="flex flex-col items-start pr-6 border-b md:border-b-0 md:border-r border-[#EEF0EC] dark:border-[#273033] min-w-[130px]">
        <span className="text-sm font-medium text-[#6BAA7A] dark:text-[#82C291]">
          {dayName}
        </span>
        <span className="font-serif text-5xl font-bold text-[#6BAA7A] dark:text-[#82C291] leading-none my-1">
          {dayNumber}
        </span>
        <span className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF]">
          {monthYear}
        </span>
      </div>

      {/* Progress Column */}
      <div className="flex-1 w-full space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
            Today's Progress
          </h4>
          <span className="text-xs font-medium text-[#4F5D75] dark:text-[#9CA3AF]">
            {totalCount > 0 ? `${completedCount} / ${totalCount} tasks completed` : 'No tasks scheduled'}
          </span>
        </div>

        <ProgressBar value={progressPercent} max={100} color="sage" size="md" />

        <p className="text-xs italic text-[#6B7280] dark:text-[#9CA3AF] flex items-center gap-1.5 pt-0.5">
          <span className="text-[#6BAA7A] font-serif text-sm">“</span>
          <span>Discipline today, freedom tomorrow.</span>
        </p>
      </div>
    </Card>
  );
};
