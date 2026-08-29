import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeNoteModal } from '../../store/slices/uiSlice';
import { addNote } from '../../store/slices/notesSlice';
import type { NoteColor } from '../../types/note.types';

export const QuickNoteModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isNoteModalOpen);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [colorTheme, setColorTheme] = useState<NoteColor>('lavender');

  const colors: { id: NoteColor; label: string; bgClass: string }[] = [
    { id: 'lavender', label: 'Lavender', bgClass: 'bg-[#C7C9F5]' },
    { id: 'sand', label: 'Warm Sand', bgClass: 'bg-[#F2E8D5]' },
    { id: 'sage', label: 'Sage Green', bgClass: 'bg-[#A7CFAF]' },
    { id: 'rose', label: 'Soft Rose', bgClass: 'bg-[#F8B4B4]' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !title.trim()) return;

    dispatch(
      addNote({
        title: title.trim(),
        content: content.trim(),
        colorTheme,
      })
    );

    setTitle('');
    setContent('');
    dispatch(closeNoteModal());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeNoteModal())}
      title="Create Quick Note"
      subtitle="Capture thoughts, study reminders, or ideas instantly."
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title (Optional)"
          placeholder="e.g. Remember to revise OS Unit 4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />

        <div>
          <label className="block text-xs font-medium text-[#4F5D75] dark:text-[#9CA3AF] mb-1.5">
            Note Content
          </label>
          <textarea
            rows={3}
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required={!title}
            className="w-full bg-white dark:bg-[#1A1F21] text-[#1F2937] dark:text-[#F3F4F6] placeholder-[#9CA3AF] text-sm rounded-xl border border-[#E5E7EB] dark:border-[#2E373A] focus:border-[#6BAA7A] focus:ring-2 focus:ring-[#6BAA7A]/20 p-3 outline-none transition-all resize-none shadow-xs"
          />
        </div>

        {/* Color Palette Selector */}
        <div>
          <label className="block text-xs font-medium text-[#4F5D75] dark:text-[#9CA3AF] mb-1.5">
            Card Pastel Color
          </label>
          <div className="flex items-center gap-3">
            {colors.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColorTheme(c.id)}
                className={`w-7 h-7 rounded-full ${c.bgClass} transition-all cursor-pointer ${
                  colorTheme === c.id
                    ? 'ring-2 ring-offset-2 ring-[#6BAA7A] scale-110'
                    : 'hover:scale-105 opacity-80'
                }`}
                title={c.label}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-[#EEF0EC] dark:border-[#273033]">
          <Button
            type="button"
            variant="outline"
            onClick={() => dispatch(closeNoteModal())}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Note
          </Button>
        </div>
      </form>
    </Modal>
  );
};
