import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage } from '../../utils/storage';

interface SettingsState {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

const initialState: SettingsState = {
  soundEnabled: loadFromStorage<boolean>('sound_enabled', true),
  notificationsEnabled: loadFromStorage<boolean>('notif_enabled', true),
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
      saveToStorage('sound_enabled', state.soundEnabled);
    },
    toggleNotifications: (state) => {
      state.notificationsEnabled = !state.notificationsEnabled;
      saveToStorage('notif_enabled', state.notificationsEnabled);
    },
  },
});

export const { toggleSound, toggleNotifications } = settingsSlice.actions;
export default settingsSlice.reducer;
