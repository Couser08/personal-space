import React, { useState, useEffect, useRef, useCallback, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import {
  X,
  Pin,
  Check,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeNoteModal, showToast } from '../../store/slices/uiSlice';
import {
  NOTES_QUERY_KEY,
  useSaveNoteMutation,
  useDeleteNoteMutation,
} from './hooks/useNotesQuery';
import { NoteToolbar, EditorViewMode } from './NoteToolbar';
import { MarkdownPreviewPane } from './MarkdownPreviewPane';
import { NoteTextarea, NoteTextareaHandle } from './NoteTextarea';
import { getNoteStats } from '../../utils/markdownUtils';
import type { Note, NoteColor, NoteCategoryTag } from '../../types/note.types';
import { sound } from '../../lib/sound';

export const NoteEditorModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const isOpen = useAppSelector((state) => state.ui.isNoteModalOpen);
  const editingNoteId = useAppSelector((state) => state.ui.editingNoteId);

  const saveNoteMutation = useSaveNoteMutation();
  const deleteNoteMutation = useDeleteNoteMutation();

  const [activeNoteId, setActiveNoteId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [colorTheme, setColorTheme] = useState<NoteColor>('lavender');
  const [isPinned, setIsPinned] = useState(false);
  const [tags, setTags] = useState<NoteCategoryTag[]>([]);
  const [viewMode, setViewMode] = useState<EditorViewMode>('split');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('saved');

  const noteTextareaRef = useRef<NoteTextareaHandle>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitializedRef = useRef(false);
  const activeNoteIdRef = useRef('');

  // Keep activeNoteIdRef in sync
  useEffect(() => {
    activeNoteIdRef.current = activeNoteId;
  }, [activeNoteId]);

  // Set default view mode based on screen width on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setViewMode('edit');
    } else {
      setViewMode('split');
    }
  }, []);

  // Initialize note state ONCE when modal opens
  useEffect(() => {
    if (!isOpen) {
      isInitializedRef.current = false;
      return;
    }

    if (isInitializedRef.current) return;

    if (editingNoteId) {
      const cachedNotes = queryClient.getQueryData<Note[]>(NOTES_QUERY_KEY) || [];
      const existing = cachedNotes.find((n) => n.id === editingNoteId);
      if (existing) {
        setActiveNoteId(existing.id);
        setTitle(existing.title === 'Untitled Note' ? '' : existing.title);
        setContent(existing.content);
        setColorTheme(existing.colorTheme);
        setIsPinned(existing.isPinned);
        setTags(existing.tags || []);
        setSaveStatus('saved');
        isInitializedRef.current = true;
        return;
      }
    }

    // New note initialization
    const newId = crypto.randomUUID ? crypto.randomUUID() : `note-${Date.now()}`;
    setActiveNoteId(newId);
    setTitle('');
    setContent('');
    setColorTheme('lavender');
    setIsPinned(false);
    setTags([]);
    setSaveStatus('saved');
    isInitializedRef.current = true;
  }, [isOpen, editingNoteId, queryClient]);

  // Non-blocking 500ms Debounced Auto-Save
  const triggerAutoSave = useCallback(
    (
      currentTitle: string,
      currentContent: string,
      currentTheme: NoteColor,
      currentPinned: boolean,
      currentTags: NoteCategoryTag[]
    ) => {
      if (!isInitializedRef.current || !isOpen) return;

      if (!currentTitle.trim() && !currentContent.trim()) {
        setSaveStatus('saved');
        return;
      }

      setSaveStatus('saving');
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

      const targetId = activeNoteIdRef.current;

      debounceTimerRef.current = setTimeout(async () => {
        const noteToSave: Note = {
          id: targetId,
          userId: 'local-user',
          title: currentTitle.trim() || 'Untitled Note',
          content: currentContent,
          colorTheme: currentTheme,
          isPinned: currentPinned,
          tags: currentTags,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          synced: false,
        };

        try {
          await saveNoteMutation.mutateAsync(noteToSave);
          setSaveStatus('saved');
        } catch {
          setSaveStatus('saved');
        }
      }, 500);
    },
    [isOpen, saveNoteMutation]
  );

  const handleTitleChange = (val: string) => {
    setTitle(val);
    triggerAutoSave(val, content, colorTheme, isPinned, tags);
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    triggerAutoSave(title, val, colorTheme, isPinned, tags);
  };

  const handleColorChange = (c: NoteColor) => {
    sound.playClick();
    setColorTheme(c);
    triggerAutoSave(title, content, c, isPinned, tags);
  };

  const handlePinToggle = () => {
    sound.playClick();
    const nextPin = !isPinned;
    setIsPinned(nextPin);
    triggerAutoSave(title, content, colorTheme, nextPin, tags);
  };

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      sound.playClick();
      const updatedTags = [...tags, trimmed];
      setTags(updatedTags);
      triggerAutoSave(title, content, colorTheme, isPinned, updatedTags);
    }
  };

  const handleRemoveTag = (tag: string) => {
    sound.playClick();
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
    triggerAutoSave(title, content, colorTheme, isPinned, updatedTags);
  };

  const handleToggleCheckboxInPreview = useCallback(
    (lineIndex: number, lineText: string) => {
      sound.playClick();
      setContent((prev) => {
        const lines = prev.split('\n');
        if (lines[lineIndex] !== undefined) {
          if (lineText.startsWith('- [x] ') || lineText.startsWith('- [X] ')) {
            lines[lineIndex] = lineText.replace(/^- \[[xX]\] /, '- [ ] ');
          } else if (lineText.startsWith('- [ ] ')) {
            lines[lineIndex] = lineText.replace(/^- \[ \] /, '- [x] ');
          }
          const newContent = lines.join('\n');
          triggerAutoSave(title, newContent, colorTheme, isPinned, tags);
          return newContent;
        }
        return prev;
      });
    },
    [title, colorTheme, isPinned, tags, triggerAutoSave]
  );

  const handleFormat = useCallback(
    (format: Parameters<typeof NoteToolbar>[0]['onFormat'] extends (f: infer F) => void ? F : never) => {
      noteTextareaRef.current?.applyFormat(format);
    },
    []
  );

  const handleForceSave = useCallback(() => {
    if (title.trim() || content.trim()) {
      const noteToSave: Note = {
        id: activeNoteIdRef.current,
        userId: 'local-user',
        title: title.trim() || 'Untitled Note',
        content,
        colorTheme,
        isPinned,
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveNoteMutation.mutate(noteToSave);
      setSaveStatus('saved');
      sound.playComplete();
      dispatch(showToast({ message: 'Note saved 🌿', type: 'success' }));
    }
  }, [title, content, colorTheme, isPinned, tags, saveNoteMutation, dispatch]);

  const handleDelete = async () => {
    if (activeNoteId) {
      await deleteNoteMutation.mutateAsync(activeNoteId);
      dispatch(showToast({ message: 'Note deleted', type: 'info' }));
      dispatch(closeNoteModal());
    }
  };

  const handleClose = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (title.trim() || content.trim()) {
      const noteToSave: Note = {
        id: activeNoteIdRef.current,
        userId: 'local-user',
        title: title.trim() || 'Untitled Note',
        content,
        colorTheme,
        isPinned,
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveNoteMutation.mutate(noteToSave);
    }
    dispatch(closeNoteModal());
  };

  // Background deferred stats calculation to eliminate typing lag
  const deferredContent = useDeferredValue(content);
  const stats = getNoteStats(deferredContent);

  const themeColors: { id: NoteColor; label: string; dot: string }[] = [
    { id: 'lavender', label: 'Soft Lavender', dot: 'bg-[#C7C9F5]' },
    { id: 'sand', label: 'Warm Sand', dot: 'bg-[#F2E8D5]' },
    { id: 'sage', label: 'Mint Sage', dot: 'bg-[#6BAA7A]' },
    { id: 'rose', label: 'Soft Rose', dot: 'bg-[#F8B4B4]' },
    { id: 'slate', label: 'Cool Slate', dot: 'bg-[#97A4BA]' },
  ];

  const suggestedTags: NoteCategoryTag[] = ['Ideas', 'Study', 'Work', 'Personal', 'Reflection'];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
          className="relative w-full max-w-5xl bg-white dark:bg-[#1A1F21] rounded-3xl shadow-float border border-[#EEF0EC] dark:border-[#273033] flex flex-col max-h-[92vh] overflow-hidden z-10"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEF0EC] dark:border-[#273033]">
            <input
              type="text"
              placeholder="Untitled Note..."
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="font-serif text-xl font-bold bg-transparent text-[#1F2937] dark:text-[#F3F4F6] placeholder-[#9CA3AF] outline-none flex-1 mr-4"
              autoFocus
            />

            <div className="flex items-center gap-2 shrink-0">
              {/* Auto-Save Indicator */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#FAFBF9] dark:bg-[#121516] border border-[#EEF0EC] dark:border-[#2E373A]">
                {saveStatus === 'saving' ? (
                  <span className="flex items-center gap-1 text-[#C4A97D] animate-pulse font-semibold">
                    <Sparkles className="w-3 h-3" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[#6BAA7A] font-semibold">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                    Saved 🌿
                  </span>
                )}
              </div>

              {/* Pin */}
              <button
                type="button"
                onClick={handlePinToggle}
                title={isPinned ? 'Unpin' : 'Pin to top'}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isPinned
                    ? 'bg-[#EAF2EC] dark:bg-[#1E2E23] text-[#6BAA7A]'
                    : 'text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white hover:bg-black/5'
                }`}
              >
                <Pin className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
              </button>

              {/* Delete */}
              {editingNoteId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  title="Delete Note"
                  className="p-2 rounded-xl text-[#9CA3AF] hover:text-[#E05656] hover:bg-[#FDE8E8]/50 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* Close */}
              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-xl text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white hover:bg-black/5 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub-Header: Theme & Tags */}
          <div className="px-6 py-2.5 bg-[#FAFBF9] dark:bg-[#121516] border-b border-[#EEF0EC] dark:border-[#273033] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[#9CA3AF] font-medium text-[11px] mr-1">Theme:</span>
              {themeColors.map((tc) => (
                <button
                  key={tc.id}
                  type="button"
                  onClick={() => handleColorChange(tc.id)}
                  title={tc.label}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${tc.dot} ${
                    colorTheme === tc.id ? 'ring-2 ring-offset-2 ring-[#6BAA7A] scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {colorTheme === tc.id && <Check className="w-3.5 h-3.5 text-[#1F2937]" />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white dark:bg-[#202528] text-[#4F5D75] dark:text-[#CBD2DC] border border-[#E5E7EB] dark:border-[#2E373A] text-[11px] font-medium shadow-2xs"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-[#9CA3AF] hover:text-[#E05656] cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1">
                {suggestedTags
                  .filter((st) => !tags.includes(st))
                  .slice(0, 3)
                  .map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleAddTag(st)}
                      className="px-2 py-0.5 rounded-lg text-[10px] text-[#9CA3AF] hover:text-[#6BAA7A] hover:bg-[#EAF2EC] transition-colors cursor-pointer"
                    >
                      + {st}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="px-6 py-2 border-b border-[#EEF0EC] dark:border-[#273033]">
            <NoteToolbar
              onFormat={handleFormat}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>

          {/* Body Viewports */}
          <div className="flex-1 overflow-y-auto p-6 min-h-[340px]">
            {viewMode === 'edit' && (
              <NoteTextarea
                ref={noteTextareaRef}
                value={content}
                onChange={handleContentChange}
                onSaveShortcut={handleForceSave}
              />
            )}

            {viewMode === 'split' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-[340px]">
                <div className="flex flex-col h-full border-b md:border-b-0 md:border-r border-[#EEF0EC] dark:border-[#273033] pb-4 md:pb-0 md:pr-4">
                  <div className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Markdown Input</span>
                    <span className="text-[9px] text-[#9CA3AF]">Ctrl+B, Ctrl+I, Ctrl+S</span>
                  </div>
                  <NoteTextarea
                    ref={noteTextareaRef}
                    value={content}
                    onChange={handleContentChange}
                    onSaveShortcut={handleForceSave}
                  />
                </div>
                <div className="flex flex-col h-full overflow-hidden pl-0 md:pl-2">
                  <div className="text-[10px] font-semibold text-[#6BAA7A] uppercase tracking-wider mb-2">
                    Live Formatted Preview
                  </div>
                  <MarkdownPreviewPane
                    rawContent={content}
                    onToggleCheckbox={handleToggleCheckboxInPreview}
                  />
                </div>
              </div>
            )}

            {viewMode === 'preview' && (
              <div className="min-h-[340px] max-w-3xl mx-auto py-2">
                <MarkdownPreviewPane
                  rawContent={content}
                  onToggleCheckbox={handleToggleCheckboxInPreview}
                />
              </div>
            )}
          </div>

          {/* Footer Metrics */}
          <div className="px-6 py-3 bg-[#FAFBF9] dark:bg-[#121516] border-t border-[#EEF0EC] dark:border-[#273033] flex items-center justify-between text-[11px] text-[#9CA3AF]">
            <div className="flex items-center gap-4">
              <span>{stats.wordCount} words</span>
              <span>{stats.charCount} characters</span>
              <span>~{stats.readTimeMins} min read</span>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-1.5 rounded-xl bg-[#6BAA7A] hover:bg-[#558E63] text-white font-medium transition-colors cursor-pointer shadow-xs text-xs"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
