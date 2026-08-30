import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarHeader, CalendarViewMode } from './CalendarHeader';
import { CalendarMonthView } from './CalendarMonthView';
import { CalendarAgendaView } from './CalendarAgendaView';
import { CalendarDayDetailSheet } from './CalendarDayDetailSheet';
import { CalendarWeekCarousel } from './CalendarWeekCarousel';
import { CalendarDayView } from './CalendarDayView';
import { useAppDispatch, useAppSelector } from '../../store';
import { openTaskModal } from '../../store/slices/uiSlice';

export const CalendarPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [isDayDetailOpen, setIsDayDetailOpen] = useState(false);

  const handlePrevMonth = () => {
    if (viewMode === 'day') {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1));
      setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1));
    } else if (viewMode === 'week') {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7));
      setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7));
    } else {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }
  };

  const handleNextMonth = () => {
    if (viewMode === 'day') {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1));
      setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1));
    } else if (viewMode === 'week') {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7));
      setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7));
    } else {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleAddTask = () => {
    dispatch(openTaskModal());
  };

  const handleAddTaskForDate = (_dateStr: string) => {
    dispatch(openTaskModal());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    // On mobile screens, open the Day Detail Bottom Sheet for deep focus
    if (window.innerWidth < 768) {
      setIsDayDetailOpen(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5 max-w-7xl mx-auto pb-10 select-none overflow-x-hidden"
    >
      {/* Calendar Header with View Switcher (Month / Week / Day) */}
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onAddTask={handleAddTask}
      />

      {/* Dynamic View Architecture based on View Mode */}
      <AnimatePresence mode="wait">
        {viewMode === 'month' && (
          <motion.div
            key="month-view"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2">
              <CalendarMonthView
                currentDate={currentDate}
                selectedDate={selectedDate}
                tasks={tasks}
                onSelectDate={handleDateClick}
              />
            </div>

            {/* Desktop Agenda Sidebar (hidden on mobile, replaced by DayDetailSheet) */}
            <div className="hidden lg:block lg:col-span-1">
              <CalendarAgendaView
                selectedDate={selectedDate}
                tasks={tasks}
                onAddTaskForDate={handleAddTaskForDate}
              />
            </div>
          </motion.div>
        )}

        {viewMode === 'week' && (
          <motion.div
            key="week-view"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <CalendarWeekCarousel
              selectedDate={selectedDate}
              tasks={tasks}
              onSelectDate={setSelectedDate}
              onAddTask={handleAddTaskForDate}
            />
          </motion.div>
        )}

        {viewMode === 'day' && (
          <motion.div
            key="day-view"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <CalendarDayView
              selectedDate={selectedDate}
              tasks={tasks}
              onAddTask={handleAddTaskForDate}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Day Detail Slide-Up Bottom Sheet */}
      <CalendarDayDetailSheet
        isOpen={isDayDetailOpen}
        onClose={() => setIsDayDetailOpen(false)}
        selectedDate={selectedDate}
        tasks={tasks}
        onAddTask={handleAddTaskForDate}
      />
    </motion.div>
  );
};
