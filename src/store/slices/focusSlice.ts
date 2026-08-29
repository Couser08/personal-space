import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TimerMode, FocusSession } from '../../types/focus.types';
import { loadFromStorage, saveToStorage } from '../../utils/storage';

interface FocusState {
  mode: TimerMode;
  durationMinutes: number;
  timeLeftSeconds: number;
  isRunning: boolean;
  sessions: FocusSession[];
}

const DEFAULT_MINUTES = 25;

const initialState: FocusState = {
  mode: 'pomodoro',
  durationMinutes: DEFAULT_MINUTES,
  timeLeftSeconds: DEFAULT_MINUTES * 60,
  isRunning: false,
  sessions: loadFromStorage<FocusSession[]>('focus_sessions', []),
};

export const focusSlice = createSlice({
  name: 'focus',
  initialState,
  reducers: {
    startTimer: (state) => {
      state.isRunning = true;
    },
    pauseTimer: (state) => {
      state.isRunning = false;
    },
    tickTimer: (state) => {
      if (state.timeLeftSeconds > 0) {
        state.timeLeftSeconds -= 1;
      } else {
        state.isRunning = false;
      }
    },
    resetTimer: (state) => {
      state.isRunning = false;
      state.timeLeftSeconds = state.durationMinutes * 60;
    },
    setTimerMode: (state, action: PayloadAction<TimerMode>) => {
      state.mode = action.payload;
      state.isRunning = false;
      if (action.payload === 'pomodoro') state.durationMinutes = 25;
      else if (action.payload === 'shortBreak') state.durationMinutes = 5;
      else if (action.payload === 'longBreak') state.durationMinutes = 15;
      state.timeLeftSeconds = state.durationMinutes * 60;
    },
    completeSession: (state) => {
      state.isRunning = false;
      const newSession: FocusSession = {
        id: crypto.randomUUID ? crypto.randomUUID() : `session-${Date.now()}`,
        userId: 'local-user',
        durationMinutes: state.durationMinutes,
        sessionType: state.mode,
        completedAt: new Date().toISOString(),
      };
      state.sessions.unshift(newSession);
      state.timeLeftSeconds = state.durationMinutes * 60;
      saveToStorage('focus_sessions', state.sessions);
    },
  },
});

export const { startTimer, pauseTimer, tickTimer, resetTimer, setTimerMode, completeSession } = focusSlice.actions;
export default focusSlice.reducer;
