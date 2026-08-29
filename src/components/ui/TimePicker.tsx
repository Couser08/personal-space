import React, { useState, useRef, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X } from 'lucide-react';
import { sound } from '../../lib/sound';

export interface TimePickerProps {
  label?: string;
  value?: string; // Format: HH:mm (24h or display)
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

export const TimePicker: React.FC<TimePickerProps> = memo(({
  label,
  value,
  onChange,
  placeholder = 'Select time...',
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

  const presets = [
    { label: '09:00 AM', value: '09:00', desc: 'Morning' },
    { label: '11:00 AM', value: '11:00', desc: 'Late Morning' },
    { label: '02:00 PM', value: '14:00', desc: 'Afternoon' },
    { label: '06:00 PM', value: '18:00', desc: 'Evening' },
    { label: '09:00 PM', value: '21:00', desc: 'Night' },
  ];

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = ['00', '15', '30', '45'];

  const parseTime = (val?: string) => {
    if (!val) return { hour: 9, minute: '00', period: 'AM' };
    const [hStr, mStr] = val.split(':');
    let h = parseInt(hStr, 10) || 9;
    const m = mStr || '00';
    const p = h >= 12 ? 'PM' : 'AM';
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return { hour: h, minute: m, period: p };
  };

  const currentParsed = parseTime(value);
  const [selectedHour, setSelectedHour] = useState(currentParsed.hour);
  const [selectedMinute, setSelectedMinute] = useState(currentParsed.minute);
  const [selectedPeriod, setSelectedPeriod] = useState(currentParsed.period);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverHeight = 310;
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

  const applyCustomTime = (h: number, m: string, p: string) => {
    sound.playClick();
    let hour24 = h;
    if (p === 'PM' && h < 12) hour24 += 12;
    if (p === 'AM' && h === 12) hour24 = 0;
    const timeStr = `${String(hour24).padStart(2, '0')}:${m}`;
    onChange(timeStr);
  };

  const handleSelectPreset = (val: string) => {
    sound.playClick();
    onChange(val);
    setIsOpen(false);
  };

  const formatDisplay = (val?: string) => {
    if (!val) return '';
    const { hour, minute, period } = parseTime(val);
    return `${hour}:${minute} ${period}`;
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
            ? 'border-[#7B7FD4] ring-2 ring-[#7B7FD4]/20'
            : 'border-[#E5E7EB] dark:border-[#2E373A] hover:border-[#7B7FD4]'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Clock className="w-4 h-4 text-[#7B7FD4] shrink-0" />
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
            title="Clear time"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        ) : null}
      </button>

      {error && <p className="text-xs text-[#E05656] mt-1">{error}</p>}

      {/* React Portal Popover Time Selector - Immune to clipping & overflow */}
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
                {/* Quick Presets */}
                <div className="mb-3">
                  <span className="block text-[11px] font-semibold text-[#9CA3AF] dark:text-[#6B7280] mb-2 uppercase tracking-wider">
                    Quick Presets
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {presets.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => handleSelectPreset(p.value)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-left bg-[#FAFBF9] dark:bg-[#202528] hover:bg-[#ECEEFB] dark:hover:bg-[#20233B] hover:text-[#7B7FD4] border border-[#EEF0EC] dark:border-[#2E373A] transition-all cursor-pointer"
                      >
                        <span className="block text-[#1F2937] dark:text-[#F3F4F6]">{p.label}</span>
                        <span className="text-[10px] text-[#9CA3AF]">{p.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Stepper */}
                <div className="pt-3 border-t border-[#EEF0EC] dark:border-[#273033]">
                  <span className="block text-[11px] font-semibold text-[#9CA3AF] dark:text-[#6B7280] mb-2 uppercase tracking-wider">
                    Custom Time
                  </span>

                  {/* Hours Grid */}
                  <div className="grid grid-cols-6 gap-1 mb-2">
                    {hours.map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => {
                          setSelectedHour(h);
                          applyCustomTime(h, selectedMinute, selectedPeriod);
                        }}
                        className={`py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                          selectedHour === h
                            ? 'bg-[#7B7FD4] text-white font-bold shadow-xs'
                            : 'text-[#1F2937] dark:text-[#E5E7EB] hover:bg-[#F7F8F6] dark:hover:bg-[#252B2E]'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>

                  {/* Minutes + AM/PM */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex gap-1">
                      {minutes.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            setSelectedMinute(m);
                            applyCustomTime(selectedHour, m, selectedPeriod);
                          }}
                          className={`px-2 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                            selectedMinute === m
                              ? 'bg-[#6BAA7A] text-white font-bold shadow-xs'
                              : 'bg-[#FAFBF9] dark:bg-[#202528] text-[#1F2937] dark:text-[#E5E7EB] hover:bg-[#EAF2EC]'
                          }`}
                        >
                          :{m}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-1 bg-[#FAFBF9] dark:bg-[#202528] p-0.5 rounded-lg border border-[#EEF0EC] dark:border-[#2E373A]">
                      {['AM', 'PM'].map((period) => (
                        <button
                          key={period}
                          type="button"
                          onClick={() => {
                            setSelectedPeriod(period);
                            applyCustomTime(selectedHour, selectedMinute, period);
                          }}
                          className={`px-2 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                            selectedPeriod === period
                              ? 'bg-[#1F2937] dark:bg-white text-white dark:text-[#1F2937] shadow-2xs'
                              : 'text-[#6B7280] hover:text-[#1F2937]'
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Set Time Button */}
                <div className="pt-3 mt-3 border-t border-[#EEF0EC] dark:border-[#273033] flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-[#6BAA7A] text-white font-medium hover:bg-[#558E63] cursor-pointer"
                  >
                    Set Time
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

TimePicker.displayName = 'TimePicker';
