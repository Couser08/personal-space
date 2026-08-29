import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, BookOpen, Pin } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { NoteCard } from './NoteCard';
import { useNotes } from './hooks/useNotesQuery';
import { useAppDispatch } from '../../store';
import { openNoteModal } from '../../store/slices/uiSlice';
import type { NoteColor, NoteFilterTab } from '../../types/note.types';
import { sound } from '../../lib/sound';

export const NotesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: notes = [], isLoading } = useNotes();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<NoteFilterTab>('all');
  const [selectedColor, setSelectedColor] = useState<NoteColor | 'all'>('all');

  const handleOpenCreate = () => {
    sound.playClick();
    dispatch(openNoteModal());
  };

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = note.title.toLowerCase().includes(q);
      const matchContent = note.content.toLowerCase().includes(q);
      const matchTags = (note.tags || []).some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchTags) return false;
    }

    // Color filter
    if (selectedColor !== 'all' && note.colorTheme !== selectedColor) {
      return false;
    }

    // Tab / Category filter
    if (activeFilter === 'pinned') return note.isPinned;
    if (activeFilter !== 'all') {
      return (note.tags || []).includes(activeFilter);
    }

    return true;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const otherNotes = filteredNotes.filter((n) => !n.isPinned);

  const filterTabs: { id: NoteFilterTab; label: string }[] = [
    { id: 'all', label: 'All Notes' },
    { id: 'pinned', label: 'Pinned' },
    { id: 'Ideas', label: 'Ideas' },
    { id: 'Study', label: 'Study' },
    { id: 'Work', label: 'Work' },
    { id: 'Personal', label: 'Personal' },
    { id: 'Reflection', label: 'Reflection' },
  ];

  const colorOptions: { id: NoteColor | 'all'; label: string; dot: string }[] = [
    { id: 'all', label: 'All Colors', dot: 'bg-[#9CA3AF]' },
    { id: 'lavender', label: 'Lavender', dot: 'bg-[#C7C9F5]' },
    { id: 'sand', label: 'Sand', dot: 'bg-[#F2E8D5]' },
    { id: 'sage', label: 'Sage', dot: 'bg-[#6BAA7A]' },
    { id: 'rose', label: 'Rose', dot: 'bg-[#F8B4B4]' },
    { id: 'slate', label: 'Slate', dot: 'bg-[#97A4BA]' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-6xl mx-auto pb-10"
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
            Notes & Knowledge Garden
          </h2>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
            Capture thoughts, organize concepts, and cultivate wisdom.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-md"
        >
          New Note
        </Button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-[#1A1F21] p-4.5 rounded-2xl border border-[#EEF0EC] dark:border-[#273033] shadow-card space-y-3.5">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search notes by title, markdown content, or #tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAFBF9] dark:bg-[#121516] text-xs text-[#1F2937] dark:text-[#F3F4F6] placeholder-[#9CA3AF] rounded-xl pl-9 pr-4 py-2.5 border border-[#E5E7EB] dark:border-[#2E373A] focus:border-[#6BAA7A] outline-none transition-colors"
          />
        </div>

        {/* Filter Tabs & Color Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveFilter(tab.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#6BAA7A] text-white shadow-xs'
                    : 'bg-[#FAFBF9] dark:bg-[#121516] text-[#4F5D75] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white border border-[#EEF0EC] dark:border-[#2E373A]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Color Filter Dots */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#9CA3AF] mr-1">Color:</span>
            {colorOptions.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedColor(c.id);
                }}
                title={c.label}
                className={`w-5 h-5 rounded-full ${c.dot} transition-all cursor-pointer ${
                  selectedColor === c.id
                    ? 'ring-2 ring-offset-2 ring-[#6BAA7A] scale-110'
                    : 'opacity-60 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Notes Content Display */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-6 h-6" />}
          title={searchQuery ? 'No matching notes found' : 'Your knowledge garden is empty'}
          description={
            searchQuery
              ? 'Try searching with different keywords or clearing active filters.'
              : 'Write down study notes, brainstorm ideas, or keep a daily journal.'
          }
          actionLabel="Create Note"
          onAction={handleOpenCreate}
          className="py-14"
        />
      ) : (
        <div className="space-y-6">
          {/* Pinned Notes Section */}
          {pinnedNotes.length > 0 && activeFilter !== 'pinned' && (
            <div>
              <div className="flex items-center gap-2 mb-3 px-1 text-xs font-semibold text-[#6BAA7A] dark:text-[#82C291] uppercase tracking-wider">
                <Pin className="w-3.5 h-3.5 fill-current" />
                <span>Pinned Notes ({pinnedNotes.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {pinnedNotes.map((note) => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Other Notes Section */}
          <div>
            {pinnedNotes.length > 0 && otherNotes.length > 0 && activeFilter !== 'pinned' && (
              <div className="mb-3 px-1 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                <span>Other Notes ({otherNotes.length})</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {(activeFilter === 'pinned' ? pinnedNotes : otherNotes).map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
