import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, RotateCcw, RotateCw, Tv, Disc, Sliders } from 'lucide-react';
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

export const IndustrialHifiPreset: React.FC<PresetProps> = ({
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
    <div className="bg-[#2B2F33] dark:bg-[#191D20] text-[#E8ECE9] rounded-[28px] p-5 border-2 border-[#3E454B] dark:border-[#2C3338] shadow-[0_20px_40px_rgba(0,0,0,0.4)] space-y-4 select-none relative font-sans">
      {/* Industrial Screws */}
      <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-[#525B62] border border-black/40 flex items-center justify-center text-[7px] text-black">✕</div>
      <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#525B62] border border-black/40 flex items-center justify-center text-[7px] text-black">✕</div>
      <div className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-[#525B62] border border-black/40 flex items-center justify-center text-[7px] text-black">✕</div>
      <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-[#525B62] border border-black/40 flex items-center justify-center text-[7px] text-black">✕</div>

      {/* Top Header Bar & Volume Trigger */}
      <div className="flex items-center justify-between border-b border-[#3E454B] dark:border-[#2C3338] pb-2.5 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF7043] shadow-[0_0_8px_#FF7043]" />
          <span className="font-mono text-[10px] tracking-widest text-[#FF7043] font-bold uppercase">
            OB-4 SYNTH • HIFI
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-[#8C98A4] tracking-wider">REV-2026.08</span>

          <div className="relative">
            <button
              onClick={() => { sound.playClick(); setShowVolumePopup(!showVolumePopup); }}
              title="Adjust Volume"
              className="p-1.5 rounded-lg bg-[#1D2226] border border-[#3E454B] text-[#FF7043] hover:text-white cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            <AnimatePresence>
              {showVolumePopup && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute right-0 top-8 z-30 bg-[#15191C] border border-[#3E454B] p-3 rounded-2xl shadow-xl w-44 space-y-2 font-mono text-white"
                >
                  <div className="flex items-center justify-between text-[10px] text-[#FFB74D]">
                    <span>GAIN / VOL</span>
                    <span>{isMuted ? 'MUTE' : `${Math.round(volume * 100)}%`}</span>
                  </div>
                  <div className="relative w-full h-2 flex items-center">
                    <div className="w-full h-1.5 bg-[#0D1012] rounded-full overflow-hidden border border-[#3E454B]">
                      <div
                        className="h-full bg-[#FF7043] rounded-full"
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
                      className="text-[9px] text-[#FF7043] hover:underline cursor-pointer uppercase"
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

      {/* Phosphor Amber OLED Display Panel */}
      <div className="bg-[#101416] p-3 rounded-2xl border border-[#3E454B] shadow-inner space-y-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

        <div className="flex items-center justify-between font-mono text-[10px] text-[#FFB74D]">
          <span className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#4CAF50]' : 'bg-[#FF7043]'}`} />
            {isPlaying ? 'TAPE RUNNING' : 'STANDBY'}
          </span>
          <span>{formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : '0:00'}</span>
        </div>

        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="w-12 h-12 rounded-full border-2 border-[#FFB74D]/60 bg-[#192024] flex items-center justify-center shrink-0 relative shadow-sm overflow-hidden"
          >
            {currentTrack?.thumbnailUrl ? (
              <img src={currentTrack.thumbnailUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
            ) : (
              <Disc className="w-6 h-6 text-[#FFB74D]" />
            )}
            <div className="w-2.5 h-2.5 rounded-full bg-[#101416] border border-[#FFB74D] absolute" />
          </motion.div>

          <div className="min-w-0 flex-1">
            <h4 className="font-mono text-xs font-bold text-[#FFB74D] truncate uppercase tracking-tight">
              {currentTrack?.title || 'SYNTH WAVE FLOW'}
            </h4>
            <p className="font-mono text-[10px] text-[#FFE082]/70 truncate flex items-center gap-1 mt-0.5">
              {isYouTube && <Tv className="w-3 h-3 text-rose-400" />}
              <span>{currentTrack?.artist || 'STUDIO MASTER'}</span>
            </p>
          </div>
        </div>

        {/* Industrial Segment Meter */}
        <div className="grid grid-cols-12 gap-0.5 h-2 pt-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-xs transition-colors duration-100 ${
                isPlaying && i < Math.floor((seekValue % 12) + 2)
                  ? i > 9
                    ? 'bg-[#FF5252]'
                    : i > 6
                    ? 'bg-[#FFB74D]'
                    : 'bg-[#69F0AE]'
                  : 'bg-[#222A2F]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Themed Industrial Slot Scrubber */}
      <div className="space-y-1.5 pt-1">
        <div className="relative w-full h-3 flex items-center group cursor-pointer">
          {/* Recessed Anodized Aluminum Channel */}
          <div className="w-full h-2 bg-[#121618] rounded-md overflow-hidden border border-[#3E454B] shadow-inner">
            <div
              className="h-full bg-[#FF7043] rounded-sm transition-all duration-100 shadow-[0_0_8px_#FF7043]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Knurled Orange Slider Thumb */}
          <div
            className="absolute w-2 h-4 rounded-xs bg-[#FFB74D] border border-black/60 shadow-md pointer-events-none -translate-x-1/2 transition-all duration-100"
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

      {/* Mechanical Push Controls */}
      <div className="grid grid-cols-5 gap-2 pt-1">
        <button onClick={onRewind10} className="p-3 rounded-xl bg-[#363B40] hover:bg-[#434A51] border-b-2 border-black/50 text-[#C8D1D9] flex items-center justify-center active:translate-y-0.5 cursor-pointer">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button onClick={() => { sound.playClick(); onPrev(); }} className="p-3 rounded-xl bg-[#363B40] hover:bg-[#434A51] border-b-2 border-black/50 text-[#C8D1D9] flex items-center justify-center active:translate-y-0.5 cursor-pointer">
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={() => { sound.playClick(); onTogglePlay(); }}
          className={`p-3 rounded-xl border-b-2 border-black/50 text-[#121618] flex items-center justify-center font-bold active:translate-y-0.5 cursor-pointer transition-all ${
            isPlaying ? 'bg-[#FF7043] shadow-[0_0_12px_#FF7043]' : 'bg-[#6BAA7A] shadow-[0_0_12px_#6BAA7A]'
          }`}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
        </button>
        <button onClick={() => { sound.playClick(); onNext(); }} className="p-3 rounded-xl bg-[#363B40] hover:bg-[#434A51] border-b-2 border-black/50 text-[#C8D1D9] flex items-center justify-center active:translate-y-0.5 cursor-pointer">
          <SkipForward className="w-4 h-4" />
        </button>
        <button onClick={onForward10} className="p-3 rounded-xl bg-[#363B40] hover:bg-[#434A51] border-b-2 border-black/50 text-[#C8D1D9] flex items-center justify-center active:translate-y-0.5 cursor-pointer">
          <RotateCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
