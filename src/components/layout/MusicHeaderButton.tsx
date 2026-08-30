import React from 'react';
import { Music } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { togglePlayerOpen } from '../../store/slices/musicSlice';
import { sound } from '../../lib/sound';

export const MusicHeaderButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const isPlaying = useAppSelector((state) => state.music.isPlaying);
  const isPlayerOpen = useAppSelector((state) => state.music.isPlayerOpen);

  const handleClick = () => {
    sound.playClick();
    dispatch(togglePlayerOpen());
  };

  return (
    <button
      onClick={handleClick}
      title={isPlaying ? 'Ambient Music Playing (Click to view)' : 'Open Ambient Music Player'}
      className={`relative w-9 h-9 rounded-xl border flex items-center justify-center shadow-2xs cursor-pointer transition-all hover:scale-105 active:scale-95 ${
        isPlaying || isPlayerOpen
          ? 'bg-[#EAF2EC] dark:bg-[#1E2E23] border-[#6BAA7A] text-[#6BAA7A]'
          : 'bg-white dark:bg-[#1A1F21] border-[#EEF0EC] dark:border-[#273033] text-[#4F5D75] dark:text-[#CBD2DC] hover:text-[#1F2937] dark:hover:text-white'
      }`}
    >
      <Music className="w-4 h-4" />

      {/* Live Animated Audio Waves */}
      {isPlaying && (
        <span className="absolute -top-1 -right-1 flex items-end gap-0.5 h-3 px-1 rounded-full bg-[#6BAA7A] text-white ring-2 ring-white dark:ring-[#1A1F21] py-0.5">
          <span className="w-0.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-0.5 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-0.5 h-1.5 bg-white rounded-full animate-bounce" />
        </span>
      )}
    </button>
  );
};
