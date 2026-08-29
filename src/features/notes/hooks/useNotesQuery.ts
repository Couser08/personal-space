import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Note } from '../../../types/note.types';
import type { Database } from '../../../types/supabase.types';
import {
  getStoredNotes,
  saveStoredNote,
  deleteStoredNote,
  saveAllStoredNotes,
} from '../../../lib/indexedDb';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

type DbNote = Database['public']['Tables']['notes']['Row'];

export const NOTES_QUERY_KEY = ['notes'];

// Hook to fetch notes with instant IndexedDB hydration + background Supabase sync
export const useNotes = () => {
  return useQuery<Note[]>({
    queryKey: NOTES_QUERY_KEY,
    queryFn: async () => {
      // 1. Fetch instantly from local IndexedDB
      const localNotes = await getStoredNotes();

      // 2. If Supabase is connected, background sync
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data, error } = await supabase
              .from('notes')
              .select('*')
              .order('created_at', { ascending: false });

            const cloudNotes = data as DbNote[] | null;

            if (!error && cloudNotes && cloudNotes.length > 0) {
              const mappedCloudNotes: Note[] = cloudNotes.map((cn) => ({
                id: cn.id,
                userId: cn.user_id,
                title: cn.title,
                content: cn.content || '',
                colorTheme: cn.color_theme,
                isPinned: cn.is_pinned || false,
                tags: cn.tags || [],
                createdAt: cn.created_at,
                updatedAt: cn.updated_at,
                synced: true,
              }));

              // Merge local notes and cloud notes
              const mergedMap = new Map<string, Note>();
              localNotes.forEach((n) => mergedMap.set(n.id, n));
              mappedCloudNotes.forEach((n) => mergedMap.set(n.id, n));

              const mergedList = Array.from(mergedMap.values());
              await saveAllStoredNotes(mergedList);
              return mergedList;
            }
          }
        } catch {
          // Keep using IndexedDB silently if network/auth fails
        }
      }

      return localNotes;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes stale time to avoid repeated fetches
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
  });
};

// Hook for saving/updating notes with optimistic cache & background cloud sync
export const useSaveNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: Note) => {
      // 1. Save to local IndexedDB
      await saveStoredNote(note);

      // 2. Save to Supabase in the background if connected
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await supabase.from('notes').upsert({
              id: note.id,
              user_id: session.user.id,
              title: note.title,
              content: note.content,
              color_theme: note.colorTheme,
              is_pinned: note.isPinned,
              tags: note.tags || [],
              updated_at: new Date().toISOString(),
            } as never);
          }
        } catch {
          // IndexedDB already saved safely
        }
      }

      return note;
    },
    onMutate: async (newNote: Note) => {
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: NOTES_QUERY_KEY });
      const previousNotes = queryClient.getQueryData<Note[]>(NOTES_QUERY_KEY) || [];

      const exists = previousNotes.some((n) => n.id === newNote.id);
      let updated: Note[];
      if (exists) {
        updated = previousNotes.map((n) => (n.id === newNote.id ? newNote : n));
      } else {
        updated = [newNote, ...previousNotes];
      }

      // Re-sort: pinned first
      updated.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });

      queryClient.setQueryData(NOTES_QUERY_KEY, updated);
      return { previousNotes };
    },
    onError: (_err, _newNote, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(NOTES_QUERY_KEY, context.previousNotes);
      }
    },
  });
};

// Hook for deleting notes with optimistic cache update
export const useDeleteNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteStoredNote(id);
      if (isSupabaseConfigured) {
        try {
          await supabase.from('notes').delete().eq('id', id);
        } catch {
          // IndexedDB delete already succeeded
        }
      }
      return id;
    },
    onMutate: async (deletedId: string) => {
      await queryClient.cancelQueries({ queryKey: NOTES_QUERY_KEY });
      const previousNotes = queryClient.getQueryData<Note[]>(NOTES_QUERY_KEY) || [];
      queryClient.setQueryData(
        NOTES_QUERY_KEY,
        previousNotes.filter((n) => n.id !== deletedId)
      );
      return { previousNotes };
    },
    onError: (_err, _id, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(NOTES_QUERY_KEY, context.previousNotes);
      }
    },
  });
};

// Hook to toggle pinning a note
export const useTogglePinNoteMutation = () => {
  const saveNoteMutation = useSaveNoteMutation();

  return useMutation({
    mutationFn: async (note: Note) => {
      const updatedNote: Note = {
        ...note,
        isPinned: !note.isPinned,
        updatedAt: new Date().toISOString(),
      };
      return saveNoteMutation.mutateAsync(updatedNote);
    },
  });
};
