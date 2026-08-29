import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { MoodLevel, MoodLog } from '../../types/mood.types';
import { loadFromStorage, saveToStorage } from '../../utils/storage';

interface MoodState {
  logs: MoodLog[];
  todayMood: MoodLevel | null;
  isLoading: boolean;
}

const todayDate = new Date().toISOString().split('T')[0];
const savedLogs = loadFromStorage<MoodLog[]>('mood_logs', []);
const currentTodayLog = savedLogs.find(l => l.logDate === todayDate);

const initialState: MoodState = {
  logs: savedLogs,
  todayMood: currentTodayLog ? currentTodayLog.mood : null,
  isLoading: false,
};

export const moodSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {
    setMoodLogs: (state, action: PayloadAction<MoodLog[]>) => {
      state.logs = action.payload;
      const today = new Date().toISOString().split('T')[0];
      const todayLog = state.logs.find(l => l.logDate === today);
      state.todayMood = todayLog ? todayLog.mood : null;
      saveToStorage('mood_logs', state.logs);
    },
    logMood: (state, action: PayloadAction<{ mood: MoodLevel; note?: string }>) => {
      const today = new Date().toISOString().split('T')[0];
      state.todayMood = action.payload.mood;

      const existingIndex = state.logs.findIndex(l => l.logDate === today);
      if (existingIndex !== -1) {
        state.logs[existingIndex].mood = action.payload.mood;
        if (action.payload.note !== undefined) {
          state.logs[existingIndex].note = action.payload.note;
        }
      } else {
        const newLog: MoodLog = {
          id: crypto.randomUUID ? crypto.randomUUID() : `mood-${Date.now()}`,
          userId: 'local-user',
          mood: action.payload.mood,
          note: action.payload.note || '',
          logDate: today,
          createdAt: new Date().toISOString(),
        };
        state.logs.unshift(newLog);
      }
      saveToStorage('mood_logs', state.logs);
    },
  },
});

export const { setMoodLogs, logMood } = moodSlice.actions;
export default moodSlice.reducer;
