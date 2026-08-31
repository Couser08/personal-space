import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import tasksReducer from './slices/tasksSlice';
import notesReducer from './slices/notesSlice';
import moodReducer from './slices/moodSlice';
import focusReducer from './slices/focusSlice';
import uiReducer from './slices/uiSlice';
import settingsReducer from './slices/settingsSlice';
import musicReducer from './slices/musicSlice';
import { supabaseSyncMiddleware } from './middleware/supabaseSyncMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    notes: notesReducer,
    mood: moodReducer,
    focus: focusReducer,
    ui: uiReducer,
    settings: settingsReducer,
    music: musicReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(supabaseSyncMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
