import React, { memo } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Columns2,
  Eye,
  Edit3,
} from 'lucide-react';
import { sound } from '../../lib/sound';

export type EditorViewMode = 'edit' | 'split' | 'preview';

interface NoteToolbarProps {
  onFormat: (
    format:
      | 'bold'
      | 'italic'
      | 'strike'
      | 'highlight'
      | 'h1'
      | 'h2'
      | 'h3'
      | 'checklist'
      | 'bullet'
      | 'numbered'
      | 'quote'
      | 'code'
      | 'codeblock'
      | 'divider'
  ) => void;
  viewMode: EditorViewMode;
  onViewModeChange: (mode: EditorViewMode) => void;
}

export const NoteToolbar: React.FC<NoteToolbarProps> = memo(({
  onFormat,
  viewMode,
  onViewModeChange,
}) => {
  const handleAction = (
    format:
      | 'bold'
      | 'italic'
      | 'strike'
      | 'highlight'
      | 'h1'
      | 'h2'
      | 'h3'
      | 'checklist'
      | 'bullet'
      | 'numbered'
      | 'quote'
      | 'code'
      | 'codeblock'
      | 'divider'
  ) => {
    sound.playClick();
    onFormat(format);
  };

  const tools = [
    { id: 'h1', label: 'Heading 1', icon: <Heading1 className="w-3.5 h-3.5" /> },
    { id: 'h2', label: 'Heading 2', icon: <Heading2 className="w-3.5 h-3.5" /> },
    { id: 'h3', label: 'Heading 3', icon: <Heading3 className="w-3.5 h-3.5" /> },
    { id: 'bold', label: 'Bold', icon: <Bold className="w-3.5 h-3.5" /> },
    { id: 'italic', label: 'Italic', icon: <Italic className="w-3.5 h-3.5" /> },
    { id: 'strike', label: 'Strikethrough', icon: <Strikethrough className="w-3.5 h-3.5" /> },
    { id: 'highlight', label: 'Highlight', icon: <Highlighter className="w-3.5 h-3.5" /> },
    { id: 'checklist', label: 'Checklist', icon: <CheckSquare className="w-3.5 h-3.5" /> },
    { id: 'bullet', label: 'Bullet List', icon: <List className="w-3.5 h-3.5" /> },
    { id: 'numbered', label: 'Numbered List', icon: <ListOrdered className="w-3.5 h-3.5" /> },
    { id: 'quote', label: 'Quote', icon: <Quote className="w-3.5 h-3.5" /> },
    { id: 'codeblock', label: 'Code Block', icon: <Code className="w-3.5 h-3.5" /> },
    { id: 'divider', label: 'Divider', icon: <Minus className="w-3.5 h-3.5" /> },
  ] as const;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-[#FAFBF9] dark:bg-[#161B1D] rounded-xl border border-[#EEF0EC] dark:border-[#273033] select-none">
      {/* Formatting Action Icons */}
      <div className="flex flex-wrap items-center gap-0.5">
        {tools.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => handleAction(t.id)}
            title={t.label}
            className="p-1.5 rounded-lg text-[#4F5D75] dark:text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white hover:bg-white dark:hover:bg-[#202528] hover:shadow-2xs transition-all cursor-pointer"
          >
            {t.icon}
          </button>
        ))}
      </div>

      {/* View Mode Switcher (Edit / Split / Preview) */}
      <div className="flex items-center gap-1 bg-white dark:bg-[#202528] p-0.5 rounded-lg border border-[#EEF0EC] dark:border-[#273033]">
        <button
          type="button"
          onClick={() => onViewModeChange('edit')}
          title="Editor Only"
          className={`p-1 rounded-md transition-all cursor-pointer ${
            viewMode === 'edit'
              ? 'bg-[#6BAA7A] text-white shadow-2xs'
              : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937]'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange('split')}
          title="Side-by-Side Live Preview"
          className={`p-1 rounded-md transition-all cursor-pointer ${
            viewMode === 'split'
              ? 'bg-[#6BAA7A] text-white shadow-2xs'
              : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937]'
          }`}
        >
          <Columns2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange('preview')}
          title="Rendered Preview Only"
          className={`p-1 rounded-md transition-all cursor-pointer ${
            viewMode === 'preview'
              ? 'bg-[#6BAA7A] text-white shadow-2xs'
              : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937]'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
});

NoteToolbar.displayName = 'NoteToolbar';
