import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, RotateCcw, RotateCw, Disc, Radio, Tv } from 'lucide-react';
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

export const TurntablePreset: React.FC<PresetProps> = ({
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
    <div className="bg-[#242A27] text-[#FAFBF9] rounded-3xl p-5 border-2 border-[#37443D] shadow-2xl space-y-4 select-none relative overflow-hidden">
      {/* Wood & Turntable Brushed Texture Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#6BAA7A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Deck Info Bar */}
      <div className="flex items-center justify-between border-b border-[#35433B] pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E0A96D] shadow-sm animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest text-[#A8B6AE] uppercase font-bold">
            Hi-Fi Turntable • 33⅓ RPM
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#181D1A] border border-[#37443D] text-[9px] font-mono text-[#6BAA7A]">
          <Radio className="w-2.5 h-2.5 animate-spin" />
          <span>{isPlaying ? 'TURNING' : 'STOPPED'}</span>
        </div>
      </div>

      {/* Turntable Platter with Vinyl & Tonearm */}
      <div className="relative flex items-center justify-center py-2">
        {/* Tonearm graphic indicator */}
        <div className="absolute top-0 right-6 z-20 hidden sm:block pointer-events-none">
          <motion.div
            animate={{ rotate: isPlaying ? 24 : 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="w-1.5 h-18 bg-gradient-to-b from-[#C4A97D] to-[#8C7653] origin-top rounded-full shadow-md relative"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-[#E0A96D] -top-1 -left-1 absolute border border-white/40" />
            <div className="w-2 h-3 bg-[#E05656] -bottom-2 -left-0.5 absolute rounded-xs" />
          </motion.div>
        </div>

        {/* Vinyl Disc */}
        <div className="relative">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
            className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-[#0D100E] via-[#1A211D] to-[#0D100E] border-4 border-[#2D3832] shadow-2xl relative flex items-center justify-center"
          >
            {/* Concentric Vinyl Grooves */}
            <div className="absolute inset-2 rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute inset-6 rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute inset-8 rounded-full border border-white/5 pointer-events-none" />

            {/* Center Label */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-[#C4A97D] shadow-inner relative z-10 overflow-hidden flex items-center justify-center bg-[#1F2622]">
              {currentTrack?.thumbnailUrl ? (
                <img src={currentTrack.thumbnailUrl} alt={currentTrack.title} className="w-full h-full object-cover scale-135" />
              ) : (
                <div className="w-full h-full bg-[#6BAA7A] flex items-center justify-center text-white font-serif font-bold text-xs">
                  <Disc className="w-6 h-6" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-black/40 pointer-events-none" />
              <div className="w-3 h-3 rounded-full bg-[#0D100E] border border-[#E0A96D] absolute shadow-sm" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Track Details */}
      <div className="text-center space-y-0.5">
        <h4 className="text-sm font-bold text-[#FAFBF9] truncate px-2 font-serif tracking-wide">
          {currentTrack?.title || 'Ambient Focus'}
        </h4>
        <p className="text-xs text-[#6BAA7A] font-medium truncate flex items-center justify-center gap-1">
          {isYouTube && <Tv className="w-3 h-3 text-rose-400" />}
          <span>{currentTrack?.artist || 'Vinyl Master'}</span>
        </p>
      </div>

      {/* Turntable Analog Scrubber */}
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
          className="w-full h-1.5 bg-[#171C19] rounded-lg appearance-none cursor-pointer accent-[#6BAA7A]"
        />
        <div className="flex justify-between items-center text-[10px] text-[#A8B6AE] font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{duration > 0 ? formatTime(duration) : '0:00'}</span>
        </div>
      </div>

      {/* Vintage Turntable Controls */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <button onClick={onRewind10} title="Rewind 10s" className="p-2 rounded-xl text-[#A8B6AE] hover:text-white hover:bg-white/5 cursor-pointer">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button onClick={() => { sound.playClick(); onPrev(); }} title="Previous" className="p-2 rounded-xl text-[#A8B6AE] hover:text-white hover:bg-white/5 cursor-pointer">
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={() => { sound.playClick(); onTogglePlay(); }}
          className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6BAA7A] to-[#80C28F] text-[#0F1411] flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all font-bold"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
        </button>
        <button onClick={() => { sound.playClick(); onNext(); }} title="Next" className="p-2 rounded-xl text-[#A8B6AE] hover:text-white hover:bg-white/5 cursor-pointer">
          <SkipForward className="w-4 h-4" />
        </button>
        <button onClick={onForward10} title="Forward 10s" className="p-2 rounded-xl text-[#A8B6AE] hover:text-white hover:bg-white/5 cursor-pointer">
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Volume & Level Meter */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#35433B]">
        <button onClick={() => { sound.playClick(); onToggleMute(); }} className="text-[#A8B6AE] hover:text-white cursor-pointer">
          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={onVolumeChange}
          className="w-full h-1 bg-[#171C19] rounded-lg appearance-none cursor-pointer accent-[#6BAA7A]"
        />
        <span className="text-[10px] text-[#A8B6AE] font-mono w-8 text-right">{isMuted ? '0%' : `${Math.round(volume * 100)}%`}</span>
      </div>
    </div>
  );
};
