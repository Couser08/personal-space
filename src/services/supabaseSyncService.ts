import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Task, Subtask } from '../types/task.types';
import type { MusicTrack } from '../store/slices/musicSlice';
import type { Database } from '../types/supabase.types';
import { generateUUID, isValidUUID } from '../utils/uuid';

type DbTask = Database['public']['Tables']['tasks']['Row'];
type DbSubtask = Database['public']['Tables']['subtasks']['Row'];
type DbMusicTrack = Database['public']['Tables']['user_music_tracks']['Row'];
type DbProfile = Database['public']['Tables']['profiles']['Row'];

/**
 * Supabase Sync Service
 * Handles multi-device bidirectional synchronization for Tasks, Subtasks, Music, and Profile.
 */
export const supabaseSyncService = {
  // ----------------------------------------------------
  // TASKS & SUBTASKS
  // ----------------------------------------------------
  async fetchTasks(userId: string): Promise<Task[]> {
    if (!isSupabaseConfigured || !userId) return [];

    try {
      // 1. Fetch tasks
      const { data: dbTasks, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('position', { ascending: true })
        .order('created_at', { ascending: false });

      if (taskError || !dbTasks) {
        console.error('Error fetching cloud tasks:', taskError);
        return [];
      }

      const tasksList = dbTasks as DbTask[];
      if (tasksList.length === 0) return [];

      // 2. Fetch all subtasks for these tasks
      const taskIds = tasksList.map((t) => t.id);
      const { data: dbSubtasks, error: subError } = await supabase
        .from('subtasks')
        .select('*')
        .in('task_id', taskIds)
        .order('position', { ascending: true });

      if (subError) {
        console.error('Error fetching cloud subtasks:', subError);
      }

      const subtasksByTaskId: Record<string, Subtask[]> = {};
      (dbSubtasks as DbSubtask[] || []).forEach((st) => {
        if (!subtasksByTaskId[st.task_id]) subtasksByTaskId[st.task_id] = [];
        subtasksByTaskId[st.task_id].push({
          id: st.id,
          taskId: st.task_id,
          title: st.title,
          isCompleted: st.is_completed ?? false,
          position: st.position ?? 0,
          createdAt: st.created_at || new Date().toISOString(),
        });
      });

      // 3. Map to Redux Task models
      return tasksList.map((t) => ({
        id: t.id,
        userId: t.user_id || userId,
        title: t.title,
        description: t.description || undefined,
        priority: (t.priority as 'low' | 'medium' | 'high') || 'medium',
        category: t.category || 'General',
        dueDate: t.due_date || undefined,
        dueTime: t.due_time || undefined,
        isCompleted: t.is_completed ?? false,
        completedAt: t.completed_at || undefined,
        position: t.position ?? 0,
        createdAt: t.created_at || new Date().toISOString(),
        updatedAt: t.updated_at || new Date().toISOString(),
        subtasks: subtasksByTaskId[t.id] || [],
      }));
    } catch (err) {
      console.error('Failed to sync tasks from cloud:', err);
      return [];
    }
  },

  async upsertTask(userId: string, task: Task): Promise<void> {
    if (!isSupabaseConfigured || !userId) return;

    try {
      const taskId = isValidUUID(task.id) ? task.id : generateUUID();

      // Upsert Task
      const { error: taskError } = await supabase.from('tasks').upsert({
        id: taskId,
        user_id: userId,
        title: task.title,
        description: task.description || null,
        priority: task.priority || 'medium',
        category: task.category || 'General',
        due_date: task.dueDate || null,
        due_time: task.dueTime || null,
        is_completed: task.isCompleted || false,
        completed_at: task.completedAt || null,
        position: task.position ?? 0,
        updated_at: new Date().toISOString(),
      } as never);

      if (taskError) {
        console.error('Error saving task to cloud:', taskError);
        return;
      }

      // Upsert Subtasks
      if (task.subtasks && task.subtasks.length > 0) {
        for (const sub of task.subtasks) {
          const subId = isValidUUID(sub.id) ? sub.id : generateUUID();
          await supabase.from('subtasks').upsert({
            id: subId,
            task_id: taskId,
            title: sub.title,
            is_completed: sub.isCompleted || false,
            position: sub.position ?? 0,
          } as never);
        }
      }
    } catch (err) {
      console.error('Failed to upsert task in cloud:', err);
    }
  },

  async deleteTask(taskId: string): Promise<void> {
    if (!isSupabaseConfigured || !isValidUUID(taskId)) return;
    try {
      await supabase.from('tasks').delete().eq('id', taskId);
    } catch (err) {
      console.error('Failed to delete task from cloud:', err);
    }
  },

  // ----------------------------------------------------
  // MUSIC TRACKS
  // ----------------------------------------------------
  async fetchMusicTracks(userId: string): Promise<MusicTrack[]> {
    if (!isSupabaseConfigured || !userId) return [];

    try {
      const { data, error } = await supabase
        .from('user_music_tracks')
        .select('*')
        .eq('user_id', userId)
        .order('position', { ascending: true })
        .order('created_at', { ascending: true });

      if (error || !data) {
        console.error('Error fetching cloud music tracks:', error);
        return [];
      }

      return (data as DbMusicTrack[]).map((t) => ({
        id: t.id,
        title: t.title,
        artist: t.artist || '',
        url: t.url,
        youtubeId: t.youtube_id || undefined,
        thumbnailUrl: t.thumbnail_url || undefined,
        isPreset: t.is_preset ?? false,
      }));
    } catch (err) {
      console.error('Failed to sync music tracks from cloud:', err);
      return [];
    }
  },

  async upsertMusicTrack(userId: string, track: MusicTrack, position = 0): Promise<void> {
    if (!isSupabaseConfigured || !userId) return;

    try {
      const trackId = isValidUUID(track.id) ? track.id : generateUUID();

      await supabase.from('user_music_tracks').upsert({
        id: trackId,
        user_id: userId,
        title: track.title,
        artist: track.artist || null,
        url: track.url,
        youtube_id: track.youtubeId || null,
        thumbnail_url: track.thumbnailUrl || null,
        is_preset: track.isPreset || false,
        position,
        updated_at: new Date().toISOString(),
      } as never);
    } catch (err) {
      console.error('Failed to save music track to cloud:', err);
    }
  },

  async deleteMusicTrack(trackId: string): Promise<void> {
    if (!isSupabaseConfigured || !isValidUUID(trackId)) return;
    try {
      await supabase.from('user_music_tracks').delete().eq('id', trackId);
    } catch (err) {
      console.error('Failed to delete music track from cloud:', err);
    }
  },

  // ----------------------------------------------------
  // USER PROFILE & PREFERENCES
  // ----------------------------------------------------
  async fetchProfile(userId: string): Promise<DbProfile | null> {
    if (!isSupabaseConfigured || !userId) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) return null;
      return data as DbProfile;
    } catch {
      return null;
    }
  },

  async updateProfile(userId: string, updates: { fullName?: string; avatarUrl?: string; dailyQuote?: string; themePreference?: string }) {
    if (!isSupabaseConfigured || !userId) return;
    try {
      await supabase.from('profiles').upsert({
        id: userId,
        full_name: updates.fullName,
        avatar_url: updates.avatarUrl,
        daily_quote: updates.dailyQuote,
        theme_preference: updates.themePreference,
        updated_at: new Date().toISOString(),
      } as never);
    } catch (err) {
      console.error('Failed to update cloud profile:', err);
    }
  },

  // ----------------------------------------------------
  // INITIAL SEEDING / MIGRATION (LOCAL -> CLOUD)
  // ----------------------------------------------------
  async syncInitialLocalToCloud(userId: string, localTasks: Task[], localTracks: MusicTrack[]) {
    if (!isSupabaseConfigured || !userId) return;

    try {
      // 1. Sync Tasks
      const cloudTasks = await this.fetchTasks(userId);
      if (cloudTasks.length === 0 && localTasks.length > 0) {
        for (const t of localTasks) {
          await this.upsertTask(userId, t);
        }
      }

      // 2. Sync Custom Music Tracks
      const cloudTracks = await this.fetchMusicTracks(userId);
      if (cloudTracks.length === 0 && localTracks.length > 0) {
        for (let i = 0; i < localTracks.length; i++) {
          await this.upsertMusicTrack(userId, localTracks[i], i);
        }
      }
    } catch (err) {
      console.error('Initial local to cloud sync error:', err);
    }
  },
};
