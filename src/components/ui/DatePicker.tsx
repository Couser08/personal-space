import React, { useState, useRef, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { sound } from '../../lib/sound';

export interface DatePickerProps {
  label?: string;
  value?: string; // Format: YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  minDate?: string;
  error?: string;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = memo(({
  label,
  value,
  onChange,
  placeholder = 'Select date...',
  error,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; openUpwards: boolean }>({
    top: 0,
    left: 0,
    openUpwards: false,
  });

  const initialDate = value ? new Date(value + 'T00:00:00') : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  // Calculate coordinates relative to viewport
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverHeight = 320;
    const popoverWidth = 288;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpwards = spaceBelow < popoverHeight && rect.top > popoverHeight;

    let left = rect.left;
    if (left + popoverWidth > window.innerWidth) {
      left = window.innerWidth - popoverWidth - 16;
    }
    if (left < 16) left = 16;

    setCoords({
      top: openUpwards ? rect.top - popoverHeight - 8 : rect.bottom + 8,
      left,
      openUpwards,
    });
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleScrollOrResize = () => updatePosition();
      window.addEventListener('resize', handleScrollOrResize);
      window.addEventListener('scroll', handleScrollOrResize, true);
      return () => {
        window.removeEventListener('resize', handleScrollOrResize);
        window.removeEventListener('scroll', handleScrollOrResize, true);
      };
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const prevMonth = () => {
    sound.playClick();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    sound.playClick();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();

  const handleSelectDay = (day: number) => {
    sound.playClick();
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange(`${viewYear}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const handleToday = () => {
    sound.playClick();
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    onChange(`${today.getFullYear()}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const handleTomorrow = () => {
    sound.playClick();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setViewYear(tomorrow.getFullYear());
    setViewMonth(tomorrow.getMonth());
    onChange(`${tomorrow.getFullYear()}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const formatDisplay = (val?: string) => {
    if (!val) return '';
    try {
      const d = new Date(val + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isToday = d.toDateString() === today.toDateString();
      if (isToday) return `Today (${d.toLocaleDateString([], { month: 'short', day: 'numeric' })})`;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return val;
    }
  };

  const isTodayDate = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === viewMonth &&
      today.getFullYear() === viewYear
    );
  };

  const isSelectedDate = (day: number) => {
    if (!value) return false;
    const selected = new Date(value + 'T00:00:00');
    return (
      selected.getDate() === day &&
      selected.getMonth() === viewMonth &&
      selected.getFullYear() === viewYear
    );
  };

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-[#4F5D75] dark:text-[#9CA3AF] mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          sound.playClick();
          setIsOpen(!isOpen);
        }}
        className={`w-full bg-white dark:bg-[#1A1F21] text-[#1F2937] dark:text-[#F3F4F6] text-sm rounded-xl border flex items-center justify-between px-3.5 py-2.5 transition-all outline-none shadow-xs cursor-pointer ${
          error
            ? 'border-[#E05656] focus:ring-[#E05656]'
            : isOpen
            ? 'border-[#6BAA7A] ring-2 ring-[#6BAA7A]/20'
            : 'border-[#E5E7EB] dark:border-[#2E373A] hover:border-[#6BAA7A]'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <CalendarIcon className="w-4 h-4 text-[#6BAA7A] shrink-0" />
          <span className={`truncate text-xs ${value ? 'font-medium' : 'text-[#9CA3AF]'}`}>
            {formatDisplay(value) || placeholder}
          </span>
        </div>

        {value ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              onChange('');
            }}
            className="p-1 text-[#9CA3AF] hover:text-[#E05656] rounded-md transition-colors"
            title="Clear date"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        ) : null}
      </button>

      {error && <p className="text-xs text-[#E05656] mt-1">{error}</p>}

      {/* React Portal Popover Calendar - Immune to clipping & overflow */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={popoverRef}
                initial={{ opacity: 0, scale: 0.95, y: coords.openUpwards ? 8 : -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: coords.openUpwards ? 8 : -8 }}
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                style={{
                  position: 'fixed',
                  top: `${coords.top}px`,
                  left: `${coords.left}px`,
                  zIndex: 9999,
                }}
                className="w-72 bg-white dark:bg-[#1A1F21] rounded-2xl shadow-float border border-[#EEF0EC] dark:border-[#2E373A] p-4 select-none"
              >
                {/* Header: Month Year + Arrows */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-serif text-sm font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
                    {monthNames[viewMonth]} {viewYear}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={prevMonth}
                      className="p-1.5 text-[#4F5D75] dark:text-[#9CA3AF] hover:bg-[#F7F8F6] dark:hover:bg-[#252B2E] rounded-lg transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={nextMonth}
                      className="p-1.5 text-[#4F5D75] dark:text-[#9CA3AF] hover:bg-[#F7F8F6] dark:hover:bg-[#252B2E] rounded-lg transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Day of Week Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                  {daysOfWeek.map((day) => (
                    <span key={day} className="text-[11px] font-semibold text-[#9CA3AF] dark:text-[#6B7280]">
                      {day}
                    </span>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {Array.from({ length: firstDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8" />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isSel = isSelectedDate(day);
                    const isTod = isTodayDate(day);

                    return (
                      <button
                        key={`day-${day}`}
                        type="button"
                        onClick={() => handleSelectDay(day)}
                        className={`h-8 w-8 mx-auto rounded-xl text-xs font-medium flex items-center justify-center transition-all cursor-pointer ${
                          isSel
                            ? 'bg-[#6BAA7A] text-white shadow-xs font-bold'
                            : isTod
                            ? 'border border-[#6BAA7A] text-[#6BAA7A] dark:text-[#82C291] font-semibold hover:bg-[#EAF2EC] dark:hover:bg-[#1E2E23]'
                            : 'text-[#1F2937] dark:text-[#E5E7EB] hover:bg-[#F7F8F6] dark:hover:bg-[#252B2E]'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {/* Quick Action Presets */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#EEF0EC] dark:border-[#273033] text-xs">
                  <button
                    type="button"
                    onClick={handleToday}
                    className="text-[#6BAA7A] hover:underline font-semibold cursor-pointer"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={handleTomorrow}
                    className="text-[#7B7FD4] hover:underline font-semibold cursor-pointer"
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onChange('');
                      setIsOpen(false);
                    }}
                    className="text-[#9CA3AF] hover:text-[#E05656] cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';
