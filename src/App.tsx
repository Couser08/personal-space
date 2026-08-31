import React, { useEffect, useCallback } from 'react';
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

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const currentTasks = useAppSelector((state) => state.tasks.items);
  const currentTracks = useAppSelector((state) => state.music.tracks);

  // Sync and Hydrate all user data from Supabase
  const syncUserData = useCallback(
    async (userId: string, email: string, userMetadata?: Record<string, unknown>) => {
      try {
        // 1. Fetch Profile
        const profile = await supabaseSyncService.fetchProfile(userId);
        dispatch(
          setUser({
            id: userId,
            email: email || 'user@personal.space',
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
        } else if (currentTasks.length > 0) {
          // If cloud is empty but local has tasks, push local to cloud
          await supabaseSyncService.syncInitialLocalToCloud(userId, currentTasks, []);
        }

        // 3. Fetch Music Tracks from Cloud
        const cloudTracks = await supabaseSyncService.fetchMusicTracks(userId);
        if (cloudTracks.length > 0) {
          dispatch(setTracks(cloudTracks));
        } else {
          // Push any custom local tracks to cloud
          const customLocal = currentTracks.filter((t) => !t.isPreset);
          if (customLocal.length > 0) {
            await supabaseSyncService.syncInitialLocalToCloud(userId, [], customLocal);
          }
        }
      } catch (err) {
        console.error('Error hydrating user cloud data:', err);
      }
    },
    [dispatch, currentTasks, currentTracks]
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
      if (session?.user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED')) {
        syncUserData(
          session.user.id,
          session.user.email || '',
          session.user.user_metadata
        );
      } else if (event === 'SIGNED_OUT') {
        dispatch(setUser(null));
        dispatch(setTracks(DEFAULT_PRESETS));
      }
    });

    return () => subscription.unsubscribe();
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
