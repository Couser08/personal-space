import React from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { useAppDispatch } from '../../store';
import { openNoteModal, setActiveTab } from '../../store/slices/uiSlice';
import { useNotes } from '../../features/notes/hooks/useNotesQuery';
import { formatRelativeTime } from '../../utils/dateUtils';
import { sound } from '../../lib/sound';

export const QuickNotesCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: notes = [] } = useNotes();

  const previewNotes = notes.slice(0, 3);

  const handleAddNote = () => {
    sound.playClick();
    dispatch(openNoteModal());
  };

  const handleViewAll = () => {
    sound.playClick();
    dispatch(setActiveTab('notes'));
  };

  const handleOpenNote = (id: string) => {
    sound.playClick();
    dispatch(openNoteModal(id));
  };

  const getThemeBg = (theme: string) => {
    switch (theme) {
      case 'sand':
        return 'bg-[#FAF5EB] dark:bg-[#282216] border-[#F2E8D5] dark:border-[#423727] text-[#523F21] dark:text-[#F7EFE3] hover:border-[#C4A97D]';
      case 'sage':
        return 'bg-[#EAF2EC] dark:bg-[#16251A] border-[#D2E4D6] dark:border-[#253D2C] text-[#24422B] dark:text-[#D7EEDD] hover:border-[#6BAA7A]';
      case 'rose':
        return 'bg-[#FDE8E8] dark:bg-[#291717] border-[#F8B4B4] dark:border-[#452424] text-[#5C1D1D] dark:text-[#FFD5D5] hover:border-[#E05656]';
      case 'slate':
        return 'bg-[#F1F3F6] dark:bg-[#1C2229] border-[#E2E6EB] dark:border-[#2D3743] text-[#2D3648] dark:text-[#E2E6EB] hover:border-[#6B7B95]';
      case 'lavender':
      default:
        return 'bg-[#ECEEFB] dark:bg-[#1C1F33] border-[#DBDEF8] dark:border-[#2D3254] text-[#2D3169] dark:text-[#E8EAFF] hover:border-[#7B7FD4]';
    }
  };

  return (
    <Card variant="simple" className="p-6 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
            Quick Notes
          </h3>
          <button
            onClick={handleViewAll}
            className="text-xs text-[#7B7FD4] hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Notes Preview List */}
        {previewNotes.length === 0 ? (
          <EmptyState
            title="No quick notes yet"
            description="Capture thoughts, reminders, and sudden inspirations."
            actionLabel="New Note"
            onAction={handleAddNote}
            className="py-6 my-2"
          />
        ) : (
          <div className="space-y-2.5">
            {previewNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => handleOpenNote(note.id)}
                className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer shadow-2xs ${getThemeBg(
                  note.colorTheme
                )}`}
              >
                <span className="font-medium truncate max-w-[170px] sm:max-w-[200px]">
                  {note.title || 'Untitled Note'}
                </span>
                <span className="text-[11px] opacity-75 shrink-0 ml-2">
                  {formatRelativeTime(note.updatedAt || note.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Note Button */}
      <button
        onClick={handleAddNote}
        className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#ECEEFB] dark:bg-[#20233B] hover:bg-[#DCE0F9] dark:hover:bg-[#272B4B] text-[#4A4E9E] dark:text-[#C7C9F5] text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.99]"
      >
        <Plus className="w-4 h-4" />
        <span>New Note</span>
      </button>
    </Card>
  );
};
