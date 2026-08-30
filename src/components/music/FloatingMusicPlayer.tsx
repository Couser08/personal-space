import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Minimize2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  togglePlay,
  setIsPlaying,
  nextTrack,
  prevTrack,
  setVolume,
  setIsPlayerOpen,
  PlayerPreset,
} from '../../store/slices/musicSlice';
import { ClassicVinylPreset } from './presets/ClassicVinylPreset';
import { AuroraGlassPreset } from './presets/AuroraGlassPreset';
import { IndustrialHifiPreset } from './presets/IndustrialHifiPreset';
import { RetroCyberCassettePreset } from './presets/RetroCyberCassettePreset';
import { ZenWabiSabiPreset } from './presets/ZenWabiSabiPreset';
import { sound } from '../../lib/sound';

export const FloatingMusicPlayer: React.FC = () => {
  const dispatch = useAppDispatch();
  const tracks = useAppSelector((state) => state.music.tracks);
  const currentTrackIndex = useAppSelector((state) => state.music.currentTrackIndex);
  const isPlaying = useAppSelector((state) => state.music.isPlaying);
  const isPlayerOpen = useAppSelector((state) => state.music.isPlayerOpen);
  const volume = useAppSelector((state) => state.music.volume);
  const playerPreset = (useAppSelector((state) => state.music.playerPreset) || 'classic_vinyl') as PlayerPreset;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytContainerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ytPlayerRef = useRef<any>(null);
  const isYtReadyRef = useRef(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekValue, setSeekValue] = useState(0);
  const isSeekingRef = useRef(false);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];
  const isYouTube = !!currentTrack?.youtubeId;

  // Initialize YouTube Player
  const createYouTubePlayer = useCallback(() => {
    if (!window.YT || !window.YT.Player || !ytContainerRef.current) return;
    if (ytPlayerRef.current) return;

    try {
      ytPlayerRef.current = new window.YT.Player(ytContainerRef.current, {
        height: '1',
        width: '1',
        videoId: currentTrack?.youtubeId || '',
        playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, rel: 0, playsinline: 1 },
        events: {
          onReady: () => {
            isYtReadyRef.current = true;
            if (ytPlayerRef.current) {
              ytPlayerRef.current.setVolume?.(isMuted ? 0 : volume * 100);
              const dur = ytPlayerRef.current.getDuration?.() || 0;
              if (dur > 0) setDuration(dur);
              if (isPlaying && isYouTube) ytPlayerRef.current.playVideo?.();
            }
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onStateChange: (event: any) => {
            if (event.data === 0) dispatch(nextTrack());
            else if (event.data === 1) {
              dispatch(setIsPlaying(true));
              const dur = ytPlayerRef.current?.getDuration?.() || 0;
              if (dur > 0) setDuration(dur);
            }
          },
        },
      });
    } catch {
      // Ignore initial race conditions
    }
  }, [currentTrack?.youtubeId, dispatch, isMuted, isPlaying, isYouTube, volume]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.YT) {
      window.onYouTubeIframeAPIReady = () => createYouTubePlayer();
    } else {
      createYouTubePlayer();
    }
  }, [createYouTubePlayer]);

  // Track switching
  useEffect(() => {
    if (!isYouTube || !currentTrack?.youtubeId) return;
    setCurrentTime(0);
    setSeekValue(0);
    setDuration(0);

    if (ytPlayerRef.current && isYtReadyRef.current) {
      if (typeof ytPlayerRef.current.loadVideoById === 'function') {
        ytPlayerRef.current.loadVideoById(currentTrack.youtubeId);
        if (isPlaying) ytPlayerRef.current.playVideo?.();
        else ytPlayerRef.current.pauseVideo?.();
      }
    }
  }, [currentTrack?.youtubeId, isYouTube, isPlaying]);

  // YouTube Play/Pause syncing
  useEffect(() => {
    if (!isYouTube || !ytPlayerRef.current || !isYtReadyRef.current) return;
    if (isPlaying) ytPlayerRef.current.playVideo?.();
    else ytPlayerRef.current.pauseVideo?.();
  }, [isPlaying, isYouTube]);

  // YouTube ticker
  useEffect(() => {
    if (!isYouTube || !isPlaying) return;
    const interval = setInterval(() => {
      if (isSeekingRef.current || !ytPlayerRef.current || !isYtReadyRef.current) return;
      try {
        const cur = ytPlayerRef.current.getCurrentTime?.() || 0;
        const dur = ytPlayerRef.current.getDuration?.() || 0;
        if (cur > 0 || dur > 0) {
          setCurrentTime(cur);
          setSeekValue(cur);
          if (dur > 0 && dur !== duration) setDuration(dur);
        }
      } catch {
        // Player not ready
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isYouTube, isPlaying, duration]);

  // HTML5 audio playback
  useEffect(() => {
    if (isYouTube) {
      if (audioRef.current) audioRef.current.pause();
      return;
    }
    if (!audioRef.current || !currentTrack?.url) return;
    audioRef.current.src = currentTrack.url;
    audioRef.current.volume = isMuted ? 0 : volume;
    if (isPlaying) {
      const p = audioRef.current.play();
      if (p !== undefined) p.catch(() => dispatch(setIsPlaying(false)));
    } else {
      audioRef.current.pause();
    }
  }, [currentTrackIndex, currentTrack?.url, isPlaying, isYouTube, dispatch, isMuted, volume]);

  // Volume sync
  useEffect(() => {
    const activeVol = isMuted ? 0 : volume;
    if (audioRef.current) audioRef.current.volume = activeVol;
    if (ytPlayerRef.current && isYtReadyRef.current) ytPlayerRef.current.setVolume?.(activeVol * 100);
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (isSeekingRef.current || !audioRef.current) return;
    const cur = audioRef.current.currentTime || 0;
    const dur = audioRef.current.duration || 0;
    setCurrentTime(cur);
    setDuration(dur);
    setSeekValue(cur);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isSeekingRef.current = true;
    const val = parseFloat(e.target.value);
    setSeekValue(val);
    setCurrentTime(val);
  };

  const handleSeekCommit = () => {
    if (audioRef.current && !isYouTube) audioRef.current.currentTime = seekValue;
    else if (isYouTube && ytPlayerRef.current && isYtReadyRef.current) ytPlayerRef.current.seekTo?.(seekValue, true);
    isSeekingRef.current = false;
  };

  const handleForward10 = () => {
    sound.playClick();
    const nextT = Math.min(duration > 0 ? duration : currentTime + 10, currentTime + 10);
    if (audioRef.current && !isYouTube) audioRef.current.currentTime = nextT;
    else if (isYouTube && ytPlayerRef.current && isYtReadyRef.current) ytPlayerRef.current.seekTo?.(nextT, true);
    setCurrentTime(nextT);
    setSeekValue(nextT);
  };

  const handleRewind10 = () => {
    sound.playClick();
    const prevT = Math.max(0, currentTime - 10);
    if (audioRef.current && !isYouTube) audioRef.current.currentTime = prevT;
    else if (isYouTube && ytPlayerRef.current && isYtReadyRef.current) ytPlayerRef.current.seekTo?.(prevT, true);
    setCurrentTime(prevT);
    setSeekValue(prevT);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs <= 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const commonProps = {
    currentTrack,
    isPlaying,
    isYouTube,
    currentTime,
    duration,
    seekValue,
    volume,
    isMuted,
    onTogglePlay: () => dispatch(togglePlay()),
    onPrev: () => dispatch(prevTrack()),
    onNext: () => dispatch(nextTrack()),
    onForward10: handleForward10,
    onRewind10: handleRewind10,
    onSeekChange: handleSeekChange,
    onSeekCommit: handleSeekCommit,
    onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isMuted) setIsMuted(false);
      dispatch(setVolume(parseFloat(e.target.value)));
    },
    onToggleMute: () => setIsMuted(!isMuted),
    formatTime,
  };

  return (
    <>
      {!isYouTube && (
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
          onEnded={() => dispatch(nextTrack())}
          onError={() => dispatch(setIsPlaying(false))}
        />
      )}

      <div className="w-0 h-0 opacity-0 overflow-hidden absolute pointer-events-none -z-50">
        <div ref={ytContainerRef} />
      </div>

      {(isPlayerOpen || isPlaying) && (
        <div className="fixed bottom-16 sm:bottom-6 inset-x-3 sm:inset-x-auto sm:right-6 z-30 select-none">
          <AnimatePresence mode="wait">
            {isMinimized ? (
              /* Minimized Floating Small Bar Following Selected Preset Style */
              <motion.div
                key={`minimized-${playerPreset}`}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setIsMinimized(false)}
                className={`flex items-center justify-between gap-3 p-2 px-3.5 rounded-full cursor-pointer max-w-sm sm:max-w-none ml-auto shadow-2xl transition-all ${
                  playerPreset === 'industrial_hifi'
                    ? 'bg-[#22272B] text-[#E8ECE9] border-2 border-[#3E454B]'
                    : playerPreset === 'cyber_cassette'
                    ? 'bg-[#0E151B] text-cyan-300 border-2 border-cyan-500/40 shadow-[0_10px_25px_rgba(6,182,212,0.2)]'
                    : playerPreset === 'aurora_glass'
                    ? 'bg-black/70 backdrop-blur-2xl text-white border border-white/20'
                    : playerPreset === 'zen_wabi_sabi'
                    ? 'bg-[#FAFBF9] dark:bg-[#161B1D] text-[#1F2937] dark:text-[#F3F4F6] border border-[#E2E6DE] dark:border-[#273235]'
                    : 'bg-[#1E2522] text-[#FAFBF9] border-2 border-[#35433B]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <motion.div
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center relative overflow-hidden shrink-0 border ${
                      playerPreset === 'industrial_hifi'
                        ? 'bg-[#121517] border-[#FF7043]'
                        : playerPreset === 'cyber_cassette'
                        ? 'bg-[#0A0E12] border-cyan-400'
                        : 'bg-[#161C19] border-[#6BAA7A]'
                    }`}
                  >
                    {currentTrack?.thumbnailUrl ? (
                      <img src={currentTrack.thumbnailUrl} alt={currentTrack.title} className="w-full h-full object-cover scale-135" />
                    ) : (
                      <span className="text-xs">🌿</span>
                    )}
                  </motion.div>

                  <div className="min-w-0 max-w-[140px] sm:max-w-[160px]">
                    <h5 className="text-xs font-bold truncate">{currentTrack?.title || 'Focus Audio'}</h5>
                    <p
                      className={`text-[10px] font-semibold flex items-center gap-1 ${
                        playerPreset === 'industrial_hifi'
                          ? 'text-[#FF7043]'
                          : playerPreset === 'cyber_cassette'
                          ? 'text-cyan-400'
                          : 'text-[#6BAA7A]'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {isPlaying ? 'Now Playing' : 'Paused'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); sound.playClick(); dispatch(togglePlay()); }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-md font-bold ${
                      playerPreset === 'industrial_hifi'
                        ? 'bg-[#FF7043] text-black'
                        : playerPreset === 'cyber_cassette'
                        ? 'bg-cyan-400 text-black'
                        : 'bg-[#6BAA7A] text-white'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); sound.playClick(); dispatch(setIsPlayerOpen(false)); }}
                    className="p-1.5 rounded-full text-current opacity-60 hover:opacity-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Expanded Full Player with Selected Preset Shell (Zero In-Player Switcher Clutter) */
              <motion.div
                key={`full-preset-shell-${playerPreset}`}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="w-full sm:w-[380px] max-w-sm sm:max-w-none ml-auto space-y-2 relative"
              >
                {/* Sleek Minimal Window Controls on Top Right */}
                <div className="absolute top-3 right-3 z-30 flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setIsMinimized(true)}
                    title="Minimize"
                    className="p-1.5 rounded-full bg-black/30 backdrop-blur-md text-white/80 hover:text-white cursor-pointer"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => dispatch(setIsPlayerOpen(false))}
                    title="Close"
                    className="p-1.5 rounded-full bg-black/30 backdrop-blur-md text-white/80 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Render Selected Preset */}
                {playerPreset === 'aurora_glass' ? (
                  <AuroraGlassPreset {...commonProps} />
                ) : playerPreset === 'industrial_hifi' ? (
                  <IndustrialHifiPreset {...commonProps} />
                ) : playerPreset === 'cyber_cassette' ? (
                  <RetroCyberCassettePreset {...commonProps} />
                ) : playerPreset === 'zen_wabi_sabi' ? (
                  <ZenWabiSabiPreset {...commonProps} />
                ) : (
                  <ClassicVinylPreset {...commonProps} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};
