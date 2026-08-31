import React, { useEffect, useCallback, useRef } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardView } from './components/dashboard/DashboardView';
import { TasksPage } from './features/tasks/TasksPage';
import { NotesPage } from './features/notes/NotesPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { CalendarPage } from './features/calendar/CalendarPage';
import { TaskFormModal } from './features/tasks/TaskFormModal';
import { NoteEditorModal } from './features/notes/NoteEditorModal';
import { MoodNoteModal } from './features/mood/MoodNoteModal';
import { Toast } from './components/ui/Toast';
import { FloatingMusicPlayer } from './components/music/FloatingMusicPlayer';
import { PlaceholderView } from './features/common/PlaceholderView';
import { useAppDispatch, useAppSelector } from './store';
import { setUser } from './store/slices/authSlice';
import { setTasks } from './store/slices/tasksSlice';
import { setTracks, DEFAULT_PRESETS } from './store/slices/musicSlice';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { supabaseSyncService } from './services/supabaseSyncService';
import type { RealtimeChannel } from '@supabase/supabase-js';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);

  // Sync and Hydrate all user data from Supabase
  const syncUserData = useCallback(
    async (userId: string, email: string, userMetadata?: Record<string, unknown>) => {
      if (!userId) return;

      try {
        // 1. Fetch Profile
        const profile = await supabaseSyncService.fetchProfile(userId);
        dispatch(
          setUser({
            id: userId,
            email: email || profile?.email || 'user@personal.space',
            fullName:
              profile?.full_name ||
              (userMetadata?.full_name as string) ||
              email.split('@')[0] ||
              'Personal Space User',
            avatarUrl: profile?.avatar_url || undefined,
            dailyQuote:
              profile?.daily_quote ||
              'Small steps every day. Big changes over time. 🌿',
            themePreference: (profile?.theme_preference as 'light' | 'dark') || 'light',
          })
        );

        // 2. Fetch Tasks from Cloud
        const cloudTasks = await supabaseSyncService.fetchTasks(userId);
        if (cloudTasks.length > 0) {
          dispatch(setTasks(cloudTasks));
        }

        // 3. Fetch Music Tracks from Cloud
        const cloudTracks = await supabaseSyncService.fetchMusicTracks(userId);
        if (cloudTracks.length > 0) {
          dispatch(setTracks(cloudTracks));
        }

        // 4. Setup Real-time Postgres Changes Subscription
        if (realtimeChannelRef.current) {
          supabase.removeChannel(realtimeChannelRef.current);
        }

        realtimeChannelRef.current = supabaseSyncService.subscribeToUserRealtime(
          userId,
          async () => {
            const updatedTasks = await supabaseSyncService.fetchTasks(userId);
            dispatch(setTasks(updatedTasks));
          },
          async () => {
            const updatedTracks = await supabaseSyncService.fetchMusicTracks(userId);
            if (updatedTracks.length > 0) dispatch(setTracks(updatedTracks));
          },
          async () => {
            const updatedProfile = await supabaseSyncService.fetchProfile(userId);
            if (updatedProfile) {
              dispatch(
                setUser({
                  id: userId,
                  email: email || updatedProfile.email || 'user@personal.space',
                  fullName: updatedProfile.full_name || 'Personal Space User',
                  avatarUrl: updatedProfile.avatar_url || undefined,
                  dailyQuote: updatedProfile.daily_quote || 'Small steps every day. Big changes over time. 🌿',
                  themePreference: (updatedProfile.theme_preference as 'light' | 'dark') || 'light',
                })
              );
            }
          }
        );
      } catch (err) {
        console.error('Error hydrating user cloud data:', err);
      }
    },
    [dispatch]
  );

  // Initialize Supabase Auth Session listener if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncUserData(
          session.user.id,
          session.user.email || '',
          session.user.user_metadata
        );
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED')) {
        syncUserData(
          session.user.id,
          session.user.email || '',
          session.user.user_metadata
        );
      } else if (event === 'SIGNED_OUT') {
        if (realtimeChannelRef.current) {
          supabase.removeChannel(realtimeChannelRef.current);
          realtimeChannelRef.current = null;
        }
        dispatch(setUser(null));
        dispatch(setTasks([]));
        dispatch(setTracks(DEFAULT_PRESETS));
      }
    });

    return () => {
      subscription.unsubscribe();
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  }, [dispatch, syncUserData]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardView />;
      case 'todo':
        return <TasksPage />;
      case 'notes':
        return <NotesPage />;
      case 'settings':
        return <SettingsPage />;
      case 'goals':
        return <PlaceholderView tabName="Goals" />;
      case 'calendar':
        return <CalendarPage />;
      case 'mood':
        return <PlaceholderView tabName="Mood" />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <AppLayout>
      {renderActiveView()}

      {/* Global Modals, Widgets & Notifications */}
      <TaskFormModal />
      <NoteEditorModal />
      <MoodNoteModal />
      <FloatingMusicPlayer />
      <Toast />
    </AppLayout>
  );
};

export default App;
