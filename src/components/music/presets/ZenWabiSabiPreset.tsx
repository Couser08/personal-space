import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, RotateCcw, RotateCw, Tv, Leaf } from 'lucide-react';
import type { MusicTrack } from '../../../store/slices/musicSlice';
import { sound } from '../../../lib/sound';

interface PresetProps {
  currentTrack: MusicTrack;
  isPlaying: boolean;
  isYouTube: boolean;
  currentTime: number;
  duration: number;
  seekValue: number;
  volume: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onForward10: () => void;
  onRewind10: () => void;
  onSeekChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSeekCommit: () => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void;
  formatTime: (secs: number) => string;
}

export const ZenWabiSabiPreset: React.FC<PresetProps> = ({
  currentTrack,
  isPlaying,
  isYouTube,
  currentTime,
  duration,
  seekValue,
  volume,
  isMuted,
  onTogglePlay,
  onPrev,
  onNext,
  onForward10,
  onRewind10,
  onSeekChange,
  onSeekCommit,
  onVolumeChange,
  onToggleMute,
  formatTime,
}) => {
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="bg-[#FAFBF9] dark:bg-[#15191B] text-[#1F2937] dark:text-[#F3F4F6] rounded-[32px] p-6 border border-[#E2E6DE] dark:border-[#273235] shadow-xl space-y-4 select-none relative overflow-hidden">
      {/* Zen Header & Volume Trigger */}
      <div className="flex items-center justify-between pb-2 border-b border-[#EEF0EC] dark:border-[#242D30]">
        <div className="flex items-center gap-1.5 text-xs font-serif italic text-[#6BAA7A]">
          <Leaf className="w-3.5 h-3.5" />
          <span>wabi-sabi focus island</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#9CA3AF]">
            {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : '0:00'}
          </span>

          <div className="relative">
            <button
              onClick={() => { sound.playClick(); setShowVolumePopup(!showVolumePopup); }}
              title="Adjust Volume"
              className="p-1.5 rounded-xl border border-[#EEF0EC] dark:border-[#242D30] text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white cursor-pointer"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <AnimatePresence>
              {showVolumePopup && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute right-0 top-8 z-30 bg-white dark:bg-[#1C2224] border border-[#E2E6DE] dark:border-[#273235] p-3 rounded-2xl shadow-xl w-44 space-y-2"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                    <span>Volume</span>
                    <span>{isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}</span>
                  </div>
                  <div className="relative w-full h-2 flex items-center">
                    <div className="w-full h-1.5 bg-[#EEF0EC] dark:bg-[#242D30] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#6BAA7A] rounded-full"
                        style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={onVolumeChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => { sound.playClick(); onToggleMute(); }}
                      className="text-[9px] font-mono text-[#6BAA7A] hover:underline cursor-pointer"
                    >
                      {isMuted ? 'Unmute' : 'Mute'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Orbit Ring Disc with Rotating Center Core */}
      <div className="relative flex flex-col items-center justify-center py-2 space-y-3">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="currentColor"
              strokeWidth="3.5"
              className="text-black/5 dark:text-white/10"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="currentColor"
              strokeWidth="3.5"
              className="text-[#6BAA7A] transition-all duration-300"
              strokeDasharray={276}
              strokeDashoffset={276 - (progressPercent / 100) * 276}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            className="absolute inset-2.5 rounded-full overflow-hidden border border-white/40 shadow-sm bg-[#EAF2EC] dark:bg-[#1E2E23] flex items-center justify-center"
          >
            {currentTrack?.thumbnailUrl ? (
              <img src={currentTrack.thumbnailUrl} alt={currentTrack.title} className="w-full h-full object-cover scale-135" />
            ) : (
              <span className="text-xl">🌿</span>
            )}
            <div className="w-3.5 h-3.5 rounded-full bg-[#FAFBF9] dark:bg-[#15191B] border border-white/60 absolute shadow-2xs" />
          </motion.div>
        </div>

        <div className="text-center space-y-0.5">
          <h4 className="font-serif text-base font-bold text-[#1F2937] dark:text-[#F3F4F6] truncate px-3">
            {currentTrack?.title || 'Zen Meditation'}
          </h4>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] truncate flex items-center justify-center gap-1">
            {isYouTube && <Tv className="w-3 h-3 text-rose-500" />}
            <span>{currentTrack?.artist || 'Nature Soundscape'}</span>
          </p>
        </div>
      </div>

      {/* Themed Organic River Stone Scrubber */}
      <div className="space-y-1.5 pt-1">
        <div className="relative w-full h-3 flex items-center group cursor-pointer">
          <div className="w-full h-1.5 bg-[#EEF0EC] dark:bg-[#242D30] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6BAA7A] to-[#88C496] rounded-full transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Pearl Pill Thumb */}
          <div
            className="absolute w-3 h-3 rounded-full bg-white dark:bg-[#F3F4F6] border-2 border-[#6BAA7A] shadow-xs pointer-events-none -translate-x-1/2 transition-all duration-100"
            style={{ left: `${progressPercent}%` }}
          />

          <input
            type="range"
            min="0"
            max={duration > 0 ? duration : 100}
            step="0.5"
            value={seekValue}
            onChange={onSeekChange}
            onMouseUp={onSeekCommit}
            onTouchEnd={onSeekCommit}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Tactile Micro-Pill Controls */}
      <div className="flex items-center justify-center gap-2.5 pt-1">
        <button onClick={onRewind10} title="Rewind 10s" className="p-2 rounded-xl text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white cursor-pointer">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button onClick={() => { sound.playClick(); onPrev(); }} title="Previous" className="p-2 rounded-xl text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white cursor-pointer">
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={() => { sound.playClick(); onTogglePlay(); }}
          className="w-12 h-12 rounded-full bg-[#6BAA7A] hover:bg-[#558E63] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
        </button>
        <button onClick={() => { sound.playClick(); onNext(); }} title="Next" className="p-2 rounded-xl text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white cursor-pointer">
          <SkipForward className="w-4 h-4" />
        </button>
        <button onClick={onForward10} title="Forward 10s" className="p-2 rounded-xl text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white cursor-pointer">
          <RotateCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
