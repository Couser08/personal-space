import React, { useState } from 'react';
import { Music, Plus, Trash2, Play, RotateCcw, Volume2, Link as LinkIcon, Radio, Tv, Sparkles, Loader2, Sliders, Check, Disc, Leaf } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  addTrack,
  removeTrack,
  resetPresets,
  setCurrentTrackIndex,
  setIsPlayerOpen,
  setPlayerPreset,
  PlayerPreset,
} from '../../store/slices/musicSlice';
import { showToast } from '../../store/slices/uiSlice';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { getYouTubeVideoId, fetchYouTubeMetadata } from '../../utils/youtubeUtils';
import { sound } from '../../lib/sound';

export const MusicSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const tracks = useAppSelector((state) => state.music.tracks);
  const currentTrackIndex = useAppSelector((state) => state.music.currentTrackIndex);
  const isPlaying = useAppSelector((state) => state.music.isPlaying);
  const currentPreset = (useAppSelector((state) => state.music.playerPreset) || 'classic_vinyl') as PlayerPreset;

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [url, setUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isLoadingYt, setIsLoadingYt] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUrlChange = async (newUrl: string) => {
    setUrl(newUrl);
    setErrorMsg('');
    const trimmed = newUrl.trim();
    const ytId = getYouTubeVideoId(trimmed);

    if (ytId) {
      setIsLoadingYt(true);
      try {
        const meta = await fetchYouTubeMetadata(trimmed);
        if (meta) {
          setTitle(meta.title);
          setArtist(meta.artist);
          setThumbnailUrl(meta.thumbnailUrl);
        }
      } catch {
        // Fallback
      } finally {
        setIsLoadingYt(false);
      }
    } else {
      setThumbnailUrl('');
    }
  };

  const handleAddTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setErrorMsg('Please enter an audio stream or YouTube URL.');
      return;
    }

    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      setErrorMsg('URL must begin with http:// or https://');
      return;
    }

    sound.playComplete();
    const ytId = getYouTubeVideoId(trimmedUrl);

    dispatch(
      addTrack({
        title: title.trim() || (ytId ? 'YouTube Focus Stream' : 'Custom Ambient Stream'),
        artist: artist.trim() || (ytId ? 'YouTube' : 'Web Stream'),
        url: trimmedUrl,
      })
    );

    setTitle('');
    setArtist('');
    setUrl('');
    setThumbnailUrl('');
    dispatch(showToast({ message: 'Music stream added! 🌿', type: 'success' }));
  };

  const handlePlayTrack = (index: number) => {
    sound.playClick();
    dispatch(setCurrentTrackIndex(index));
    dispatch(setIsPlayerOpen(true));
  };

  const handleDeleteTrack = (id: string) => {
    sound.playClick();
    dispatch(removeTrack(id));
    dispatch(showToast({ message: 'Track deleted', type: 'info' }));
  };

  const handleReset = () => {
    sound.playClick();
    dispatch(resetPresets());
    dispatch(showToast({ message: 'Default ambient tracks restored', type: 'info' }));
  };

  const presetsConfig: { id: PlayerPreset; name: string; tag: string; desc: string; icon: React.ReactNode; bg: string }[] = [
    {
      id: 'classic_vinyl',
      name: 'Classic Botanical Vinyl',
      tag: 'Default • 33⅓ RPM',
      desc: 'Authentic concentric grooves, brass center spindle, and warm turntable aura.',
      icon: <Disc className="w-5 h-5 text-[#6BAA7A]" />,
      bg: 'from-[#6BAA7A]/15 to-[#242A27]/20',
    },
    {
      id: 'aurora_glass',
      name: 'Aurora Fluid Glass',
      tag: 'Apple & Arc Vision',
      desc: 'Fluid mesh aurora glow, frosted acrylic glass & animated sound wave.',
      icon: <Sparkles className="w-5 h-5 text-emerald-500" />,
      bg: 'from-emerald-500/15 to-indigo-500/15',
    },
    {
      id: 'industrial_hifi',
      name: 'OB-4 Industrial HiFi',
      tag: 'Teenage Engineering',
      desc: 'Tactile anodized slate chassis, amber phosphor OLED & mechanical keys.',
      icon: <Sliders className="w-5 h-5 text-[#FF7043]" />,
      bg: 'from-[#FF7043]/15 to-stone-500/10',
    },
    {
      id: 'cyber_cassette',
      name: 'Cyberpunk Cassette',
      tag: 'Neo-Tokyo Studio',
      desc: 'Transparent smoked acrylic cassette case, dual magnetic spools & cyan neon VU.',
      icon: <Radio className="w-5 h-5 text-cyan-400" />,
      bg: 'from-cyan-500/15 to-emerald-500/10',
    },
    {
      id: 'zen_wabi_sabi',
      name: 'Zen Wabi-Sabi Island',
      tag: 'Japanese Minimalist',
      desc: 'Circular SVG progress orbit ring around rotating disc & clean serif layout.',
      icon: <Leaf className="w-5 h-5 text-[#88C496]" />,
      bg: 'from-[#88C496]/15 to-[#FAFBF9]/20',
    },
  ];

  return (
    <div className="bg-white dark:bg-[#1A1F21] rounded-3xl p-5 sm:p-6 border border-[#EEF0EC] dark:border-[#273033] shadow-card space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#EEF0EC] dark:border-[#273033]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ECEEFB] dark:bg-[#20233B] text-[#7B7FD4] flex items-center justify-center shadow-2xs">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1F2937] dark:text-[#F3F4F6]">
              Ambient Music & YouTube Focus Engine
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
              Select your favorite world-class player design preset and paste YouTube URLs to auto-fetch songs & album art.
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          title="Restore default presets"
          className="p-2 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white rounded-xl bg-[#FAFBF9] dark:bg-[#121516] border border-[#EEF0EC] dark:border-[#273033] flex items-center gap-1.5 cursor-pointer hover:bg-black/5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Tracks</span>
        </button>
      </div>

      {/* 5 World-Class Player Design Presets Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">
            Player Design Presets
          </h4>
          <span className="text-[11px] font-semibold text-[#6BAA7A] px-2.5 py-0.5 rounded-full bg-[#EAF2EC] dark:bg-[#1E2E23]">
            Active: {presetsConfig.find(p => p.id === currentPreset)?.name}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {presetsConfig.map((p) => {
            const isSelected = currentPreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  dispatch(setPlayerPreset(p.id));
                  dispatch(showToast({ message: `Preset set to ${p.name}`, type: 'success' }));
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between overflow-hidden bg-gradient-to-br ${p.bg} ${
                  isSelected
                    ? 'border-[#6BAA7A] ring-2 ring-[#6BAA7A]/30 shadow-md bg-white dark:bg-[#1C2326]'
                    : 'border-[#EEF0EC] dark:border-[#273033] hover:border-[#6BAA7A]/50 bg-[#FAFBF9] dark:bg-[#14181A]'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#6BAA7A] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#1A1F21] border border-[#EEF0EC] dark:border-[#2E373A] flex items-center justify-center shadow-xs">
                      {p.icon}
                    </div>
                    <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-[#4F5D75] dark:text-[#CBD2DC]">
                      {p.tag}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-[#1F2937] dark:text-[#F3F4F6]">{p.name}</h5>
                    <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] mt-1 leading-snug">{p.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Custom Audio / YouTube URL Form */}
      <form onSubmit={handleAddTrack} className="p-4 rounded-2xl bg-[#FAFBF9] dark:bg-[#14181A] border border-[#EEF0EC] dark:border-[#273033] space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#1F2937] dark:text-[#F3F4F6] flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-[#6BAA7A]" />
            Add YouTube or Audio Stream
          </h4>

          {isLoadingYt && (
            <span className="text-[11px] text-[#6BAA7A] font-semibold flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Fetching YouTube details...
            </span>
          )}

          {!isLoadingYt && thumbnailUrl && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Auto-Fetched Metadata
            </span>
          )}
        </div>

        <Input
          leftIcon={thumbnailUrl ? <Tv className="w-4 h-4 text-rose-500" /> : <LinkIcon className="w-4 h-4" />}
          placeholder="Paste YouTube Link or Audio URL (e.g. https://www.youtube.com/watch?v=...)"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          error={errorMsg}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="Song / Track Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            placeholder="Singer / Artist / Channel"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />
        </div>

        {thumbnailUrl && (
          <div className="flex items-center gap-3 p-2.5 bg-white dark:bg-[#1C2224] rounded-xl border border-[#EEF0EC] dark:border-[#273033]">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-xs">
              <img
                src={thumbnailUrl}
                alt="Banner Preview"
                className="w-full h-full object-cover scale-105"
              />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-[#1F2937] dark:text-[#F3F4F6] block">
                {title || 'YouTube Track'}
              </span>
              <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                Artist: {artist || 'YouTube'} • High-Res Album Artwork
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Save Music Stream
          </Button>
        </div>
      </form>

      {/* Saved Audio Tracks List */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">
          Saved Music Streams ({tracks.length})
        </h4>

        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
          {tracks.map((track, idx) => {
            const isCurrent = idx === currentTrackIndex;
            return (
              <div
                key={track.id}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-[#EAF2EC] dark:bg-[#1E2E23] border-[#6BAA7A]/40'
                    : 'bg-[#FAFBF9]/80 dark:bg-[#121516] border-[#EEF0EC] dark:border-[#273033]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => handlePlayTrack(idx)}
                    title={isCurrent && isPlaying ? 'Playing' : 'Play this stream'}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-transform shrink-0 ${
                      isCurrent && isPlaying
                        ? 'bg-[#6BAA7A] text-white animate-pulse'
                        : 'bg-white dark:bg-[#1E2528] text-[#4F5D75] dark:text-[#CBD2DC] hover:text-[#1F2937]'
                    }`}
                  >
                    {isCurrent && isPlaying ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>

                  {track.thumbnailUrl ? (
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-2xs">
                      <img
                        src={track.thumbnailUrl}
                        alt={track.title}
                        className="w-full h-full object-cover scale-105"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[#EAF2EC] dark:bg-[#1E2E23] text-[#6BAA7A] flex items-center justify-center shrink-0">
                      <Music className="w-4 h-4" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h5 className="text-xs font-bold text-[#1F2937] dark:text-[#F3F4F6] truncate">
                        {track.title}
                      </h5>
                      {track.youtubeId && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 font-semibold flex items-center gap-0.5">
                          <Tv className="w-2.5 h-2.5" />
                          YouTube
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] truncate mt-0.5">
                      {track.artist}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTrack(track.id)}
                  title="Delete track"
                  className="p-2 text-[#9CA3AF] hover:text-[#E05656] hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer shrink-0 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
