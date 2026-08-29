import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeMoodModal } from '../../store/slices/uiSlice';
import { logMood } from '../../store/slices/moodSlice';
import type { MoodLevel } from '../../types/mood.types';

export const MoodNoteModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isMoodModalOpen);
  const currentMood = useAppSelector((state) => state.mood.todayMood);

  const [selectedMood, setSelectedMood] = useState<MoodLevel>(currentMood || 'good');
  const [reflectionText, setReflectionText] = useState('');

  const moodOptions: { level: MoodLevel; label: string; emoji: string }[] = [
    { level: 'great', label: 'Great', emoji: '😄' },
    { level: 'good', label: 'Good', emoji: '🙂' },
    { level: 'okay', label: 'Okay', emoji: '😐' },
    { level: 'not_great', label: 'Not great', emoji: '🙁' },
    { level: 'bad', label: 'Bad', emoji: '😣' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      logMood({
        mood: selectedMood,
        note: reflectionText.trim(),
      })
    );
    setReflectionText('');
    dispatch(closeMoodModal());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeMoodModal())}
      title="Daily Mood & Mindful Reflection"
      subtitle="How is your mind feeling right now? Take a pause to check in with yourself."
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#4F5D75] dark:text-[#9CA3AF] mb-2">
            Select Your Feeling
          </label>
          <div className="grid grid-cols-5 gap-2">
            {moodOptions.map((opt) => (
              <button
                key={opt.level}
                type="button"
                onClick={() => setSelectedMood(opt.level)}
                className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  selectedMood === opt.level
                    ? 'bg-[#ECEEFB] dark:bg-[#20233B] ring-2 ring-[#7B7FD4] scale-105'
                    : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-70'
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-[10px] font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#4F5D75] dark:text-[#9CA3AF] mb-1.5">
            Reflection or Gratitude Note (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="What's on your mind today? What made you smile or challenged you?"
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            className="w-full bg-white dark:bg-[#1A1F21] text-[#1F2937] dark:text-[#F3F4F6] placeholder-[#9CA3AF] text-sm rounded-xl border border-[#E5E7EB] dark:border-[#2E373A] focus:border-[#6BAA7A] focus:ring-2 focus:ring-[#6BAA7A]/20 p-3 outline-none transition-all resize-none shadow-xs"
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-[#EEF0EC] dark:border-[#273033]">
          <Button
            type="button"
            variant="outline"
            onClick={() => dispatch(closeMoodModal())}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Reflection
          </Button>
        </div>
      </form>
    </Modal>
  );
};
