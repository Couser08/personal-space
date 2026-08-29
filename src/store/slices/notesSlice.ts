import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Note, NoteColor, NoteCategoryTag } from '../../types/note.types';
import { loadFromStorage, saveToStorage } from '../../utils/storage';

interface NotesState {
  items: Note[];
  isLoading: boolean;
}

const initialState: NotesState = {
  items: loadFromStorage<Note[]>('notes_items', []),
  isLoading: false,
};

export const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.items = action.payload;
      saveToStorage('notes_items', state.items);
    },
    addNote: (
      state,
      action: PayloadAction<{
        title: string;
        content: string;
        colorTheme: NoteColor;
        tags?: NoteCategoryTag[];
      }>
    ) => {
      const now = new Date().toISOString();
      const newNote: Note = {
        id: crypto.randomUUID ? crypto.randomUUID() : `note-${Date.now()}`,
        userId: 'local-user',
        title: action.payload.title,
        content: action.payload.content,
        colorTheme: action.payload.colorTheme,
        isPinned: false,
        tags: action.payload.tags || [],
        createdAt: now,
        updatedAt: now,
      };
      state.items.unshift(newNote);
      saveToStorage('notes_items', state.items);
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((n) => n.id !== action.payload);
      saveToStorage('notes_items', state.items);
    },
    togglePinNote: (state, action: PayloadAction<string>) => {
      const note = state.items.find((n) => n.id === action.payload);
      if (note) {
        note.isPinned = !note.isPinned;
        saveToStorage('notes_items', state.items);
      }
    },
  },
});

export const { setNotes, addNote, deleteNote, togglePinNote } = notesSlice.actions;
export default notesSlice.reducer;
