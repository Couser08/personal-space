import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

interface GoalItem {
  id: string;
  title: string;
  progress: number;
  color: 'sage' | 'lavender';
}

export const GoalsPreviewCard: React.FC = () => {
  const goals: GoalItem[] = [
    { id: '1', title: 'Complete OS Syllabus', progress: 70, color: 'sage' },
    { id: '2', title: 'Read 12 Books This Year', progress: 45, color: 'lavender' },
    { id: '3', title: 'Build a Personal Project', progress: 60, color: 'sage' },
  ];

  return (
    <Card variant="simple" className="p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
            Goals
          </h3>
          <span className="text-xs text-[#6BAA7A] hover:underline flex items-center gap-1 font-medium cursor-pointer">
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#1F2937] dark:text-[#F3F4F6]">
                  {goal.title}
                </span>
                <span className="font-semibold text-[#4F5D75] dark:text-[#9CA3AF]">
                  {goal.progress}%
                </span>
              </div>
              <ProgressBar value={goal.progress} max={100} color={goal.color} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
