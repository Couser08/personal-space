import React from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAppSelector } from '../../store';
import { formatDueCountdown } from '../../utils/dateUtils';

interface UpcomingEvent {
  id: string;
  title: string;
  dateTime: string;
  badgeText: string;
  badgeVariant: 'sage' | 'lavender' | 'sand';
  iconColor: string;
  iconBg: string;
}

export const UpcomingCard: React.FC = () => {
  const tasks = useAppSelector((state) => state.tasks.items);

  // Derive from tasks with due dates or provide serene schedule view
  const eventsWithDates = tasks
    .filter((t) => t.dueDate && !t.isCompleted)
    .slice(0, 3)
    .map((t, idx) => {
      const countdown = formatDueCountdown(t.dueDate);
      const variants: ('sage' | 'lavender' | 'sand')[] = ['sage', 'lavender', 'sand'];
      return {
        id: t.id,
        title: t.title,
        dateTime: `${t.dueDate} ${t.dueTime ? '• ' + t.dueTime : ''}`,
        badgeText: countdown.text,
        badgeVariant: variants[idx % 3],
        iconColor: idx === 0 ? 'text-[#6BAA7A]' : idx === 1 ? 'text-[#7B7FD4]' : 'text-[#C4A97D]',
        iconBg: idx === 0 ? 'bg-[#EAF2EC] dark:bg-[#1E2E23]' : idx === 1 ? 'bg-[#ECEEFB] dark:bg-[#20233B]' : 'bg-[#FAF5EB] dark:bg-[#2C271E]',
      };
    });

  const defaultUpcoming: UpcomingEvent[] = [
    {
      id: 'up-1',
      title: 'OS Unit 4 Exam',
      dateTime: '29 May 2025 • 10:00 AM',
      badgeText: '3 days left',
      badgeVariant: 'sage',
      iconColor: 'text-[#6BAA7A]',
      iconBg: 'bg-[#EAF2EC] dark:bg-[#1E2E23]',
    },
    {
      id: 'up-2',
      title: 'Project Submission',
      dateTime: '02 June 2025 • 11:59 PM',
      badgeText: '7 days left',
      badgeVariant: 'lavender',
      iconColor: 'text-[#7B7FD4]',
      iconBg: 'bg-[#ECEEFB] dark:bg-[#20233B]',
    },
    {
      id: 'up-3',
      title: 'Gym Session',
      dateTime: 'Today • 06:00 PM',
      badgeText: 'Today',
      badgeVariant: 'sand',
      iconColor: 'text-[#C4A97D]',
      iconBg: 'bg-[#FAF5EB] dark:bg-[#2C271E]',
    },
  ];

  const displayList = eventsWithDates.length > 0 ? eventsWithDates : defaultUpcoming;

  return (
    <Card variant="simple" className="p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
            Upcoming
          </h3>
        </div>

        <div className="space-y-3.5">
          {displayList.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0`}>
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#9CA3AF] dark:text-[#6B7280]">
                    {item.dateTime}
                  </p>
                </div>
              </div>

              <Badge variant={item.badgeVariant} size="sm">
                {item.badgeText}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
