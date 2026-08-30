import React, { useEffect } from 'react';
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
import { supabase, isSupabaseConfigured } from './lib/supabase';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.ui.activeTab);

  // Initialize Supabase Auth Session listener if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        dispatch(
          setUser({
            id: session.user.id,
            email: session.user.email || 'rahul@personal.space',
            fullName: (session.user.user_metadata?.full_name as string) || 'Rahul',
            dailyQuote: 'Small steps every day. Big changes over time. 🌿',
            themePreference: 'light',
          })
        );
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        dispatch(
          setUser({
            id: session.user.id,
            email: session.user.email || 'user@personal.space',
            fullName: (session.user.user_metadata?.full_name as string) || 'Personal User',
            dailyQuote: 'Small steps every day. Big changes over time. 🌿',
            themePreference: 'light',
          })
        );
      } else if (event === 'SIGNED_OUT') {
        dispatch(setUser(null));
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

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
