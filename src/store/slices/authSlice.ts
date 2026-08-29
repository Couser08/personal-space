import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '../../types/common.types';
import { loadFromStorage, saveToStorage } from '../../utils/storage';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialProfile: UserProfile = loadFromStorage<UserProfile>('user_profile', {
  id: 'local-user',
  email: 'rahul@personal.space',
  fullName: 'Rahul',
  dailyQuote: 'Small steps every day. Big changes over time. 🌿',
  themePreference: 'light',
});

const initialState: AuthState = {
  user: initialProfile,
  isAuthenticated: false,
  isLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        saveToStorage('user_profile', action.payload);
      }
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        saveToStorage('user_profile', state.user);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = initialProfile;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, updateProfile, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
