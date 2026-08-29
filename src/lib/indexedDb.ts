import type { Note } from '../types/note.types';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const DB_NAME = 'PersonalSpaceDB';
const DB_VERSION = 1;
const STORE_NOTES = 'notesStore';

// Safe IndexedDB initialization with fallback
export const initNotesDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NOTES)) {
        const store = db.createObjectStore(STORE_NOTES, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
        store.createIndex('isPinned', 'isPinned', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Retrieve all notes from IndexedDB
export const getStoredNotes = async (): Promise<Note[]> => {
  try {
    const db = await initNotesDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NOTES, 'readonly');
      const store = tx.objectStore(STORE_NOTES);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = (request.result as Note[]) || [];
        // Sort: pinned first, then by updatedAt descending
        results.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    // Graceful fallback to localStorage
    return loadFromStorage<Note[]>('notes_items', []);
  }
};

// Retrieve a single note by ID
export const getStoredNoteById = async (id: string): Promise<Note | null> => {
  try {
    const db = await initNotesDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NOTES, 'readonly');
      const store = tx.objectStore(STORE_NOTES);
      const request = store.get(id);

      request.onsuccess = () => resolve((request.result as Note) || null);
      request.onerror = () => reject(request.error);
    });
  } catch {
    const localNotes = loadFromStorage<Note[]>('notes_items', []);
    return localNotes.find((n) => n.id === id) || null;
  }
};

// Save or update a note
export const saveStoredNote = async (note: Note): Promise<void> => {
  try {
    const db = await initNotesDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NOTES, 'readwrite');
      const store = tx.objectStore(STORE_NOTES);
      const request = store.put(note);

      request.onsuccess = () => {
        // Also keep localStorage updated as secondary backup
        const current = loadFromStorage<Note[]>('notes_items', []);
        const idx = current.findIndex((n) => n.id === note.id);
        if (idx !== -1) current[idx] = note;
        else current.unshift(note);
        saveToStorage('notes_items', current);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    const current = loadFromStorage<Note[]>('notes_items', []);
    const idx = current.findIndex((n) => n.id === note.id);
    if (idx !== -1) current[idx] = note;
    else current.unshift(note);
    saveToStorage('notes_items', current);
  }
};

// Delete a note
export const deleteStoredNote = async (id: string): Promise<void> => {
  try {
    const db = await initNotesDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NOTES, 'readwrite');
      const store = tx.objectStore(STORE_NOTES);
      const request = store.delete(id);

      request.onsuccess = () => {
        const current = loadFromStorage<Note[]>('notes_items', []);
        saveToStorage(
          'notes_items',
          current.filter((n) => n.id !== id)
        );
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    const current = loadFromStorage<Note[]>('notes_items', []);
    saveToStorage(
      'notes_items',
      current.filter((n) => n.id !== id)
    );
  }
};

// Batch save notes (e.g. from cloud sync or backup import)
export const saveAllStoredNotes = async (notes: Note[]): Promise<void> => {
  try {
    const db = await initNotesDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NOTES, 'readwrite');
      const store = tx.objectStore(STORE_NOTES);
      notes.forEach((n) => store.put(n));
      tx.oncomplete = () => {
        saveToStorage('notes_items', notes);
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    saveToStorage('notes_items', notes);
  }
};
