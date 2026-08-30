import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage } from '../../utils/storage';
import { getYouTubeVideoId, getYouTubeThumbnail } from '../../utils/youtubeUtils';

export type PlayerPreset =
  | 'classic_vinyl'
  | 'aurora_glass'
  | 'industrial_hifi'
  | 'cyber_cassette'
  | 'zen_wabi_sabi';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  isPreset?: boolean;
  youtubeId?: string;
  thumbnailUrl?: string;
}

interface MusicState {
  tracks: MusicTrack[];
  currentTrackIndex: number;
  isPlaying: boolean;
  isPlayerOpen: boolean;
  volume: number;
  playerPreset: PlayerPreset;
}

const DEFAULT_PRESETS: MusicTrack[] = [
  {
    id: 'preset-lofi-1',
    title: 'Lofi Study Chill',
    artist: 'Botanical Beats',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    isPreset: true,
  },
  {
    id: 'preset-rain-2',
    title: 'Peaceful Rain & Thunder',
    artist: 'Nature Calm',
    url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_73229b4182.mp3?filename=soft-rain-ambient-111154.mp3',
    isPreset: true,
  },
  {
    id: 'preset-piano-3',
    title: 'Mindful Garden Piano',
    artist: 'Serene Space',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=mindfulness-relaxed-meditation-ambient-10659.mp3',
    isPreset: true,
  },
  {
    id: 'preset-ambient-4',
    title: 'Deep Focus Flow',
    artist: 'Zen Atmosphere',
    url: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_03d92fc80f.mp3?filename=cozy-night-lofi-126244.mp3',
    isPreset: true,
  },
  {
    id: 'preset-yt-lofi',
    title: 'Lofi Girl - Relaxing Beats',
    artist: 'YouTube Stream',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    youtubeId: 'jfKfPfyJRdk',
    thumbnailUrl: 'https://img.youtube.com/vi/jfKfPfyJRdk/hqdefault.jpg',
    isPreset: true,
  }
];

const initialTracks = loadFromStorage<MusicTrack[]>('music_tracks', DEFAULT_PRESETS);
const initialVolume = loadFromStorage<number>('music_volume', 0.7);
const initialPreset = loadFromStorage<PlayerPreset>('music_player_preset', 'classic_vinyl');

const initialState: MusicState = {
  tracks: initialTracks.length > 0 ? initialTracks : DEFAULT_PRESETS,
  currentTrackIndex: 0,
  isPlaying: false,
  isPlayerOpen: false,
  volume: initialVolume,
  playerPreset: initialPreset,
};

export const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    addTrack: (
      state,
      action: PayloadAction<{ title: string; artist?: string; url: string }>
    ) => {
      const url = action.payload.url.trim();
      const ytId = getYouTubeVideoId(url);
      const thumbnail = ytId ? getYouTubeThumbnail(ytId) : undefined;

      const newTrack: MusicTrack = {
        id: crypto.randomUUID ? crypto.randomUUID() : `track-${Date.now()}`,
        title: action.payload.title.trim() || (ytId ? 'YouTube Stream' : 'Custom Audio Stream'),
        artist: action.payload.artist?.trim() || (ytId ? 'YouTube Audio' : 'Custom Audio URL'),
        url,
        youtubeId: ytId || undefined,
        thumbnailUrl: thumbnail,
        isPreset: false,
      };

      state.tracks.push(newTrack);
      saveToStorage('music_tracks', state.tracks);
    },
    removeTrack: (state, action: PayloadAction<string>) => {
      state.tracks = state.tracks.filter((t) => t.id !== action.payload);
      if (state.currentTrackIndex >= state.tracks.length) {
        state.currentTrackIndex = Math.max(0, state.tracks.length - 1);
      }
      saveToStorage('music_tracks', state.tracks);
    },
    resetPresets: (state) => {
      state.tracks = DEFAULT_PRESETS;
      state.currentTrackIndex = 0;
      saveToStorage('music_tracks', state.tracks);
    },
    setCurrentTrackIndex: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.tracks.length) {
        state.currentTrackIndex = action.payload;
        state.isPlaying = true;
      }
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    togglePlayerOpen: (state) => {
      state.isPlayerOpen = !state.isPlayerOpen;
    },
    setIsPlayerOpen: (state, action: PayloadAction<boolean>) => {
      state.isPlayerOpen = action.payload;
    },
    setPlayerPreset: (state, action: PayloadAction<PlayerPreset>) => {
      state.playerPreset = action.payload;
      saveToStorage('music_player_preset', action.payload);
    },
    nextTrack: (state) => {
      if (state.tracks.length === 0) return;
      state.currentTrackIndex = (state.currentTrackIndex + 1) % state.tracks.length;
      state.isPlaying = true;
    },
    prevTrack: (state) => {
      if (state.tracks.length === 0) return;
      state.currentTrackIndex =
        (state.currentTrackIndex - 1 + state.tracks.length) % state.tracks.length;
      state.isPlaying = true;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(1, action.payload));
      saveToStorage('music_volume', state.volume);
    },
  },
});

export const {
  addTrack,
  removeTrack,
  resetPresets,
  setCurrentTrackIndex,
  togglePlay,
  setIsPlaying,
  togglePlayerOpen,
  setIsPlayerOpen,
  setPlayerPreset,
  nextTrack,
  prevTrack,
  setVolume,
} = musicSlice.actions;

export default musicSlice.reducer;
