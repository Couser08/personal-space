import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  startTimer,
  pauseTimer,
  tickTimer,
  resetTimer,
  completeSession,
} from '../../store/slices/focusSlice';
import { sound } from '../../lib/sound';

export const FocusTimerCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { timeLeftSeconds, isRunning } = useAppSelector((state) => state.focus);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        dispatch(tickTimer());
      }, 1000);
    } else if (isRunning && timeLeftSeconds === 0) {
      sound.playTimerBell();
      dispatch(completeSession());
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeftSeconds, dispatch]);

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const toggleRun = () => {
    if (isRunning) {
      dispatch(pauseTimer());
    } else {
      dispatch(startTimer());
    }
  };

  return (
    <Card variant="simple" className="p-6 flex flex-col justify-between relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
            Focus Timer
          </h3>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
            Stay focused. Get things done.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between my-3">
        {/* Large Digital Clock */}
        <div>
          <span className="font-serif text-4xl sm:text-5xl font-bold text-[#1F2937] dark:text-white tracking-tight">
            {formattedTime}
          </span>
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleRun}
              leftIcon={isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              className="px-5 py-2 font-medium"
            >
              {isRunning ? 'Pause' : 'Start Focus'}
            </Button>
            {timeLeftSeconds < 25 * 60 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch(resetTimer())}
                title="Reset Timer"
                className="p-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Cute Desk & Plant Illustration Graphic */}
        <div className="hidden sm:block shrink-0 relative">
          <svg viewBox="0 0 140 100" className="w-32 h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Table Surface */}
            <line x1="10" y1="85" x2="130" y2="85" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
            
            {/* Potted Plant */}
            <path d="M25 65 L40 65 L37 85 L28 85 Z" fill="#F2E8D5" stroke="#D6C4A3" strokeWidth="1" />
            <path d="M32 65 C32 45 20 40 18 50 C24 50 32 55 32 65 Z" fill="#6BAA7A" />
            <path d="M33 65 C33 40 45 35 48 45 C42 48 33 55 33 65 Z" fill="#78B687" />
            <circle cx="32" cy="48" r="4" fill="#88C496" />

            {/* Desk Clock */}
            <circle cx="75" cy="62" r="18" fill="#FAFBFC" stroke="#9CA3AF" strokeWidth="1.5" />
            <circle cx="75" cy="62" r="15" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="75" y1="62" x2="75" y2="52" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="75" y1="62" x2="82" y2="62" stroke="#6BAA7A" strokeWidth="1.5" strokeLinecap="round" />
            {/* Clock Legs */}
            <line x1="64" y1="76" x2="60" y2="84" stroke="#4F5D75" strokeWidth="2" strokeLinecap="round" />
            <line x1="86" y1="76" x2="90" y2="84" stroke="#4F5D75" strokeWidth="2" strokeLinecap="round" />

            {/* Notebook & Pen */}
            <rect x="100" y="70" width="25" height="15" rx="2" fill="#ECEEFB" stroke="#C7C9F5" strokeWidth="1" transform="rotate(-5 100 70)" />
            <line x1="104" y1="74" x2="120" y2="72" stroke="#9DA1EE" strokeWidth="1" />
            <line x1="104" y1="78" x2="118" y2="76" stroke="#9DA1EE" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </Card>
  );
};
