import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '../../types/common.types';
import { loadFromStorage, saveToStorage, removeFromStorage } from '../../utils/storage';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const savedProfile = loadFromStorage<UserProfile | null>('user_profile', null);

const initialState: AuthState = {
  user: savedProfile,
  isAuthenticated: !!savedProfile,
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
      } else {
        removeFromStorage('user_profile');
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
      state.user = null;
      state.isAuthenticated = false;
      removeFromStorage('user_profile');
    },
  },
});

export const { setUser, updateProfile, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
