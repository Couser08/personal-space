import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, RotateCcw, RotateCw, Tv, Sparkles, Music2 } from 'lucide-react';
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

export const AuroraGlassPreset: React.FC<PresetProps> = ({
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
    <div className="relative rounded-[32px] overflow-hidden p-6 select-none bg-gradient-to-b from-white/85 via-white/60 to-white/95 dark:from-[#181E20]/90 dark:via-[#121618]/80 dark:to-[#0F1214]/95 backdrop-blur-3xl border border-white/60 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-5">
      {/* Ambient Fluid Aurora Glow */}
      <div className="absolute -top-16 -left-16 w-56 h-56 bg-emerald-400/25 dark:bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none transition-all duration-1000 animate-pulse" />
      <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-indigo-400/25 dark:bg-purple-500/20 rounded-full blur-[80px] pointer-events-none transition-all duration-1000" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 dark:to-white/5 pointer-events-none rounded-[32px]" />

      {/* Floating Squircle Album Artwork with Specular Sheen & Volume Popover Trigger */}
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={isPlaying ? { y: [-2, 2, -2], rotate: [-0.5, 0.5, -0.5] } : { y: 0, rotate: 0 }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-[28px] p-1.5 bg-gradient-to-br from-white/60 via-white/20 to-black/10 dark:from-white/20 dark:to-white/5 shadow-2xl backdrop-blur-md"
        >
          <div className="w-full h-full rounded-[22px] overflow-hidden relative shadow-inner bg-[#161B1D]">
            {currentTrack?.thumbnailUrl ? (
              <img
                src={currentTrack.thumbnailUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[#6BAA7A] via-[#5F9E6F] to-[#7B7FD4] flex items-center justify-center text-white">
                <Music2 className="w-12 h-12 drop-shadow-lg" />
              </div>
            )}

            {/* Specular sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/25 via-transparent to-black/30 pointer-events-none" />

            {/* Top Live Badge & Volume Trigger */}
            <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
              <div className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center gap-1.5 text-[10px] font-medium text-white shadow-xs">
                <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-white/50'}`} />
                <span>{isPlaying ? 'Live Aura' : 'Paused'}</span>
              </div>

              {/* Volume Popover Trigger */}
              <div className="relative">
                <button
                  onClick={() => { sound.playClick(); setShowVolumePopup(!showVolumePopup); }}
                  title="Adjust Volume"
                  className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center cursor-pointer shadow-xs hover:bg-black/60"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                <AnimatePresence>
                  {showVolumePopup && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 5 }}
                      className="absolute right-0 top-8 z-30 bg-black/80 dark:bg-black/90 backdrop-blur-xl border border-white/20 p-3 rounded-2xl shadow-2xl w-44 space-y-2 text-white"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-white/80">
                        <span>Volume</span>
                        <span>{isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={onVolumeChange}
                        className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#6BAA7A]"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={() => { sound.playClick(); onToggleMute(); }}
                          className="text-[9px] font-mono text-[#88D49E] hover:underline cursor-pointer"
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
        </motion.div>
      </div>

      {/* Track Details */}
      <div className="text-center space-y-1 relative z-10">
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#6BAA7A] dark:text-[#88D49E] tracking-wide uppercase">
          {isYouTube ? <Tv className="w-3 h-3 text-rose-500" /> : <Sparkles className="w-3 h-3" />}
          <span>{currentTrack?.artist || 'Botanical Space'}</span>
        </div>
        <h3 className="font-serif text-lg font-bold text-[#1F2937] dark:text-[#F3F4F6] truncate px-3 leading-tight tracking-tight">
          {currentTrack?.title || 'Ambient Garden Flow'}
        </h3>
      </div>

      {/* Dynamic Sound Waveform Bars */}
      <div className="flex items-center justify-center gap-1 h-7 px-2">
        {[10, 18, 26, 14, 22, 12, 28, 16, 24, 15, 20, 11, 25, 17, 9, 21, 13, 27, 19, 8].map((h, i) => (
          <motion.div
            key={i}
            animate={{
              height: isPlaying ? [4, h * 0.9, 3, h, 5] : 3,
              backgroundColor: isPlaying
                ? ['#6BAA7A', '#88D49E', '#7B7FD4', '#6BAA7A'][i % 4]
                : '#9CA3AF',
            }}
            transition={{
              repeat: Infinity,
              duration: 0.7 + (i % 5) * 0.15,
              ease: 'easeInOut',
            }}
            className="w-1 rounded-full opacity-80 shadow-xs"
          />
        ))}
      </div>

      {/* Glass Scrubber */}
      <div className="space-y-1.5 relative z-10">
        <div className="relative w-full h-2 flex items-center group">
          <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden backdrop-blur-xs">
            <div
              className="h-full bg-gradient-to-r from-[#6BAA7A] to-[#7B7FD4] rounded-full transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
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
        <div className="flex justify-between items-center text-[10px] font-mono text-[#6B7280] dark:text-[#9CA3AF]">
          <span>{formatTime(currentTime)}</span>
          <span>{duration > 0 ? formatTime(duration) : '0:00'}</span>
        </div>
      </div>

      {/* Floating Glass Controls */}
      <div className="flex items-center justify-center gap-3 pt-1 relative z-10">
        <button
          onClick={onRewind10}
          title="Rewind 10s"
          className="p-2.5 rounded-full bg-white/60 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 text-[#4F5D75] dark:text-[#CBD2DC] hover:text-[#1F2937] dark:hover:text-white border border-white/40 dark:border-white/10 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => { sound.playClick(); onPrev(); }}
          title="Previous"
          className="p-2.5 rounded-full bg-white/60 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 text-[#4F5D75] dark:text-[#CBD2DC] hover:text-[#1F2937] dark:hover:text-white border border-white/40 dark:border-white/10 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={() => { sound.playClick(); onTogglePlay(); }}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#6BAA7A] via-[#74B584] to-[#7B7FD4] text-white flex items-center justify-center shadow-[0_10px_25px_rgba(107,170,122,0.4)] hover:shadow-[0_12px_30px_rgba(107,170,122,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 ml-0.5 fill-current" />}
        </button>

        <button
          onClick={() => { sound.playClick(); onNext(); }}
          title="Next"
          className="p-2.5 rounded-full bg-white/60 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 text-[#4F5D75] dark:text-[#CBD2DC] hover:text-[#1F2937] dark:hover:text-white border border-white/40 dark:border-white/10 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <button
          onClick={onForward10}
          title="Forward 10s"
          className="p-2.5 rounded-full bg-white/60 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 text-[#4F5D75] dark:text-[#CBD2DC] hover:text-[#1F2937] dark:hover:text-white border border-white/40 dark:border-white/10 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
