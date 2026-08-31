export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          daily_quote: string | null;
          theme_preference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          daily_quote?: string | null;
          theme_preference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          daily_quote?: string | null;
          theme_preference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          priority: 'high' | 'medium' | 'low';
          category: string;
          due_date: string | null;
          due_time: string | null;
          is_completed: boolean;
          completed_at: string | null;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          priority?: 'high' | 'medium' | 'low';
          category?: string;
          due_date?: string | null;
          due_time?: string | null;
          is_completed?: boolean;
          completed_at?: string | null;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          priority?: 'high' | 'medium' | 'low';
          category?: string;
          due_date?: string | null;
          due_time?: string | null;
          is_completed?: boolean;
          completed_at?: string | null;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      subtasks: {
        Row: {
          id: string;
          task_id: string;
          title: string;
          is_completed: boolean;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          title: string;
          is_completed?: boolean;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          title?: string;
          is_completed?: boolean;
          position?: number;
          created_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          color_theme: 'lavender' | 'sand' | 'sage' | 'rose' | 'slate';
          is_pinned: boolean;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content?: string;
          color_theme?: 'lavender' | 'sand' | 'sage' | 'rose' | 'slate';
          is_pinned?: boolean;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          color_theme?: 'lavender' | 'sand' | 'sage' | 'rose' | 'slate';
          is_pinned?: boolean;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      mood_logs: {
        Row: {
          id: string;
          user_id: string;
          mood: 'great' | 'good' | 'okay' | 'not_great' | 'bad';
          note: string | null;
          log_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mood: 'great' | 'good' | 'okay' | 'not_great' | 'bad';
          note?: string | null;
          log_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          mood?: 'great' | 'good' | 'okay' | 'not_great' | 'bad';
          note?: string | null;
          log_date?: string;
          created_at?: string;
        };
      };
      focus_sessions: {
        Row: {
          id: string;
          user_id: string;
          duration_minutes: number;
          session_type: string;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          duration_minutes?: number;
          session_type?: string;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          duration_minutes?: number;
          session_type?: string;
          completed_at?: string;
        };
      };
      user_music_tracks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          artist: string | null;
          url: string;
          youtube_id: string | null;
          thumbnail_url: string | null;
          is_preset: boolean;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          artist?: string | null;
          url: string;
          youtube_id?: string | null;
          thumbnail_url?: string | null;
          is_preset?: boolean;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          artist?: string | null;
          url?: string;
          youtube_id?: string | null;
          thumbnail_url?: string | null;
          is_preset?: boolean;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
