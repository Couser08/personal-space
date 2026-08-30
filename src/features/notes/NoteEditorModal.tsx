import React, { useState, useEffect, useRef, useCallback, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { X, Pin, Check, Trash2, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeNoteModal, showToast } from '../../store/slices/uiSlice';
import { NOTES_QUERY_KEY, useSaveNoteMutation, useDeleteNoteMutation } from './hooks/useNotesQuery';
import { NoteToolbar, EditorViewMode } from './NoteToolbar';
import { MarkdownPreviewPane } from './MarkdownPreviewPane';
import { NoteTextarea, NoteTextareaHandle } from './NoteTextarea';
import { getNoteStats } from '../../utils/markdownUtils';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
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

  useEffect(() => { activeNoteIdRef.current = activeNoteId; }, [activeNoteId]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) setViewMode('edit');
    else setViewMode('split');
  }, []);

  useEffect(() => {
    if (!isOpen) { isInitializedRef.current = false; return; }
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

  const triggerAutoSave = useCallback((t: string, c: string, theme: NoteColor, pinned: boolean, tg: NoteCategoryTag[]) => {
    if (!isInitializedRef.current || !isOpen) return;
    if (!t.trim() && !c.trim()) { setSaveStatus('saved'); return; }
    setSaveStatus('saving');
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    const targetId = activeNoteIdRef.current;

    debounceTimerRef.current = setTimeout(async () => {
      const noteToSave: Note = {
        id: targetId,
        userId: 'local-user',
        title: t.trim() || 'Untitled Note',
        content: c,
        colorTheme: theme,
        isPinned: pinned,
        tags: tg,
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
  }, [isOpen, saveNoteMutation]);

  const handleTitleChange = (val: string) => { setTitle(val); triggerAutoSave(val, content, colorTheme, isPinned, tags); };
  const handleContentChange = (val: string) => { setContent(val); triggerAutoSave(title, val, colorTheme, isPinned, tags); };
  const handleColorChange = (c: NoteColor) => { sound.playClick(); setColorTheme(c); triggerAutoSave(title, content, c, isPinned, tags); };
  const handlePinToggle = () => { sound.playClick(); const nextPin = !isPinned; setIsPinned(nextPin); triggerAutoSave(title, content, colorTheme, nextPin, tags); };

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      sound.playClick();
      const updated = [...tags, trimmed];
      setTags(updated);
      triggerAutoSave(title, content, colorTheme, isPinned, updated);
    }
  };

  const handleRemoveTag = (tag: string) => {
    sound.playClick();
    const updated = tags.filter((t) => t !== tag);
    setTags(updated);
    triggerAutoSave(title, content, colorTheme, isPinned, updated);
  };

  const handleToggleCheckboxInPreview = useCallback((lineIndex: number, lineText: string) => {
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
  }, [title, colorTheme, isPinned, tags, triggerAutoSave]);

  const handleFormat = useCallback((format: Parameters<typeof NoteToolbar>[0]['onFormat'] extends (f: infer F) => void ? F : never) => {
    noteTextareaRef.current?.applyFormat(format);
  }, []);

  const handleForceSave = useCallback(() => {
    if (title.trim() || content.trim()) {
      saveNoteMutation.mutate({
        id: activeNoteIdRef.current,
        userId: 'local-user',
        title: title.trim() || 'Untitled Note',
        content,
        colorTheme,
        isPinned,
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setSaveStatus('saved');
      sound.playComplete();
      dispatch(showToast({ message: 'Note saved 🌿', type: 'success' }));
    }
  }, [title, content, colorTheme, isPinned, tags, saveNoteMutation, dispatch]);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleDeleteConfirm = async () => {
    sound.playClick();
    if (activeNoteId) {
      await deleteNoteMutation.mutateAsync(activeNoteId);
      dispatch(showToast({ message: 'Note deleted', type: 'info' }));
      setIsDeleteConfirmOpen(false);
      dispatch(closeNoteModal());
    }
  };

  const handleClose = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (title.trim() || content.trim()) {
      saveNoteMutation.mutate({
        id: activeNoteIdRef.current,
        userId: 'local-user',
        title: title.trim() || 'Untitled Note',
        content,
        colorTheme,
        isPinned,
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    dispatch(closeNoteModal());
  };

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
          className="relative w-full max-w-5xl bg-white dark:bg-[#1A1F21] rounded-2xl sm:rounded-3xl shadow-float border border-[#EEF0EC] dark:border-[#273033] flex flex-col max-h-[92vh] overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 sm:px-6 py-3 sm:py-4 border-b border-[#EEF0EC] dark:border-[#273033]">
            <input
              type="text"
              placeholder="Untitled Note..."
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="font-serif text-lg sm:text-xl font-bold bg-transparent text-[#1F2937] dark:text-[#F3F4F6] placeholder-[#9CA3AF] outline-none flex-1 mr-2 sm:mr-4 min-w-0"
              autoFocus
            />
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#FAFBF9] dark:bg-[#121516] border border-[#EEF0EC] dark:border-[#2E373A]">
                {saveStatus === 'saving' ? (
                  <span className="flex items-center gap-1 text-[#C4A97D] font-semibold"><Sparkles className="w-3 h-3 animate-pulse" /> Saving...</span>
                ) : (
                  <span className="flex items-center gap-1 text-[#6BAA7A] font-semibold"><Check className="w-3 h-3 stroke-[2.5]" /> Saved 🌿</span>
                )}
              </div>
              <button type="button" onClick={handlePinToggle} title={isPinned ? 'Unpin' : 'Pin'} className={`p-1.5 sm:p-2 rounded-xl cursor-pointer ${isPinned ? 'bg-[#EAF2EC] dark:bg-[#1E2E23] text-[#6BAA7A]' : 'text-[#9CA3AF] hover:text-[#1F2937]'}`}>
                <Pin className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
              </button>
              {editingNoteId && (
                <button type="button" onClick={() => { sound.playClick(); setIsDeleteConfirmOpen(true); }} title="Delete" className="p-1.5 sm:p-2 rounded-xl text-[#9CA3AF] hover:text-[#E05656] cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button type="button" onClick={handleClose} className="p-1.5 sm:p-2 rounded-xl text-[#9CA3AF] hover:text-[#1F2937] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub-Header: Theme & Tags */}
          <div className="px-3.5 sm:px-6 py-2 bg-[#FAFBF9] dark:bg-[#121516] border-b border-[#EEF0EC] dark:border-[#273033] flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[#9CA3AF] font-medium text-[11px] mr-0.5">Theme:</span>
              {themeColors.map((tc) => (
                <button key={tc.id} type="button" onClick={() => handleColorChange(tc.id)} className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center cursor-pointer ${tc.dot} ${colorTheme === tc.id ? 'ring-2 ring-offset-2 ring-[#6BAA7A] scale-110' : 'opacity-70'}`}>
                  {colorTheme === tc.id && <Check className="w-3 h-3 text-[#1F2937]" />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 flex-wrap">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white dark:bg-[#202528] text-[#4F5D75] dark:text-[#CBD2DC] border border-[#E5E7EB] dark:border-[#2E373A] text-[10px] font-medium shadow-2xs">
                  #{tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="text-[#9CA3AF] hover:text-[#E05656] cursor-pointer">×</button>
                </span>
              ))}
              <div className="flex items-center gap-1">
                {suggestedTags.filter((st) => !tags.includes(st)).slice(0, 2).map((st) => (
                  <button key={st} type="button" onClick={() => handleAddTag(st)} className="px-1.5 py-0.5 rounded-lg text-[10px] text-[#9CA3AF] hover:text-[#6BAA7A] hover:bg-[#EAF2EC] cursor-pointer">+ {st}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="px-3.5 sm:px-6 py-2 border-b border-[#EEF0EC] dark:border-[#273033]">
            <NoteToolbar onFormat={handleFormat} viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 min-h-[260px] sm:min-h-[340px]">
            {viewMode === 'edit' && <NoteTextarea ref={noteTextareaRef} value={content} onChange={handleContentChange} onSaveShortcut={handleForceSave} />}
            {viewMode === 'split' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 h-full min-h-[260px] sm:min-h-[340px]">
                <div className="flex flex-col h-full border-b md:border-b-0 md:border-r border-[#EEF0EC] dark:border-[#273033] pb-3 md:pb-0 md:pr-4">
                  <NoteTextarea ref={noteTextareaRef} value={content} onChange={handleContentChange} onSaveShortcut={handleForceSave} />
                </div>
                <div className="flex flex-col h-full overflow-hidden pl-0 md:pl-2">
                  <MarkdownPreviewPane rawContent={content} onToggleCheckbox={handleToggleCheckboxInPreview} />
                </div>
              </div>
            )}
            {viewMode === 'preview' && (
              <div className="min-h-[260px] sm:min-h-[340px] max-w-3xl mx-auto py-2">
                <MarkdownPreviewPane rawContent={content} onToggleCheckbox={handleToggleCheckboxInPreview} />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-3.5 sm:px-6 py-2.5 bg-[#FAFBF9] dark:bg-[#121516] border-t border-[#EEF0EC] dark:border-[#273033] flex items-center justify-between text-[11px] text-[#9CA3AF]">
            <div className="flex items-center gap-3">
              <span>{stats.wordCount} words</span>
              <span>{stats.charCount} chars</span>
            </div>
            <button type="button" onClick={handleClose} className="px-3.5 py-1.5 rounded-xl bg-[#6BAA7A] hover:bg-[#558E63] text-white font-semibold cursor-pointer shadow-xs text-xs">
              Done
            </button>
          </div>
        </motion.div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Note?"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </AnimatePresence>
  );
};
