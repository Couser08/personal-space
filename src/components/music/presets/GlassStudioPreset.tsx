import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, RotateCcw, RotateCw, Music2, Tv, Sparkles } from 'lucide-react';
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

export const GlassStudioPreset: React.FC<PresetProps> = ({
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
  return (
    <div className="bg-white/80 dark:bg-[#121618]/85 backdrop-blur-2xl text-[#1F2937] dark:text-[#F3F4F6] rounded-3xl p-5 border border-white/50 dark:border-white/10 shadow-2xl space-y-4 select-none relative overflow-hidden">
      {/* Dynamic Aurora Glow */}
      <div className={`absolute -top-10 -right-10 w-40 h-40 bg-[#7B7FD4]/20 dark:bg-[#6BAA7A]/15 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${isPlaying ? 'opacity-100' : 'opacity-30'}`} />

      {/* OLED Header Screen */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#6BAA7A] animate-ping" />
          <span className="font-bold text-[#6BAA7A]">STUDIO DECK</span>
        </div>
        <span className="text-[#6B7280] dark:text-[#9CA3AF]">48kHz • 24-BIT FLAC</span>
      </div>

      {/* Album Artwork & Live Audio Equalizer Frequency Wave */}
      <div className="space-y-3">
        <div className="relative w-full aspect-16/10 rounded-2xl overflow-hidden shadow-lg border border-black/5 dark:border-white/10 bg-[#161B1D]">
          {currentTrack?.thumbnailUrl ? (
            <img src={currentTrack.thumbnailUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#7B7FD4] to-[#6BAA7A] flex items-center justify-center text-white">
              <Music2 className="w-10 h-10 drop-shadow-md" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 pr-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#A8E6CF] font-bold flex items-center gap-1">
                  {isYouTube ? <Tv className="w-3 h-3 text-rose-400" /> : <Sparkles className="w-3 h-3" />}
                  {currentTrack?.artist || 'Studio Master'}
                </span>
                <h4 className="text-sm font-bold text-white truncate drop-shadow-sm">
                  {currentTrack?.title || 'Ambient Chill'}
                </h4>
              </div>

              {/* 16-Bar Animated Live Frequency Waveform */}
              <div className="flex items-end gap-0.5 h-6 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 shrink-0">
                {[8, 16, 22, 12, 20, 10, 18, 24, 14, 19, 11, 23, 15, 9, 17, 7].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: isPlaying ? [3, h * 0.8, 2, h, 4] : 2 }}
                    transition={{ repeat: Infinity, duration: 0.5 + (i % 4) * 0.15, ease: 'easeInOut' }}
                    className="w-1 bg-[#6BAA7A] rounded-full shadow-xs"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cyber Scrubber */}
      <div className="space-y-1">
        <input
          type="range"
          min="0"
          max={duration > 0 ? duration : 100}
          step="0.5"
          value={seekValue}
          onChange={onSeekChange}
          onMouseUp={onSeekCommit}
          onTouchEnd={onSeekCommit}
          className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#6BAA7A]"
        />
        <div className="flex justify-between items-center text-[10px] text-[#6B7280] dark:text-[#9CA3AF] font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{duration > 0 ? formatTime(duration) : '0:00'}</span>
        </div>
      </div>

      {/* Futuristic Floating Controls */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <button onClick={onRewind10} title="Rewind 10s" className="p-2 rounded-xl text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button onClick={() => { sound.playClick(); onPrev(); }} title="Previous" className="p-2 rounded-xl text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={() => { sound.playClick(); onTogglePlay(); }}
          className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6BAA7A] to-[#7B7FD4] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
        </button>
        <button onClick={() => { sound.playClick(); onNext(); }} title="Next" className="p-2 rounded-xl text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
          <SkipForward className="w-4 h-4" />
        </button>
        <button onClick={onForward10} title="Forward 10s" className="p-2 rounded-xl text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Volume & Digital Percentage */}
      <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/10">
        <button onClick={() => { sound.playClick(); onToggleMute(); }} className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white cursor-pointer">
          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={onVolumeChange}
          className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#6BAA7A]"
        />
        <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] font-mono w-8 text-right">{isMuted ? '0%' : `${Math.round(volume * 100)}%`}</span>
      </div>
    </div>
  );
};
