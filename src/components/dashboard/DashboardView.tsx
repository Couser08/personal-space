import React from 'react';
import { motion } from 'framer-motion';
import { DateProgressCard } from './DateProgressCard';
import { EncouragementBadge } from './EncouragementBadge';
import { FocusTimerCard } from './FocusTimerCard';
import { TasksPreviewCard } from './TasksPreviewCard';
import { QuickNotesCard } from './QuickNotesCard';
import { AnalyticsCard } from './AnalyticsCard';
import { UpcomingCard } from './UpcomingCard';
import { GoalsPreviewCard } from './GoalsPreviewCard';
import { MoodPreviewCard } from './MoodPreviewCard';

export const DashboardView: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* Row 1: Date & Progress Banner + Encouragement + Focus Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <DateProgressCard />
        </div>
        <div className="lg:col-span-2">
          <EncouragementBadge />
        </div>
        <div className="lg:col-span-5">
          <FocusTimerCard />
        </div>
      </div>

      {/* Row 2: Today's Tasks + Quick Notes + Weekly Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TasksPreviewCard />
        <QuickNotesCard />
        <AnalyticsCard />
      </div>

      {/* Row 3: Upcoming Schedule + Goals + Mood Today */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UpcomingCard />
        <GoalsPreviewCard />
        <MoodPreviewCard />
      </div>
    </motion.div>
  );
};
