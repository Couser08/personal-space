import React from 'react';
import { motion } from 'framer-motion';
import { Edit3 } from 'lucide-react';
import { Card } from '../ui/Card';
import { useAppDispatch, useAppSelector } from '../../store';
import { logMood } from '../../store/slices/moodSlice';
import { openMoodModal } from '../../store/slices/uiSlice';
import type { MoodLevel } from '../../types/mood.types';
import { sound } from '../../lib/sound';

interface MoodOption {
  level: MoodLevel;
  label: string;
  emoji: string;
  activeBg: string;
  activeText: string;
}

export const MoodPreviewCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const todayMood = useAppSelector((state) => state.mood.todayMood);

  const moodOptions: MoodOption[] = [
    { level: 'great', label: 'Great', emoji: '😄', activeBg: 'bg-[#EAF2EC] dark:bg-[#1E2E23] ring-2 ring-[#6BAA7A]', activeText: 'text-[#3D6B47] dark:text-[#A7CFAF]' },
    { level: 'good', label: 'Good', emoji: '🙂', activeBg: 'bg-[#ECEEFB] dark:bg-[#20233B] ring-2 ring-[#7B7FD4]', activeText: 'text-[#4A4E9E] dark:text-[#C7C9F5]' },
    { level: 'okay', label: 'Okay', emoji: '😐', activeBg: 'bg-[#FAF5EB] dark:bg-[#2C271E] ring-2 ring-[#C4A97D]', activeText: 'text-[#7A5B2E] dark:text-[#E4D3B4]' },
    { level: 'not_great', label: 'Not great', emoji: '🙁', activeBg: 'bg-[#F1F3F6] dark:bg-[#22282C] ring-2 ring-[#97A4BA]', activeText: 'text-[#4F5D75] dark:text-[#CBD2DC]' },
    { level: 'bad', label: 'Bad', emoji: '😣', activeBg: 'bg-[#FDE8E8] dark:bg-[#361A1A] ring-2 ring-[#E05656]', activeText: 'text-[#9B2C2C] dark:text-[#F8B4B4]' },
  ];

  const handleSelectMood = (level: MoodLevel) => {
    sound.playClick();
    dispatch(logMood({ mood: level }));
  };

  const handleAddNote = () => {
    sound.playClick();
    dispatch(openMoodModal());
  };

  return (
    <Card variant="simple" className="p-6 flex flex-col justify-between h-full">
      <div>
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
            Mood Today
          </h3>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
            How are you feeling?
          </p>
        </div>

        {/* 5 Emojis Row */}
        <div className="grid grid-cols-5 gap-1.5 pt-1 pb-3">
          {moodOptions.map((opt) => {
            const isSelected = todayMood === opt.level;
            return (
              <motion.button
                key={opt.level}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleSelectMood(opt.level)}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all cursor-pointer ${
                  isSelected
                    ? opt.activeBg
                    : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-75 hover:opacity-100'
                }`}
              >
                <span className="text-2xl mb-1 select-none">{opt.emoji}</span>
                <span
                  className={`text-[10px] font-medium leading-none ${
                    isSelected
                      ? `${opt.activeText} font-semibold`
                      : 'text-[#6B7280] dark:text-[#9CA3AF]'
                  }`}
                >
                  {opt.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Add Mood Note Button */}
      <button
        onClick={handleAddNote}
        className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#ECEEFB] dark:bg-[#20233B] hover:bg-[#DCE0F9] dark:hover:bg-[#272B4B] text-[#4A4E9E] dark:text-[#C7C9F5] text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.99]"
      >
        <Edit3 className="w-3.5 h-3.5" />
        <span>Add Mood Note</span>
      </button>
    </Card>
  );
};
