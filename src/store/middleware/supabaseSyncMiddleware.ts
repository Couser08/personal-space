import { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { supabaseSyncService } from '../../services/supabaseSyncService';

/**
 * Supabase Real-Time Background Sync Middleware
 * Listens to Redux actions and transparently syncs Tasks, Subtasks, and Music to Supabase.
 */
export const supabaseSyncMiddleware: Middleware = (store) => (next) => (action) => {
  const previousState = store.getState() as RootState;
  const result = next(action);
  const nextState = store.getState() as RootState;

  const user = nextState.auth.user;
  if (!user || !user.id) {
    return result;
  }

  const act = action as { type: string; payload?: unknown };

  try {
    // ----------------------------------------------------
    // TASK & SUBTASK MUTATION SYNC
    // ----------------------------------------------------
    if (act.type.startsWith('tasks/')) {
      if (
        act.type === 'tasks/addTask' ||
        act.type === 'tasks/updateTask' ||
        act.type === 'tasks/toggleTaskCompleted' ||
        act.type === 'tasks/addSubtask' ||
        act.type === 'tasks/toggleSubtask' ||
        act.type === 'tasks/deleteSubtask'
      ) {
        // Find modified task(s) and upsert to cloud
        if (act.type === 'tasks/addTask') {
          const newTask = nextState.tasks.items[0];
          if (newTask) supabaseSyncService.upsertTask(user.id, newTask);
        } else if (act.type === 'tasks/updateTask') {
          const payload = act.payload as { id: string };
          const task = nextState.tasks.items.find((t) => t.id === payload.id);
          if (task) supabaseSyncService.upsertTask(user.id, task);
        } else if (act.type === 'tasks/toggleTaskCompleted') {
          const taskId = act.payload as string;
          const task = nextState.tasks.items.find((t) => t.id === taskId);
          if (task) supabaseSyncService.upsertTask(user.id, task);
        } else if (
          act.type === 'tasks/addSubtask' ||
          act.type === 'tasks/toggleSubtask' ||
          act.type === 'tasks/deleteSubtask'
        ) {
          const payload = act.payload as { taskId: string };
          const task = nextState.tasks.items.find((t) => t.id === payload.taskId);
          if (task) supabaseSyncService.upsertTask(user.id, task);
        }
      } else if (act.type === 'tasks/deleteTask') {
        const deletedTaskId = act.payload as string;
        supabaseSyncService.deleteTask(deletedTaskId);
      } else if (act.type === 'tasks/clearCompletedTasks') {
        const completedTasks = previousState.tasks.items.filter((t) => t.isCompleted);
        completedTasks.forEach((t) => supabaseSyncService.deleteTask(t.id));
      }
    }

    // ----------------------------------------------------
    // MUSIC TRACKS MUTATION SYNC
    // ----------------------------------------------------
    if (act.type.startsWith('music/')) {
      if (act.type === 'music/addTrack') {
        const newTrack = nextState.music.tracks[nextState.music.tracks.length - 1];
        if (newTrack) {
          supabaseSyncService.upsertMusicTrack(user.id, newTrack, nextState.music.tracks.length - 1);
        }
      } else if (act.type === 'music/removeTrack') {
        const removedTrackId = act.payload as string;
        supabaseSyncService.deleteMusicTrack(removedTrackId);
      }
    }

    // ----------------------------------------------------
    // PROFILE MUTATION SYNC
    // ----------------------------------------------------
    if (act.type === 'auth/updateProfile') {
      supabaseSyncService.updateProfile(user.id, {
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        dailyQuote: user.dailyQuote,
        themePreference: user.themePreference,
      });
    }
  } catch (err) {
    console.error('Supabase sync middleware error:', err);
  }

  return result;
};
