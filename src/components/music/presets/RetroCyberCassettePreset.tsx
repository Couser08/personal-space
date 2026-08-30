import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, RotateCcw, RotateCw, Tv, Radio } from 'lucide-react';
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

export const RetroCyberCassettePreset: React.FC<PresetProps> = ({
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
    <div className="bg-[#0D1217] text-[#D0E2EC] rounded-[28px] p-5 border-2 border-[#1E2E38] shadow-[0_20px_50px_rgba(0,255,200,0.1)] space-y-4 select-none relative overflow-hidden font-sans">
      {/* Cyan Neon Glow */}
      <div className={`absolute top-0 right-0 w-36 h-36 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-20'}`} />

      {/* Cassette Header Bar & Volume Trigger */}
      <div className="flex items-center justify-between border-b border-[#1E2E38] pb-2 px-1 text-[10px] font-mono">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold tracking-widest uppercase">
          <Radio className="w-3 h-3" />
          <span>CYBER CASSETTE • TYPE-IV</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#6C879B]">SIDE A</span>

          <div className="relative">
            <button
              onClick={() => { sound.playClick(); setShowVolumePopup(!showVolumePopup); }}
              title="Adjust Volume"
              className="p-1.5 rounded-lg bg-[#162028] border border-cyan-500/30 text-cyan-400 hover:text-white cursor-pointer"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <AnimatePresence>
              {showVolumePopup && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute right-0 top-8 z-30 bg-[#0E151B] border border-cyan-500/40 p-3 rounded-2xl shadow-xl w-44 space-y-2 font-mono text-cyan-400"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span>CYBER VOL</span>
                    <span>{isMuted ? 'MUTE' : `${Math.round(volume * 100)}%`}</span>
                  </div>
                  <div className="relative w-full h-2 flex items-center">
                    <div className="w-full h-1.5 bg-[#06090C] rounded-full overflow-hidden border border-cyan-500/30">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
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
                      className="text-[9px] text-cyan-300 hover:underline cursor-pointer uppercase"
                    >
                      {isMuted ? 'UNMUTE' : 'MUTE'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Cassette Tape Shell */}
      <div className="relative p-3.5 rounded-2xl bg-[#131B22]/90 border border-cyan-500/30 shadow-inner space-y-3">
        <div className="flex items-center justify-between bg-gradient-to-r from-cyan-900/40 via-emerald-900/30 to-purple-900/40 px-3 py-1.5 rounded-lg border border-cyan-500/20">
          <div className="min-w-0 flex-1 pr-2">
            <span className="text-[9px] font-mono text-cyan-400 block tracking-wider uppercase font-bold">
              {isYouTube ? 'YOUTUBE STREAM' : 'TAPE AUDIO'}
            </span>
            <h4 className="text-xs font-bold text-white truncate font-mono">
              {currentTrack?.title || 'CYBER CHILL 2026'}
            </h4>
          </div>
          <span className="font-mono text-[10px] text-cyan-300 font-bold shrink-0">
            {formatTime(currentTime)}
          </span>
        </div>

        {/* Dual Spools */}
        <div className="relative h-20 bg-[#0A0E12] rounded-xl border border-[#1E2E38] flex items-center justify-between px-6 overflow-hidden">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            className="w-12 h-12 rounded-full border-4 border-cyan-500/40 bg-[#162028] flex items-center justify-center relative shadow-[0_0_10px_rgba(6,182,212,0.3)]"
          >
            <div className="w-4 h-4 rounded-full bg-[#0D1217] border border-cyan-400" />
            <div className="w-1 h-3 bg-cyan-400 absolute top-1" />
            <div className="w-1 h-3 bg-cyan-400 absolute bottom-1" />
            <div className="w-3 h-1 bg-cyan-400 absolute left-1" />
            <div className="w-3 h-1 bg-cyan-400 absolute right-1" />
          </motion.div>

          <div className="w-20 h-14 rounded-lg overflow-hidden border border-cyan-500/30 bg-[#10171D] relative flex items-center justify-center shadow-inner">
            {currentTrack?.thumbnailUrl ? (
              <img src={currentTrack.thumbnailUrl} alt={currentTrack.title} className="w-full h-full object-cover opacity-85" />
            ) : (
              <div className="text-center font-mono text-[8px] text-cyan-400">
                <span>DIGITAL</span>
                <span className="block font-bold">TAPE</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/60 to-transparent pointer-events-none" />
          </div>

          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            className="w-12 h-12 rounded-full border-4 border-cyan-500/40 bg-[#162028] flex items-center justify-center relative shadow-[0_0_10px_rgba(6,182,212,0.3)]"
          >
            <div className="w-4 h-4 rounded-full bg-[#0D1217] border border-cyan-400" />
            <div className="w-1 h-3 bg-cyan-400 absolute top-1" />
            <div className="w-1 h-3 bg-cyan-400 absolute bottom-1" />
            <div className="w-3 h-1 bg-cyan-400 absolute left-1" />
            <div className="w-3 h-1 bg-cyan-400 absolute right-1" />
          </motion.div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-[#6C879B] px-1">
          <span className="truncate max-w-[180px] flex items-center gap-1">
            {isYouTube && <Tv className="w-3 h-3 text-rose-400" />}
            {currentTrack?.artist || 'NEO TOKYO FM'}
          </span>
          <span className="text-cyan-400 font-bold">{duration > 0 ? formatTime(duration) : '0:00'}</span>
        </div>
      </div>

      {/* Themed Cyan Neon Laser Scrubber */}
      <div className="space-y-1.5 pt-1">
        <div className="relative w-full h-3 flex items-center group cursor-pointer">
          {/* Smoked Acrylic Channel */}
          <div className="w-full h-1.5 bg-[#090D10] rounded-full overflow-hidden border border-cyan-500/30 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-300 rounded-full transition-all duration-100 shadow-[0_0_10px_#22D3EE]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Cyan Neon Reticle Thumb */}
          <div
            className="absolute w-3 h-3 rounded-full bg-cyan-400 border-2 border-[#0D1217] shadow-[0_0_8px_#22D3EE] pointer-events-none -translate-x-1/2 transition-all duration-100"
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

      {/* Push Keys */}
      <div className="grid grid-cols-5 gap-2 pt-1">
        <button onClick={onRewind10} className="p-3 rounded-xl bg-[#162028] hover:bg-[#1E2D38] border border-cyan-500/30 text-cyan-300 flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button onClick={() => { sound.playClick(); onPrev(); }} className="p-3 rounded-xl bg-[#162028] hover:bg-[#1E2D38] border border-cyan-500/30 text-cyan-300 flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={() => { sound.playClick(); onTogglePlay(); }}
          className={`p-3 rounded-xl border border-cyan-400 flex items-center justify-center font-bold active:scale-95 transition-all cursor-pointer ${
            isPlaying ? 'bg-cyan-400 text-black shadow-[0_0_15px_#22D3EE]' : 'bg-[#162028] text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.3)]'
          }`}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
        </button>
        <button onClick={() => { sound.playClick(); onNext(); }} className="p-3 rounded-xl bg-[#162028] hover:bg-[#1E2D38] border border-cyan-500/30 text-cyan-300 flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
          <SkipForward className="w-4 h-4" />
        </button>
        <button onClick={onForward10} className="p-3 rounded-xl bg-[#162028] hover:bg-[#1E2D38] border border-cyan-500/30 text-cyan-300 flex items-center justify-center cursor-pointer shadow-xs active:scale-95">
          <RotateCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
