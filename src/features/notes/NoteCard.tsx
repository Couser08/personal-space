import React from 'react';
import { motion } from 'framer-motion';
import { Pin, Trash2, Clock } from 'lucide-react';
import type { Note, NoteColor } from '../../types/note.types';
import { useTogglePinNoteMutation, useDeleteNoteMutation } from './hooks/useNotesQuery';
import { useAppDispatch } from '../../store';
import { openNoteModal, showToast } from '../../store/slices/uiSlice';
import { renderInlineMarkdown } from '../../utils/markdownUtils';
import { formatRelativeTime } from '../../utils/dateUtils';
import { sound } from '../../lib/sound';

interface NoteCardProps {
  note: Note;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const dispatch = useAppDispatch();
  const togglePinMutation = useTogglePinNoteMutation();
  const deleteMutation = useDeleteNoteMutation();

  const handleCardClick = () => {
    sound.playClick();
    dispatch(openNoteModal(note.id));
  };

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    togglePinMutation.mutate(note);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    deleteMutation.mutate(note.id);
    dispatch(showToast({ message: 'Note deleted', type: 'info' }));
  };

  // Color theme class mappings
  const themeStyles: Record<
    NoteColor,
    { cardBg: string; border: string; accent: string; tagBg: string }
  > = {
    lavender: {
      cardBg: 'bg-[#ECEEFB] dark:bg-[#1C1F33]',
      border: 'border-[#DBDEF8] dark:border-[#2D3254]',
      accent: 'text-[#7B7FD4]',
      tagBg: 'bg-[#DBDEF8]/60 dark:bg-[#2D3254] text-[#2D3169] dark:text-[#E8EAFF]',
    },
    sand: {
      cardBg: 'bg-[#FAF5EB] dark:bg-[#282216]',
      border: 'border-[#F2E8D5] dark:border-[#423727]',
      accent: 'text-[#A38250]',
      tagBg: 'bg-[#F2E8D5]/70 dark:bg-[#423727] text-[#523F21] dark:text-[#F7EFE3]',
    },
    sage: {
      cardBg: 'bg-[#EAF2EC] dark:bg-[#16251A]',
      border: 'border-[#D2E4D6] dark:border-[#253D2C]',
      accent: 'text-[#6BAA7A]',
      tagBg: 'bg-[#D2E4D6]/70 dark:bg-[#253D2C] text-[#24422B] dark:text-[#D7EEDD]',
    },
    rose: {
      cardBg: 'bg-[#FDE8E8] dark:bg-[#291717]',
      border: 'border-[#F8B4B4] dark:border-[#452424]',
      accent: 'text-[#E05656]',
      tagBg: 'bg-[#F8B4B4]/60 dark:bg-[#452424] text-[#5C1D1D] dark:text-[#FFD5D5]',
    },
    slate: {
      cardBg: 'bg-[#F1F3F6] dark:bg-[#1C2229]',
      border: 'border-[#E2E6EB] dark:border-[#2D3743]',
      accent: 'text-[#6B7B95]',
      tagBg: 'bg-[#E2E6EB]/70 dark:bg-[#2D3743] text-[#2D3648] dark:text-[#E2E6EB]',
    },
  };

  const style = themeStyles[note.colorTheme || 'lavender'];

  // Snippet lines (up to 4 lines)
  const previewLines = note.content
    .split('\n')
    .filter((l) => l.trim().length > 0)
    .slice(0, 4);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      onClick={handleCardClick}
      className={`relative group rounded-2xl p-4.5 border ${style.border} ${style.cardBg} shadow-xs hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between overflow-hidden min-h-[160px]`}
    >
      {/* Top Header: Title & Action Buttons */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-serif text-base font-bold text-[#1F2937] dark:text-[#F3F4F6] line-clamp-2 leading-snug">
            {note.title || 'Untitled Note'}
          </h3>

          <div className="flex items-center gap-1 shrink-0">
            {/* Pin Button */}
            <button
              type="button"
              onClick={handleTogglePin}
              title={note.isPinned ? 'Unpin' : 'Pin to top'}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                note.isPinned
                  ? `${style.accent} bg-white/50 dark:bg-black/20`
                  : 'text-[#9CA3AF] opacity-0 group-hover:opacity-100 hover:text-[#1F2937] hover:bg-white/40'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-current' : ''}`} />
            </button>

            {/* Delete Button */}
            <button
              type="button"
              onClick={handleDelete}
              title="Delete note"
              className="p-1.5 rounded-lg text-[#9CA3AF] opacity-0 group-hover:opacity-100 hover:text-[#E05656] hover:bg-white/40 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Snippet */}
        {previewLines.length > 0 ? (
          <div className="space-y-1 my-2">
            {previewLines.map((line, idx) => {
              const isCheck = line.trim().startsWith('- [ ]') || line.trim().startsWith('- [x]');
              const isChecked = line.trim().startsWith('- [x]');
              const lineText = isCheck ? line.trim().substring(5) : line;

              return (
                <p
                  key={idx}
                  className={`text-xs line-clamp-1 ${
                    isChecked
                      ? 'line-through text-[#9CA3AF] dark:text-[#6B7280]'
                      : 'text-[#374151] dark:text-[#D1D5DB]'
                  }`}
                >
                  {isCheck && (
                    <span className="mr-1.5 font-bold text-[#6BAA7A]">
                      {isChecked ? '✓' : '○'}
                    </span>
                  )}
                  {renderInlineMarkdown(lineText)}
                </p>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-[#9CA3AF] italic my-2">Empty note...</p>
        )}
      </div>

      {/* Footer: Tags & Timestamp */}
      <div className="pt-3 mt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2 text-[11px]">
        {/* Category Tags */}
        <div className="flex items-center gap-1 flex-wrap overflow-hidden">
          {(note.tags || []).slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${style.tagBg}`}
            >
              #{tag}
            </span>
          ))}
          {(note.tags || []).length > 2 && (
            <span className="text-[10px] text-[#9CA3AF]">
              +{(note.tags || []).length - 2}
            </span>
          )}
        </div>

        {/* Relative Timestamp */}
        <div className="flex items-center gap-1 text-[#9CA3AF] shrink-0">
          <Clock className="w-3 h-3" />
          <span>{formatRelativeTime(note.updatedAt || note.createdAt)}</span>
        </div>
      </div>
    </motion.div>
  );
};
